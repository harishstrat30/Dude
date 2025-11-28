import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const users = [{ id: 1, name: 'Alex Chen', role: 'Frontend Lead' }, { id: 2, name: 'Sarah Miller', role: 'Designer' }];
const getNext14Days = () => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });

export const Workload: React.FC = () => {
  const days = getNext14Days();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Team Workload</h1>
        <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
          <button className="p-2 text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
          <span className="text-sm font-medium text-slate-200 px-2">Next 14 Days</span>
          <button className="p-2 text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="flex border-b border-white/5">
            <div className="w-64 flex-shrink-0 p-4 bg-white/[0.02] border-r border-white/5"><span className="text-xs font-bold text-slate-500 uppercase">Team Member</span></div>
            <div className="flex-1 flex">{days.map((day, i) => <div key={i} className="flex-1 min-w-[3rem] p-3 text-center border-r border-white/5 bg-white/[0.02]"><div className="text-[10px] text-slate-500 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div><div className="text-sm font-bold mt-1 text-slate-300">{day.getDate()}</div></div>)}</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className="flex border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">
              <div className="w-64 flex-shrink-0 p-4 border-r border-white/5 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center"><User size={20} /></div><div><div className="text-sm font-medium text-slate-200">{user.name}</div><div className="text-xs text-slate-500">{user.role}</div></div></div>
              <div className="flex-1 flex">{days.map((_, i) => <div key={i} className="flex-1 min-w-[3rem] border-r border-white/5 p-1"><div className="w-full h-full rounded-md flex items-center justify-center text-xs font-bold bg-white/[0.02]"></div></div>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};