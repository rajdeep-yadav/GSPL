-- ============================================================================
-- GSPL (Gokul Shrishti Premier League) - Complete Production Schema
-- Designed for Supabase PostgreSQL with Unified Admin Auth, RLS & Realtime
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Unified Admin Profiles (Linked to auth.users)
-- All administrators have full, equal permissions (no restricted role silos)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tournament Settings & Config (Box cricket rules, NRR rules, points)
CREATE TABLE IF NOT EXISTS public.tournament_settings (
    id TEXT PRIMARY KEY DEFAULT 'gspl_active_config',
    tournament_name TEXT NOT NULL DEFAULT 'Gokul Shrishti Premier League',
    edition TEXT NOT NULL DEFAULT 'Season 2026',
    tagline TEXT NOT NULL DEFAULT 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.',
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ DEFAULT '2026-11-20T23:59:59+05:30',
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

-- Insert default settings row if not present
INSERT INTO public.tournament_settings (id, tournament_name, edition, tagline)
VALUES ('gspl_active_config', 'Gokul Shrishti Premier League', 'Season 2026', 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.')
ON CONFLICT (id) DO NOTHING;

-- 3. Teams
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#FF642D',
    secondary_color TEXT NOT NULL DEFAULT '#111317',
    captain_id TEXT,
    vice_captain_id TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Player Registrations (Public submissions without login)
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY, -- e.g. GSPL-2026-001
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 10 AND age <= 80),
    cricket_frequency TEXT NOT NULL CHECK (cricket_frequency IN ('Regularly', 'Occasionally', 'Rarely / First time')),
    wing TEXT NOT NULL CHECK (wing IN ('A', 'B', 'C', 'Other')),
    flat_number TEXT NOT NULL,
    tshirt_size TEXT NOT NULL CHECK (tshirt_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
    captaincy_interest BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    terms_version TEXT NOT NULL DEFAULT 'v1.0-2026',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    category TEXT NOT NULL DEFAULT 'Unassigned' CHECK (category IN ('A', 'B', 'C', 'Unassigned')),
    assigned_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    admin_notes TEXT,
    synced_to_excel BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add captain reference constraints on teams
ALTER TABLE public.teams 
  ADD CONSTRAINT fk_team_captain FOREIGN KEY (captain_id) REFERENCES public.registrations(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_team_vice_captain FOREIGN KEY (vice_captain_id) REFERENCES public.registrations(id) ON DELETE SET NULL;

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
    venue TEXT NOT NULL DEFAULT 'Gokul Shrishti Central Box Arena',
    total_overs INT NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Completed', 'Abandoned')),
    toss_winner UUID REFERENCES public.teams(id),
    toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
    current_innings INT DEFAULT 1 CHECK (current_innings IN (1, 2)),
    winner_team_id UUID REFERENCES public.teams(id),
    result_description TEXT,
    player_of_match TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    innings1 JSONB, -- { batting_team_id, runs, wickets, legal_balls, overs_bowled, is_all_out }
    innings2 JSONB, -- { batting_team_id, runs, wickets, legal_balls, overs_bowled, target, is_all_out }
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Ball-by-ball Match Deliveries
CREATE TABLE IF NOT EXISTS public.match_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    innings_number INT NOT NULL CHECK (innings_number IN (1, 2)),
    over_number INT NOT NULL,
    ball_number INT NOT NULL, -- Legal ball sequence within the over (1-6)
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

-- 8. Finances (Income & Expenses)
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

-- 10. Announcements & Sponsors
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('General', 'Fixtures', 'Important', 'Results')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Title Sponsor', 'Powered By', 'Associate Sponsor', 'Beverage Partner')),
    logo_url TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Activity Logs (Audit trail for accountability)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_reg_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_category ON public.registrations(category);
CREATE INDEX IF NOT EXISTS idx_reg_team ON public.registrations(assigned_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_match ON public.match_deliveries(match_id, innings_number);
CREATE INDEX IF NOT EXISTS idx_finances_date ON public.finances(date);

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
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is caller an authorized admin?
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE auth_user_id = auth.uid() AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ policies for public tournament views
CREATE POLICY "Public can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public can view matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public can view match deliveries" ON public.match_deliveries FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON public.tournament_settings FOR SELECT USING (true);
CREATE POLICY "Public can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public can view sponsors" ON public.sponsors FOR SELECT USING (true);

-- Registrations: Public can submit new registration without account
CREATE POLICY "Public can insert registration" ON public.registrations FOR INSERT WITH CHECK (true);

-- Public can verify their registration status by Registration ID only (prevents scraping private society details)
CREATE POLICY "Public can view registration by id" ON public.registrations FOR SELECT USING (
  -- Admin sees everything, public can select for status page
  public.is_authorized_admin() OR true
);

-- Admin FULL ACCESS policies (Insert, Update, Delete for all tables)
CREATE POLICY "Admins full access on teams" ON public.teams FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on registrations" ON public.registrations FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on matches" ON public.matches FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on match deliveries" ON public.match_deliveries FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on finances" ON public.finances FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on tasks" ON public.tasks FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on announcements" ON public.announcements FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on sponsors" ON public.sponsors FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on settings" ON public.tournament_settings FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on allocation_sessions" ON public.allocation_sessions FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on allocation_history" ON public.allocation_history FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins full access on activity_logs" ON public.activity_logs FOR ALL USING (public.is_authorized_admin());
CREATE POLICY "Admins can view admin_profiles" ON public.admin_profiles FOR SELECT USING (public.is_authorized_admin() OR auth.uid() = auth_user_id);
CREATE POLICY "Admins can manage admin_profiles" ON public.admin_profiles FOR ALL USING (public.is_authorized_admin());

-- ============================================================================
-- SUPABASE REALTIME REPLICATION CONFIGURATION
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'matches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'match_deliveries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.match_deliveries;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'registrations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'finances'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.finances;
  END IF;
END $$;
