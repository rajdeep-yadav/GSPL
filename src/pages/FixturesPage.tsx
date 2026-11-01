import React, { useState } from 'react';
import { Calendar, Radio, Clock, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Match } from '../types';

export const FixturesPage: React.FC = () => {
  const { matches, deliveries } = useApp();
  const [filter, setFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Completed'>('All');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const filteredMatches = matches.filter(m => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191919] border border-[#27272a] text-[#FF7938] text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Match Central 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Fixtures & <span className="text-gradient-fire">Live Scorecards</span>
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Track real-time ball-by-ball updates, innings progression, and official box cricket match outcomes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        {(['All', 'Live', 'Upcoming', 'Completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30 scale-105'
                : 'bg-[#121212] border border-[#27272a] text-[#A1A1AA] hover:text-white'
            }`}
          >
            {tab} Matches
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(match => (
          <div
            key={match.id}
            className="bg-[#121212] border border-[#27272a] hover:border-[#FF5722]/40 rounded-3xl p-6 sm:p-7 space-y-5 transition-all shadow-xl"
          >
            
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#A1A1AA] uppercase">
                Match #{match.match_number} • {match.stage}
              </span>

              {match.status === 'Live' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-extrabold animate-pulse">
                  <Radio className="w-3.5 h-3.5" />
                  <span>LIVE NOW</span>
                </span>
              )}
              {match.status === 'Upcoming' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Upcoming</span>
                </span>
              )}
              {match.status === 'Completed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finished</span>
                </span>
              )}
            </div>

            {/* Scoreboard display */}
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{match.team1_name}</span>
                <span className="text-lg font-mono font-black text-[#FF5722]">
                  {match.innings1 ? `${match.innings1.runs}/${match.innings1.wickets}` : '-'}
                  <span className="text-xs text-[#A1A1AA] ml-1 font-normal">
                    {match.innings1 ? `(${match.innings1.overs_bowled} ov)` : ''}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{match.team2_name}</span>
                <span className="text-lg font-mono font-black text-[#FF5722]">
                  {match.innings2 ? `${match.innings2.runs}/${match.innings2.wickets}` : '-'}
                  <span className="text-xs text-[#A1A1AA] ml-1 font-normal">
                    {match.innings2 ? `(${match.innings2.overs_bowled} ov)` : ''}
                  </span>
                </span>
              </div>
            </div>

            {/* Result / Schedule banner */}
            <div className="pt-3 border-t border-[#1f1f23] flex items-center justify-between text-xs">
              <div className="text-[#A1A1AA]">
                {match.status === 'Completed' && (
                  <span className="font-bold text-emerald-400">{match.result_description}</span>
                )}
                {match.status === 'Live' && (
                  <span className="font-bold text-[#FF7938]">
                    Innings {match.current_innings}: Target {match.innings2?.target || 'Setting Target'}
                  </span>
                )}
                {match.status === 'Upcoming' && (
                  <span>{new Date(match.date_time).toLocaleDateString()} at {new Date(match.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>

              <button
                onClick={() => setSelectedMatch(match)}
                className="text-xs font-bold text-white hover:text-[#FF7938] flex items-center gap-1 transition"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Match Details Drawer / Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#27272a] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
              <div>
                <span className="text-xs font-mono text-[#FF7938] font-bold">
                  MATCH #{selectedMatch.match_number}
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedMatch.team1_name} vs {selectedMatch.team2_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#27272a] text-xs font-bold text-[#A1A1AA] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA]">Venue & Rules</span>
                <p className="text-sm font-semibold text-white">{selectedMatch.venue}</p>
                <p className="text-xs text-[#A1A1AA]">6 Overs per side • Heavy Box Tennis Ball • Maximum 2 overs per bowler</p>
              </div>

              {selectedMatch.player_of_match && (
                <div className="bg-[#FF5722]/10 border border-[#FF5722]/30 p-4 rounded-2xl flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#FF7938] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF7938]">Player of the Match</span>
                    <p className="text-sm font-black text-white">{selectedMatch.player_of_match}</p>
                  </div>
                </div>
              )}

              {/* Deliveries commentary */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Recent Ball by Ball Feed</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(deliveries[selectedMatch.id] || []).map((d) => (
                    <div key={d.id} className="bg-[#191919] p-3 rounded-xl border border-[#27272a] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#FF7938]">Over {d.over_number}.{d.ball_number}</span>
                        <span className="text-white ml-2">{d.bowler_name} to {d.batsman_name}</span>
                      </div>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        d.is_wicket ? 'bg-rose-500 text-white' : 'bg-[#27272a] text-white'
                      }`}>
                        {d.is_wicket ? 'W' : `${d.runs_scored}r`}
                      </span>
                    </div>
                  ))}

                  {(!deliveries[selectedMatch.id] || deliveries[selectedMatch.id].length === 0) && (
                    <p className="text-xs text-[#71717A] italic py-4 text-center">
                      Ball-by-ball deliveries will display as recorded live from the Admin Live Scoring Console.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
