import React from 'react';
import { useApp } from '../context/AppContext';
import { exportOperationalReportCSV } from '../utils/reportExporter';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { BarChart3, Download, ShieldAlert, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { routes, vehicles, officers, theme } = useApp();
  const chartTooltipStyle = {
    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
    borderColor: theme === 'dark' ? '#06b6d4' : '#9ab3a0',
    color: theme === 'dark' ? '#f8fafc' : '#25342b',
    borderRadius: '8px',
  };
  const chartItemStyle = {
    color: theme === 'dark' ? '#38bdf8' : '#3f604a',
    fontSize: '12px',
  };
  const chartAxisColor = theme === 'dark' ? '#94a3b8' : '#5d6d61';

  // District Disruption Bar Chart Data
  const districtData = [
    { district: 'E. Khasi Hills', disruptions: 28, color: '#ef4444' },
    { district: 'Cachar', disruptions: 22, color: '#f59e0b' },
    { district: 'Kohima', disruptions: 19, color: '#f59e0b' },
    { district: 'Aizawl', disruptions: 16, color: '#f59e0b' },
    { district: 'Gangtok', disruptions: 14, color: '#3b82f6' },
    { district: 'Kamrup Metro', disruptions: 9, color: '#10b981' },
    { district: 'Imphal West', disruptions: 11, color: '#3b82f6' },
    { district: 'West Tripura', disruptions: 6, color: '#10b981' }
  ];

  // Disruption Causes Pie Chart Data
  const causesData = [
    { name: 'Landslide', value: 34, color: '#ef4444' },
    { name: 'Flood', value: 27, color: '#f59e0b' },
    { name: 'Road Damage', value: 18, color: '#3b82f6' },
    { name: 'Accident', value: 13, color: '#8b5cf6' },
    { name: 'Other Hazards', value: 8, color: '#64748b' }
  ];

  const handleDownloadCSV = () => {
    exportOperationalReportCSV(routes, vehicles, officers);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
            <span>Analytics & Operational Reports</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Historical disruption trends, district vulnerability indexes, & exportable intelligence records.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[var(--text-on-action)] font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Operational CSV Report</span>
        </button>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Total 6-Mo Disruptions</span>
          <p className="text-2xl font-extrabold text-[var(--text-primary)]">125 Incidents</p>
          <p className="text-[11px] text-cyan-700 dark:text-cyan-300">Across 8 NER States</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Avg Clearance Time</span>
            <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">7.8 Hours</p>
          <p className="text-[11px] text-[var(--text-muted)]">BRO & PWD Joint Ops</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Most Affected District</span>
            <p className="text-xl font-extrabold text-red-700 dark:text-red-300">East Khasi Hills</p>
          <p className="text-[11px] text-[var(--text-muted)]">28 Landslide Incidents</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Safest Highway Corridor</span>
            <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">Guwahati-Bongaigaon</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">NH-27 Expressway</p>
        </div>
      </div>

      {/* Recharts Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Disruptions Per District (Bar Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
              Disruptions Per District (Last 6 Months)
            </h3>
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300">Incident Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="district" 
                  stroke={chartAxisColor}
                  fontSize={10} 
                  angle={-30} 
                  textAnchor="end" 
                />
                <YAxis stroke={chartAxisColor} fontSize={10} />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  itemStyle={chartItemStyle}
                />
                <Bar dataKey="disruptions" radius={[6, 6, 0, 0]}>
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Disruption Causes (Pie Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
              Primary Disruption Categorization
            </h3>
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300">Percentage Split</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={causesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {causesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
