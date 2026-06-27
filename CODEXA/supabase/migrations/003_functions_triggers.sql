-- ============================================================
-- Codexa Database Schema
-- Migration 003: Functions, Views, and Helper RPCs
-- ============================================================

-- ─── Delete User Account RPC ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS VOID AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Get User Stats View ──────────────────────────────────────────────────────
CREATE OR REPLACE VIEW user_stats AS
SELECT
  s.user_id,
  COUNT(*)                          AS total_sessions,
  SUM(s.duration_minutes)           AS total_minutes,
  AVG(s.duration_minutes)           AS avg_session_minutes,
  COUNT(DISTINCT s.language)        AS languages_used,
  COUNT(DISTINCT s.project_id)      AS projects_coded,
  COUNT(DISTINCT DATE(s.started_at)) AS active_days,
  MAX(s.started_at)                 AS last_session_at
FROM sessions s
GROUP BY s.user_id;

-- ─── Get User Streak Function ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_date DATE;
BEGIN
  FOR v_date IN
    SELECT DISTINCT DATE(started_at)
    FROM sessions
    WHERE user_id = p_user_id
    ORDER BY DATE(started_at) DESC
  LOOP
    IF v_date = v_current_date OR v_date = v_current_date - INTERVAL '1 day' THEN
      v_streak := v_streak + 1;
      v_current_date := v_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Upsert Daily Statistics ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION upsert_daily_stats(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
  v_total_minutes INTEGER;
  v_session_count INTEGER;
  v_top_language  TEXT;
BEGIN
  SELECT
    SUM(duration_minutes),
    COUNT(*),
    MODE() WITHIN GROUP (ORDER BY language)
  INTO v_total_minutes, v_session_count, v_top_language
  FROM sessions
  WHERE user_id = p_user_id AND DATE(started_at) = p_date;

  INSERT INTO statistics (user_id, date, total_minutes, session_count, top_language)
  VALUES (p_user_id, p_date, COALESCE(v_total_minutes, 0), COALESCE(v_session_count, 0), v_top_language)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_minutes = EXCLUDED.total_minutes,
    session_count = EXCLUDED.session_count,
    top_language  = EXCLUDED.top_language;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Trigger: Update stats after session insert/update ───────────────────────
CREATE OR REPLACE FUNCTION trigger_update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM upsert_daily_stats(NEW.user_id, DATE(NEW.started_at));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_session_stats
  AFTER INSERT OR UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION trigger_update_daily_stats();

-- ─── Check Achievement Function ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_sessions INTEGER;
  v_streak INTEGER;
  v_total_hours NUMERIC;
BEGIN
  SELECT total_sessions, total_minutes / 60.0
  INTO v_total_sessions, v_total_hours
  FROM user_stats WHERE user_id = p_user_id;

  v_streak := get_user_streak(p_user_id);

  -- First session
  IF v_total_sessions >= 1 THEN
    INSERT INTO achievements (user_id, key, title, description, icon)
    VALUES (p_user_id, 'first_session', 'First Session', 'Completed your first coding session!', '🚀')
    ON CONFLICT (user_id, key) DO NOTHING;
  END IF;

  -- 7-day streak
  IF v_streak >= 7 THEN
    INSERT INTO achievements (user_id, key, title, description, icon)
    VALUES (p_user_id, 'streak_7', 'Week Warrior', '7-day coding streak!', '🔥')
    ON CONFLICT (user_id, key) DO NOTHING;
  END IF;

  -- 100 hours
  IF v_total_hours >= 100 THEN
    INSERT INTO achievements (user_id, key, title, description, icon)
    VALUES (p_user_id, 'hours_100', 'Century Coder', 'Coded for 100 hours total!', '💯')
    ON CONFLICT (user_id, key) DO NOTHING;
  END IF;

  -- 30-day streak
  IF v_streak >= 30 THEN
    INSERT INTO achievements (user_id, key, title, description, icon)
    VALUES (p_user_id, 'streak_30', 'Monthly Master', '30-day coding streak!', '🏆')
    ON CONFLICT (user_id, key) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
