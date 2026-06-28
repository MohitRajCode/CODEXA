import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Search, Trash2, Filter, Loader2, X, CheckCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getSessions, deleteSession, createSession, getTodayStats, getWeeklyStats } from '../../services/supabase/sessionService';
import { getProjects } from '../../services/supabase/projectService';
import { useToast } from '../../contexts/NotificationContext';
import NewSessionModal from '../../components/sessions/NewSessionModal';

const LANG_COLOR_MAP = {
  JavaScript: { color: '#FACC15', bg: '#1a1a00', abbr: 'JS' },
  TypeScript:  { color: '#6D5DFB', bg: '#1a1535', abbr: 'TS' },
  Python:      { color: '#22C55E', bg: '#052e16', abbr: 'PY' },
  CSS:         { color: '#3B82F6', bg: '#1e3a5f', abbr: 'CSS' },
  HTML:        { color: '#F97316', bg: '#431407', abbr: 'HTML' },
  Java:        { color: '#F59E0B', bg: '#422006', abbr: 'JV' },
  Go:          { color: '#38BDF8', bg: '#0c1e2e', abbr: 'GO' },
  Rust:        { color: '#EF4444', bg: '#2d0707', abbr: 'RS' },
  PHP:         { color: '#A855F7', bg: '#2e1065', abbr: 'PHP' },
  Ruby:        { color: '#EF4444', bg: '#2d0707', abbr: 'RB' },
  'C++':       { color: '#38BDF8', bg: '#0c1e2e', abbr: 'C++' },
  'C#':        { color: '#A855F7', bg: '#2e1065', abbr: 'C#' },
  Swift:       { color: '#F97316', bg: '#431407', abbr: 'SW' },
  Kotlin:      { color: '#6D5DFB', bg: '#1a1535', abbr: 'KT' },
  Dart:        { color: '#38BDF8', bg: '#0c1e2e', abbr: 'DT' },
  Shell:       { color: '#22C55E', bg: '#052e16', abbr: 'SH' },
};

const LANGUAGES = ['All', 'JavaScript', 'TypeScript', 'Python', 'CSS', 'HTML', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C++', 'C#', 'Swift', 'Kotlin'];
const DIFFICULTIES = ['All', 'easy', 'medium', 'hard'];
const DIFF_COLORS = { easy: '#22C55E', medium: '#FACC15', hard: '#EF4444' };

function formatDuration(mins) {
  if (!mins || mins <= 0) return '0m';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso), now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}



