import { motion } from 'framer-motion';
import { recentSessionsData } from '../../data/mockData';

function SessionRow({ session, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.07 }}
      className="flex items-center justify-between py-2.5 hover:bg-white/[0.02] rounded-lg px-1 -mx-1 transition-colors group"
    >
      {/* Language badge */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ backgroundColor: session.bgColor, color: session.langColor }}
        >
          {session.abbr}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{session.project}</p>
          <p className="text-[#9CA3AF] text-xs">{session.language}</p>
        </div>
      </div>

      {/* Duration + time */}
      <div className="text-right flex-shrink-0 ml-2">
        <p className="text-white text-sm font-semibold">{session.duration}</p>
        <p className="text-[#9CA3AF] text-xs">{session.time}</p>
      </div>
    </motion.div>
  );
}

export default function RecentSessions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">Recent Sessions</h3>
        <button className="text-[#6D5DFB] text-xs font-medium hover:text-[#8B7CF8] transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Session list */}
      <div className="flex flex-col divide-y divide-[#23273B]/50">
        {recentSessionsData.map((session, i) => (
          <SessionRow key={session.id} session={session} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
