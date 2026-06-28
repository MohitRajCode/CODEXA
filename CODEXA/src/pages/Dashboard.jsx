import { motion } from 'framer-motion';
import StatCard from '../components/cards/StatCard';
import CodingTimeChart from '../components/charts/CodingTimeChart';
import LanguagesChart from '../components/charts/LanguagesChart';
import RecentSessions from '../components/common/RecentSessions';
import WeeklyGoalCard from '../components/cards/WeeklyGoalCard';
import GitHubActivity from '../components/common/GitHubActivity';
import QuickActions from '../components/common/QuickActions';
import ProductivityInsights from '../components/common/ProductivityInsights';
import LeetCodeStats from '../components/common/LeetCodeStats';
import { useDashboardData } from '../hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { loading, error, data } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full p-10">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#6D5DFB] animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full p-10">
        <div className="bg-[#121523] border border-red-500/30 rounded-2xl p-6 text-center max-w-md">
          <p className="text-red-400 font-semibold mb-2">Failed to load dashboard</p>
          <p className="text-[#9CA3AF] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { statsData, codingTimeData, langData, weeklyGoalData, recentSessions, isEmpty } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 flex flex-col gap-4 min-h-full"
    >
      {/* ── Empty-state welcome banner ─────────────────────────────────────── */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#6D5DFB]/20 to-[#38BDF8]/10 border border-[#6D5DFB]/30 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#6D5DFB]/20 flex items-center justify-center flex-shrink-0 text-xl">👋</div>
          <div>
            <p className="text-white font-semibold text-sm">Welcome to Codexa!</p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Your dashboard will fill up with real data as you log coding sessions. Start by logging your first session!</p>
          </div>
        </motion.div>
      )}

      {/* ── Row 1: Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {statsData.map((card, i) => (
          <StatCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── Row 2: Charts ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 280 }}>
        <div className="lg:col-span-1">
          <CodingTimeChart data={codingTimeData} isEmpty={isEmpty} />
        </div>
        <div className="lg:col-span-1">
          <LanguagesChart data={langData} />
        </div>
        <div className="lg:col-span-1">
          <WeeklyGoalCard goalData={weeklyGoalData} isEmpty={isEmpty} />
        </div>
      </div>

      {/* ── Row 3: Sessions + GitHub + LeetCode ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 280 }}>
        <div className="lg:col-span-1">
          <RecentSessions sessions={recentSessions} isEmpty={isEmpty} />
        </div>
        <div className="lg:col-span-1">
          <GitHubActivity />
        </div>
        <div className="lg:col-span-1">
          <LeetCodeStats />
        </div>
      </div>

      {/* ── Row 4: Productivity Insights + Quick Actions ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProductivityInsights data={data} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </motion.div>
  );
}
