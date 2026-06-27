import { motion } from 'framer-motion';
import { Plus, ExternalLink, GitBranch, Archive, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

const STATUS_COLORS = { active: '#22C55E', paused: '#FACC15', completed: '#6D5DFB', archived: '#6B7280' };

const MOCK_PROJECTS = [
  { id: 1, name: 'Codexa Dashboard', description: 'Developer productivity tracking SaaS', status: 'active', tech: ['React', 'Supabase', 'Tailwind'], hours: '45h', sessions: 18, color: '#6D5DFB' },
  { id: 2, name: 'API Gateway', description: 'Microservices API gateway with rate limiting', status: 'active', tech: ['Python', 'FastAPI', 'Redis'], hours: '32h', sessions: 12, color: '#22C55E' },
  { id: 3, name: 'Mobile Auth SDK', description: 'Cross-platform authentication SDK', status: 'paused', tech: ['TypeScript', 'React Native'], hours: '20h', sessions: 8, color: '#3B82F6' },
  { id: 4, name: 'Analytics Engine', description: 'Real-time analytics data pipeline', status: 'completed', tech: ['Go', 'ClickHouse'], hours: '68h', sessions: 24, color: '#FACC15' },
];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Projects</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Manage your coding projects</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
          <Plus size={16} /> New Project
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
            className="w-full bg-[#121523] border border-[#23273B] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors" />
        </div>
        {['all', 'active', 'paused', 'completed', 'archived'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${statusFilter === s ? 'bg-[#6D5DFB] text-white' : 'bg-[#121523] border border-[#23273B] text-[#9CA3AF] hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: p.color + '33', color: p.color }}>
                {p.name[0]}
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize"
                style={{ backgroundColor: STATUS_COLORS[p.status] + '22', color: STATUS_COLORS[p.status] }}>
                {p.status}
              </span>
            </div>

            <h3 className="text-white font-semibold mb-1">{p.name}</h3>
            <p className="text-[#9CA3AF] text-xs mb-4 flex-1 leading-relaxed">{p.description}</p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tech.map(t => (
                <span key={t} className="px-2 py-0.5 bg-[#1E2235] rounded-md text-[#9CA3AF] text-[11px]">{t}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-4 pt-3 border-t border-[#23273B]">
              <span>{p.hours} coded</span>
              <span>{p.sessions} sessions</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 py-2 bg-[#1E2235] hover:bg-[#6D5DFB]/20 text-[#9CA3AF] hover:text-white text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <GitBranch size={12} /> Details
              </button>
              <button className="text-[#9CA3AF] hover:text-[#FACC15] p-2 rounded-lg hover:bg-[#FACC15]/10 transition-colors cursor-pointer"><Archive size={14} /></button>
              <button className="text-[#9CA3AF] hover:text-[#EF4444] p-2 rounded-lg hover:bg-[#EF4444]/10 transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
