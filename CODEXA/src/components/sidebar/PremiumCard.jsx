import { Crown } from 'lucide-react';

export default function PremiumCard() {
  return (
    <div className="mx-3 mb-4">
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#4C35B5] via-[#5B3FCC] to-[#3D2B99] border border-[#6D5DFB]/30">
        {/* Crown icon */}
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
          <Crown size={18} className="text-[#FACC15]" />
        </div>

        <h3 className="text-white text-sm font-bold mb-1">Congratulations!</h3>
        <p className="text-white/60 text-xs leading-relaxed mb-4">
          You won a free one month Pro trial. Enjoy the powerful insights!
        </p>

        <button
          disabled
          className="w-full bg-[#23273B] text-[#9CA3AF] text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-not-allowed"
        >
          Pro Active
        </button>
      </div>
    </div>
  );
}
