import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, CheckSquare, Ticket, BarChart3, PieChart, Settings, Search, Bell, Menu, User, LogOut, CalendarDays } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem: React.FC<{ to: string, icon: any, label: string, active: boolean }> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
    }`}
  >
    <Icon size={20} className={active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: Briefcase, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/workload', icon: BarChart3, label: 'Workload' },
    { to: '/reports', icon: PieChart, label: 'Reports' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-200 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800 transition-transform duration-300 lg:transform-none flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <span className="font-bold text-white text-lg">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">DUDE<span className="text-primary">.OS</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
            />
          ))}
          <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
               <User size={18} className="text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={() => signOut()}>
                <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800 w-64 lg:w-96">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Search tasks, projects, tickets..." className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-background"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8 relative">
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-gradient-to-tl from-accent/5 via-transparent to-transparent pointer-events-none opacity-50" />
            <div className="relative z-10 max-w-7xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};