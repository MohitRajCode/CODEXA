import { Bell, RefreshCw, CalendarRange, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import useSidebar from '../../hooks/useSidebar';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Navbar() {
  const toggle = useSidebar((s) => s.toggle);

  return (
    <header className="flex items-start justify-between px-6 py-4 border-b border-[#23273B] flex-shrink-0 bg-[#090B14]">
      {/* Left: hamburger + greeting */}
      <div className="flex items-start gap-3">
        <button
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="mt-1 text-[#9CA3AF] hover:text-white transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-white text-xl font-bold">
            {getGreeting()}, Mohit 👋
          </h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">
            Let's build something amazing today!
          </p>
        </div>
      </div>

      {/* Right: date range, refresh, notifications */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        {/* Date range */}
        <button className="hidden sm:flex items-center gap-2 bg-[#121523] border border-[#23273B] rounded-lg px-3 py-2 text-[#9CA3AF] text-sm hover:border-[#6D5DFB]/50 transition-colors cursor-pointer">
          <CalendarRange size={15} />
          <span className="text-xs font-medium">May 20 – May 26, 2024</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-0.5">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Refresh */}
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.35 }}
          aria-label="Refresh"
          className="w-9 h-9 flex items-center justify-center bg-[#121523] border border-[#23273B] rounded-lg text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/50 transition-colors cursor-pointer"
        >
          <RefreshCw size={15} />
        </motion.button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center bg-[#121523] border border-[#23273B] rounded-lg text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/50 transition-colors cursor-pointer"
        >
          <Bell size={15} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6D5DFB] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
