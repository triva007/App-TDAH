import React, { useState } from 'react';
import { INCUPTag } from '../types';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '../utils';

interface TaskFormProps {
  onAdd: (title: string, tags: INCUPTag[]) => void;
}

const AVAILABLE_TAGS: { id: INCUPTag; label: string; color: string }[] = [
  { id: 'Interest', label: 'Intérêt', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { id: 'Novelty', label: 'Nouveauté', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  { id: 'Challenge', label: 'Challenge', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  { id: 'Urgency', label: 'Urgence', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  { id: 'Passion', label: 'Passion', color: 'text-pink-400 border-pink-400/30 bg-pink-400/10' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<INCUPTag[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), selectedTags);
    setTitle('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: INCUPTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nouvelle quête..."
            className="w-full bg-transparent border-none text-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0 p-2"
            autoFocus
          />
        </div>
        <button 
          type="submit"
          disabled={!title.trim()}
          className="w-12 h-12 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest font-mono mr-2">
          <Sparkles size={14} />
          <span>Boost INCUP (x2 XP)</span>
        </div>
        {AVAILABLE_TAGS.map(tag => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                isSelected 
                  ? tag.color 
                  : "text-zinc-500 border-zinc-800 bg-zinc-950 hover:border-zinc-700"
              )}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </form>
  );
};
