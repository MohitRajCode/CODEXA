-- ============================================================
-- Codexa Database Schema
-- Migration 001: Create Tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  email         TEXT UNIQUE,
  bio           TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  timezone      TEXT DEFAULT 'UTC',
  github_username TEXT,
  github_token  TEXT,
  twitter_url   TEXT,
  linkedin_url  TEXT,
  website_url   TEXT,
  experience    TEXT CHECK (experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
  theme         TEXT DEFAULT 'dark',
  accent_color  TEXT DEFAULT '#6D5DFB',
  email_notifications BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  color           TEXT DEFAULT '#6D5DFB',
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  repo_url        TEXT,
  demo_url        TEXT,
  tech_stack      TEXT[],
  image_url       TEXT,
  is_public       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Sessions ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  title           TEXT NOT NULL DEFAULT 'Coding Session',
  language        TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes           TEXT,
  difficulty      TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags            TEXT[],
  mood            INTEGER CHECK (mood BETWEEN 1 AND 5),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Goals ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'custom')),
  metric          TEXT NOT NULL CHECK (metric IN ('hours', 'sessions', 'commits', 'projects')),
  target_value    NUMERIC NOT NULL,
  current_value   NUMERIC DEFAULT 0,
  start_date      DATE NOT NULL,
  end_date        DATE,
  completed       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Achievements ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key             TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  unlocked_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'achievement', 'system')),
  title           TEXT NOT NULL,
  message         TEXT,
  read            BOOLEAN DEFAULT false,
  action_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Repositories ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS repositories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  github_id       BIGINT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  description     TEXT,
  url             TEXT,
  language        TEXT,
  stars           INTEGER DEFAULT 0,
  forks           INTEGER DEFAULT 0,
  private         BOOLEAN DEFAULT false,
  updated_at      TIMESTAMPTZ,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Statistics Cache ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS statistics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  total_minutes   INTEGER DEFAULT 0,
  session_count   INTEGER DEFAULT 0,
  top_language    TEXT,
  commits         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ─── Settings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_settings (
  id              UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  daily_goal_hours NUMERIC DEFAULT 4,
  weekly_goal_hours NUMERIC DEFAULT 30,
  show_in_leaderboard BOOLEAN DEFAULT false,
  public_profile  BOOLEAN DEFAULT false,
  auto_track      BOOLEAN DEFAULT false,
  idle_timeout    INTEGER DEFAULT 5,
  preferred_editor TEXT DEFAULT 'vscode',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_language ON sessions(language);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_repositories_user_id ON repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_user_date ON statistics(user_id, date DESC);

-- ─── Trigger: auto-update updated_at ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS trg_sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS trg_goals_updated_at ON goals;
DROP TRIGGER IF EXISTS trg_settings_updated_at ON user_settings;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated_at  BEFORE UPDATE ON projects  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sessions_updated_at  BEFORE UPDATE ON sessions  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_goals_updated_at     BEFORE UPDATE ON goals     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated_at  BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Trigger: create profile + settings on new user ──────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_settings (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;

  INSERT INTO notifications (user_id, type, title, message)
  VALUES (NEW.id, 'success', 'Welcome to Codexa! 🎉', 'Start tracking your coding sessions to see your productivity insights.');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
