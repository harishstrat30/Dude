export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  organization_id: string;
  role: 'admin' | 'member' | 'client';
  title?: string;
  phone?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationPreferences;
  };
}

export interface NotificationPreferences {
  email: boolean;
  in_app: boolean;
  whatsapp: boolean;
  events: {
    task_assignment: boolean;
    ticket_updates: boolean;
    mentions: boolean;
    project_updates: boolean;
  };
}

export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  address?: string;
  timezone: string;
  working_days: number[]; // 0=Sun, 1=Mon, etc.
  working_hours: {
    start: string;
    end: string;
  };
  modules: {
    tasks: boolean;
    tickets: boolean;
    workload: boolean;
    reports: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  client_id?: string;
  start_date?: string;
  end_date?: string;
  organization_id: string;
  description?: string;
  progress?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id: string;
  milestone_id?: string;
  assignee_user_id?: string;
  organization_id: string;
  scheduled_end_date?: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  client_id?: string;
  owner_user_id?: string;
  organization_id: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  due_date: string;
  status: 'active' | 'completed' | 'overdue';
  progress: number;
  description?: string;
}

export interface WorkSchedule {
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  organization_id: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'ticket' | 'system' | 'mention';
  read: boolean;
  created_at: string;
  link?: string;
}