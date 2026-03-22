import { writeFileSync, mkdirSync } from 'fs';

const JSON_URL = 'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/rereyano_data.json';
const OUTPUT_JSON = './src/data/matches.json';

async function main() {
  console.log('📥 Fetching match data from rereyano...');
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch JSON: ${res.status}`);
  const raw = await res.json();

  mkdirSync('./src/data', { recursive: true });

  // Transform events into our normalized format
  const events = (raw.events || []).map((ev, index) => ({
    id: index + 1,
    league: ev.league || '',
    teams: ev.teams || '',
    time: ev.time || '',
    date: ev.date || '',
    datetime: ev.datetime || '',
    channels: (ev.channels || []).map(ch => ({
      id: ch.id,
      lang: ch.lang || 'es',
      name: `CH${ch.id}`,
      url: `https://cartelive.club/player/${ch.id}/1`,
    })),
  }));

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
