import { supabase } from './client';

// ─── Get Profile ──────────────────────────────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Create Profile ───────────────────────────────────────────────────────────
export async function createProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Get User Role ────────────────────────────────────────────────────────────
export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data?.role || 'user';
}

// ─── Upload Avatar ────────────────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error('Avatar upload error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  await updateProfile(userId, { avatar_url: data.publicUrl });
  return data.publicUrl;
}



// ─── Search Profiles (admin) ──────────────────────────────────────────────────
export async function searchProfiles(query) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, email, avatar_url, role, created_at')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data;
}

// ─── Get All Profiles (admin) ─────────────────────────────────────────────────
export async function getAllProfiles({ page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data, count };
}
