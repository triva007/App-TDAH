import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, SubTask, INCUPTag, UserStats } from './types';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { CalendarMock } from './components/CalendarMock';
import { XPBar } from './components/XPBar';
import { HyperfocusMode } from './components/HyperfocusMode';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Target, ListTodo } from 'lucide-react';
import { cn } from './utils';

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('adhd-tasks', []);
  const [stats, setStats] = useLocalStorage<UserStats>('adhd-stats', { xp: 0, level: 1 });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [view, setView] = useState<'today' | 'backlog'>('today');

  // Filter tasks
  const todayTasks = tasks.filter(t => t.isToday);
  const backlogTasks = tasks.filter(t => !t.isToday);

  const handleAddTask = (title: string, tags: INCUPTag[]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      completed: false,
      health: 7,
      tags,
      subTasks: [],
      isToday: view === 'today'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = !t.completed;
        if (isCompleting) {
          triggerReward(t);
        }
        return { ...t, completed: isCompleting };
      }
      return t;
    }));
  };

  const triggerReward = (task: Task) => {
    // Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b']
    });

    // XP Logic
    const baseXP = 100;
    const multiplier = task.tags.length > 0 ? 2 : 1;
    const earnedXP = baseXP * multiplier;

    setStats(prev => {
      const newXp = prev.xp + earnedXP;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { xp: newXp, level: newLevel };
    });
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateSubtasks = (id: string, subTasks: SubTask[]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, subTasks } : t));
  };

  const handleHyperfocusComplete = () => {
    if (activeTask) {
      handleToggleComplete(activeTask.id);
      setActiveTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {activeTask && (
        <HyperfocusMode 
          taskTitle={activeTask.title} 
          onComplete={handleHyperfocusComplete}
          onCancel={() => setActiveTask(null)}
        />
      )}

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                Aujourd'hui, <span className="text-emerald-500">Point Barre.</span>
              </h1>
              <p className="text-zinc-500 font-mono text-sm">Zéro distraction. Exécution pure.</p>
            </div>
          </header>

          <XPBar stats={stats} />

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
            <button
              onClick={() => setView('today')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === 'today' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Target size={16} />
              Focus du Jour
            </button>
            <button
              onClick={() => setView('backlog')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                view === 'backlog' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <ListTodo size={16} />
              Backlog
            </button>
          </div>

          <TaskForm onAdd={handleAddTask} />

          <div className="space-y-4">
            {(view === 'today' ? todayTasks : backlogTasks).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 font-mono">Aucune quête en cours.</p>
              </div>
            ) : (
              (view === 'today' ? todayTasks : backlogTasks).map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onStartHyperfocus={setActiveTask}
                  onUpdateSubtasks={handleUpdateSubtasks}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar (Calendar) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8">
            <CalendarMock />
            
            <div className="mt-8 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold">Règles du Jeu</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2"><span className="text-emerald-500">1.</span> Les tâches perdent de la vie chaque jour.</li>
                <li className="flex gap-2"><span className="text-emerald-500">2.</span> À 0 PV, la tâche est désintégrée.</li>
                <li className="flex gap-2"><span className="text-emerald-500">3.</span> Tags INCUP = Double XP.</li>
                <li className="flex gap-2"><span className="text-emerald-500">4.</span> Bloqué ? Utilise le découpage IA.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

