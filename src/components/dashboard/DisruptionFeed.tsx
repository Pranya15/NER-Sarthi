import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimeFriendly } from '../../utils/timeUtils';
import { DisruptionAlert } from '../../types';
import { AlertCircle, ShieldAlert, CloudRain, Truck, CheckCircle2, ChevronRight } from 'lucide-react';

export const DisruptionFeed: React.FC = () => {
  const { disruptions, routes, setSelectedRoute } = useApp();

  const getSeverityBadge = (severity: string, type: string) => {
    if (type === 'Cleared') {
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', icon: CheckCircle2, dot: '🟢' };
    }
    if (severity === 'critical') {
      return { bg: 'bg-red-500/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-500/30', icon: ShieldAlert, dot: '🔴' };
    }
    if (severity === 'high') {
      return { bg: 'bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/30', icon: AlertCircle, dot: '🟡' };
    }
    return { bg: 'bg-blue-500/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-blue-500/30', icon: CloudRain, dot: '🔵' };
  };

  const handleAlertClick = (routeId: string) => {
    const matched = routes.find(r => r.id === routeId);
    if (matched) {
      setSelectedRoute(matched);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col h-full min-h-[420px]">
      
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
          <h3 className="font-extrabold text-sm text-[var(--text-primary)] uppercase tracking-wider">
            Active Disruptions Ticker
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
          Live Stream
        </span>
      </div>

      {/* Disruption Alert Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[500px]">
        {disruptions.map(alert => {
          const badge = getSeverityBadge(alert.severity, alert.type);
          const Icon = badge.icon;
          return (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert.routeId)}
              className={`p-3 rounded-xl border ${badge.border} ${badge.bg} glass-card transition-all cursor-pointer hover:border-cyan-400/50 group`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center space-x-1.5">
                  <span>{badge.dot}</span>
                  <span className="text-[var(--text-primary)]">{alert.routeName}</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{formatTimeFriendly(alert.timestamp)}</span>
              </div>

              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mt-1 flex items-center space-x-1">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{alert.title}</span>
              </p>

              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                {alert.description}
              </p>

              <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-muted)] border-t border-white/5 pt-1.5">
                <span className="uppercase tracking-wider font-mono">{alert.type}</span>
                <span className="flex items-center space-x-1 text-cyan-700 dark:text-cyan-300 group-hover:underline">
                  <span>Inspect Route</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Ticker Status */}
      <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-[var(--text-muted)] text-center">
        Auto-refreshing every 20-30s via simulated sensor feeds
      </div>

    </div>
  );
};
