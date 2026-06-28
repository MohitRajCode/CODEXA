import { supabase } from './client';

// ─── Fetch Leaderboard Entries ────────────────────────────────────────────────
// Returns users who have opted in, with their aggregated stats.
// metric: 'hours' | 'sessions' | 'score'
// period: 'week' | 'month' | 'all'
export async function fetchLeaderboard(metric = 'hours', period = 'week') {
  // Determine date filter
  let since = null;
  const now = new Date();
  if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    since = d.toISOString();
  } else if (period === 'month') {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    since = d.toISOString();
  }

  // Fetch all opted-in profiles via user_settings
  const { data: settingsData, error: settingsError } = await supabase
    .from('user_settings')
    .select('id')
    .eq('show_in_leaderboard', true);

  if (settingsError) throw settingsError;
  if (!settingsData || settingsData.length === 0) return [];

  const optedInIds = settingsData.map((s) => s.id);

  // Fetch their profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, experience, github_username')
    .in('id', optedInIds);

  if (profilesError) throw profilesError;

  // Fetch aggregated sessions for each user
  let sessionQuery = supabase
    .from('sessions')
    .select('user_id, duration_minutes')
    .in('user_id', optedInIds);

  if (since) {
    sessionQuery = sessionQuery.gte('started_at', since);
  }

  const { data: sessions, error: sessionsError } = await sessionQuery;
  if (sessionsError) throw sessionsError;

  // Aggregate stats per user
  const statsMap = {};
  for (const id of optedInIds) {
    statsMap[id] = { totalMinutes: 0, sessionCount: 0 };
  }
  for (const s of sessions || []) {
    if (statsMap[s.user_id]) {
      statsMap[s.user_id].totalMinutes += s.duration_minutes;
      statsMap[s.user_id].sessionCount += 1;
    }
  }

  // Build leaderboard rows
  const rows = (profiles || []).map((p) => {
    const stats = statsMap[p.id] || { totalMinutes: 0, sessionCount: 0 };
    const hours = Math.round((stats.totalMinutes / 60) * 10) / 10;
    // Score: weighted composite (hours × 0.6 + sessions × 0.4, normalized per 100)
    const score = Math.round(hours * 0.6 + stats.sessionCount * 0.4);

    return {
      id: p.id,
      username: p.username || 'anonymous',
      full_name: p.full_name || p.username || 'User',
      avatar_url: p.avatar_url,
      experience: p.experience,
      github_username: p.github_username,
      hours,
      sessions: stats.sessionCount,
      score,
    };
  });

  // Sort by selected metric
  const sortKey = metric === 'hours' ? 'hours' : metric === 'sessions' ? 'sessions' : 'score';
  rows.sort((a, b) => b[sortKey] - a[sortKey]);

  // Assign ranks
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

// ─── Get User Leaderboard Opt-in Status ───────────────────────────────────────
export async function getLeaderboardOptIn(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('show_in_leaderboard')
    .eq('id', userId)
    .single();
  if (error) return false;
  return data?.show_in_leaderboard ?? false;
}

// ─── Update User Leaderboard Opt-in ──────────────────────────────────────────
export async function updateLeaderboardOptIn(userId, show) {
  const { error } = await supabase
    .from('user_settings')
    .update({ show_in_leaderboard: show })
    .eq('id', userId);
  if (error) throw error;
}
