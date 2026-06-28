import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Clock, GitCommit, Zap, Users, ChevronDown, ToggleLeft, ToggleRight, TrendingUp, Star } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchLeaderboard, getLeaderboardOptIn, updateLeaderboardOptIn } from '../../services/supabase/leaderboardService';
import { useToast } from '../../contexts/NotificationContext';

// ─── Medal colors for top 3 ───────────────────────────────────────────────────
const RANK_CONFIG = {
  1: { crown: '#FFD700', glow: 'rgba(255,215,0,0.25)', border: 'border-[#FFD700]/40', bg: 'from-[#FFD700]/10 to-transparent', label: '1st' },
  2: { crown: '#C0C0C0', glow: 'rgba(192,192,192,0.2)',  border: 'border-[#C0C0C0]/40', bg: 'from-[#C0C0C0]/10 to-transparent', label: '2nd' },
  3: { crown: '#CD7F32', glow: 'rgba(205,127,50,0.2)',   border: 'border-[#CD7F32]/40', bg: 'from-[#CD7F32]/10 to-transparent', label: '3rd' },
};

const EXPERIENCE_COLORS = {
  beginner:     '#22C55E',
  intermediate: '#3B82F6',
  advanced:     '#8B5CF6',
  expert:       '#F59E0B',
};

const METRICS = [
  { id: 'hours',    label: 'Coding Hours', icon: Clock,     unit: 'hrs',  color: '#6D5DFB' },
  { id: 'sessions', label: 'Sessions',      icon: Zap,      unit: '',     color: '#38BDF8' },
  { id: 'score',    label: 'Score',         icon: TrendingUp, unit: 'pts', color: '#22C55E' },
];

