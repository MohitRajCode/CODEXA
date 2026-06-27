import { motion } from 'framer-motion';
import { Bell, Shield, Palette, Globe, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/NotificationContext';

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${value ? 'bg-[#6D5DFB]' : 'bg-[#23273B]'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

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
    <div className="flex items-center justify-between py-3 border-b border-[#23273B] last:border-0">
      <div>
        <p className="text-white text-sm">{label}</p>
        {description && <p className="text-[#9CA3AF] text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { signOut } = useAuthContext();
  const { success, error: showError, warning } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    achievementAlerts: true,
    publicProfile: false,
    showInLeaderboard: false,
    autoTrack: false,
  });

  function toggle(key) { setSettings(s => ({ ...s, [key]: !s[key] })); }

  function handleDeleteAccount() {
    warning('Delete Account', 'This action is irreversible. Please contact support.');
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 max-w-2xl space-y-4">
      <div>
        <h1 className="text-white text-xl font-bold">Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Manage your preferences</p>
      </div>

      <Section title="Notifications" icon={Bell}>
        <SettingRow label="Email Notifications" description="Receive updates via email">
          <Toggle value={settings.emailNotifications} onChange={() => toggle('emailNotifications')} />
        </SettingRow>
        <SettingRow label="Weekly Report" description="Get a weekly summary of your coding activity">
          <Toggle value={settings.weeklyReport} onChange={() => toggle('weeklyReport')} />
        </SettingRow>
        <SettingRow label="Achievement Alerts" description="Get notified when you unlock achievements">
          <Toggle value={settings.achievementAlerts} onChange={() => toggle('achievementAlerts')} />
        </SettingRow>
      </Section>

      <Section title="Privacy" icon={Globe}>
        <SettingRow label="Public Profile" description="Allow others to see your profile">
          <Toggle value={settings.publicProfile} onChange={() => toggle('publicProfile')} />
        </SettingRow>
        <SettingRow label="Show in Leaderboard" description="Appear in the community leaderboard">
          <Toggle value={settings.showInLeaderboard} onChange={() => toggle('showInLeaderboard')} />
        </SettingRow>
      </Section>

      <Section title="Security" icon={Shield}>
        <SettingRow label="Change Password">
          <button className="text-[#6D5DFB] text-xs font-medium hover:text-[#8B7CF8] cursor-pointer">Update</button>
        </SettingRow>
        <SettingRow label="Connected Accounts">
          <button className="text-[#6D5DFB] text-xs font-medium hover:text-[#8B7CF8] cursor-pointer">Manage</button>
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle value={false} onChange={() => warning('2FA', '2FA setup coming soon.')} />
        </SettingRow>
      </Section>

      <Section title="Danger Zone" icon={Trash2}>
        <SettingRow label="Sign Out" description="Sign out of all devices">
          <button onClick={signOut} className="px-3 py-1.5 bg-[#23273B] hover:bg-[#2d3347] text-white text-xs rounded-lg transition-colors cursor-pointer">
            Sign Out
          </button>
        </SettingRow>
        <SettingRow label="Delete Account" description="Permanently delete your account and all data">
          <button onClick={handleDeleteAccount} className="px-3 py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] text-xs rounded-lg transition-colors cursor-pointer">
            Delete
          </button>
        </SettingRow>
      </Section>
    </motion.div>
  );
}
