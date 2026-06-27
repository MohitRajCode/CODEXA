import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { resetPassword } from '../../services/supabase/authService';
import { useToast } from '../../contexts/NotificationContext';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ResetPassword() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit({ password }) {
    setIsLoading(true);
    try {
      await resetPassword(password);
      success('Password reset!', 'You can now sign in with your new password.');
      navigate('/login');
    } catch (err) {
      showError('Reset failed', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-6">
          <h1 className="text-white text-xl font-bold mb-1">Set new password</h1>
          <p className="text-[#9CA3AF] text-sm mb-6">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[['password', 'New Password'], ['confirmPassword', 'Confirm Password']].map(([name, label]) => (
              <div key={name}>
                <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">{label}</label>
                <input {...register(name)} type="password" placeholder="••••••••"
                  className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors" />
                {errors[name] && <p className="text-[#EF4444] text-xs mt-1">{errors[name].message}</p>}
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center cursor-pointer">
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
