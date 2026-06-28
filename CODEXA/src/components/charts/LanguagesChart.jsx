import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { fetchRepositories, fetchLanguages } from '../../services/supabase/githubService';

const COLORS = ['#6D5DFB', '#38BDF8', '#F59E0B', '#10B981', '#6B7280'];

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

/**
 * LanguagesChart
 * Props:
 *   data – array from useDashboardData (session-based language breakdown).
 *          Falls back to GitHub repo languages if user has a GitHub token and
 *          session breakdown is empty.
 */
export default function LanguagesChart({ data: sessionData = [] }) {
  const { profile } = useAuthContext();
  const [data, setData] = useState(sessionData);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('sessions'); // 'sessions' | 'github' | 'empty'

  useEffect(() => {
    // If we already have session-based data, use it
    if (sessionData && sessionData.length > 0) {
      setData(sessionData);
      setSource('sessions');
      setLoading(false);
      return;
    }

    // No session data — try GitHub repos as fallback if connected
    if (!profile?.github_token) {
      setData([]);
      setSource('empty');
      setLoading(false);
      return;
    }

    async function loadFromGitHub() {
      setLoading(true);
      try {
        const repos = await fetchRepositories(profile.github_token, 1);
        if (!repos || repos.length === 0) {
          setData([]);
          setSource('empty');
          return;
        }

        const topRepos = repos.slice(0, 5);
        const langStats = {};
        let totalBytes = 0;

        for (const repo of topRepos) {
          try {
            const repoLangs = await fetchLanguages(profile.github_token, repo.owner.login, repo.name);
            for (const [lang, bytes] of Object.entries(repoLangs)) {
              langStats[lang] = (langStats[lang] || 0) + bytes;
              totalBytes += bytes;
            }
          } catch { /* ignore single repo errors */ }
        }

        if (totalBytes === 0) {
          setData([]);
          setSource('empty');
          return;
        }

        const langArray = Object.entries(langStats)
          .map(([name, bytes]) => ({ name, bytes }))
          .sort((a, b) => b.bytes - a.bytes);

        let finalData = [];
        let otherBytes = 0;
        langArray.forEach((lang, i) => {
          if (i < 4) {
            finalData.push({
              name: lang.name,
              value: Math.max(1, Math.round((lang.bytes / totalBytes) * 100)),
              color: COLORS[i],
            });
          } else {
            otherBytes += lang.bytes;
          }
        });
        if (otherBytes > 0) {
          finalData.push({
            name: 'Other',
            value: Math.max(1, Math.round((otherBytes / totalBytes) * 100)),
            color: COLORS[4],
          });
        }
        setData(finalData);
        setSource('github');
      } catch {
        setData([]);
        setSource('empty');
      } finally {
        setLoading(false);
      }
    }

    loadFromGitHub();
  }, [sessionData, profile]);

  const centerLabel = source === 'empty' ? '—' : 'Language';
  const centerSub = source === 'empty' ? '' : 'Breakdown';

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
        <span className="text-[#6B7280] text-[10px] bg-[#1E2235] border border-[#23273B] rounded-lg px-2 py-1">
          {source === 'github' ? 'From GitHub' : source === 'sessions' ? 'From Sessions' : 'No data'}
        </span>
      </div>

      {/* Chart + legend */}
      <div className="flex items-center gap-4 flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl">💻</span>
            <span className="text-[#9CA3AF] text-sm">No language data yet</span>
            <span className="text-[#6B7280] text-xs max-w-[180px]">
              {profile?.github_token
                ? "We couldn't find language stats for your recent repos."
                : 'Log sessions or connect GitHub to see language stats.'}
            </span>
          </div>
        ) : (
          <>
            {/* Donut */}
            <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
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
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-white text-sm font-bold leading-tight">{centerLabel}</span>
                <span className="text-[#9CA3AF] text-xs">{centerSub}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 flex-1">
              {data.map((lang) => (
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
          </>
        )}
      </div>
    </motion.div>
  );
}
