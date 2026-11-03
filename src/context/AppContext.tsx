import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PlayerRegistration, 
  Team, 
  Match, 
  ExpenseTransaction, 
  TaskItem, 
  Announcement, 
  Sponsor, 
  AdminUser, 
  TournamentSettings, 
  PlayerCategory, 
  MatchDelivery 
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { syncRegistrationsToExcel } from '../services/excelService';

interface AppContextType {
  // Registrations
  registrations: PlayerRegistration[];
  addRegistration: (reg: Omit<PlayerRegistration, 'id' | 'created_at' | 'status' | 'category' | 'synced_to_excel'>) => Promise<string>;
  updateRegistrationStatus: (id: string, status: PlayerRegistration['status'], category?: PlayerCategory, notes?: string) => Promise<void>;
  updatePlayerCategory: (id: string, category: PlayerCategory) => Promise<void>;
  assignPlayerToTeam: (playerId: string, teamId: string | null) => Promise<void>;
  
  // Teams
  teams: Team[];
  updateTeam: (team: Team) => Promise<void>;
  addTeam: (team: Omit<Team, 'id' | 'created_at'>) => Promise<void>;
  setTeamCaptain: (teamId: string, captainId: string, captainName: string) => Promise<void>;

  // Random Allocation Engine
  runRandomAllocation: (category: 'A' | 'B' | 'C' | 'ALL') => { allocated: number; details: string };
  resetAllocations: () => Promise<void>;

  // Matches & Scoring
  matches: Match[];
  deliveries: Record<string, MatchDelivery[]>;
  recordDelivery: (delivery: Omit<MatchDelivery, 'id' | 'timestamp'>) => Promise<void>;
  undoLastDelivery: (matchId: string) => Promise<void>;
  updateMatchStatus: (matchId: string, status: Match['status']) => Promise<void>;

  // Finances
  finances: ExpenseTransaction[];
  addTransaction: (tx: Omit<ExpenseTransaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Tasks
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'comments_count'>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskItem['status']) => Promise<void>;

