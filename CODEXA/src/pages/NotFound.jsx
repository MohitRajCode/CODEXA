import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="text-center">
        {/* 404 graphic */}
        <div className="relative mb-8">
          <p className="text-[180px] font-black text-[#1E2235] leading-none select-none">404</p>
          {/* Logo element replacement for 404 art */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 blur-2xl">
            <div className="w-full h-full bg-gradient-to-br from-[#00D4C0] via-[#38A4F8] to-[#7C3AED] rounded-full" />
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
