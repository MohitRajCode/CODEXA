import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Pause, Save, Loader2 } from 'lucide-react';
import NewSessionModal from '../sessions/NewSessionModal';
import { createSession } from '../../services/supabase/sessionService';
import { getProjects } from '../../services/supabase/projectService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/NotificationContext';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LiveTimer() {
  const { user } = useAuthContext();
  const { success: showSuccess, error: showError } = useToast();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('codexa_live_timer');
    if (savedState) {
      try {
        const { startEpoch, elapsed, active, paused } = JSON.parse(savedState);
        if (active) {
          setIsActive(true);
          setIsPaused(paused);
          if (paused) {
            setSeconds(elapsed);
          } else {
            const now = Math.floor(Date.now() / 1000);
            setSeconds(elapsed + (now - startEpoch));
          }
        }
      } catch (e) {
        console.error('Failed to parse timer state', e);
      }
    }
  }, []);

  // Timer logic & state syncing
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      // Sync start time relative to current seconds
      const now = Math.floor(Date.now() / 1000);
      localStorage.setItem('codexa_live_timer', JSON.stringify({
        startEpoch: now,
        elapsed: seconds,
        active: true,
        paused: false
      }));

      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (isActive && isPaused) {
      localStorage.setItem('codexa_live_timer', JSON.stringify({
        startEpoch: 0,
        elapsed: seconds,
        active: true,
        paused: true
      }));
    } else {
      localStorage.removeItem('codexa_live_timer');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, seconds]);

  // Load projects for modal
  useEffect(() => {
    if (showModal && user) {
      getProjects(user.id).then(res => setProjects(res.data || [])).catch(console.error);
    }
  }, [showModal, user]);

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
    setShowModal(true); // Open log modal
  };

  const handleSaveSession = async (data) => {
    try {
      console.log('[LiveTimer] Saving session data:', data);
      const saved = await createSession(user.id, data);
      console.log('[LiveTimer] Session saved to DB:', saved);
      showSuccess('Session Logged!', `${data.duration_minutes} min saved!`);
      setShowModal(false);
      setSeconds(0);
      // Let other components know data changed
      window.dispatchEvent(new CustomEvent('codexa_session_logged', { detail: saved }));
      console.log('[LiveTimer] Dispatched codexa_session_logged event');
    } catch (err) {
      console.error('[LiveTimer] Save failed:', err);
      showError('Save Failed', err.message);
    }
  };

  const handleCancelSave = () => {
    setShowModal(false);
    setSeconds(0); // Reset timer
  };

  // The calculated duration in minutes for the modal
  const durationMins = Math.max(1, Math.floor(seconds / 60));

  if (!isActive) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        className="hidden sm:flex items-center gap-2 bg-[#6D5DFB] hover:bg-[#5a4ce6] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-[#6D5DFB]/25 transition-colors"
      >
        <Play size={12} fill="white" />
        Start Coding
      </motion.button>
    );
  }

  return (
    <>
      <div className="hidden sm:flex items-center bg-[#1E2235] border border-[#23273B] rounded-xl overflow-hidden shadow-lg shadow-[#6D5DFB]/10">
        {/* Timer display */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#121523]">
          {isPaused ? (
            <div className="w-2 h-2 rounded-full bg-[#FACC15]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          )}
          <span className="text-white text-xs font-mono font-bold w-12 text-center">
            {formatTime(seconds)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center border-l border-[#23273B]">
          <button 
            onClick={handlePause}
            className="p-2.5 text-[#9CA3AF] hover:text-white hover:bg-[#23273B] transition-colors cursor-pointer"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
          </button>
          <div className="w-px h-5 bg-[#23273B]" />
          <button 
            onClick={handleStop}
            className="p-2.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#23273B] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Stop & Log"
          >
            <Square size={13} fill="currentColor" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <NewSessionModal 
            projects={projects} 
            onSave={handleSaveSession} 
            onClose={handleCancelSave} 
            initialDuration={durationMins} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
