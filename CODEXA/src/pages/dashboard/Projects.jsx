import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Loader2, FolderOpen, Archive, Trash2, ExternalLink, GitBranch, X, CheckCircle, Clock, LayoutGrid, Rocket, Activity, Edit } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getProjects, createProject, deleteProject, archiveProject, updateProject } from '../../services/supabase/projectService';
import { useToast } from '../../contexts/NotificationContext';

const STATUS_COLORS = { active: '#22C55E', paused: '#FACC15', completed: '#6D5DFB', archived: '#6B7280' };
const STATUSES = ['all', 'active', 'paused', 'completed', 'archived'];
const PALETTE = ['#00FFD1', '#0077FF', '#B900FF', '#FACC15', '#FF4560', '#00E396', '#775DD0', '#FEB019'];

function getTimeLeft(endDate) {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  if (diffTime <= 0) return 'Time is up!';
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  
  if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
  return `${diffHours}h left`;
}

// ── Project Modal ─────────────────────────────────────────────────────────
function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || PALETTE[0],
    status: project?.status || 'active',
    repo_url: project?.repo_url || '',
    demo_url: project?.demo_url || '',
    tech_stack: project?.tech_stack ? project.tech_stack.join(', ') : '',
    end_date: project?.end_date ? project.end_date.split('T')[0] : '',
    progress: project?.progress || 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave({
      name: form.name.trim(),
      description: form.description.trim() || null,
      color: form.color,
      status: form.status,
      repo_url: form.repo_url.trim() || null,
      demo_url: form.demo_url.trim() || null,
      tech_stack: form.tech_stack ? form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
      end_date: form.end_date || null,
      progress: parseInt(form.progress, 10) || 0,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Project Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="My Awesome Project"
              className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
              placeholder="Brief description…"
              className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] resize-none" />
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Tech Stack (comma-separated)</label>
            <input value={form.tech_stack} onChange={e => set('tech_stack', e.target.value)} placeholder="React, TypeScript, Supabase"
              className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]">
                {STATUSES.filter(s => s !== 'all').map(s => <option key={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Color</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {PALETTE.map(c => (
                  <button key={c} onClick={() => set('color', c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${form.color === c ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Repo URL</label>
              <input value={form.repo_url} onChange={e => set('repo_url', e.target.value)} placeholder="https://github.com/..."
                className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Demo URL</label>
              <input value={form.demo_url} onChange={e => set('demo_url', e.target.value)} placeholder="https://..."
                className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">End Date (Optional)</label>
              <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)}
                className="w-full bg-[#080A14] border border-[#1E2235] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Progress ({form.progress}%)</label>
              <input type="range" min="0" max="100" value={form.progress} onChange={e => set('progress', e.target.value)}
                className="w-full mt-2 accent-[#6D5DFB]" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#1E2235] border border-[#23273B] text-[#9CA3AF] rounded-xl text-sm hover:text-white transition-colors cursor-pointer">Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving || !form.name.trim()}
            className="flex-1 py-2.5 bg-[#0077FF] hover:bg-[#005FE3] text-white rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[#0077FF]/30 transition-colors">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {saving ? (project ? 'Saving…' : 'Creating…') : (project ? 'Save Changes' : 'Create Project')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Projects() {
  const { user } = useAuthContext();
  const { success: showSuccess, error: showError } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [actingId, setActingId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await getProjects(user.id, { limit: 100 });
      setProjects(data ?? []);
    } catch (err) {
      showError('Load Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(data) {
    try {
      const created = await createProject(user.id, data);
      setProjects(prev => [created, ...prev]);
      showSuccess('Project Created!', `"${created.name}" is ready.`);
      setShowModal(false);
    } catch (err) {
      showError('Create Failed', err.message);
    }
  }

  async function handleUpdate(data) {
    try {
      const updated = await updateProject(editingProject.id, user.id, data);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
      showSuccess('Project Updated!', `"${updated.name}" has been updated.`);
      setShowModal(false);
      setEditingProject(null);
    } catch (err) {
      showError('Update Failed', err.message);
    }
  }

  async function handleArchive(id, currentStatus) {
    setActingId(id);
    try {
      const newStatus = currentStatus === 'archived' ? 'active' : 'archived';
      const updated = await updateProject(id, user.id, { status: newStatus });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: updated.status } : p));
      showSuccess('Updated', newStatus === 'archived' ? 'Project archived.' : 'Project restored.');
    } catch (err) {
      showError('Update Failed', err.message);
    } finally {
      setActingId(null);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActingId(id);
    try {
      await deleteProject(id, user.id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showSuccess('Deleted', 'Project removed.');
    } catch (err) {
      showError('Delete Failed', err.message);
    } finally {
      setActingId(null);
    }
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );

  const countByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? projects.length : projects.filter(p => p.status === s).length;
    return acc;
  }, {});

  const activeCount = countByStatus.active || 0;
  const completedCount = countByStatus.completed || 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Projects Workspace</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Organize and track your coding ventures</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077FF] to-[#B900FF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-[#B900FF]/25 transition-all">
          <Plus size={16} /> New Project
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 flex items-center justify-center">
            <LayoutGrid size={20} className="text-[#0077FF]" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Total Projects</p>
            <p className="text-white text-2xl font-bold">{loading ? '—' : projects.length}</p>
          </div>
        </div>
        <div className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00E396]/10 flex items-center justify-center">
            <Activity size={20} className="text-[#00E396]" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Active</p>
            <p className="text-white text-2xl font-bold">{loading ? '—' : activeCount}</p>
          </div>
        </div>
        <div className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#B900FF]/10 flex items-center justify-center">
            <Rocket size={20} className="text-[#B900FF]" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs font-medium">Completed</p>
            <p className="text-white text-2xl font-bold">{loading ? '—' : completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-[#0D0F1E] border border-[#1E2235] p-2 rounded-2xl">
        <div className="relative flex-1 w-full md:w-auto">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full bg-transparent border-none pl-10 pr-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:ring-0 transition-colors" />
        </div>
        <div className="w-full md:w-px h-px md:h-8 bg-[#1E2235]" />
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide px-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${statusFilter === s ? 'bg-[#1E2235] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-white hover:bg-[#1E2235]/50'}`}>
              {s}
              {!loading && <span className={`text-[10px] px-1.5 rounded-full ${statusFilter === s ? 'bg-white/10 text-white' : 'bg-[#1E2235] text-[#9CA3AF]'}`}>{countByStatus[s] ?? 0}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#0D0F1E] border border-[#1E2235] rounded-2xl">
          <Loader2 size={28} className="text-[#0077FF] animate-spin" />
          <p className="text-[#9CA3AF] text-sm font-medium">Loading your projects…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#0D0F1E] border border-[#1E2235] rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-[#1E2235] flex items-center justify-center border-4 border-[#080A14]">
            <FolderOpen size={32} className="text-[#4B5563]" />
          </div>
          <div>
            <p className="text-white font-bold text-lg mb-1">
              {projects.length === 0 ? 'No projects yet' : 'No projects match filters'}
            </p>
            <p className="text-[#9CA3AF] text-sm max-w-sm mx-auto">
              {projects.length === 0
                ? 'Create your first project to organize your coding sessions and track time per project.'
                : 'Try changing your search or status filter to find what you are looking for.'}
            </p>
          </div>
          {projects.length === 0 && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingProject(null); setShowModal(true); }}
              className="mt-2 flex items-center gap-2 bg-[#1E2235] hover:bg-[#23273B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer border border-[#2A2E44] transition-colors">
              <Plus size={15} /> Create First Project
            </motion.button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -4, borderColor: p.color || '#0077FF' }}
                className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-5 flex flex-col group transition-all duration-300 relative overflow-hidden">
                
                {/* Subtle top glow based on project color */}
                <div className="absolute top-0 left-0 w-full h-1 opacity-50 transition-opacity group-hover:opacity-100" style={{ backgroundColor: p.color || '#0077FF' }} />
                <div className="absolute -top-10 -right-10 w-32 h-32 blur-[50px] opacity-[0.15] group-hover:opacity-[0.25] transition-opacity pointer-events-none" style={{ backgroundColor: p.color || '#0077FF' }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: (p.color || '#0077FF'), boxShadow: `0 4px 14px 0 ${(p.color || '#0077FF')}40` }}>
                    {p.name[0].toUpperCase()}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: (STATUS_COLORS[p.status] || '#6B7280') + '20', color: STATUS_COLORS[p.status] || '#6B7280' }}>
                    {p.status}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg mb-1.5 relative z-10">{p.name}</h3>
                <p className="text-[#9CA3AF] text-xs mb-5 flex-1 leading-relaxed relative z-10 line-clamp-2">{p.description || 'No description provided.'}</p>

                {/* Progress and Time Left */}
                <div className="mb-4 relative z-10">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#9CA3AF] font-medium">Completion</span>
                    <span className="text-white font-bold">{p.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1E2235] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progress || 0}%`, backgroundColor: p.color || '#0077FF' }} />
                  </div>
                  {p.end_date && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#9CA3AF]">
                      <Clock size={12} className={new Date(p.end_date) < new Date() ? 'text-[#FF4560]' : 'text-[#00E396]'} />
                      <span className={new Date(p.end_date) < new Date() ? 'text-[#FF4560] font-medium' : ''}>
                        {getTimeLeft(p.end_date)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tech stack */}
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
                    {p.tech_stack.slice(0, 4).map(t => (
                      <span key={t} className="px-2 py-1 bg-[#1E2235] rounded-lg text-[#D1D5DB] text-[10px] font-medium border border-[#23273B]">{t}</span>
                    ))}
                    {p.tech_stack.length > 4 && (
                      <span className="px-2 py-1 bg-[#1E2235] rounded-lg text-[#D1D5DB] text-[10px] font-medium border border-[#23273B]">+{p.tech_stack.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Links */}
                {(p.repo_url || p.demo_url) && (
                  <div className="flex gap-3 mb-5 relative z-10">
                    {p.repo_url && (
                      <a href={p.repo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white text-xs font-medium transition-colors bg-[#1E2235] hover:bg-[#2A2E44] px-3 py-1.5 rounded-lg border border-[#23273B]">
                        <GitBranch size={12} /> Repo
                      </a>
                    )}
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white text-xs font-medium transition-colors bg-[#1E2235] hover:bg-[#2A2E44] px-3 py-1.5 rounded-lg border border-[#23273B]">
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#1E2235] mt-auto relative z-10">
                  <button onClick={() => { setEditingProject(p); setShowModal(true); }} disabled={actingId === p.id}
                    className="flex-1 py-2 bg-transparent hover:bg-[#1E2235] text-[#9CA3AF] hover:text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleArchive(p.id, p.status)} disabled={actingId === p.id}
                    className="flex-1 py-2 bg-transparent hover:bg-[#1E2235] text-[#9CA3AF] hover:text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40">
                    <Archive size={14} /> {p.status === 'archived' ? 'Restore' : 'Archive'}
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)} disabled={actingId === p.id}
                    className="text-[#9CA3AF] hover:text-[#FF4560] p-2 rounded-lg hover:bg-[#FF4560]/10 transition-colors cursor-pointer disabled:opacity-40">
                    {actingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && <ProjectModal project={editingProject} onSave={editingProject ? handleUpdate : handleCreate} onClose={() => { setShowModal(false); setEditingProject(null); }} />}
      </AnimatePresence>
    </motion.div>
  );
}
