import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, MoreHorizontal, X, Maximize2 } from 'lucide-react';

export default function TodoList({ onClose }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('codexa_focus_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('codexa_focus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-[#000000]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-[400px] h-[600px]' : 'w-[320px] h-[450px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/90">
          <span className="text-sm font-semibold flex items-center gap-2">
            <span className="text-xl">☀️</span> Today's Tasks
          </span>
          <span className="text-xs text-white/50">v</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Maximize2 size={14} />
          </button>
          <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <MoreHorizontal size={14} />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm">
            <p>No tasks yet</p>
            <p className="text-xs mt-1">Add one below</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-white/20 border-transparent' : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  {task.completed && <Check size={10} className="text-white" />}
                </button>
                <span className={`text-sm flex-1 transition-colors ${task.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Input */}
      <form onSubmit={addTask} className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5 focus-within:border-white/20 transition-colors">
          <Plus size={16} className="text-white/50" />
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task" 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-full"
          />
        </div>
      </form>
    </motion.div>
  );
}
