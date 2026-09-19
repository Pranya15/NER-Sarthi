import React from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, AlertTriangle, ShieldAlert, Clock, TrendingUp, TrendingDown } from 'lucide-react';

export const KPICards: React.FC = () => {
  const { kpiStats, t } = useApp();

  const cards = [
    {
      id: 'active-shipments',
      label: t('activeShipments', 'Active Shipments'),
      value: kpiStats.activeShipments,
      unit: t('onRouteRealTime', 'Units on Route'),
      icon: Truck,
      color: 'from-cyan-500/20 to-blue-600/30',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-700 dark:text-cyan-300',
      trend: '+12%',
      isUp: true
    },
    {
      id: 'delayed-shipments',
      label: t('delayedShipments', 'Delayed Shipments'),
      value: kpiStats.delayedShipments,
      unit: t('dueToWeather', 'Corridor Bottlenecks'),
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-orange-600/30',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-700 dark:text-amber-300',
      trend: '-2',
      isUp: false
    },
    {
      id: 'high-risk-routes',
      label: t('highRiskRoutes', 'High-Risk Routes'),
      value: kpiStats.highRiskRoutes,
      unit: t('riskExceedsThreshold', 'Monitored Corridors'),
      icon: ShieldAlert,
      color: 'from-red-500/20 to-rose-700/30',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-700 dark:text-red-300',
      trend: '3 Blocked',
      isUp: true
    },
    {
      id: 'avg-time-saved',
      label: t('avgTimeSaved', 'Avg Time Saved'),
      value: kpiStats.avgTimeSaved,
      unit: t('aiOptimization', 'Per Rerouted Convoy'),
      icon: Clock,
      color: 'from-emerald-500/20 to-teal-700/30',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
      trend: '+45m',
      isUp: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`glass-card p-4 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} shadow-glass transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">{card.label}</span>
              <div className="w-8 h-8 rounded-xl bg-slate-900/60 flex items-center justify-center border border-white/10">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
              <span className="text-[var(--text-muted)] font-medium truncate max-w-[120px]">{card.unit}</span>
              <span className={`flex items-center space-x-1 font-semibold ${card.iconColor}`}>
                {card.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="truncate">{card.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
