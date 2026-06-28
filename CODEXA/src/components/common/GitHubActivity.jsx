import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchContributions } from '../../services/supabase/githubService';
import { linkGitHubIdentity } from '../../services/supabase/authService';
import { useToast } from '../../contexts/NotificationContext';
import { updateProfile } from '../../services/supabase/profileService';
import { fetchGitHubUser } from '../../services/supabase/githubService';

// Color levels for heatmap (green like GitHub)
function getColor(count) {
  if (count === 0) return '#161B22';
  if (count < 4)  return '#0E4429';
  if (count < 8)  return '#006D32';
  if (count < 12) return '#26A641';
  return '#39D353';
}

// Month labels computed from heatmap weeks
function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = null;
  weeks.forEach((week, wi) => {
    const month = new Date(week[0].date).toLocaleString('default', { month: 'short' });
    if (month !== lastMonth) {
      labels.push({ month, weekIndex: wi });
      lastMonth = month;
    }
  });
  return labels;
}

// Generate an empty 52-week calendar for users not connected
function generateEmptyCalendar() {
  const weeks = [];
  const today = new Date();
  today.setDate(today.getDate() - (today.getDay() || 7)); // start at previous sunday or today if sunday
  
  // Go back 51 weeks
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - (51 * 7));

  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push({ date: currentDate.toISOString().split('T')[0], count: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
}

export default function GitHubActivity() {
  const { profile } = useAuthContext();
  const { error: showError } = useToast();
  const [data, setData] = useState({ weeks: null, commits: 0, trend: '', comparison: '', isMock: true });
  const [loading, setLoading] = useState(true);

  const handleConnect = async () => {
    try {
      const data = await linkGitHubIdentity();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("OAuth Link Error:", err);
      showError('OAuth Failed', `Error: ${err.message}. Falling back to token method.`);
      
      // Always Fallback to PAT
      const token = window.prompt(`OAuth failed (${err.message}).\n\nPlease ensure your Supabase 'Site URL' matches your localhost port (usually 5173) in Authentication -> URL Configuration.\n\nAlternatively, you can paste a GitHub Personal Access Token (PAT) below:`);
      if (token && token.trim()) {
        try {
          const ghUser = await fetchGitHubUser(token.trim());
          
          // Save to localStorage as a reliable fallback in case DB update fails
          localStorage.setItem('github_token_fallback', token.trim());
          localStorage.setItem('github_username_fallback', ghUser.login);
          
          try {
            await updateProfile(profile.id, { 
              github_token: token.trim(), 
              github_username: ghUser.login 
            });
          } catch (dbErr) {
            console.warn("DB profile update failed, but token is saved locally.", dbErr);
          }
          
          window.location.reload(); // Quick refresh to load new data
        } catch (patErr) {
          showError('Invalid Token', 'The Personal Access Token provided is invalid or expired.');
        }
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!profile?.github_token || !profile?.github_username) {
        setData({ 
          weeks: generateEmptyCalendar(), 
          commits: 0, 
          trend: 'Inactive', 
          comparison: 'this year',
          isMock: true
        });
        setLoading(false);
        return;
      }
      
      try {
        const cal = await fetchContributions(profile.github_username, profile.github_token);
        if (cal && cal.weeks) {
          const mappedWeeks = cal.weeks.map(w => 
            w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount }))
          );
          
          setData({
            weeks: mappedWeeks,
            commits: cal.totalContributions,
            trend: 'Active',
            comparison: 'this year',
            isMock: false
          });
        } else {
          showError('GitHub API Error', 'Failed to parse contribution graph data.');
          setData({ weeks: generateEmptyCalendar(), commits: 0, trend: 'Inactive', comparison: 'this year', isMock: true });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
        showError('GitHub Sync Failed', `API Error: ${error.message}`);
        // Fallback on error
        setData({ 
          weeks: generateEmptyCalendar(), 
          commits: 0, 
          trend: 'Inactive', 
          comparison: 'this year',
          isMock: true
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile]);

  if (loading || !data.weeks) {
    return (
      <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex items-center justify-center h-full min-h-[200px]">
        <div className="w-6 h-6 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { commits, trend, comparison, weeks, isMock } = data;
  const monthLabels = getMonthLabels(weeks);
  const dayLabels = ['M', '', 'W', '', 'F', '', ''];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex flex-col h-full relative overflow-hidden"
    >
      {isMock && (
        <div className="absolute inset-0 bg-[#121523]/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl border border-[#23273B]">
          <GitBranch size={32} className="text-[#6D5DFB] mb-3" />
          <h3 className="text-white font-semibold mb-1">Connect GitHub</h3>
          <p className="text-[#9CA3AF] text-xs mb-4 max-w-[200px] text-center">
            Link your GitHub account to see your real contribution graph.
          </p>
          <button onClick={handleConnect} className="px-4 py-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer mb-2">
            Connect with 1-Click
          </button>
          <button 
            onClick={() => {
              const token = window.prompt("Paste your GitHub Personal Access Token (PAT) below:");
              if (token && token.trim()) {
                fetchGitHubUser(token.trim()).then(ghUser => {
                  localStorage.setItem('github_token_fallback', token.trim());
                  localStorage.setItem('github_username_fallback', ghUser.login);
                  updateProfile(profile.id, { github_token: token.trim(), github_username: ghUser.login })
                    .catch(err => console.warn("DB update failed but saved locally", err))
                    .finally(() => window.location.reload());
                }).catch(() => showError('Invalid Token', 'The Personal Access Token provided is invalid or expired.'));
              }
            }}
            className="text-[#9CA3AF] text-[10px] hover:text-white transition-colors cursor-pointer underline"
          >
            Or manually enter a token
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">GitHub Activity</h3>
        <button className="text-[#6D5DFB] text-xs font-medium hover:text-[#8B7CF8] transition-colors cursor-pointer">
          View More
        </button>
      </div>

      {/* Commits count */}
      <div className="mb-4">
        <p className="text-white text-2xl font-bold">
          {commits} <span className="text-base font-medium">commits</span>
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <TrendingUp size={13} className="text-[#22C55E]" />
          <span className="text-[#22C55E] text-xs font-semibold">{trend}</span>
          <span className="text-[#9CA3AF] text-xs">{comparison}</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex-1 overflow-hidden">
        {/* Month labels */}
        <div className="flex mb-1 pl-5">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIndex === wi);
            return (
              <div key={wi} className="flex-1 text-center">
                {label ? (
                  <span className="text-[#9CA3AF] text-[9px]">{label.month}</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Grid: day labels + cells */}
        <div className="flex gap-1">
          {/* Day labels (M W F) */}
          <div className="flex flex-col gap-[3px] mr-1 justify-around">
            {dayLabels.map((d, i) => (
              <span key={i} className="text-[#9CA3AF] text-[9px] leading-[10px] w-3 text-right">
                {d}
              </span>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px] flex-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} contributions`}
                    className="heatmap-cell rounded-[2px] cursor-pointer"
                    style={{
                      backgroundColor: getColor(day.count),
                      aspectRatio: '1',
                      minHeight: 10,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#9CA3AF] text-[9px]">Less</span>
          <div className="flex items-center gap-[3px]">
            {['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[#9CA3AF] text-[9px]">More</span>
        </div>
      </div>
    </motion.div>
  );
}
