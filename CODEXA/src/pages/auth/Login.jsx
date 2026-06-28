import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { signIn, signInWithOAuth } from '../../services/supabase/authService';
import { useToast } from '../../contexts/NotificationContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Google OAuth button — calls Supabase when clicked
function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1E2235] border border-[#23273B] text-white text-sm font-medium hover:border-[#6D5DFB]/50 transition-colors cursor-pointer"
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Google
    </button>
  );
}

export default function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { error: showError } = useToast();
  const [showPw, setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await signIn(values);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('[Login] signIn error:', err);
      showError('Sign in failed', err.message || 'An unexpected error occurred. Check console.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#6D5DFB] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9" />
              <path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold">Codexa</span>
        </Link>

        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-6">
          <h1 className="text-white text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-[#9CA3AF] text-sm mb-6">Sign in to your account</p>

          {/* OAuth — GitHub: tooltip (not configured), Google: live */}
          <div className="flex gap-3 mb-5">
            {/* GitHub — disabled with tooltip */}
            <div className="relative flex-1 group">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1E2235] border border-[#23273B] text-[#6B7280] text-sm font-medium cursor-not-allowed"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#1E2235] border border-[#23273B] rounded-lg px-3 py-2 text-[10px] text-[#9CA3AF] text-center z-10 shadow-xl hidden group-hover:block pointer-events-none">
                Enable GitHub in Supabase → Auth → Providers
              </div>
            </div>

            {/* Google — live button (enable in Supabase first) */}
            <GoogleButton onClick={async () => {
              try { await signInWithOAuth('google'); }
              catch (err) { showError('Google sign-in failed', err.message); }
            }} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#23273B]" />
            <span className="text-[#9CA3AF] text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-[#23273B]" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="mohit@example.com"
                autoComplete="email"
                className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
              />
              {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#9CA3AF] text-xs font-medium">Password</label>
                <Link to="/forgot-password" className="text-[#6D5DFB] text-xs hover:text-[#8B7CF8]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><LogIn size={16} /> Sign in</>
              }
            </motion.button>
          </form>

          <p className="text-center text-[#9CA3AF] text-xs mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6D5DFB] hover:text-[#8B7CF8] font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
