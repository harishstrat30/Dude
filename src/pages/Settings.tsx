import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockOrganization } from '../lib/mockData';
import { User, Lock, Bell, Globe, Building2, Users, Shield, Smartphone, ChevronRight, ToggleLeft, ToggleRight, Save } from 'lucide-react';

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button onClick={onChange} className={`transition-colors duration-200 ${checked ? 'text-primary' : 'text-slate-600'}`}>
    {checked ? <ToggleRight size={40} className="fill-current" /> : <ToggleLeft size={40} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p className="text-slate-400 text-sm mt-1">{description}</p>
  </div>
);

const InputGroup: React.FC<{ label: string; type?: string; defaultValue?: string; disabled?: boolean }> = ({ label, type = 'text', defaultValue, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    <input 
      type={type} 
      defaultValue={defaultValue} 
      disabled={disabled}
      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary focus:shadow-glow outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
    />
  </div>
);

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orgData, setOrgData] = useState(mockOrganization);
  
  const isSuperAdmin = user?.role === 'admin'; // Treating 'admin' as super admin for this demo
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User, allowed: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, allowed: true },
    { id: 'security', label: 'Security', icon: Lock, allowed: true },
    { type: 'separator' },
    { id: 'organization', label: 'Organization', icon: Building2, allowed: isSuperAdmin },
    { id: 'members', label: 'Team Members', icon: Users, allowed: isAdmin },
    { id: 'integrations', label: 'Integrations', icon: Globe, allowed: isAdmin },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <SectionHeader title="My Profile" description="Manage your personal information and preferences." />
            
            <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                   {user?.avatar_url ? <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-500" />}
                </div>
                <button className="text-sm font-medium text-primary hover:text-primary/80">Change Avatar</button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <InputGroup label="Full Name" defaultValue={user?.full_name} />
                <InputGroup label="Title" defaultValue={user?.title} />
                <InputGroup label="Email Address" defaultValue={user?.email} disabled />
                <InputGroup label="Phone Number" defaultValue={user?.phone} />
                <div className="md:col-span-2">
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Bio</label>
                   <textarea className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary focus:shadow-glow outline-none h-24 mt-1" placeholder="Tell us a little about yourself..." />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium shadow-glow transition-all">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <SectionHeader title="Notification Preferences" description="Choose how and when you want to be notified." />
            
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
               <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <span className="font-medium text-white">Channel Settings</span>
               </div>
               <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div><div className="text-slate-200 font-medium">Email Notifications</div><div className="text-slate-500 text-sm">Receive digest emails and critical alerts.</div></div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><div className="text-slate-200 font-medium">In-App Notifications</div><div className="text-slate-500 text-sm">Show badges and popups within the app.</div></div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><div className="flex items-center gap-2 text-slate-200 font-medium"><Smartphone size={16} className="text-green-500" /> WhatsApp Notifications</div><div className="text-slate-500 text-sm">Receive instant alerts on your phone.</div></div>
                    <Toggle checked={false} onChange={() => {}} />
                  </div>
               </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
               <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                  <span className="font-medium text-white">Event Triggers</span>
               </div>
               <div className="divide-y divide-white/5">
                 {['Task Assignment', 'Ticket Updates', 'Mentions & Comments', 'Project Milestones'].map((item) => (
                   <div key={item} className="p-6 flex items-center justify-between">
                     <span className="text-slate-300">{item}</span>
                     <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary" /> Email</label>
                       <label className="flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary" /> Push</label>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <SectionHeader title="Organization Settings" description="Manage your company details and global configurations." />
             
             <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Organization Name" defaultValue={orgData.name} />
                  <InputGroup label="Address" defaultValue={orgData.address} />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Timezone</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none">
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Fiscal Year Start</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:border-primary outline-none">
                      <option value="jan">January</option>
                      <option value="apr">April</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">Work Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-1.5">
                       <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Work Days</label>
                       <div className="flex gap-2">
                         {['S','M','T','W','T','F','S'].map((d, i) => (
                           <button key={i} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${[1,2,3,4,5].includes(i) ? 'bg-primary text-white shadow-glow' : 'bg-slate-800 text-slate-500'}`}>{d}</button>
                         ))}
                       </div>
                     </div>
                     <InputGroup label="Start Time" type="time" defaultValue={orgData.working_hours.start} />
                     <InputGroup label="End Time" type="time" defaultValue={orgData.working_hours.end} />
                  </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Module Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(orgData.modules).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                       <span className="capitalize font-medium text-slate-200">{key}</span>
                       <Toggle checked={enabled} onChange={() => {}} />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <SectionHeader title="Security & Login" description="Protect your account and organization data." />
             <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Two-Factor Authentication</div>
                      <div className="text-slate-500 text-sm">Add an extra layer of security to your account.</div>
                   </div>
                   <button className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">Enabled</button>
                </div>
                <div className="pt-6 border-t border-white/5">
                   <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase">Change Password</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Current Password" type="password" />
                      <div className="hidden md:block"></div>
                      <InputGroup label="New Password" type="password" />
                      <InputGroup label="Confirm New Password" type="password" />
                   </div>
                   <div className="mt-4">
                      <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium border border-slate-700">Update Password</button>
                   </div>
                </div>
             </div>
             
             <div className="glass-panel p-8 rounded-2xl border border-white/5 border-l-4 border-l-red-500">
                <h3 className="text-lg font-bold text-white mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-4">Irreversible actions regarding your account and data.</p>
                <div className="flex gap-4">
                   <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors">Deactivate Account</button>
                </div>
             </div>
          </div>
        );

      default:
        return <div className="p-10 text-center text-slate-500">Select a category to view settings.</div>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-8">
      <div className="w-64 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="space-y-1">
          {menuItems.map((item: any) => (
             item.type === 'separator' ? <div key="sep" className="h-px bg-white/5 my-3 mx-2" /> :
             item.allowed && (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={16} />}
              </button>
             )
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
         {renderContent()}
      </div>
    </div>
  );
};