/**
 * SEO utility functions — single source of truth for slug generation and schema builders.
 */

export interface MatchEvent {
  id: number;
  league: string;
  teams: string;
  time: string;
  date: string;
  datetime?: string;
  title?: string;
  sourceDay?: string;
  channels: { id: string; channelId: string; providerId: number; lang: string; name: string; url: string }[];
}

// ── Slug Generators ──────────────────────────────────────────

export function slugify(value: string): string {
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

export function toSlug(event: MatchEvent): string {
  return `${event.id}-${slugify(`${event.league} ${event.teams}`)}`;
}

export function leagueSlug(league: string): string {
  return slugify(league);
}

export function teamSlug(name: string): string {
  return slugify(name);
}

// ── Sport Detection ──────────────────────────────────────────

export function detectSport(league: string): string {
  if (/nba|basketball|baloncesto|liga endesa/i.test(league)) return 'Basketball';
  if (/nhl|hockey/i.test(league)) return 'Ice Hockey';
  if (/nfl|football americano/i.test(league)) return 'American Football';
  if (/mlb|baseball|béisbol/i.test(league)) return 'Baseball';
  return 'Soccer';
}

export function detectSportEs(league: string): string {
  if (/nba|basketball|baloncesto|liga endesa/i.test(league)) return 'baloncesto';
  if (/nhl|hockey/i.test(league)) return 'hockey sobre hielo';
  if (/nfl|football americano/i.test(league)) return 'football americano';
  if (/mlb|baseball|béisbol/i.test(league)) return 'béisbol';
  return 'fútbol';
}

// ── League Flags ─────────────────────────────────────────────

export const leagueFlags: Record<string, string> = {
  'LaLiga': '🇪🇸',
  'Laliga': '🇪🇸',
  'Laliga 2': '🇪🇸',
  'Premier League': '🏴',
  'Serie A': '🇮🇹',
  'Bundesliga': '🇩🇪',
  'Ligue 1': '🇫🇷',
  'Liga MX': '🇲🇽',
  'Liga Mx': '🇲🇽',
  'Liga Profesional Argentina': '🇦🇷',
  'Torneo LPF': '🇦🇷',
  'Brasileirao': '🇧🇷',
  'Liga Betplay Dimayor': '🇨🇴',
  'LigaPro Ecuador': '🇪🇨',
  'Ecuador Ligapro': '🇪🇨',
  'Primera Division Chile': '🇨🇱',
  'Liga AUF Uruguay': '🇺🇾',
  'Liga AUF Uruguaya': '🇺🇾',
  'MLS': '🇺🇸',
  'Copa Libertadores': '🌎',
  'Copa Sudamericana': '🌎',
  'Champions League': '🇪🇺',
  'Selecciones Juveniles': '🧒',
  'Futbol Internacional': '🌍',
  'NBA': '🏀',
  'NHL': '🏒',
  'NFL': '🏈',
  'MLB': '⚾',
};

// ── ISO Date Helper ──────────────────────────────────────────

export function toISODate(dateStr: string): string {
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
}

// ── Schema Builders ──────────────────────────────────────────

const SITE = 'https://rojadirectaenvivo.top';

function extractTeamNames(teams: string): string[] {
  const normalized = String(teams || '')
    .replace(/\s+(?:x|@)\s+/ig, ' vs ')
    .replace(/\s+-\s+/g, ' vs ');
  const parts = normalized.split(/\s+vs\.?\s+/i).map(part => part.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : [teams || 'Equipo A', 'Equipo B'];
}

export function buildSportsEventSchema(event: MatchEvent) {
  const teamNames = extractTeamNames(event.teams);
  const teamA = teamNames[0]?.trim() || 'Equipo A';
  const teamB = teamNames[1]?.trim() || 'Equipo B';
  const isoDate = toISODate(event.date);
  const sport = detectSport(event.league);

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${teamA} vs ${teamB}`,
    "startDate": `${isoDate}T${event.time}:00-03:00`,
    "sport": sport,
    "homeTeam": {
      "@type": "SportsTeam",
      "name": teamA,
      "url": `${SITE}/equipo/${teamSlug(teamA)}/`,
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": teamB,
      "url": `${SITE}/equipo/${teamSlug(teamB)}/`,
    },
    "location": { "@type": "Place", "name": "Transmisión en Vivo" },
    "organizer": { "@type": "Organization", "name": event.league || 'Rojadirecta en Vivo' },
    "url": `${SITE}/partido/${toSlug(event)}/`,
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
