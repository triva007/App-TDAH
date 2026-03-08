import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import { calculateHealth, cn } from '../utils';
import { Play, Zap, CheckCircle2, Circle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { mockAiBreakdown } from '../aiMock';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStartHyperfocus: (task: Task) => void;
  onUpdateSubtasks: (id: string, subTasks: SubTask[]) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onStartHyperfocus,
  onUpdateSubtasks
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  
  const health = calculateHealth(task.createdAt);
  const healthPercentage = (health / 7) * 100;

  const handleBreakdown = async () => {
    setIsBreakingDown(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSubtasks = mockAiBreakdown(task.title);
    onUpdateSubtasks(task.id, newSubtasks);
    setIsExpanded(true);
    setIsBreakingDown(false);
  };

  const toggleSubtask = (subId: string) => {
    const updated = task.subTasks.map(st => 
      st.id === subId ? { ...st, completed: !st.completed } : st
    );
    onUpdateSubtasks(task.id, updated);
  };

  // If health is 0, it's "dead"
  if (health === 0 && !task.completed) {
    return (
      <div className="p-4 border border-red-900/30 bg-red-950/10 rounded-xl flex items-center justify-between opacity-50 grayscale transition-all">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-red-800 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-800 rounded-full" />
          </div>
          <span className="line-through text-zinc-500">{task.title}</span>
        </div>
        <span className="text-xs text-red-500 font-mono uppercase tracking-widest">Désintégrée</span>
        <button onClick={() => onDelete(task.id)} className="text-zinc-600 hover:text-red-400">
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border transition-all duration-300",
      task.completed 
        ? "bg-zinc-900/50 border-zinc-800/50 opacity-60" 
        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
    )}>
      {/* Health Bar Background */}
      {!task.completed && (
        <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              health > 4 ? "bg-emerald-500" : health > 2 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            {task.completed ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Circle size={24} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-medium transition-all",
              task.completed ? "text-zinc-500 line-through" : "text-zinc-100"
            )}>
              {task.title}
            </h3>
            
            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {!task.completed && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.subTasks.length === 0 && (
                <button 
                  onClick={handleBreakdown}
                  disabled={isBreakingDown}
                  className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Découpage IA"
                >
                  <Zap size={16} className={cn(isBreakingDown && "animate-pulse")} />
                  <span className="hidden sm:inline">{isBreakingDown ? 'Analyse...' : 'Découper'}</span>
                </button>
              )}
              <button 
                onClick={() => onStartHyperfocus(task)}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Hyperfocus"
              >
                <Play size={16} />
                <span className="hidden sm:inline">Go</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtasks */}
        {task.subTasks.length > 0 && (
          <div className="mt-4 pl-10">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-mono mb-2"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {task.subTasks.filter(st => st.completed).length} / {task.subTasks.length} Étapes
            </button>
            
            {isExpanded && (
              <div className="space-y-2 mt-3">
                {task.subTasks.map(st => (
                  <div key={st.id} className="flex items-center gap-3 group/st">
                    <button onClick={() => toggleSubtask(st.id)} className="text-zinc-600 hover:text-emerald-400">
                      {st.completed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} />}
                    </button>
                    <span className={cn("text-sm transition-all", st.completed ? "text-zinc-600 line-through" : "text-zinc-300")}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
