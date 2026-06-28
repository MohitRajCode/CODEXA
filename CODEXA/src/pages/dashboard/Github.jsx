import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchContributions, fetchRepositories } from '../../services/supabase/githubService';
import { GitBranch, Star, GitFork, BookOpen, Clock, Settings, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LANG_COLORS = {
  JavaScript: '#FACC15',
  TypeScript: '#6D5DFB',
  Python: '#22C55E',
  CSS: '#3B82F6',
  HTML: '#E34F26',
  Rust: '#F97316',
  Go: '#06B6D4',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#6B7280';
}

function getIntensity(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 10) return 3;
  return 4;
}

const INTENSITY_STYLES = [
  'bg-[#1E2235]', // 0
  'bg-[#312e81]', // 1
  'bg-[#4338ca]', // 2
  'bg-[#5b21b6]', // 3
  'bg-[#6D5DFB]', // 4
];

export default function Github() {
  const { profile } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [repos, setRepos] = useState([]);

  // Use DB profile or local storage fallback
  const githubUsername = profile?.github_username || localStorage.getItem('github_username_fallback');
  const githubToken = profile?.github_token || localStorage.getItem('github_token_fallback');

  const loadData = useCallback(async () => {
    if (!githubUsername) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [contribData, repoData] = await Promise.all([
        fetchContributions(githubUsername, githubToken),
        fetchRepositories(githubToken || '', 1).catch(() => []) // Repo fetch might fail if no token for private/limits
      ]);

      setContributions(contribData);
      setRepos(repoData.slice(0, 6)); // Just show top 6 recently updated
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load GitHub data. Please check your username/token in settings.');
    } finally {
      setLoading(false);
    }
  }, [githubUsername, githubToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!githubUsername && !loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#0D101D] border border-[#23273B] flex items-center justify-center mb-4">
          <GitBranch size={32} className="text-[#6D5DFB]" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">GitHub Not Connected</h2>
        <p className="text-[#9CA3AF] text-sm mb-6 max-w-md text-center">
          Connect your GitHub account to view your contribution graph, top repositories, and languages here.
        </p>
        <Link to="/dashboard/profile" className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
          <Settings size={16} /> Go to Profile Settings
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DFB]/20 to-[#38BDF8]/20 border border-[#6D5DFB]/20 flex items-center justify-center">
              <GitBranch size={20} className="text-[#6D5DFB]" />
            </div>
            <h1 className="text-white text-2xl font-black">GitHub</h1>
          </div>
          <p className="text-[#9CA3AF] text-sm ml-[52px]">Your GitHub activity and repositories</p>
        </div>
        
        {githubUsername && (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#121523] border border-[#23273B] hover:border-[#6D5DFB]/50 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <GitBranch size={16} /> View on GitHub
          </a>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 size={28} className="text-[#6D5DFB] animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading GitHub data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-400 font-semibold mb-2">Error Loading Data</p>
          <p className="text-sm text-red-400/80 mb-4">{error}</p>
          <button onClick={loadData} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Try Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#6D5DFB]/20 flex items-center justify-center flex-shrink-0">
                <GitBranch size={20} className="text-[#6D5DFB]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-xs font-medium">Total Contributions (Year)</p>
                <p className="text-white text-2xl font-black">{contributions?.totalContributions || 0}</p>
              </div>
            </div>
            
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-[#22C55E]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-xs font-medium">Public Repositories</p>
                <p className="text-white text-2xl font-black">{repos.length > 0 ? repos[0].owner?.public_repos || repos.length : 0}</p>
              </div>
            </div>

            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <Star size={20} className="text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-xs font-medium">Total Stars</p>
                <p className="text-white text-2xl font-black">
                  {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Contribution Graph */}
          {contributions && contributions.weeks && (
            <div className="bg-[#121523] border border-[#23273B] rounded-2xl p-6 overflow-hidden">
              <h3 className="text-white text-sm font-semibold mb-4">Contribution Graph</h3>
              
              <div className="overflow-x-auto pb-2 custom-scrollbar">
                <div className="flex gap-1 min-w-max">
                  {contributions.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {week.contributionDays.map((day, dIdx) => {
                        const intensity = getIntensity(day.contributionCount);
                        return (
                          <div
                            key={dIdx}
                            title={`${day.contributionCount} contributions on ${day.date}`}
                            className={`w-3 h-3 rounded-[2px] ${INTENSITY_STYLES[intensity]} transition-all hover:ring-1 hover:ring-white`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 gap-2 text-xs text-[#9CA3AF]">
                <span>Less</span>
                <div className="flex gap-1">
                  {INTENSITY_STYLES.map((cls, i) => (
                    <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          )}

          {/* Top Repositories */}
          {repos.length > 0 && (
            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Recently Updated Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#121523] border border-[#23273B] rounded-2xl p-5 hover:border-[#6D5DFB]/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#6D5DFB] font-semibold text-sm truncate">
                        <BookOpen size={16} className="flex-shrink-0" />
                        <span className="truncate group-hover:underline">{repo.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#9CA3AF] bg-[#0D101D] px-2 py-1 rounded-md text-xs border border-[#23273B]">
                        <Star size={12} /> {repo.stargazers_count}
                      </div>
                    </div>
                    
                    <p className="text-[#9CA3AF] text-xs mb-4 line-clamp-2 min-h-[32px]">
                      {repo.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      {repo.language ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
                          <span>{repo.language}</span>
                        </div>
                      ) : (
                        <span />
                      )}
                      
                      <div className="flex items-center gap-3">
                        {repo.forks_count > 0 && (
                          <div className="flex items-center gap-1">
                            <GitFork size={12} /> {repo.forks_count}
                          </div>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
