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
import { 
  INITIAL_REGISTRATIONS, 
  INITIAL_TEAMS, 
  INITIAL_MATCHES, 
  INITIAL_FINANCES, 
  INITIAL_TASKS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_SPONSORS, 
  INITIAL_SETTINGS, 
  INITIAL_ADMINS 
} from '../data/mockData';
import { syncRegistrationsToExcel } from '../services/excelService';

interface AppContextType {
  // Registrations
  registrations: PlayerRegistration[];
  addRegistration: (reg: Omit<PlayerRegistration, 'id' | 'created_at' | 'status' | 'category' | 'synced_to_excel'>) => Promise<string>;
  updateRegistrationStatus: (id: string, status: PlayerRegistration['status'], category?: PlayerCategory, notes?: string) => void;
  updatePlayerCategory: (id: string, category: PlayerCategory) => void;
  assignPlayerToTeam: (playerId: string, teamId: string | null) => void;
  
  // Teams
  teams: Team[];
  updateTeam: (team: Team) => void;
  addTeam: (team: Omit<Team, 'id' | 'created_at'>) => void;
  setTeamCaptain: (teamId: string, captainId: string, captainName: string) => void;

  // Random Allocation Engine
  runRandomAllocation: (category: 'A' | 'B' | 'C' | 'ALL') => { allocated: number; details: string };
  resetAllocations: () => void;

  // Matches & Scoring
  matches: Match[];
  deliveries: Record<string, MatchDelivery[]>; // matchId -> deliveries
  recordDelivery: (delivery: Omit<MatchDelivery, 'id' | 'timestamp'>) => void;
  undoLastDelivery: (matchId: string) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;

  // Finances
  finances: ExpenseTransaction[];
  addTransaction: (tx: Omit<ExpenseTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  // Tasks
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'comments_count'>) => void;
  updateTaskStatus: (id: string, status: TaskItem['status']) => void;

