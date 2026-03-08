import React, { useState } from 'react';
import { Reward, UserStats } from '../types';
import { ShoppingBag, Plus, Coins } from 'lucide-react';

interface BoutiqueProps {
  stats: UserStats;
  rewards: Reward[];
  onAddReward: (title: string, cost: number) => void;
  onBuyReward: (id: string, cost: number) => void;
}

export const Boutique: React.FC<BoutiqueProps> = ({ stats, rewards, onAddReward, onBuyReward }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(500);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newCost > 0) {
      onAddReward(newTitle.trim(), newCost);
      setNewTitle('');
      setNewCost(500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-purple-500" size={28} />
        <h2 className="text-2xl font-black tracking-tight">Boutique à Dopamine</h2>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-zinc-300">Solde disponible</h3>
          <div className="flex items-center gap-2 text-yellow-500 font-black text-xl">
            <Coins size={24} />
            {stats.xp ?? 0} XP
          </div>
        </div>
        
        <form onSubmit={handleAdd} className="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle récompense (ex: 1h de jeu)..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <input
            type="number"
            value={newCost}
            onChange={(e) => setNewCost(Number(e.target.value))}
            className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors"
            min="10"
            step="10"
          />
          <button 
            type="submit"
            disabled={!newTitle.trim() || newCost <= 0}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map(reward => {
          const canAfford = (stats.xp ?? 0) >= reward.cost;
          return (
            <div key={reward.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <h4 className="font-bold text-lg text-zinc-200">{reward.title}</h4>
              <button
                onClick={() => onBuyReward(reward.id, reward.cost)}
                disabled={!canAfford}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  canAfford 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Coins size={18} />
                Acheter pour {reward.cost} XP
              </button>
            </div>
          );
        })}
        {rewards.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-mono">
            Aucune récompense définie.
          </div>
        )}
      </div>
    </div>
  );
};
