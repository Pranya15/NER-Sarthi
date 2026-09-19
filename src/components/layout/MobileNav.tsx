import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Compass, 
  X, 
  BarChart3, 
  LogIn, 
  ShieldCheck,
  Clock,
  Shield,
  Radio,
  ChevronRight
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    currentUser,
    logout,
    activeTab, 
    setActiveTab, 
    mobileDrawerOpen, 
    setMobileDrawerOpen, 
    simulatedTime,
    t 
  } = useApp();


  const bottomNavItems = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'routes', label: t('routes', 'Routes'), icon: MapPin },
    { id: 'logistics', label: t('logistics', 'Logistics'), icon: Truck },
    { id: 'analytics', label: t('analytics', 'Analytics'), icon: BarChart3 },
    { id: 'officers', label: t('officers', 'Officers'), icon: ShieldCheck },
    { id: 'login', label: t('login', 'Portal'), icon: LogIn },
  ];

  const fullNavItems = [
    { id: 'dashboard', label: t('dashboard', 'Command Dashboard'), desc: 'Real-time hazard maps & corridor stats', icon: LayoutDashboard },
    { id: 'routes', label: t('routes', 'Route Intelligence'), desc: '25 highway corridors & landslide monitors', icon: MapPin },
    { id: 'logistics', label: t('logistics', 'AI Logistics Planner'), desc: 'Optimized dispatch & terrain routing', icon: Truck },
    { id: 'analytics', label: t('analytics', 'Analytics & Reports'), desc: 'Historical disruptions & CSV export', icon: BarChart3 },
    { id: 'officers', label: t('officers', 'Field Officer Network'), desc: 'Ground operations personnel & reports', icon: ShieldCheck },
    { id: 'explore', label: t('explore', 'Explore Northeast'), desc: '8 NER states, culture & destinations', icon: Compass },
    { id: 'login', label: t('login', 'Portal Login'), desc: 'Authorized DoNER operational credentials', icon: LogIn },
  ];

  return (
    <>
      {/* =====================================================
          SLIDE-OUT FULL NAVIGATION DRAWER (MOBILE / TABLET)
          ===================================================== */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[2900] flex justify-end">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close navigation overlay"
          />

          {/* Drawer container */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full glass-panel border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-[var(--text-on-action)] shadow-md shadow-cyan-500/20">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      NER-Sarthi
                    </h2>
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                      Operational Menu
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl glass-panel-light border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status pill inside drawer */}
              <div className="glass-panel-light p-2.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase">
                    System Live
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>{simulatedTime}</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {fullNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-xs transition-all text-left ${
                        isActive
                          ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`p-2 rounded-xl ${
                          isActive 
                            ? 'bg-cyan-600 text-[var(--text-on-action)]' 
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-extrabold">{item.label}</p>
                          <p className="text-[10px] font-normal text-slate-500 dark:text-slate-400 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-3 text-center space-y-2">
              {currentUser ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Logged-in Officer</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">{currentUser.name}</p>
                  <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 truncate">{currentUser.designation}</p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{currentUser.department}</p>
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileDrawerOpen(false); }}
                    className="mt-2 w-full py-1.5 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-600 dark:text-red-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Logout Session</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center space-x-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Ministry of DoNER</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">Government of India • North East Region</p>
                </>
              )}
            </div>


          </div>
        </div>
      )}

      {/* =====================================================
          FIXED BOTTOM NAVIGATION BAR FOR SMARTPHONES (< lg)
          ===================================================== */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[1900] glass-panel border-t border-slate-200 dark:border-white/10 px-1 py-1 flex items-center justify-around shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-cyan-700 dark:text-cyan-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300' 
                  : ''
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
