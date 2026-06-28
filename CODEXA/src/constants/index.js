import {
  LayoutDashboard,
  Clock3,
  FolderKanban,
  BarChart3,
  Target,
  Trophy,
  CalendarDays,
  GitBranch,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard'            },
  { id: 'sessions',  label: 'Sessions',  icon: Clock3,          path: '/dashboard/sessions'   },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban,    path: '/dashboard/projects'   },
  { id: 'analytics', label: 'Analytics', icon: BarChart3,        path: '/dashboard/analytics'  },
  { id: 'goals',       label: 'Goals',       icon: Target,       path: '/dashboard/goals'        },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy,       path: '/dashboard/leaderboard'  },
  { id: 'calendar',   label: 'Calendar',    icon: CalendarDays, path: '/dashboard/calendar'     },
  { id: 'github',     label: 'GitHub',      icon: GitBranch,    path: '/dashboard/github'       },
  { id: 'settings',   label: 'Settings',    icon: Settings,     path: '/dashboard/settings'     },
];


export const LANG_COLORS = {
  JavaScript: '#FACC15',
  TypeScript: '#6D5DFB',
  Python:     '#22C55E',
  CSS:        '#3B82F6',
  Other:      '#6B7280',
};
