import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass } from 'lucide-react';

export const Footer: React.FC<{ onLoginClick?: () => void }> = ({ onLoginClick }) => {
  const { setActiveTab, t } = useApp();

  return (
    <footer className="w-full glass-panel border-t border-slate-200 dark:border-white/10 mt-0 py-8 px-6 text-slate-600 dark:text-slate-300 transition-colors duration-300">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-[var(--text-on-action)] font-bold shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">NER-Sarthi</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
            {t('footerBrandDesc', "AI-Powered Logistics & Route Accessibility Intelligence Platform for India's North Eastern Region. Combining terrain sensors, field officer network, driver reports, and weather analytics into one command desk.")}
          </p>
        </div>

        {/* Quick Nav */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-3">
            {t('navigation', 'Navigation')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-600 dark:hover:text-cyan-300 font-medium">
                {t('dashboard', 'Command Dashboard')}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('routes')} className="hover:text-cyan-600 dark:hover:text-cyan-300 font-medium">
                {t('routes', 'Route Intelligence')}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('logistics')} className="hover:text-cyan-600 dark:hover:text-cyan-300 font-medium">
                {t('logistics', 'AI Logistics Planner')}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('analytics')} className="hover:text-cyan-600 dark:hover:text-cyan-300 font-medium">
                {t('analytics', 'Analytics & Reports')}
              </button>
            </li>
          </ul>
        </div>

        {/* Info & Organization */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-3">
            {t('ministryInfo', 'Ministry Info')}
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>{t('ministryName', 'Ministry of Development of North Eastern Region (DoNER)')}</li>
            <li>{t('govOfIndia', 'Government of India')}</li>
            <li>
              <button onClick={() => setActiveTab('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 font-medium">
                {t('explore', 'Explore Northeast')}
              </button>
            </li>
            <li>
              <button onClick={() => {
                if (onLoginClick) onLoginClick();
                else setActiveTab('login');
              }} className="hover:text-cyan-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 font-medium">
                {t('login', 'Portal Login')}
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-muted)]">
        <p>{t('copyrightText', '© 2026 NER-Sarthi')}</p>
        <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)]">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {t('allSystemsOperational', 'All Systems Operational')}
          </span>
        </div>
      </div>
    </footer>
  );
};
