/**
 * Match data helpers — typed access to matches.json data.
 */
import matchDataRaw from '../data/matches.json';
import type { MatchEvent } from './seo';

export function getMatches(): MatchEvent[] {
  return (matchDataRaw as any).events || [];
}

export function getMatchesByLeague(league: string): MatchEvent[] {
  return getMatches().filter(e => e.league === league);
}

export function getMatchesByTeam(team: string): MatchEvent[] {
  return getMatches().filter(e => {
    const teams = (e.teams || '').split(/\s*-\s*/);
    return teams.some(t => t.trim().toLowerCase() === team.toLowerCase());
  });
}

export function getUniqueLeagues(): string[] {
  return [...new Set(getMatches().map(e => e.league).filter(Boolean))];
}

export function getUniqueTeams(): string[] {
  const teams = new Set<string>();
  for (const e of getMatches()) {
    const parts = (e.teams || '').split(/\s*-\s*/);
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
  return groups;
}
