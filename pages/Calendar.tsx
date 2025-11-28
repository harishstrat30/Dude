import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const Calendar: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white mb-1">My Calendar</h1></div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
           <button className="p-2 text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
           <span className="text-sm font-medium text-slate-200 px-4 flex items-center gap-2"><CalendarIcon size={16} /> Nov 20 - Nov 26</span>
           <button className="p-2 text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="flex-1 glass-panel rounded-2xl border border-white/5 flex items-center justify-center text-slate-500">
         Calendar View Implementation
      </div>
    </div>
  );
};