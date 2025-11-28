import React from 'react';
import { Briefcase, CheckCircle2, AlertCircle, TrendingUp, Clock, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 6 },
  { name: 'Thu', tasks: 8 },
  { name: 'Fri', tasks: 5 },
  { name: 'Sat', tasks: 2 },
  { name: 'Sun', tasks: 1 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <button className="text-slate-500 hover:text-white"><MoreHorizontal size={18} /></button>
    </div>
    <div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{change > 0 ? '+' : ''}{change}%</span>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value="12" change={8.2} icon={Briefcase} color="bg-primary text-primary" />
        <StatCard title="Tasks Completed" value="48" change={12.5} icon={CheckCircle2} color="bg-green-500 text-green-500" />
        <StatCard title="Pending Tickets" value="5" change={-2.4} icon={AlertCircle} color="bg-orange-500 text-orange-500" />
        <StatCard title="Hours Logged" value="32.5" change={5.1} icon={Clock} color="bg-accent text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Productivity</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><CheckCircle2 size={20} className="text-green-500" /> My Tasks</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className={`mt-1 w-4 h-4 rounded-full border-2 ${i === 1 ? 'border-primary bg-primary/20' : 'border-slate-600'} group-hover:border-primary transition-colors`} />
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${i === 1 ? 'text-slate-400 line-through' : 'text-slate-200'} group-hover:text-primary transition-colors`}>Update API documentation</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">High Priority • Due Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};