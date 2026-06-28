import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart3, Flame, GitBranch, Clock, Target, Star } from 'lucide-react';
import { useRef } from 'react';
import Logo from '../../components/common/Logo';

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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 mx-auto 2xl:max-w-[1920px] z-50 flex items-center justify-between px-6 py-4 border-b border-[#23273B]/60 bg-[#090B14]/80 backdrop-blur-xl"
    >
      <Link to="/" className="flex items-center gap-2">
        <Logo size={32} />
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {[['Features', '#features'], ['Pricing', '/pricing'], ['Blog', '/blog'], ['Docs', '/docs']].map(([label, path]) => (
          path.startsWith('#') ? (
            <a key={label} href={path} className="text-[#9CA3AF] hover:text-white text-sm transition-colors">{label}</a>
          ) : (
            <Link key={label} to={path} className="text-[#9CA3AF] hover:text-white text-sm transition-colors">{label}</Link>
          )
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">Sign in</Link>
        <Link to="/register" className="bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Get Started</Link>
      </div>
    </motion.nav>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-[#090B14] text-white 2xl:max-w-[1920px] 2xl:mx-auto 2xl:border-x 2xl:border-[#23273B]/50" ref={containerRef}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10"
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-flex items-center gap-2 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 text-[#6D5DFB] text-xs font-medium px-4 py-2 rounded-full mb-6">
              <Flame size={13} /> Trusted by 50,000+ developers
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
          >
            Track Your Code.<br />
            <span className="text-[#6D5DFB]">Own Your Growth.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#9CA3AF] text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Codexa is the developer productivity platform that tracks your coding sessions, GitHub activity, and helps you build better habits.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#6D5DFB]/20">
                Start Free <ArrowRight size={16} />
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border border-[#23273B] text-white hover:border-[#6D5DFB]/50 font-semibold px-6 py-3 rounded-xl transition-colors">
                See Features
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard preview with parallax */}
        <motion.div 
          style={{ y: dashY }}
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-16 max-w-4xl mx-auto relative z-20"
        >
          <div className="bg-[#121523] border border-[#23273B] rounded-3xl p-6 shadow-2xl shadow-[#6D5DFB]/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full bg-[#FACC15]" />
              <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[['3h 42m', "Today's Coding", '#22C55E'], ['24h 18m', 'This Week', '#3B82F6'], ['18 days', 'Streak', '#F97316'], ['42', 'Commits', '#6D5DFB']].map(([v, l, c], index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  key={l} className="bg-[#0D101D] rounded-xl p-3"
                >
                  <p className="text-[#9CA3AF] text-[10px] mb-1">{l}</p>
                  <p className="font-bold text-sm" style={{ color: c }}>{v}</p>
                </motion.div>
              ))}
            </div>
            <div className="bg-[#0D101D] rounded-xl p-4 h-24 flex items-end gap-1">
              {[40, 65, 55, 80, 60, 30, 20].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.05, ease: "backOut" }}
                  className="flex-1 rounded-t-sm" 
                  style={{ backgroundColor: i === 3 ? '#6D5DFB' : '#4C3FBF' }} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats with scroll animation */}
      <section className="py-16 px-6 border-y border-[#23273B]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 30, scale: 0.9 }} 
              whileInView={{ opacity: 1, y: 0, scale: 1 }} 
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-white text-3xl font-black mb-1">{s.value}</p>
              <p className="text-[#9CA3AF] text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features with staggered scroll animation */}
      <section id="features" className="py-24 px-6 relative">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6D5DFB]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white text-3xl md:text-4xl font-black text-center mb-4">Everything You Need</h2>
            <p className="text-[#9CA3AF] text-center mb-16 text-lg">Built for developers, by developers.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={f.title} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#121523]/80 backdrop-blur border border-[#23273B] rounded-2xl p-6 hover:border-[#6D5DFB]/40 hover:shadow-lg hover:shadow-[#6D5DFB]/5 transition-all"
              >
                <div className="w-12 h-12 bg-[#6D5DFB]/10 rounded-xl flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-[#6D5DFB]" />
                </div>
                <h3 className="text-white font-semibold mb-3 text-lg">{f.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with scale animation */}
      <section className="py-24 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-[#6D5DFB]/20 to-[#3B82F6]/10 border border-[#6D5DFB]/30 rounded-3xl p-12 shadow-2xl shadow-[#6D5DFB]/10"
        >
          <h2 className="text-white text-3xl font-black mb-4">Ready to level up?</h2>
          <p className="text-[#9CA3AF] mb-8 text-lg">Join 50,000+ developers tracking their progress with Codexa.</p>
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#6D5DFB]/20 text-lg"
            >
              Get Started Free →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#23273B] px-6 py-8 text-center text-[#9CA3AF] text-sm">
        <p>© 2026 Codexa. All rights reserved. · <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link> · <Link to="/terms" className="hover:text-white transition-colors">Terms</Link></p>
      </footer>
    </div>
  );
}
