import { supabase } from './client';

// ─── Get Sessions ─────────────────────────────────────────────────────────────
export async function getSessions(userId, { page = 1, limit = 20, language, project_id } = {}) {
  const from = (page - 1) * limit;
  let query = supabase
    .from('sessions')
    .select('*, projects(name, color)', { count: 'exact' })
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .range(from, from + limit - 1);

  if (language) query = query.eq('language', language);
  if (project_id) query = query.eq('project_id', project_id);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

// ─── Get Session ─────────────────────────────────────────────────────────────
export async function getSession(id, userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, projects(name, color)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ─── Create Session ───────────────────────────────────────────────────────────
export async function createSession(userId, session) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...session, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Update Session ───────────────────────────────────────────────────────────
export async function updateSession(id, userId, updates) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Delete Session ───────────────────────────────────────────────────────────
export async function deleteSession(id, userId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Get Today's Stats ────────────────────────────────────────────────────────
export async function getTodayStats(userId) {
  // Use local midnight to accurately reflect the user's "today"
  const todayLocalMidnight = new Date();
  todayLocalMidnight.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('sessions')
    .select('duration_minutes, language')
    .eq('user_id', userId)
    .gte('started_at', todayLocalMidnight.toISOString());
  if (error) throw error;
  return data;
}

// ─── Get Weekly Stats ─────────────────────────────────────────────────────────
export async function getWeeklyStats(userId) {
  const weekAgo = new Date();
  weekAgo.setHours(0, 0, 0, 0); // Local midnight
  weekAgo.setDate(weekAgo.getDate() - 7); // 7 days ago

  const { data, error } = await supabase
    .from('sessions')
    .select('duration_minutes, language, started_at')
    .eq('user_id', userId)
    .gte('started_at', weekAgo.toISOString());
  if (error) throw error;
  return data;
}
