import { 
  PlayerRegistration, 
  Team, 
  Match, 
  ExpenseTransaction, 
  TaskItem, 
  Announcement, 
  Sponsor,
  AdminUser,
  TournamentSettings
} from '../types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Shrishti Strikers',
    short_code: 'SS',
    logo_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150&auto=format&fit=crop&q=80',
    primary_color: '#FF5722',
    secondary_color: '#1E1E1E',
    captain_id: 'GSPL-2026-001',
    captain_name: 'Rajdeep Yadav',
    description: 'Aggressive top-order with clinical death-over box control.',
    created_at: new Date().toISOString()
  },
  {
    id: 'team-2',
    name: 'Gokul Gladiators',
    short_code: 'GG',
    logo_url: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=150&auto=format&fit=crop&q=80',
    primary_color: '#00B0FF',
    secondary_color: '#0F172A',
    captain_id: 'GSPL-2026-004',
    captain_name: 'Amit Sharma',
    description: 'Disciplined swing bowlers and rapid between-the-wickets runners.',
    created_at: new Date().toISOString()
  },
  {
    id: 'team-3',
    name: 'Phoenix Blasters',
    short_code: 'PB',
    logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
    primary_color: '#FF7938',
    secondary_color: '#1A0B05',
    captain_id: 'GSPL-2026-007',
    captain_name: 'Karan Patel',
    description: 'High boundary conversion rate and specialized net hitters.',
    created_at: new Date().toISOString()
  },
  {
    id: 'team-4',
    name: 'Wing Royals',
    short_code: 'WR',
    logo_url: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=150&auto=format&fit=crop&q=80',
    primary_color: '#E040FB',
    secondary_color: '#16081E',
    captain_id: 'GSPL-2026-010',
    captain_name: 'Vikram Desai',
    description: 'Tactical fielding unit specializing in tight line pressure.',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_REGISTRATIONS: PlayerRegistration[] = [
  {
    id: 'GSPL-2026-001',
    full_name: 'Rajdeep Yadav',
    age: 26,
    cricket_frequency: 'Regularly',
    wing: 'A',
    flat_number: '502',
    tshirt_size: 'L',
    captaincy_interest: true,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-25T10:30:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-1',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-002',
    full_name: 'Rahul Mehta',
    age: 29,
    cricket_frequency: 'Regularly',
    wing: 'A',
    flat_number: '204',
    tshirt_size: 'M',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-25T11:15:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-1',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-003',
    full_name: 'Siddharth Joshi',
    age: 33,
    cricket_frequency: 'Occasionally',
    wing: 'B',
    flat_number: '801',
    tshirt_size: 'XL',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-25T12:00:00Z',
    status: 'Approved',
    category: 'B',
    assigned_team_id: 'team-1',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-004',
    full_name: 'Amit Sharma',
    age: 31,
    cricket_frequency: 'Regularly',
    wing: 'B',
    flat_number: '302',
    tshirt_size: 'L',
    captaincy_interest: true,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-25T13:45:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-2',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-005',
    full_name: 'Deepak Varma',
    age: 24,
    cricket_frequency: 'Occasionally',
    wing: 'B',
    flat_number: '103',
    tshirt_size: 'M',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-26T09:20:00Z',
    status: 'Approved',
    category: 'B',
    assigned_team_id: 'team-2',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-006',
    full_name: 'Manoj Nair',
    age: 38,
    cricket_frequency: 'Rarely / First time',
    wing: 'A',
    flat_number: '704',
    tshirt_size: 'XL',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-26T10:05:00Z',
    status: 'Approved',
    category: 'C',
    assigned_team_id: 'team-2',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-007',
    full_name: 'Karan Patel',
    age: 28,
    cricket_frequency: 'Regularly',
    wing: 'C',
    flat_number: '401',
    tshirt_size: 'L',
    captaincy_interest: true,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-26T14:30:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-3',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-008',
    full_name: 'Aniket Kulkarni',
    age: 22,
    cricket_frequency: 'Regularly',
    wing: 'C',
    flat_number: '603',
    tshirt_size: 'S',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-27T08:15:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-3',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-009',
    full_name: 'Pranav Iyer',
    age: 35,
    cricket_frequency: 'Rarely / First time',
    wing: 'B',
    flat_number: '902',
    tshirt_size: 'L',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-27T16:40:00Z',
    status: 'Approved',
    category: 'C',
    assigned_team_id: 'team-3',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-010',
    full_name: 'Vikram Desai',
    age: 34,
    cricket_frequency: 'Regularly',
    wing: 'C',
    flat_number: '201',
    tshirt_size: 'M',
    captaincy_interest: true,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-28T11:00:00Z',
    status: 'Approved',
    category: 'A',
    assigned_team_id: 'team-4',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-011',
    full_name: 'Nikhil Rane',
    age: 27,
    cricket_frequency: 'Occasionally',
    wing: 'A',
    flat_number: '102',
    tshirt_size: 'M',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-28T14:10:00Z',
    status: 'Approved',
    category: 'B',
    assigned_team_id: 'team-4',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-012',
    full_name: 'Suresh Bhat',
    age: 42,
    cricket_frequency: 'Rarely / First time',
    wing: 'Other',
    flat_number: 'Row House 4',
    tshirt_size: 'XXL',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-29T10:00:00Z',
    status: 'Approved',
    category: 'C',
    assigned_team_id: 'team-4',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-013',
    full_name: 'Rohan Gupta',
    age: 25,
    cricket_frequency: 'Regularly',
    wing: 'B',
    flat_number: '504',
    tshirt_size: 'L',
    captaincy_interest: true,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-30T12:00:00Z',
    status: 'Pending',
    category: 'A',
    synced_to_excel: true
  },
  {
    id: 'GSPL-2026-014',
    full_name: 'Gaurav Sawant',
    age: 30,
    cricket_frequency: 'Occasionally',
    wing: 'C',
    flat_number: '304',
    tshirt_size: 'XL',
    captaincy_interest: false,
    terms_accepted: true,
    terms_version: 'v1.0-2026',
    created_at: '2026-10-31T09:30:00Z',
    status: 'Pending',
    category: 'B',
    synced_to_excel: true
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    match_number: 1,
    stage: 'League',
    team1_id: 'team-1',
    team2_id: 'team-2',
    team1_name: 'Shrishti Strikers',
    team2_name: 'Gokul Gladiators',
    date_time: '2026-11-05T18:00:00+05:30',
    venue: 'Gokul Shrishti Central Box Ground',
    total_overs: 6,
    status: 'Completed',
    toss_winner: 'team-1',
    toss_decision: 'bat',
    current_innings: 2,
    innings1: {
      batting_team_id: 'team-1',
      runs: 68,
      wickets: 3,
      overs_bowled: 6.0
    },
    innings2: {
      batting_team_id: 'team-2',
      runs: 62,
      wickets: 5,
      overs_bowled: 6.0,
      target: 69
    },
    winner_team_id: 'team-1',
    result_description: 'Shrishti Strikers won by 6 runs',
    player_of_match: 'Rajdeep Yadav (34* off 14)'
  },
  {
    id: 'match-2',
    match_number: 2,
    stage: 'League',
    team1_id: 'team-3',
    team2_id: 'team-4',
    team1_name: 'Phoenix Blasters',
    team2_name: 'Wing Royals',
    date_time: '2026-11-05T19:30:00+05:30',
    venue: 'Gokul Shrishti Central Box Ground',
    total_overs: 6,
    status: 'Live',
    toss_winner: 'team-3',
    toss_decision: 'bat',
    current_innings: 2,
    innings1: {
      batting_team_id: 'team-3',
      runs: 74,
      wickets: 4,
      overs_bowled: 6.0
    },
    innings2: {
      batting_team_id: 'team-4',
      runs: 48,
      wickets: 2,
      overs_bowled: 4.1,
      target: 75
    }
  },
  {
    id: 'match-3',
    match_number: 3,
    stage: 'League',
    team1_id: 'team-1',
    team2_id: 'team-3',
    team1_name: 'Shrishti Strikers',
    team2_name: 'Phoenix Blasters',
    date_time: '2026-11-06T18:00:00+05:30',
    venue: 'Gokul Shrishti Central Box Ground',
    total_overs: 6,
    status: 'Upcoming'
  },
  {
    id: 'match-4',
    match_number: 4,
    stage: 'League',
    team1_id: 'team-2',
    team2_id: 'team-4',
    team1_name: 'Gokul Gladiators',
    team2_name: 'Wing Royals',
    date_time: '2026-11-06T19:30:00+05:30',
    venue: 'Gokul Shrishti Central Box Ground',
    total_overs: 6,
    status: 'Upcoming'
  }
];

export const INITIAL_FINANCES: ExpenseTransaction[] = [
  {
    id: 'fin-1',
    type: 'Income',
    title: 'Title Sponsorship - Gokul Retail & Pharmacy',
    category: 'Sponsorship',
    amount: 15000,
    date: '2026-10-20',
    paid_by: 'Gokul Retail',
    payment_method: 'UPI',
    created_by_admin: 'Super Admin',
    notes: 'Primary kit and banner sponsorship'
  },
  {
    id: 'fin-2',
    type: 'Income',
    title: 'Player Entry Contributions (30 Players)',
    category: 'Miscellaneous',
    amount: 9000,
    date: '2026-10-26',
    paid_by: 'Resident Players',
    payment_method: 'UPI',
    created_by_admin: 'Super Admin',
    notes: '₹300 per registered resident player'
  },
  {
    id: 'fin-3',
    type: 'Expense',
    title: 'Premium Heavy Cricket Tennis Balls (12 Boxes)',
    category: 'Equipment',
    amount: 3200,
    date: '2026-10-27',
    paid_by: 'Tournament Commitee',
    payment_method: 'UPI',
    created_by_admin: 'Super Admin',
    notes: 'Nivia Heavy Tennis Balls'
  },
  {
    id: 'fin-4',
    type: 'Expense',
    title: 'Box Net Repair and Side Safety Padding',
    category: 'Ground and venue',
    amount: 4500,
    date: '2026-10-28',
    paid_by: 'Secretary Desk',
    payment_method: 'Cash',
    created_by_admin: 'Super Admin',
    notes: 'Enclosure netting repair in central quad'
  },
  {
    id: 'fin-5',
    type: 'Expense',
    title: 'Championship Trophy & Individual Medals',
    category: 'Trophies and medals',
    amount: 5800,
    date: '2026-10-29',
    paid_by: 'Tournament Committee',
    payment_method: 'Bank Transfer',
    created_by_admin: 'Super Admin',
    notes: 'Winner, Runner Up, Orange/Purple Cap & Fairplay awards'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk-1',
    title: 'Finalize Box Net Pitch Markings & Crease Lines',
    description: 'Ensure accurate white tape markings for popping crease, return crease and dead net zones.',
    assigned_to: 'Tournament Admin',
    priority: 'Urgent',
    status: 'In Progress',
    deadline: '2026-11-03',
    comments_count: 3
  },
  {
    id: 'tsk-2',
    title: 'Distribute Customized Jersey Kits',
    description: 'Batch organize T-shirts size-wise and wing-wise for captain handover.',
    assigned_to: 'Tournament Admin',
    priority: 'High',
    status: 'To Do',
    deadline: '2026-11-04',
    comments_count: 1
  },
  {
    id: 'tsk-3',
    title: 'Setup PA System & Live Audio Scoring Screen',
    description: 'Test speaker output, microphone connectivity and live tablet feed in arena tent.',
    assigned_to: 'Scoring Admin',
    priority: 'High',
    status: 'To Do',
    deadline: '2026-11-04',
    comments_count: 2
  },
  {
    id: 'tsk-4',
    title: 'First Aid Kit & Ice Packs Inspection',
    description: 'Equip box dugout with pain relief spray, bandages and cold compress reserves.',
    assigned_to: 'Super Admin',
    priority: 'Medium',
    status: 'Completed',
    deadline: '2026-10-30',
    comments_count: 0
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'GSPL 2026 Official Fixtures & Rulebook Released',
    content: 'The organizing committee has published the official match schedule. Box rules: 6 overs per side, direct-out-of-box is wicket, 1 bowler can bowl a maximum of 2 overs.',
    category: 'Fixtures',
    is_pinned: true,
    published_at: '2026-10-31T18:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Player Registrations Close on November 3rd',
    content: 'All residents of Wing A, B and C are requested to complete their entries online. Random category allocation will take place live.',
    category: 'Important',
    is_pinned: false,
    published_at: '2026-10-30T10:00:00Z'
  }
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'Gokul Supermarket & Retail',
    category: 'Title Sponsor',
    logo_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://gokulshrishti.in'
  },
  {
    id: 'sp-2',
    name: 'FitPulse Society Gym',
    category: 'Powered By',
    logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://fitpulse.club'
  },
  {
    id: 'sp-3',
    name: 'Shree Krishna Sweets & Snacks',
    category: 'Beverage Partner',
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SETTINGS: TournamentSettings = {
  id: 'gspl_active_config',
  tournament_name: 'Gokul Shrishti Premier League',
  edition: 'Season 2026',
  tagline: 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.',
  registration_open: true,
  registration_deadline: '2026-11-03T23:59:59+05:30',
  max_overs: 6,
  box_cricket_rules: {
    runs_per_boundary_net: 4,
    no_ball_free_hit: true,
    wide_run: 1,
    direct_out_of_box: 'Out',
    underarm_bowling_allowed: false
  },
  excel_sync_enabled: true,
  excel_file_id: 'GSPL_2026_Live_Registrations.xlsx'
};

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Rajdeep Yadav',
    email: 'admin@gspl.cricket',
    role: 'Super Admin',
    created_at: '2026-10-01T00:00:00Z'
  },
  {
    id: 'admin-2',
    name: 'Vikram Joshi',
    email: 'tournament@gspl.cricket',
    role: 'Tournament Admin',
    created_at: '2026-10-05T00:00:00Z'
  },
  {
    id: 'admin-3',
    name: 'Suresh Patil',
    email: 'finance@gspl.cricket',
    role: 'Finance Admin',
    created_at: '2026-10-05T00:00:00Z'
  },
  {
    id: 'admin-4',
    name: 'Karan Dave',
    email: 'scoring@gspl.cricket',
    role: 'Scoring Admin',
    created_at: '2026-10-05T00:00:00Z'
  }
];

