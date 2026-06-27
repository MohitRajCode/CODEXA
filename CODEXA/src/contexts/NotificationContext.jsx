import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationContext = createContext(null);

let idCounter = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title, message) => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((title, message) => addToast({ type: 'error', title, message }), [addToast]);
  const info = useCallback((title, message) => addToast({ type: 'info', title, message }), [addToast]);
  const warning = useCallback((title, message) => addToast({ type: 'warning', title, message }), [addToast]);

  const typeStyles = {
    success: 'border-[#22C55E] bg-[#052e16]',
    error:   'border-[#EF4444] bg-[#450a0a]',
    warning: 'border-[#FACC15] bg-[#422006]',
    info:    'border-[#6D5DFB] bg-[#2e1065]',
  };
  const typeIcons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <NotificationContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto w-72 border rounded-xl p-4 shadow-2xl ${typeStyles[toast.type]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-white font-bold text-sm">{typeIcons[toast.type]}</span>
                <div className="flex-1 min-w-0">
                  {toast.title && <p className="text-white text-sm font-semibold">{toast.title}</p>}
                  {toast.message && <p className="text-[#9CA3AF] text-xs mt-0.5">{toast.message}</p>}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-[#9CA3AF] hover:text-white text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useToast must be used within NotificationProvider');
  return ctx;
}

export default NotificationContext;
