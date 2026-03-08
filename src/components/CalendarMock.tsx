import React from 'react';
import { CalendarEvent } from '../types';
import { Calendar } from 'lucide-react';

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Daily Standup', startTime: '10:00', endTime: '10:30', color: 'bg-blue-500' },
  { id: '2', title: 'Deep Work Block', startTime: '11:00', endTime: '13:00', color: 'bg-purple-500' },
  { id: '3', title: 'Client Call', startTime: '15:00', endTime: '16:00', color: 'bg-emerald-500' },
];

export const CalendarMock: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-6 text-zinc-400">
        <Calendar size={20} />
        <h2 className="font-mono uppercase tracking-widest text-sm font-bold">Aujourd'hui (GCal)</h2>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[27px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
        {MOCK_EVENTS.map((event) => (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-zinc-950 bg-zinc-900 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-xs font-mono font-bold">{event.startTime}</span>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 shadow">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-zinc-200">{event.title}</div>
              </div>
              <div className="text-zinc-500 text-sm font-mono">{event.startTime} - {event.endTime}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors">
          Connecter Google Calendar
        </button>
      </div>
    </div>
  );
};
