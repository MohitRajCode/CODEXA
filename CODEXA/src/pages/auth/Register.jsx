import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { signUp } from '../../services/supabase/authService';
import { useToast } from '../../contexts/NotificationContext';

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, underscores only'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      await signUp({ email: values.email, password: values.password, fullName: values.fullName, username: values.username });
      success('Account created! 🎉', 'Check your email to verify your account, then sign in.');
      navigate('/login');
    } catch (err) {
      console.error('[Register] signUp error:', err);
      showError('Registration failed', err.message || 'An unexpected error occurred. Check browser console for details.');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-white text-xl font-bold mb-1">Create your account</h1>
          <p className="text-[#9CA3AF] text-sm mb-5">Start tracking your coding journey</p>

          {/* OAuth — disabled until configured in Supabase Auth → Providers */}
          <div className="flex gap-3 mb-5">
            {['GitHub', 'Google'].map((label) => (
              <div key={label} className="relative flex-1 group">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-[#1E2235] border border-[#23273B] text-[#6B7280] text-sm font-medium cursor-not-allowed"
                >
                  {label}
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#1E2235] border border-[#23273B] rounded-lg px-3 py-2 text-[10px] text-[#9CA3AF] text-center z-10 shadow-xl hidden group-hover:block pointer-events-none">
                  Enable {label} in Supabase → Auth → Providers
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#23273B]" />
            <span className="text-[#9CA3AF] text-xs">or with email</span>
            <div className="flex-1 h-px bg-[#23273B]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {[
              { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Mohit Verma' },
              { name: 'username', label: 'Username', type: 'text', placeholder: 'mohit_dev' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'mohit@example.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
                />
                {errors[name] && <p className="text-[#EF4444] text-xs mt-1">{errors[name].message}</p>}
              </div>
            ))}

            <div>
              <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
              />
              {errors.confirmPassword && <p className="text-[#EF4444] text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={16} /> Create Account</>}
            </motion.button>
          </form>

          <p className="text-center text-[#9CA3AF] text-xs mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6D5DFB] hover:text-[#8B7CF8] font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
