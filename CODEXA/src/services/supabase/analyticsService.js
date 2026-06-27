import { supabase } from './client';

// ─── Get Analytics Overview ───────────────────────────────────────────────────
export async function getAnalyticsOverview(userId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('sessions')
    .select('duration_minutes, language, started_at, project_id')
    .eq('user_id', userId)
    .gte('started_at', since.toISOString())
    .order('started_at', { ascending: true });
  if (error) throw error;
  return data;
}

// ─── Get Language Breakdown ───────────────────────────────────────────────────
export async function getLanguageBreakdown(userId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('sessions')
    .select('language, duration_minutes')
    .eq('user_id', userId)
    .gte('started_at', since.toISOString());
  if (error) throw error;

  // Aggregate by language
  const breakdown = {};
  let total = 0;
  data.forEach(({ language, duration_minutes }) => {
    breakdown[language] = (breakdown[language] || 0) + duration_minutes;
    total += duration_minutes;
  });

  return Object.entries(breakdown).map(([name, minutes]) => ({
    name,
    minutes,
    percent: total > 0 ? Math.round((minutes / total) * 100) : 0,
  })).sort((a, b) => b.minutes - a.minutes);
}

// ─── Get Daily Heatmap ────────────────────────────────────────────────────────
export async function getDailyHeatmap(userId) {
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const { data, error } = await supabase
    .from('sessions')
    .select('started_at, duration_minutes')
    .eq('user_id', userId)
    .gte('started_at', yearAgo.toISOString());
  if (error) throw error;

  const heatmap = {};
  data.forEach(({ started_at, duration_minutes }) => {
    const day = started_at.split('T')[0];
    heatmap[day] = (heatmap[day] || 0) + duration_minutes;
  });
  return heatmap;
}

// ─── Get Current Streak ───────────────────────────────────────────────────────
export async function getCurrentStreak(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });
  if (error) throw error;

  if (!data.length) return 0;

  const dates = [...new Set(data.map(s => s.started_at.split('T')[0]))].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const diffDays = Math.round((current - date) / 86400000);
    if (diffDays <= 1) {
      streak++;
      current = date;
    } else break;
  }
  return streak;
}

// ─── Get Productivity Score ───────────────────────────────────────────────────
export async function getProductivityScore(userId) {
  const weekData = await getAnalyticsOverview(userId, 7);
  const totalMinutes = weekData.reduce((s, d) => s + d.duration_minutes, 0);
  const avgDailyTarget = 240; // 4 hours
  const score = Math.min(Math.round((totalMinutes / (avgDailyTarget * 7)) * 100), 100);
  return score;
}
