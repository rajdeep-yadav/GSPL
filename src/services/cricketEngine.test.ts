import { describe, it, expect } from 'vitest';
import { 
  oversToLegalBalls, 
  legalBallsToOversDisplay, 
  legalBallsToDecimalOvers,
  calculateLeagueStandings,
  PointsSystemConfig,
  DEFAULT_POINTS_CONFIG,
  MatchResultRecord
} from './cricketEngine';

describe('Cricket Scoring & NRR Rules Engine', () => {
  it('correctly converts overs notation to legal balls and vice versa', () => {
    // 5.4 overs = 5 * 6 + 4 = 34 balls
    expect(oversToLegalBalls('5.4')).toBe(34);
    expect(oversToLegalBalls(5.4)).toBe(34);
    expect(legalBallsToOversDisplay(34)).toBe('5.4');

    // 8.2 overs = 8 * 6 + 2 = 50 balls
    expect(oversToLegalBalls(8.2)).toBe(50);
    expect(legalBallsToOversDisplay(50)).toBe('8.2');

    // 6.0 overs = 36 balls
    expect(oversToLegalBalls(6.0)).toBe(36);
    expect(legalBallsToOversDisplay(36)).toBe('6.0');

    // Decimal overs check: 34 balls / 6 = 5.6666666...
    expect(legalBallsToDecimalOvers(34)).toBeCloseTo(5.666667, 5);
  });

  it('calculates aggregate tournament NRR accurately without match-averaging distortion', () => {
    // Test scenario:
    // Match 1: Team A scores 80 in 6 overs (36 balls), Team B scores 60 in 6 overs (36 balls). Team A wins.
    // Match 2: Team A scores 72 in 6 overs (36 balls), Team C scores 70 in 6 overs (36 balls). Team A wins.
    // Team A totals:
    // Runs scored = 80 + 72 = 152 in 12.0 overs (72 balls = 12 decimal overs) => For Run Rate = 152 / 12 = 12.6666...
    // Runs conceded = 60 + 70 = 130 in 12.0 overs (72 balls = 12 decimal overs) => Against Run Rate = 130 / 12 = 10.8333...
    // Expected Team A NRR = 12.666667 - 10.833333 = +1.833
    const teams = [
      { id: 'T_A', name: 'Team Alpha', short_code: 'TA' },
      { id: 'T_B', name: 'Team Beta', short_code: 'TB' },
      { id: 'T_C', name: 'Team Gamma', short_code: 'TC' }
    ];

    const matches: MatchResultRecord[] = [
      {
        matchId: 'M1',
        isCompleted: true,
        isAbandoned: false,
        isNoResult: false,
        isTied: false,
        winnerTeamId: 'T_A',
        innings1: {
          teamId: 'T_A',
          runs: 80,
          wickets: 2,
          legalBallsBowled: 36,
          allocatedOvers: 6,
          isAllOut: false
        },
        innings2: {
          teamId: 'T_B',
          runs: 60,
          wickets: 4,
          legalBallsBowled: 36,
          allocatedOvers: 6,
          isAllOut: false
        }
      },
      {
        matchId: 'M2',
        isCompleted: true,
        isAbandoned: false,
        isNoResult: false,
        isTied: false,
        winnerTeamId: 'T_A',
        innings1: {
          teamId: 'T_A',
          runs: 72,
          wickets: 1,
          legalBallsBowled: 36,
          allocatedOvers: 6,
          isAllOut: false
        },
        innings2: {
          teamId: 'T_C',
          runs: 70,
          wickets: 5,
          legalBallsBowled: 36,
          allocatedOvers: 6,
          isAllOut: false
        }
      }
    ];

    const standings = calculateLeagueStandings(teams, matches, DEFAULT_POINTS_CONFIG);
    const teamA = standings.find(s => s.teamId === 'T_A');
    expect(teamA).toBeDefined();
    expect(teamA?.played).toBe(2);
    expect(teamA?.won).toBe(2);
    expect(teamA?.points).toBe(4);
    expect(teamA?.nrr).toBe(1.833);
  });

  it('handles the All-Out innings rule correctly: credits full allocated overs for NRR denominator', () => {
    // Scenario:
    // 6-over game (36 balls).
    // Team B is dismissed all out at 4.2 overs (26 balls) scoring 40 runs.
    // Under standard limited overs / box cricket all-out rule, Team B's overs faced must count as full 6.0 overs (36 balls).
    // Therefore Team B's run rate for this innings is 40 / 6 = 6.666, NOT 40 / (26/6) = 9.23.
    const teams = [
      { id: 'T_A', name: 'Team Alpha', short_code: 'TA' },
      { id: 'T_B', name: 'Team Beta', short_code: 'TB' }
    ];

    const matches: MatchResultRecord[] = [
      {
        matchId: 'M1',
        isCompleted: true,
        isAbandoned: false,
        isNoResult: false,
        isTied: false,
        winnerTeamId: 'T_A',
        innings1: {
          teamId: 'T_A',
          runs: 60,
          wickets: 3,
          legalBallsBowled: 36, // 6.0 overs
          allocatedOvers: 6,
          isAllOut: false
        },
        innings2: {
          teamId: 'T_B',
          runs: 40,
          wickets: 6,
          legalBallsBowled: 26, // 4.2 overs all out
          allocatedOvers: 6,
          isAllOut: true // All out!
        }
      }
    ];

    const standings = calculateLeagueStandings(teams, matches, DEFAULT_POINTS_CONFIG);
    const teamB = standings.find(s => s.teamId === 'T_B')!;
    
    // Team B: Scored 40 with 6 allocated overs (effective) = 40/6 = 6.667. Conceded 60 in 6 overs = 10.000.
    // NRR = 6.666667 - 10.000 = -3.333
    expect(teamB.nrr).toBe(-3.333);
    // But actual display should still reflect actual overs faced (4.2)
    expect(teamB.oversFacedDisplay).toBe('4.2');
  });

  it('does not affect official standings with unfinished or live matches', () => {
    const teams = [
      { id: 'T_A', name: 'Team Alpha', short_code: 'TA' },
      { id: 'T_B', name: 'Team Beta', short_code: 'TB' }
    ];

    const matches: MatchResultRecord[] = [
      {
        matchId: 'M_LIVE',
        isCompleted: false, // In progress
        isAbandoned: false,
        isNoResult: false,
        isTied: false,
        innings1: {
          teamId: 'T_A',
          runs: 55,
          wickets: 1,
          legalBallsBowled: 30,
          allocatedOvers: 6,
          isAllOut: false
        }
      }
    ];

    const standings = calculateLeagueStandings(teams, matches, DEFAULT_POINTS_CONFIG);
    expect(standings[0].played).toBe(0);
    expect(standings[0].points).toBe(0);
    expect(standings[0].nrr).toBe(0);
  });
});

