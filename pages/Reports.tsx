import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertTriangle, Download } from 'lucide-react';

const data = [{ name: 'Nebula', estimated: 120, actual: 145 }, { name: 'Quantum', estimated: 200, actual: 180 }];

export const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
         <div><h1 className="text-3xl font-bold text-white mb-2">Efficiency Reports</h1></div>
         <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"><Download size={18} /> Export CSV</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-2xl border border-white/5"><div className="text-3xl font-bold text-white mb-1">517h</div><div className="text-sm text-slate-400">Total Billable</div></div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5"><div className="text-3xl font-bold text-white mb-1">92%</div><div className="text-sm text-slate-400">Accuracy</div></div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5"><div className="text-3xl font-bold text-white mb-1">2</div><div className="text-sm text-slate-400">Over Budget</div></div>
      </div>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
         <h2 className="text-xl font-bold text-white mb-6">Estimated vs Actual Hours</h2>
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                  <Legend />
                  <Bar dataKey="estimated" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};