import React, { useState } from 'react';
import { 
  Radio, 
  RotateCcw, 
  User, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Flame,
  Award
} from 'lucide-react';
import { Match, MatchDelivery } from '../../types';

interface MobileScoringDeckProps {
  match: Match;
  deliveries: MatchDelivery[];
  onRecordDelivery: (delivery: Omit<MatchDelivery, 'id' | 'timestamp'>) => void;
  onUndoDelivery: (matchId: string) => void;
  onUpdateStatus: (matchId: string, status: Match['status']) => void;
}

export const MobileScoringDeck: React.FC<MobileScoringDeckProps> = ({
  match,
  deliveries = [],
  onRecordDelivery,
  onUndoDelivery,
  onUpdateStatus,
}) => {
  const currentInnings = match.current_innings || 1;
  const inningsData = currentInnings === 1 ? match.innings1 : match.innings2;
  const currentRuns = inningsData?.runs || 0;
  const currentWickets = inningsData?.wickets || 0;
  const currentOvers = inningsData?.overs_bowled || 0;

  // Striker / Non-striker / Bowler input state
  const [striker, setStriker] = useState('Striker');
  const [nonStriker, setNonStriker] = useState('Non-Striker');
  const [bowler, setBowler] = useState('Bowler');
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const battingTeamName = currentInnings === 1 ? match.team1_name : match.team2_name;
  const bowlingTeamName = currentInnings === 1 ? match.team2_name : match.team1_name;

  // Quick delivery handlers
  const handleScoreBall = (runs: number) => {
    const overNum = Math.floor(currentOvers);
    const ballNum = Math.round((currentOvers - overNum) * 10) + 1;

    onRecordDelivery({
      match_id: match.id,
      innings_number: currentInnings,
      over_number: overNum,
      ball_number: ballNum,
      bowler_name: bowler,
      batsman_name: striker,
      non_striker_name: nonStriker,
      runs_scored: runs,
      is_wicket: false,
      extra_runs: 0
    });
  };

  const handleWicket = (type: 'bowled' | 'caught' | 'run-out') => {
    const overNum = Math.floor(currentOvers);
    const ballNum = Math.round((currentOvers - overNum) * 10) + 1;

    onRecordDelivery({
      match_id: match.id,
      innings_number: currentInnings,
      over_number: overNum,
      ball_number: ballNum,
      bowler_name: bowler,
      batsman_name: striker,
      non_striker_name: nonStriker,
      runs_scored: 0,
      is_wicket: true,
      wicket_type: type,
      extra_runs: 0
    });
  };

  const handleExtra = (type: 'wide' | 'no-ball') => {
    const overNum = Math.floor(currentOvers);
    const ballNum = Math.round((currentOvers - overNum) * 10);

    onRecordDelivery({
      match_id: match.id,
      innings_number: currentInnings,
      over_number: overNum,
      ball_number: ballNum,
      bowler_name: bowler,
      batsman_name: striker,
      non_striker_name: nonStriker,
      runs_scored: 0,
      is_wicket: false,
      extra_type: type,
      extra_runs: 1
    });
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* 1. COMPACT LIVE SCORE HUD (Optimized for one-hand viewing) */}
      <div className="luxury-card p-4 sm:p-5 relative overflow-hidden border border-[var(--border-color)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 uppercase tracking-widest text-[10px]">Match #{match.match_number} Live</span>
          </div>
          <span className="text-[11px] font-mono text-[var(--brand-gold)] font-bold">
            Inn {currentInnings} of 2
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
              Batting Now
            </span>
            <h3 className="text-lg font-black text-[var(--text-main)] truncate max-w-[180px]">
              {battingTeamName}
            </h3>
            <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
              vs {bowlingTeamName}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-mono font-black fire-gradient-text tracking-tight">
              {currentRuns}/{currentWickets}
            </div>
            <p className="text-xs font-mono font-bold text-[var(--text-muted)] mt-0.5">
              {currentOvers} / {match.total_overs} Overs
            </p>
          </div>
        </div>

        {/* Target Indicator for 2nd Innings */}
        {currentInnings === 2 && match.innings2?.target && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Target: {match.innings2.target}</span>
            <span className="font-bold text-[var(--brand-gold)]">
              Need {match.innings2.target - currentRuns} runs
            </span>
          </div>
        )}
      </div>

      {/* 2. ON-FIELD PLAYERS TOUCH BAR */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowPlayerModal(!showPlayerModal)}
          className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-left flex items-center justify-between"
        >
          <div className="truncate">
            <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">On Strike *</span>
            <span className="text-xs font-bold text-[var(--text-main)] truncate block">{striker}</span>
          </div>
          <User className="w-4 h-4 text-[var(--brand-orange)] shrink-0" />
        </button>

        <button
          onClick={() => setShowPlayerModal(!showPlayerModal)}
          className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-left flex items-center justify-between"
        >
          <div className="truncate">
            <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">Bowling</span>
            <span className="text-xs font-bold text-[var(--text-main)] truncate block">{bowler}</span>
          </div>
          <Flame className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
        </button>
      </div>

      {/* Quick Player Name Drawer */}
      {showPlayerModal && (
        <div className="luxury-card p-4 space-y-3 border border-[var(--brand-gold)]/40 bg-[var(--bg-card)]">
          <span className="text-xs font-bold text-[var(--text-main)] block">Set Active Fielders:</span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={striker}
              onChange={(e) => setStriker(e.target.value)}
              placeholder="Striker"
              className="px-2.5 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            />
            <input
              type="text"
              value={nonStriker}
              onChange={(e) => setNonStriker(e.target.value)}
              placeholder="Non-Striker"
              className="px-2.5 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            />
            <input
              type="text"
              value={bowler}
              onChange={(e) => setBowler(e.target.value)}
              placeholder="Bowler"
              className="px-2.5 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
            />
          </div>
          <button
            onClick={() => setShowPlayerModal(false)}
            className="w-full py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[11px] font-bold text-[var(--brand-gold)] border border-[var(--border-color)]"
          >
            Done
          </button>
        </div>
      )}

      {/* 3. ULTRA-FAST FINGER TOUCH SCORING KEYPAD */}
      <div className="luxury-card p-4 sm:p-5 space-y-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] block">
          One-Tap Delivery Record
        </span>

        {/* Primary Run Buttons (Large thumb targets: 56px height) */}
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => handleScoreBall(run)}
              className="h-14 sm:h-16 rounded-2xl bg-[var(--bg-elevated)] active:scale-95 border border-[var(--border-color)] hover:border-[var(--brand-orange)] flex items-center justify-center font-mono font-black text-2xl text-[var(--text-main)] shadow-sm transition"
            >
              {run}
            </button>
          ))}
        </div>

        {/* Extras & Critical Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => handleExtra('wide')}
            className="h-12 rounded-xl bg-amber-500/15 active:scale-95 border border-amber-500/30 text-amber-500 font-black text-xs uppercase tracking-wider transition"
          >
            +1 Wide
          </button>

          <button
            onClick={() => handleExtra('no-ball')}
            className="h-12 rounded-xl bg-amber-500/15 active:scale-95 border border-amber-500/30 text-amber-500 font-black text-xs uppercase tracking-wider transition"
          >
            +1 No Ball
          </button>

          <button
            onClick={() => handleWicket('caught')}
            className="h-12 rounded-xl bg-rose-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-600/30 transition"
          >
            Wicket
          </button>
        </div>

        {/* Safety Actions: Undo & Quick Status */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <button
            onClick={() => onUndoDelivery(match.id)}
            className="flex-1 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] active:scale-95 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Ball</span>
          </button>

          {match.status !== 'Completed' ? (
            <button
              onClick={() => onUpdateStatus(match.id, 'Completed')}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>End Match</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-500 px-3 py-2 bg-emerald-500/10 rounded-xl">
              Match Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
