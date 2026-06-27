import { motion } from 'framer-motion';
import {
  Clock, CalendarDays, Flame, GitBranch, FolderOpen, TrendingUp, TrendingDown,
} from 'lucide-react';

const iconMap = {
  clock:    Clock,
  calendar: CalendarDays,
  flame:    Flame,
  git:      GitBranch,
  folder:   FolderOpen,
};

export default function StatCard({ card, index }) {
  const Icon = iconMap[card.icon] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 flex items-start gap-3 flex-1 min-w-0"
    >
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: card.iconBg }}
      >
        <Icon size={19} style={{ color: card.iconColor }} strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[#9CA3AF] text-xs font-medium truncate">{card.title}</p>
        <p className="text-white text-xl font-bold mt-0.5 leading-tight">{card.value}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {card.trend !== null ? (
            <>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  card.trendUp ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}
              >
                {card.trendUp ? (
                  <TrendingUp size={12} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={12} strokeWidth={2.5} />
                )}
                {card.trend}
              </span>
              <span className="text-[#9CA3AF] text-xs">{card.comparison}</span>
            </>
          ) : (
            <span className="text-[#9CA3AF] text-xs">{card.comparison}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
