import { motion } from 'framer-motion';
import { Plus, Clock, Search, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { recentSessionsData } from '../../data/mockData';

const LANGUAGES = ['All', 'TypeScript', 'JavaScript', 'Python', 'CSS', 'Rust', 'Go'];

const difficultyColors = { easy: '#22C55E', medium: '#FACC15', hard: '#EF4444' };

export default function Sessions() {
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const sessions = recentSessionsData.filter(s =>
    (langFilter === 'All' || s.language === langFilter) &&
    s.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Coding Sessions</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Track and manage your coding time</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={16} /> New Session
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="w-full bg-[#121523] border border-[#23273B] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#6D5DFB] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map(lang => (
            <button key={lang} onClick={() => setLangFilter(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${langFilter === lang ? 'bg-[#6D5DFB] text-white' : 'bg-[#121523] border border-[#23273B] text-[#9CA3AF] hover:text-white'}`}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Sessions', value: '142', icon: Clock, color: '#6D5DFB' },
          { label: 'Total Hours', value: '312h', icon: Clock, color: '#22C55E' },
          { label: 'This Week', value: '24h 18m', icon: Clock, color: '#3B82F6' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#121523] border border-[#23273B] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">{stat.label}</p>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sessions table */}
      <div className="bg-[#121523] border border-[#23273B] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_120px_80px] gap-4 px-5 py-3 border-b border-[#23273B] text-[#9CA3AF] text-xs font-medium">
          <span>Project</span><span>Language</span><span>Duration</span><span>Date</span><span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-[#23273B]/50">
          {sessions.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[1fr_1fr_100px_120px_80px] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.bgColor, color: s.langColor }}>{s.abbr}</div>
                <span className="text-white text-sm font-medium truncate">{s.project}</span>
              </div>
              <span className="text-[#9CA3AF] text-sm">{s.language}</span>
              <span className="text-white text-sm font-semibold">{s.duration}</span>
              <span className="text-[#9CA3AF] text-xs">{s.time}</span>
              <div className="flex items-center justify-end gap-2">
                <button className="text-[#9CA3AF] hover:text-[#6D5DFB] transition-colors cursor-pointer"><Edit size={14} /></button>
                <button className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
