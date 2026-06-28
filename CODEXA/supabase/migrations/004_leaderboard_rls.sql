-- ============================================================
-- Codexa Database Schema
-- Migration 004: Leaderboard RLS Policies
-- ============================================================
-- Run this in Supabase → SQL Editor → New Query

-- Allow any authenticated user to read sessions belonging to
-- users who have opted into the leaderboard.
-- (Drop first in case of re-run)
DROP POLICY IF EXISTS "sessions_select_leaderboard" ON sessions;
CREATE POLICY "sessions_select_leaderboard" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_settings us
      WHERE us.id = sessions.user_id AND us.show_in_leaderboard = true
    )
  );

-- Allow any authenticated user to read profiles for leaderboard users
DROP POLICY IF EXISTS "profiles_select_leaderboard" ON profiles;
CREATE POLICY "profiles_select_leaderboard" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_settings us
      WHERE us.id = profiles.id AND us.show_in_leaderboard = true
    )
  );

-- Allow authenticated users to read user_settings rows for
-- leaderboard participants (to check opt-in status) AND their own.
DROP POLICY IF EXISTS "settings_select_leaderboard" ON user_settings;
CREATE POLICY "settings_select_leaderboard" ON user_settings
  FOR SELECT USING (show_in_leaderboard = true OR auth.uid() = id);
