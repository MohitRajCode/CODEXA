import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmezpisxtrjagzwzdpoe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXpwaXN4dHJqYWd6d3pkcG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjQ5NjEsImV4cCI6MjA5ODE0MDk2MX0.Dhsz7Jko0HF8dtE42bcUUQQswELGdejRRctBaaFlXrw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: settingsData } = await supabase.from('user_settings').select('id, show_in_leaderboard');
  console.log('user_settings:', settingsData);
  
  if (settingsData) {
    const optedInIds = settingsData.filter(s => s.show_in_leaderboard).map(s => s.id);
    console.log('optedInIds:', optedInIds);
    
    if (optedInIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', optedInIds);
      console.log('profiles:', profiles);
      
      const { data: sessions } = await supabase.from('sessions').select('user_id, duration_minutes').in('user_id', optedInIds);
      console.log('sessions:', sessions);
    }
  }
}

test();
