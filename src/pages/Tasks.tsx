import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Filter, ChevronDown, Calendar, ArrowUpCircle, Search, Plus, ArrowUpDown } from 'lucide-react';
import { useTasks, useProjects } from '../hooks/useSupabase';
import { Modal } from '../components/ui/Modal';

export const Tasks: React.FC = () => {
  const { tasks, loading, updateTask, createTask } = useTasks();
  const { projects } = useProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', priority: 'medium', project_id: '', scheduled_end_date: '' });

  // Filter & Sort State
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('due_date'); // due_date, priority

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesText = task.title.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus = filterStatus === 'all' ? true : task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' ? true : task.priority === filterPriority;
      const matchesDate = filterDate ? task.scheduled_end_date === filterDate : true;
      return matchesText && matchesStatus && matchesPriority && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      // Default: Due Date (Ascending - urgent first)
      // Treat no-date as far future
      const dateA = new Date(a.scheduled_end_date || '9999-12-31').getTime();
      const dateB = new Date(b.scheduled_end_date || '9999-12-31').getTime();
      return dateA - dateB;
    });

  const toggleTaskStatus = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask(task.id, { status: newStatus });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    await createTask({
        ...newTask,
        status: 'todo',
        organization_id: 'org_1'
    });
    setNewTask({ title: '', priority: 'medium', project_id: '', scheduled_end_date: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedTask ? 'mr-[400px]' : ''}`}>
        <div className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Tasks</h1>
            <p className="text-slate-400 text-sm">Manage your daily workload.</p>
          </div>
          <button 
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden w-full p-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-glow transition-all flex items-center justify-center gap-2"
             >
                <Plus size={18} /> New Task
          </button>
        </div>
        
        {/* Filters Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-3 items-center bg-surface/50 p-2 rounded-2xl border border-white/5">
             <div className="relative flex-1 w-full sm:min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter tasks..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-primary" 
                />
             </div>
             
             <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50"
                >
                    <option value="all">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                
                <select 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50"
                >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <div className="relative">
                    <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                 <div className="h-6 w-px bg-white/10 mx-1"></div>

                 <div className="relative group">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50 transition-colors"
                    >
                        <option value="due_date">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                 </div>
             </div>

             <button 
                onClick={() => setIsModalOpen(true)}
                className="hidden lg:flex p-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-glow transition-all items-center gap-2 px-3 ml-auto"
             >
                <Plus size={18} /> New Task
             </button>
        </div>

        <div className="glass-panel border border-white/5 rounded-2xl flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center text-xs font-semibold text-slate-500 uppercase">
             <div className="w-10"></div>
             <div className="flex-1">Task Name</div>
             <div className="w-32 hidden md:block">Project</div>
             <div className="w-24">Priority</div>
             <div className="w-24">Status</div>
             <div className="w-24 hidden md:block">Due</div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
             {loading ? <div className="p-4 text-center text-slate-500">Loading tasks...</div> : filteredAndSortedTasks.length === 0 ? <div className="p-8 text-center text-slate-500">No tasks found.</div> : filteredAndSortedTasks.map((task) => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all border ${selectedTask?.id === task.id ? 'bg-primary/10 border-primary/20 shadow-glow' : 'hover:bg-white/5 border-transparent hover:border-white/5'}`}>
                   <div className="w-10 flex items-center justify-center" onClick={(e) => toggleTaskStatus(e, task)}>
                      <button className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-primary border-primary text-white' : 'border-slate-600 hover:border-primary'}`}>
                         {task.status === 'done' && <CheckSquare size={12} />}
                      </button>
                   </div>
                   <div className="flex-1 min-w-0 pr-4"><p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p></div>
                   <div className="w-32 hidden md:block text-xs text-slate-400 truncate">
                      {projects.find(p => p.id === task.project_id)?.name || '-'}
                   </div>
                   <div className="w-24">
                      <span className={`text-xs flex items-center gap-1 ${task.priority === 'high' ? 'text-orange-400' : task.priority === 'medium' ? 'text-blue-400' : 'text-slate-400'}`}><ArrowUpCircle size={12} className={task.priority === 'medium' ? 'rotate-90' : task.priority === 'low' ? 'rotate-180' : ''} /> {task.priority}</span>
                   </div>
                   <div className="w-24"><span className={`text-[10px] px-2 py-0.5 rounded-full border border-slate-700 uppercase`}>{task.status.replace('_', ' ')}</span></div>
                   <div className="w-24 hidden md:flex items-center gap-1 text-xs text-slate-500"><Calendar size={12} /> {task.scheduled_end_date ? new Date(task.scheduled_end_date).toLocaleDateString() : '-'}</div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Task Details Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-[400px] glass-panel border-l border-white/5 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${selectedTask ? 'translate-x-0' : 'translate-x-full'}`}>
         {selectedTask && (
           <>
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
                 <div className="flex items-center gap-2 text-xs text-slate-500"><span className="px-1.5 py-0.5 rounded border border-slate-700">D-{selectedTask.id}</span></div>
                 <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white"><CheckSquare size={20} className="rotate-90" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 <input 
                    type="text" 
                    value={selectedTask.title} 
                    onChange={(e) => {
                        const updated = { ...selectedTask, title: e.target.value };
                        setSelectedTask(updated);
                        updateTask(selectedTask.id, { title: e.target.value });
                    }}
                    className="bg-transparent text-xl font-bold text-white w-full outline-none placeholder:text-slate-600 mb-4" 
                 />
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-semibold">Status</label>
                        <select 
                            value={selectedTask.status}
                            onChange={(e) => {
                                const newS = e.target.value as any;
                                setSelectedTask({...selectedTask, status: newS});
                                updateTask(selectedTask.id, {status: newS});
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300 outline-none"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 font-semibold">Priority</label>
                         <select 
                            value={selectedTask.priority}
                            onChange={(e) => {
                                const newP = e.target.value as any;
                                setSelectedTask({...selectedTask, priority: newP});
                                updateTask(selectedTask.id, {priority: newP});
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300 outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-semibold">Description</label>
                    <textarea 
                        value={selectedTask.description || ''}
                        onChange={(e) => {
                             setSelectedTask({...selectedTask, description: e.target.value});
                        }}
                        onBlur={() => updateTask(selectedTask.id, { description: selectedTask.description })}
                        className="w-full min-h-[120px] p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-300 outline-none focus:border-primary"
                    />
                 </div>
              </div>
           </>
         )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Task Title</label>
            <input 
              autoFocus
              type="text" 
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Project</label>
                <select 
                    value={newTask.project_id}
                    onChange={(e) => setNewTask({...newTask, project_id: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-primary outline-none"
                >
                    <option value="">No Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Priority</label>
                <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-primary outline-none"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Due Date</label>
            <input 
              type="date" 
              value={newTask.scheduled_end_date}
              onChange={(e) => setNewTask({...newTask, scheduled_end_date: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-medium shadow-glow">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};