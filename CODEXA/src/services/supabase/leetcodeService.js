// ─── LeetCode Service ─────────────────────────────────────────────────────────
// Uses leetcode-api-faisalshohag (public CORS-friendly proxy on Vercel)
// Vercel serverless functions have no cold start issues, avoiding network timeouts.
// Results are cached in localStorage for 30 minutes to avoid rate-limiting.

const BASE = 'https://leetcode-api-faisalshohag.vercel.app';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ── Helper: localStorage cache ────────────────────────────────────────────────
function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, value } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }
    return value;
  } catch { return null; }
}

function setCache(key, value) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value })); } catch {}
}

// ── Fetch user stats ──────────────────────────────────────────────────────────
export async function fetchLeetCodeStats(username) {
  if (!username) return null;

  const cacheKey = `lc_stats_${username}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let res;
  try {
    res = await fetch(`${BASE}/${encodeURIComponent(username)}`);
  } catch (err) {
    throw new Error('Network error: Could not connect to LeetCode API. Please check your connection or try again later.');
  }

  if (!res.ok) {
    if (res.status === 404) throw new Error(`User "${username}" not found on LeetCode. Check the username and try again.`);
    throw new Error(`LeetCode API error: ${res.status}`);
  }

  const profile = await res.json();

  // The API returns an error field if user not found
  if (profile.errors || profile.totalSolved === undefined) {
    throw new Error(`User "${username}" not found on LeetCode. Check the username and try again.`);
  }

  // ── Solved counts ─────────────────────────────────────────────────────────
  const totalSolved = profile.totalSolved  ?? 0;
  const easySolved  = profile.easySolved   ?? 0;
  const medSolved   = profile.mediumSolved ?? 0;
  const hardSolved  = profile.hardSolved   ?? 0;

  const totalAll  = profile.totalQuestions  ?? 3400;
  const totalEasy = profile.totalEasy       ?? 850;
  const totalMed  = profile.totalMedium     ?? 1800;
  const totalHard = profile.totalHard       ?? 750;

  // ── Calendar: parse submission timestamps ─────────────────────────────────
  let calendarMap = profile.submissionCalendar || {};

  // calendarMap keys are Unix timestamps (seconds), values are submission counts
  const now = new Date();

  // Today key (midnight UTC for that local date)
  const todayKey = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000
  );

  const todayCount = calendarMap[todayKey] || 0;

  // This week: last 7 days
  let weekCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000);
    weekCount += calendarMap[key] || 0;
  }

  // This month: all entries from the 1st of this month up to now
  let monthCount = 0;
  const monthStartKey = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
  const nowKey = Math.floor(now.getTime() / 1000);
  Object.entries(calendarMap).forEach(([ts, count]) => {
    const t = Number(ts);
    if (t >= monthStartKey && t <= nowKey) monthCount += count;
  });

  const result = {
    username,
    totalSolved,
    totalAll,
    easySolved,  totalEasy,
    medSolved,   totalMed,
    hardSolved,  totalHard,
    todayCount,
    weekCount,
    monthCount,
    ranking: profile.ranking ?? null,
  };

  setCache(cacheKey, result);
  return result;
}
