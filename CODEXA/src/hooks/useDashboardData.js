import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getTodayStats, getWeeklyStats, getSessions } from '../services/supabase/sessionService';
import { getCurrentStreak, getLanguageBreakdown } from '../services/supabase/analyticsService';
import { getGoals } from '../services/supabase/goalService';
import { getStoredRepositories } from '../services/supabase/githubService';
import { getProjects } from '../services/supabase/projectService';

// ── Helper: format minutes → "Xh Ym" ─────────────────────────────────────────
function formatDuration(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Helper: compute % trend vs previous period ───────────────────────────────
function computeTrend(current, previous) {
  if (!previous || previous === 0) return current > 0 ? { trend: '+100%', trendUp: true } : { trend: null, trendUp: null };
  const pct = Math.round(((current - previous) / previous) * 100);
  return {
    trend: pct >= 0 ? `+${pct}%` : `${pct}%`,
    trendUp: pct >= 0,
  };
}

// ── Helper: build last-7-days daily coding bars ───────────────────────────────
function buildWeeklyBars(weekSessions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const map = {};
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key] = 0;
  }

  weekSessions.forEach(({ started_at, duration_minutes }) => {
    const key = (started_at || '').split('T')[0];
    if (key in map) map[key] += duration_minutes || 0;
  });

  Object.entries(map).forEach(([dateStr, minutes]) => {
    const dayIdx = new Date(dateStr).getDay();
    result.push({
      day: days[dayIdx],
      hours: +(minutes / 60).toFixed(2),
      label: formatDuration(minutes),
    });
  });

  return result;
}

// ── Helper: build language chart data from breakdown ─────────────────────────
const LANG_COLORS = ['#6D5DFB', '#38BDF8', '#F59E0B', '#10B981', '#6B7280'];

