import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Project, Task, Ticket } from '../types';
import { mockProjects, mockTasks, mockTickets } from '../lib/mockData';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('name');
        if (error || !data || data.length === 0) throw error;
        setProjects(data as Project[]);
      } catch (err) {
        console.warn('Falling back to mock projects', err);
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return { projects, loading };
}

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        let query = supabase.from('tasks').select('*');
        if (projectId) query = query.eq('project_id', projectId);
        const { data, error } = await query;
        if (error || !data || data.length === 0) throw error;
        setTasks(data as Task[]);
      } catch (err) {
        setTasks(projectId ? mockTasks.filter(t => t.project_id === projectId) : mockTasks);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [projectId]);

  return { tasks, loading, setTasks };
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const { data, error } = await supabase.from('tickets').select('*');
        if (error || !data || data.length === 0) throw error;
        setTickets(data as Ticket[]);
      } catch (err) {
        console.warn('Falling back to mock tickets');
        setTickets(mockTickets);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return { tickets, loading };
}