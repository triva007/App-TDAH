import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, SubTask, INCUPTag, UserStats, Reward } from './types';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { CalendarMock } from './components/CalendarMock';
import { XPBar } from './components/XPBar';
import { HyperfocusMode } from './components/HyperfocusMode';
import { Boutique } from './components/Boutique';
import { Boss } from './components/Boss';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Target, ListTodo, ShoppingBag } from 'lucide-react';
import { cn, calculateHealth } from './utils';

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('adhd-tasks', []);
  const [stats, setStats] = useLocalStorage<UserStats>('adhd-stats', { xp: 0, totalXp: 0, level: 1 });
  const [rewards, setRewards] = useLocalStorage<Reward[]>('adhd-rewards', [
    { id: '1', title: '1h de jeu vidéo', cost: 500 },
    { id: '2', title: 'Acheter un café spécial', cost: 300 },
  ]);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [view, setView] = useState<'today' | 'backlog' | 'boutique'>('today');
  const [isCrit, setIsCrit] = useState(false);

  // Filter tasks
  const todayTasks = tasks.filter(t => t.isToday);
  const backlogTasks = tasks.filter(t => !t.isToday);

  // Boss Logic
  // Boss health increases based on how many tasks are rotting (health < 7)
  const rottingTasks = tasks.filter(t => !t.completed && calculateHealth(t.createdAt) < 7);
  const bossHealth = rottingTasks.reduce((acc, t) => acc + (7 - calculateHealth(t.createdAt)) * 10, 0);
  const maxBossHealth = 100; // Arbitrary max

  // Check if boss was just defeated
  const [prevBossHealth, setPrevBossHealth] = useState(bossHealth);
  useEffect(() => {
    if (prevBossHealth > 0 && bossHealth === 0) {
      // Boss defeated!
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ef4444', '#f59e0b', '#10b981']
      });
      setStats(prev => {
        const bonus = 1000;
        const newTotalXp = (prev.totalXp ?? prev.xp ?? 0) + bonus;
        return {
          xp: (prev.xp ?? 0) + bonus,
          totalXp: newTotalXp,
          level: Math.floor(newTotalXp / 1000) + 1
        };
      });
    }
    setPrevBossHealth(bossHealth);
  }, [bossHealth, prevBossHealth, setStats]);


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
    // Lootbox Logic: 15% chance for critical hit
    const isCriticalHit = Math.random() < 0.15;
    
    if (isCriticalHit) {
      setIsCrit(true);
      setTimeout(() => setIsCrit(false), 1000); // Reset after animation
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        scalar: 1.2
      });
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6']
      });
    }

    // XP Logic
    const baseXP = 100;
    const multiplier = task.tags.length > 0 ? 2 : 1;
    let earnedXP = baseXP * multiplier;
    
    if (isCriticalHit) {
      earnedXP *= 3; // 3x XP on crit
    }

    setStats(prev => {
      const currentTotal = prev.totalXp ?? prev.xp ?? 0;
      const currentXp = prev.xp ?? 0;
      const newTotalXp = currentTotal + earnedXP;
      const newLevel = Math.floor(newTotalXp / 1000) + 1;
      return { 
        xp: currentXp + earnedXP, 
        totalXp: newTotalXp, 
        level: newLevel 
      };
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

  const handleAddReward = (title: string, cost: number) => {
    setRewards(prev => [...prev, { id: crypto.randomUUID(), title, cost }]);
  };

  const handleBuyReward = (id: string, cost: number) => {
    if ((stats.xp ?? 0) >= cost) {
      setStats(prev => ({ ...prev, xp: (prev.xp ?? 0) - cost }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d946ef'] // Purple/Pink for boutique
      });
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 transition-all duration-75",
      isCrit && "animate-shake bg-zinc-900"
    )}>
      {isCrit && <div className="fixed inset-0 bg-yellow-500/20 z-50 pointer-events-none animate-flash" />}

      {activeTask && (
        <HyperfocusMode 
          taskTitle={activeTask.title} 
          onComplete={handleHyperfocusComplete}
          onCancel={() => setActiveTask(null)}
        />
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
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
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit overflow-x-auto">
            <button
              onClick={() => setView('today')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                view === 'today' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Target size={16} />
              Focus du Jour
            </button>
            <button
              onClick={() => setView('backlog')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                view === 'backlog' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <ListTodo size={16} />
              Backlog
            </button>
            <button
              onClick={() => setView('boutique')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                view === 'boutique' ? "bg-purple-600/20 text-purple-400 shadow-sm" : "text-zinc-500 hover:text-purple-400/70"
              )}
            >
              <ShoppingBag size={16} />
              Boutique
            </button>
          </div>

          {view === 'boutique' ? (
            <Boutique 
              stats={stats} 
              rewards={rewards} 
              onAddReward={handleAddReward} 
              onBuyReward={handleBuyReward} 
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Right Column: Sidebar (Calendar & Boss) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-8 space-y-6">
            <Boss health={bossHealth} maxHealth={maxBossHealth} />
            <CalendarMock />
            
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold">Règles du Jeu</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2"><span className="text-emerald-500">1.</span> Les tâches perdent de la vie chaque jour.</li>
                <li className="flex gap-2"><span className="text-emerald-500">2.</span> À 0 PV, la tâche est désintégrée.</li>
                <li className="flex gap-2"><span className="text-emerald-500">3.</span> Tags INCUP = Double XP.</li>
                <li className="flex gap-2"><span className="text-yellow-500">4.</span> 15% de chance de Coup Critique (XP x3) !</li>
                <li className="flex gap-2"><span className="text-red-500">5.</span> Attention au Boss de Procrastination...</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

