import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

interface HyperfocusModeProps {
  taskTitle: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const HyperfocusMode: React.FC<HyperfocusModeProps> = ({ taskTitle, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto complete or just ring? Let's just ring/stop for now.
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white p-4">
      <button 
        onClick={onCancel}
        className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="text-center max-w-2xl w-full">
        <h2 className="text-zinc-400 text-xl mb-4 uppercase tracking-widest font-mono">Hyperfocus Actif</h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-16 leading-tight">{taskTitle}</h1>

        <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-16">
          {/* Circular Progress */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-zinc-800 stroke-current"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="48"
              fill="transparent"
            ></circle>
            <circle
              className="text-emerald-500 stroke-current transition-all duration-1000 ease-linear"
              strokeWidth="4"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="48"
              fill="transparent"
              strokeDasharray={`${progress * 3.01} 999`} // 2 * pi * r = ~301
            ></circle>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-mono font-bold tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xl transition-colors"
          >
            {isActive ? 'Pause' : 'Reprendre'}
          </button>
          <button
            onClick={onComplete}
            className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl transition-colors flex items-center gap-2"
          >
            <Play size={24} />
            J'ai terminé !
          </button>
        </div>
      </div>
    </div>
  );
};
