import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, Clock, Flame, BarChart2, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getAnalyticsOverview, getLanguageBreakdown, getCurrentStreak, getProductivityScore } from '../../services/supabase/analyticsService';
import { getWeeklyStats } from '../../services/supabase/sessionService';

const LANG_COLORS = ['#6D5DFB', '#38BDF8', '#F59E0B', '#10B981', '#6B7280'];

function formatDuration(mins) {
  if (!mins || mins <= 0) return '0h';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ── Build monthly bars from raw session data ──────────────────────────────────
function buildMonthlyData(sessions) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map = {};
  MONTHS.forEach(m => { map[m] = 0; });
  sessions.forEach(({ started_at, duration_minutes }) => {
    const month = MONTHS[new Date(started_at).getMonth()];
    map[month] = (map[month] || 0) + (duration_minutes || 0);
  });
  return MONTHS.map(month => ({ month, hours: +(map[month] / 60).toFixed(1) }));
}

// ── Build weekly line chart data ───────────────────────────────────────────────
function buildWeeklyLine(sessions) {
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const mins = sessions
      .filter(s => s.started_at?.startsWith(key))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    result.push({ day: DAYS[d.getDay()], hours: +(mins / 60).toFixed(2) });
  }
  return result;
}

function SummaryCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '22' }}>
        {loading ? <Loader2 size={18} style={{ color }} className="animate-spin" /> : <Icon size={18} style={{ color }} />}
      </div>
      <div>
        <p className="text-[#9CA3AF] text-xs">{label}</p>
        <p className="text-white text-xl font-bold">{loading ? '—' : value}</p>
        {sub && !loading && <p className="text-[#22C55E] text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
      <BarChart2 size={28} className="text-[#374151]" />
      <p className="text-[#9CA3AF] text-sm">{message}</p>
    </div>
  );
}

export default function Analytics() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [overviewRes, langRes, streakRes, scoreRes, weekRes] = await Promise.allSettled([
        getAnalyticsOverview(user.id, 365),
        getLanguageBreakdown(user.id, 30),
        getCurrentStreak(user.id),
        getProductivityScore(user.id),
        getWeeklyStats(user.id),
      ]);

      const overview = overviewRes.status === 'fulfilled' ? overviewRes.value : [];
      const langs    = langRes.status === 'fulfilled' ? langRes.value : [];
      const streak   = streakRes.status === 'fulfilled' ? streakRes.value : 0;
      const score    = scoreRes.status === 'fulfilled' ? scoreRes.value : 0;
      const weekSess = weekRes.status === 'fulfilled' ? weekRes.value : [];

      const totalMins = overview.reduce((s, r) => s + (r.duration_minutes || 0), 0);
      const weekMins  = weekSess.reduce((s, r) => s + (r.duration_minutes || 0), 0);

      const langData = langs.slice(0, 5).map((l, i) => ({
        name: l.name, value: l.percent, color: LANG_COLORS[i] || '#6B7280',
      }));

      setData({
        totalMins,
        weekMins,
        streak,
        score,
        monthlyData: buildMonthlyData(overview),
        weeklyData:  buildWeeklyLine(weekSess),
        langData,
        isEmpty: overview.length === 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-5">
      <div>
        <h1 className="text-white text-xl font-bold">Analytics</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Your coding productivity at a glance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Clock}      label="Total Hours (12mo)"  value={loading ? '—' : formatDuration(data?.totalMins)}                loading={loading} color="#6D5DFB" />
        <SummaryCard icon={Flame}      label="Current Streak"      value={loading ? '—' : `${data?.streak ?? 0} days`}                    loading={loading} color="#F97316" />
        <SummaryCard icon={TrendingUp} label="Productivity Score"  value={loading ? '—' : `${data?.score ?? 0}%`}  sub="vs 4h/day target" loading={loading} color="#3B82F6" />
        <SummaryCard icon={Clock}      label="This Week"           value={loading ? '—' : formatDuration(data?.weekMins)}                  loading={loading} color="#22C55E" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 bg-[#121523] border border-[#23273B] rounded-2xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Monthly Coding Hours (this year)</h3>
          <div style={{ height: 220 }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={24} className="text-[#6D5DFB] animate-spin" />
              </div>
            ) : data?.isEmpty ? (
              <EmptyChart message="No data yet — log sessions to see your monthly trends" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#23273B" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `${v}h`} />
                  <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`${v}h`, 'Hours']} />
                  <Bar dataKey="hours" fill="#6D5DFB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Language donut */}
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Languages (last 30 days)</h3>
          {loading ? (
            <div className="flex items-center justify-center" style={{ height: 160 }}>
              <Loader2 size={24} className="text-[#6D5DFB] animate-spin" />
            </div>
          ) : !data?.langData?.length ? (
            <div style={{ height: 160 }} className="flex flex-col items-center justify-center gap-2">
              <p className="text-[#9CA3AF] text-sm text-center">No language data</p>
              <p className="text-[#6B7280] text-xs text-center">Log sessions with a language to see breakdown</p>
            </div>
          ) : (
            <>
              <div style={{ height: 160 }} className="mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.langData} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" animationBegin={200}>
                      {data.langData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 8, color: '#fff', fontSize: 12 }}
                      formatter={(v) => [`${v}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {data.langData.map(l => (
                  <div key={l.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-[#9CA3AF] text-xs">{l.name}</span>
                    </div>
                    <span className="text-white text-xs font-semibold">{l.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weekly trend line */}
      <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
        <h3 className="text-white text-sm font-semibold mb-4">This Week — Daily Hours</h3>
        <div style={{ height: 160 }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="text-[#6D5DFB] animate-spin" />
            </div>
          ) : data?.isEmpty ? (
            <EmptyChart message="Log coding sessions to see your weekly trend here" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#23273B" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `${v}h`} />
                <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [`${v}h`, 'Hours']} />
                <Line type="monotone" dataKey="hours" stroke="#6D5DFB" strokeWidth={2.5}
                  dot={{ fill: '#6D5DFB', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
