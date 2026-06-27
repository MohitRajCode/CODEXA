import { supabase } from './client';

// ─── Get Goals ────────────────────────────────────────────────────────────────
export async function getGoals(userId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Create Goal ──────────────────────────────────────────────────────────────
export async function createGoal(userId, goal) {
  const { data, error } = await supabase
    .from('goals')
    .insert({ ...goal, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Update Goal ──────────────────────────────────────────────────────────────
export async function updateGoal(id, userId, updates) {
  const { data, error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Delete Goal ──────────────────────────────────────────────────────────────
export async function deleteGoal(id, userId) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Update Goal Progress ──────────────────────────────────────────────────────
export async function updateGoalProgress(id, userId, current_value) {
  const { data, error } = await supabase
    .from('goals')
    .update({ current_value, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
