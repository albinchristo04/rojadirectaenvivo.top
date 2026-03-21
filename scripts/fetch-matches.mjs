import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const JSON_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json';
const FLAGS_BASE = 'https://pltvhd.com';
const OUTPUT_JSON = './src/data/matches.json';
const FLAGS_DIR = './public/flags';

async function main() {
  // 1. Fetch JSON
  console.log('📥 Fetching match data...');
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch JSON: ${res.status}`);
  const data = await res.json();

  // 2. Download flag images
  mkdirSync(FLAGS_DIR, { recursive: true });
  mkdirSync('./src/data', { recursive: true });

  const flagsDownloaded = [];

  for (const event of data.data) {
    const imageData = event.attributes?.country?.data?.attributes?.image?.data?.attributes;
    if (imageData?.url) {
      const filename = imageData.url.split('/').pop();
      const localPath = join(FLAGS_DIR, filename);

      if (!existsSync(localPath)) {
        try {
          const imgRes = await fetch(FLAGS_BASE + imageData.url);
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            writeFileSync(localPath, Buffer.from(buffer));
            flagsDownloaded.push(filename);
          } else {
            console.warn(`⚠️ Failed to download flag: ${imageData.url} (${imgRes.status})`);
          }
        } catch (err) {
          console.warn(`⚠️ Error downloading flag: ${imageData.url}`, err.message);
        }
      }

      // Rewrite URL to local path
      imageData.url = `/flags/${filename}`;
    }
  }

  // 3. Write processed JSON
  writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));
  console.log(`✅ Fetched ${data.data.length} matches. Data written to ${OUTPUT_JSON}`);
  if (flagsDownloaded.length > 0) {
    console.log(`🏳️ Downloaded ${flagsDownloaded.length} new flag images.`);
  }
}

main().catch(console.error);
