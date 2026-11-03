/**
 * GSPL Cricket Net Run Rate (NRR) and Points Table Rules Engine
 * 
 * Strict compliance with ICC / GSPL Limited Overs & Box Cricket standard:
 * - Legal-ball precision: never treat overs as decimal floats (e.g. 8.2 ov = 50 legal balls, not 8.2)
 * - NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
 * - Always computed from tournament aggregates across all completed matches, NEVER averaged per-match.
 * - All-out rule: If a team is dismissed (all out) before completing their allocated overs,
 *   the full quota of allocated overs is credited as overs faced for that innings.
 * - Super overs are excluded from regular innings aggregate NRR calculations.
 * - Abandoned / No Result matches: Points awarded per competition rules, but zero balls/runs added to NRR.
 */

export interface InningsScoreRecord {
  teamId: string;
  runs: number;
  wickets: number;
  legalBallsBowled: number; // e.g. 36 balls = 6.0 overs
  allocatedOvers: number;   // e.g. 6 overs
  isAllOut: boolean;
}

export interface MatchResultRecord {
  matchId: string;
  isCompleted: boolean;
  isAbandoned: boolean;
  isNoResult: boolean;
  isTied: boolean;
  winnerTeamId?: string | null;
  innings1?: InningsScoreRecord;
  innings2?: InningsScoreRecord;
}

export interface TeamStandingsRow {
  teamId: string;
  teamName: string;
  teamCode: string;
  logoUrl?: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  runsScored: number;
  legalBallsFaced: number;
  oversFacedDisplay: string;
  runsConceded: number;
  legalBallsBowled: number;
  oversBowledDisplay: string;
  nrr: number; // Decimal formatted to 3 decimal places e.g. +1.250 or -0.840
  form: ('W' | 'L' | 'T' | 'NR')[];
}

export interface PointsSystemConfig {
  winPoints: number;
  tiePoints: number;
  noResultPoints: number;
  lossPoints: number;
  allOutRuleEnabled: boolean; // default true: full allocated overs used if team all out
}

export const DEFAULT_POINTS_CONFIG: PointsSystemConfig = {
  winPoints: 2,
  tiePoints: 1,
  noResultPoints: 1,
  lossPoints: 0,
  allOutRuleEnabled: true,
};

/**
 * Converts overs and balls representation (e.g. 5.4 overs = 5*6 + 4 = 34 balls) to legal balls count.
 */
export function oversToLegalBalls(oversNotation: number | string): number {
  const num = typeof oversNotation === 'string' ? parseFloat(oversNotation) : oversNotation;
  if (isNaN(num) || num <= 0) return 0;
  const completeOvers = Math.floor(num);
  const ballsRemainder = Math.round((num - completeOvers) * 10);
  return completeOvers * 6 + ballsRemainder;
}

/**
 * Formats legal balls into standard cricket notation "O.B" (e.g. 34 balls -> "5.4", 36 balls -> "6.0")
 */
export function legalBallsToOversDisplay(balls: number): string {
  if (!balls || balls <= 0) return '0.0';
  const completeOvers = Math.floor(balls / 6);
  const remainder = balls % 6;
  return `${completeOvers}.${remainder}`;
}

/**
 * Calculates decimal overs for NRR denominator (e.g. 34 balls = 5 + 4/6 = 5.6666667)
 */
export function legalBallsToDecimalOvers(balls: number): number {
  if (!balls || balls <= 0) return 0;
  return balls / 6.0;
}

/**
 * Computes official league table given teams and verified match results
 */
