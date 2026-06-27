import { supabase } from './client';

// ─── Upload File ──────────────────────────────────────────────────────────────
export async function uploadFile(bucket, path, file, options = {}) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, ...options });
  if (error) throw error;
  return data;
}

// ─── Delete File ──────────────────────────────────────────────────────────────
export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// ─── Get Public URL ───────────────────────────────────────────────────────────
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Get Signed URL ───────────────────────────────────────────────────────────
export async function getSignedUrl(bucket, path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

// ─── List Files ───────────────────────────────────────────────────────────────
export async function listFiles(bucket, folder) {
  const { data, error } = await supabase.storage.from(bucket).list(folder);
  if (error) throw error;
  return data;
}

// ─── Upload Project Image ─────────────────────────────────────────────────────
export async function uploadProjectImage(userId, projectId, file) {
  const ext = file.name.split('.').pop();
  const path = `projects/${userId}/${projectId}.${ext}`;
  await uploadFile('project-images', path, file);
  return getPublicUrl('project-images', path);
}

// ─── Upload Avatar ────────────────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  await uploadFile('avatars', path, file);
  return getPublicUrl('avatars', path);
}
