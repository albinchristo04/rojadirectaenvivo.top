import { writeFileSync, mkdirSync } from 'fs';

const JSON_URL = 'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/rereyano_data.json';
const OUTPUT_JSON = './src/data/matches.json';

async function main() {
  console.log('📥 Fetching match data from rereyano...');
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch JSON: ${res.status}`);
  const raw = await res.json();

  mkdirSync('./src/data', { recursive: true });

  // Provider IDs for cartelive player (multiple mirrors)
  const PROVIDERS = [1, 2, 3, 4];

  // Transform events into our normalized format
  // URL format: /player/{providerId}/{channelId}
  const events = (raw.events || []).map((ev, index) => {
    const channels = [];
    for (const ch of (ev.channels || [])) {
      for (const providerId of PROVIDERS) {
        channels.push({
          id: `${ch.id}_p${providerId}`,
          channelId: ch.id,
          providerId,
          lang: ch.lang || 'es',
          name: providerId === 1 ? `CH${ch.id}` : `CH${ch.id} P${providerId}`,
          url: `https://cartelive.club/player/${providerId}/${ch.id}`,
        });
      }
    }
    return {
      id: index + 1,
      league: ev.league || '',
      teams: ev.teams || '',
      time: ev.time || '',
      date: ev.date || '',
      datetime: ev.datetime || '',
      channels,
    };
  });

  // Extract player_streams for global players
  const playerStreams = raw.player_streams || {};

  const output = {
    lastUpdated: raw.last_updated || new Date().toISOString(),
    totalEvents: events.length,
    events,
    playerStreams,
  };

  writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(`✅ Fetched ${events.length} events. Data written to ${OUTPUT_JSON}`);
}

main().catch(console.error);
