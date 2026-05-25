import { writeFileSync, mkdirSync } from 'fs';

const JSON_URL = 'https://sportsonline.ppvtv.top/api/matches.json';
const OUTPUT_JSON = './src/data/matches.json';

const WEEKDAY_INDEX = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const HUB_RULES = [
  {
    name: 'Copa Libertadores',
    patterns: [/libertadores/i],
  },
  {
    name: 'Copa Sudamericana',
    patterns: [/sudamericana/i],
  },
  {
    name: 'Liga MX',
    patterns: [
      /pumas/i,
      /cruz azul/i,
      /america(?! de cali)/i,
      /chivas/i,
      /guadalajara/i,
      /tigres/i,
      /monterrey/i,
      /toluca/i,
      /club leon/i,
      /santos laguna/i,
      /necaxa/i,
      /pachuca/i,
      /atlas/i,
      /queretaro/i,
      /juarez/i,
      /tijuana/i,
      /mazatlan/i,
      /san luis/i,
    ],
  },
  {
    name: 'Liga Profesional Argentina',
    patterns: [
      /river plate/i,
      /boca juniors/i,
      /racing/i,
      /independiente/i,
      /san lorenzo/i,
      /velez/i,
      /newell/i,
      /rosario central/i,
      /estudiantes/i,
      /gimnasia/i,
      /huracan/i,
      /lanus/i,
      /talleres/i,
      /belgrano/i,
      /banfield/i,
      /argentinos juniors/i,
      /platense/i,
      /sarmiento/i,
    ],
  },
  {
    name: 'Brasileirao',
    patterns: [
      /sao paulo/i,
      /santos/i,
      /coritiba/i,
      /bahia/i,
      /botafogo/i,
      /athletico/i,
      /athletic club/i,
      /palmeiras/i,
      /flamengo/i,
      /corinthians/i,
      /vasco/i,
      /gremio/i,
      /internacional/i,
      /fluminense/i,
      /cruzeiro/i,
      /fortaleza/i,
      /bragantino/i,
      /sport recife/i,
      /ceara/i,
      /botafogo-sp/i,
    ],
  },
  {
    name: 'Liga Betplay Dimayor',
    patterns: [
      /atletico nacional/i,
      /millonarios/i,
      /america de cali/i,
      /santa fe/i,
      /deportivo cali/i,
      /junior/i,
      /medellin/i,
      /once caldas/i,
      /tolima/i,
      /alianza/i,
      /equidad/i,
      /bucaramanga/i,
    ],
  },
  {
    name: 'Primera Division Chile',
    patterns: [
      /copiapo/i,
      /union espanola/i,
      /colo colo/i,
      /universidad de chile/i,
      /universidad catolica/i,
      /cobresal/i,
      /nublense/i,
      /huachipato/i,
      /o'higgins/i,
      /palestino/i,
      /everton de vina/i,
    ],
  },
  {
    name: 'LigaPro Ecuador',
    patterns: [
      /barcelona sc/i,
      /liga de quito/i,
      /independiente del valle/i,
      /emelec/i,
      /el nacional/i,
      /aucas/i,
      /orense/i,
      /delfin/i,
      /tecnico universitario/i,
      /deportivo cuenca/i,
    ],
  },
  {
    name: 'Liga AUF Uruguay',
    patterns: [
      /penarol/i,
      /nacional/i,
      /defensor/i,
      /danubio/i,
      /wanderers/i,
      /cerro/i,
      /rentistas/i,
      /liverpool montevideo/i,
    ],
  },
  {
    name: 'MLS',
    patterns: [
      /los angeles fc/i,
      /seattle sounders/i,
      /inter miami/i,
      /la galaxy/i,
      /new york city/i,
      /atlanta united/i,
      /portland timbers/i,
      /columbus crew/i,
      /fc cincinnati/i,
      /orlando city/i,
      /toronto fc/i,
      /vancouver whitecaps/i,
    ],
  },
  {
    name: 'LaLiga',
    patterns: [
      /real madrid/i,
      /barcelona/i,
      /atletico madrid/i,
      /athletic club/i,
      /real sociedad/i,
      /sevilla/i,
      /betis/i,
      /valencia/i,
      /villarreal/i,
      /osasuna/i,
      /celta/i,
      /girona/i,
      /mallorca/i,
    ],
  },
  {
    name: 'Premier League',
    patterns: [
      /arsenal/i,
      /chelsea/i,
      /liverpool/i,
      /manchester city/i,
      /manchester united/i,
      /tottenham/i,
      /newcastle/i,
      /aston villa/i,
      /west ham/i,
      /brighton/i,
      /wolves/i,
      /everton/i,
      /nottingham forest/i,
    ],
  },
  {
    name: 'Serie A',
    patterns: [
      /juventus/i,
      /inter/i,
      /milan/i,
      /napoli/i,
      /roma/i,
      /lazio/i,
      /atalanta/i,
      /fiorentina/i,
      /bologna/i,
      /torino/i,
      /udinese/i,
    ],
  },
  {
    name: 'Bundesliga',
    patterns: [
      /bayern/i,
      /dortmund/i,
      /leverkusen/i,
      /rb leipzig/i,
      /eintracht/i,
      /wolfsburg/i,
      /paderborn/i,
      /gladbach/i,
      /stuttgart/i,
      /werder/i,
      /union berlin/i,
      /hoffenheim/i,
    ],
  },
  {
    name: 'Ligue 1',
    patterns: [
      /psg/i,
      /paris saint-germain/i,
      /marseille/i,
      /lyon/i,
      /monaco/i,
      /lille/i,
      /nice/i,
      /lens/i,
      /rennes/i,
      /nantes/i,
    ],
  },
  {
    name: 'Champions League',
    patterns: [/champions/i],
  },
  {
    name: 'NBA',
    patterns: [/\bnba\b/i],
  },
  {
    name: 'NHL',
    patterns: [/\bnhl\b/i],
  },
  {
    name: 'Selecciones Juveniles',
    patterns: [/\bu17\b/i, /\bu20\b/i, /\bu23\b/i],
  },
];

