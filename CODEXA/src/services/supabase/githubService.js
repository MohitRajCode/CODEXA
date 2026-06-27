import axios from 'axios';
import { supabase } from './client';

const GITHUB_API = 'https://api.github.com';

// Get GitHub token stored in profile
async function getGitHubToken(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('github_token')
    .eq('id', userId)
    .single();
  return data?.github_token;
}

function githubClient(token) {
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
}

// ─── Fetch GitHub User ────────────────────────────────────────────────────────
export async function fetchGitHubUser(token) {
  const client = githubClient(token);
  const { data } = await client.get('/user');
  return data;
}

// ─── Fetch Repositories ───────────────────────────────────────────────────────
export async function fetchRepositories(token, page = 1) {
  const client = githubClient(token);
  const { data } = await client.get('/user/repos', {
    params: { sort: 'updated', per_page: 50, page },
  });
  return data;
}

// ─── Fetch Commits for Repo ───────────────────────────────────────────────────
export async function fetchCommits(token, owner, repo, page = 1) {
  const client = githubClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}/commits`, {
    params: { per_page: 30, page },
  });
  return data;
}

// ─── Fetch Contribution Graph ─────────────────────────────────────────────────
export async function fetchContributions(username, token) {
  // GitHub contributions via GraphQL
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  const { data } = await axios.post(
    'https://api.github.com/graphql',
    { query, variables: { login: username } },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data?.data?.user?.contributionsCollection?.contributionCalendar;
}

// ─── Fetch Languages ──────────────────────────────────────────────────────────
export async function fetchLanguages(token, owner, repo) {
  const client = githubClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}/languages`);
  return data;
}

// ─── Save Repos to Supabase ───────────────────────────────────────────────────
export async function syncRepositories(userId, repos) {
  const rows = repos.map((r) => ({
    user_id: userId,
    github_id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    private: r.private,
    updated_at: r.updated_at,
  }));

  const { error } = await supabase
    .from('repositories')
    .upsert(rows, { onConflict: 'github_id' });
  if (error) throw error;
}

// ─── Get Stored Repos ─────────────────────────────────────────────────────────
export async function getStoredRepositories(userId) {
  const { data, error } = await supabase
    .from('repositories')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}
