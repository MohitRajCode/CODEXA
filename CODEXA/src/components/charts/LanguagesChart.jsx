import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { languagesData } from '../../data/mockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-[#1E2235] border border-[#23273B] rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-semibold">{name}</p>
      <p className="text-[#9CA3AF]">{value}%</p>
    </div>
  );
}

export default function LanguagesChart() {
  const [period] = useState('This Week');
  const totalLabel = '24h 18m';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-semibold">Languages Breakdown</h3>
        <button className="flex items-center gap-1.5 bg-[#1E2235] border border-[#23273B] rounded-lg px-3 py-1.5 text-[#9CA3AF] text-xs hover:border-[#6D5DFB]/50 transition-colors cursor-pointer">
          {period}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Chart + legend */}
      <div className="flex items-center gap-4 flex-1">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languagesData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={200}
                animationDuration={1000}
              >
                {languagesData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-white text-sm font-bold leading-tight">{totalLabel}</span>
            <span className="text-[#9CA3AF] text-xs">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {languagesData.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-[#9CA3AF] text-xs">{lang.name}</span>
              </div>
              <span className="text-white text-xs font-semibold">{lang.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
