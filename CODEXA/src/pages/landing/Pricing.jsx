import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TIERS = [
  {
    name: 'Free', price: '$0', period: '/forever', color: '#6B7280',
    features: ['5 active projects', '30-day session history', 'Basic analytics', 'GitHub sync (5 repos)', 'Community support'],
    cta: 'Get Started Free', href: '/register',
  },
  {
    name: 'Pro', price: '$9', period: '/month', color: '#6D5DFB', popular: true,
    features: ['Unlimited projects', '1-year history', 'Advanced analytics', 'Unlimited GitHub sync', 'AI insights', 'Priority support', 'Custom goals & reports'],
    cta: 'Upgrade to Pro', href: '/register',
  },
  {
    name: 'Premium', price: '$19', period: '/month', color: '#F97316',
    features: ['Everything in Pro', 'Team dashboards', 'REST API access', 'White-label exports', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    cta: 'Upgrade to Premium', href: '/register',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#090B14] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#23273B]/60 bg-[#090B14]/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6D5DFB] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" fillOpacity="0.9"/><path d="M8 4L11 8L8 12L5 8L8 4Z" fill="white"/></svg>
          </div>
          <span className="text-white font-bold">Codexa</span>
        </Link>
        <Link to="/register" className="bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-sm font-semibold px-4 py-2 rounded-xl">Get Started</Link>
      </div>

      <div className="pt-32 pb-20 px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-white text-4xl font-black mb-3">Simple, Transparent Pricing</h1>
          <p className="text-[#9CA3AF]">Start free. Upgrade when you're ready. No hidden fees.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TIERS.map((tier, i) => (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`relative bg-[#121523] border rounded-2xl p-6 flex flex-col ${tier.popular ? 'border-[#6D5DFB] shadow-xl shadow-[#6D5DFB]/10' : 'border-[#23273B]'}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#6D5DFB] text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <h2 className="text-white font-bold text-lg mb-1">{tier.name}</h2>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-white text-4xl font-black">{tier.price}</span>
                <span className="text-[#9CA3AF] text-sm">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <span style={{ color: tier.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={tier.href}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${tier.popular ? 'bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white' : 'bg-[#1E2235] border border-[#23273B] text-white hover:border-[#6D5DFB]/50'}`}>
                  {tier.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[#9CA3AF] text-sm mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}
