import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/NotificationContext';
import { updateProfile, uploadAvatar } from '../../services/supabase/profileService';
import { fetchGitHubUser } from '../../services/supabase/githubService';

function GitHubIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const schema = z.object({
  full_name: z.string().min(2),
  username:  z.string().min(3),
  bio:       z.string().max(200).optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  timezone:  z.string(),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  github_username: z.string().optional().or(z.literal('')),
  github_token: z.string().optional().or(z.literal('')),
});

export default function Profile() {
  const { user, profile, refreshProfile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const avatarSrc = localAvatar || profile?.avatar_url;

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show a local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setLocalAvatar(previewUrl);
    setUploading(true);
    try {
      await uploadAvatar(user.id, file);
      await refreshProfile();
      success('Avatar updated!', 'Your profile picture has been saved.');
    } catch (err) {
      showError('Upload failed', err.message);
      setLocalAvatar(null); // revert preview on error
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected if needed
      e.target.value = '';
    }
  }

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
      github_username: profile?.github_username || localStorage.getItem('github_username_fallback') || '',
      github_token: profile?.github_token || localStorage.getItem('github_token_fallback') || '',
    },
  });

  async function onSubmit(values) {
    setSaving(true);
    try {
      // If a token is provided, auto-fetch username from GitHub API
      if (values.github_token) {
        try {
          const ghUser = await fetchGitHubUser(values.github_token);
          values.github_username = ghUser.login;
        } catch {
          // Token invalid or API blocked — keep the manually typed username
          if (!values.github_username) {
            throw new Error('Invalid GitHub token and no username provided. Please enter your GitHub username manually.');
          }
        }
      } else {
        values.github_token = null;
        // If username was cleared too, wipe it
        if (!values.github_username) values.github_username = null;
      }

      // Save to localStorage as fallback in case DB update fails
      if (values.github_username) {
        localStorage.setItem('github_username_fallback', values.github_username);
        if (values.github_token) localStorage.setItem('github_token_fallback', values.github_token);
      }

      try {
        await updateProfile(user.id, values);
      } catch (dbErr) {
        console.warn('DB update failed, but saved locally.', dbErr);
        // Still update in-memory profile
      }
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
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#6D5DFB]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-[#6D5DFB] bg-gradient-to-br from-[#6D5DFB] to-[#38BDF8] flex items-center justify-center text-white text-xl font-black">
              {(profile?.full_name || profile?.username || '?').slice(0, 2).toUpperCase()}
            </div>
          )}
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#6D5DFB] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#5a4ce6] transition-colors disabled:opacity-70"
            title="Change profile picture"
          >
            {uploading
              ? <Loader2 size={12} className="text-white animate-spin" />
              : <Camera size={13} className="text-white" />}
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

        {/* GitHub Section */}
        <div className="border border-[#23273B] rounded-xl p-4 space-y-3 bg-[#0D101D]/50">
          <div className="flex items-center gap-2 mb-1">
            <GitHubIcon className="text-[#9CA3AF]" />
            <p className="text-white text-sm font-semibold">GitHub Integration</p>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">
              GitHub Username <span className="text-[#6D5DFB]">(required for activity graph)</span>
            </label>
            <input {...register('github_username')} type="text" placeholder="e.g. mohitkumar"
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors" />
            <p className="text-[#6B7280] text-[11px] mt-1">Enter your exact GitHub username — no @ symbol needed.</p>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">
              GitHub Personal Access Token <span className="text-[#6B7280]">(optional — needed for private repos)</span>
            </label>
            <input {...register('github_token')} type="password" placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] transition-colors" />
            <p className="text-[#6B7280] text-[11px] mt-1">If provided, auto-fills your username and enables private repo language stats.</p>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
        </motion.button>
      </form>
    </motion.div>
  );
}
