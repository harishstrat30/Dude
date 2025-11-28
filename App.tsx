import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Workload } from './pages/Workload';
import { ProjectBoard } from './pages/ProjectBoard';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Calendar } from './pages/Calendar';
import { Milestones } from './pages/Milestones';
import { Login } from './pages/Login';
import { Tickets } from './pages/Tickets';
import { TicketDetail } from './pages/TicketDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#0B0E14] text-slate-500">Loading system...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id/board" element={<ProtectedRoute><ProjectBoard /></ProtectedRoute>} />
      <Route path="/projects/:id/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/workload" element={<ProtectedRoute><Workload /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;