import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoredUser, LoginRole } from '../types';
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react';
import { formatLocalDateTime } from '../utils/timeUtils';

export const LoginPage: React.FC = () => {
  const { currentUser, logout, showToast, setActiveTab, theme, toggleTheme, officers } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<LoginRole>('officer');
  const [error, setError] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Enter your official ID and security PIN to continue.');
      return;
    }

    const normalizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const linkedOfficer = officers.find((officer) => {
      const officerId = officer.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const officerName = officer.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedUsername === officerId || normalizedUsername === officerName;
    });

    const userData: StoredUser = {
      username: username.trim(),
      role: linkedOfficer ? 'officer' : role,
      officerId: linkedOfficer?.id,
      name: linkedOfficer?.name || username.trim(),
      designation: linkedOfficer?.rank || (role === 'officer' ? 'Route Inspector' : role === 'commander' ? 'Command Desk Controller' : 'Logistics Fleet Driver'),
      department: linkedOfficer?.department || (role === 'officer' ? 'North East Transport Control Room' : role === 'commander' ? 'Ministry of DoNER Control Room' : 'State Logistics Division'),
      status: linkedOfficer?.status || 'Active',
      loginTime: new Date().toISOString(),
      token: `AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };

    localStorage.setItem('ner_sarthi_auth', JSON.stringify(userData));
    window.dispatchEvent(new Event('ner-sarthi-auth-changed'));
    setError('');
    showToast(`Welcome back, ${userData.name}.`);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
    setUsername('');
    setPassword('');
  };

  return (
    <div className={currentUser ? 'mx-auto max-w-xl space-y-6 py-4' : 'auth-shell'}>
      {!currentUser && (
        <div className="auth-shell__toolbar">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-[var(--text-on-action)] shadow-md shadow-cyan-500/20">
              <Compass className="h-4 w-4" />
            </div>
            <span>NER-Saarthi</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white/80 text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-cyan-600" />}
          </button>
        </div>
      )}

      {currentUser ? (
        <div className="glass-panel space-y-6 rounded-3xl border border-cyan-500/40 bg-white p-7 text-center shadow-xl dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-600 shadow-md dark:text-cyan-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              <span>AUTHENTICATED SESSION ACTIVE</span>
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{currentUser.name}</h2>
            <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">{currentUser.designation}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{currentUser.department}</p>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">ID: {currentUser.username} · Session: {currentUser.token}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
            <div>
              <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">Authority level</span>
              <span className="font-bold uppercase text-slate-900 dark:text-white">{currentUser.role} access</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">Login timestamp</span>
              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">{formatLocalDateTime(currentUser.loginTime)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-xs font-extrabold text-[var(--text-on-action)] shadow-md transition hover:from-cyan-400 hover:to-blue-500 active:scale-95 sm:flex-1"
            >
              <span>Go to Command Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/20 sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel w-full max-w-xl space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/15 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 sm:p-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[var(--text-on-action)] shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">NER-Saarthi Portal Login</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Sign in to access the DoNER logistics and route command portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="official-id">Official ID</label>
              <div className="relative">
                <input
                  id="official-id"
                  type="text"
                  required
                  placeholder="Enter your official ID (for example, OFF-001)"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/90 dark:text-white"
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="security-pin">Security PIN</label>
              <div className="relative">
                <input
                  id="security-pin"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security PIN"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-10 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/90 dark:text-white"
                />
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide security PIN' : 'Show security PIN'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="access-role">Access role</label>
              <select
                id="access-role"
                value={role}
                onChange={(event) => setRole(event.target.value as LoginRole)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-white/15 dark:bg-slate-900/90 dark:text-white"
              >
                <option value="commander">Command desk</option>
                <option value="officer">Field operations</option>
                <option value="driver">Logistics fleet</option>
              </select>
            </div>

            {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3.5 text-xs font-extrabold text-[var(--text-on-action)] shadow-md transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99]"
            >
              <span>Sign In to Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500 dark:border-white/10">Official Portal · Government of India · Ministry of DoNER</div>
        </div>
      )}
    </div>
  );
};
