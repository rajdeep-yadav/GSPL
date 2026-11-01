import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Radio, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { MatchRunRateChart } from '../components/ui/MatchRunRateChart';

export const HomePage: React.FC = () => {
  const { matches, teams, registrations, sponsors } = useApp();
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'analytics'>('scoreboard');

  const liveMatch = matches.find(m => m.status === 'Live') || matches[1];
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-28 pb-24 overflow-hidden relative">
      
      {/* 1. CINEMATIC HERO SECTION WITH TSPARTICLES & SPOTLIGHT */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-10 px-4 sm:px-6 lg:px-8">
        
        {/* Real tsparticles background layer */}
        <ParticleBackground />

        {/* Stadium lighting glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#FF5722]/15 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#E53935]/12 blur-[130px] pointer-events-none rounded-full" />

        {/* Animated spotlight beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-b from-[#FFAA45]/10 via-[#FF5722]/5 to-transparent blur-3xl pointer-events-none spotlight-beam" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
        >
          
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <div className="shimmer-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#161616]/90 border border-[#FF5722]/40 shadow-2xl shadow-[#FF5722]/20 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5722] animate-ping" />
              <span className="text-xs uppercase tracking-widest font-black text-[#FFAA45]">
                Season 2026 • Official Box Cricket Tournament
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-[0.98]">
              One Society. <br />
              <span className="text-gradient-fire drop-shadow-lg">One League.</span> <br />
              One Champion.
            </h1>
            <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-normal leading-relaxed">
              Gokul Shrishti Premier League brings professional box cricket action, live ball-by-ball scorecards, automated category-wise random squad drafts, and real-time statistics.
            </p>
          </motion.div>

          {/* Call to Actions with spring hover */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7938] to-[#E53935] text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-[#FF5722]/40 hover:shadow-[#FF5722]/70 transition-all flex items-center justify-center gap-3 border border-white/20"
              >
                <Flame className="w-5 h-5 fill-white" />
                <span>Player Registration</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/fixtures"
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#161616]/90 border border-white/10 hover:border-[#FF5722]/60 text-white font-bold text-sm hover:bg-[#1e1e1e] transition-all flex items-center justify-center gap-2.5 shadow-xl backdrop-blur-md"
              >
                <Radio className="w-5 h-5 text-[#FF7938] animate-pulse" />
                <span>Live Scores & Fixtures</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Metrics Bar with glass cards */}
          <motion.div variants={itemVariants} className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { val: teams.length, label: 'Franchise Teams', color: 'text-white' },
              { val: `${registrations.length}+`, label: 'Residents Registered', color: 'text-[#FF7938]' },
              { val: '6 Overs', label: 'Box Cricket Format', color: 'text-white' },
              { val: '100%', label: 'Real-time Excel Sync', color: 'text-emerald-400' },
            ].map((metric, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, borderColor: 'rgba(255, 87, 34, 0.4)' }}
                className="glass-panel p-4 rounded-2xl text-center space-y-1 transition-all"
              >
                <p className={`text-2xl sm:text-3xl font-black ${metric.color} font-mono`}>{metric.val}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-extrabold">{metric.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* 2. FEATURED LIVE MATCH SCORECARD WITH TABBED RUN-RATE CHART */}
      {liveMatch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181818] to-[#111111] border border-[#FF5722]/35 p-6 sm:p-10 shadow-2xl glow-box-orange"
          >
            {/* Live Pill badge */}
            <div className="absolute top-0 right-0 px-6 py-2.5 bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 rounded-bl-3xl shadow-lg">
              <Radio className="w-4 h-4 animate-pulse fill-white" />
              <span>LIVE MATCH #{liveMatch.match_number}</span>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA] font-bold">
                <Calendar className="w-4 h-4 text-[#FF7938]" />
                <span>{liveMatch.venue} • {liveMatch.stage}</span>
              </div>

              {/* View Toggle (Scorecard vs Run Rate Chart) */}
              <div className="flex items-center bg-[#191919] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab('scoreboard')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'scoreboard' ? 'bg-[#FF5722] text-white shadow' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Scoreboard
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    activeTab === 'analytics' ? 'bg-[#FF5722] text-white shadow' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Rate Worm</span>
                </button>
              </div>
            </div>

            {activeTab === 'scoreboard' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
                
                {/* Team 1 */}
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#FF5722]/40 flex items-center justify-center font-black text-2xl text-[#FF7938] shadow-inner">
                    {liveMatch.team1_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{liveMatch.team1_name}</h3>
                    <p className="text-3xl font-black text-[#FF5722] font-mono mt-0.5">
                      {liveMatch.innings1 ? `${liveMatch.innings1.runs}/${liveMatch.innings1.wickets}` : 'Yet to Bat'}
                    </p>
                    <p className="text-xs text-[#A1A1AA]">
                      {liveMatch.innings1 ? `(${liveMatch.innings1.overs_bowled} ov)` : ''}
                    </p>
                  </div>
                </motion.div>

                {/* Center VS / Status */}
                <div className="text-center py-4 border-y md:border-y-0 md:border-x border-white/10">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFAA45] block mb-1">
                    Target: {liveMatch.innings2?.target || 'In Progress'}
                  </span>
                  <span className="text-4xl font-black text-white/30 tracking-wider">VS</span>
                  <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Live Over: {liveMatch.innings2 ? `${liveMatch.innings2.overs_bowled} / ${liveMatch.total_overs} Overs` : '1st Innings'}
                  </p>
                </div>

                {/* Team 2 */}
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-end gap-4 text-right">
                  <div>
                    <h3 className="text-xl font-black text-white">{liveMatch.team2_name}</h3>
                    <p className="text-3xl font-black text-[#FF5722] font-mono mt-0.5">
                      {liveMatch.innings2 ? `${liveMatch.innings2.runs}/${liveMatch.innings2.wickets}` : 'Chasing'}
                    </p>
                    <p className="text-xs text-[#A1A1AA]">
                      {liveMatch.innings2 ? `(${liveMatch.innings2.overs_bowled} ov)` : ''}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#00B0FF]/40 flex items-center justify-center font-black text-2xl text-[#00B0FF] shadow-inner">
                    {liveMatch.team2_name.slice(0, 2).toUpperCase()}
                  </div>
                </motion.div>

              </div>
            ) : (
              /* Interactive Run Rate Chart View */
              <div className="pt-2">
                <MatchRunRateChart
                  matchNumber={liveMatch.match_number}
                  team1Name={liveMatch.team1_name}
                  team2Name={liveMatch.team2_name}
                />
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FF7938]" />
                Live scoring enabled with Supabase Realtime pub/sub engine.
              </span>
              <Link
                to="/fixtures"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-[#FF7938] transition"
              >
                <span>Full Ball-by-Ball Scorecard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* 3. TOURNAMENT TEAMS SHOWCASE WITH 3D HOVER TILT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF7938] mb-1">
              <Users className="w-4 h-4" />
              <span>Franchise Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Championship Contenders</h2>
          </div>
          <Link
            to="/teams"
            className="text-xs font-extrabold uppercase tracking-wider text-[#A1A1AA] hover:text-white flex items-center gap-1 transition"
          >
            <span>Explore All Squads</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-[#141414] border border-white/[0.08] hover:border-[#FF5722]/50 rounded-3xl p-6 transition-all relative overflow-hidden shadow-xl"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: team.primary_color }}
              />

              <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center font-black text-xl text-white mb-4 shadow-inner group-hover:scale-110 transition-transform">
                {team.short_code}
              </div>

              <h3 className="text-lg font-black text-white group-hover:text-[#FF7938] transition-colors">
                {team.name}
              </h3>
              <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 mb-4 leading-relaxed">
                {team.description}
              </p>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#71717A] uppercase font-black text-[10px] tracking-wider">Captain</span>
                <span className="font-extrabold text-white">{team.captain_name || 'TBD'}</span>
              </div>
            </motion.div>
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
              <motion.div 
                key={m.id} 
                whileHover={{ scale: 1.01 }}
                className="bg-[#141414] border border-white/[0.08] hover:border-[#FF5722]/30 rounded-2xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span className="font-mono">Match #{m.match_number} • {m.stage}</span>
                  <span className="text-emerald-400 font-extrabold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Finished</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white">{m.team1_name}</span>
                  <span className="font-mono text-sm font-black text-white">
                    {m.innings1?.runs}/{m.innings1?.wickets} ({m.innings1?.overs_bowled} ov)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white">{m.team2_name}</span>
                  <span className="font-mono text-sm font-black text-white">
                    {m.innings2?.runs}/{m.innings2?.wickets} ({m.innings2?.overs_bowled} ov)
                  </span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-xs font-black text-[#FF7938]">
                  {m.result_description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upcoming matches */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF7938]" />
              <span>Upcoming Scheduled Clashes</span>
            </h3>

            {upcomingMatches.map(m => (
              <motion.div 
                key={m.id} 
                whileHover={{ scale: 1.01 }}
                className="bg-[#141414] border border-white/[0.08] hover:border-[#FF5722]/30 rounded-2xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span className="font-mono">Match #{m.match_number} • {m.stage}</span>
                  <span className="text-[#FF7938] font-extrabold uppercase tracking-wider text-[10px] bg-[#FF5722]/10 px-2 py-0.5 rounded">Upcoming</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-black text-white text-base">{m.team1_name}</span>
                  <span className="text-xs uppercase font-black text-[#A1A1AA] px-2.5 py-1 rounded-lg bg-[#1e1e1e]">VS</span>
                  <span className="font-black text-white text-base">{m.team2_name}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-xs text-[#A1A1AA] flex items-center justify-between">
                  <span>{new Date(m.date_time).toLocaleDateString()} at {new Date(m.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-mono font-bold text-white">{m.total_overs} Overs Box</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. OFFICIAL SPONSORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl">
          
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF7938] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Official League Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Proudly Supported By</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sponsors.map(sp => (
              <motion.div 
                key={sp.id} 
                whileHover={{ y: -4 }}
                className="bg-[#1b1b1b] border border-white/10 rounded-2xl p-6 text-center space-y-3"
              >
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FFAA45] px-3 py-1 rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 inline-block">
                  {sp.category}
                </span>
                <h4 className="text-lg font-black text-white">{sp.name}</h4>
                <p className="text-xs text-[#A1A1AA]">Official partner of Gokul Shrishti Premier League 2026</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
