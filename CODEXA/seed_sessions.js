const url = 'https://zmezpisxtrjagzwzdpoe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXpwaXN4dHJqYWd6d3pkcG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjQ5NjEsImV4cCI6MjA5ODE0MDk2MX0.Dhsz7Jko0HF8dtE42bcUUQQswELGdejRRctBaaFlXrw';

async function test() {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const users = [
    'e5259c77-6df8-4080-8799-adfb1a3d988f',
    'bc56936f-f9b4-47ac-a5e1-8a1fcd378c8a',
    '6efd58e6-99a5-48c4-8ee1-f0d13fbae925'
  ];

  const sessions = [];
  
  // Create some sessions for each user within the last 7 days
  const now = new Date();
  
  users.forEach((userId, index) => {
    // Generate 3-5 sessions per user
    const numSessions = 3 + index;
    for (let i = 0; i < numSessions; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - Math.floor(Math.random() * 6)); // 0 to 5 days ago
      
      sessions.push({
        user_id: userId,
        title: `Project ${['Alpha', 'Beta', 'Gamma', 'Delta'][Math.floor(Math.random()*4)]}`,
        language: ['JavaScript', 'TypeScript', 'Python', 'Rust'][Math.floor(Math.random()*4)],
        duration_minutes: 30 + Math.floor(Math.random() * 120),
        started_at: d.toISOString(),
      });
    }
  });

  console.log('Inserting sessions:', sessions.length);

  const res = await fetch(`${url}/rest/v1/sessions`, { 
    method: 'POST',
    headers,
    body: JSON.stringify(sessions)
  });
  
  if (res.ok) {
    console.log('Successfully inserted fake sessions.');
  } else {
    console.error('Failed:', await res.text());
  }
}

test();
