import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CargoType, LogisticsAnalysisResult } from '../types';
import { analyzeLogisticsRoutes } from '../utils/riskEngine';
import { Truck, Cpu, ShieldCheck, DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

const CITIES = [
  'Guwahati',
  'Shillong',
  'Tezpur',
  'Silchar',
  'Agartala',
  'Dimapur',
  'Kohima',
  'Imphal',
  'Aizawl',
  'Gangtok',
  'Itanagar',
  'Jorhat',
  'Dibrugarh'
];

export const LogisticsPlannerPage: React.FC = () => {
  const { routes, showToast } = useApp();

  const [origin, setOrigin] = useState<string>('Guwahati');
  const [destination, setDestination] = useState<string>('Shillong');
  const [cargo, setCargo] = useState<CargoType>('Medicine');
  const [selectedDispatchId, setSelectedDispatchId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<LogisticsAnalysisResult | null>(() => 
    analyzeLogisticsRoutes('Guwahati', 'Shillong', 'Medicine', routes)
  );

  const handleAnalyze = () => {
    if (origin === destination) {
      alert('Origin and Destination must be different!');
      return;
    }
    const result = analyzeLogisticsRoutes(origin, destination, cargo, routes);
    setAnalysisResult(result);
    setSelectedDispatchId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-[var(--text-on-action)] shadow-lg shadow-cyan-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">AI Logistics & Route Planner</h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                AI SIMULATION
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Predictive ETA, cargo urgency weighting, and terrain vulnerability scoring for North East India.
            </p>
          </div>
        </div>
      </div>

      {/* Input Selection Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs font-extrabold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
          Configure Logistics Dispatch Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Origin */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Start Origin Hub:</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-900/90 text-[var(--text-primary)] dark:text-white font-semibold text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">End Destination Hub:</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-900/90 text-[var(--text-primary)] dark:text-white font-semibold text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Cargo Type */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Cargo Consignment Type:</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value as CargoType)}
              className="w-full bg-slate-900/90 text-[var(--text-primary)] dark:text-white font-semibold text-xs py-2.5 px-3 rounded-xl border border-white/15 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="Medicine">Medicine (Urgency: 95/100 • Safety First)</option>
              <option value="Food">Food & Ration (Urgency: 80/100 • Balanced)</option>
              <option value="Agri-Produce">Agri-Produce (Urgency: 75/100 • Perishable)</option>
              <option value="Construction Material">Construction Material (Urgency: 55/100 • Cost Focus)</option>
            </select>
          </div>

        </div>

        <button
          onClick={handleAnalyze}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[var(--text-on-action)] font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-[0.99]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Analyze & Generate Optimal Route Recommendation</span>
        </button>
      </div>

      {/* Analysis Output Results */}
      {analysisResult && (
        <div className="space-y-6">
          
          {/* AI Explanation Banner */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 bg-[var(--bg-panel-subtle)] dark:bg-gradient-to-r dark:from-cyan-950/40 dark:via-slate-900 dark:to-blue-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                <span>AI Recommendation Engine Output</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                AI SIMULATION
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              "{analysisResult.explanation}"
            </p>
          </div>

          {/* 3 Route Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysisResult.routeOptions.map((option, idx) => (
              <div
                key={option.id}
                className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  option.isRecommended
                    ? 'border-cyan-400/80 bg-cyan-950/20 shadow-glow-cyan scale-[1.02]'
                    : 'border-white/10 opacity-90'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">OPTION 0{idx + 1}</span>
                    {option.isRecommended ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                        <span>RECOMMENDED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[var(--text-muted)]">ALTERNATIVE</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)]">{option.name}</h3>

                  {/* Key Output Metrics */}
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Total Distance:</span>
                      <span className="font-bold text-[var(--text-primary)]">{option.distanceKm} km</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Base ETA:</span>
                      <span className="font-bold text-[var(--text-secondary)]">{option.baseEtaHours}h</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Risk-Adjusted ETA:</span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-300 font-mono">{option.riskAdjustedEtaHours}h</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Estimated Transit Cost:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">₹{option.estimatedCostRupees.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Delivery Risk:</span>
                      <span className={`font-bold ${option.riskColor}`}>{option.deliveryRiskPercent}% ({option.riskLevel})</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">On-Time Probability:</span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">{option.onTimeProbabilityPercent}%</span>
                    </div>
                  </div>

                  {/* Score breakdown bars */}
                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-[10px]">
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Safety Score:</span>
                      <span className="font-bold text-[var(--text-secondary)]">{option.safetyScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${option.safetyScore}%` }}></div>
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDispatchId(option.id);
                    showToast(`${option.id} selected for ${origin} to ${destination} dispatch.`);
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 ${
                    option.isRecommended
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      : 'glass-panel-light hover:bg-white/10 text-[var(--text-secondary)] border border-white/20'
                  }`}
                >
                  <span>{selectedDispatchId === option.id ? 'Dispatch Selected' : `Select ${option.id} Dispatch`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
