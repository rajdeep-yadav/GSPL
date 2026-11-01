# Gokul Shrishti Premier League (GSPL) 2026 🏏
> **ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.**

A tournament management platform engineered for society box cricket tournaments and showcase client presentations. Built with React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, and Google Forms-style Microsoft Excel Online synchronization.

---

## 🌟 Key Features

### 1. Public Match Experience
- **Cinematic Sports Portal**: Dark aesthetics (`#090909`), glowing stadium highlights, and fiery orange/red accents (`#FF5722`, `#E53935`).
- **Live Match Center**: Real-time ball-by-ball commentary, innings scoreboard, run-rate calculators, and over completion progression.
- **Player Registration**: Mobile-first entry form collecting strictly essential details (Full Name, Age, Frequency, Wing, Flat, T-shirt Size, Captaincy Interest, Terms Acceptance).
- **Instant Status Lookup**: Query registration state, approved status, assigned category (A, B, C), and allocated team.
- **Standings & Statistics**: Real-time Net Run Rate (NRR) computation, Orange Cap, and Purple Cap leaderboards.

### 2. Unified Admin SaaS Workspace (`/admin`)
- **Single Dashboard Shell**: Persistent sidebar and tabs.
- **Multi-Admin Roles**: Super Admin, Tournament Admin, Finance Admin, Scoring Admin, Content Admin.
- **Google Forms-Style Excel Integration**: Every registration is synchronized to the central Excel workbook with one-click export (.XLSX & .CSV).
- **Player Categorization**: Auto-suggests Category A (Regular), Category B (Occasional), or Category C (Beginner), with manual admin overrides.
- **Captain Selection**: Nomination and lockdown for interested candidates.
- **Category-wise Random Allocation Engine**: Fisher-Yates random allocation that balances Categories A, B, and C evenly across teams without auctions.
- **Live Scoring Deck**: One-tap scoring buttons (0, 1, 2, 3, 4, 6, Wicket, Wide, No-ball, Undo) with live over calculations.
- **Finances & Budget**: Income, sponsorship tracking, expense records with receipt tags, and net committee reserves.
- **Committee Task Board**: Kanban-style status flows (To Do, In Progress, Review, Completed) with priority tags.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/rajdeep-yadav/GSPL.git
cd GSPL

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# Supabase Database Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional Microsoft Graph API (for direct cloud Excel Online sync)
VITE_MS_TENANT_ID=your-tenant-id-here
VITE_MS_CLIENT_ID=your-client-id-here
```

*Note: If external Supabase or Microsoft credentials are not supplied, the platform automatically activates its built-in persistence engine and local virtual Excel workbook without breaking functionality.*

---

## 🗄️ Database Migrations (Supabase)

To execute the PostgreSQL schema:
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Run the complete SQL script located in `supabase/schema.sql`.
4. Tables created include `admin_profiles`, `registrations`, `teams`, `allocation_sessions`, `matches`, `match_deliveries`, `finances`, `tasks`, `announcements`, and `tournament_settings`.

---

## 📋 Box Cricket Tournament Rules
- 6 Overs per innings.
- Maximum 2 overs per bowler.
- Heavy tennis cricket balls.
- Direct hit outside box perimeter ruled as Out.
- Net boundaries reward designated boundary runs without overthrow over-counting.

---

## 📜 License
MIT License. Developed for Gokul Shrishti Society Box Cricket Tournament.
