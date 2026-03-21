import { readFileSync } from 'fs';

const KEY = process.env.INDEXNOW_KEY;
const SITE = 'https://rojadirectaenvivo.top';

if (!KEY) {
  console.warn('⚠️ INDEXNOW_KEY not set. Skipping IndexNow ping.');
  process.exit(0);
}

function toSlug(event) {
  const desc = (event.attributes.diary_description || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${event.id}-${desc}`;
}

async function main() {
  let matches;
  try {
    matches = JSON.parse(readFileSync('./src/data/matches.json', 'utf8'));
  } catch {
    console.warn('⚠️ No matches.json found. Skipping IndexNow ping.');
    process.exit(0);
  }

  const urls = [
    `${SITE}/`,
    `${SITE}/rojadirecta-en-vivo/`,
    `${SITE}/tarjeta-roja/`,
    `${SITE}/pirlo-tv/`,
    ...matches.data.map(e => `${SITE}/partido/${toSlug(e)}/`),
  ];

  console.log(`📤 Submitting ${urls.length} URLs to Bing IndexNow...`);

  try {
    const res = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'rojadirectaenvivo.top',
        key: KEY,
        keyLocation: `${SITE}/${KEY}.txt`,
        urlList: urls,
      }),
    });

    console.log(`✅ IndexNow response: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error('❌ IndexNow ping failed:', err.message);
  }
}

main();
