import React from 'react';
import { UserStats } from '../types';
import { Trophy, Coins } from 'lucide-react';

interface XPBarProps {
  stats: UserStats;
}

export const XPBar: React.FC<XPBarProps> = ({ stats }) => {
  const currentLevelXP = (stats.totalXp ?? stats.xp ?? 0) % 1000;
  const progress = (currentLevelXP / 1000) * 100;

  return (
    <div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-zinc-950 font-black text-xl shadow-lg shadow-orange-500/20">
          {stats.level}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider text-sm">
              <Trophy size={16} />
              <span>Niveau {stats.level}</span>
            </div>
            <div className="text-xs font-mono text-zinc-500">
              {currentLevelXP} / 1000 XP
            </div>
          </div>
          
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <Coins size={18} className="text-yellow-500" />
          <span className="text-sm font-bold uppercase tracking-widest">Portefeuille XP</span>
        </div>
        <span className="text-xl font-black text-yellow-500">{stats.xp ?? 0} XP</span>
      </div>
    </div>
  );
};
