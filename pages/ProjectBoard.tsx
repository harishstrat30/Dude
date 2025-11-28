import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { useTasks } from '../hooks/useSupabase';

const SortableTask: React.FC<{ task: Task }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-slate-900/40 border border-white/5 p-4 rounded-xl mb-3 hover:border-primary/50 hover:shadow-glow transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-2">
         <span className={`text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400`}>{task.priority.toUpperCase()}</span>
         <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={14} /></button>
      </div>
      <p className="text-sm font-medium text-slate-200 mb-3">{task.title}</p>
      <div className="flex items-center justify-between mt-2"><div className="w-6 h-6 rounded-full bg-slate-700 text-[10px] flex items-center justify-center text-white">AC</div><span className="text-[10px] text-slate-500">D-{task.id}</span></div>
    </div>
  );
};

const Column = ({ id, title, tasks }: { id: string, title: string, tasks: Task[] }) => (
  <div className="glass-panel w-80 flex-shrink-0 flex flex-col max-h-full rounded-2xl border border-white/5 overflow-hidden">
    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
      <h3 className="font-semibold text-sm text-slate-200 uppercase tracking-wide">{title}</h3>
      <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
    </div>
    <div className="p-3 flex-1 overflow-y-auto">
       <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <SortableTask key={task.id} task={task} />)}
       </SortableContext>
    </div>
  </div>
);

export const ProjectBoard: React.FC = () => {
  const { id } = useParams();
  const { tasks, setTasks } = useTasks(id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;
    if (['todo', 'in_progress', 'done'].includes(overId)) {
       setTasks(tasks.map(t => t.id === activeId ? { ...t, status: overId as any } : t));
    }
    setActiveId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative">
       <div className="mb-6 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-white mb-1">Project Board</h1></div>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus size={18} /> Create Task</button>
       </div>
       <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
         <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
            <Column id="todo" title="To Do" tasks={tasks.filter(t => t.status === 'todo')} />
            <Column id="in_progress" title="In Progress" tasks={tasks.filter(t => t.status === 'in_progress')} />
            <Column id="done" title="Done" tasks={tasks.filter(t => t.status === 'done')} />
         </div>
         <DragOverlay>{activeId ? <div className="opacity-80 rotate-2"><SortableTask task={tasks.find(t => t.id === activeId)!} /></div> : null}</DragOverlay>
       </DndContext>
    </div>
  );
};