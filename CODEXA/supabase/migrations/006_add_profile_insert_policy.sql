-- ============================================================
-- Codexa Database Schema
-- Migration 006: Add Insert Policy for Profiles
-- ============================================================

-- Allow users to insert their own profile if it's missing
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
