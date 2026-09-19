import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getAlertTranslation, 
  getUIText, 
  AlertKey 
} from '../../data/translations';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CloudRain, 
  CheckCircle2, 
  CheckCheck, 
  Trash2, 
  MapPin, 
  Clock, 
  Zap,
  Info
} from 'lucide-react';
import { AlertLevel } from '../../types';
import { formatTimeFriendly } from '../../utils/timeUtils';

export const NotificationCenter: React.FC = () => {
  const { 
    currentLanguage, 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications,
    routes,
    setSelectedRoute,
    setActiveTab,
    simulateLandslide,
    simulateHeavyRain,
    clearRoute
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeverityBadge = (level: AlertLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          icon: AlertOctagon,
          bg: 'bg-red-500/20',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-500/40',
          label: '🔴 CRITICAL'
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-500/20',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-500/40',
          label: '🟠 HIGH'
        };
      case 'MEDIUM':
        return {
          icon: CloudRain,
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-500/40',
          label: '🟡 MEDIUM'
        };
      case 'LOW':
      default:
        return {
          icon: Info,
          bg: 'bg-cyan-500/20',
          text: 'text-cyan-700 dark:text-cyan-300',
          border: 'border-cyan-500/40',
          label: '🔵 INFO'
        };
    }
  };

  const handleNotificationClick = (notificationId: string, routeId?: string) => {
    markNotificationAsRead(notificationId);
    if (routeId) {
      const relatedRoute = routes.find(route => route.id === routeId);
      if (relatedRoute) {
        setSelectedRoute(relatedRoute);
        setActiveTab('dashboard');
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={panelRef}>
      
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full border transition-all duration-200 ${
          isOpen
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-800 dark:text-cyan-300 shadow-md shadow-cyan-500/20'
            : 'bg-[var(--bg-card)] dark:bg-black/60 border-[var(--border-default)] dark:border-white/15 text-[var(--text-secondary)] dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-500/40'
        }`}
        title="Emergency Notification Center"
        aria-label="Notification Center"
      >
        <Bell className="w-4 h-4" />
        
        {/* Unread Badge Count */}
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[var(--text-on-action)] font-black text-[10px] flex items-center justify-center border-2 border-[var(--bg-card)] dark:border-slate-950 shadow-md animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-panel absolute right-0 mt-2 w-80 sm:w-96 max-h-[520px] flex flex-col rounded-3xl bg-[var(--bg-dropdown)] dark:bg-black/95 backdrop-blur-2xl border border-[var(--border-default)] dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[3000] overflow-hidden font-sans text-xs text-[var(--text-primary)]">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[var(--bg-card-subtle)] dark:bg-slate-900/80 border-b border-[var(--border-subtle)] dark:border-white/10 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
              <h3 className="font-extrabold text-sm text-[var(--text-primary)] dark:text-white">
                {getUIText('notifications', currentLanguage)}
              </h3>
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30">
                  {unreadNotificationCount} unread
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-1 text-[11px]">
              {notifications.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="p-1 rounded-lg hover:bg-[var(--bg-card-hover)] dark:hover:bg-white/10 text-[var(--text-muted)] dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                    title={getUIText('markAllRead', currentLanguage)}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="p-1 rounded-lg hover:bg-[var(--bg-card-hover)] dark:hover:bg-white/10 text-[var(--text-muted)] dark:text-slate-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    title={getUIText('clearAll', currentLanguage)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-[var(--border-subtle)] dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-300 mx-auto" />
                <p className="font-bold text-[var(--text-primary)] dark:text-slate-200">{getUIText('noNotifications', currentLanguage)}</p>
                <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-500">{getUIText('allCaughtUp', currentLanguage)}</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const badge = getSeverityBadge(notif.severity);
                const BadgeIcon = badge.icon;
                
                // Get translated text based on current selected language!
                const translated = getAlertTranslation(notif.alertKey as AlertKey, currentLanguage);
                const displayTitle = translated ? translated.title : (notif.customTitle || notif.alertKey);
                const displayMessage = translated ? translated.message : (notif.customMessage || '');

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id, notif.routeId)}
                    className={`p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left space-y-1.5 ${
                      !notif.read
                        ? 'bg-[var(--bg-card-subtle)] dark:bg-slate-900/90 border border-[var(--border-default)] dark:border-white/10 shadow-sm'
                        : 'hover:bg-[var(--bg-card-hover)] dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Top Row: Severity + Region + Timestamp */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${badge.bg} ${badge.text} ${badge.border} flex items-center space-x-1`}>
                          <BadgeIcon className="w-2.5 h-2.5" />
                          <span>{badge.label}</span>
                        </span>
                        
                        <div className="flex items-center space-x-1 text-[10px] text-[var(--text-muted)] dark:text-slate-400 font-semibold truncate max-w-[130px]">
                          <MapPin className="w-2.5 h-2.5 text-cyan-700 dark:text-cyan-300 shrink-0" />
                          <span className="truncate">{notif.region}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0 text-[10px] text-[var(--text-muted)] dark:text-slate-500">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTimeFriendly(notif.timestamp)}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        )}
                      </div>
                    </div>

                    {/* Alert Title (Translated in active language) */}
                    <h4 className="font-bold text-xs text-[var(--text-primary)] dark:text-white leading-tight">
                      {displayTitle}
                    </h4>

                    {/* Alert Message (Translated in active language) */}
                    <p className="text-[11px] text-[var(--text-secondary)] dark:text-slate-300 leading-relaxed font-normal">
                      "{displayMessage}"
                    </p>

                    {/* Route context tag */}
                    {notif.routeName && (
                      <div className="pt-0.5 text-[10px] text-[var(--text-muted)] dark:text-slate-400 flex items-center space-x-1">
                        <span className="text-[var(--text-muted)] dark:text-slate-500">Route:</span>
                        <span className="text-cyan-700 dark:text-cyan-300 font-medium">{notif.routeName}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Demo Simulator Controls */}
          <div className="p-3 bg-[var(--bg-card-subtle)] dark:bg-slate-900/90 border-t border-[var(--border-subtle)] dark:border-white/10 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] dark:text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                <span>Demo Alert Triggers (Active Lang)</span>
              </span>
              <span className="text-cyan-700 dark:text-cyan-300">{currentLanguage.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  simulateLandslide('R-008'); // Sikkim / Gangtok Landslide
                }}
                className="px-2 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-[var(--text-on-action)] font-bold text-[10px] transition-transform active:scale-95 flex items-center justify-center space-x-1 shadow-sm"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Trigger Landslide</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  simulateHeavyRain('R-002');
                }}
                className="px-2 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-[var(--text-on-action)] font-bold text-[10px] transition-transform active:scale-95 flex items-center justify-center space-x-1 shadow-sm"
              >
                <CloudRain className="w-3 h-3" />
                <span>Trigger Heavy Rain</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
