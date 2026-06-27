import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard', { replace: true });
      else navigate('/login', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#9CA3AF] text-sm">Completing sign in…</p>
      </div>
    </div>
  );
}
