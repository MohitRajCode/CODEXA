import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Flame, GitBranch, Clock, Target, Star } from 'lucide-react';

const FEATURES = [
  { icon: Clock,     title: 'Time Tracking',      desc: 'Automatically track every second of your coding sessions.' },
  { icon: BarChart3, title: 'Analytics',           desc: 'Deep insights into your productivity and language usage.' },
  { icon: GitBranch, title: 'GitHub Integration',  desc: 'Sync commits, PRs, and contributions automatically.' },
  { icon: Flame,     title: 'Streaks',             desc: 'Build and maintain daily coding streaks to stay consistent.' },
  { icon: Target,    title: 'Goals',               desc: 'Set daily, weekly, and monthly goals and track progress.' },
  { icon: Star,      title: 'Achievements',        desc: 'Unlock badges and milestones as you grow as a developer.' },
];

const STATS = [{ value: '50K+', label: 'Developers' }, { value: '12M+', label: 'Hours Tracked' }, { value: '99.9%', label: 'Uptime' }, { value: '4.9★', label: 'Rating' }];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#23273B]/60 bg-[#090B14]/80 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#6D5DFB] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9"/><path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white"/></svg>
        </div>
        <span className="text-white font-bold">Codexa</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {[['Features', '/features'], ['Pricing', '/pricing'], ['Blog', '/blog'], ['Docs', '/docs']].map(([label, path]) => (
          <Link key={label} to={path} className="text-[#9CA3AF] hover:text-white text-sm transition-colors">{label}</Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">Sign in</Link>
        <Link to="/register" className="bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Get Started</Link>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090B14] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 text-[#6D5DFB] text-xs font-medium px-4 py-2 rounded-full mb-6">
            <Flame size={13} /> Trusted by 50,000+ developers
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Track Your Code.<br />
            <span className="text-[#6D5DFB]">Own Your Growth.</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Codexa is the developer productivity platform that tracks your coding sessions, GitHub activity, and helps you build better habits.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Start Free <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/features">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 border border-[#23273B] text-white hover:border-[#6D5DFB]/50 font-semibold px-6 py-3 rounded-xl transition-colors">
                See Features
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto">
          <div className="bg-[#121523] border border-[#23273B] rounded-3xl p-6 shadow-2xl shadow-[#6D5DFB]/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full bg-[#FACC15]" />
              <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[['3h 42m', "Today's Coding", '#22C55E'], ['24h 18m', 'This Week', '#3B82F6'], ['18 days', 'Streak', '#F97316'], ['42', 'Commits', '#6D5DFB']].map(([v, l, c]) => (
                <div key={l} className="bg-[#0D101D] rounded-xl p-3">
                  <p className="text-[#9CA3AF] text-[10px] mb-1">{l}</p>
                  <p className="font-bold text-sm" style={{ color: c }}>{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0D101D] rounded-xl p-4 h-24 flex items-end gap-1">
              {[40, 65, 55, 80, 60, 30, 20].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 3 ? '#6D5DFB' : '#4C3FBF' }} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-[#23273B]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <p className="text-white text-3xl font-black mb-1">{s.value}</p>
              <p className="text-[#9CA3AF] text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white text-3xl font-black text-center mb-3">Everything You Need</h2>
          <p className="text-[#9CA3AF] text-center mb-12">Built for developers, by developers.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-[#121523] border border-[#23273B] rounded-2xl p-5 hover:border-[#6D5DFB]/40 transition-colors">
                <div className="w-10 h-10 bg-[#6D5DFB]/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-[#6D5DFB]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#6D5DFB]/20 to-[#3B82F6]/10 border border-[#6D5DFB]/30 rounded-3xl p-10">
          <h2 className="text-white text-3xl font-black mb-3">Ready to level up?</h2>
          <p className="text-[#9CA3AF] mb-6">Join 50,000+ developers tracking their progress with Codexa.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Get Started Free →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#23273B] px-6 py-8 text-center text-[#9CA3AF] text-sm">
        <p>© 2024 Codexa. All rights reserved. · <Link to="/privacy" className="hover:text-white">Privacy</Link> · <Link to="/terms" className="hover:text-white">Terms</Link></p>
      </footer>
    </div>
  );
}
