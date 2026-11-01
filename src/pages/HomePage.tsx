import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { matches, teams, registrations, announcements, sponsors } = useApp();

  const liveMatch = matches.find(m => m.status === 'Live') || matches[1];
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  // Stats summaries
  const totalApproved = registrations.filter(r => r.status === 'Approved').length;
  const categoryACount = registrations.filter(r => r.category === 'A').length;

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 px-4 sm:px-6 lg:px-8">
        
        {/* Stadium lighting glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF5722]/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#E53935]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#191919] border border-[#FF5722]/40 shadow-xl shadow-[#FF5722]/10">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5722] animate-ping" />
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#FF7938]">
              Season 2026 • Official Box Cricket Tournament
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
              One Society. <br />
              <span className="text-gradient-fire">One League.</span> <br />
              One Champion.
            </h1>
            <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-normal leading-relaxed">
              Gokul Shrishti Premier League brings professional box cricket action, live ball-by-ball scorecards, automated category-wise random squad drafts, and real-time statistics.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-extrabold text-base tracking-wide shadow-2xl shadow-[#FF5722]/40 hover:shadow-[#FF5722]/60 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Flame className="w-5 h-5 fill-white" />
              <span>Player Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/fixtures"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722]/60 text-white font-bold text-base hover:bg-[#202020] transition-all flex items-center justify-center gap-2.5"
            >
              <Radio className="w-5 h-5 text-[#FF7938] animate-pulse" />
              <span>Live Scores & Fixtures</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#121212]/80 backdrop-blur border border-[#27272a] p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-white">{teams.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold mt-1">Franchise Teams</p>
            </div>
            <div className="bg-[#121212]/80 backdrop-blur border border-[#27272a] p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-[#FF7938]">{registrations.length}+</p>
              <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold mt-1">Residents Registered</p>
            </div>
            <div className="bg-[#121212]/80 backdrop-blur border border-[#27272a] p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-white">6 Overs</p>
              <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold mt-1">Box Cricket Format</p>
            </div>
            <div className="bg-[#121212]/80 backdrop-blur border border-[#27272a] p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
              <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold mt-1">Real-time Excel Sync</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED LIVE MATCH SCORECARD */}
      {liveMatch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#191919] to-[#121212] border border-[#FF5722]/30 p-6 sm:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 px-6 py-2 bg-[#FF5722] text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 rounded-bl-2xl">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE MATCH #{liveMatch.match_number}</span>
            </div>

            <div className="mb-6 flex items-center gap-2 text-xs text-[#A1A1AA] font-semibold">
              <Calendar className="w-4 h-4 text-[#FF7938]" />
              <span>{liveMatch.venue} • {liveMatch.stage}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Team 1 */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#090909] border border-[#27272a] flex items-center justify-center font-black text-2xl text-[#FF7938]">
                  {liveMatch.team1_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{liveMatch.team1_name}</h3>
                  <p className="text-2xl font-black text-[#FF5722] font-mono mt-0.5">
                    {liveMatch.innings1 ? `${liveMatch.innings1.runs}/${liveMatch.innings1.wickets}` : 'Yet to Bat'}
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    {liveMatch.innings1 ? `(${liveMatch.innings1.overs_bowled} ov)` : ''}
                  </p>
                </div>
              </div>

              {/* Center VS / Status */}
              <div className="text-center py-4 border-y md:border-y-0 md:border-x border-[#27272a]">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF7938] block mb-1">
                  Target: {liveMatch.innings2?.target || 'In Progress'}
                </span>
                <span className="text-3xl font-black text-white/40 tracking-wider">VS</span>
                <p className="text-xs text-emerald-400 font-semibold mt-2">
                  Live Over: {liveMatch.innings2 ? `${liveMatch.innings2.overs_bowled} / ${liveMatch.total_overs} Overs` : '1st Innings'}
                </p>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-end gap-4 text-right">
                <div>
                  <h3 className="text-xl font-black text-white">{liveMatch.team2_name}</h3>
                  <p className="text-2xl font-black text-[#FF5722] font-mono mt-0.5">
                    {liveMatch.innings2 ? `${liveMatch.innings2.runs}/${liveMatch.innings2.wickets}` : 'Chasing'}
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    {liveMatch.innings2 ? `(${liveMatch.innings2.overs_bowled} ov)` : ''}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#090909] border border-[#27272a] flex items-center justify-center font-black text-2xl text-[#00B0FF]">
                  {liveMatch.team2_name.slice(0, 2).toUpperCase()}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#A1A1AA]">
                Live scoring enabled with Supabase Realtime pub/sub engine.
              </span>
              <Link
                to="/fixtures"
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#FF7938] transition"
              >
                <span>View Full Ball-by-Ball Scorecard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. TOURNAMENT TEAMS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF7938] mb-1">
              <Users className="w-4 h-4" />
              <span>Franchise Lineup</span>
            </div>
            <h2 className="text-3xl font-black text-white">Championship Contenders</h2>
          </div>
          <Link
            to="/teams"
            className="text-xs font-bold text-[#A1A1AA] hover:text-white flex items-center gap-1 transition"
          >
            <span>Explore All Squads</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="group bg-[#121212] border border-[#27272a] hover:border-[#FF5722]/50 rounded-2xl p-6 transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: team.primary_color }}
              />

              <div className="w-14 h-14 rounded-2xl bg-[#191919] border border-[#27272a] flex items-center justify-center font-black text-xl text-white mb-4 shadow-inner">
                {team.short_code}
              </div>

              <h3 className="text-lg font-black text-white group-hover:text-[#FF7938] transition">
                {team.name}
              </h3>
              <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 mb-4 leading-relaxed">
                {team.description}
              </p>

              <div className="pt-4 border-t border-[#1f1f23] flex items-center justify-between text-xs">
                <span className="text-[#71717A] uppercase font-bold text-[10px]">Captain</span>
                <span className="font-extrabold text-white">{team.captain_name || 'TBD'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RECENT RESULTS & UPCOMING FIXTURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Completed matches */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FF5722]" />
              <span>Latest Match Results</span>
            </h3>

            {completedMatches.map(m => (
              <div key={m.id} className="bg-[#121212] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span>Match #{m.match_number} • {m.stage}</span>
                  <span className="text-emerald-400 font-bold">Finished</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{m.team1_name}</span>
                  <span className="font-mono text-sm font-black text-white">
                    {m.innings1?.runs}/{m.innings1?.wickets} ({m.innings1?.overs_bowled} ov)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{m.team2_name}</span>
                  <span className="font-mono text-sm font-black text-white">
                    {m.innings2?.runs}/{m.innings2?.wickets} ({m.innings2?.overs_bowled} ov)
                  </span>
                </div>
                <div className="pt-2 border-t border-[#1f1f23] text-xs font-bold text-[#FF7938]">
                  {m.result_description}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming matches */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF7938]" />
              <span>Upcoming Scheduled Clashes</span>
            </h3>

            {upcomingMatches.map(m => (
              <div key={m.id} className="bg-[#121212] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span>Match #{m.match_number} • {m.stage}</span>
                  <span className="text-[#FF7938] font-bold">Upcoming</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-extrabold text-white text-base">{m.team1_name}</span>
                  <span className="text-xs uppercase font-black text-[#A1A1AA] px-2 py-0.5 rounded bg-[#191919]">VS</span>
                  <span className="font-extrabold text-white text-base">{m.team2_name}</span>
                </div>
                <div className="pt-2 border-t border-[#1f1f23] text-xs text-[#A1A1AA] flex items-center justify-between">
                  <span>{new Date(m.date_time).toLocaleDateString()} at {new Date(m.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{m.total_overs} Overs Box</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ANNOUNCEMENTS & OFFICIAL SPONSORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-8 sm:p-12 space-y-10">
          
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF7938] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Official League Partners</span>
            </div>
            <h2 className="text-2xl font-black text-white">Proudly Supported By</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sponsors.map(sp => (
              <div key={sp.id} className="bg-[#191919] border border-[#27272a] rounded-2xl p-6 text-center space-y-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FF7938] px-2.5 py-1 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 inline-block">
                  {sp.category}
                </span>
                <h4 className="text-lg font-black text-white">{sp.name}</h4>
                <p className="text-xs text-[#A1A1AA]">Official partner of Gokul Shrishti Premier League 2026</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
