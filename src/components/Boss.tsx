import React from 'react';
import { Skull } from 'lucide-react';
import { cn } from '../utils';

interface BossProps {
  health: number; // 0 to 100
  maxHealth: number;
}

export const Boss: React.FC<BossProps> = ({ health, maxHealth }) => {
  const percentage = Math.min(100, Math.max(0, (health / maxHealth) * 100));
  const isAngry = percentage > 50;
  const isCritical = percentage > 80;

  if (health === 0) {
    return (
      <div className="bg-zinc-900 border border-emerald-900/50 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Skull size={24} className="opacity-50" />
        </div>
        <div>
          <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Boss Vaincu</h3>
          <p className="text-zinc-500 text-xs font-mono mt-1">Aucune tâche en retard. Paix intérieure.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-zinc-900 border rounded-2xl p-4 transition-all duration-500",
      isCritical ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-zinc-800"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skull 
            size={20} 
            className={cn(
              "transition-colors",
              isCritical ? "text-red-500 animate-pulse" : isAngry ? "text-orange-500" : "text-zinc-500"
            )} 
          />
          <h3 className="font-bold text-zinc-200 uppercase tracking-widest text-sm">
            Boss de Procrastination
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">Puissance: {Math.round(percentage)}%</span>
      </div>
      
      <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            isCritical ? "bg-red-500" : isAngry ? "bg-orange-500" : "bg-zinc-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500 mt-3 font-mono">
        {isCritical ? "⚠️ DANGER IMMINENT : Nettoyez vos tâches en retard !" : "Il se nourrit de vos tâches périmées..."}
      </p>
    </div>
  );
};