function buildLangData(breakdown) {
  return breakdown.slice(0, 5).map((item, i) => ({
    name: item.name,
    value: item.percent,
    color: LANG_COLORS[i] || '#6B7280',
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
export function useDashboardData() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchAll(user.id);

    // Listen for live timer session saves to automatically refresh dashboard data
    const handleSessionLogged = () => {
      console.log('[Dashboard] codexa_session_logged received, refreshing...');
      fetchAll(user.id);
    };
    window.addEventListener('codexa_session_logged', handleSessionLogged);
    return () => window.removeEventListener('codexa_session_logged', handleSessionLogged);
  }, [user]);

  async function fetchAll(userId) {
    setLoading(true);
    setError(null);
    try {
      // Fetch everything in parallel
      const [todayRaw, weekRaw, streakDays, langBreakdown, goalsRaw, sessionsRaw, projectsRaw] = await Promise.allSettled([
        getTodayStats(userId),
        getWeeklyStats(userId),
        getCurrentStreak(userId),
        getLanguageBreakdown(userId, 7),
        getGoals(userId),
        getSessions(userId, { limit: 5 }),
        getProjects(userId, { limit: 200 }),
      ]);

      // ── Today stats ───────────────────────────────────────────────────────
      const todaySessions = todayRaw.status === 'fulfilled' ? todayRaw.value : [];
      const todayMinutes = todaySessions.reduce((s, r) => s + (r.duration_minutes || 0), 0);

      // ── Week stats ────────────────────────────────────────────────────────
      const weekSessions = weekRaw.status === 'fulfilled' ? weekRaw.value : [];
      const weekMinutes = weekSessions.reduce((s, r) => s + (r.duration_minutes || 0), 0);

      // ── Previous week for trend comparison (rough: half of current as baseline)
      // We don't do a second DB call; instead track raw totals
      const prevWeekEst = null; // no prev-week data without another query
      const todayTrend = computeTrend(todayMinutes, null);
      const weekTrend = computeTrend(weekMinutes, null);

      // ── Streak ────────────────────────────────────────────────────────────
      const streak = streakDays.status === 'fulfilled' ? streakDays.value : 0;

      // ── Projects (from Projects section, not just sessions) ───────────────────────────
      const allProjects = projectsRaw.status === 'fulfilled' ? projectsRaw.value.data ?? [] : [];
      const activeProjects = allProjects.filter(p => p.status === 'active').length;
      const totalProjects = allProjects.length;

      // ── Stat cards data ───────────────────────────────────────────────────
      const statsData = [
        {
          id: 'today',
          title: "Today's Coding",
          value: formatDuration(todayMinutes),
          trend: null,
          trendUp: null,
          comparison: todaySessions.length > 0 ? `${todaySessions.length} session${todaySessions.length !== 1 ? 's' : ''}` : 'No sessions yet',
          iconBg: '#052e16',
          iconColor: '#22C55E',
          icon: 'clock',
        },
        {
          id: 'weekly',
          title: 'This Week',
          value: formatDuration(weekMinutes),
          trend: null,
          trendUp: null,
          comparison: weekSessions.length > 0 ? `${weekSessions.length} sessions` : 'No sessions yet',
          iconBg: '#1e1b4b',
          iconColor: '#818CF8',
          icon: 'calendar',
        },
        {
          id: 'monthly',
          title: 'This Month',
          value: formatDuration(weekMinutes * 4), // approximate
          trend: null,
          trendUp: null,
          comparison: weekSessions.length > 0 ? `${weekSessions.length * 4} sessions` : 'No sessions yet',
          iconBg: '#1e3a5f',
          iconColor: '#3B82F6',
          icon: 'git',
        },
        {
          id: 'streak',
          title: 'Current Streak',
          value: streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '0 days',
          trend: null,
          trendUp: null,
          comparison: streak > 0 ? 'Keep it up!' : 'Start coding today!',
          iconBg: '#431407',
          iconColor: '#F97316',
          icon: 'flame',
        },
        {
          id: 'projects',
          title: 'Active Projects',
          value: String(activeProjects),
          trend: null,
          trendUp: null,
          comparison: totalProjects > 0 ? `${totalProjects} total project${totalProjects !== 1 ? 's' : ''}` : 'No projects yet',
          iconBg: '#422006',
          iconColor: '#FACC15',
          icon: 'folder',
        },
      ];

      // ── Weekly coding time chart ───────────────────────────────────────────
      const codingTimeData = buildWeeklyBars(weekSessions);

      // ── Languages chart ───────────────────────────────────────────────────
      const langData = langBreakdown.status === 'fulfilled' ? buildLangData(langBreakdown.value) : [];

      // ── Weekly goal ───────────────────────────────────────────────────────
      const goals = goalsRaw.status === 'fulfilled' ? goalsRaw.value : [];
      const weeklyGoalHrs = goals.find((g) => g.type === 'weekly_hours')?.target_value ?? 30;
      const weekHours = +(weekMinutes / 60).toFixed(1);
      const remaining = Math.max(0, +(weeklyGoalHrs - weekHours).toFixed(1));
      const percent = weeklyGoalHrs > 0 ? Math.min(100, Math.round((weekHours / weeklyGoalHrs) * 100)) : 0;
      const daily = buildWeeklyBars(weekSessions);

      const weeklyGoalData = {
        goal: weeklyGoalHrs,
        current: weekHours,
        percent,
        remaining,
        daily: daily.map((d) => ({ ...d, filled: d.hours > 0 })),
      };

      // ── Recent sessions ───────────────────────────────────────────────────
      const LANG_COLOR_MAP = {
        JavaScript: { color: '#FACC15', bg: '#1a1a00', abbr: 'JS' },
        TypeScript:  { color: '#6D5DFB', bg: '#1a1535', abbr: 'TS' },
        Python:      { color: '#22C55E', bg: '#052e16', abbr: 'PY' },
        CSS:         { color: '#3B82F6', bg: '#1e3a5f', abbr: 'CSS' },
        HTML:        { color: '#F97316', bg: '#431407', abbr: 'HTML' },
        Java:        { color: '#F59E0B', bg: '#422006', abbr: 'JV' },
        Go:          { color: '#38BDF8', bg: '#0c1e2e', abbr: 'GO' },
        Rust:        { color: '#EF4444', bg: '#2d0707', abbr: 'RS' },
        PHP:         { color: '#A855F7', bg: '#2e1065', abbr: 'PHP' },
        Ruby:        { color: '#EF4444', bg: '#2d0707', abbr: 'RB' },
        'C++':       { color: '#38BDF8', bg: '#0c1e2e', abbr: 'C++' },
        'C#':        { color: '#A855F7', bg: '#2e1065', abbr: 'C#' },
        Swift:       { color: '#F97316', bg: '#431407', abbr: 'SW' },
        Kotlin:      { color: '#6D5DFB', bg: '#1a1535', abbr: 'KT' },
      };

      const rawSessions = sessionsRaw.status === 'fulfilled' ? sessionsRaw.value.data : [];
      const recentSessions = (rawSessions || []).map((s) => {
        const lang = s.language || 'Other';
        const meta = LANG_COLOR_MAP[lang] || { color: '#6B7280', bg: '#1a1a1a', abbr: lang.slice(0, 3).toUpperCase() };
        const startedAt = new Date(s.started_at);
        const now = new Date();
        const diffMs = now - startedAt;
        const diffDays = Math.floor(diffMs / 86400000);
        const timeStr = diffDays === 0
          ? `Today, ${startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : diffDays === 1
          ? `Yesterday, ${startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : `${diffDays} days ago`;

        return {
          id: s.id,
          project: s.projects?.name || s.project_name || 'Untitled Project',
          language: lang,
          duration: formatDuration(s.duration_minutes),
          time: timeStr,
          langColor: meta.color,
          bgColor: meta.bg,
          abbr: meta.abbr,
        };
      });

      setData({
        statsData,
        codingTimeData,
        langData,
        weeklyGoalData,
        recentSessions,
        isEmpty: weekSessions.length === 0 && todaySessions.length === 0,
      });
    } catch (err) {
      console.error('useDashboardData error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, refetch: () => user && fetchAll(user.id) };
}
