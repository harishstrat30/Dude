import { Project, Task, Ticket, User } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'alex@dude.os',
  full_name: 'Alex Chen',
  role: 'admin',
  organization_id: 'org_1',
  title: 'Senior Frontend Engineer'
};

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