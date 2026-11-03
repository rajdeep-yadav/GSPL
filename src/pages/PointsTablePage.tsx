import React from 'react';
import { BarChart2, TrendingUp, Award, Flame, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLeagueStandings, DEFAULT_POINTS_CONFIG, oversToLegalBalls } from '../services/cricketEngine';
import { EmptyState } from '../components/ui/EmptyState';

export const PointsTablePage: React.FC = () => {
  const { teams, matches } = useApp();

  // Transform matches to strict cricket engine format
  const engineMatches = matches.map(m => ({
    matchId: m.id,
    isCompleted: m.status === 'Completed',
    isAbandoned: m.status === 'Abandoned',
    isNoResult: false,
    isTied: m.result_description?.toLowerCase().includes('tie') || false,
    winnerTeamId: m.winner_team_id,
    innings1: m.innings1 ? {
      teamId: m.innings1.batting_team_id,
      runs: m.innings1.runs,
      wickets: m.innings1.wickets,
      legalBallsBowled: oversToLegalBalls(m.innings1.overs_bowled),
      allocatedOvers: m.total_overs,
      isAllOut: (m as any).innings1?.is_all_out || false
    } : undefined,
    innings2: m.innings2 ? {
      teamId: m.innings2.batting_team_id,
      runs: m.innings2.runs,
      wickets: m.innings2.wickets,
      legalBallsBowled: oversToLegalBalls(m.innings2.overs_bowled),
      allocatedOvers: m.total_overs,
      isAllOut: (m as any).innings2?.is_all_out || false
    } : undefined
  }));

  const standings = calculateLeagueStandings(teams, engineMatches, DEFAULT_POINTS_CONFIG);
  const completedCount = matches.filter(m => m.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Official Standings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)]">
          GSPL <span className="gold-gradient-text">Points Table</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Real tournament league standings calculated with legal-ball tournament-aggregate Net Run Rate (NRR).
        </p>
      </div>

      {/* If no teams or no completed matches, show authentic empty state */}
      {teams.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Teams will appear here once they are finalised by the organisers"
          description="The points table will activate once registered players are drafted into official society franchises."
          className="max-w-xl mx-auto py-16"
        />
      ) : completedCount === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="No completed matches yet"
          description="Tournament standings and Net Run Rate (NRR) will update automatically in real-time as soon as the first match is verified."
          className="max-w-xl mx-auto py-16"
        />
      ) : (
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 px-4 text-center">Pos</th>
                  <th className="py-4 px-4">Team</th>
                  <th className="py-4 px-3 text-center">P</th>
                  <th className="py-4 px-3 text-center">W</th>
                  <th className="py-4 px-3 text-center">L</th>
                  <th className="py-4 px-3 text-center">T</th>
                  <th className="py-4 px-3 text-center font-bold text-[var(--brand-gold)]">Pts</th>
                  <th className="py-4 px-3 text-center">NRR</th>
                  <th className="py-4 px-4 text-center hidden md:table-cell">For (Overs)</th>
                  <th className="py-4 px-4 text-center hidden md:table-cell">Against (Overs)</th>
                  <th className="py-4 px-4 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs font-medium">
                {standings.map((row, idx) => (
                  <tr key={row.teamId} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-[var(--text-main)]">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded bg-[var(--brand-orange)]/15 border border-[var(--brand-orange)]/30 text-[var(--brand-orange)] text-[10px] font-bold flex items-center justify-center">
                          {row.teamCode}
                        </span>
                        <span className="font-bold text-[var(--text-main)]">{row.teamName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">{row.played}</td>
                    <td className="py-4 px-3 text-center text-emerald-500 font-bold">{row.won}</td>
                    <td className="py-4 px-3 text-center text-red-500">{row.lost}</td>
                    <td className="py-4 px-3 text-center text-amber-500">{row.tied}</td>
                    <td className="py-4 px-3 text-center font-black text-sm text-[var(--brand-gold)]">{row.points}</td>
                    <td className="py-4 px-3 text-center font-mono font-bold">
                      {row.nrr >= 0 ? `+${row.nrr.toFixed(3)}` : row.nrr.toFixed(3)}
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell font-mono text-[var(--text-muted)]">
                      {row.runsScored} ({row.oversFacedDisplay})
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell font-mono text-[var(--text-muted)]">
                      {row.runsConceded} ({row.oversBowledDisplay})
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-[10px] text-[var(--text-subtle)]">-</span>
                        ) : (
                          row.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                                res === 'W' ? 'bg-emerald-500' : res === 'L' ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                            >
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rules Notice */}
      <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1">
        <p className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[var(--brand-gold)]" />
          <span>GSPL Official Tie-Breaker & NRR Rule Specification:</span>
        </p>
        <p>1. Win = 2 Pts, Tie/No Result = 1 Pt, Loss = 0 Pts.</p>
        <p>2. NRR is computed on cumulative tournament aggregates across all verified matches using legal-ball counters.</p>
        <p>3. If a team is dismissed (all out) in an innings, the complete quota of allocated overs is credited for NRR calculation.</p>
      </div>

    </div>
  );
};
