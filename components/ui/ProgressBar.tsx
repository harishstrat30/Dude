import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showLabel = false,
  colorClass = 'bg-primary',
  size = 'md'
}) => {
  const heightClass = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-1.5';
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-400">Progress</span>
          <span className="text-xs font-bold text-slate-200">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)] ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};