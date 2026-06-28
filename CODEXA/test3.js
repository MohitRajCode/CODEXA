const url = 'https://zmezpisxtrjagzwzdpoe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXpwaXN4dHJqYWd6d3pkcG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjQ5NjEsImV4cCI6MjA5ODE0MDk2MX0.Dhsz7Jko0HF8dtE42bcUUQQswELGdejRRctBaaFlXrw';

async function test() {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  // Update all user_settings to show_in_leaderboard: true
  const res = await fetch(`${url}/rest/v1/user_settings?show_in_leaderboard=eq.false`, { 
    method: 'PATCH',
    headers,
    body: JSON.stringify({ show_in_leaderboard: true })
  });
  
  const updated = await res.json();
  console.log('updated:', updated);
}

test();
