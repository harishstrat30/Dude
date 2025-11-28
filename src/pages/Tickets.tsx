import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useSupabase';
import { Plus, AlertCircle, CheckCircle2, Clock, Search, ArrowUpDown } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Ticket } from '../types';

export const Tickets: React.FC = () => {
  const { tickets, loading, createTicket, updateTicket } = useTickets();
  
  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterText, setFilterText] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest'); // newest, oldest, priority

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({ title: '', priority: 'medium', client_id: '' });

  const filteredTickets = tickets
    .filter(t => {
      const matchStatus = filterStatus === 'all' ? true : t.status === filterStatus;
      const matchText = t.title.toLowerCase().includes(filterText.toLowerCase());
      const matchPriority = filterPriority === 'all' ? true : t.priority === filterPriority;
      return matchStatus && matchText && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
         const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
         return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      // Default: Newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

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

  const toggleTicketStatus = async (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    e.preventDefault();
    // Toggle between resolved and open (simple flow)
    const newStatus = ticket.status === 'resolved' ? 'open' : 'resolved';
    await updateTicket(ticket.id, { status: newStatus });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title) return;
    await createTicket({ ...newTicket, status: 'open' });
    setNewTicket({ title: '', priority: 'medium', client_id: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Support Tickets</h1>
          <p className="text-slate-400">Manage client requests.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-glow transition-all">
            <Plus size={18} /> New Ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         {/* Status Tabs */}
         <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['all', 'open', 'in_progress', 'resolved'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filterStatus === s ? 'bg-slate-800 text-white border-slate-600' : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5'}`}>{s.replace('_', ' ')}</button>
            ))}
         </div>
         
         {/* Filters */}
         <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-primary" 
                />
             </div>
             <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50"
             >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
             </select>
             <div className="relative group">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-300 outline-none focus:border-primary cursor-pointer hover:bg-slate-800/50"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priority">Priority</option>
                </select>
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             </div>
         </div>
      </div>

      <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-xs text-slate-500 uppercase">
              <th className="px-6 py-4 font-bold w-12"></th>
              <th className="px-6 py-4 font-bold w-24">ID</th>
              <th className="px-6 py-4 font-bold">Subject</th>
              <th className="px-6 py-4 font-bold">Client</th>
              <th className="px-6 py-4 font-bold">Priority</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading tickets...</td></tr> : filteredTickets.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-slate-500">No tickets found.</td></tr> : filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-white/[0.02] group transition-colors cursor-pointer">
                <td className="pl-6 py-4">
                    <button 
                        onClick={(e) => toggleTicketStatus(e, ticket)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${ticket.status === 'resolved' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-600 hover:border-green-500'}`}
                    >
                        {ticket.status === 'resolved' && <CheckCircle2 size={12} />}
                    </button>
                </td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Support Ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Subject</label>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g., Login Error"
              value={newTicket.title}
              onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Client ID</label>
                <input 
                    type="text" 
                    placeholder="e.g., Client-A"
                    value={newTicket.client_id}
                    onChange={(e) => setNewTicket({...newTicket, client_id: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Priority</label>
                <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-primary outline-none"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-medium shadow-glow">Create Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};