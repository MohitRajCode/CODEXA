import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { motion } from 'framer-motion';

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

export default function CodingTimeChart({ data = [], isEmpty = false }) {
  const [period] = useState('This Week');

  const maxHours = data.length > 0 ? Math.max(...data.map((d) => d.hours), 1) : 1;
  const yMax = Math.ceil(maxHours) + 1;
  const yTicks = Array.from({ length: Math.min(yMax + 1, 6) }, (_, i) =>
    Math.round((i * yMax) / Math.min(yMax, 5))
  );

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

      {/* Empty state */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl">📊</span>
          <p className="text-[#9CA3AF] text-sm">No coding sessions yet</p>
          <p className="text-[#6B7280] text-xs max-w-[200px]">
            Start logging sessions and your weekly chart will appear here.
          </p>
        </div>
      ) : (
        /* Chart */
        <div className="flex-1 min-h-0" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
                ticks={yTicks}
                domain={[0, yMax]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(109,93,251,0.06)', radius: 6 }} />
              <Bar dataKey="hours" shape={<RoundedBar />} maxBarSize={48}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.hours === Math.max(...data.map((d) => d.hours))
                      ? '#6D5DFB'
                      : '#4C3FBF'}
                  />
                ))}
                <LabelList
                  dataKey="label"
                  position="top"
                  style={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'Inter' }}
                  formatter={(v) => (v === '0m' ? '' : v)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
