import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Key, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signIn, signInMock } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setIsLoggingIn(false);
    } else {
      navigate('/');
    }
  };

  const handleMockLogin = () => {
    signInMock();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow mb-4">
            <span className="text-3xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to <span className="text-primary">DUDE.OS</span></h1>
          <p className="text-slate-400 mt-2">Enter the system.</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-primary focus:shadow-glow outline-none" placeholder="name@company.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-primary focus:shadow-glow outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isLoggingIn} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-glow hover:shadow-glow-accent flex items-center justify-center gap-2 mt-2">
              {isLoggingIn ? <Loader2 className="animate-spin" /> : <Key size={20} />}
              Authenticate
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/5">
            <button onClick={handleMockLogin} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm transition-colors py-2 rounded-lg hover:bg-white/5">
              <ShieldCheck size={16} /> <span>Use Test Account (Mock Mode)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};