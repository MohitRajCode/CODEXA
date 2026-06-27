import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="text-center">
        {/* 404 graphic */}
        <div className="relative mb-8">
          <p className="text-[180px] font-black text-[#1E2235] leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 rounded-3xl flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="#6D5DFB" fillOpacity="0.5"/>
                <path d="M8 4L11 8L8 12L5 8L8 4Z" fill="#6D5DFB"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-[#9CA3AF] text-sm mb-8 max-w-xs mx-auto">
          Looks like this page went on a coding break. Let's get you back on track.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <Home size={16} /> Go Home
            </motion.button>
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-[#23273B] text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/50 font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
