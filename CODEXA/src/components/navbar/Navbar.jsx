import { Bell, Menu, Search, Play, Flame, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSidebar from '../../hooks/useSidebar';
import { useAuthContext } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { getCurrentStreak } from '../../services/supabase/analyticsService';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, subscribeToNotifications } from '../../services/supabase/notificationService';
import LiveTimer from './LiveTimer';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function Navbar() {
  const toggle = useSidebar((s) => s.toggle);
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState('');

  const firstName = (profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'there').split(' ')[0];

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user?.id) {
      getCurrentStreak(user.id).then(setStreak).catch(() => setStreak(0));
      
      // Load notifications
      getNotifications(user.id).then(setNotifications).catch(console.error);

      // Subscribe to real-time
      const subscription = subscribeToNotifications(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new, ...prev]);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, user.id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id, user.id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[#1E2235] flex-shrink-0 bg-[#080A14] gap-4">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="text-[#9CA3AF] hover:text-white transition-colors lg:hidden cursor-pointer flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-white text-base sm:text-lg font-bold leading-tight truncate">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-[#9CA3AF] text-[10px] sm:text-xs mt-0.5 truncate hidden sm:block">Let's build something amazing today!</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#121523] border border-[#1E2235] rounded-xl px-3 py-2 w-48">
          <Search size={13} className="text-[#6B7280] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="bg-transparent text-white text-xs placeholder-[#6B7280] focus:outline-none flex-1 min-w-0"
          />
          <span className="text-[#6B7280] text-[10px] font-mono flex-shrink-0">⌘/</span>
        </div>

        {/* Streak badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#121523] border border-[#1E2235] rounded-xl px-3 py-2">
          <div className="text-right">
            <p className="text-[#9CA3AF] text-[10px] leading-none">Keep coding, keep growing!</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Flame size={12} className="text-orange-400" />
              <span className="text-white text-xs font-bold">{streak} days</span>
            </div>
            <p className="text-[#6B7280] text-[10px]">Current streak!</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className={`relative w-9 h-9 flex items-center justify-center bg-[#121523] border ${showNotifications ? 'border-[#6D5DFB]' : 'border-[#1E2235]'} rounded-xl text-[#9CA3AF] hover:text-white hover:border-[#6D5DFB]/50 transition-colors cursor-pointer`}
          >
            <Bell size={15} className={showNotifications ? 'text-white' : ''} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6D5DFB] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-[#080A14] border border-[#1E2235] rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 border-b border-[#1E2235] bg-[#121523]">
                  <h3 className="text-white text-sm font-bold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[#6D5DFB] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#6B7280]">
                      <Bell size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1E2235]">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3 flex gap-3 group transition-colors ${!notif.read ? 'bg-[#6D5DFB]/5' : 'hover:bg-[#121523]'}`}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-[#6D5DFB]' : 'bg-transparent'}`} />
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notif.read ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-[#4B5563] mt-1">
                              {timeAgo(notif.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {!notif.read && (
                              <button 
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="p-1 text-[#6B7280] hover:text-white hover:bg-[#1E2235] rounded-lg transition-colors cursor-pointer"
                                title="Mark as read"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="p-1 text-[#6B7280] hover:text-red-400 hover:bg-[#1E2235] rounded-lg transition-colors cursor-pointer"
                              title="Delete notification"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#1E2235] hover:ring-[#6D5DFB]/60 transition-all cursor-pointer"
          aria-label="Profile"
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={firstName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6D5DFB] to-[#38BDF8] flex items-center justify-center text-white text-xs font-black">
              {firstName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </button>

        {/* Live Timer (Start Coding replaced) */}
        <LiveTimer />
      </div>
    </header>
  );
}
