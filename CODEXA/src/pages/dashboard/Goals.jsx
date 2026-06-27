import { motion } from 'framer-motion';
import { Plus, Target, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

const MOCK_GOALS = [
  { id: 1, title: 'Code 30 hours this week', type: 'weekly', metric: 'hours', target: 30, current: 24, color: '#6D5DFB' },
  { id: 2, title: 'Complete 5 sessions today', type: 'daily', metric: 'sessions', target: 5, current: 3, color: '#22C55E' },
  { id: 3, title: 'Push 50 commits this month', type: 'monthly', metric: 'commits', target: 50, current: 42, color: '#3B82F6' },
  { id: 4, title: 'Maintain 21-day streak', type: 'custom', metric: 'sessions', target: 21, current: 14, color: '#F97316' },
];

function GoalCard({ goal, index }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const done = pct >= 100;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: goal.color + '22' }}>
            {done ? <CheckCircle size={18} style={{ color: goal.color }} /> : <Target size={18} style={{ color: goal.color }} />}
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">{goal.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize mt-1 inline-block"
              style={{ backgroundColor: goal.color + '22', color: goal.color }}>{goal.type}</span>
          </div>
        </div>
        <button className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"><Trash2 size={14} /></button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-bold">{goal.current} / {goal.target} {goal.metric}</span>
          <span className="font-bold text-sm" style={{ color: goal.color }}>{pct}%</span>
        </div>
        <div className="w-full h-2 bg-[#23273B] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full" style={{ backgroundColor: goal.color }} />
        </div>
      </div>
      {done && <p className="text-[#22C55E] text-xs font-medium">🎉 Goal completed!</p>}
    </motion.div>
  );
}

export default function Goals() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Goals</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Set and track your coding goals</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
          <Plus size={16} /> New Goal
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Active Goals', '4'], ['Completed', '12'], ['Success Rate', '78%']].map(([label, val]) => (
          <div key={label} className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 text-center">
            <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
            <p className="text-white text-2xl font-bold">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_GOALS.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}
      </div>
    </motion.div>
  );
}
