/**
 * Match data helpers — typed access to matches.json data.
 */
import matchDataRaw from '../data/matches.json';
import type { MatchEvent } from './seo';

export const FEATURED_LEAGUE_ORDER = [
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

function toTimestamp(event: MatchEvent): number {
  const dateParts = String(event.date || '').split('-');
  if (dateParts.length !== 3) return Number.MAX_SAFE_INTEGER;

  const [day, month, year] = dateParts;
  const time = String(event.time || '00:00').padStart(5, '0');
  const iso = `${year}-${month}-${day}T${time}:00-03:00`;
  const value = new Date(iso).getTime();
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

export function compareMatchesChronologically(a: MatchEvent, b: MatchEvent): number {
  return toTimestamp(a) - toTimestamp(b);
}

export function sortMatchesChronologically(matches: MatchEvent[]): MatchEvent[] {
  return [...matches].sort(compareMatchesChronologically);
}

export function splitTeams(teams: string): string[] {
  const normalized = String(teams || '')
    .replace(/\s+(?:x|@)\s+/ig, ' vs ')
    .replace(/\s+-\s+/g, ' vs ');
  return normalized.split(/\s+vs\.?\s+/i).map(team => team.trim()).filter(Boolean);
}

export function sortLeagueNames(leagues: string[]): string[] {
  const unique = [...new Set(leagues.filter(Boolean))];
  return unique.sort((a, b) => {
    const aIndex = FEATURED_LEAGUE_ORDER.indexOf(a);
    const bIndex = FEATURED_LEAGUE_ORDER.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b, 'es');
  });
}

export function getMatches(): MatchEvent[] {
  return sortMatchesChronologically((matchDataRaw as any).events || []);
}

export function getMatchesByLeague(league: string): MatchEvent[] {
  return sortMatchesChronologically(getMatches().filter(e => e.league === league));
}

export function getMatchesByTeam(team: string): MatchEvent[] {
  const normalizedTeam = team.trim().toLowerCase();
  return sortMatchesChronologically(getMatches().filter(e => {
    const teams = splitTeams(e.teams);
    return teams.some(t => t.toLowerCase() === normalizedTeam);
  }));
}

export function getUniqueLeagues(): string[] {
  return sortLeagueNames(getMatches().map(e => e.league));
}

export function getUniqueTeams(): string[] {
  const teams = new Set<string>();
  for (const e of getMatches()) {
    const parts = splitTeams(e.teams);
    for (const t of parts) {
      const name = t.trim();
      if (name) teams.add(name);
    }
  }
  return [...teams];
}

/** Group matches by league name */
export function groupByLeague(): Record<string, MatchEvent[]> {
  const groups: Record<string, MatchEvent[]> = {};
  for (const event of getMatches()) {
    const key = event.league || 'Otros';
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  }

  const orderedGroups: Record<string, MatchEvent[]> = {};
  for (const league of sortLeagueNames(Object.keys(groups))) {
    orderedGroups[league] = sortMatchesChronologically(groups[league]);
  }

  return orderedGroups;
}
