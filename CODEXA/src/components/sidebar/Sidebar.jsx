import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';
import SidebarItem from './SidebarItem';
import UserProfile from './UserProfile';

import Logo from '../common/Logo';



export default function Sidebar({ isOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          bg-[#080A14] border-r border-[#1E2235]
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[200px]' : 'w-0 overflow-hidden border-0'}
        `}
        style={{ minHeight: '100vh' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-[200px] flex flex-col bg-[#080A14] border-r border-[#1E2235]"
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
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1E2235]">
        <Logo size={28} showText={true} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#1E2235] pt-2 pb-2">
        <UserProfile />
      </div>
    </div>
  );
}
