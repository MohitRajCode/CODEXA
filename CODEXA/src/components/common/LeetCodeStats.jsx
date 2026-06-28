import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, Target, Calendar, Flame, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchLeetCodeStats } from '../../services/supabase/leetcodeService';
import { updateProfile } from '../../services/supabase/profileService';

// ── Difficulty badge colors ────────────────────────────────────────────────────
const DIFF_COLORS = {
  Easy:   { text: '#22C55E', bg: 'rgba(34,197,94,0.12)',   bar: '#22C55E' },
  Medium: { text: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  bar: '#F59E0B' },
  Hard:   { text: '#EF4444', bg: 'rgba(239,68,68,0.12)',   bar: '#EF4444' },
};

// ── Mini progress bar ─────────────────────────────────────────────────────────
function DiffBar({ label, solved, total, colors }) {
  const pct = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold" style={{ color: colors.text }}>{label}</span>
        <span className="text-[10px] text-[#9CA3AF]">{solved}<span className="text-[#4B5563]">/{total}</span></span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: colors.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// ── Period stat pill ──────────────────────────────────────────────────────────
function PeriodStat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={14} style={{ color }} strokeWidth={2.2} />
      </div>
      <span className="text-white text-base font-bold leading-none">{value}</span>
      <span className="text-[#9CA3AF] text-[9px] font-medium leading-none">{label}</span>
    </div>
  );
}

