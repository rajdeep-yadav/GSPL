import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Trophy, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/ui/EmptyState';

export const TeamsPage: React.FC = () => {
  const { teams, registrations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Tournament Franchises</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)]">
          Teams & <span className="gold-gradient-text">Squad Rosters</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Balanced squads will be formed through randomized Category A, B, and C allotments once player registrations conclude.
        </p>
      </div>

      {/* If no teams configured yet, show authentic empty state */}
      {teams.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Teams will appear here once they are finalised by the organisers"
          description="Player registration is currently active. The GSPL committee will configure team franchises, select captains, and run the verified random category allocation."
          actionText="Register as Player"
          onAction={() => { window.location.href = '/register'; }}
          className="max-w-xl mx-auto py-16"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team) => {
            const squad = registrations.filter(r => r.assigned_team_id === team.id);

            return (
              <div
                key={team.id}
                className="luxury-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: team.primary_color || 'var(--brand-orange)' }}
                />

                {/* Team Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                      style={{ backgroundColor: team.primary_color || 'var(--brand-orange)' }}
                    >
                      {team.short_code}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[var(--text-main)]">{team.name}</h2>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{team.description || 'GSPL Society Franchise'}</p>
                    </div>
                  </div>
                </div>

                {/* Captain Badge */}
                <div className="bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-gold)]" />
                    <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">Captain:</span>
                    <span className="text-sm font-bold text-[var(--text-main)]">{team.captain_name || 'To Be Nominated'}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--brand-orange)] font-bold">
                    {squad.length} Players
                  </span>
                </div>

                {/* Squad Members */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Current Squad Members
                  </h4>

                  {squad.length === 0 ? (
                    <p className="text-xs text-[var(--text-subtle)] italic py-2">
                      No players assigned yet. Draft allocation will distribute registered players.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {squad.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs"
                        >
                          <span className="font-semibold text-[var(--text-main)]">{player.full_name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] border border-[var(--brand-orange)]/20">
                            Cat. {player.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
