import React from 'react';
import { useApp } from '../../context/AppContext';
import { getVisibilityClassification, getRainRiskLabel } from '../../utils/riskEngine';
import { getTelHref } from '../../utils/contact';
import { formatTimeFriendly } from '../../utils/timeUtils';
import { X, MapPin, CloudRain, AlertTriangle, ShieldCheck, Clock, Eye, Radio, ExternalLink } from 'lucide-react';

export const RouteDetailsDrawer: React.FC = () => {
  const { selectedRoute, setSelectedRoute, officers, setActiveTab } = useApp();

  if (!selectedRoute) return null;

  const visibilityInfo = getVisibilityClassification(selectedRoute.visibility);
  const rainInfo = getRainRiskLabel(selectedRoute.rainRisk);
  const assignedOfficer = officers.find(o => o.id === selectedRoute.assignedOfficerId) || officers[0];

  return (
    <div className="fixed inset-y-0 right-0 z-[2200] w-full max-w-md glass-panel border-l border-white/10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">{selectedRoute.id}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                selectedRoute.status === 'clear' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
                selectedRoute.status === 'at-risk' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' :
                'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
              }`}>
                {selectedRoute.status === 'clear' ? '🟢 CLEAR' : selectedRoute.status === 'at-risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] mt-1">{selectedRoute.name}</h2>
            <p className="text-xs text-[var(--text-muted)]">{selectedRoute.sector} • {selectedRoute.lengthKm} km Corridor</p>
          </div>
          <button
            onClick={() => setSelectedRoute(null)}
            className="p-2 rounded-xl glass-panel-light text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Overview Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Composite Risk</span>
            <div className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-300 mt-1">{selectedRoute.risk}%</div>
            <p className="text-[10px] text-[var(--text-muted)]">AI Risk Score</p>
          </div>

          <div className="glass-card p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Landslide Status</span>
            <div className={`text-sm font-extrabold mt-1 uppercase ${
              selectedRoute.landslideRisk === 'CLEAR' ? 'text-emerald-700 dark:text-emerald-300' :
              selectedRoute.landslideRisk === 'MONITOR' ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300 animate-pulse'
            }`}>
              {selectedRoute.landslideRisk === 'CLEAR' ? '🟢 CLEAR' :
               selectedRoute.landslideRisk === 'MONITOR' ? '🟡 MONITOR' : '🔴 BLOCKED'}
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Prob: {selectedRoute.landslideProbability}%</p>
          </div>
        </div>

        {/* Weather Intelligence Section */}
        <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider border-b border-white/10 pb-2">
            <CloudRain className="w-4 h-4" />
            <span>Weather & Visibility Intelligence</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--text-muted)]">Rainfall Risk:</span>
              <p className={`font-bold ${rainInfo.color}`}>{selectedRoute.rainRisk}% ({rainInfo.label})</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Visibility Distance:</span>
              <p className={`font-bold ${visibilityInfo.color}`}>{selectedRoute.visibility} km ({visibilityInfo.classification})</p>
            </div>
          </div>
        </div>

        {/* Update Timestamps */}
        <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300" />
              <span>Last Updated:</span>
            </span>
            <span className="font-bold text-[var(--text-secondary)]">{formatTimeFriendly(selectedRoute.lastUpdated)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 animate-pulse" />
              <span>Next Expected Update:</span>
            </span>
            <span className="font-bold text-cyan-700 dark:text-cyan-300 font-mono">in {selectedRoute.nextUpdateMinutes} mins</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>Data Source: {selectedRoute.source}</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">Confidence {selectedRoute.confidence}%</span>
          </div>
        </div>

        {/* Assigned Field Officer */}
        <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              <span className="text-xs font-bold text-[var(--text-primary)]">Assigned Field Officer</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
              Active Patrol
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{assignedOfficer.name}</h4>
            <p className="text-xs text-[var(--text-muted)]">{assignedOfficer.rank} • {assignedOfficer.department}</p>
            {getTelHref(assignedOfficer.controlRoom) ? (
              <a
                href={getTelHref(assignedOfficer.controlRoom) || undefined}
                className="mt-1 inline-flex text-xs font-mono text-[var(--text-secondary)] underline decoration-emerald-400/40 underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300"
                aria-label={`Call ${assignedOfficer.name}`}
              >
                Control Desk: {assignedOfficer.controlRoom}
              </a>
            ) : (
              <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">Control Desk: Not available</p>
            )}
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-xs text-[var(--text-secondary)] italic">
            "{assignedOfficer.lastReport}"
          </div>
          <p className="text-[10px] text-[var(--text-muted)] text-right">
            Reported {formatTimeFriendly(assignedOfficer.lastReportAt || assignedOfficer.lastUpdate)}
          </p>
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => {
            setActiveTab('logistics');
            setSelectedRoute(null);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
        >
          <span>Plan Logistics For This Route</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
