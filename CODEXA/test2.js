const url = 'https://zmezpisxtrjagzwzdpoe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXpwaXN4dHJqYWd6d3pkcG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjQ5NjEsImV4cCI6MjA5ODE0MDk2MX0.Dhsz7Jko0HF8dtE42bcUUQQswELGdejRRctBaaFlXrw';

async function test() {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  };

  // Get user_settings
  const res1 = await fetch(`${url}/rest/v1/user_settings?select=id,show_in_leaderboard`, { headers });
  const settings = await res1.json();
  console.log('user_settings:', settings);

  if (settings && settings.length > 0) {
    const optedInIds = settings.filter(s => s.show_in_leaderboard).map(s => s.id);
    console.log('optedInIds:', optedInIds);

    if (optedInIds.length > 0) {
      const idsStr = optedInIds.map(id => `"${id}"`).join(',');
      const res2 = await fetch(`${url}/rest/v1/profiles?select=id,username&id=in.(${idsStr})`, { headers });
      const profiles = await res2.json();
      console.log('profiles:', profiles);

      const res3 = await fetch(`${url}/rest/v1/sessions?select=user_id,duration_minutes&user_id=in.(${idsStr})`, { headers });
      const sessions = await res3.json();
      console.log('sessions:', sessions);
    }
  }
}

test();
