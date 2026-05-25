import { readFileSync } from 'fs';

const KEY = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
const SITE = 'https://rojadirectaenvivo.top';
const FEATURED_LEAGUES = [
  'Liga MX',
  'Liga Profesional Argentina',
  'Brasileirao',
  'Liga Betplay Dimayor',
  'LigaPro Ecuador',
  'Primera Division Chile',
  'Liga AUF Uruguay',
  'MLS',
  'Copa Libertadores',
  'Copa Sudamericana',
  'LaLiga',
  'Premier League',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Champions League',
  'Selecciones Juveniles',
  'NBA',
  'NHL',
  'Futbol Internacional',
];

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function splitTeams(teams) {
  return String(teams || '')
    .replace(/\s+(?:x|@)\s+/gi, ' vs ')
    .replace(/\s+-\s+/g, ' vs ')
    .split(/\s+vs\.?\s+/i)
    .map((team) => team.trim())
    .filter(Boolean);
}

function toSlug(event) {
  return `${event.id}-${slugify(`${event.league} ${event.teams}`)}`;
}

function leagueSlug(league) {
  return slugify(league);
}

function teamSlug(team) {
  return slugify(team);
}

async function main() {
  let matches;

  try {
    matches = JSON.parse(readFileSync('./src/data/matches.json', 'utf8'));
  } catch {
    console.warn('⚠️ No matches.json found. Skipping IndexNow ping.');
    process.exit(0);
  }

  const matchList = matches.events || [];

  if (matchList.length === 0) {
    console.warn('⚠️ No matches found in matches.json. Skipping IndexNow ping.');
    process.exit(0);
  }

  const staticUrls = [
    `${SITE}/`,
    `${SITE}/hoy/`,
    `${SITE}/partidos-de-hoy/`,
    `${SITE}/rojadirecta-en-vivo/`,
    `${SITE}/tarjeta-roja/`,
    `${SITE}/pirlo-tv/`,
    `${SITE}/futbol-libre/`,
    `${SITE}/futbol-en-vivo/`,
    `${SITE}/futbol-en-vivo-gratis/`,
    `${SITE}/ver-futbol/`,
  ];

  const activeLeagues = new Set(FEATURED_LEAGUES);
  for (const event of matchList) {
    if (event.league) activeLeagues.add(event.league);
  }

  const leagueUrls = [...activeLeagues].map((league) => `${SITE}/liga/${leagueSlug(league)}/`);

  const teamUrls = [...new Set(matchList.flatMap((event) => splitTeams(event.teams).map((team) => `${SITE}/equipo/${teamSlug(team)}/`)))];
  const matchUrls = matchList.map((event) => `${SITE}/partido/${toSlug(event)}/`);

  const urls = [...new Set([
    ...staticUrls,
    ...leagueUrls,
    ...teamUrls,
    ...matchUrls,
  ])];

  if (urls.length === 0) {
    console.warn('⚠️ URL list is empty. Skipping IndexNow ping.');
    process.exit(0);
  }

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

    if (!res.ok) {
      const responseText = await res.text().catch(() => '');

      if (res.status === 429) {
        console.warn(`⚠️ IndexNow rate limited: ${res.status} ${res.statusText}`);
      } else {
        console.error(`❌ IndexNow response: ${res.status} ${res.statusText}`);
      }

      if (responseText) {
        console.warn(responseText.slice(0, 300));
      }

      return;
    }

    console.log(`✅ IndexNow response: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error('❌ IndexNow ping failed:', err.message);
  }
}

main();
