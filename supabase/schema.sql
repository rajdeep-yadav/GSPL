-- ============================================================================
-- GSPL (Gokul Shrishti Premier League) - Production Schema (Season 2)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Unified Admin Profiles (Single admin or committee admins)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tournament Settings (Season 2 Configuration)
CREATE TABLE IF NOT EXISTS public.tournament_settings (
    id TEXT PRIMARY KEY DEFAULT 'gspl_active_config',
    tournament_name TEXT NOT NULL DEFAULT 'Gokul Shrishti Premier League',
    edition TEXT NOT NULL DEFAULT 'Season 2',
    tagline TEXT NOT NULL DEFAULT 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.',
    arena_name TEXT NOT NULL DEFAULT 'GOKUL SHRISTI WINGS A, B, C, D, E garden',
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ DEFAULT '2026-11-30T23:59:59+05:30',
    max_overs INT NOT NULL DEFAULT 6,
    points_win INT NOT NULL DEFAULT 2,
    points_tie INT NOT NULL DEFAULT 1,
    points_no_result INT NOT NULL DEFAULT 1,
    points_loss INT NOT NULL DEFAULT 0,
    all_out_rule_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    box_rules JSONB NOT NULL DEFAULT '{
      "runs_per_boundary_net": 4,
      "no_ball_free_hit": true,
      "wide_run": 1,
      "direct_out_of_box": "Out",
      "underarm_bowling_allowed": false
    }'::jsonb,
    excel_sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    excel_file_id TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.tournament_settings (id, tournament_name, edition, tagline, arena_name)
VALUES ('gspl_active_config', 'Gokul Shrishti Premier League', 'Season 2', 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.', 'GOKUL SHRISTI WINGS A, B, C, D, E garden')
ON CONFLICT (id) DO NOTHING;

-- 3. Teams
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#FF5A1F',
    secondary_color TEXT NOT NULL DEFAULT '#060709',
    captain_id TEXT,
    captain_name TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Player Registrations (Public submission without login, Wings A-E)
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY, -- e.g. GSPL-2026-001
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 10 AND age <= 80),
    cricket_frequency TEXT NOT NULL CHECK (cricket_frequency IN ('Regularly', 'Occasionally', 'Rarely / First time')),
    wing TEXT NOT NULL CHECK (wing IN ('A', 'B', 'C', 'D', 'E')),
    flat_number TEXT NOT NULL,
    tshirt_size TEXT NOT NULL CHECK (tshirt_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
    captaincy_interest BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    terms_version TEXT NOT NULL DEFAULT 'v2.0-2026',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    category TEXT NOT NULL DEFAULT 'Unassigned' CHECK (category IN ('A', 'B', 'C', 'Unassigned')),
    assigned_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    admin_notes TEXT,
    synced_to_excel BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Allocation Sessions & History (Audit trail of random allocations)
CREATE TABLE IF NOT EXISTS public.allocation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_title TEXT NOT NULL,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL,
    category_a_counts JSONB,
    category_b_counts JSONB,
    category_c_counts JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.allocation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.allocation_sessions(id) ON DELETE CASCADE,
    registration_id TEXT REFERENCES public.registrations(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_number INT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'League' CHECK (stage IN ('League', 'Semi Final', 'Final')),
    team1_id UUID NOT NULL REFERENCES public.teams(id),
    team2_id UUID NOT NULL REFERENCES public.teams(id),
    date_time TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL DEFAULT 'GOKUL SHRISTI WINGS A, B, C, D, E garden',
    total_overs INT NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Completed', 'Abandoned')),
    toss_winner UUID REFERENCES public.teams(id),
    toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
    current_innings INT DEFAULT 1 CHECK (current_innings IN (1, 2)),
    winner_team_id UUID REFERENCES public.teams(id),
    result_description TEXT,
    player_of_match TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    innings1 JSONB,
    innings2 JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Ball-by-ball Match Deliveries
CREATE TABLE IF NOT EXISTS public.match_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    innings_number INT NOT NULL CHECK (innings_number IN (1, 2)),
    over_number INT NOT NULL,
    ball_number INT NOT NULL,
    bowler_name TEXT NOT NULL,
    batsman_name TEXT NOT NULL,
    non_striker_name TEXT NOT NULL,
    runs_scored INT NOT NULL DEFAULT 0,
    is_wicket BOOLEAN NOT NULL DEFAULT FALSE,
    wicket_type TEXT CHECK (wicket_type IN ('bowled', 'caught', 'run-out', 'lbw', 'stumped', 'hit-wicket', NULL)),
    extra_type TEXT DEFAULT 'none' CHECK (extra_type IN ('none', 'wide', 'no-ball', 'bye', 'leg-bye')),
    extra_runs INT NOT NULL DEFAULT 0,
    is_legal_ball BOOLEAN NOT NULL DEFAULT TRUE,
    commentary TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Committee Finances
CREATE TABLE IF NOT EXISTS public.finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
      'Equipment', 'Ground and venue', 'Jerseys', 'Trophies and medals', 
      'Refreshments', 'Decorations', 'Marketing', 'Sponsorship', 'Miscellaneous'
    )),
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    paid_by TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Cash', 'Bank Transfer')),
    receipt_url TEXT,
    notes TEXT,
    created_by_admin TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Committee Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status TEXT NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Review', 'Completed')),
    deadline DATE,
    comments_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Public READ policies for live tournament access
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public read deliveries" ON public.match_deliveries FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.tournament_settings FOR SELECT USING (true);

-- Registrations: Anyone can register without logging in
CREATE POLICY "Public register without login" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public status check" ON public.registrations FOR SELECT USING (true);

-- Authenticated Admin Policies (Full access to all tables)
CREATE POLICY "Admin full teams" ON public.teams FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full registrations" ON public.registrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full matches" ON public.matches FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full deliveries" ON public.match_deliveries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full finances" ON public.finances FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full settings" ON public.tournament_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full allocations" ON public.allocation_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full allocation_history" ON public.allocation_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full profiles" ON public.admin_profiles FOR ALL TO authenticated USING (true);

-- If you also want anonymous dev access to manage during setup:
CREATE POLICY "Anon dev update registrations" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Anon dev delete registrations" ON public.registrations FOR DELETE USING (true);
CREATE POLICY "Anon dev full teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Anon dev full matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Anon dev full deliveries" ON public.match_deliveries FOR ALL USING (true);
CREATE POLICY "Anon dev full finances" ON public.finances FOR ALL USING (true);
CREATE POLICY "Anon dev full tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Anon dev full settings" ON public.tournament_settings FOR ALL USING (true);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.finances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