const PERIODS = [
  { id: 'week',  label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all',   label: 'All Time' },
];

// ─── Avatar component ─────────────────────────────────────────────────────────
function Avatar({ user, size = 40 }) {
  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.username}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = (user.full_name || user.username || '?').slice(0, 2).toUpperCase();
  const colors = ['#6D5DFB', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
  const colorIdx = (user.username?.charCodeAt(0) || 0) % colors.length;
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{ width: size, height: size, backgroundColor: colors[colorIdx], fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// ─── Top 3 Podium Card ────────────────────────────────────────────────────────
function PodiumCard({ user, metric, isCurrentUser }) {
  const config = RANK_CONFIG[user.rank];
  const metricCfg = METRICS.find((m) => m.id === metric);
  const value = user[metric];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: user.rank * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`relative flex flex-col items-center p-5 rounded-2xl border bg-gradient-to-b ${config.bg} ${config.border} ${isCurrentUser ? 'ring-2 ring-[#6D5DFB]/60' : ''}`}
      style={{ boxShadow: `0 0 30px ${config.glow}` }}
    >
      {/* Crown */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Crown size={28} style={{ color: config.crown, filter: `drop-shadow(0 0 6px ${config.crown})` }} />
      </div>

      {/* Rank badge */}
      <div
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-black"
        style={{ backgroundColor: config.crown }}
      >
        {user.rank}
      </div>

      {/* Avatar */}
      <div className="mt-3 mb-3 relative">
        <Avatar user={user} size={56} />
        {isCurrentUser && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#6D5DFB] rounded-full border border-[#121523] flex items-center justify-center">
            <Star size={8} className="text-white" />
          </div>
        )}
      </div>

      <p className="text-white text-sm font-bold text-center truncate max-w-[120px]">{user.full_name}</p>
      <p className="text-[#9CA3AF] text-[11px] truncate max-w-[120px]">@{user.username}</p>

      {/* Experience badge */}
      {user.experience && (
        <span
          className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold capitalize"
          style={{ backgroundColor: (EXPERIENCE_COLORS[user.experience] || '#6B7280') + '22', color: EXPERIENCE_COLORS[user.experience] || '#6B7280' }}
        >
          {user.experience}
        </span>
      )}

      {/* Value */}
      <div className="mt-3 text-center">
        <p className="font-black text-xl" style={{ color: metricCfg.color }}>
          {value}{metricCfg.unit && <span className="text-sm font-medium ml-0.5">{metricCfg.unit}</span>}
        </p>
        <p className="text-[#9CA3AF] text-[10px]">{metricCfg.label}</p>
      </div>
    </motion.div>
  );
}

// ─── Rank Row (table row) ─────────────────────────────────────────────────────
function RankRow({ user, metric, isCurrentUser, index }) {
  const metricCfg = METRICS.find((m) => m.id === metric);
  const value = user[metric];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
        isCurrentUser
          ? 'bg-[#6D5DFB]/15 border border-[#6D5DFB]/30'
          : 'hover:bg-white/[0.03] border border-transparent'
      }`}
    >
      {/* Rank number */}
      <div className="w-8 text-center flex-shrink-0">
        {user.rank <= 3 ? (
          <Medal size={18} style={{ color: RANK_CONFIG[user.rank].crown }} className="mx-auto" />
        ) : (
          <span className="text-[#6B7280] text-sm font-bold">#{user.rank}</span>
        )}
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar user={user} size={34} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-semibold truncate">{user.full_name}</p>
            {isCurrentUser && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#6D5DFB]/30 text-[#6D5DFB] rounded-full flex-shrink-0">YOU</span>
            )}
          </div>
          <p className="text-[#6B7280] text-[11px] truncate">@{user.username}</p>
        </div>
      </div>

      {/* Experience */}
      {user.experience && (
        <span
          className="hidden sm:block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize flex-shrink-0"
          style={{ backgroundColor: (EXPERIENCE_COLORS[user.experience] || '#6B7280') + '22', color: EXPERIENCE_COLORS[user.experience] || '#6B7280' }}
        >
          {user.experience}
        </span>
      )}

      {/* Metric value */}
      <div className="text-right flex-shrink-0 min-w-[60px]">
        <p className="font-bold text-sm" style={{ color: metricCfg.color }}>
          {value}
          {metricCfg.unit && <span className="text-[10px] font-normal ml-0.5 text-[#9CA3AF]">{metricCfg.unit}</span>}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Leaderboard Page ─────────────────────────────────────────────────────
export default function Leaderboard() {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState('hours');
  const [period, setPeriod] = useState('week');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [togglingOptIn, setTogglingOptIn] = useState(false);

  // Load opt-in status
  useEffect(() => {
    if (!user?.id) return;
    getLeaderboardOptIn(user.id).then(setOptedIn).catch(console.error);
  }, [user?.id]);

  // Load leaderboard
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(metric, period);
      setEntries(data);
    } catch (err) {
      console.error(err);
      showError('Leaderboard Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [metric, period]);

  useEffect(() => { load(); }, [load]);

  // Handle opt-in toggle
  const handleToggleOptIn = async () => {
    if (!user?.id) return;
    setTogglingOptIn(true);
    try {
      const newVal = !optedIn;
      await updateLeaderboardOptIn(user.id, newVal);
      setOptedIn(newVal);
      // Refresh leaderboard after toggle
      load();
    } catch (err) {
      showError('Failed to update settings', err.message);
    } finally {
      setTogglingOptIn(false);
    }
  };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserEntry = entries.find((e) => e.id === user?.id);
  const currentUserRank = currentUserEntry?.rank;
  const currentPeriod = PERIODS.find((p) => p.id === period);
  const currentMetric = METRICS.find((m) => m.id === metric);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 max-w-4xl mx-auto"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#6D5DFB]/20 border border-[#FFD700]/20 flex items-center justify-center">
              <Trophy size={20} className="text-[#FFD700]" />
            </div>
            <h1 className="text-white text-2xl font-black">Leaderboard</h1>
          </div>
          <p className="text-[#9CA3AF] text-sm ml-[52px]">Compete with other coders. Show the world your grind.</p>
        </div>

        {/* Period Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPeriodOpen((v) => !v)}
            className="flex items-center gap-2 bg-[#1E2235] border border-[#23273B] hover:border-[#6D5DFB]/50 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {currentPeriod?.label}
            <ChevronDown size={14} className={`transition-transform ${periodOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {periodOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 z-30 bg-[#1E2235] border border-[#23273B] rounded-xl shadow-2xl overflow-hidden min-w-[140px]"
              >
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setPeriod(p.id); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      period === p.id ? 'text-[#6D5DFB] font-semibold bg-[#6D5DFB]/10' : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Coders', val: entries.length, icon: Users, color: '#6D5DFB' },
          { label: 'Your Rank',    val: currentUserRank ? `#${currentUserRank}` : '—', icon: Trophy, color: '#FFD700' },
          { label: 'Your ' + currentMetric?.label, val: currentUserEntry ? `${currentUserEntry[metric]}${currentMetric?.unit || ''}` : '—', icon: currentMetric?.icon || Zap, color: currentMetric?.color || '#6D5DFB' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '22' }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-[11px]">{label}</p>
              <p className="text-white text-lg font-black">{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Opt-in Banner ──────────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border mb-6 transition-all ${
        optedIn ? 'bg-[#6D5DFB]/10 border-[#6D5DFB]/30' : 'bg-[#121523] border-[#23273B]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${optedIn ? 'bg-[#6D5DFB]/20' : 'bg-white/5'}`}>
            <Users size={16} className={optedIn ? 'text-[#6D5DFB]' : 'text-[#6B7280]'} />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{optedIn ? 'You\'re on the leaderboard!' : 'Join the leaderboard'}</p>
            <p className="text-[#9CA3AF] text-[11px]">{optedIn ? 'Other coders can see your stats.' : 'Enable to compete and show your progress.'}</p>
          </div>
        </div>
        <button
          onClick={handleToggleOptIn}
          disabled={togglingOptIn}
          className="flex-shrink-0 cursor-pointer disabled:opacity-50 transition-opacity"
        >
          {optedIn
            ? <ToggleRight size={36} className="text-[#6D5DFB]" />
            : <ToggleLeft size={36} className="text-[#6B7280]" />
          }
        </button>
      </div>

      {/* ── Metric Tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                metric === m.id
                  ? 'text-white shadow-lg'
                  : 'bg-[#121523] border border-[#23273B] text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/30'
              }`}
              style={metric === m.id ? { backgroundColor: m.color, boxShadow: `0 4px 16px ${m.color}40` } : {}}
            >
              <Icon size={14} />
              <span className="hidden sm:block">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading rankings…</p>
        </div>
      ) : entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4 bg-[#121523] border border-[#23273B] rounded-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
            <Trophy size={32} className="text-[#FFD700]" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold mb-1">No competitors yet</p>
            <p className="text-[#9CA3AF] text-sm max-w-xs text-center">
              Be the first! Toggle the opt-in switch above to join the leaderboard and start competing.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Podium — top 3 */}
          {top3.length > 0 && (
            <div className="mb-6">
              <p className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest mb-4">🏆 Top Performers</p>
              <div
                className={`grid gap-4 ${
                  top3.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
                  top3.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-sm mx-auto' :
                  'grid-cols-1 sm:grid-cols-3'
                }`}
              >
                {/* Reorder: 2nd, 1st, 3rd for visual podium effect */}
                {top3.length === 3
                  ? [top3[1], top3[0], top3[2]].map((u) => (
                      <PodiumCard key={u.id} user={u} metric={metric} isCurrentUser={u.id === user?.id} />
                    ))
                  : top3.map((u) => (
                      <PodiumCard key={u.id} user={u} metric={metric} isCurrentUser={u.id === user?.id} />
                    ))
                }
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          {rest.length > 0 && (
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-b border-[#23273B]">
                <div className="w-8 text-[#6B7280] text-[10px] font-bold uppercase text-center">Rank</div>
                <div className="flex-1 text-[#6B7280] text-[10px] font-bold uppercase">Coder</div>
                <div className="text-[#6B7280] text-[10px] font-bold uppercase text-right">{currentMetric?.label}</div>
              </div>
              <div className="p-2 space-y-1">
                {rest.map((u, i) => (
                  <RankRow key={u.id} user={u} metric={metric} isCurrentUser={u.id === user?.id} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Current user not on visible list — sticky footer card */}
          {currentUserEntry && !entries.slice(0, Math.max(entries.length, 3)).find((e) => e.id === user?.id) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 rounded-2xl p-3"
            >
              <p className="text-[#9CA3AF] text-xs text-center mb-2">Your ranking</p>
              <RankRow user={currentUserEntry} metric={metric} isCurrentUser={true} index={0} />
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
