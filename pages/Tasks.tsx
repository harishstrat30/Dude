import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Filter, ChevronDown, Calendar, ArrowUpCircle, Search } from 'lucide-react';
import { useTasks } from '../hooks/useSupabase';

export const Tasks: React.FC = () => {
  const { tasks, loading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedTask ? 'mr-[400px]' : ''}`}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Tasks</h1>
            <p className="text-slate-400 text-sm">Everything assigned to you.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Filter..." className="bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none w-64" />
             </div>
             <button className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-xl"><Filter size={18} /></button>
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-2xl flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center text-xs font-semibold text-slate-500 uppercase">
             <div className="w-8"></div>
             <div className="flex-1">Task Name</div>
             <div className="w-32 hidden md:block">Project</div>
             <div className="w-24">Priority</div>
             <div className="w-24">Status</div>
             <div className="w-24 hidden md:block">Due</div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
             {loading ? <div className="p-4 text-center text-slate-500">Loading tasks...</div> : tasks.map((task) => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all border ${selectedTask?.id === task.id ? 'bg-primary/10 border-primary/20 shadow-glow' : 'hover:bg-white/5 border-transparent hover:border-white/5'}`}>
                   <div className="w-8 flex items-center justify-center">
                      <button className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-primary border-primary text-white' : 'border-slate-600 hover:border-primary'}`}>
                         {task.status === 'done' && <CheckSquare size={12} />}
                      </button>
                   </div>
                   <div className="flex-1 min-w-0 pr-4"><p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p></div>
                   <div className="w-32 hidden md:block text-xs text-slate-400 truncate">Project #{task.project_id}</div>
                   <div className="w-24">
                      <span className={`text-xs flex items-center gap-1 ${task.priority === 'high' ? 'text-orange-400' : task.priority === 'medium' ? 'text-blue-400' : 'text-slate-400'}`}><ArrowUpCircle size={12} className={task.priority === 'medium' ? 'rotate-90' : task.priority === 'low' ? 'rotate-180' : ''} /> {task.priority}</span>
                   </div>
                   <div className="w-24"><span className={`text-[10px] px-2 py-0.5 rounded-full border border-slate-700`}>{task.status.replace('_', ' ')}</span></div>
                   <div className="w-24 hidden md:flex items-center gap-1 text-xs text-slate-500"><Calendar size={12} /> {task.scheduled_end_date ? new Date(task.scheduled_end_date).toLocaleDateString() : '-'}</div>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className={`fixed inset-y-0 right-0 w-[400px] glass-panel border-l border-white/5 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${selectedTask ? 'translate-x-0' : 'translate-x-full'}`}>
         {selectedTask && (
           <>
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
                 <div className="flex items-center gap-2 text-xs text-slate-500"><span className="px-1.5 py-0.5 rounded border border-slate-700">D-{selectedTask.id}</span></div>
                 <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white"><CheckSquare size={20} className="rotate-90" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 <input type="text" defaultValue={selectedTask.title} className="bg-transparent text-xl font-bold text-white w-full outline-none placeholder:text-slate-600 mb-4" />
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1"><label className="text-xs text-slate-500 font-semibold">Status</label><button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300"><span>{selectedTask.status.replace('_', ' ')}</span><ChevronDown size={14} /></button></div>
                    <div className="space-y-1"><label className="text-xs text-slate-500 font-semibold">Priority</label><button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300"><span>{selectedTask.priority}</span><ChevronDown size={14} /></button></div>
                 </div>
                 <div className="space-y-1"><label className="text-xs text-slate-500 font-semibold">Description</label><div className="min-h-[120px] p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-300"><p>{selectedTask.description || 'No description.'}</p></div></div>
              </div>
           </>
         )}
      </div>
    </div>
  );
};