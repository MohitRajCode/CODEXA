-- ============================================================
-- Codexa Database Schema
-- Migration 002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (public_profile = true OR auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_select_public" ON projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- ─── Sessions ─────────────────────────────────────────────────────────────────
CREATE POLICY "sessions_select_own" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_own" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_own" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "sessions_delete_own" ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ─── Goals ───────────────────────────────────────────────────────────────────
CREATE POLICY "goals_select_own" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "goals_insert_own" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "goals_delete_own" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- ─── Achievements ─────────────────────────────────────────────────────────────
CREATE POLICY "achievements_select_own" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "achievements_insert_own" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ─── Repositories ────────────────────────────────────────────────────────────
CREATE POLICY "repositories_select_own" ON repositories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "repositories_insert_own" ON repositories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "repositories_update_own" ON repositories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "repositories_delete_own" ON repositories
  FOR DELETE USING (auth.uid() = user_id);

-- ─── Statistics ───────────────────────────────────────────────────────────────
CREATE POLICY "statistics_select_own" ON statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "statistics_insert_own" ON statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "statistics_update_own" ON statistics
  FOR UPDATE USING (auth.uid() = user_id);

-- ─── User Settings ────────────────────────────────────────────────────────────
CREATE POLICY "settings_select_own" ON user_settings
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "settings_update_own" ON user_settings
  FOR UPDATE USING (auth.uid() = id);

-- ─── Storage Policies ─────────────────────────────────────────────────────────
-- Run these in Supabase Storage → Policies

-- Avatars bucket (public read, authenticated write)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "avatars_authenticated_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
-- CREATE POLICY "avatars_own_update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "avatars_own_delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Project images bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
