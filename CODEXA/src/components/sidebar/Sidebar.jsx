import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';
import SidebarItem from './SidebarItem';
import UserProfile from './UserProfile';
import PremiumCard from './PremiumCard';

// Purple diamond logo icon
function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#23273B]">
      <div className="w-8 h-8 rounded-lg bg-[#6D5DFB] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9" />
          <path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white" />
        </svg>
      </div>
      <span className="text-white text-lg font-bold tracking-tight">Codexa</span>
    </div>
  );
}

export default function Sidebar({ isOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          bg-[#0D101D] border-r border-[#23273B]
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[188px]' : 'w-0 overflow-hidden border-0'}
        `}
        style={{ minHeight: '100vh' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -188 }}
            animate={{ x: 0 }}
            exit={{ x: -188 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-[188px] flex flex-col bg-[#0D101D] border-r border-[#23273B]"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      <Logo />

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#23273B] pt-2">
        <UserProfile />
        <PremiumCard />
      </div>
    </div>
  );
}
