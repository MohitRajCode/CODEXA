import { motion } from 'framer-motion';
import { BarChart2, PlusSquare, LineChart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { id: 'log',       label: 'Log Session',    icon: BarChart2,   color: '#22C55E', bg: '#052e16', path: '/dashboard/sessions' },
  { id: 'project',   label: 'Add Project',    icon: PlusSquare,  color: '#38BDF8', bg: '#0c1e2e', path: '/dashboard/projects' },
  { id: 'analytics', label: 'View Analytics', icon: LineChart,   color: '#8B5CF6', bg: '#2e1065', path: '/dashboard/analytics' },
  { id: 'settings',  label: 'Settings',       icon: Settings,    color: '#F59E0B', bg: '#422006', path: '/dashboard/settings'  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-[#0D0F1E] border border-[#1E2235] rounded-2xl p-5 h-full"
    >
      <h3 className="text-white text-sm font-semibold mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-2.5">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 + 0.3 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#1E2235] hover:border-opacity-60 transition-all cursor-pointer text-left group"
              style={{ backgroundColor: action.bg + '66', borderColor: action.color + '33' }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: action.bg }}
              >
                <Icon size={14} style={{ color: action.color }} />
              </div>
              <span className="text-white text-xs font-medium truncate">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
