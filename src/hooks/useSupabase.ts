import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Project, Task, Ticket } from '../types';
import { mockProjects, mockTasks, mockTickets } from '../lib/mockData';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('name');
      if (error) throw error;
      setProjects(data as Project[]);
    } catch (err) {
      console.warn('Using mock projects');
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (project: Partial<Project>) => {
    try {
      const newProject = { 
        ...project, 
        organization_id: 'org_1', // Default for demo
        progress: 0,
        status: 'planning'
      };
      
      const { data, error } = await supabase.from('projects').insert(newProject).select().single();
      
      if (error) throw error;
      setProjects(prev => [...prev, data as Project]);
      return data;
    } catch (err) {
      console.warn('Mock create project');
      const mock = { ...project, id: Math.random().toString(), progress: 0, status: 'planning' } as Project;
      setProjects(prev => [...prev, mock]);
      return mock;
    }
  };

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return { projects, loading, createProject, refresh: fetchProjects };
}

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*');
      if (projectId) query = query.eq('project_id', projectId);
      
      const { data, error } = await query;
      if (error) throw error;
      setTasks(data as Task[]);
    } catch (err) {
      console.warn('Using mock tasks');
      setTasks(projectId ? mockTasks.filter(t => t.project_id === projectId) : mockTasks);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createTask = async (task: Partial<Task>) => {
    try {
      const newTask = { ...task, organization_id: 'org_1' };
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
      if (error) throw error;
      setTasks(prev => [...prev, data as Task]);
      return data;
    } catch (err) {
       const mock = { ...task, id: Math.random().toString(), organization_id: 'org_1' } as Task;
       setTasks(prev => [...prev, mock]);
       return mock;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Mock update task');
    }
  };

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return { tasks, loading, setTasks, createTask, updateTask, refresh: fetchTasks };
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('tickets').select('*');
      if (error) throw error;
      setTickets(data as Ticket[]);
    } catch (err) {
      console.warn('Using mock tickets');
      setTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = async (ticket: Partial<Ticket>) => {
    try {
      const newTicket = { ...ticket, organization_id: 'org_1', created_at: new Date().toISOString() };
      const { data, error } = await supabase.from('tickets').insert(newTicket).select().single();
      if (error) throw error;
      setTickets(prev => [...prev, data as Ticket]);
      return data;
    } catch (err) {
      const mock = { ...ticket, id: Math.random().toString(), organization_id: 'org_1', created_at: new Date().toISOString() } as Ticket;
      setTickets(prev => [...prev, mock]);
      return mock;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      const { error } = await supabase.from('tickets').update(updates).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Mock update ticket');
    }
  };

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  return { tickets, loading, createTicket, updateTicket, refresh: fetchTickets };
}