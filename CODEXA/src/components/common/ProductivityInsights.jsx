import { motion } from 'framer-motion';
import { TrendingUp, Clock, LayoutGrid, Flame, Target } from 'lucide-react';

export default function ProductivityInsights({ data }) {
  const { statsData = [], weeklyGoalData } = data || {};

  const todayStat   = statsData.find(s => s.id === 'today');
  const weeklyStat  = statsData.find(s => s.id === 'weekly');
  const streakStat  = statsData.find(s => s.id === 'streak');
  const goalPct     = weeklyGoalData?.percent ?? 0;

  const insights = [
    {
      label: 'Avg. Session',
      value: todayStat?.value || '0m',
      icon: Clock,
      color: '#6D5DFB',
    },
    {
      label: 'Total Sessions',
      value: weeklyStat?.comparison?.split(' ')[0] || '0',
      icon: LayoutGrid,
      color: '#38BDF8',
    },
    {
      label: 'Goal Progress',
      value: `${goalPct}%`,
      icon: Target,
      color: '#22C55E',
    },
    {
      label: 'Best Streak',
      value: streakStat?.value || '0 days',
      icon: Flame,
      color: '#F97316',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl bg-[#6D5DFB]/15 border border-[#6D5DFB]/20 flex items-center justify-center">
          <TrendingUp size={14} className="text-[#6D5DFB]" />
        </div>
        <div>
          <h3 className="text-white text-sm font-semibold">Productivity Insights</h3>
          <p className="text-[#6B7280] text-[11px]">Track your progress and build better coding habits.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <motion.div
              key={ins.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="bg-[#080A14] border border-[#1E2235] rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: ins.color }} />
                <span className="text-[#6B7280] text-[10px] font-medium">{ins.label}</span>
              </div>
              <p className="text-white text-lg font-black" style={{ color: ins.color }}>
                {ins.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
