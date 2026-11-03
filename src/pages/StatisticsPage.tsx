import React from 'react';
import { Award, Flame, Zap, Shield, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/ui/EmptyState';

export const StatisticsPage: React.FC = () => {
  const { matches } = useApp();
  const completedMatches = matches.filter(m => m.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Leaderboard & Honors</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)]">
          Tournament <span className="gold-gradient-text">Statistics</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Orange Cap, Purple Cap, strike-rate metrics, and box cricket performance honours generated exclusively from official match scorecards.
        </p>
      </div>

      {/* When no completed matches exist, display clean empty state per specifications */}
      {completedMatches.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Player statistics will appear after the first completed match"
          description="Leaderboards, top boundary hitters, Orange Cap run machines, and Purple Cap wicket-takers will compute automatically from live ball-by-ball records as matches conclude."
          actionText="View Match Center"
          onAction={() => { window.location.href = '/fixtures'; }}
          className="max-w-xl mx-auto py-16"
        />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="luxury-card p-6 sm:p-8 space-y-4">
              <span className="text-xs uppercase font-bold text-[var(--brand-orange)]">Orange Cap Leader</span>
              <p className="text-2xl font-bold text-[var(--text-main)]">Leading Tournament Batter</p>
            </div>
            <div className="luxury-card p-6 sm:p-8 space-y-4">
              <span className="text-xs uppercase font-bold text-[var(--brand-gold)]">Purple Cap Leader</span>
              <p className="text-2xl font-bold text-[var(--text-main)]">Leading Tournament Bowler</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
