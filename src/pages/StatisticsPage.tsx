import React from 'react';
import { Award, Flame, Zap, Shield, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatisticsPage: React.FC = () => {
  const { registrations, teams } = useApp();

  // Top batting leaders
  const topBatters = [
    { rank: 1, name: 'Rajdeep Yadav', team: 'Shrishti Strikers', runs: 78, hs: '46*', sr: 216.6, fours: 7, sixes: 5 },
    { rank: 2, name: 'Amit Sharma', team: 'Gokul Gladiators', runs: 64, hs: '38', sr: 188.2, fours: 6, sixes: 3 },
    { rank: 3, name: 'Karan Patel', team: 'Phoenix Blasters', runs: 58, hs: '34*', sr: 175.7, fours: 4, sixes: 4 },
    { rank: 4, name: 'Rahul Mehta', team: 'Shrishti Strikers', runs: 42, hs: '28', sr: 161.5, fours: 5, sixes: 2 }
  ];

  // Top bowling leaders
  const topBowlers = [
    { rank: 1, name: 'Vikram Desai', team: 'Wing Royals', wickets: 6, econ: 5.5, best: '3/8' },
    { rank: 2, name: 'Deepak Varma', team: 'Gokul Gladiators', wickets: 5, econ: 6.2, best: '2/11' },
    { rank: 3, name: 'Aniket Kulkarni', team: 'Phoenix Blasters', wickets: 4, econ: 6.8, best: '2/14' },
    { rank: 4, name: 'Rajdeep Yadav', team: 'Shrishti Strikers', wickets: 3, econ: 4.8, best: '2/6' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191919] border border-[#27272a] text-[#FF7938] text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Leaderboard & Honors</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Tournament <span className="text-gradient-fire">Statistics</span>
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Orange Cap, Purple Cap, strike-rate metrics, and box cricket performance honours.
        </p>
      </div>

      {/* Cap Leaders Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Orange Cap */}
        <div className="bg-gradient-to-br from-[#1c120c] to-[#121212] border border-[#FF5722]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-[#FF5722] text-white font-black text-xs uppercase tracking-wider">
              ORANGE CAP • RUN MACHINE
            </span>
            <Flame className="w-6 h-6 text-[#FF5722] animate-bounce" />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#FF5722]/20 border border-[#FF5722]/40 flex items-center justify-center font-black text-3xl text-[#FF7938]">
              RY
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{topBatters[0].name}</h2>
              <p className="text-xs text-[#FF7938] font-bold mt-0.5">{topBatters[0].team}</p>
              <p className="text-3xl font-mono font-black text-white mt-2">
                {topBatters[0].runs} <span className="text-xs font-normal text-[#A1A1AA]">Runs (SR {topBatters[0].sr})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Purple Cap */}
        <div className="bg-gradient-to-br from-[#170e24] to-[#121212] border border-purple-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-wider">
              PURPLE CAP • LEADING WICKET TAKER
            </span>
            <Target className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-3xl text-purple-400">
              VD
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{topBowlers[0].name}</h2>
              <p className="text-xs text-purple-400 font-bold mt-0.5">{topBowlers[0].team}</p>
              <p className="text-3xl font-mono font-black text-white mt-2">
                {topBowlers[0].wickets} <span className="text-xs font-normal text-[#A1A1AA]">Wickets (Econ {topBowlers[0].econ})</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Leaderboard Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Runs */}
        <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF5722]" />
            <span>Top Run Scorers</span>
          </h3>

          <div className="divide-y divide-[#1f1f23]">
            {topBatters.map(b => (
              <div key={b.name} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-white text-sm">{b.name}</p>
                  <p className="text-[#A1A1AA]">{b.team} • HS: {b.hs} • {b.fours} 4s, {b.sixes} 6s</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-base text-[#FF7938] block">{b.runs}</span>
                  <span className="text-[10px] text-[#A1A1AA]">SR: {b.sr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Wickets */}
        <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span>Top Wicket Takers</span>
          </h3>

          <div className="divide-y divide-[#1f1f23]">
            {topBowlers.map(bw => (
              <div key={bw.name} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-white text-sm">{bw.name}</p>
                  <p className="text-[#A1A1AA]">{bw.team} • BBI: {bw.best}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-base text-purple-400 block">{bw.wickets} Wkts</span>
                  <span className="text-[10px] text-[#A1A1AA]">Econ: {bw.econ}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
