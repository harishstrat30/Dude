import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useTickets } from '../hooks/useSupabase';

export const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const { tickets } = useTickets();
  const ticket = tickets.find(t => t.id === id) || tickets[0]; 

  if (!ticket) return <div className="p-10 text-slate-500">Ticket not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white mb-4"><ArrowLeft size={16} /> Back to Tickets</Link>
        <div className="flex items-start justify-between">
           <div>
              <div className="flex items-center gap-3 mb-2"><span className="text-sm font-mono text-slate-500">#{ticket.id}</span><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-current ${ticket.status === 'open' ? 'text-primary' : 'text-green-500'}`}>{ticket.status.replace('_', ' ')}</span></div>
              <h1 className="text-3xl font-bold text-white mb-2">{ticket.title}</h1>
           </div>
           <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">Close Ticket</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                  <div><div className="text-sm font-bold text-white">Client A</div><div className="text-xs text-slate-500">opened on {new Date(ticket.created_at).toLocaleDateString()}</div></div>
               </div>
               <p className="text-slate-300 text-sm leading-relaxed">Sample ticket content description would go here based on the issue reported.</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/50">
               <textarea className="w-full bg-transparent text-slate-200 text-sm outline-none min-h-[100px] placeholder:text-slate-600" placeholder="Type your reply here..."></textarea>
               <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Paperclip size={18} /></button>
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium">Send Reply</button>
               </div>
            </div>
         </div>
         <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
               <h3 className="text-xs font-bold text-slate-500 uppercase">Properties</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-xs text-slate-500 mb-1">Priority</div><div className="text-sm text-orange-400 font-medium capitalize">{ticket.priority}</div></div>
                  <div><div className="text-xs text-slate-500 mb-1">Assignee</div><div className="text-sm text-slate-200">Alex Chen</div></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};