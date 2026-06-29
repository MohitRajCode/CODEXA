import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudRain, 
  Radio, 
  Brain, 
  Waves, 
  Flame, 
  Palmtree, 
  Train, 
  Trees, 
  Flower2, 
  Coffee, 
  CloudLightning, 
  Droplets, 
  Building2, 
  Music,
  Plus,
  Play,
  Settings2,
  X,
  Volume2
} from 'lucide-react';

const SOUNDS = [
  { id: 'rainfall', name: 'Rainfall', icon: CloudRain, color: '#1E3A8A', activeColor: '#3B82F6' },
  { id: 'brain_food', name: 'Brain Food', icon: Brain, color: '#4C1D95', activeColor: '#8B5CF6' },
  { id: 'binaural', name: 'Binaural', icon: Waves, color: '#312E81', activeColor: '#6366F1' },
  { id: 'ocean', name: 'Ocean', icon: Waves, color: '#064E3B', activeColor: '#10B981' },
  { id: 'campfire', name: 'Campfire', icon: Flame, color: '#7C2D12', activeColor: '#F97316' },
  { id: 'beach', name: 'Beach', icon: Palmtree, color: '#92400E', activeColor: '#F59E0B' },
  { id: 'train', name: 'Train', icon: Train, color: '#3F3F46', activeColor: '#A1A1AA' },
  { id: 'forest', name: 'Forest', icon: Trees, color: '#14532D', activeColor: '#22C55E' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: '#451A03', activeColor: '#D97706' },
  { id: 'thunderstorm', name: 'Thunderstorm', icon: CloudLightning, color: '#172554', activeColor: '#60A5FA' },
];

export default function SoundsPanel({ onClose }) {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(50);

  const audioRef = useRef(null);

  const toggleSound = (id) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
    }
  };

  // When volume or playing changes, update the audio element
  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      if (playing) {
        audioEl.src = `/sounds/${playing}.m4a`;
        audioEl.volume = volume / 100;
        audioEl.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioEl.pause();
      }
    }
  }, [playing, volume]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#000000]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-[450px] flex flex-col overflow-hidden"
    >
      <audio ref={audioRef} loop preload="none" />
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music size={20} /> Sounds
          </h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors">
              <Plus size={16} />
            </button>
            {onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Now Playing indicator (Right aligned) */}
        <div className="flex items-center justify-end">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors flex-shrink-0">
            Now Playing <Play size={10} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
        <div className="grid grid-cols-5 gap-2">
          {SOUNDS.map((sound) => {
            const isPlaying = playing === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className="flex flex-col items-center gap-1.5 group outline-none"
              >
                <div 
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                    isPlaying ? 'ring-2 ring-white scale-95 shadow-lg' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: sound.color }}
                >
                  <sound.icon 
                    size={24} 
                    className={`transition-colors ${isPlaying ? 'text-white' : 'text-white/70 group-hover:text-white'}`} 
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex gap-1">
                        <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight ${
                  isPlaying ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                }`}>
                  {sound.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
        <button className="p-2 text-white/50 hover:text-white transition-colors">
          <Settings2 size={16} />
        </button>
        {playing && (
          <div className="flex items-center gap-3 flex-1 px-4">
            <Volume2 size={14} className="text-white/50" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
