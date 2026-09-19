import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Truck, MapPin, Clock, ShieldAlert, User } from 'lucide-react';

export const VehicleDetailsDrawer: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, routes, setSelectedRoute } = useApp();

  if (!selectedVehicle) return null;

  const matchedRoute = routes.find(r => r.id === selectedVehicle.routeId);

  return (
    <div className="fixed inset-y-0 right-0 z-[2200] w-full max-w-sm glass-panel border-l border-white/10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">VEHICLE</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedVehicle.status === 'Delayed' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              }`}>
                {selectedVehicle.status}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] mt-1">{selectedVehicle.id}</h2>
            <p className="text-xs text-[var(--text-muted)]">Driver: {selectedVehicle.driverName || 'Authorized Driver'}</p>
          </div>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="p-2 rounded-xl glass-panel-light text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cargo & Destination */}
        <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Cargo Type:</span>
            <span className="font-bold text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {selectedVehicle.cargo}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
            <span className="text-[var(--text-muted)]">Origin → Destination:</span>
            <span className="font-bold text-[var(--text-primary)]">{selectedVehicle.origin} → {selectedVehicle.destination}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
            <span className="text-[var(--text-muted)]">Current Speed:</span>
            <span className="font-bold text-[var(--text-secondary)]">{selectedVehicle.speed} km/h</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
            <span className="text-[var(--text-muted)]">Estimated Delivery:</span>
            <span className="font-bold text-cyan-700 dark:text-cyan-300 font-mono">{selectedVehicle.eta}</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-muted)]">Shipment Risk Score:</span>
            <p className="text-xl font-extrabold text-amber-700 dark:text-amber-300">{selectedVehicle.risk}%</p>
          </div>
          <ShieldAlert className="w-8 h-8 text-amber-700/80 dark:text-amber-300/80" />
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        {matchedRoute && (
          <button
            onClick={() => {
              setSelectedRoute(matchedRoute);
              setSelectedVehicle(null);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>View Assigned Highway Polyline</span>
          </button>
        )}
      </div>

    </div>
  );
};
