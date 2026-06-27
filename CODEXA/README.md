# Codexa — Developer Productivity SaaS

A full-stack SaaS application for tracking coding sessions, GitHub activity, projects, goals, and developer analytics — built with React + Vite + Supabase.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| State | Zustand, React Context |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Supabase (Auth + PostgreSQL + Storage + Realtime) |
| HTTP | Axios |
| Icons | Lucide React |

---

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd CODEXA
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Run the SQL migrations (see below)

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 4. Run Database Migrations
In your Supabase SQL Editor, run these files in order:
1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_functions_triggers.sql`
4. `supabase/migrations/004_seed_data.sql`

### 5. Configure OAuth Providers (Optional)
- **GitHub OAuth**: Settings → Auth → Providers → GitHub
- **Google OAuth**: Settings → Auth → Providers → Google
- Set Redirect URL to: `http://localhost:5173/auth/callback`

### 6. Start Development Server
```bash
npm run dev
```

---

## Environment Variables

See `.env.example` for all required variables.

---

## Deployment (Vercel)

```bash
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

Set the same environment variables in your Vercel project dashboard.

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React contexts (Auth, Theme, Notifications)
├── hooks/            # Custom React hooks
├── pages/            # All application pages
│   ├── auth/         # Login, Register, etc.
│   ├── dashboard/    # Protected dashboard pages
│   ├── landing/      # Public marketing pages
│   └── admin/        # Admin panel
├── routes/           # Route definitions + guards
├── services/         # Supabase service modules
├── utils/            # Helpers, formatters, validators
├── constants/        # App-wide constants
└── data/             # Mock/seed data
supabase/
└── migrations/       # SQL migration files
```

---

## License
MIT
