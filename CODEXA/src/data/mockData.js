// ─── Stat Cards ────────────────────────────────────────────────────────────────
export const statsData = [
  {
    id: 'today',
    title: "Today's Coding",
    value: '3h 42m',
    trend: '+12%',
    trendUp: true,
    comparison: 'vs yesterday',
    iconBg: '#052e16',
    iconColor: '#22C55E',
    icon: 'clock',
  },
  {
    id: 'weekly',
    title: 'This Week',
    value: '24h 18m',
    trend: '+18%',
    trendUp: true,
    comparison: 'vs last week',
    iconBg: '#1e3a5f',
    iconColor: '#3B82F6',
    icon: 'calendar',
  },
  {
    id: 'streak',
    title: 'Current Streak',
    value: '18 days',
    trend: null,
    trendUp: null,
    comparison: 'Best: 32 days',
    iconBg: '#431407',
    iconColor: '#F97316',
    icon: 'flame',
  },
  {
    id: 'commits',
    title: 'GitHub Commits',
    value: '42',
    trend: '+8',
    trendUp: true,
    comparison: 'vs yesterday',
    iconBg: '#2e1065',
    iconColor: '#A855F7',
    icon: 'git',
  },
  {
    id: 'projects',
    title: 'Projects Worked On',
    value: '5',
    trend: '+2',
    trendUp: true,
    comparison: 'vs yesterday',
    iconBg: '#422006',
    iconColor: '#FACC15',
    icon: 'folder',
  },
];

// ─── Coding Time Bar Chart ─────────────────────────────────────────────────────
export const codingTimeData = [
  { day: 'Mon', hours: 3.33,  label: '3h 20m' },
  { day: 'Tue', hours: 4.25,  label: '4h 15m' },
  { day: 'Wed', hours: 5.5,   label: '5h 30m' },
  { day: 'Thu', hours: 6.17,  label: '6h 10m' },
  { day: 'Fri', hours: 3.75,  label: '3h 45m' },
  { day: 'Sat', hours: 1.5,   label: '1h 30m' },
  { day: 'Sun', hours: 0.8,   label: '0h 48m' },
];

// ─── Languages Donut Chart ─────────────────────────────────────────────────────
export const languagesData = [
  { name: 'JavaScript', value: 45, color: '#FACC15' },
  { name: 'TypeScript', value: 25, color: '#6D5DFB' },
  { name: 'Python',     value: 15, color: '#22C55E' },
  { name: 'CSS',        value: 8,  color: '#3B82F6' },
  { name: 'Other',      value: 7,  color: '#6B7280' },
];

// ─── Recent Sessions ──────────────────────────────────────────────────────────
export const recentSessionsData = [
  {
    id: 1,
    project: 'Codexa Dashboard',
    language: 'JavaScript',
    duration: '1h 25m',
    time: 'Today, 10:30 AM',
    langColor: '#FACC15',
    bgColor: '#1a1a00',
    abbr: 'JS',
  },
  {
    id: 2,
    project: 'API Integration',
    language: 'TypeScript',
    duration: '55m',
    time: 'Today, 9:15 AM',
    langColor: '#6D5DFB',
    bgColor: '#1a1535',
    abbr: 'TS',
  },
  {
    id: 3,
    project: 'Data Analysis',
    language: 'Python',
    duration: '45m',
    time: 'Yesterday, 4:30 PM',
    langColor: '#22C55E',
    bgColor: '#052e16',
    abbr: 'PY',
  },
  {
    id: 4,
    project: 'Dashboard Styling',
    language: 'CSS',
    duration: '35m',
    time: 'Yesterday, 2:10 PM',
    langColor: '#3B82F6',
    bgColor: '#1e3a5f',
    abbr: 'CSS',
  },
];

// ─── Weekly Goal ───────────────────────────────────────────────────────────────
export const weeklyGoalData = {
  goal: 30,
  current: 24,
  percent: 80,
  remaining: 6,
  daily: [
    { day: 'Mon', hours: 3.33, filled: true  },
    { day: 'Tue', hours: 4.25, filled: true  },
    { day: 'Wed', hours: 5.5,  filled: true  },
    { day: 'Thu', hours: 6.17, filled: true  },
    { day: 'Fri', hours: 3.75, filled: true  },
    { day: 'Sat', hours: 1.5,  filled: false },
    { day: 'Sun', hours: 0,    filled: false },
  ],
};

// ─── GitHub Activity Heatmap ──────────────────────────────────────────────────
function generateHeatmap() {
  const weeks = [];
  const today = new Date();

  for (let w = 15; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const r = Math.random();
      let count = 0;
      if (!isWeekend) {
        if (r < 0.05) count = 0;
        else if (r < 0.25) count = Math.ceil(Math.random() * 3);
        else if (r < 0.55) count = 3 + Math.ceil(Math.random() * 4);
        else if (r < 0.80) count = 7 + Math.ceil(Math.random() * 5);
        else count = 12 + Math.ceil(Math.random() * 8);
      } else {
        if (r < 0.45) count = 0;
        else if (r < 0.75) count = Math.ceil(Math.random() * 3);
        else count = 3 + Math.ceil(Math.random() * 4);
      }
      week.push({ date: date.toISOString().split('T')[0], count });
    }
    weeks.push(week);
  }
  return weeks;
}

export const githubActivityData = generateHeatmap();

export const githubStats = {
  commits: 42,
  trend: '+8',
  trendUp: true,
  comparison: 'vs last week',
};
