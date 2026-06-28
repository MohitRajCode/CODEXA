import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#6B7280',
    features: ['5 active projects', '30-day history', 'Basic analytics', 'GitHub sync (5 repos)'],
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    color: '#6D5DFB',
    features: ['Unlimited projects', '1-year history', 'Advanced analytics', 'GitHub sync (unlimited)', 'Priority support', 'Custom goals'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$19',
    period: 'per month',
    color: '#F97316',
    features: ['Everything in Pro', 'Team dashboards', 'API access', 'White-label reports', 'Dedicated support', 'Custom integrations'],
    icon: Crown,
  },
];

export default function Premium() {
  const { profile } = useAuthContext();
  const currentPlanName = (profile?.plan || 'free').toLowerCase();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-2">Upgrade Your Plan</h1>
        <p className="text-[#9CA3AF] text-sm">Unlock powerful insights and take your productivity to the next level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-[#121523] border rounded-2xl p-6 flex flex-col ${plan.popular ? 'border-[#6D5DFB]' : 'border-[#23273B]'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#6D5DFB] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={11} /> Most Popular
                </span>
              </div>
            )}

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                {plan.icon && <plan.icon size={16} style={{ color: plan.color }} />}
                <h3 className="text-white font-bold">{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-3xl font-bold">{plan.price}</span>
                <span className="text-[#9CA3AF] text-xs">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <Check size={14} style={{ color: plan.color }} className="flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                plan.name.toLowerCase() === currentPlanName ? 'bg-[#23273B] text-[#9CA3AF] cursor-default' :
                plan.popular ? 'bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white' :
                'bg-[#1E2235] border border-[#23273B] text-white hover:border-[#6D5DFB]/50'
              }`}
            >
              {plan.name.toLowerCase() === currentPlanName ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
