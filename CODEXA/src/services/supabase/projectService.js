import { supabase } from './client';

// ─── Get Projects ─────────────────────────────────────────────────────────────
export async function getProjects(userId, { page = 1, limit = 20, status } = {}) {
  const from = (page - 1) * limit;
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .range(from, from + limit - 1);

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

// ─── Get Project ──────────────────────────────────────────────────────────────
export async function getProject(id, userId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, sessions(id, duration_minutes, started_at, language)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ─── Create Project ───────────────────────────────────────────────────────────
export async function createProject(userId, project) {
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Update Project ───────────────────────────────────────────────────────────
export async function updateProject(id, userId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Delete Project ───────────────────────────────────────────────────────────
export async function deleteProject(id, userId) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Archive Project ──────────────────────────────────────────────────────────
export async function archiveProject(id, userId) {
  return updateProject(id, userId, { status: 'archived' });
}
