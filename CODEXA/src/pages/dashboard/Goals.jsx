import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle, Trash2, Loader2, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getGoals, createGoal, deleteGoal, updateGoalProgress } from '../../services/supabase/goalService';
import { getWeeklyStats, getTodayStats } from '../../services/supabase/sessionService';
import { getCurrentStreak } from '../../services/supabase/analyticsService';
import { useToast } from '../../contexts/NotificationContext';

const GOAL_COLORS = ['#6D5DFB', '#22C55E', '#3B82F6', '#F97316', '#FACC15', '#EF4444', '#A855F7'];
const TYPES = ['daily', 'weekly', 'monthly', 'custom'];
const METRICS = ['hours', 'sessions', 'commits', 'projects'];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── New Goal Modal ─────────────────────────────────────────────────────────────
function NewGoalModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', type: 'weekly', metric: 'hours', target_value: 30,
    color: GOAL_COLORS[0], start_date: new Date().toISOString().split('T')[0], end_date: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.title.trim() || !form.target_value) return;
    setSaving(true);
    await onSave({
      title: form.title.trim(),
      type: form.type,
      metric: form.metric,
      target_value: parseFloat(form.target_value),
      current_value: 0,
      start_date: form.start_date,
      end_date: form.end_date || null,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#121523] border border-[#23273B] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Create New Goal</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Goal Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Code 30 hours this week"
              className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB] capitalize">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Metric</label>
              <select value={form.metric} onChange={e => set('metric', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]">
                {METRICS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Target Value *</label>
            <input type="number" min="0.1" step="0.5" value={form.target_value} onChange={e => set('target_value', e.target.value)}
              className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Start Date</label>
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">End Date (optional)</label>
              <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]" />
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {GOAL_COLORS.map(c => (
                <button key={c} onClick={() => set('color', c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#1E2235] border border-[#23273B] text-[#9CA3AF] rounded-xl text-sm hover:text-white transition-colors cursor-pointer">Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.target_value}
            className="flex-1 py-2.5 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {saving ? 'Creating…' : 'Create Goal'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Goal Card ──────────────────────────────────────────────────────────────────
function GoalCard({ goal, index, onDelete, deleting, autoProgress }) {
  // Use auto-computed progress if available for certain metric types
  const rawCurrent = autoProgress ?? Number(goal.current_value ?? 0);
  const target = Number(goal.target_value);
  const pct = target > 0 ? Math.min(Math.round((rawCurrent / target) * 100), 100) : 0;
  const done = pct >= 100;
  const color = goal.color || GOAL_COLORS[index % GOAL_COLORS.length];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.07 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '22' }}>
            {done ? <CheckCircle size={18} style={{ color }} /> : <Target size={18} style={{ color }} />}
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">{goal.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize inline-block"
                style={{ backgroundColor: color + '22', color }}>
                {goal.type}
              </span>
              <span className="text-[#6B7280] text-[10px]">{goal.metric}</span>
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(goal.id)} disabled={deleting}
          className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer disabled:opacity-40">
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-bold">
            {rawCurrent % 1 === 0 ? rawCurrent : rawCurrent.toFixed(1)} / {target} {goal.metric}
          </span>
          <span className="font-bold text-sm" style={{ color }}>{pct}%</span>
        </div>
        <div className="w-full h-2 bg-[#23273B] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>

      {done && <p className="text-[#22C55E] text-xs font-medium">🎉 Goal completed!</p>}
      {goal.end_date && !done && (
        <p className="text-[#6B7280] text-xs mt-1">Ends {formatDate(goal.end_date)}</p>
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Goals() {
  const { user } = useAuthContext();
  const { success: showSuccess, error: showError } = useToast();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [autoProgress, setAutoProgress] = useState({ weeklyHours: 0, dailySessions: 0, streak: 0 });

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [goalsRes, weekRes, todayRes, streakRes] = await Promise.allSettled([
        getGoals(user.id),
        getWeeklyStats(user.id),
        getTodayStats(user.id),
        getCurrentStreak(user.id),
      ]);

      const goalsData = goalsRes.status === 'fulfilled' ? goalsRes.value : [];
      const weekSess  = weekRes.status === 'fulfilled'  ? weekRes.value  : [];
      const todaySess = todayRes.status === 'fulfilled' ? todayRes.value : [];
      const streak    = streakRes.status === 'fulfilled'? streakRes.value: 0;

      const weekMins  = weekSess.reduce((s, r) => s + (r.duration_minutes || 0), 0);
      const todayCount = todaySess.length;

      setGoals(goalsData);
      setAutoProgress({
        weeklyHours: +(weekMins / 60).toFixed(1),
        dailySessions: todayCount,
        streak,
      });
    } catch (err) {
      showError('Load Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(data) {
    try {
      const created = await createGoal(user.id, data);
      setGoals(prev => [created, ...prev]);
      showSuccess('Goal Created!', `"${created.title}" is set.`);
      setShowModal(false);
    } catch (err) {
      showError('Create Failed', err.message);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteGoal(id, user.id);
      setGoals(prev => prev.filter(g => g.id !== id));
      showSuccess('Deleted', 'Goal removed.');
    } catch (err) {
      showError('Delete Failed', err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Auto-compute progress for common metric types
  function getAutoProgress(goal) {
    if (goal.type === 'weekly' && goal.metric === 'hours') return autoProgress.weeklyHours;
    if (goal.type === 'daily' && goal.metric === 'sessions') return autoProgress.dailySessions;
    return null; // use stored current_value
  }

  const active    = goals.filter(g => !g.completed);
  const completed = goals.filter(g => g.completed);
  const successRate = goals.length > 0 ? Math.round((completed.length / goals.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Goals</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Set and track your coding goals</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
          <Plus size={16} /> New Goal
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Active Goals',  value: loading ? '—' : String(active.length) },
          { label: 'Completed',     value: loading ? '—' : String(completed.length) },
          { label: 'Success Rate',  value: loading ? '—' : `${successRate}%` },
        ].map(({ label, value }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 text-center">
            <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={28} className="text-[#6D5DFB] animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading goals…</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <Target size={40} className="text-[#374151]" />
          <p className="text-white font-semibold text-lg">No goals set yet</p>
          <p className="text-[#9CA3AF] text-sm max-w-xs">
            Create your first goal to start tracking your coding targets and stay motivated.
          </p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="mt-2 flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
            <Plus size={15} /> Set First Goal
          </motion.button>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <h2 className="text-white text-sm font-semibold mb-3">Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <AnimatePresence>
                  {active.map((g, i) => (
                    <GoalCard key={g.id} goal={g} index={i}
                      onDelete={handleDelete} deleting={deletingId === g.id}
                      autoProgress={getAutoProgress(g)} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
          {completed.length > 0 && (
            <>
              <h2 className="text-[#9CA3AF] text-sm font-semibold mb-3">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {completed.map((g, i) => (
                  <GoalCard key={g.id} goal={g} index={i}
                    onDelete={handleDelete} deleting={deletingId === g.id}
                    autoProgress={null} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <AnimatePresence>
        {showModal && <NewGoalModal onSave={handleCreate} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
