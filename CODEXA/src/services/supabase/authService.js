import { supabase } from './client';

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export async function signUp({ email, password, fullName, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, username },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

// ─── Sign In ──────────────────────────────────────────────────────────────────
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ─── Sign In with OAuth ───────────────────────────────────────────────────────
export async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: provider === 'github' ? 'read:user user:email repo' : undefined,
    },
  });
  if (error) throw error;
  return data;
}

// ─── Link OAuth Identity ──────────────────────────────────────────────────────
export async function linkGitHubIdentity() {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'read:user user:email repo'
    }
  });
  if (error) throw error;
  return data;
}

// ─── Magic Link ───────────────────────────────────────────────────────────────
export async function signInWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export async function forgotPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
  return data;
}

// ─── Reset Password ───────────────────────────────────────────────────────────
export async function resetPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
}

// ─── Update Email ─────────────────────────────────────────────────────────────
export async function updateEmail(newEmail) {
  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
  return data;
}

// ─── Get Session ─────────────────────────────────────────────────────────────
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// ─── Delete Account ───────────────────────────────────────────────────────────
export async function deleteAccount() {
  // Calls a Supabase Edge Function or RPC to delete user data then auth record
  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;
}
