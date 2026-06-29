import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Maximize2, Minimize2, Music, CheckSquare, Play, Pause, Square, Loader2, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { createSession } from '../../services/supabase/sessionService';
import { getProjects } from '../../services/supabase/projectService';
import { useToast } from '../../contexts/NotificationContext';
import TodoList from '../../components/focus/TodoList';
import SoundsPanel from '../../components/focus/SoundsPanel';
import NewSessionModal from '../../components/sessions/NewSessionModal';

function formatTimeLarge(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    mins: m.toString().padStart(2, '0'),
    secs: s.toString().padStart(2, '0')
  };
}

export default function FocusMode() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { success: showSuccess, error: showError } = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSounds, setShowSounds] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  
  // Timer State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [projects, setProjects] = useState([]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Load Projects
  useEffect(() => {
    if (showLogModal && user) {
      getProjects(user.id).then(res => setProjects(res.data || [])).catch(console.error);
    }
  }, [showLogModal, user]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setShowLogModal(true);
  };

  const handleSaveSession = async (data) => {
    try {
      await createSession(user.id, data);
      showSuccess('Session Logged!', `${data.duration_minutes} min saved!`);
      setShowLogModal(false);
      setSeconds(0);
      window.dispatchEvent(new CustomEvent('codexa_session_logged', { detail: data }));
    } catch (err) {
      showError('Save Failed', err.message);
    }
  };

  const handleCancelSave = () => {
    setShowLogModal(false);
    setSeconds(0);
  };

  const { mins, secs } = formatTimeLarge(seconds);
  const durationMins = Math.max(1, Math.floor(seconds / 60));

  const handleExit = (e) => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  // A nice nature background similar to the screenshot
  const bgImage = "https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Top Navbar */}
      <div className="relative z-50 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <a 
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(err => console.error(err));
              }
              window.location.href = '/dashboard';
            }}
            className="p-2 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/40 backdrop-blur-md transition-colors cursor-pointer z-[100]"
            title="Exit Focus Mode"
          >
            <ArrowLeft size={20} />
          </a>
          <div className="flex items-center gap-2 text-white font-bold text-xl drop-shadow-md">
            <span className="text-[#6D5DFB]">◆</span> Codexa Focus
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSounds(!showSounds)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors backdrop-blur-md border ${
              showSounds ? 'bg-white/20 border-white/30 text-white' : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/40'
            }`}
          >
            <Music size={16} /> Sounds
          </button>
          <button 
            onClick={() => setShowTasks(!showTasks)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors backdrop-blur-md border ${
              showTasks ? 'bg-white/20 border-white/30 text-white' : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/40'
            }`}
          >
            <CheckSquare size={16} /> Tasks
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/20 border border-white/10 text-white/70 hover:text-white hover:bg-black/40 backdrop-blur-md transition-colors"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Content (Center Timer) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-[10rem] font-bold text-white leading-none tracking-tight drop-shadow-2xl flex items-baseline justify-center font-mono">
            {mins}<span className="text-white/70 mx-2">:</span>{secs}
          </div>
          
          <div className="text-4xl text-white/90 font-medium drop-shadow-lg mt-4 flex items-center justify-center gap-4">
            focus on...
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            {!isActive ? (
              <button 
                onClick={handleStart}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Play size={28} className="ml-1" fill="currentColor" />
              </button>
            ) : (
              <>
                <button 
                  onClick={handlePause}
                  className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all shadow-xl"
                >
                  {isPaused ? <Play size={28} className="ml-1" fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
                </button>
                <button 
                  onClick={handleStop}
                  className="w-16 h-16 rounded-full bg-red-500/80 border border-red-500/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 active:scale-95 transition-all shadow-xl"
                >
                  <Square size={24} fill="currentColor" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer message */}
      <div className="relative z-10 text-center pb-6 text-white/50 text-sm italic drop-shadow-md">
        This is my time to access flow state.
      </div>

      {/* Draggable/Floating Panels (Simplified to fixed positions for now) */}
      <AnimatePresence>
        {showSounds && (
          <div className="absolute left-8 top-32 z-20">
            <SoundsPanel onClose={() => setShowSounds(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTasks && (
          <div className="absolute right-8 top-32 z-20">
            <TodoList onClose={() => setShowTasks(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Log Session Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <NewSessionModal 
              projects={projects} 
              onSave={handleSaveSession} 
              onClose={handleCancelSave} 
              initialDuration={durationMins} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
