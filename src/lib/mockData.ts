import { Project, Task, Ticket, User, Organization, AppNotification } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'alex@dude.os',
  full_name: 'Alex Chen',
  role: 'admin',
  organization_id: 'org_1',
  title: 'Senior Frontend Engineer',
  phone: '+1 (555) 123-4567',
  preferences: {
    theme: 'dark',
    notifications: {
      email: true,
      in_app: true,
      whatsapp: false,
      events: {
        task_assignment: true,
        ticket_updates: true,
        mentions: true,
        project_updates: false
      }
    }
  }
};

export const mockOrganization: Organization = {
  id: 'org_1',
  name: 'Nebula Industries',
  address: '123 Innovation Dr, Tech City, CA',
  timezone: 'America/Los_Angeles',
  working_days: [1, 2, 3, 4, 5],
  working_hours: { start: '09:00', end: '18:00' },
  modules: {
    tasks: true,
    tickets: true,
    workload: true,
    reports: true
  }
};

export const mockNotifications: AppNotification[] = [
  { id: 'n1', title: 'New Task Assigned', message: 'You have been assigned to "Design System Audit"', type: 'task', read: false, created_at: '2024-11-24T09:30:00Z', link: '/tasks' },
  { id: 'n2', title: 'Ticket Update', message: 'Client A commented on ticket #T-101', type: 'ticket', read: false, created_at: '2024-11-23T14:15:00Z', link: '/tickets/T-101' },
  { id: 'n3', title: 'System Alert', message: 'Scheduled maintenance tonight at 2 AM', type: 'system', read: true, created_at: '2024-11-22T10:00:00Z' },
];

export const mockProjects: Project[] = [
  { id: '1', name: 'Nebula Dashboard Redesign', status: 'active', organization_id: 'org_1', description: 'Complete overhaul of the main client dashboard.', progress: 65, start_date: '2024-11-01' },
  { id: '2', name: 'Quantum Mobile App', status: 'planning', organization_id: 'org_1', description: 'Native iOS and Android application.', progress: 15 },
  { id: '3', name: 'Starlight API Integration', status: 'completed', organization_id: 'org_1', description: 'Logistics provider integration.', progress: 100 },
];

export const mockTasks: Task[] = [
  { id: '101', title: 'Design system audit', status: 'in_progress', priority: 'high', project_id: '1', organization_id: 'org_1', assignee_user_id: '1' },
  { id: '102', title: 'Refactor auth middleware', status: 'todo', priority: 'medium', project_id: '1', organization_id: 'org_1' },
  { id: '103', title: 'Client presentation slides', status: 'done', priority: 'high', project_id: '1', organization_id: 'org_1' },
  { id: '104', title: 'Fix navigation z-index bug', status: 'todo', priority: 'low', project_id: '1', organization_id: 'org_1' },
];

export const mockTickets: Ticket[] = [
  { id: 'T-101', title: 'Login page throwing 500 error', status: 'open', priority: 'critical', organization_id: 'org_1', client_id: 'client_A', created_at: '2024-11-20T10:00:00Z', owner_user_id: '1' },
  { id: 'T-102', title: 'Feature request: Dark mode export', status: 'in_progress', priority: 'medium', organization_id: 'org_1', client_id: 'client_B', created_at: '2024-11-21T14:30:00Z' },
  { id: 'T-103', title: 'Billing invoice incorrect', status: 'resolved', priority: 'high', organization_id: 'org_1', client_id: 'client_A', created_at: '2024-11-18T09:15:00Z' },
];