function normalizeForMatch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s:@/-]+/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function repairText(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();

  if (!/[ÃÅÂ]/.test(text)) {
    return text;
  }

  try {
    const repaired = Buffer.from(text, 'latin1').toString('utf8').replace(/\s+/g, ' ').trim();
    return repaired || text;
  } catch {
    return text;
  }
}

function cleanText(value) {
  return repairText(value);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDate(date) {
  return `${pad(date.getUTCDate())}-${pad(date.getUTCMonth() + 1)}-${date.getUTCFullYear()}`;
}

function nearestWeekdayDate(dayLabel, referenceIso) {
  const weekday = WEEKDAY_INDEX[String(dayLabel || '').toUpperCase()];
  const reference = referenceIso ? new Date(referenceIso) : new Date();
  reference.setUTCHours(12, 0, 0, 0);

  if (weekday === undefined || Number.isNaN(reference.getTime())) {
    return reference;
  }

  let bestDate = new Date(reference);
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let delta = -6; delta <= 6; delta += 1) {
    const candidate = new Date(reference);
    candidate.setUTCDate(candidate.getUTCDate() + delta);
    if (candidate.getUTCDay() !== weekday) continue;

    const distance = Math.abs(delta);
    if (distance < bestDistance) {
      bestDate = candidate;
      bestDistance = distance;
    }
  }

  return bestDate;
}

function parseTeams(rawTitle) {
  const cleanTitle = cleanText(rawTitle);
  const withoutPrefix = cleanTitle.replace(/^[A-Z0-9 .&+-]+:\s*/i, '');
  const parts = withoutPrefix.split(/\s+(?:x|vs\.?|@)\s+/i).map(part => cleanText(part));

  if (parts.length >= 2) {
    return `${parts[0]} vs ${parts[1]}`;
  }

  return cleanTitle;
}

function inferHub(rawTitle) {
  const title = normalizeForMatch(rawTitle);

  for (const rule of HUB_RULES) {
    if (rule.patterns.some(pattern => pattern.test(title))) {
      return rule.name;
    }
  }

  if (/women|\bw\b/i.test(rawTitle) && /sao paulo|santos|palmeiras|corinthians/i.test(title)) {
    return 'Brasileirao';
  }

  return 'Futbol Internacional';
}

function mapChannelLang(label) {
  const upper = String(label || '').toUpperCase();
  if (upper.includes('ES') || upper.includes('AR')) return 'es';
  if (upper.includes('PT') || upper.includes('BR')) return 'pt';
  if (upper.includes('FR')) return 'fr';
  if (upper.includes('DE')) return 'de';
  if (upper.includes('NL')) return 'nl';
  if (upper.includes('IT')) return 'it';
  return 'en';
}

function toChannelName(label, index) {
  const cleanLabel = cleanText(label);
  return cleanLabel || `CANAL ${index + 1}`;
}

async function main() {
  console.log('📥 Fetching match data from PPVTV...');
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch JSON: ${res.status}`);
  const raw = await res.json();

  mkdirSync('./src/data', { recursive: true });

  const sourceMatches = Array.isArray(raw.matches) ? raw.matches : [];
  const generatedAt = raw.generated || new Date().toISOString();

  const events = sourceMatches.map((match, index) => {
    const scheduledDate = nearestWeekdayDate(match.day, generatedAt);
    const date = formatDate(scheduledDate);
    const time = cleanText(match.time || '00:00');
    const teams = parseTeams(match.title);
    const league = inferHub(match.title);
    const channels = (match.channels || [])
      .filter(channel => channel && channel.available !== false)
      .map((channel, channelIndex) => ({
        id: `${match.day || 'DAY'}-${match.index ?? index}-${channelIndex}`,
        channelId: String(channelIndex + 1),
        providerId: channelIndex + 1,
        lang: mapChannelLang(channel.label),
        name: toChannelName(channel.label, channelIndex),
        url: channel.stable_url || channel.embed_url || match.embed_url || '',
      }))
      .filter(channel => channel.url);

    return {
      id: index + 1,
      league,
      teams,
      title: cleanText(match.title),
      time,
      date,
      datetime: `${scheduledDate.getUTCFullYear()}-${pad(scheduledDate.getUTCMonth() + 1)}-${pad(scheduledDate.getUTCDate())}T${time || '00:00'}:00-03:00`,
      sourceDay: cleanText(match.day),
      channels,
    };
  });

  const output = {
    sourceUrl: JSON_URL,
    lastUpdated: generatedAt,
    totalEvents: events.length,
    events,
  };

  writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(`✅ Fetched ${events.length} events. Data written to ${OUTPUT_JSON}`);
}

main().catch(console.error);
