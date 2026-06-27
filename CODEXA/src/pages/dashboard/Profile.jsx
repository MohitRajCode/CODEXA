import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useToast } from '../../contexts/NotificationContext';
import { updateProfile } from '../../services/supabase/profileService';

const schema = z.object({
  full_name: z.string().min(2),
  username:  z.string().min(3),
  bio:       z.string().max(200).optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  timezone:  z.string(),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export default function Profile() {
  const { user, profile, refreshProfile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name || '',
      username:  profile?.username  || '',
      bio:       profile?.bio       || '',
      website_url: profile?.website_url || '',
      twitter_url: profile?.twitter_url || '',
      linkedin_url: profile?.linkedin_url || '',
      timezone:  profile?.timezone || 'UTC',
      experience: profile?.experience || 'intermediate',
    },
  });

  async function onSubmit(values) {
    setSaving(true);
    try {
      await updateProfile(user.id, values);
      await refreshProfile();
      success('Profile updated!', 'Your changes have been saved.');
    } catch (err) {
      showError('Update failed', err.message);
    } finally {
      setSaving(false);
    }
  }

  const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 max-w-2xl">
      <h1 className="text-white text-xl font-bold mb-1">Profile</h1>
      <p className="text-[#9CA3AF] text-sm mb-6">Manage your public profile</p>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 p-5 bg-[#121523] border border-[#23273B] rounded-2xl">
        <div className="relative">
          <img src={profile?.avatar_url || `https://i.pravatar.cc/100?u=${user?.id}`}
            alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#6D5DFB]" />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#6D5DFB] rounded-full flex items-center justify-center cursor-pointer">
            <Camera size={13} className="text-white" />
          </button>
        </div>
        <div>
          <p className="text-white font-semibold">{profile?.full_name}</p>
          <p className="text-[#9CA3AF] text-sm">@{profile?.username}</p>
          <p className="text-[#6D5DFB] text-xs mt-1 capitalize">{profile?.plan || 'free'} plan</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[['full_name', 'Full Name', 'text'], ['username', 'Username', 'text']].map(([name, label, type]) => (
            <div key={name}>
              <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">{label}</label>
              <input {...register(name)} type={type}
                className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors" />
              {errors[name] && <p className="text-[#EF4444] text-xs mt-1">{errors[name].message}</p>}
            </div>
          ))}
        </div>

        <div>
          <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Bio</label>
          <textarea {...register('bio')} rows={3} placeholder="Tell the community about yourself..."
            className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-[#6D5DFB] transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Timezone</label>
            <select {...register('timezone')}
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors">
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Experience</label>
            <select {...register('experience')}
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors">
              {['beginner', 'intermediate', 'advanced', 'expert'].map(e => <option key={e} value={e} className="capitalize">{e}</option>)}
            </select>
          </div>
        </div>

        {[['website_url', 'Website URL'], ['twitter_url', 'Twitter / X'], ['linkedin_url', 'LinkedIn']].map(([name, label]) => (
          <div key={name}>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">{label}</label>
            <input {...register(name)} type="text" placeholder="https://"
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors" />
          </div>
        ))}

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
        </motion.button>
      </form>
    </motion.div>
  );
}
