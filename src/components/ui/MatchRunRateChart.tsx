import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

interface RunRateChartProps {
  matchNumber: number;
  team1Name: string;
  team2Name: string;
}

const matchData = [
  { over: 'Ov 0', team1Runs: 0, team2Runs: 0 },
  { over: 'Ov 1', team1Runs: 12, team2Runs: 8 },
  { over: 'Ov 2', team1Runs: 24, team2Runs: 22 },
  { over: 'Ov 3', team1Runs: 41, team2Runs: 31 },
  { over: 'Ov 4', team1Runs: 52, team2Runs: 48 },
  { over: 'Ov 5', team1Runs: 61, team2Runs: 54 },
  { over: 'Ov 6', team1Runs: 74, team2Runs: 62 },
];

export const MatchRunRateChart: React.FC<RunRateChartProps> = ({
  matchNumber,
  team1Name,
  team2Name,
}) => {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7938]">
            Innings Worm & Run Rate Trajectory
          </span>
          <h4 className="text-sm font-black text-white">
            Match #{matchNumber}: Cumulative Progression
          </h4>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />
            <span className="text-zinc-300 font-bold">{team1Name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B0FF]" />
            <span className="text-zinc-300 font-bold">{team2Name}</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={matchData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTeam1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5722" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF5722" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTeam2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B0FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00B0FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.5} />
            <XAxis dataKey="over" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#191919',
                borderColor: '#3f3f46',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              }}
            />
            <Area
              type="monotone"
              dataKey="team1Runs"
              name={team1Name}
              stroke="#FF5722"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTeam1)"
            />
            <Area
              type="monotone"
              dataKey="team2Runs"
              name={team2Name}
              stroke="#00B0FF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTeam2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

