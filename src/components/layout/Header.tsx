import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import { 
  Shield, 
  Clock, 
  Compass, 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  BarChart3, 
  LogIn,
  LogOut,
  ChevronDown,
  Sun, 
  Moon,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [controlRoomOpen, setControlRoomOpen] = useState(false);
  const { 
    currentUser,
    logout,
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    mobileDrawerOpen, 
    setMobileDrawerOpen, 
    t 
  } = useApp();


  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const navItems = [
    { id: 'dashboard', label: t('dashboard', 'Command Dashboard'), icon: LayoutDashboard },
    { id: 'routes', label: t('routes', 'Route Intelligence'), icon: MapPin },
    { id: 'logistics', label: t('logistics', 'AI Logistics Planner'), icon: Truck },
    { id: 'analytics', label: t('analytics', 'Analytics & Reports'), icon: BarChart3 },
    { id: 'officers', label: t('officers', 'Field Officers'), icon: Shield },
    { id: 'explore', label: t('explore', 'Explore Northeast'), icon: Compass },
    { id: 'login', label: t('login', 'Portal Login'), icon: LogIn },
  ];

  return (
    <header className="sticky top-0 z-[2000] w-full glass-panel border-b border-slate-200 dark:border-white/10 px-3 sm:px-6 py-2.5 shadow-sm dark:shadow-glass transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-2">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-[var(--text-on-action)] shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  NER-Sarthi
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-400 dark:border-cyan-500/30">
                  DoNER
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden md:block">
                {t('nerSarthiSubtitle', 'AI-Powered Logistics & Accessibility Intelligence • North East India')}
              </p>
            </div>
          </div>

          {/* Desktop Center: Minimal operational status */}
          <div className="hidden lg:flex items-center gap-3 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-3.5 py-1.5 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold tracking-tight text-[var(--text-primary)]">
                System Operational
              </span>
            </div>

            <span className="h-3.5 w-px bg-[var(--border-default)]" aria-hidden="true"></span>

            <time
              dateTime={currentTime.toISOString()}
              className="flex items-center gap-1.5 font-mono text-[11px] font-medium tabular-nums text-[var(--text-secondary)]"
              aria-label={`Current time ${formattedTime}`}
            >
              <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              <span>{formattedTime}</span>
            </time>
          </div>

          {/* Right Controls Group */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {/* Global Language Selector */}
            <LanguageSelector />

            {/* Notification Center with Unread Count Badge */}
            <NotificationCenter />

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-300 shadow-sm flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:scale-105'
                  : 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50 hover:scale-105 shadow-amber-500/10'
              }`}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Authenticated User Profile & Session Controls */}
            {currentUser ? (
              <div className="relative hidden sm:flex items-center">
                <button
                  type="button"
                  onClick={() => setControlRoomOpen(isOpen => !isOpen)}
                  aria-expanded={controlRoomOpen}
                  aria-haspopup="dialog"
                  className="flex items-center space-x-2.5 glass-panel-light pl-2 pr-2.5 py-1 rounded-xl border border-emerald-500/30 dark:border-emerald-500/40 hover:border-cyan-500/60 transition-all shadow-sm"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-slate-900 ring-1 ring-slate-900">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>

                  <div className="text-left hidden lg:block max-w-[190px] xl:max-w-[230px]">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {currentUser.name}
                      </span>
                      <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 flex-shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 truncate leading-tight mt-0.5">
                      {currentUser.designation}
                    </p>
                    <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium truncate leading-tight">
                      {currentUser.department}
                    </p>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {controlRoomOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl glass-panel border border-emerald-500/30 p-4 shadow-2xl z-[3100]">
                    <div className="flex items-start gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            AUTHENTICATED OFFICER
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                          {currentUser.name}
                        </p>
                        <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 truncate">
                          {currentUser.designation}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {currentUser.department}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('officers'); setControlRoomOpen(false); }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                      >
                        <span>Field Officers Network</span>
                        <Shield className="w-3.5 h-3.5 text-cyan-500" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { logout(); setControlRoomOpen(false); }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/15 transition border border-red-200/50 dark:border-red-500/20"
                      >
                        <span>Logout Officer Session</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )}


            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl glass-panel-light border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Desktop Operational Modules Navbar Row */}
        <div className="hidden lg:block border-t border-slate-200 dark:border-white/10 pt-2">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
};
