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
  channels: { id: string; channelId: string; providerId: number; lang: string; name: string; url: string }[];
}

// ── Slug Generators ──────────────────────────────────────────

export function toSlug(event: MatchEvent): string {
  const desc = `${event.league} ${event.teams}`
    .toLowerCase().trim().replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  return `${event.id}-${desc}`;
}

export function leagueSlug(league: string): string {
  return league.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function teamSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
  'Laliga': '🇪🇸', 'Laliga 2': '🇪🇸', 'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Serie A': '🇮🇹', 'Bundesliga': '🇩🇪', 'Ligue 1': '🇫🇷',
  'Liga Mx': '🇲🇽', 'Torneo LPF': '🇦🇷', 'Copa Libertadores': '🌎',
  'Champions League': '🇪🇺', 'Liga Betplay Dimayor': '🇨🇴',
  'Ecuador Ligapro': '🇪🇨', 'NBA': '🏀', 'NHL': '🏒', 'NFL': '🏈', 'MLB': '⚾',
};

// ── ISO Date Helper ──────────────────────────────────────────

export function toISODate(dateStr: string): string {
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
}

// ── Schema Builders ──────────────────────────────────────────

const SITE = 'https://rojadirectaenvivo.top';

export function buildSportsEventSchema(event: MatchEvent) {
  const teamNames = (event.teams || '').split(/\s*-\s*/);
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
    "organizer": { "@type": "Organization", "name": event.league },
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
