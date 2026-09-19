import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/translations';
import { AlertOctagon, CloudRain, Clock, CheckCircle2, Play, Info, Globe } from 'lucide-react';

export const DemoControlsBar: React.FC = () => {
  const { 
    simulateLandslide, 
    simulateHeavyRain, 
    simulateVehicleDelay, 
    clearRoute,
    toastMessage,
    currentLanguage,
    t
  } = useApp();

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="w-full glass-panel border border-cyan-500/30 rounded-2xl p-3 sm:p-4 mb-6 shadow-glow-cyan transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Header */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <Play className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
                {t('demoControlCenter', 'Demo Simulation Control Center')}
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-500/30 flex items-center space-x-1">
                <Globe className="w-2.5 h-2.5" />
                <span>{t('language', 'Language')}: {currentLangObj.flag} {currentLangObj.name}</span>
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t('demoDescription', 'Trigger live simulated emergencies broadcast across the Map, Emergency Banner & Notification Center in selected language.')}
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => simulateLandslide('R-001')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-red-500/20 border border-red-400/40 transition-transform active:scale-95"
            title={t('simulateLandslide', 'Simulate Landslide')}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t('simulateLandslide', 'Landslide Alert')}</span>
          </button>

          <button
            type="button"
            onClick={() => simulateHeavyRain('R-002')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-amber-500/20 border border-amber-400/40 transition-transform active:scale-95"
            title={t('simulateHeavyRain', 'Simulate Heavy Rain')}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{t('simulateHeavyRain', 'Heavy Rain Alert')}</span>
          </button>

          <button
            type="button"
            onClick={() => simulateVehicleDelay('V-001')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-blue-500/20 border border-blue-400/40 transition-transform active:scale-95"
            title={t('delayVehicle', 'Delay Vehicle')}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('delayVehicle', 'Delay Vehicle')}</span>
          </button>

          <button
            type="button"
            onClick={() => clearRoute('R-001')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-emerald-500/20 border border-emerald-400/40 transition-transform active:scale-95"
            title={t('clearCorridor', 'Clear Corridor')}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('clearCorridor', 'Clear Corridor')}</span>
          </button>
        </div>

      </div>

      {/* Real-time Toast Feedback Notification */}
      {toastMessage && (
        <div className="mt-3 pt-2 border-t border-cyan-500/30 flex items-center space-x-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 animate-pulse">
          <Info className="w-4 h-4 text-cyan-700 dark:text-cyan-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
