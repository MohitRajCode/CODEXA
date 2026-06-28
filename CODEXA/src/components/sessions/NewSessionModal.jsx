import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'CSS', 'HTML', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C++', 'C#', 'Swift', 'Kotlin'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function NewSessionModal({ projects = [], onSave, onClose, initialDuration = 60 }) {
  // Calculate correct local time for datetime-local input
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISO = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);

  const [form, setForm] = useState({
    title: '', language: 'JavaScript', duration_minutes: initialDuration,
    project_id: '', difficulty: 'medium', notes: '', started_at: localISO,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.language || !form.duration_minutes) return;
    setSaving(true);
    await onSave({
      ...form,
      duration_minutes: parseInt(form.duration_minutes) || 1,
      started_at: new Date(form.started_at).toISOString(),
      project_id: form.project_id || null,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#121523] border border-[#23273B] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Log Session</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Session Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Worked on auth flow"
              className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Language *</label>
              <select value={form.language} onChange={e => set('language', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Duration (minutes) *</label>
              <input type="number" min="1" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Project</label>
              <select value={form.project_id} onChange={e => set('project_id', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]">
                <option value="">— No project —</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs mb-1.5 block">Difficulty</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Started At</label>
            <input type="datetime-local" value={form.started_at} onChange={e => set('started_at', e.target.value)}
              className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6D5DFB]" />
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs mb-1.5 block">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              placeholder="Optional notes about this session…"
              className="w-full bg-[#1E2235] border border-[#23273B] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] resize-none" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#1E2235] border border-[#23273B] text-[#9CA3AF] rounded-xl text-sm hover:text-white transition-colors cursor-pointer">
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {saving ? 'Saving…' : 'Save Session'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
