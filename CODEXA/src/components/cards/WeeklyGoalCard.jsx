import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

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
          stroke={percent >= 100 ? '#22C55E' : '#6D5DFB'}
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
          className={`w-full rounded-full ${filled ? 'bg-[#6D5DFB]' : 'bg-[#374151]'}`}
        />
      </div>
      <span className="text-[#9CA3AF] text-[10px]">{day.slice(0, 1)}</span>
    </div>
  );
}

/**
 * WeeklyGoalCard
 * Props:
 *   goalData – { goal, current, percent, remaining, daily[] }
 *   isEmpty  – boolean: new user with no sessions
 */
export default function WeeklyGoalCard({ goalData, isEmpty = false }) {
  // Safe defaults
  const {
    goal = 30,
    current = 0,
    percent = 0,
    remaining = 30,
    daily = [],
  } = goalData || {};

  const progressPct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  const maxDailyHours = daily.length > 0 ? Math.max(...daily.map((d) => d.hours), 1) : 1;

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

      {isEmpty ? (
        /* Empty state for new users */
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <Target size={28} className="text-[#374151]" />
          <div>
            <p className="text-[#9CA3AF] text-sm">Goal: {goal} hrs / week</p>
            <p className="text-[#6B7280] text-xs mt-1 max-w-[180px] mx-auto">
              Start coding sessions to track your weekly progress here.
            </p>
          </div>
          {/* Still show the ring at 0% so the UI isn't completely empty */}
          <CircleProgress percent={0} />
        </div>
      ) : (
        <>
          {/* Circular progress + text */}
          <div className="flex items-center gap-4 mb-6">
            <CircleProgress percent={percent} />
            <div>
              <p className="text-[#9CA3AF] text-xs mb-1">Weekly Goal</p>
              <p className="text-white text-2xl font-bold">
                {current} <span className="text-base font-medium">/ {goal} hrs</span>
              </p>
              <p className="text-[#9CA3AF] text-xs mt-1">
                {remaining > 0 ? `${remaining}h remaining` : '🎉 Goal reached!'}
              </p>
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
                className="h-full bg-[#6D5DFB] rounded-full"
              />
            </div>
          </div>

          {/* Daily bars */}
          <div className="flex items-end justify-between">
            {daily.map((d) => (
              <DayBar key={d.day} {...d} maxHours={maxDailyHours} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