  // Announcements & Sponsors
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'published_at'>) => Promise<void>;
  sponsors: Sponsor[];

  // Settings & Admin
  settings: TournamentSettings;
  updateSettings: (settings: Partial<TournamentSettings>) => Promise<void>;
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (admin: AdminUser | null) => void;

  // Excel sync state
  lastExcelSync: string | null;
  triggerManualExcelSync: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<PlayerRegistration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [deliveries, setDeliveries] = useState<Record<string, MatchDelivery[]>>({});
  const [finances, setFinances] = useState<ExpenseTransaction[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [lastExcelSync, setLastExcelSync] = useState<string | null>(null);

  const defaultAdmin: AdminUser = {
    id: 'gspl-admin-master',
    name: 'GSPL Committee Admin',
    email: 'gokulshristipremierleague@gmail.com',
    role: 'Super Admin',
    created_at: new Date().toISOString()
  };

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(defaultAdmin);
  const [admins] = useState<AdminUser[]>([defaultAdmin]);

  const [settings, setSettings] = useState<TournamentSettings>({
    id: 'gspl_active_config',
    tournament_name: 'Gokul Shrishti Premier League',
    edition: 'Season 2',
    tagline: 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.',
    registration_open: true,
    registration_deadline: '2026-11-30T23:59:59+05:30',
    max_overs: 6,
    box_cricket_rules: {
      runs_per_boundary_net: 4,
      no_ball_free_hit: true,
      wide_run: 1,
      direct_out_of_box: 'Out',
      underarm_bowling_allowed: false
    },
    excel_sync_enabled: true
  });

  // Fetch initial live data from Supabase
  const loadDatabaseState = async () => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Registrations
      const { data: regData } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      if (regData) setRegistrations(regData as PlayerRegistration[]);

      // 2. Teams
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: true });
      if (teamData) setTeams(teamData as Team[]);

      // 3. Matches
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .order('match_number', { ascending: true });
      if (matchData) setMatches(matchData as Match[]);

      // 4. Finances
      const { data: finData } = await supabase
        .from('finances')
        .select('*')
        .order('date', { ascending: false });
      if (finData) setFinances(finData as ExpenseTransaction[]);

      // 5. Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (taskData) setTasks(taskData as TaskItem[]);

    } catch (err) {
      console.error('Failed to query Supabase state:', err);
    }
  };

  useEffect(() => {
    loadDatabaseState();

    // Subscribe to Supabase Realtime Channels
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('gspl-realtime-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
          supabase.from('registrations').select('*').order('created_at', { ascending: false }).then(({ data }) => {
            if (data) setRegistrations(data as PlayerRegistration[]);
          });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
          supabase.from('teams').select('*').then(({ data }) => {
            if (data) setTeams(data as Team[]);
          });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
          supabase.from('matches').select('*').order('match_number', { ascending: true }).then(({ data }) => {
            if (data) setMatches(data as Match[]);
          });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'finances' }, () => {
          supabase.from('finances').select('*').then(({ data }) => {
            if (data) setFinances(data as ExpenseTransaction[]);
          });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
          supabase.from('tasks').select('*').then(({ data }) => {
            if (data) setTasks(data as TaskItem[]);
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // 1. Add Registration (Live Supabase Insert)
  const addRegistration = async (regData: Omit<PlayerRegistration, 'id' | 'created_at' | 'status' | 'category' | 'synced_to_excel'>): Promise<string> => {
    const nextNumber = registrations.length + 1;
    const newId = `GSPL-2026-${String(nextNumber).padStart(3, '0')}`;
    
    let initialCategory: PlayerCategory = 'B';
    if (regData.cricket_frequency === 'Regularly') initialCategory = 'A';
    if (regData.cricket_frequency === 'Rarely / First time') initialCategory = 'C';

    const newReg: PlayerRegistration = {
      ...regData,
      id: newId,
      created_at: new Date().toISOString(),
      status: 'Pending',
      category: initialCategory,
      synced_to_excel: true
    };

    // Optimistic UI update
    setRegistrations(prev => [newReg, ...prev]);

    // Persist to Supabase
    if (isSupabaseConfigured) {
      await supabase.from('registrations').insert([newReg]);
    }

    syncRegistrationsToExcel([newReg, ...registrations]);
    setLastExcelSync(new Date().toLocaleTimeString());
    return newId;
  };

  // 2. Update Registration Status
  const updateRegistrationStatus = async (id: string, status: PlayerRegistration['status'], category?: PlayerCategory, notes?: string) => {
    setRegistrations(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          category: category || r.category,
          admin_notes: notes !== undefined ? notes : r.admin_notes
        };
      }
      return r;
    }));

    if (isSupabaseConfigured) {
      await supabase.from('registrations').update({
        status,
        category,
        admin_notes: notes,
        updated_at: new Date().toISOString()
      }).eq('id', id);
    }
  };

  // 3. Update Category
  const updatePlayerCategory = async (id: string, category: PlayerCategory) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, category } : r));
    if (isSupabaseConfigured) {
      await supabase.from('registrations').update({ category }).eq('id', id);
    }
  };

  // 4. Assign Team
  const assignPlayerToTeam = async (playerId: string, teamId: string | null) => {
    setRegistrations(prev => prev.map(r => r.id === playerId ? { ...r, assigned_team_id: teamId } : r));
    if (isSupabaseConfigured) {
      await supabase.from('registrations').update({ assigned_team_id: teamId }).eq('id', playerId);
    }
  };

  // 5. Team Management
  const updateTeam = async (updated: Team) => {
    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (isSupabaseConfigured) {
      await supabase.from('teams').update(updated).eq('id', updated.id);
    }
  };

  const addTeam = async (teamData: Omit<Team, 'id' | 'created_at'>) => {
    const newTeam: Team = {
      ...teamData,
      id: crypto.randomUUID ? crypto.randomUUID() : `team-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setTeams(prev => [...prev, newTeam]);
    if (isSupabaseConfigured) {
      await supabase.from('teams').insert([newTeam]);
    }
  };

  const setTeamCaptain = async (teamId: string, captainId: string, captainName: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, captain_id: captainId, captain_name: captainName } : t));
    assignPlayerToTeam(captainId, teamId);
    if (isSupabaseConfigured) {
      await supabase.from('teams').update({ captain_id: captainId, captain_name: captainName }).eq('id', teamId);
    }
  };

  // 6. Random Category Allocation Algorithm
  const runRandomAllocation = (categoryFilter: 'A' | 'B' | 'C' | 'ALL') => {
    if (teams.length === 0) {
      return { allocated: 0, details: 'No teams created to allocate players to.' };
    }

    const captainIds = new Set(teams.map(t => t.captain_id).filter(Boolean) as string[]);
    
    const eligible = registrations.filter(r => {
      if (r.status !== 'Approved') return false;
      if (captainIds.has(r.id)) return false;
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      return true;
    });

    if (eligible.length === 0) {
      return { allocated: 0, details: `No unassigned approved players found for Category ${categoryFilter}.` };
    }

    const shuffled = [...eligible].sort(() => Math.random() - 0.5);

    let teamIdx = 0;
    const assignments: { playerId: string; teamId: string }[] = [];

    shuffled.forEach(player => {
      const targetTeam = teams[teamIdx % teams.length];
      assignments.push({ playerId: player.id, teamId: targetTeam.id });
      teamIdx++;
    });

    assignments.forEach(a => {
      assignPlayerToTeam(a.playerId, a.teamId);
    });

    return {
      allocated: assignments.length,
      details: `Evenly drafted ${assignments.length} players across ${teams.length} teams.`
    };
  };

  const resetAllocations = async () => {
    const captainIds = new Set(teams.map(t => t.captain_id).filter(Boolean) as string[]);
    setRegistrations(prev => prev.map(r => {
      if (captainIds.has(r.id)) return r;
      return { ...r, assigned_team_id: null };
    }));

    if (isSupabaseConfigured) {
      await supabase.from('registrations').update({ assigned_team_id: null }).neq('id', '');
    }
  };

  // 7. Matches & Scoring
  const recordDelivery = async (delData: Omit<MatchDelivery, 'id' | 'timestamp'>) => {
    const newDelivery: MatchDelivery = {
      ...delData,
      id: crypto.randomUUID ? crypto.randomUUID() : `del-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setDeliveries(prev => ({
      ...prev,
      [delData.match_id]: [...(prev[delData.match_id] || []), newDelivery]
    }));

    if (isSupabaseConfigured) {
      await supabase.from('match_deliveries').insert([newDelivery]);
    }
  };

  const undoLastDelivery = async (matchId: string) => {
    const list = deliveries[matchId] || [];
    if (list.length === 0) return;
    const last = list[list.length - 1];
    setDeliveries(prev => ({
      ...prev,
      [matchId]: list.slice(0, -1)
    }));
    if (isSupabaseConfigured && last) {
      await supabase.from('match_deliveries').delete().eq('id', last.id);
    }
  };

  const updateMatchStatus = async (matchId: string, status: Match['status']) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));
    if (isSupabaseConfigured) {
      await supabase.from('matches').update({ status }).eq('id', matchId);
    }
  };

  // 8. Finances
  const addTransaction = async (txData: Omit<ExpenseTransaction, 'id'>) => {
    const newTx: ExpenseTransaction = {
      ...txData,
      id: crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`
    };
    setFinances(prev => [newTx, ...prev]);
    if (isSupabaseConfigured) {
      await supabase.from('finances').insert([newTx]);
    }
  };

  const deleteTransaction = async (id: string) => {
    setFinances(prev => prev.filter(f => f.id !== id));
    if (isSupabaseConfigured) {
      await supabase.from('finances').delete().eq('id', id);
    }
  };

  // 9. Tasks
  const addTask = async (taskData: Omit<TaskItem, 'id' | 'comments_count'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      comments_count: 0
    };
    setTasks(prev => [newTask, ...prev]);
    if (isSupabaseConfigured) {
      await supabase.from('tasks').insert([newTask]);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskItem['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (isSupabaseConfigured) {
      await supabase.from('tasks').update({ status }).eq('id', id);
    }
  };

  // 10. Announcements
  const addAnnouncement = async (annData: Omit<Announcement, 'id' | 'published_at'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: crypto.randomUUID ? crypto.randomUUID() : `ann-${Date.now()}`,
      published_at: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateSettings = async (newSettings: Partial<TournamentSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const triggerManualExcelSync = async () => {
    const res = await syncRegistrationsToExcel(registrations);
    if (res.success) {
      setLastExcelSync(res.syncedAt);
    }
  };

  return (
    <AppContext.Provider
      value={{
        registrations,
        addRegistration,
        updateRegistrationStatus,
        updatePlayerCategory,
        assignPlayerToTeam,
        teams,
        updateTeam,
        addTeam,
        setTeamCaptain,
        runRandomAllocation,
        resetAllocations,
        matches,
        deliveries,
        recordDelivery,
        undoLastDelivery,
        updateMatchStatus,
        finances,
        addTransaction,
        deleteTransaction,
        tasks,
        addTask,
        updateTaskStatus,
        announcements,
        addAnnouncement,
        sponsors: [],
        settings,
        updateSettings,
        admins,
        currentAdmin,
        setCurrentAdmin,
        lastExcelSync,
        triggerManualExcelSync
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