  // Announcements & Sponsors
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'published_at'>) => void;
  sponsors: Sponsor[];

  // Settings & Admins
  settings: TournamentSettings;
  updateSettings: (settings: Partial<TournamentSettings>) => void;
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (admin: AdminUser | null) => void;

  // Excel sync state
  lastExcelSync: string | null;
  triggerManualExcelSync: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback
  const [registrations, setRegistrations] = useState<PlayerRegistration[]>(() => {
    const saved = localStorage.getItem('gspl_registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('gspl_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('gspl_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [deliveries, setDeliveries] = useState<Record<string, MatchDelivery[]>>(() => {
    const saved = localStorage.getItem('gspl_deliveries');
    return saved ? JSON.parse(saved) : {};
  });

  const [finances, setFinances] = useState<ExpenseTransaction[]>(() => {
    const saved = localStorage.getItem('gspl_finances');
    return saved ? JSON.parse(saved) : INITIAL_FINANCES;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('gspl_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('gspl_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [sponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);
  const [settings, setSettings] = useState<TournamentSettings>(INITIAL_SETTINGS);
  const [admins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(INITIAL_ADMINS[0]);
  const [lastExcelSync, setLastExcelSync] = useState<string | null>(null);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem('gspl_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('gspl_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('gspl_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('gspl_finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('gspl_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gspl_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Sync to Excel on registrations change
  const triggerManualExcelSync = async () => {
    const res = await syncRegistrationsToExcel(registrations);
    if (res.success) {
      setLastExcelSync(res.syncedAt);
    }
  };

  // 1. Add Registration
  const addRegistration = async (regData: Omit<PlayerRegistration, 'id' | 'created_at' | 'status' | 'category' | 'synced_to_excel'>): Promise<string> => {
    const nextNumber = registrations.length + 1;
    const newId = `GSPL-2026-${String(nextNumber).padStart(3, '0')}`;
    
    // Auto-suggest category based on cricket frequency
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

    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    await syncRegistrationsToExcel(updated);
    setLastExcelSync(new Date().toLocaleTimeString());
    return newId;
  };

  // 2. Update Registration Status
  const updateRegistrationStatus = (id: string, status: PlayerRegistration['status'], category?: PlayerCategory, notes?: string) => {
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
  };

  // 3. Update Category
  const updatePlayerCategory = (id: string, category: PlayerCategory) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, category } : r));
  };

  // 4. Assign Team
  const assignPlayerToTeam = (playerId: string, teamId: string | null) => {
    setRegistrations(prev => prev.map(r => r.id === playerId ? { ...r, assigned_team_id: teamId } : r));
  };

  // 5. Team Management
  const updateTeam = (updated: Team) => {
    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'created_at'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${teams.length + 1}`,
      created_at: new Date().toISOString()
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const setTeamCaptain = (teamId: string, captainId: string, captainName: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, captain_id: captainId, captain_name: captainName } : t));
    // Assign captain player to this team
    assignPlayerToTeam(captainId, teamId);
  };

  // 6. Random Category Allocation Algorithm
  const runRandomAllocation = (categoryFilter: 'A' | 'B' | 'C' | 'ALL') => {
    if (teams.length === 0) {
      return { allocated: 0, details: 'No teams created to allocate players to.' };
    }

    const captainIds = new Set(teams.map(t => t.captain_id).filter(Boolean) as string[]);
    
    // Pick eligible players: approved, not already captains, and match category
    const eligible = registrations.filter(r => {
      if (r.status !== 'Approved') return false;
      if (captainIds.has(r.id)) return false;
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      return true;
    });

    if (eligible.length === 0) {
      return { allocated: 0, details: `No unassigned approved players found for Category ${categoryFilter}.` };
    }

    // Shuffle using Fisher-Yates genuine random algorithm
    const shuffled = [...eligible];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Distribute evenly across teams
    const newRegistrations = [...registrations];
    shuffled.forEach((player, idx) => {
      const assignedTeam = teams[idx % teams.length];
      const target = newRegistrations.find(r => r.id === player.id);
      if (target) {
        target.assigned_team_id = assignedTeam.id;
      }
    });

    setRegistrations(newRegistrations);
    return { 
      allocated: shuffled.length, 
      details: `Evenly randomized ${shuffled.length} players across ${teams.length} teams.` 
    };
  };

  const resetAllocations = () => {
    const captainIds = new Set(teams.map(t => t.captain_id).filter(Boolean) as string[]);
    setRegistrations(prev => prev.map(r => {
      if (captainIds.has(r.id)) return r; // preserve captains
      return { ...r, assigned_team_id: null };
    }));
  };

  // 7. Live Scoring Deliveries
  const recordDelivery = (deliveryData: Omit<MatchDelivery, 'id' | 'timestamp'>) => {
    const newDelivery: MatchDelivery = {
      ...deliveryData,
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    setDeliveries(prev => {
      const list = prev[deliveryData.match_id] || [];
      return {
        ...prev,
        [deliveryData.match_id]: [...list, newDelivery]
      };
    });

    // Update match score snapshot
    setMatches(prev => prev.map(m => {
      if (m.id !== deliveryData.match_id) return m;
      
      const currentInnings = m.current_innings || 1;
      const inningsKey = currentInnings === 1 ? 'innings1' : 'innings2';
      const existingInnings = m[inningsKey] || {
        batting_team_id: currentInnings === 1 ? m.team1_id : m.team2_id,
        runs: 0,
        wickets: 0,
        overs_bowled: 0,
        ...(currentInnings === 2 ? { target: (m.innings1?.runs || 0) + 1 } : {})
      };

      const runsFromDelivery = deliveryData.runs_scored + deliveryData.extra_runs;
      const isLegalBall = deliveryData.extra_type !== 'wide' && deliveryData.extra_type !== 'no-ball';
      
      // Calculate updated overs bowled
      const currentOvers = existingInnings.overs_bowled;
      const completedOvers = Math.floor(currentOvers);
      const currentBalls = Math.round((currentOvers - completedOvers) * 10);
      let newCompletedOvers = completedOvers;
      let newBalls = currentBalls;

      if (isLegalBall) {
        if (currentBalls + 1 >= 6) {
          newCompletedOvers += 1;
          newBalls = 0;
        } else {
          newBalls += 1;
        }
      }

      const newOversBowled = Number(`${newCompletedOvers}.${newBalls}`);

      return {
        ...m,
        status: 'Live',
        [inningsKey]: {
          ...existingInnings,
          runs: existingInnings.runs + runsFromDelivery,
          wickets: existingInnings.wickets + (deliveryData.is_wicket ? 1 : 0),
          overs_bowled: newOversBowled
        }
      };
    }));
  };

  const undoLastDelivery = (matchId: string) => {
    const list = deliveries[matchId];
    if (!list || list.length === 0) return;
    const removed = list[list.length - 1];
    setDeliveries(prev => ({
      ...prev,
      [matchId]: list.slice(0, -1)
    }));

    // Adjust match scores back
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const currentInnings = m.current_innings || 1;
      const inningsKey = currentInnings === 1 ? 'innings1' : 'innings2';
      const inn = m[inningsKey];
      if (!inn) return m;

      const runs = inn.runs - (removed.runs_scored + removed.extra_runs);
      const wickets = inn.wickets - (removed.is_wicket ? 1 : 0);

      return {
        ...m,
        [inningsKey]: {
          ...inn,
          runs: Math.max(0, runs),
          wickets: Math.max(0, wickets)
        }
      };
    }));
  };

  const updateMatchStatus = (matchId: string, status: Match['status']) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));
  };

  // 8. Finances
  const addTransaction = (tx: Omit<ExpenseTransaction, 'id'>) => {
    const newTx: ExpenseTransaction = {
      ...tx,
      id: `fin-${Date.now()}`
    };
    setFinances(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setFinances(prev => prev.filter(f => f.id !== id));
  };

  // 9. Tasks
  const addTask = (taskData: Omit<TaskItem, 'id' | 'comments_count'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      comments_count: 0
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskItem['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  // 10. Announcements
  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'published_at'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      published_at: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  // 11. Settings
  const updateSettings = (newSettings: Partial<TournamentSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
        sponsors,
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

