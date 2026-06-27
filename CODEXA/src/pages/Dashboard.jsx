import { motion } from 'framer-motion';
import StatCard from '../components/cards/StatCard';
import CodingTimeChart from '../components/charts/CodingTimeChart';
import LanguagesChart from '../components/charts/LanguagesChart';
import RecentSessions from '../components/common/RecentSessions';
import WeeklyGoalCard from '../components/cards/WeeklyGoalCard';
import GitHubActivity from '../components/common/GitHubActivity';
import { statsData } from '../data/mockData';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-5 flex flex-col gap-4 min-h-full"
    >
      {/* ── Row 1: Stat Cards ───────────────────────────────── */}
      <div className="flex gap-3 flex-wrap lg:flex-nowrap">
        {statsData.map((card, i) => (
          <StatCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── Row 2: Charts ───────────────────────────────────── */}
      <div className="flex gap-4 flex-col lg:flex-row" style={{ minHeight: 260 }}>
        {/* Coding Time — wider */}
        <div className="flex-[3] min-w-0">
          <CodingTimeChart />
        </div>
        {/* Languages — narrower */}
        <div className="flex-[2] min-w-0">
          <LanguagesChart />
        </div>
      </div>

      {/* ── Row 3: Sessions + Goal + GitHub ─────────────────── */}
      <div className="flex gap-4 flex-col lg:flex-row" style={{ minHeight: 280 }}>
        {/* Recent Sessions */}
        <div className="flex-[5] min-w-0">
          <RecentSessions />
        </div>
        {/* Weekly Goal */}
        <div className="flex-[4] min-w-0">
          <WeeklyGoalCard />
        </div>
        {/* GitHub Activity */}
        <div className="flex-[5] min-w-0">
          <GitHubActivity />
        </div>
      </div>
    </motion.div>
  );
}
