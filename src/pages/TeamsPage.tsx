import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TeamsPage: React.FC = () => {
  const { teams, registrations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191919] border border-[#27272a] text-[#FF7938] text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Tournament Franchises</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Teams & <span className="text-gradient-fire">Squad Rosters</span>
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Balanced squads formed through randomized Category A, B, and C allotments under veteran captaincy leadership.
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teams.map((team) => {
          const squad = registrations.filter(r => r.assigned_team_id === team.id);
          const catA = squad.filter(s => s.category === 'A');
          const catB = squad.filter(s => s.category === 'B');
          const catC = squad.filter(s => s.category === 'C');

          return (
            <div
              key={team.id}
              className="bg-[#121212] border border-[#27272a] hover:border-[#FF5722]/40 rounded-3xl p-6 sm:p-8 space-y-6 transition-all shadow-xl relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: team.primary_color }}
              />

              {/* Team Top Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                    style={{ backgroundColor: team.primary_color }}
                  >
                    {team.short_code}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{team.name}</h2>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{team.description}</p>
                  </div>
                </div>
              </div>

              {/* Captain Badge */}
              <div className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF7938]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#A1A1AA]">Team Captain:</span>
                  <span className="text-sm font-black text-white">{team.captain_name || 'To Be Nominated'}</span>
                </div>
                <span className="text-xs font-mono text-[#FF5722] font-bold">
                  {squad.length} Players
                </span>
              </div>

              {/* Squad Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Current Squad Members
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {squad.map((player) => (
                    <div
                      key={player.id}
                      className="bg-[#191919] border border-[#27272a] rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-extrabold text-white">{player.full_name}</p>
                        <p className="text-[10px] text-[#A1A1AA]">
                          Wing {player.wing} • Flat {player.flat_number}
                        </p>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        player.category === 'A' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        player.category === 'B' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-zinc-500/10 text-zinc-300 border-zinc-500/30'
                      }`}>
                        Cat {player.category}
                      </span>
                    </div>
                  ))}

                  {squad.length === 0 && (
                    <p className="text-xs text-[#71717A] italic col-span-2 py-2">
                      Awaiting random category draft allocation from admin workspace.
                    </p>
                  )}
                </div>
              </div>

              {/* Category stats footer */}
              <div className="pt-4 border-t border-[#1f1f23] flex items-center justify-between text-[11px] text-[#A1A1AA]">
                <span>Category Composition:</span>
                <span className="font-mono font-bold text-white">
                  A: {catA.length} | B: {catB.length} | C: {catC.length}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

