import React, { useState } from 'react';
import { Plus, Calendar, Users, MoreVertical, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProjects } from '../hooks/useSupabase';

export const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'planning': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Initializing project core...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400">Manage your initiatives.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}><ListIcon size={18} /></button>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium"><Plus size={18} /> New Project</button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
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
              {projects.map((project) => (
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
    </div>
  );
};