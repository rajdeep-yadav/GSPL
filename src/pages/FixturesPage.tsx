import React, { useState } from 'react';
import { Calendar, Radio, Clock, CheckCircle2, Trophy, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Match } from '../types';
import { EmptyState } from '../components/ui/EmptyState';

export const FixturesPage: React.FC = () => {
  const { matches } = useApp();
  const [filter, setFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Completed'>('All');

  const filteredMatches = matches.filter(m => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Match Central 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)]">
          Fixtures & <span className="gold-gradient-text">Live Scorecards</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Track real-time ball-by-ball updates, innings progression, and official box cricket match outcomes once scheduled.
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
                ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white shadow-md'
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {tab} Matches
          </button>
        ))}
      </div>

      {/* When no matches scheduled */}
      {filteredMatches.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            filter === 'Completed'
              ? 'No completed matches yet'
              : filter === 'Live'
              ? 'No live match in progress right now'
              : 'Match fixtures will be published once team allocations conclude'
          }
          description="Tournament schedule and round-robin fixtures are prepared by the committee after team rosters and captains are locked."
          actionText="View Teams Hub"
          onAction={() => { window.location.href = '/teams'; }}
          className="max-w-xl mx-auto py-16"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map(match => (
            <div
              key={match.id}
              className="luxury-card p-6 sm:p-7 space-y-5"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase">
                  Match #{match.match_number} • {match.stage}
                </span>

                {match.status === 'Live' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold animate-pulse">
                    <Radio className="w-3.5 h-3.5" />
                    <span>LIVE NOW</span>
                  </span>
                )}
                {match.status === 'Upcoming' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Upcoming</span>
                  </span>
                )}
                {match.status === 'Completed' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finished</span>
                  </span>
                )}
              </div>

              {/* Match Card Teams & Scores */}
              <div className="space-y-4 py-2 border-y border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-[var(--text-main)]">{match.team1_name}</span>
                  <span className="font-mono text-sm font-bold text-[var(--text-main)]">
                    {match.innings1 ? `${match.innings1.runs}/${match.innings1.wickets} (${match.innings1.overs_bowled} ov)` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-[var(--text-main)]">{match.team2_name}</span>
                  <span className="font-mono text-sm font-bold text-[var(--text-main)]">
                    {match.innings2 ? `${match.innings2.runs}/${match.innings2.wickets} (${match.innings2.overs_bowled} ov)` : '-'}
                  </span>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{match.venue}</span>
                <span className="font-bold text-[var(--brand-orange)]">{match.result_description || 'Fixture confirmed'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
