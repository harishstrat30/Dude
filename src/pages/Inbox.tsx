import React, { useState } from 'react';
import { useTasks, useTickets } from '../hooks/useSupabase';
import { Inbox as InboxIcon, CheckSquare, Ticket as TicketIcon, Calendar, ArrowUpCircle, Filter, CheckCircle2, Search, ArrowUpDown } from 'lucide-react';
import { Task, Ticket } from '../types';

export const Inbox: React.FC = () => {
  const { tasks, updateTask, loading: loadingTasks } = useTasks();
  const { tickets, updateTicket, loading: loadingTickets } = useTickets();

  // Filter & Sort State
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'tickets'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest'); // newest, oldest, priority

  // Combine and Normalize Data
  const unifiedItems = [
    ...tasks.map(t => ({ ...t, type: 'task' as const, date: t.scheduled_end_date })),
    ...tickets.map(t => ({ ...t, type: 'ticket' as const, date: t.created_at }))
  ];

  const filteredAndSortedItems = unifiedItems
    .filter(item => {
        const matchesType = filterType === 'all' ? true : 
                            filterType === 'tasks' ? item.type === 'task' : 
                            item.type === 'ticket';
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    })
    .sort((a, b) => {
        if (sortBy === 'priority') {
            const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
            // Default low if missing
            const pA = priorityWeight[a.priority] || 1;
            const pB = priorityWeight[b.priority] || 1;
            return pB - pA;
        }
        if (sortBy === 'oldest') {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateA - dateB;
        }
        // Default Newest
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
    });

  const handleToggle = async (item: any) => {
    if (item.type === 'task') {
        const newStatus = item.status === 'done' ? 'todo' : 'done';
        await updateTask(item.id, { status: newStatus });
    } else {
        const newStatus = item.status === 'resolved' ? 'open' : 'resolved';
        await updateTicket(item.id, { status: newStatus });
    }
  };

  const isCompleted = (item: any) => item.status === 'done' || item.status === 'resolved';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-white mb-1">Inbox</h1>
             <p className="text-slate-400">Your centralized to-do list.</p>
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
             <button 
                onClick={() => setFilterType('all')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
             >
                All
             </button>
             <button 
                onClick={() => setFilterType('tasks')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'tasks' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
             >
                Tasks
             </button>
             <button 
                onClick={() => setFilterType('tickets')} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'tickets' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
             >
                Tickets
             </button>
          </div>
       </div>

       {/* Search and Sort Toolbar */}
       <div className="flex gap-3">
          <div className="relative flex-1">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input 
               type="text" 
               placeholder="Search inbox..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-primary" 
             />
          </div>
          <div className="relative group min-w-[140px]">
             <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="w-full h-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50 transition-colors"
             >
                 <option value="newest">Newest</option>
                 <option value="oldest">Oldest</option>
                 <option value="priority">Priority</option>
             </select>
             <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
       </div>

       <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden min-h-[500px]">
          {loadingTasks || loadingTickets ? (
              <div className="p-10 text-center text-slate-500">Loading inbox...</div>
          ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                      <InboxIcon size={32} />
                  </div>
                  <p>All caught up!</p>
              </div>
          ) : (
              <div className="divide-y divide-white/5">
                 {filteredAndSortedItems.map((item) => (
                    <div 
                        key={item.id} 
                        className={`p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-all group ${isCompleted(item) ? 'opacity-50' : ''}`}
                    >
                       <button 
                          onClick={() => handleToggle(item)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                             isCompleted(item)
                               ? item.type === 'task' ? 'bg-primary border-primary text-white' : 'bg-green-500 border-green-500 text-white'
                               : 'border-slate-600 hover:border-primary'
                          }`}
                       >
                          {isCompleted(item) && <CheckSquare size={14} />}
                       </button>

                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             {item.type === 'task' ? (
                                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Task</span>
                             ) : (
                                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Ticket</span>
                             )}
                             <span className="text-xs text-slate-500 font-mono">#{item.id}</span>
                          </div>
                          <p className={`text-sm font-medium truncate ${isCompleted(item) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                              {item.title}
                          </p>
                       </div>

                       <div className="hidden sm:flex items-center gap-4">
                          <div className={`flex items-center gap-1 text-xs ${item.priority === 'high' || item.priority === 'critical' ? 'text-orange-400' : 'text-slate-500'}`}>
                             <ArrowUpCircle size={14} />
                             <span className="capitalize">{item.priority}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 w-24 justify-end">
                             <Calendar size={14} />
                             <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : '-'}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
          )}
       </div>
    </div>
  );
};