export function calculateLeagueStandings(
  teams: { id: string; name: string; short_code: string; logo_url?: string }[],
  matches: MatchResultRecord[],
  config: PointsSystemConfig = DEFAULT_POINTS_CONFIG
): TeamStandingsRow[] {
  const tableMap = new Map<string, {
    teamId: string;
    teamName: string;
    teamCode: string;
    logoUrl?: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    totalRunsScored: number;
    effectiveBallsFaced: number;
    actualBallsFaced: number;
    totalRunsConceded: number;
    effectiveBallsBowled: number;
    actualBallsBowled: number;
    form: ('W' | 'L' | 'T' | 'NR')[];
  }>();

  // Initialize for all participating teams
  for (const t of teams) {
    tableMap.set(t.id, {
      teamId: t.id,
      teamName: t.name,
      teamCode: t.short_code,
      logoUrl: t.logo_url,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      points: 0,
      totalRunsScored: 0,
      effectiveBallsFaced: 0,
      actualBallsFaced: 0,
      totalRunsConceded: 0,
      effectiveBallsBowled: 0,
      actualBallsBowled: 0,
      form: [],
    });
  }

  // Aggregate verified completed matches only
  for (const m of matches) {
    if (!m.isCompleted) {
      // Unfinished matches must not affect official standings
      continue;
    }

    if (m.isAbandoned || m.isNoResult) {
      // Award configured points to both teams
      if (m.innings1?.teamId && tableMap.has(m.innings1.teamId)) {
        const row = tableMap.get(m.innings1.teamId)!;
        row.played += 1;
        row.noResult += 1;
        row.points += config.noResultPoints;
        row.form.push('NR');
      }
      if (m.innings2?.teamId && tableMap.has(m.innings2.teamId)) {
        const row = tableMap.get(m.innings2.teamId)!;
        row.played += 1;
        row.noResult += 1;
        row.points += config.noResultPoints;
        row.form.push('NR');
      }
      continue;
    }

    const inn1 = m.innings1;
    const inn2 = m.innings2;

    if (!inn1 || !inn2) continue;

    const row1 = tableMap.get(inn1.teamId);
    const row2 = tableMap.get(inn2.teamId);

    if (!row1 || !row2) continue;

    row1.played += 1;
    row2.played += 1;

    // Determine match win/loss/tie
    if (m.isTied || (inn1.runs === inn2.runs && m.winnerTeamId === null)) {
      row1.tied += 1;
      row2.tied += 1;
      row1.points += config.tiePoints;
      row2.points += config.tiePoints;
      row1.form.push('T');
      row2.form.push('T');
    } else if (m.winnerTeamId === inn1.teamId) {
      row1.won += 1;
      row1.points += config.winPoints;
      row1.form.push('W');

      row2.lost += 1;
      row2.points += config.lossPoints;
      row2.form.push('L');
    } else if (m.winnerTeamId === inn2.teamId) {
      row2.won += 1;
      row2.points += config.winPoints;
      row2.form.push('W');

      row1.lost += 1;
      row1.points += config.lossPoints;
      row1.form.push('L');
    }

    // NRR Overs and Runs calculation
    // Innings 1: Team 1 bats, Team 2 bowls
    const inn1BallsFaced = (config.allOutRuleEnabled && inn1.isAllOut)
      ? inn1.allocatedOvers * 6
      : inn1.legalBallsBowled;

    row1.totalRunsScored += inn1.runs;
    row1.effectiveBallsFaced += inn1BallsFaced;
    row1.actualBallsFaced += inn1.legalBallsBowled;

    row2.totalRunsConceded += inn1.runs;
    row2.effectiveBallsBowled += inn1BallsFaced;
    row2.actualBallsBowled += inn1.legalBallsBowled;

    // Innings 2: Team 2 bats, Team 1 bowls
    const inn2BallsFaced = (config.allOutRuleEnabled && inn2.isAllOut)
      ? inn2.allocatedOvers * 6
      : inn2.legalBallsBowled;

    row2.totalRunsScored += inn2.runs;
    row2.effectiveBallsFaced += inn2BallsFaced;
    row2.actualBallsFaced += inn2.legalBallsBowled;

    row1.totalRunsConceded += inn2.runs;
    row1.effectiveBallsBowled += inn2BallsFaced;
    row1.actualBallsBowled += inn2.legalBallsBowled;
  }

  // Calculate final NRR & construct rows
  const result: TeamStandingsRow[] = [];

  for (const entry of tableMap.values()) {
    const oversFacedDecimal = legalBallsToDecimalOvers(entry.effectiveBallsFaced);
    const oversBowledDecimal = legalBallsToDecimalOvers(entry.effectiveBallsBowled);

    const forRate = oversFacedDecimal > 0 ? entry.totalRunsScored / oversFacedDecimal : 0;
    const againstRate = oversBowledDecimal > 0 ? entry.totalRunsConceded / oversBowledDecimal : 0;

    const nrr = Number((forRate - againstRate).toFixed(3));

    result.push({
      teamId: entry.teamId,
      teamName: entry.teamName,
      teamCode: entry.teamCode,
      logoUrl: entry.logoUrl,
      played: entry.played,
      won: entry.won,
      lost: entry.lost,
      tied: entry.tied,
      noResult: entry.noResult,
      points: entry.points,
      runsScored: entry.totalRunsScored,
      legalBallsFaced: entry.actualBallsFaced,
      oversFacedDisplay: legalBallsToOversDisplay(entry.actualBallsFaced),
      runsConceded: entry.totalRunsConceded,
      legalBallsBowled: entry.actualBallsBowled,
      oversBowledDisplay: legalBallsToOversDisplay(entry.actualBallsBowled),
      nrr,
      form: entry.form.slice(-5), // Last 5 match results
    });
  }

  // Sort: 1. Points descending, 2. NRR descending, 3. Total wins descending, 4. Runs scored descending
  result.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    if (b.won !== a.won) return b.won - a.won;
    return b.runsScored - a.runsScored;
  });

  return result;
}

