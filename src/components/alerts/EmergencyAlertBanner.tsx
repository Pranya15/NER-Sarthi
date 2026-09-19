import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getAlertTranslation, 
  getUIText, 
  AlertKey, 
  SUPPORTED_LANGUAGES 
} from '../../data/translations';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CloudRain, 
  Info, 
  X, 
  MapPin, 
  Globe, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const EmergencyAlertBanner: React.FC = () => {
  const { 
    activeEmergencyAlert, 
    dismissEmergencyAlert, 
    currentLanguage, 
    setActiveTab,
    routes,
    setSelectedRoute,
  } = useApp();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeEmergencyAlert) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        dismissEmergencyAlert();
      }, activeEmergencyAlert.autoDismissMs || 10000);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [activeEmergencyAlert]);

  if (!activeEmergencyAlert || !visible) return null;

  const translation = getAlertTranslation(
    activeEmergencyAlert.alertKey as AlertKey, 
    currentLanguage
  );
  
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const isCritical = activeEmergencyAlert.severity === 'CRITICAL';
  const isHigh = activeEmergencyAlert.severity === 'HIGH';
  const isMedium = activeEmergencyAlert.severity === 'MEDIUM';

  const bannerTheme = isCritical
    ? {
        border: 'border-red-500/60',
        bg: 'bg-gradient-to-r from-red-950/95 via-slate-950/95 to-slate-950/95',
        iconBg: 'bg-red-500/25 text-red-400',
        badge: 'bg-red-500 text-[var(--text-on-action)] shadow-red-500/50',
        glow: 'shadow-[0_10px_40px_rgba(239,68,68,0.35)]',
        Icon: AlertOctagon,
      }
    : isHigh
    ? {
        border: 'border-amber-500/60',
        bg: 'bg-gradient-to-r from-amber-950/95 via-slate-950/95 to-slate-950/95',
        iconBg: 'bg-amber-500/25 text-amber-400',
        badge: 'bg-amber-500 text-slate-950 shadow-amber-500/50',
        glow: 'shadow-[0_10px_40px_rgba(245,158,11,0.35)]',
        Icon: AlertTriangle,
      }
    : isMedium
    ? {
        border: 'border-yellow-500/50',
        bg: 'bg-gradient-to-r from-yellow-950/90 via-slate-950/95 to-slate-950/95',
        iconBg: 'bg-yellow-500/25 text-yellow-400',
        badge: 'bg-yellow-500 text-slate-950 shadow-yellow-500/50',
        glow: 'shadow-[0_10px_40px_rgba(234,179,8,0.25)]',
        Icon: CloudRain,
      }
    : {
        border: 'border-cyan-500/50',
        bg: 'bg-gradient-to-r from-cyan-950/90 via-slate-950/95 to-slate-950/95',
        iconBg: 'bg-cyan-500/25 text-cyan-400',
        badge: 'bg-cyan-500 text-slate-950 shadow-cyan-500/50',
        glow: 'shadow-[0_10px_40px_rgba(6,182,212,0.25)]',
        Icon: Info,
      };

  const IconComponent = bannerTheme.Icon;

  return (
    <div className="fixed top-20 right-4 sm:right-6 max-w-md w-[calc(100vw-2rem)] sm:w-[440px] z-[2500] font-sans transition-all duration-300 transform animate-in slide-in-from-top-4 fade-in">
      <div className={`theme-dark-surface relative rounded-3xl p-4 sm:p-5 border backdrop-blur-2xl ${bannerTheme.bg} ${bannerTheme.border} ${bannerTheme.glow} shadow-2xl space-y-3`}>
        
        {/* Top Strip */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${bannerTheme.badge} flex items-center space-x-1 animate-pulse`}>
              <IconComponent className="w-3 h-3" />
              <span>{activeEmergencyAlert.severity}</span>
            </span>

            {/* Language Tag Indicator */}
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cyan-300 border border-white/10">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{currentLangObj.flag} {currentLangObj.name}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);
              dismissEmergencyAlert();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-[var(--text-on-dark)] hover:bg-white/10 transition-colors"
            aria-label="Dismiss Emergency Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: Icon + Translated Title & Message */}
        <div className="flex items-start space-x-3.5">
          <div className={`w-11 h-11 rounded-2xl ${bannerTheme.iconBg} border ${bannerTheme.border} flex items-center justify-center shrink-0 shadow-lg`}>
            <IconComponent className="w-6 h-6 animate-bounce" />
          </div>

          <div className="space-y-1 min-w-0">
            <h3 className="text-sm font-black text-[var(--text-on-dark)] tracking-wide">
              {translation.title}
            </h3>
            
            {/* Translated Alert Message */}
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              "{translation.message}"
            </p>

            {translation.actionText && (
              <p className="text-[11px] text-cyan-300 font-semibold pt-0.5 flex items-center space-x-1">
                <span>↳ {translation.actionText}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer info & Action */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 truncate max-w-[240px]">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate text-slate-300 font-medium">
              {activeEmergencyAlert.region} • {activeEmergencyAlert.routeName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const relatedRoute = activeEmergencyAlert.routeId
                ? routes.find(route => route.id === activeEmergencyAlert.routeId)
                : routes.find(route => route.name === activeEmergencyAlert.routeName);
              if (relatedRoute) setSelectedRoute(relatedRoute);
              setActiveTab('dashboard');
              setVisible(false);
              dismissEmergencyAlert();
            }}
            className="flex items-center space-x-1 font-bold text-cyan-400 hover:text-cyan-300 shrink-0 text-[11px]"
          >
            <span>Live Route</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Auto Dismiss Visual Progress Bar */}
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-400 animate-[width_10s_linear_forwards] w-full" />
        </div>

      </div>
    </div>
  );
};
