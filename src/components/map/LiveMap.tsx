import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { RouteSegment, Vehicle, FieldOfficer } from '../../types';
import { getTelHref } from '../../utils/contact';
import { Truck, Shield, AlertTriangle, Layers } from 'lucide-react';

// Custom SVG Leaflet Icons
const createVehicleIcon = (status: string, cargo: string) => {
  const isDelayed = status === 'Delayed';
  const color = isDelayed ? '#f59e0b' : '#06b6d4';
  
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/90 border-2 border-[${color}] shadow-lg shadow-cyan-500/20 transform transition-transform hover:scale-125 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
        ${isDelayed ? `<span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createOfficerIcon = (status: string) => {
  return L.divIcon({
    className: 'custom-officer-marker',
    html: `
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/90 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to handle map centering control
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const LiveMap: React.FC = () => {
  const { routes, vehicles, officers, selectedRoute, setSelectedRoute, setSelectedVehicle, setSelectedOfficer, theme } = useApp();

  const defaultCenter: [number, number] = [26.2, 92.5]; // Centered on Assam / NER hub
  const defaultZoom = 7;

  // Memoized polylines for fast map performance
  const routePolylines = useMemo(() => {
    return routes.map(route => {
      let color = '#10b981'; // Green Clear
      let weight = 4;
      let dashArray = undefined;

      if (route.status === 'at-risk') {
        color = '#f59e0b'; // Yellow At Risk
        weight = 5;
      } else if (route.status === 'blocked') {
        color = '#ef4444'; // Red Blocked
        weight = 6;
        dashArray = '8, 8';
      }

      if (selectedRoute?.id === route.id) {
        weight += 3;
      }

      return {
        route,
        color,
        weight,
        dashArray
      };
    });
  }, [routes, selectedRoute]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-glass">
      {/* Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[420px]"
      >
        <MapController center={defaultCenter} zoom={defaultZoom} />
        
        {/* Theme-aware base map keeps route labels and popups readable in either mode. */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | NER-Sarthi DoNER'
          url={`https://{s}.basemaps.cartocdn.com/${theme === 'dark' ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`}
          maxZoom={18}
        />

        {/* Render Road Segments (Polylines) */}
        {routePolylines.map(({ route, color, weight, dashArray }) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            pathOptions={{
              color,
              weight,
              dashArray,
              opacity: selectedRoute?.id === route.id ? 1.0 : 0.8,
            }}
            eventHandlers={{
              click: () => {
                setSelectedRoute(route);
              }
            }}
          >
            <Popup>
              <div className="p-2 space-y-1.5 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">{route.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    route.status === 'clear' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
                    route.status === 'at-risk' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' :
                    'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                  }`}>
                    {route.status === 'clear' ? '🟢 CLEAR' : route.status === 'at-risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{route.name}</h4>
                <div className="text-xs text-[var(--text-secondary)] space-y-1 pt-1 border-t border-slate-700">
                  <div className="flex justify-between"><span>Risk Score:</span> <span className="font-bold">{route.risk}%</span></div>
                  <div className="flex justify-between"><span>Landslide:</span> <span className="font-bold">{route.landslideRisk}</span></div>
                  <div className="flex justify-between"><span>Visibility:</span> <span className="font-bold">{route.visibility} km</span></div>
                </div>
                <button
                  onClick={() => setSelectedRoute(route)}
                  className="w-full mt-2 py-1 px-2 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-[var(--text-on-action)] transition-colors"
                >
                  Inspect Corridor Intelligence
                </button>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Render Simulated Moving Vehicles */}
        {vehicles.map(v => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={createVehicleIcon(v.status, v.cargo)}
            eventHandlers={{
              click: () => setSelectedVehicle(v)
            }}
          >
            <Popup>
              <div className="p-2 space-y-1 min-w-[190px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">Vehicle {v.id}</span>
                  <span className={`font-semibold text-[10px] px-1.5 py-0.5 rounded ${
                    v.status === 'Delayed' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] pt-1 space-y-1">
                  <p><strong className="text-[var(--text-muted)]">Cargo:</strong> {v.cargo}</p>
                  <p><strong className="text-[var(--text-muted)]">Destination:</strong> {v.destination}</p>
                  <p><strong className="text-[var(--text-muted)]">ETA:</strong> <span className="text-cyan-700 dark:text-cyan-300 font-bold">{v.eta}</span></p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(v)}
                  className="w-full mt-2 py-1 px-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                >
                  View Shipment Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Field Officer Markers */}
        {officers.map(o => (
          <Marker
            key={o.id}
            position={[o.lat, o.lng]}
            icon={createOfficerIcon(o.status)}
            eventHandlers={{
              click: () => setSelectedOfficer(o)
            }}
          >
            <Popup>
              <div className="p-2 space-y-1 min-w-[200px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">FIELD OFFICER</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    🟢 {o.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{o.name}</h4>
                <p className="text-xs text-[var(--text-muted)]">{o.rank} • {o.department}</p>
                <div className="text-xs text-[var(--text-secondary)] pt-1">
                  <p><strong className="text-[var(--text-muted)]">Location:</strong> {o.location}</p>
                  <p>
                    <strong className="text-[var(--text-muted)]">Control Room:</strong>{' '}
                    {getTelHref(o.controlRoom) ? (
                      <a
                        href={getTelHref(o.controlRoom) || undefined}
                        className="font-mono text-emerald-700 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                        aria-label={`Call ${o.name}`}
                      >
                        {o.controlRoom}
                      </a>
                    ) : 'Not available'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOfficer(o)}
                  className="w-full mt-2 py-1 px-2 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-[var(--text-on-action)]"
                >
                  View Field Report
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] glass-panel p-3 rounded-xl text-xs space-y-2 border border-white/10 hidden sm:block">
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] font-bold border-b border-white/10 pb-1">
            <Layers className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300" />
          <span>NER Corridor Status</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded"></span>
            <span className="text-[var(--text-secondary)]">🟢 CLEAR</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded"></span>
            <span className="text-[var(--text-secondary)]">🟡 AT RISK</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-red-500 rounded"></span>
            <span className="text-[var(--text-secondary)]">🔴 BLOCKED</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300" />
            <span className="text-[var(--text-secondary)]">15 Vehicles</span>
          </div>
          <div className="flex items-center space-x-1.5 col-span-2">
            <Shield className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span className="text-[var(--text-secondary)]">12 Field Officers</span>
          </div>
        </div>
      </div>

      {/* Demo Data Watermark */}
      <div className="absolute top-3 right-3 z-[1000] glass-panel px-3 py-1 rounded-full text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 shadow-lg">
        <AlertTriangle className="w-3 h-3 text-amber-700 dark:text-amber-300" />
        <span>DEMO DATA — NOT FOR REAL-WORLD DECISIONS</span>
      </div>
    </div>
  );
};
