import { motion } from 'framer-motion';
import { weeklyGoalData } from '../../data/mockData';

// SVG circular progress ring
function CircleProgress({ percent }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="-rotate-90 w-36 h-36" viewBox="0 0 144 144">
        {/* Track */}
        <circle
          cx="72" cy="72" r={r}
          fill="none"
          stroke="#23273B"
          strokeWidth="10"
        />
        {/* Progress */}
        <motion.circle
          cx="72" cy="72" r={r}
          fill="none"
          stroke="#22C55E"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white text-2xl font-bold">{percent}%</span>
      </div>
    </div>
  );
}

// Mini bar for each day
function DayBar({ day, hours, filled, maxHours = 7 }) {
  const pct = Math.min((hours / maxHours) * 100, 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-5 h-14 bg-[#1E2235] rounded-full overflow-hidden flex flex-col-reverse">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          className={`w-full rounded-full ${filled ? 'bg-[#22C55E]' : 'bg-[#374151]'}`}
        />
      </div>
      <span className="text-[#9CA3AF] text-[10px]">{day.slice(0, 1)}</span>
    </div>
  );
}

export default function WeeklyGoalCard() {
  const { goal, current, percent, remaining, daily } = weeklyGoalData;
  const progressPct = (current / goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white text-sm font-semibold">Weekly Goal</h3>
        <button className="text-[#9CA3AF] text-xs hover:text-white transition-colors cursor-pointer">
          Edit Goal
        </button>
      </div>

      {/* Circular progress + text */}
      <div className="flex items-center gap-4 mb-6">
        <CircleProgress percent={percent} />
        <div>
          <p className="text-[#9CA3AF] text-xs mb-1">Weekly Goal</p>
          <p className="text-white text-2xl font-bold">
            {current} <span className="text-base font-medium">/ {goal} hrs</span>
          </p>
          <p className="text-[#9CA3AF] text-xs mt-1">{remaining}h remaining</p>
        </div>
      </div>

      {/* Goal progress bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex-1 h-0.5 border-t border-dashed border-[#23273B]" />
          <span className="text-[#9CA3AF] text-[10px] flex-shrink-0">Goal: {goal} hrs</span>
        </div>
        <div className="w-full h-1.5 bg-[#23273B] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            className="h-full bg-[#22C55E] rounded-full"
          />
        </div>
      </div>

      {/* Daily bars */}
      <div className="flex items-end justify-between">
        {daily.map((d) => (
          <DayBar key={d.day} {...d} />
        ))}
      </div>
    </motion.div>
  );
}
