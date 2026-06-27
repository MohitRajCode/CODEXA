import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { forgotPassword } from '../../services/supabase/authService';
import { useToast } from '../../contexts/NotificationContext';

const schema = z.object({ email: z.string().email('Invalid email address') });

export default function ForgotPassword() {
  const { success, error: showError } = useToast();
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit({ email }) {
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      success('Email sent!', 'Check your inbox for the reset link.');
    } catch (err) {
      showError('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#6D5DFB] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9"/><path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white"/></svg>
          </div>
          <span className="text-white text-xl font-bold">Codexa</span>
        </Link>

        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#6D5DFB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={26} className="text-[#6D5DFB]" />
              </div>
              <h2 className="text-white text-lg font-bold mb-2">Check your email</h2>
              <p className="text-[#9CA3AF] text-sm mb-5">We sent a password reset link to your email address.</p>
              <Link to="/login" className="text-[#6D5DFB] text-sm hover:text-[#8B7CF8]">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-white text-xl font-bold mb-1">Forgot password?</h1>
              <p className="text-[#9CA3AF] text-sm mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Email</label>
                  <input {...register('email')} type="email" placeholder="mohit@example.com"
                    className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors" />
                  {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email.message}</p>}
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading}
                  className="w-full bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Link'}
                </motion.button>
              </form>
              <p className="text-center text-[#9CA3AF] text-xs mt-5">
                <Link to="/login" className="text-[#6D5DFB] hover:text-[#8B7CF8]">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
