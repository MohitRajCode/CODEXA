import { supabase } from './client';

// ─── Get Notifications ────────────────────────────────────────────────────────
export async function getNotifications(userId, { unreadOnly = false } = {}) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) query = query.eq('read', false);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ─── Mark as Read ─────────────────────────────────────────────────────────────
export async function markAsRead(id, userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Mark All as Read ─────────────────────────────────────────────────────────
export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
}

// ─── Delete Notification ──────────────────────────────────────────────────────
export async function deleteNotification(id, userId) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Subscribe to Real-time Notifications ─────────────────────────────────────
export function subscribeToNotifications(userId, callback) {
  return supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, callback)
    .subscribe();
}
