import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { githubActivityData, githubStats } from '../../data/mockData';

// Color levels for heatmap (green like GitHub)
function getColor(count) {
  if (count === 0) return '#161B22';
  if (count < 4)  return '#0E4429';
  if (count < 8)  return '#006D32';
  if (count < 12) return '#26A641';
  return '#39D353';
}

// Month labels computed from heatmap weeks
function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = null;
  weeks.forEach((week, wi) => {
    const month = new Date(week[0].date).toLocaleString('default', { month: 'short' });
    if (month !== lastMonth) {
      labels.push({ month, weekIndex: wi });
      lastMonth = month;
    }
  });
  return labels;
}

export default function GitHubActivity() {
  const { commits, trend, comparison } = githubStats;
  const weeks = githubActivityData;
  const monthLabels = getMonthLabels(weeks);
  const dayLabels = ['M', '', 'W', '', 'F', '', ''];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">GitHub Activity</h3>
        <button className="text-[#6D5DFB] text-xs font-medium hover:text-[#8B7CF8] transition-colors cursor-pointer">
          View More
        </button>
      </div>

      {/* Commits count */}
      <div className="mb-4">
        <p className="text-white text-2xl font-bold">
          {commits} <span className="text-base font-medium">commits</span>
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <TrendingUp size={13} className="text-[#22C55E]" />
          <span className="text-[#22C55E] text-xs font-semibold">{trend}</span>
          <span className="text-[#9CA3AF] text-xs">{comparison}</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex-1 overflow-hidden">
        {/* Month labels */}
        <div className="flex mb-1 pl-5">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIndex === wi);
            return (
              <div key={wi} className="flex-1 text-center">
                {label ? (
                  <span className="text-[#9CA3AF] text-[9px]">{label.month}</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Grid: day labels + cells */}
        <div className="flex gap-1">
          {/* Day labels (M W F) */}
          <div className="flex flex-col gap-[3px] mr-1 justify-around">
            {dayLabels.map((d, i) => (
              <span key={i} className="text-[#9CA3AF] text-[9px] leading-[10px] w-3 text-right">
                {d}
              </span>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px] flex-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} contributions`}
                    className="heatmap-cell rounded-[2px] cursor-pointer"
                    style={{
                      backgroundColor: getColor(day.count),
                      aspectRatio: '1',
                      minHeight: 10,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#9CA3AF] text-[9px]">Less</span>
          <div className="flex items-center gap-[3px]">
            {['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[#9CA3AF] text-[9px]">More</span>
        </div>
      </div>
    </motion.div>
  );
}
