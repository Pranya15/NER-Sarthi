import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  Compass, 
  Mail 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'routes', label: 'Route Intelligence', icon: MapPin },
    { id: 'logistics', label: 'AI Logistics Planner', icon: Truck },
    { id: 'officers', label: 'Field Officers Network', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'explore', label: 'Explore Northeast', icon: Compass },
    { id: 'subscribe', label: 'Subscribe Updates', icon: Mail },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/10 min-h-[calc(100vh-65px)] p-4 space-y-6">
      
      {/* Navigation Label */}
      <div className="px-3 pt-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
          Operational Modules
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-[var(--text-secondary)] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--text-primary)] dark:hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-[var(--text-muted)]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* DoNER Regional Card Footer */}
      <div className="glass-panel-light p-3 rounded-xl border border-white/10 text-center space-y-1.5">
        <div className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
          DoNER
        </div>
        <p className="text-[10px] text-[var(--text-muted)]">Ministry of Development of North Eastern Region</p>
      </div>

    </aside>
  );
};
