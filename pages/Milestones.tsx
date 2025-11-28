import React from 'react';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Calendar } from 'lucide-react';

export const Milestones: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center"><h1 className="text-3xl font-bold text-white mb-2">Milestones</h1><button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium">+ New Milestone</button></div>
       <div className="glass-panel p-6 rounded-2xl border border-white/5"><h3 className="text-xl font-bold text-white mb-2">Design Phase</h3><ProgressBar progress={100} colorClass="bg-green-500" /></div>
    </div>
  );
};