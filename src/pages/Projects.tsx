import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Calendar, Users, MoreVertical, LayoutGrid, List as ListIcon, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProjects } from '../hooks/useSupabase';
import { Modal } from '../components/ui/Modal';

export const Projects: React.FC = () => {
  const { projects, loading, createProject } = useProjects();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', start_date: '' });

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, date, progress

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    await createProject(newProject);
    setNewProject({ name: '', description: '', start_date: '' });
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'planning': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
      }
      if (sortBy === 'progress') {
        return (b.progress || 0) - (a.progress || 0);
      }
      return a.name.localeCompare(b.name);
    });

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Initializing project core...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400">Manage your initiatives.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-glow"><Plus size={18} /> New Project</button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface/50 p-2 rounded-2xl border border-white/5">
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-primary" 
                />
            </div>
            <div className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}><ListIcon size={18} /></button>
            </div>
         </div>

         <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <div className="relative group">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                </select>
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            <div className="relative group">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-900/50 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                    <option value="name">Name (A-Z)</option>
                    <option value="date">Start Date</option>
                    <option value="progress">Progress</option>
                </select>
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
         </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 text-slate-600 mb-4">
                <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No projects found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link to={`/projects/${project.id}/board`} key={project.id} className="group block">
              <div className="glass-panel h-full p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex flex-col relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>{project.status.replace('_', ' ').toUpperCase()}</span>
                  <button className="text-slate-500 hover:text-white"><MoreVertical size={18} /></button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                <div className="mt-auto space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                       <span className="text-slate-500">Progress</span>
                       <span className="text-slate-300 font-semibold">{project.progress}%</span>
                    </div>
                    <ProgressBar progress={project.progress || 0} size="sm" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} /> <span>{project.start_date || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs"><Users size={14}/> 3</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5">
                  <td className="px-6 py-4"><Link to={`/projects/${project.id}/board`} className="font-medium text-white hover:text-primary">{project.name}</Link></td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>{project.status}</span></td>
                  <td className="px-6 py-4 w-48"><ProgressBar progress={project.progress || 0} size="sm" /></td>
                  <td className="px-6 py-4 text-right"><MoreVertical size={16} className="ml-auto text-slate-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Project Name</label>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g., Website Redesign"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <textarea 
              placeholder="Project goals and scope..."
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none min-h-[100px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Start Date</label>
            <input 
              type="date" 
              value={newProject.start_date}
              onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-medium shadow-glow">Create Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};