export default function LeetCodeStats() {
  const { profile } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const [showInput, setShowInput] = useState(false);

  const leetcodeUsername = profile?.leetcode_username || localStorage.getItem('lc_username_fallback');

  useEffect(() => {
    if (!leetcodeUsername) { setLoading(false); return; }
    loadStats(leetcodeUsername);
  }, [leetcodeUsername]);

  async function loadStats(username) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeetCodeStats(username);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    const username = inputUsername.trim();
    if (!username) return;
    setConnecting(true);
    try {
      // Try to fetch stats first to validate username
      const data = await fetchLeetCodeStats(username);
      localStorage.setItem('lc_username_fallback', username);
      if (profile?.id) {
        try { await updateProfile(profile.id, { leetcode_username: username }); } catch {}
      }
      setStats(data);
      setShowInput(false);
    } catch (err) {
      setError(`Could not find user "${username}". Check the username and try again.`);
    } finally {
      setConnecting(false);
    }
  }

  // ─── Skeleton loader ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex items-center justify-center h-full min-h-[200px]">
        <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Not connected or Error ──────────────────────────────────────────────────
  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)', transform: 'translate(30%, -30%)' }} />

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 flex items-center justify-center">
            <Code2 size={15} className="text-[#F97316]" strokeWidth={2.2} />
          </div>
          <h3 className="text-white text-sm font-semibold">LeetCode Stats</h3>
        </div>

        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center mt-4">
            <AlertCircle size={24} className="text-[#EF4444]" />
            <p className="text-[#9CA3AF] text-xs">Couldn't load stats for <span className="text-white font-bold">@{leetcodeUsername || inputUsername}</span></p>
            <button 
              onClick={() => { 
                localStorage.removeItem('lc_username_fallback');
                setStats(null); 
                setError(null);
                setShowInput(true);
              }} 
              className="text-[#6D5DFB] text-xs underline cursor-pointer mt-2">
              Try another username
            </button>
          </div>
        ) : !showInput ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center">
              <Code2 size={28} className="text-[#F97316]" />
            </div>
            <div className="text-center">
              <h4 className="text-white text-sm font-semibold mb-1">Connect LeetCode</h4>
              <p className="text-[#9CA3AF] text-[11px] max-w-[180px] text-center leading-relaxed">
                Link your LeetCode profile to track your problem solving progress.
              </p>
            </div>
            <button
              onClick={() => setShowInput(true)}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6c0b] text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              Connect LeetCode
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-[#9CA3AF] text-[11px]">Enter your LeetCode username:</p>
            <input
              type="text"
              value={inputUsername}
              onChange={e => setInputUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConnect()}
              placeholder="e.g. mohit_kumar"
              autoFocus
              className="w-full bg-[#0D1117] border border-[#23273B] rounded-xl px-3 py-2 text-white text-sm placeholder-[#4B5563] outline-none focus:border-[#F97316]/60 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleConnect}
                disabled={connecting || !inputUsername.trim()}
                className="flex-1 px-3 py-2 bg-[#F97316] hover:bg-[#ea6c0b] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                {connecting ? 'Connecting…' : 'Connect'}
              </button>
              <button
                onClick={() => { setShowInput(false); setError(null); }}
                className="px-3 py-2 bg-[#23273B] hover:bg-[#2e3349] text-[#9CA3AF] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // ─── Connected — show stats ─────────────────────────────────────────────────
  const totalPct = stats.totalAll > 0 ? Math.min(100, Math.round((stats.totalSolved / stats.totalAll) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full relative overflow-hidden"
    >
      {/* bg glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F97316, transparent)', transform: 'translate(40%, -40%)' }} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 flex items-center justify-center">
            <Code2 size={15} className="text-[#F97316]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold leading-none">LeetCode Stats</h3>
            <p className="text-[#9CA3AF] text-[10px] mt-0.5 leading-none">@{stats.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-[#22C55E]" />
          <span className="text-[#22C55E] text-[10px] font-medium">Connected</span>
        </div>
      </div>

      {/* ── Total solved ring ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-4">
        {/* Circular progress */}
        <div className="relative flex-shrink-0 w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#1E2435" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="url(#lcGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - totalPct / 100) }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
            <defs>
              <linearGradient id="lcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-lg font-bold leading-none">{stats.totalSolved}</span>
            <span className="text-[#9CA3AF] text-[9px] leading-none mt-0.5">solved</span>
          </div>
        </div>

        {/* Difficulty bars */}
        <div className="flex-1 flex flex-col gap-2">
          <DiffBar label="Easy"   solved={stats.easySolved} total={stats.totalEasy} colors={DIFF_COLORS.Easy} />
          <DiffBar label="Medium" solved={stats.medSolved}  total={stats.totalMed}  colors={DIFF_COLORS.Medium} />
          <DiffBar label="Hard"   solved={stats.hardSolved} total={stats.totalHard} colors={DIFF_COLORS.Hard} />
        </div>
      </div>

      {/* ── Period stats ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0D1117] rounded-xl p-3 border border-[#1E2435]">
        <p className="text-[#9CA3AF] text-[9px] font-semibold uppercase tracking-widest mb-3 text-center">Submissions</p>
        <div className="flex items-center gap-2">
          <PeriodStat icon={Flame}    label="Today"  value={stats.todayCount}  color="#EF4444" />
          <div className="w-px h-10 bg-[#1E2435]" />
          <PeriodStat icon={Calendar} label="Week"   value={stats.weekCount}   color="#6D5DFB" />
          <div className="w-px h-10 bg-[#1E2435]" />
          <PeriodStat icon={Target}   label="Month"  value={stats.monthCount}  color="#F59E0B" />
          <div className="w-px h-10 bg-[#1E2435]" />
          <PeriodStat icon={Trophy}   label="Total"  value={stats.totalSolved} color="#F97316" />
        </div>
      </div>

      {/* ── Disconnect / refresh link ─────────────────────────────────────────── */}
      <button
        onClick={() => {
          localStorage.removeItem('lc_username_fallback');
          localStorage.removeItem(`lc_stats_${stats.username}`);
          if (profile?.id) {
            updateProfile(profile.id, { leetcode_username: null }).catch(() => {});
          }
          setStats(null);
          setError(null);
          setShowInput(true);
        }}
        className="mt-3 text-[#4B5563] text-[10px] hover:text-[#9CA3AF] transition-colors cursor-pointer self-center"
      >
        Change username
      </button>
    </motion.div>
  );
}
