import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useSupabase';
import { Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const Tickets: React.FC = () => {
  const { tickets, loading } = useTickets();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(t => statusFilter === 'all' ? true : t.status === statusFilter);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'resolved': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'open': return <AlertCircle size={16} className="text-primary" />;
      default: return <Clock size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Support Tickets</h1>
          <p className="text-slate-400">Manage client requests.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus size={18} /> New Ticket</button>
      </div>

      <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2">
         {['all', 'open', 'in_progress', 'resolved'].map((s) => (
           <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${statusFilter === s ? 'bg-slate-800 text-white border-slate-600' : 'bg-transparent text-slate-500 border-transparent'}`}>{s.replace('_', ' ')}</button>
         ))}
      </div>

      <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-xs text-slate-500 uppercase">
              <th className="px-6 py-4 font-bold w-24">ID</th>
              <th className="px-6 py-4 font-bold">Subject</th>
              <th className="px-6 py-4 font-bold">Client</th>
              <th className="px-6 py-4 font-bold">Priority</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading tickets...</td></tr> : filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-white/[0.02] group transition-colors cursor-pointer">
                <td className="px-6 py-4 text-xs font-mono text-slate-500"><span className="group-hover:text-primary">{ticket.id}</span></td>
                <td className="px-6 py-4"><Link to={`/tickets/${ticket.id}`} className="text-sm font-medium text-slate-200 hover:text-white block">{ticket.title}</Link></td>
                <td className="px-6 py-4 text-sm text-slate-400">{ticket.client_id || 'Internal'}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></td>
                <td className="px-6 py-4"><div className="flex items-center gap-2 text-sm text-slate-300 capitalize">{getStatusIcon(ticket.status)} {ticket.status.replace('_', ' ')}</div></td>
                <td className="px-6 py-4 text-right text-xs text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};