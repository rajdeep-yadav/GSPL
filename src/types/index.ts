export type CricketFrequency = 'Regularly' | 'Occasionally' | 'Rarely / First time';
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type BuildingWing = 'A' | 'B' | 'C' | 'Other';
export type PlayerCategory = 'A' | 'B' | 'C' | 'Unassigned';
export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface PlayerRegistration {
  id: string; // e.g., GSPL-2026-001
  full_name: string;
  age: number;
  cricket_frequency: CricketFrequency;
  wing: BuildingWing;
  flat_number: string;
  tshirt_size: TShirtSize;
  captaincy_interest: boolean;
  terms_accepted: boolean;
  terms_version: string;
  created_at: string;
  status: RegistrationStatus;
  category: PlayerCategory;
  admin_notes?: string;
  assigned_team_id?: string | null;
  synced_to_excel?: boolean;
}

export type AdminRole = 'Super Admin' | 'Tournament Admin' | 'Finance Admin' | 'Scoring Admin' | 'Content Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  short_code: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  captain_id?: string;
  captain_name?: string;
  vice_captain_id?: string;
  vice_captain_name?: string;
  description: string;
  created_at: string;
}

export interface MatchDelivery {
  id: string;
  match_id: string;
  innings_number: 1 | 2;
  over_number: number;
  ball_number: number; // 1 to 6 (or legal balls)
  bowler_name: string;
  batsman_name: string;
  non_striker_name: string;
  runs_scored: number;
  is_wicket: boolean;
  wicket_type?: 'bowled' | 'caught' | 'run-out' | 'lbw' | 'stumped' | 'hit-wicket';
  extra_type?: 'none' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  extra_runs: number;
  commentary?: string;
  timestamp: string;
}

export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Abandoned';

export interface Match {
  id: string;
  match_number: number;
  stage: 'League' | 'Semi Final' | 'Final';
  team1_id: string;
  team2_id: string;
  team1_name: string;
  team2_name: string;
  team1_logo?: string;
  team2_logo?: string;
  date_time: string;
  venue: string;
  total_overs: number;
  status: MatchStatus;
  toss_winner?: string;
  toss_decision?: 'bat' | 'bowl';
  current_innings?: 1 | 2;
  innings1?: {
    batting_team_id: string;
    runs: number;
    wickets: number;
    overs_bowled: number; // e.g. 5.4
  };
  innings2?: {
    batting_team_id: string;
    runs: number;
    wickets: number;
    overs_bowled: number;
    target: number;
  };
  winner_team_id?: string;
  result_description?: string;
  player_of_match?: string;
}

export interface ExpenseTransaction {
  id: string;
  type: 'Expense' | 'Income';
  title: string;
  category: 'Equipment' | 'Ground and venue' | 'Jerseys' | 'Trophies and medals' | 'Refreshments' | 'Decorations' | 'Marketing' | 'Sponsorship' | 'Miscellaneous';
  amount: number;
  date: string;
  paid_by: string;
  payment_method: 'UPI' | 'Cash' | 'Bank Transfer';
  receipt_url?: string;
  notes?: string;
  created_by_admin: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigned_to: string; // admin name
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  deadline: string;
  comments_count: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Fixtures' | 'Important' | 'Results';
  is_pinned: boolean;
  published_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  category: 'Title Sponsor' | 'Powered By' | 'Associate Sponsor' | 'Beverage Partner';
  logo_url: string;
  website_url?: string;
}

export interface TournamentSettings {
  id: string;
  tournament_name: string;
  edition: string;
  tagline: string;
  registration_open: boolean;
  registration_deadline: string;
  max_overs: number;
  box_cricket_rules: {
    runs_per_boundary_net: number;
    no_ball_free_hit: boolean;
    wide_run: number;
    direct_out_of_box: 'Out' | 'Six' | 'Dead Ball';
    underarm_bowling_allowed: boolean;
  };
  excel_sync_enabled: boolean;
  excel_file_id?: string;
}

