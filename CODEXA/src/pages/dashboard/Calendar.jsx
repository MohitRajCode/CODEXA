import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays, Clock } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getAnalyticsOverview } from '../../services/supabase/analyticsService';

function formatDuration(mins) {
  if (!mins || mins <= 0) return null;
  const h = Math.floor(mins / 60), m = mins % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getIntensity(mins) {
  if (!mins || mins <= 0) return 0;
  if (mins < 30)  return 1;
  if (mins < 90)  return 2;
  if (mins < 180) return 3;
  return 4;
}

const INTENSITY_STYLES = [
  'bg-[#1E2235]',
  'bg-[#312e81]',
  'bg-[#4338ca]',
  'bg-[#5b21b6]',
  'bg-[#6D5DFB]',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MonthCalendar({ year, month, sessionMap, onDayClick, selectedDay }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-[#6B7280] text-xs py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const mins = sessionMap[dateStr] || 0;
          const intensity = getIntensity(mins);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDay;

          return (
            <button key={dateStr} onClick={() => onDayClick(dateStr, mins)}
              title={mins > 0 ? `${formatDuration(mins)} coded` : 'No sessions'}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center
                text-xs font-medium transition-all cursor-pointer
                ${INTENSITY_STYLES[intensity]}
                ${isSelected ? 'ring-2 ring-[#6D5DFB] ring-offset-1 ring-offset-[#0D1117]' : ''}
                ${isToday ? 'ring-2 ring-white/30' : ''}
                hover:scale-105 hover:brightness-125
              `}>
              <span className={intensity > 0 ? 'text-white' : 'text-[#4B5563]'}>{day}</span>
              {intensity > 0 && (
                <span className="text-[8px] text-white/70 leading-none">{formatDuration(mins)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [sessionMap, setSessionMap] = useState({});
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMins, setSelectedMins] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const sessions = await getAnalyticsOverview(user.id, 365);
      const map = {};
      sessions.forEach(({ started_at, duration_minutes }) => {
        const day = (started_at || '').split('T')[0];
        if (day) map[day] = (map[day] || 0) + (duration_minutes || 0);
      });
      setSessionMap(map);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth();

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEntries = Object.entries(sessionMap).filter(([d]) => d.startsWith(monthKey));
  const monthMins = monthEntries.reduce((s, [, m]) => s + m, 0);
  const activeDays = monthEntries.filter(([, m]) => m > 0).length;
  const bestDay = monthEntries.reduce((best, [d, m]) => m > best.mins ? { day: d, mins: m } : best, { day: null, mins: 0 });
  const totalActiveDays = Object.keys(sessionMap).length;
  const totalMins = Object.values(sessionMap).reduce((s, m) => s + m, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold">Calendar</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Your coding activity by day</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 size={28} className="text-[#6D5DFB] animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading your activity…</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Calendar Panel */}
          <div className="flex-[3] bg-[#121523] border border-[#23273B] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => { setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); setSelectedDay(null); }}
                className="w-8 h-8 rounded-lg bg-[#1E2235] hover:bg-[#6D5DFB]/20 text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-white font-semibold">{MONTHS[month]} {year}</h2>
              <button onClick={() => { setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); setSelectedDay(null); }}
                disabled={isCurrentMonth}
                className="w-8 h-8 rounded-lg bg-[#1E2235] hover:bg-[#6D5DFB]/20 text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default">
                <ChevronRight size={16} />
              </button>
            </div>

            <MonthCalendar
              year={year} month={month}
              sessionMap={sessionMap}
              onDayClick={(d, m) => { setSelectedDay(prev => prev === d ? null : d); setSelectedMins(m); }}
              selectedDay={selectedDay}
            />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#23273B]">
              <span className="text-[#6B7280] text-xs">Less</span>
              <div className="flex items-center gap-1">
                {INTENSITY_STYLES.map((cls, i) => (
                  <div key={i} className={`w-5 h-5 rounded-md ${cls}`} />
                ))}
              </div>
              <span className="text-[#6B7280] text-xs">More</span>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="flex-[2] flex flex-col gap-4">
            {/* Month summary */}
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
              <h3 className="text-white text-sm font-semibold mb-4">{MONTHS[month]} Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Coded',      value: monthMins > 0 ? formatDuration(monthMins) : '—' },
                  { label: 'Active Days',       value: activeDays > 0 ? `${activeDays} days` : '—' },
                  { label: 'Best Day',          value: bestDay.mins > 0 ? `${formatDuration(bestDay.mins)} on ${new Date(bestDay.day + 'T12:00:00').toLocaleDateString([], { month: 'short', day: 'numeric' })}` : '—' },
                  { label: 'Avg / Active Day',  value: activeDays > 0 ? formatDuration(Math.round(monthMins / activeDays)) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] text-xs">{label}</span>
                    <span className="text-white text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All-time */}
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
              <h3 className="text-white text-sm font-semibold mb-4">All Time (12 months)</h3>
              <div className="space-y-3">
                {[
                  { label: 'Days Active',  value: totalActiveDays > 0 ? `${totalActiveDays} days` : '—' },
                  { label: 'Total Hours',  value: totalMins > 0 ? formatDuration(totalMins) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] text-xs">{label}</span>
                    <span className="text-white text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected day detail */}
            {selectedDay && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#6D5DFB]/20 to-[#38BDF8]/10 border border-[#6D5DFB]/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={16} className="text-[#6D5DFB]" />
                  <h3 className="text-white text-sm font-semibold">
                    {new Date(selectedDay + 'T12:00:00').toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={14} className="text-[#9CA3AF]" />
                  <span className="text-white font-bold">
                    {selectedMins > 0 ? formatDuration(selectedMins) : 'No coding sessions'}
                  </span>
                  {selectedMins > 0 && <span className="text-[#9CA3AF] text-xs">coded</span>}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {totalActiveDays === 0 && (
              <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 text-center">
                <CalendarDays size={28} className="text-[#374151] mx-auto mb-2" />
                <p className="text-[#9CA3AF] text-sm">No activity yet</p>
                <p className="text-[#6B7280] text-xs mt-1">Log your first session to see it here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
