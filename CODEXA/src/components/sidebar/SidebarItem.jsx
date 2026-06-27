import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SidebarItem({ item }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = item.path === '/dashboard'
    ? location.pathname === '/dashboard'
    : location.pathname.startsWith(item.path);
  const Icon = item.icon;

  return (
    <motion.button
      onClick={() => navigate(item.path)}
      whileHover={{ x: isActive ? 0 : 3 }}
      whileTap={{ scale: 0.97 }}
      aria-label={item.label}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
        text-sm font-medium transition-colors duration-150 cursor-pointer
        ${isActive
          ? 'bg-[#6D5DFB] text-white shadow-lg shadow-[#6D5DFB]/20'
          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'}
      `}
    >
      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      <span>{item.label}</span>
    </motion.button>
  );
}
