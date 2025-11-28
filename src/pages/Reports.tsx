import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertTriangle, Download, Calendar, Filter, X } from 'lucide-react';

// Mock data with dates for filtering logic
const RAW_REPORT_DATA = [
  { id: 1, name: 'Nebula Dashboard', date: '2024-10-15', estimated: 40, actual: 35, billable: 35 },
  { id: 1, name: 'Nebula Dashboard', date: '2024-11-01', estimated: 10, actual: 12, billable: 12 },
  { id: 1, name: 'Nebula Dashboard', date: '2024-11-05', estimated: 8, actual: 8, billable: 8 },
  { id: 1, name: 'Nebula Dashboard', date: '2024-11-10', estimated: 15, actual: 20, billable: 20 },
  { id: 2, name: 'Quantum App', date: '2024-11-02', estimated: 20, actual: 18, billable: 18 },
  { id: 2, name: 'Quantum App', date: '2024-11-12', estimated: 25, actual: 30, billable: 30 },
  { id: 3, name: 'Starlight API', date: '2024-10-25', estimated: 40, actual: 35, billable: 35 },
  { id: 3, name: 'Starlight API', date: '2024-11-15', estimated: 30, actual: 30, billable: 30 },
  { id: 2, name: 'Quantum App', date: '2024-11-20', estimated: 10, actual: 15, billable: 15 },
  { id: 4, name: 'Internal Audit', date: '2024-11-22', estimated: 50, actual: 45, billable: 45 },
];

export const Reports: React.FC = () => {
  // Default to November 2024 for demo purposes
  const [dateRange, setDateRange] = useState({ start: '2024-11-01', end: '2024-11-30' });

  // Filter raw data based on selected date range
  const filteredData = useMemo(() => {
    return RAW_REPORT_DATA.filter(item => {
      if (!dateRange.start && !dateRange.end) return true;
      const itemDate = new Date(item.date);
      const start = dateRange.start ? new Date(dateRange.start) : new Date('2000-01-01');
      // Set end date to end of day to be inclusive
      const end = dateRange.end ? new Date(dateRange.end) : new Date('2099-12-31');
      end.setHours(23, 59, 59, 999);
      
      return itemDate >= start && itemDate <= end;
    });
  }, [dateRange]);

  // Aggregate data for the chart (grouped by project)
  const chartData = useMemo(() => {
    const acc = filteredData.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = { name: curr.name, estimated: 0, actual: 0 };
      }
      acc[curr.name].estimated += curr.estimated;
      acc[curr.name].actual += curr.actual;
      return acc;
    }, {} as Record<string, { name: string; estimated: number; actual: number }>);
    return Object.values(acc);
  }, [filteredData]);

  // Calculate High-level Stats
  const totalBillable = filteredData.reduce((sum, item) => sum + item.billable, 0);
  const totalEstimated = filteredData.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = filteredData.reduce((sum, item) => sum + item.actual, 0);
  
  // Accuracy: Simple ratio of Estimated vs Actual. 
  // If Actual > Estimated, accuracy drops. If Actual < Estimated, efficiency is high (capped at 100% for this metric or shown as raw %).
  // Let's use simple deviation: (Estimated / Actual) * 100
  const accuracy = totalActual > 0 ? Math.round((totalEstimated / totalActual) * 100) : 0;

  // Projects Over Budget count (from the aggregated chart data)
  const overBudgetCount = chartData.filter(p => p.actual > p.estimated).length;

  const handleReset = () => {
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white mb-2">Efficiency Reports</h1>
           <p className="text-slate-400">Track project performance and resource utilization.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 px-3 border-r border-slate-800">
                <Calendar size={14} className="text-slate-500" />
                <input 
                  type="date" 
                  className="bg-transparent text-sm text-slate-200 outline-none [&::-webkit-calendar-picker-indicator]:invert"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 px-3">
                <span className="text-slate-600 text-xs">to</span>
                <input 
                  type="date" 
                  className="bg-transparent text-sm text-slate-200 outline-none [&::-webkit-calendar-picker-indicator]:invert"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
            
            {(dateRange.start || dateRange.end) && (
              <button onClick={handleReset} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors">
                <X size={16} />
              </button>
            )}

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors shadow-glow">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors">
              <Download size={16} /> Export
            </button>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Clock size={64} className="text-primary" /></div>
            <div className="text-3xl font-bold text-white mb-1">{totalBillable}h</div>
            <div className="text-sm text-slate-400">Total Billable Hours</div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={64} className="text-green-500" /></div>
            <div className="text-3xl font-bold text-white mb-1">{accuracy}%</div>
            <div className="text-sm text-slate-400">Estimate Accuracy</div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><AlertTriangle size={64} className="text-orange-500" /></div>
            <div className="text-3xl font-bold text-white mb-1">{overBudgetCount}</div>
            <div className="text-sm text-slate-400">Projects Over Budget</div>
         </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/5">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Estimated vs Actual Hours</h2>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
              <option value="all">All Projects</option>
              {chartData.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
         </div>
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="estimated" name="Estimated Hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="actual" name="Actual Hours" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};