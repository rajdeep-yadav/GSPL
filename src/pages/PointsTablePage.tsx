import React from 'react';
import { BarChart2, TrendingUp, Award, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PointsTablePage: React.FC = () => {
  const { teams, matches } = useApp();

  // Dynamic computation of points table from matches
  const standings = teams.map(team => {
    let played = 0;
    let won = 0;
    let lost = 0;
    let tied = 0;
    let points = 0;
    let totalRunsScored = 0;
    let totalOversFaced = 0;
    let totalRunsConceded = 0;
    let totalOversBowled = 0;

    matches.forEach(m => {
      if (m.status !== 'Completed') return;
      if (m.team1_id === team.id || m.team2_id === team.id) {
        played += 1;
        if (m.winner_team_id === team.id) {
          won += 1;
          points += 2;
        } else if (m.winner_team_id) {
          lost += 1;
        } else {
          tied += 1;
          points += 1;
        }

        // Runs and overs for NRR
        if (m.team1_id === team.id) {
          totalRunsScored += m.innings1?.runs || 0;
          totalOversFaced += m.innings1?.overs_bowled || 6;
          totalRunsConceded += m.innings2?.runs || 0;
          totalOversBowled += m.innings2?.overs_bowled || 6;
        } else {
          totalRunsScored += m.innings2?.runs || 0;
          totalOversFaced += m.innings2?.overs_bowled || 6;
          totalRunsConceded += m.innings1?.runs || 0;
          totalOversBowled += m.innings1?.overs_bowled || 6;
        }
      }
    });

    const runRateFor = totalOversFaced > 0 ? (totalRunsScored / totalOversFaced) : 0;
    const runRateAgainst = totalOversBowled > 0 ? (totalRunsConceded / totalOversBowled) : 0;
    const nrr = Number((runRateFor - runRateAgainst).toFixed(3));

    return {
      team,
      played,
      won,
      lost,
      tied,
      points,
      nrr: isNaN(nrr) ? 0 : nrr
    };
  });

  // Sort by Points DESC, then NRR DESC
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191919] border border-[#27272a] text-[#FF7938] text-xs font-bold uppercase tracking-wider">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Official Standings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          GSPL <span className="text-gradient-fire">Points Table</span>
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Computed in real-time from official match outcomes and Net Run Rate (NRR) coefficients.
        </p>
      </div>

      {/* Standings Table Card */}
      <div className="bg-[#121212] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#191919] border-b border-[#27272a] text-[11px] uppercase font-bold text-[#A1A1AA] tracking-wider">
                <th className="py-4 px-6 text-center">Pos</th>
                <th className="py-4 px-6">Franchise Team</th>
                <th className="py-4 px-4 text-center">P</th>
                <th className="py-4 px-4 text-center">W</th>
                <th className="py-4 px-4 text-center">L</th>
                <th className="py-4 px-4 text-center">T</th>
                <th className="py-4 px-6 text-center font-extrabold text-[#FF7938]">PTS</th>
                <th className="py-4 px-6 text-right">NRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f23] text-sm">
              {standings.map((row, idx) => (
                <tr 
                  key={row.team.id}
                  className={`hover:bg-[#181818] transition-colors ${idx < 2 ? 'bg-[#FF5722]/5' : ''}`}
                >
                  <td className="py-4 px-6 text-center font-mono font-bold text-white">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${
                      idx === 0 ? 'bg-amber-500 text-black font-black' :
                      idx === 1 ? 'bg-zinc-300 text-black font-black' :
                      'text-[#A1A1AA]'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white"
                        style={{ backgroundColor: row.team.primary_color }}
                      >
                        {row.team.short_code}
                      </div>
                      <div>
                        <span className="font-extrabold text-white block">{row.team.name}</span>
                        <span className="text-[10px] text-[#A1A1AA]">Capt: {row.team.captain_name || 'TBD'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-white">{row.played}</td>
                  <td className="py-4 px-4 text-center font-mono text-emerald-400 font-bold">{row.won}</td>
                  <td className="py-4 px-4 text-center font-mono text-rose-400 font-bold">{row.lost}</td>
                  <td className="py-4 px-4 text-center font-mono text-[#A1A1AA]">{row.tied}</td>
                  <td className="py-4 px-6 text-center font-mono font-black text-lg text-[#FF7938]">
                    {row.points}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-semibold text-white">
                    {row.nrr > 0 ? `+${row.nrr}` : row.nrr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#161616] border-t border-[#27272a] text-xs text-[#A1A1AA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Top 2 teams qualify directly for the Grand Final</span>
          </div>
          <span>Points: Win = 2, Tie/NR = 1, Loss = 0</span>
        </div>
      </div>

    </div>
  );
};

