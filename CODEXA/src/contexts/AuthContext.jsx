import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase/client';
import { getProfile, updateProfile, createProfile } from '../services/supabase/profileService';
import { signOut as authSignOut } from '../services/supabase/authService';
import { fetchGitHubUser } from '../services/supabase/githubService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Intercept URL hash immediately before Supabase clears it
    const hash = window.location.hash;
    if (hash && hash.includes('provider_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const pToken = params.get('provider_token');
      if (pToken) localStorage.setItem('gh_token_pending', pToken);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.provider_token) {
        localStorage.setItem('gh_token_pending', session.provider_token);
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.provider_token) {
          localStorage.setItem('gh_token_pending', session.provider_token);
        }
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // Process any pending GitHub token
  useEffect(() => {
    const pendingToken = localStorage.getItem('gh_token_pending');
    if (pendingToken && user) {
      fetchGitHubUser(pendingToken)
        .then((ghUser) => {
          if (ghUser && ghUser.login) {
            // Save to localStorage as a reliable fallback in case DB update fails
            localStorage.setItem('github_token_fallback', pendingToken);
            localStorage.setItem('github_username_fallback', ghUser.login);
            
            // Set context immediately
            setProfile(p => p ? { ...p, github_token: pendingToken, github_username: ghUser.login } : { github_token: pendingToken, github_username: ghUser.login });
            localStorage.removeItem('gh_token_pending');

            updateProfile(user.id, {
              github_token: pendingToken,
              github_username: ghUser.login
            }).catch(err => {
              console.warn("DB profile update failed, but token is saved locally.", err);
            });
          } else {
            localStorage.removeItem('gh_token_pending'); // Invalid token
          }
        })
        .catch((err) => {
          console.error("fetchGitHubUser error:", err);
          localStorage.removeItem('gh_token_pending'); // Likely Google token or error
        });
    }
  }, [user]);

  async function loadProfile(userId) {
    try {
      const profileData = await getProfile(userId);
      
      // Merge fallback tokens if they exist (handles broken database profiles)
      const fbToken = localStorage.getItem('github_token_fallback');
      const fbUser = localStorage.getItem('github_username_fallback');
      if (fbToken && fbUser) {
        profileData.github_token = fbToken;
        profileData.github_username = fbUser;
      }

      // Merge LeetCode username fallback
      const lcUser = localStorage.getItem('lc_username_fallback');
      if (lcUser && !profileData.leetcode_username) {
        profileData.leetcode_username = lcUser;
      }
      
      // Give everyone a free month of Pro
      if (!profileData.plan || profileData.plan === 'free') {
        profileData.plan = 'pro';
      }

      setProfile(profileData);
    } catch {
      // Profile may not exist yet (e.g. trigger failed during signup)
      // Attempt to create it now
      const fbToken = localStorage.getItem('github_token_fallback');
      const fbUser = localStorage.getItem('github_username_fallback');
      const lcUser = localStorage.getItem('lc_username_fallback');
      
      const dbProfile = {
        username: `user_${userId.substring(0, 8)}`,
        plan: 'pro',
        github_token: fbToken || null,
        github_username: fbUser || null
      };

      try {
        const newProfile = await createProfile(userId, dbProfile);
        if (lcUser) newProfile.leetcode_username = lcUser;
        setProfile(newProfile);
      } catch (createErr) {
        console.warn("Failed to create missing profile:", createErr);
        // Fallback if we still can't create it (e.g. RLS policy not applied yet)
        const fallbackProfile = { ...dbProfile, leetcode_username: lcUser || null };
        setProfile(fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }

  const isAdmin = profile?.role === 'admin';
  const isPremium = profile?.plan === 'premium' || profile?.plan === 'pro';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      isAdmin,
      isPremium,
      signOut,
      refreshProfile: () => user && loadProfile(user.id),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
