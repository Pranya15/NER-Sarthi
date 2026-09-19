import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CloudRain,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Mountain,
  Shield,
  PhoneCall,
  MapPin,
  Radio,
  BadgeCheck,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import weatherData from '../../data/weather.json';
import { getTelHref } from '../../utils/contact';
import { formatTimeFriendly } from '../../utils/timeUtils';

export const BasicDashboard: React.FC = () => {
  const {
    routes,
    officers,
    selectedRoute,
    setSelectedRoute,
    simulateLandslide,
    simulateHeavyRain,
    clearRoute,
    simulatedTime,
    theme,
    t
  } = useApp();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    selectedRoute?.id || routes[0]?.id || 'R-001'
  );
  const [timeRange, setTimeRange] = useState<'6h' | '12h' | '24h'>('12h');

  const route = routes.find(r => r.id === selectedRouteId) || routes[0];

  if (!route) {
    return (
      <div className="glass-panel rounded-2xl border border-white/10 p-8 text-center text-sm text-[var(--text-muted)]">
        Operational route data is not available yet. Please try again shortly.
      </div>
    );
  }

  const matchedWeather = weatherData.find(w =>
    w.district.toLowerCase().includes(route.destination.toLowerCase()) ||
    w.state.toLowerCase().includes(route.sector.toLowerCase()) ||
    route.name.toLowerCase().includes(w.district.toLowerCase())
  ) || weatherData[0];

  const officer = officers.find(o =>
    o.id === route.assignedOfficerId ||
    o.name.toLowerCase() === route.assignedOfficerName?.toLowerCase() ||
    o.sector.toLowerCase().includes(route.sector.toLowerCase())
  ) || {
    id: route.assignedOfficerId,
    name: route.assignedOfficerName || 'Unassigned officer',
    department: 'No department assigned',
    rank: 'Field operations',
    controlRoom: 'Unavailable',
    status: 'On Break' as const,
    location: 'Unassigned',
    lat: 0,
    lng: 0,
    lastUpdate: 'Not available',
    lastReport: 'No field report is available for this corridor.',
    sector: route.sector,
  };
  const officerPhoneHref = getTelHref(officer.controlRoom);

  const isBlocked = route.status === 'blocked' || route.landslideRisk === 'BLOCKED';
  const isAtRisk   = route.status === 'at-risk'  || route.landslideRisk === 'MONITOR';

  const currentStatusState: 'clear' | 'at-risk' | 'blocked' =
    isBlocked ? 'blocked' : isAtRisk ? 'at-risk' : 'clear';

  const handleStatusToggle = (targetStatus: 'clear' | 'at-risk' | 'blocked') => {
    if (targetStatus === 'blocked')       simulateLandslide(route.id);
    else if (targetStatus === 'at-risk')  simulateHeavyRain(route.id);
    else                                  clearRoute(route.id);
  };

  const clearanceTimeStr = isBlocked
    ? (route.landslideProbability > 85 ? '5h 30m' : '3h 45m')
    : isAtRisk ? '1h 15m' : `0 min (${t('clear', 'Clear')})`;

  const clearancePercent = isBlocked ? 35 : isAtRisk ? 75 : 100;

  const formatChartTime = (offsetHours: number, markCurrent = false) => {
    const chartTime = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
    const label = chartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return markCurrent ? `${label} (Now)` : label;
  };

  // ── Chart data ─────────────────────────────────────────────────────────────
  const landslideTrendData = timeRange === '6h' ? [
    { time: formatChartTime(-3), prob: Math.max(10, route.landslideProbability - 15) },
    { time: formatChartTime(-1), prob: Math.max(15, route.landslideProbability - 5) },
    { time: formatChartTime(0, true), prob: route.landslideProbability },
    { time: formatChartTime(1), prob: Math.min(98, isBlocked ? route.landslideProbability - 5 : route.landslideProbability + 2) },
    { time: formatChartTime(3), prob: Math.max(10, route.landslideProbability - 20) },
  ] : timeRange === '12h' ? [
    { time: formatChartTime(-6), prob: Math.max(5,  route.landslideProbability - 25) },
    { time: formatChartTime(-4), prob: Math.max(10, route.landslideProbability - 15) },
    { time: formatChartTime(-2), prob: Math.max(15, route.landslideProbability - 5) },
    { time: formatChartTime(0, true), prob: route.landslideProbability },
    { time: formatChartTime(2), prob: Math.min(98, isBlocked ? route.landslideProbability - 10 : route.landslideProbability + 5) },
    { time: formatChartTime(4), prob: Math.max(10, route.landslideProbability - 25) },
    { time: formatChartTime(6), prob: Math.max(5,  route.landslideProbability - 40) },
  ] : [
    { time: formatChartTime(-12), prob: 15 },
    { time: formatChartTime(-8), prob: 25 },
    { time: formatChartTime(-4), prob: Math.max(10, route.landslideProbability - 15) },
    { time: formatChartTime(0, true), prob: route.landslideProbability },
    { time: formatChartTime(4), prob: Math.max(10, route.landslideProbability - 25) },
    { time: formatChartTime(8), prob: Math.max(5,  route.landslideProbability - 45) },
    { time: formatChartTime(12), prob: 10 },
  ];

  const weatherTrendData = [
    { hour: formatChartTime(-4), rain: Math.round(matchedWeather.rainfall * 0.40), temp: matchedWeather.temperature - 2 },
    { hour: formatChartTime(-2), rain: Math.round(matchedWeather.rainfall * 0.75), temp: matchedWeather.temperature - 1 },
    { hour: formatChartTime(0, true), rain: matchedWeather.rainfall,                    temp: matchedWeather.temperature },
    { hour: formatChartTime(2), rain: Math.round(matchedWeather.rainfall * 1.15), temp: matchedWeather.temperature + 1 },
    { hour: formatChartTime(4), rain: Math.round(matchedWeather.rainfall * 0.80), temp: matchedWeather.temperature },
    { hour: formatChartTime(6), rain: Math.round(matchedWeather.rainfall * 0.35), temp: matchedWeather.temperature - 2 },
  ];

  const riskBreakdownData = [
    { name: t('landslideRiskForecast', 'Landslide Hazard'), value: Math.round(route.landslideProbability * 0.4), color: '#ef4444' },
    { name: t('weatherPrecipitation', 'Monsoon Rainfall'), value: Math.round(route.rainRisk * 0.3),             color: '#06b6d4' },
    { name: 'Terrain Gradient',                             value: 20,                                            color: '#f59e0b' },
    { name: 'Fog / Low Vis',                                value: Math.round((10 - route.visibility) * 3),      color: '#8b5cf6' },
  ];

  // ── Theme-sensitive helpers ─────────────────────────────────────────────────
  const isDark = theme === 'dark';

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#0f172a'  : '#ffffff',
    border:          isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    color:           isDark ? '#f8fafc'  : '#0f172a',
    borderRadius:    '10px',
    fontSize:        '11px',
    boxShadow:       isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.08)',
  };
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  // ── Risk-status colour helpers ──────────────────────────────────────────────
  const riskStroke = isBlocked ? '#ef4444' : isAtRisk ? '#f59e0b' : '#10b981';

  // ── Card border for status chip ─────────────────────────────────────────────
  const chipCls = isBlocked
    ? 'bg-red-100    dark:bg-red-500/20 text-red-700    dark:text-red-300    border-red-400    dark:border-red-500/50 animate-pulse'
    : isAtRisk
    ? 'bg-amber-100  dark:bg-amber-500/20 text-amber-800 dark:text-amber-300  border-amber-400  dark:border-amber-500/50'
    : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/50';

  return (
    <div className="basic-route-dashboard relative min-h-[700px] w-full overflow-hidden rounded-3xl p-4 sm:p-7 shadow-lg space-y-6 transition-colors duration-300
                    bg-white dark:bg-slate-950
                    border border-slate-200 dark:border-white/10
                    text-slate-900 dark:text-slate-100">

      {/* ═══════════════════  FOREGROUND CONTENT  ═══════════════════════════ */}
      <div className="relative z-10 space-y-6">

        {/* ── TOP BAR: Logo + Route selector + Status toggle ────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4
                        border-b border-slate-200 dark:border-white/10">

          {/* Logo & route subtitle */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700
                            p-0.5 shadow-md shadow-cyan-500/25 flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Mountain className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  NER-SAARTHI
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                 bg-cyan-100 dark:bg-cyan-500/15
                                 text-cyan-800 dark:text-cyan-300
                                 border border-cyan-400 dark:border-cyan-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {route.origin} → {route.destination} ({route.lengthKm} km)
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Route dropdown */}
            <select
              value={selectedRouteId}
              onChange={e => {
                setSelectedRouteId(e.target.value);
                const found = routes.find(r => r.id === e.target.value);
                if (found) setSelectedRoute(found);
              }}
              className="bg-slate-50 dark:bg-slate-900
                         text-slate-900 dark:text-white
                         font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl
                         border border-slate-300 dark:border-cyan-500/40
                         focus:outline-none focus:ring-2 focus:ring-cyan-500
                         cursor-pointer shadow-sm"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  🛣️ {r.name}
                </option>
              ))}
            </select>

            {/* 3-way status toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-2xl
                            border border-slate-300 dark:border-white/15 shadow-sm">
              {/* Clear */}
              <button type="button" onClick={() => handleStatusToggle('clear')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  currentStatusState === 'clear'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-[var(--text-on-action)] shadow-md scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('clear', 'Clear')}</span>
              </button>

              {/* At-Risk */}
              <button type="button" onClick={() => handleStatusToggle('at-risk')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  currentStatusState === 'at-risk'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-[var(--text-on-action)] shadow-md scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300'
                }`}>
                <CloudRain className="w-3.5 h-3.5" />
                <span>{t('atRisk', 'At-Risk')}</span>
              </button>

              {/* Blocked */}
              <button type="button" onClick={() => handleStatusToggle('blocked')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  currentStatusState === 'blocked'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-[var(--text-on-action)] shadow-md animate-pulse scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-300'
                }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('blocked', 'Blocked')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TIMEFRAME TOGGLE ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t('liveForecastWindow', 'Live Forecast Window:')}
            </span>
          </div>
          <div className="inline-flex items-center bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-xl
                          border border-slate-300 dark:border-white/10">
            {(['6h', '12h', '24h'] as const).map(range => (
              <button key={range} onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border border-cyan-400 dark:border-cyan-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ═════════════  4 GRAPH CARDS  ═════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* GRAPH 1 – Landslide Risk Forecast */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('landslideRiskForecast', 'Landslide Risk Forecast')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {timeRange.toUpperCase()} {t('slopeProbabilityCurve', 'Slope Probability Curve')}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${chipCls}`}>
                {route.landslideRisk} ({route.landslideProbability}%)
              </span>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={landslideTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={riskStroke} stopOpacity={0.75} />
                      <stop offset="95%" stopColor={riskStroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke={axisColor} fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke={axisColor} fontSize={10} tickLine={false} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Probability']} />
                  <Area type="monotone" dataKey="prob" stroke={riskStroke} strokeWidth={3}
                        fillOpacity={1} fill="url(#lsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-white/10
                            text-slate-500 dark:text-slate-400">
              <span>{t('safeLine', 'Safe Line')}: <strong className="text-slate-800 dark:text-slate-200">30%</strong></span>
              <span>{t('currentRisk', 'Current Risk')}: <strong className={isBlocked ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}>
                {route.landslideProbability}%
              </strong></span>
            </div>
          </div>

          {/* GRAPH 2 – Weather & Precipitation */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/15 flex items-center justify-center">
                  <CloudRain className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('weatherPrecipitation', 'Weather & Precipitation')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('rainfallAndTemp', 'Rainfall (mm) & Temperature (°C)')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                <span>{matchedWeather.rainfall} mm</span>
                <span>•</span>
                <span>{matchedWeather.temperature}°C</span>
              </div>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weatherTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke={axisColor} fontSize={10} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={10} tickLine={false} unit="mm" />
                  <Tooltip contentStyle={tooltipStyle}
                    formatter={(v: number, n: string) => [n === 'rain' ? `${v} mm` : `${v}°C`, n === 'rain' ? 'Rainfall' : 'Temp']} />
                  <Bar dataKey="rain" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 text-center text-xs pt-2 border-t border-slate-200 dark:border-white/10
                            text-slate-700 dark:text-slate-300">
              <div>{t('rain', 'Rain')}: <strong className="text-cyan-800 dark:text-cyan-300">{matchedWeather.rainProbability}%</strong></div>
              <div>{t('vis', 'Vis')}: <strong className="text-blue-800 dark:text-blue-300">{route.visibility} km</strong></div>
              <div>{t('wind', 'Wind')}: <strong className="text-emerald-800 dark:text-emerald-300">{matchedWeather.wind} km/h</strong></div>
            </div>
          </div>

          {/* GRAPH 3 – Route Risk Donut */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('routeRiskBreakdown', 'Route Risk Breakdown')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('hazardDistribution', 'Hazard Weight Distribution')}
                  </p>
                </div>
              </div>
              <span className={`text-base font-black ${
                route.risk >= 70 ? 'text-red-600 dark:text-red-400' : route.risk >= 40 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                {route.risk}% Risk
              </span>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskBreakdownData} cx="50%" cy="50%"
                       innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {riskBreakdownData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}% Weight`, 'Impact']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{route.risk}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  {t('totalRisk', 'Total Risk')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-slate-200 dark:border-white/10
                            text-slate-700 dark:text-slate-300">
              {riskBreakdownData.map((item, i) => (
                <div key={i} className="flex items-center space-x-1.5 truncate">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GRAPH 4 – Time to Get Clear */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('timeToGetClear', 'Time to Get Clear')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('clearanceEtaAndStatus', 'Clearance ETA & Road Status')}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300">
                Update: {route.nextUpdateMinutes}m
              </span>
            </div>

            <div className="h-48 w-full flex flex-col items-center justify-center">
              <div className="text-center space-y-1">
                <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isBlocked ? 'text-red-600 dark:text-red-400' : isAtRisk ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}>
                  {clearanceTimeStr}
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {isBlocked ? t('activeClearanceUnderway', 'Active Clearance Underway') : isAtRisk ? t('trafficMovingWithCaution', 'Traffic Moving with Caution') : t('highwayOpenAndClear', 'Highway Open & Clear')}
                </p>
              </div>

              <div className="w-full max-w-xs mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>{t('progress', 'Progress')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{clearancePercent}% {t('ready', 'Ready')}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 p-0.5 overflow-hidden
                                border border-slate-300 dark:border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBlocked ? 'bg-gradient-to-r from-red-600 to-amber-500'
                                : isAtRisk ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                                : 'bg-emerald-500'
                    }`}
                    style={{ width: `${clearancePercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-white/10
                            text-slate-600 dark:text-slate-400">
              <span>Crew: <strong className="text-slate-800 dark:text-slate-200">
                {isBlocked ? 'Heavy Earthmovers on Site' : 'Patrol Verified'}
              </strong></span>
              <span>Ref: <strong className="text-cyan-800 dark:text-cyan-300">{simulatedTime}</strong></span>
            </div>
          </div>

        </div>{/* end grid */}

        {/* ═════════════  FIELD OFFICER CARD / ALL CLEAR BANNER  ═════════ */}
        {isBlocked || isAtRisk ? (
          <div className="rounded-2xl p-5 border border-red-300 dark:border-red-500/40
                          bg-red-50 dark:bg-red-950/40 shadow-md transition-all">

            {/* Header strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3
                            border-b border-red-200 dark:border-red-500/20">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-red-800 dark:text-red-300">
                  {t('fieldOfficerLandslide', 'Ministry of DoNER • On-Site Field Officer at Landslide')}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-[var(--text-on-action)] animate-pulse">
                🚨 {t('onSiteActive', 'ON-SITE ACTIVE')}
              </span>
            </div>

            {/* ID Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">

              {/* Photo & Identity */}
              <div className="flex items-center space-x-4 md:col-span-1
                              border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10
                              pb-3 md:pb-0 md:pr-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-blue-700 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-[14px] bg-slate-100 dark:bg-slate-900
                                    flex items-center justify-center text-slate-900 dark:text-white font-black text-xl">
                      {officer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                                   bg-emerald-500 border-2 border-white dark:border-slate-900
                                   flex items-center justify-center text-[var(--text-on-action)] text-[9px] font-bold">
                    ✓
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{officer.name}</h4>
                  <p className="text-xs font-bold text-red-700 dark:text-red-300">{officer.rank}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{officer.department}</p>
                  <div className="mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold
                                     bg-slate-200 dark:bg-white/10
                                     text-slate-900 dark:text-cyan-300">
                      ID: {officer.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5 text-xs md:col-span-1
                              border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10
                              pb-3 md:pb-0 md:pr-4">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Landslide Post: {officer.location}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 flex-shrink-0" />
                  <span>Sector: <strong>{officer.sector}</strong></span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  GPS: <span className="font-mono text-cyan-800 dark:text-cyan-300 font-semibold">
                    {officer.lat.toFixed(4)}° N, {officer.lng.toFixed(4)}° E
                  </span>
                </p>
              </div>

              {/* Dispatch note */}
              <div className="space-y-2 text-xs md:col-span-1">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/90
                                border border-slate-200 dark:border-white/10
                                text-slate-800 dark:text-slate-300 text-[11px] leading-relaxed shadow-sm">
                  <span className="font-bold text-red-700 dark:text-red-300">{t('latestFieldDispatch', 'Latest Field Dispatch')}:</span>{' '}
                  "{officer.lastReport}"
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400">{t('controlLine', 'Control Line')}:</span>
                  {officerPhoneHref ? (
                    <a
                      href={officerPhoneHref}
                      className="flex items-center space-x-1 font-mono font-bold text-cyan-800 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
                      aria-label={`Call ${officer.name}`}
                    >
                      <PhoneCall className="h-3 w-3 text-cyan-700 dark:text-cyan-400" />
                      <span>{officer.controlRoom}</span>
                    </a>
                  ) : (
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">Not available</span>
                  )}
                </div>
              </div>

            </div>
          </div>

        ) : (
          /* ALL CLEAR BANNER */
          <div className="rounded-2xl p-5 border border-emerald-300 dark:border-emerald-500/40
                          bg-emerald-50 dark:bg-emerald-950/30 shadow-sm transition-all
                          flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl flex-shrink-0
                              bg-emerald-100 dark:bg-emerald-500/15
                              border border-emerald-400 dark:border-emerald-500/30
                              flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {t('corridorAllClear', 'CORRIDOR IS ALL CLEAR!')}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                   bg-emerald-100 dark:bg-emerald-500/20
                                   text-emerald-900 dark:text-emerald-300
                                   border border-emerald-400 dark:border-emerald-500/40">
                    {t('normalFlow', 'NORMAL FLOW')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {t('noActiveLandslide', 'No active landslide or road damage detected. No emergency field officer deployment required.')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold
                            text-emerald-900 dark:text-emerald-300
                            bg-emerald-100 dark:bg-emerald-950/50
                            px-3.5 py-2 rounded-xl
                            border border-emerald-300 dark:border-emerald-500/30 flex-shrink-0">
              <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('radarVerified', 'Routine Radar Verified')}</span>
            </div>
          </div>
        )}

      </div>{/* end foreground */}
    </div>
  );
};
