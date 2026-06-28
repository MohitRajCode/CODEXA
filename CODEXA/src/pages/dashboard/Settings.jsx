import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Globe, Trash2, Key, AlertTriangle, X, Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/NotificationContext';
import { resetPassword, updateEmail } from '../../services/supabase/authService';
import { supabase } from '../../services/supabase/client';

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative flex-shrink-0 ${value ? 'bg-[#6D5DFB]' : 'bg-[#23273B]'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-[#6D5DFB]" />
        <h3 className="text-white text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#23273B] last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{label}</p>
        {description && <p className="text-[#9CA3AF] text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const { success, error: showError } = useToast();
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (newPwd.length < 8) { showError('Too short', 'Password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { showError('Mismatch', 'Passwords do not match.'); return; }
    setSaving(true);
    try {
      await resetPassword(newPwd);
      success('Password updated!', 'Your new password is now active.');
      onClose();
    } catch (err) {
      showError('Failed', err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#121523] border border-[#23273B] rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#6D5DFB]/20 rounded-xl flex items-center justify-center">
              <Key size={16} className="text-[#6D5DFB]" />
            </div>
            <h2 className="text-white font-bold">Change Password</h2>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white cursor-pointer"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#23273B] text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/30 text-sm transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#6D5DFB] hover:bg-[#5a4ce6] disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Change Email Modal ────────────────────────────────────────────────────────
function ChangeEmailModal({ onClose, currentEmail }) {
  const { success, error: showError } = useToast();
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!newEmail.includes('@')) { showError('Invalid email', 'Please enter a valid email address.'); return; }
    setSaving(true);
    try {
      await updateEmail(newEmail);
      success('Confirmation sent!', 'Check your new email inbox to confirm the change.');
      onClose();
    } catch (err) {
      showError('Failed', err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#121523] border border-[#23273B] rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#38BDF8]/20 rounded-xl flex items-center justify-center">
              <Mail size={16} className="text-[#38BDF8]" />
            </div>
            <h2 className="text-white font-bold">Change Email</h2>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <p className="text-[#9CA3AF] text-sm mb-4">Current email: <span className="text-white">{currentEmail}</span></p>

        <div>
          <label className="text-[#9CA3AF] text-xs font-medium block mb-1.5">New Email Address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[#0D101D] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
          />
          <p className="text-[#6B7280] text-[11px] mt-1.5">A confirmation link will be sent to your new email.</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#23273B] text-[#9CA3AF] hover:text-white text-sm transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#2aa8e0] disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {saving ? 'Sending…' : 'Update Email'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Account Modal ─────────────────────────────────────────────────────
function DeleteAccountModal({ onClose, username }) {
  const { signOut } = useAuthContext();
  const { error: showError } = useToast();
  const [input, setInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const required = `codexa/${username}`;
  const isValid = input.toLowerCase() === required.toLowerCase();

  async function handleDelete() {
    if (!isValid) return;
    setDeleting(true);
    try {
      // Delete all user data then sign out
      // Supabase cascade deletes handle the rest via FK constraints
      await supabase.from('sessions').delete().eq('user_id', (await supabase.auth.getUser()).data.user.id);
      await supabase.from('goals').delete().eq('user_id', (await supabase.auth.getUser()).data.user.id);
      await supabase.from('projects').delete().eq('user_id', (await supabase.auth.getUser()).data.user.id);
      await supabase.auth.admin?.deleteUser?.((await supabase.auth.getUser()).data.user.id);
      // Clear local storage
      localStorage.clear();
      await signOut();
    } catch (err) {
      // Even if server delete fails, sign out and clear local data
      console.error(err);
      localStorage.clear();
      await signOut();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#121523] border border-[#EF4444]/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EF4444]/20 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#EF4444]" />
            </div>
            <h2 className="text-white font-black text-lg">Delete Account</h2>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-3 mb-5 mt-3">
          <p className="text-[#EF4444] text-sm font-semibold mb-1">⚠ This action is permanent</p>
          <p className="text-[#9CA3AF] text-xs">All your sessions, goals, projects, and profile data will be deleted forever. This cannot be undone.</p>
        </div>

        <div>
          <label className="text-[#9CA3AF] text-xs font-medium block mb-2">
            To confirm, type <span className="text-white font-bold font-mono bg-[#0D101D] px-1.5 py-0.5 rounded">{required}</span> below:
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={required}
            className={`w-full bg-[#0D101D] border rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none transition-colors ${
              input.length === 0 ? 'border-[#23273B]' :
              isValid ? 'border-[#22C55E]/50 bg-[#22C55E]/5' :
              'border-[#EF4444]/40'
            }`}
          />
          {input.length > 0 && !isValid && (
            <p className="text-[#EF4444] text-[11px] mt-1">Type exactly: <span className="font-mono font-bold">{required}</span></p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#23273B] text-[#9CA3AF] hover:text-white text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isValid || deleting}
            className="flex-1 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#dc2626] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all cursor-pointer"
          >
            {deleting ? 'Deleting…' : 'Delete My Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function Settings() {
  const { user, profile, signOut } = useAuthContext();
  const { success, warning } = useToast();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyReport: true,
    achievementAlerts: true,
    publicProfile: false,
    showInLeaderboard: false,
  });

  const [modal, setModal] = useState(null); // 'password' | 'email' | 'delete'

  function toggle(key) { setSettings(s => ({ ...s, [key]: !s[key] })); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 max-w-2xl space-y-4">
      <div>
        <h1 className="text-white text-xl font-bold">Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage your preferences and account security</p>
      </div>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <SettingRow label="Email Notifications" description="Receive updates and alerts via email">
          <Toggle value={settings.emailNotifications} onChange={() => toggle('emailNotifications')} />
        </SettingRow>
        <SettingRow label="Weekly Report" description="Get a weekly summary of your coding activity">
          <Toggle value={settings.weeklyReport} onChange={() => toggle('weeklyReport')} />
        </SettingRow>
        <SettingRow label="Achievement Alerts" description="Get notified when you unlock achievements">
          <Toggle value={settings.achievementAlerts} onChange={() => toggle('achievementAlerts')} />
        </SettingRow>
      </Section>

      {/* Privacy */}
      <Section title="Privacy" icon={Globe}>
        <SettingRow label="Public Profile" description="Allow others to view your profile and stats">
          <Toggle value={settings.publicProfile} onChange={() => toggle('publicProfile')} />
        </SettingRow>
        <SettingRow label="Show in Leaderboard" description="Appear in the community leaderboard rankings">
          <Toggle value={settings.showInLeaderboard} onChange={() => toggle('showInLeaderboard')} />
        </SettingRow>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <SettingRow label="Change Password" description="Update your account password">
          <button
            onClick={() => setModal('password')}
            className="px-3 py-1.5 bg-[#6D5DFB]/20 hover:bg-[#6D5DFB]/30 text-[#6D5DFB] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Key size={12} /> Update
          </button>
        </SettingRow>
        <SettingRow label="Change Email" description={`Current: ${user?.email || '—'}`}>
          <button
            onClick={() => setModal('email')}
            className="px-3 py-1.5 bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Mail size={12} /> Update
          </button>
        </SettingRow>
        <SettingRow label="Sign Out" description="Sign out of your current session">
          <button
            onClick={signOut}
            className="px-3 py-1.5 bg-[#23273B] hover:bg-[#2d3347] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </SettingRow>
      </Section>

      {/* Danger Zone */}
      <div className="bg-[#121523] border border-[#EF4444]/30 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={16} className="text-[#EF4444]" />
          <h3 className="text-white text-sm font-semibold">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Delete Account</p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Permanently delete your account and all associated data.</p>
          </div>
          <button
            onClick={() => setModal('delete')}
            className="px-3 py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ml-4"
          >
            <Trash2 size={12} /> Delete Account
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'password' && <ChangePasswordModal onClose={() => setModal(null)} />}
        {modal === 'email' && <ChangeEmailModal onClose={() => setModal(null)} currentEmail={user?.email} />}
        {modal === 'delete' && <DeleteAccountModal onClose={() => setModal(null)} username={profile?.username || user?.email?.split('@')[0] || 'user'} />}
      </AnimatePresence>
    </motion.div>
  );
}
