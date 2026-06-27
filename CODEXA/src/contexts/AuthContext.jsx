import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase/client';
import { getProfile } from '../services/supabase/profileService';
import { signOut as authSignOut } from '../services/supabase/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
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

  async function loadProfile(userId) {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);
    } catch {
      // Profile may not exist yet (new user)
      setProfile(null);
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
