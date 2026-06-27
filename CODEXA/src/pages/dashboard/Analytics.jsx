import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { codingTimeData, languagesData } from '../../data/mockData';
import { TrendingUp, Clock, Flame, GitBranch } from 'lucide-react';

const MONTHLY_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  hours: Math.floor(20 + Math.random() * 60),
}));

function SummaryCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '22' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[#9CA3AF] text-xs">{label}</p>
        <p className="text-white text-xl font-bold">{value}</p>
        {trend && <p className="text-[#22C55E] text-xs mt-0.5">↑ {trend}</p>}
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-5">
      <div>
        <h1 className="text-white text-xl font-bold">Analytics</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Your coding productivity at a glance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Clock} label="Total Hours" value="312h" trend="18% vs last month" color="#6D5DFB" />
        <SummaryCard icon={Flame} label="Best Streak" value="32 days" color="#F97316" />
        <SummaryCard icon={GitBranch} label="Commits" value="847" trend="23% vs last month" color="#22C55E" />
        <SummaryCard icon={TrendingUp} label="Productivity" value="84%" trend="5% vs last week" color="#3B82F6" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 bg-[#121523] border border-[#23273B] rounded-2xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Monthly Coding Hours</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#23273B" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="hours" fill="#6D5DFB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language donut */}
        <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Languages</h3>
          <div style={{ height: 160 }} className="mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languagesData} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {languagesData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {languagesData.map(l => (
              <div key={l.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[#9CA3AF] text-xs">{l.name}</span>
                </div>
                <span className="text-white text-xs font-semibold">{l.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly trend line */}
      <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5">
        <h3 className="text-white text-sm font-semibold mb-4">This Week</h3>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={codingTimeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#23273B" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1E2235', border: '1px solid #23273B', borderRadius: 12, color: '#fff', fontSize: 12 }} />
              <Line type="monotone" dataKey="hours" stroke="#6D5DFB" strokeWidth={2.5} dot={{ fill: '#6D5DFB', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