// ── Main Component ─────────────────────────────────────────────────────────────
export default function Sessions() {
  const { user } = useAuthContext();
  const { success: showSuccess, error: showError } = useToast();

  const [sessions, setSessions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalMins: 0, weekMins: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [sessRes, projRes, todayRes, weekRes] = await Promise.allSettled([
        getSessions(user.id, { limit: 100 }),
        getProjects(user.id, { limit: 50 }),
        getTodayStats(user.id),
        getWeeklyStats(user.id),
      ]);
      const rawSessions = sessRes.status === 'fulfilled' ? sessRes.value.data ?? [] : [];
      const totalCount  = sessRes.status === 'fulfilled' ? sessRes.value.count ?? 0 : 0;
      const weekData    = weekRes.status === 'fulfilled' ? weekRes.value : [];
      setSessions(rawSessions);
      setProjects(projRes.status === 'fulfilled' ? projRes.value.data ?? [] : []);
      setStats({
        total: totalCount,
        totalMins: rawSessions.reduce((s, r) => s + (r.duration_minutes || 0), 0),
        weekMins: weekData.reduce((s, r) => s + (r.duration_minutes || 0), 0),
      });
    } catch (err) {
      showError('Load Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    load(); 
    
    // Listen for live timer session saves
    window.addEventListener('codexa_session_logged', load);
    return () => window.removeEventListener('codexa_session_logged', load);
  }, [load]);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteSession(id, user.id);
      setSessions(prev => prev.filter(s => s.id !== id));
      showSuccess('Deleted', 'Session removed successfully.');
    } catch (err) {
      showError('Delete Failed', err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreate(data) {
    try {
      await createSession(user.id, data);
      showSuccess('Session Logged!', 'Your coding session has been saved.');
      setShowModal(false);
      load();
    } catch (err) {
      showError('Save Failed', err.message);
    }
  }

  // Client-side filter
  const filtered = sessions.filter(s => {
    const matchLang = langFilter === 'All' || s.language === langFilter;
    const matchDiff = diffFilter === 'All' || s.difficulty === diffFilter;
    const matchSearch = !search ||
      (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.language || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.projects?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchLang && matchDiff && matchSearch;
  });

  // Unique languages from real data
  const availableLangs = ['All', ...new Set(sessions.map(s => s.language).filter(Boolean))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Coding Sessions</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Track and manage your coding time</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <Plus size={16} /> New Session
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Sessions', value: loading ? '—' : String(stats.total), color: '#6D5DFB' },
          { label: 'Total Hours', value: loading ? '—' : formatDuration(stats.totalMins), color: '#22C55E' },
          { label: 'This Week', value: loading ? '—' : formatDuration(stats.weekMins), color: '#3B82F6' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#121523] border border-[#23273B] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">{stat.label}</p>
            <p className="text-white text-2xl font-bold" style={{ color: loading ? '#4B5563' : 'white' }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search sessions…"
            className="w-full bg-[#121523] border border-[#23273B] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {availableLangs.map(lang => (
            <button key={lang} onClick={() => setLangFilter(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${langFilter === lang ? 'bg-[#6D5DFB] text-white' : 'bg-[#121523] border border-[#23273B] text-[#9CA3AF] hover:text-white'}`}>
              {lang}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${diffFilter === d ? 'bg-[#6D5DFB] text-white' : 'bg-[#121523] border border-[#23273B] text-[#9CA3AF] hover:text-white'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-16 flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-[#6D5DFB] animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading sessions…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-16 flex flex-col items-center gap-3 text-center">
          <Clock size={36} className="text-[#374151]" />
          <p className="text-white font-semibold">
            {sessions.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
          </p>
          <p className="text-[#9CA3AF] text-sm max-w-xs">
            {sessions.length === 0
              ? 'Click "New Session" to log your first coding session and start tracking your progress.'
              : 'Try adjusting your search or filters.'}
          </p>
          {sessions.length === 0 && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
              <Plus size={15} /> Log First Session
            </motion.button>
          )}
        </div>
      ) : (
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_100px_140px_100px_80px] gap-4 px-5 py-3 border-b border-[#23273B] text-[#9CA3AF] text-xs font-medium">
            <span>Project / Title</span><span>Language</span><span>Duration</span><span>Date</span><span>Difficulty</span><span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#23273B]/50">
            <AnimatePresence>
              {filtered.map((s, i) => {
                const lang = s.language || 'Other';
                const meta = LANG_COLOR_MAP[lang] || { color: '#6B7280', bg: '#1a1a1a', abbr: lang.slice(0, 3).toUpperCase() };
                return (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[1fr_1fr_100px_140px_100px_80px] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.abbr}</div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{s.projects?.name || s.title || 'Coding Session'}</p>
                        {s.title && s.projects?.name && <p className="text-[#6B7280] text-xs truncate">{s.title}</p>}
                      </div>
                    </div>
                    <span className="text-[#9CA3AF] text-sm">{lang}</span>
                    <span className="text-white text-sm font-semibold">{formatDuration(s.duration_minutes)}</span>
                    <span className="text-[#9CA3AF] text-xs">{formatDate(s.started_at)}</span>
                    <span>
                      {s.difficulty ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                          style={{ backgroundColor: DIFF_COLORS[s.difficulty] + '22', color: DIFF_COLORS[s.difficulty] }}>
                          {s.difficulty}
                        </span>
                      ) : <span className="text-[#4B5563] text-xs">—</span>}
                    </span>
                    <div className="flex items-center justify-end">
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}
                        className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer disabled:opacity-40 p-1">
                        {deletingId === s.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="px-5 py-3 border-t border-[#23273B] text-[#9CA3AF] text-xs">
            Showing {filtered.length} of {sessions.length} sessions
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && <NewSessionModal projects={projects} onSave={handleCreate} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
