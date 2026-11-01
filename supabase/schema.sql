-- ============================================================================
-- GSPL (Gokul Shrishti Premier League) - Production Database Schema
-- Compatible with Supabase PostgreSQL (Row Level Security & Realtime enabled)
-- ============================================================================

-- 1. Profiles & Admin Roles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Super Admin', 'Tournament Admin', 'Finance Admin', 'Scoring Admin', 'Content Admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Player Registrations
CREATE TABLE IF NOT EXISTS registrations (
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
    assigned_team_id UUID,
    admin_notes TEXT,
    synced_to_excel BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#FF5722',
    secondary_color TEXT NOT NULL DEFAULT '#121212',
    captain_id TEXT REFERENCES registrations(id) ON DELETE SET NULL,
    vice_captain_id TEXT REFERENCES registrations(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key back to registrations
ALTER TABLE registrations ADD CONSTRAINT fk_assigned_team FOREIGN KEY (assigned_team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- 4. Captain Selections & Allocation Sessions
CREATE TABLE IF NOT EXISTS allocation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_title TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_by TEXT NOT NULL,
    category_a_counts JSONB,
    category_b_counts JSONB,
    category_c_counts JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS allocation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES allocation_sessions(id) ON DELETE CASCADE,
    registration_id TEXT REFERENCES registrations(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Matches & Live Scoring
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_number INT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'League' CHECK (stage IN ('League', 'Semi Final', 'Final')),
    team1_id UUID NOT NULL REFERENCES teams(id),
    team2_id UUID NOT NULL REFERENCES teams(id),
    date_time TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL DEFAULT 'Gokul Shrishti Central Box Arena',
    total_overs INT NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Completed', 'Abandoned')),
    toss_winner UUID REFERENCES teams(id),
    toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
    current_innings INT DEFAULT 1 CHECK (current_innings IN (1, 2)),
    winner_team_id UUID REFERENCES teams(id),
    result_description TEXT,
    player_of_match TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    innings_number INT NOT NULL CHECK (innings_number IN (1, 2)),
    over_number INT NOT NULL,
    ball_number INT NOT NULL,
    bowler_name TEXT NOT NULL,
    batsman_name TEXT NOT NULL,
    non_striker_name TEXT NOT NULL,
    runs_scored INT NOT NULL DEFAULT 0,
    is_wicket BOOLEAN NOT NULL DEFAULT FALSE,
    wicket_type TEXT,
    extra_type TEXT DEFAULT 'none',
    extra_runs INT DEFAULT 0,
    commentary TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Finances (Budget, Incomes & Expenses)
CREATE TABLE IF NOT EXISTS finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    paid_by TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Cash', 'Bank Transfer')),
    receipt_url TEXT,
    notes TEXT,
    created_by_admin TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Task Management
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status TEXT NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Review', 'Completed')),
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Announcements & Sponsors
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Activity Logs & Settings
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament_settings (
    id TEXT PRIMARY KEY DEFAULT 'gspl_active_config',
    tournament_name TEXT NOT NULL DEFAULT 'Gokul Shrishti Premier League',
    edition TEXT NOT NULL DEFAULT 'Season 2026',
    tagline TEXT NOT NULL DEFAULT 'ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.',
    registration_open BOOLEAN DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ DEFAULT '2026-11-20T23:59:59+05:30',
    max_overs INT DEFAULT 6,
    box_rules JSONB DEFAULT '{"runs_per_boundary_net": 4, "no_ball_free_hit": true, "wide_run": 1, "direct_out_of_box": "Out", "underarm_bowling_allowed": false}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security & Realtime on key tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_deliveries ENABLE ROW LEVEL SECURITY;

-- Public read policies for registrations (anonymized names/teams for status check)
CREATE POLICY "Public registrations lookup" ON registrations FOR SELECT USING (true);
CREATE POLICY "Public registration insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public matches read" ON matches FOR SELECT USING (true);
CREATE POLICY "Public deliveries read" ON match_deliveries FOR SELECT USING (true);

-- Enable Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE match_deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
