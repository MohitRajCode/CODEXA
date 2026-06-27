import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { motion } from 'framer-motion';
import { codingTimeData } from '../../data/mockData';

// Custom rounded-top bar shape
function RoundedBar(props) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const r = 4;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
}

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-[#9CA3AF] mb-0.5">{label}</p>
      <p className="text-white font-semibold">{payload[0]?.payload?.label}</p>
    </div>
  );
}

// Custom Y-axis label formatter
function yTickFormatter(v) {
  return `${v}h`;
}

export default function CodingTimeChart() {
  const [period, setPeriod] = useState('This Week');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white text-sm font-semibold">Coding Time Overview</h3>
        <button className="flex items-center gap-1.5 bg-[#1E2235] border border-[#23273B] rounded-lg px-3 py-1.5 text-[#9CA3AF] text-xs hover:border-[#6D5DFB]/50 transition-colors cursor-pointer">
          {period}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={codingTimeData}
            margin={{ top: 20, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} stroke="#23273B" strokeDasharray="0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
            />
            <YAxis
              tickFormatter={yTickFormatter}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              ticks={[0, 2, 4, 6, 8]}
              domain={[0, 8]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(109,93,251,0.06)', radius: 6 }} />
            <Bar dataKey="hours" shape={<RoundedBar />} maxBarSize={48}>
              {codingTimeData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.hours === Math.max(...codingTimeData.map(d => d.hours))
                    ? '#6D5DFB'
                    : '#4C3FBF'}
                />
              ))}
              <LabelList
                dataKey="label"
                position="top"
                style={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'Inter' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
