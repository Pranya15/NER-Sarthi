import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RouteSegment } from '../types';
import { getVisibilityClassification, getRainRiskLabel } from '../utils/riskEngine';
import { getTelHref } from '../utils/contact';
import { formatTimeFriendly } from '../utils/timeUtils';
import { MapPin, CloudRain, AlertTriangle, ShieldCheck, Clock, Radio, Search, Filter } from 'lucide-react';

export const RouteIntelligencePage: React.FC = () => {
  const { routes, officers, setSelectedRoute } = useApp();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');

  useEffect(() => {
    if (routes.length && !routes.some(r => r.id === selectedRouteId)) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes, selectedRouteId]);

  const route = routes.find(r => r.id === selectedRouteId) || routes[0];

  if (!route) {
    return (
      <div className="glass-panel rounded-2xl border border-white/10 p-8 text-center text-sm text-[var(--text-muted)]">
        Route intelligence is loading. Please try again shortly.
      </div>
    );
  }

  const visibilityInfo = getVisibilityClassification(route.visibility);
  const rainInfo = getRainRiskLabel(route.rainRisk);
  const assignedOfficer = officers.find(o => o.id === route.assignedOfficerId) || officers[0];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
            <span>Route Accessibility Intelligence</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Deep inspecting 25 highway corridors across Assam, Meghalaya, Arunachal, Nagaland, Manipur, Mizoram, Tripura, & Sikkim.
          </p>
        </div>

        {/* Dropdown Route Selector */}
        <div className="w-full md:w-80">
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Select Highway Corridor:
          </label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full bg-slate-900/90 text-cyan-700 dark:text-cyan-300 font-semibold text-xs py-2.5 px-3 rounded-xl border border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.name} ({r.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Corridor Intelligence Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Corridor Hero Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">{route.id}</span>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">{route.name}</h2>
                <p className="text-xs text-[var(--text-muted)]">{route.sector} • Length: {route.lengthKm} km</p>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  route.status === 'clear' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
                  route.status === 'at-risk' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' :
                  'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 animate-pulse'
                }`}>
                  {route.status === 'clear' ? '🟢 CLEAR' : route.status === 'at-risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                </span>
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Risk Score</span>
                <p className="text-xl font-extrabold text-cyan-700 dark:text-cyan-300 mt-0.5">{route.risk}%</p>
              </div>

              <div className="glass-card p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Landslide State</span>
                <p className={`text-sm font-extrabold uppercase mt-1 ${
                  route.landslideRisk === 'CLEAR' ? 'text-emerald-700 dark:text-emerald-300' :
                  route.landslideRisk === 'MONITOR' ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {route.landslideRisk === 'CLEAR' ? '🟢 CLEAR' : route.landslideRisk === 'MONITOR' ? '🟡 MONITOR' : '🔴 BLOCKED'}
                </p>
              </div>

              <div className="glass-card p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Rainfall Risk</span>
                <p className={`text-sm font-extrabold mt-1 ${rainInfo.color}`}>{route.rainRisk}%</p>
              </div>

              <div className="glass-card p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Visibility</span>
                <p className={`text-sm font-extrabold mt-1 ${visibilityInfo.color}`}>{route.visibility} km</p>
              </div>
            </div>

            {/* Live Update Timestamps */}
            <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                <Clock className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                <span>Last updated {formatTimeFriendly(route.lastUpdated)}</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-mono">
                <Radio className="w-4 h-4 text-emerald-700 dark:text-emerald-300 animate-pulse" />
                <span>Next expected update in <strong>{route.nextUpdateMinutes} minutes</strong></span>
              </div>
            </div>
          </div>

          {/* Assigned Officer & Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Assigned Field Officer & Ground Intelligence</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Officer Profile</span>
                <h4 className="text-base font-bold text-[var(--text-primary)]">{assignedOfficer?.name || 'Unassigned officer'}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{assignedOfficer?.rank || 'No rank available'}</p>
                <p className="text-xs text-[var(--text-muted)]">{assignedOfficer?.department || 'No department assigned'}</p>
                {assignedOfficer && getTelHref(assignedOfficer.controlRoom) ? (
                  <a
                    href={getTelHref(assignedOfficer.controlRoom) || undefined}
                    className="pt-1 text-xs font-mono text-emerald-700 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                    aria-label={`Call ${assignedOfficer.name}`}
                  >
                    Control Room: {assignedOfficer.controlRoom}
                  </a>
                ) : (
                  <p className="pt-1 text-xs font-mono text-[var(--text-muted)] dark:text-slate-400">Control Room: Not available</p>
                )}
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Ground Observation</span>
                <p className="text-xs text-[var(--text-secondary)] italic bg-slate-900/60 p-3 rounded-lg border border-white/5">
                  "{assignedOfficer?.lastReport || 'No field report is available for this corridor.'}"
                </p>
                {assignedOfficer && (
                  <p className="text-[10px] text-[var(--text-muted)] text-right">
                    Reported {formatTimeFriendly(assignedOfficer.lastReportAt || assignedOfficer.lastUpdate)}
                  </p>
                )}
                <p className="text-[10px] text-[var(--text-muted)] text-right">Confidence Score: {route.confidence}%</p>
              </div>
            </div>
          </div>

        </div>

        {/* Corridor List Sidebar (1 Col) */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider border-b border-white/10 pb-2">
            All 25 Highway Corridors
          </h3>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {routes.map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  r.id === selectedRouteId
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-[var(--text-primary)]'
                    : 'glass-card border-white/10 text-[var(--text-secondary)] hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-cyan-700 dark:text-cyan-300 font-mono">{r.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                    r.status === 'clear' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                    r.status === 'at-risk' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] mt-1 truncate">{r.name}</h4>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                  <span>Risk: {r.risk}%</span>
                  <span>Landslide: {r.landslideRisk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
