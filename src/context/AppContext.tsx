import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { RouteSegment, Vehicle, FieldOfficer, DisruptionAlert, AppNotification, EmergencyAlert, AlertLevel, FieldReport, StoredUser } from '../types';
import { LanguageCode, getUIText } from '../data/translations';
import routesData from '../data/routes.json';
import vehiclesData from '../data/vehicles.json';
import officersData from '../data/officers.json';
import { loadOperationalData, submitFieldReport as submitFieldReportApi, SubmitFieldReportInput } from '../api';
import { formatLocalTime, normalizeTimestamp } from '../utils/timeUtils';

const readStoredUser = (): StoredUser | null => {
  try {
    const saved = localStorage.getItem('ner_sarthi_auth');
    if (!saved) return null;
    const parsed = JSON.parse(saved) as StoredUser;
    return { ...parsed, loginTime: normalizeTimestamp(parsed.loginTime) };
  } catch {
    localStorage.removeItem('ner_sarthi_auth');
    return null;
  }
};

interface AppContextType {
  currentUser: StoredUser | null;
  isAuthenticated: boolean;
  logout: () => void;
  routes: RouteSegment[];
  vehicles: Vehicle[];
  officers: FieldOfficer[];
  disruptions: DisruptionAlert[];
  fieldReports: FieldReport[];
  selectedRoute: RouteSegment | null;
  selectedVehicle: Vehicle | null;
  selectedOfficer: FieldOfficer | null;
  activeTab: string;
  simulatedTime: string;
  toastMessage: string | null;
  theme: 'dark' | 'light';
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;

  
  // Regional Language Support
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  
  // Notification Center
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  submitFieldReport: (input: SubmitFieldReportInput) => Promise<FieldReport>;
  
  // Emergency Alert Banner
  activeEmergencyAlert: EmergencyAlert | null;
  triggerEmergencyAlert: (alert: {
    alertKey: string;
    severity: AlertLevel;
    region: string;
    routeId?: string;
    routeName: string;
    autoDismissMs?: number;
  }) => void;
  dismissEmergencyAlert: () => void;
  
  // Theme Toggle
  toggleTheme: () => void;
  
  // Selection handlers
  setSelectedRoute: (route: RouteSegment | null) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedOfficer: (officer: FieldOfficer | null) => void;
  setActiveTab: (tab: string) => void;
  
  // Simulation methods
  simulateLandslide: (routeId?: string) => void;
  simulateHeavyRain: (routeId?: string) => void;
  simulateVehicleDelay: (vehicleId?: string) => void;
  clearRoute: (routeId?: string) => void;
  showToast: (msg: string) => void;
  
  // Computed KPI Stats
  kpiStats: {
    activeShipments: number;
    delayedShipments: number;
    highRiskRoutes: number;
    avgTimeSaved: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-001',
    alertKey: 'landslide_critical',
    severity: 'CRITICAL',
    titleKey: 'landslide_critical',
    messageKey: 'landslide_critical',
    region: 'Sikkim / East Sikkim',
    routeId: 'R-008',
    routeName: 'Gangtok – Nathu La Corridor',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'NOTIF-002',
    alertKey: 'landslide_warning',
    severity: 'HIGH',
    titleKey: 'landslide_warning',
    messageKey: 'landslide_warning',
    region: 'Meghalaya / East Khasi Hills',
    routeId: 'R-003',
    routeName: 'Shillong – Silchar Highway',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'NOTIF-003',
    alertKey: 'heavy_rain_warning',
    severity: 'MEDIUM',
    titleKey: 'heavy_rain_warning',
    messageKey: 'heavy_rain_warning',
    region: 'Assam / Sonitpur',
    routeId: 'R-002',
    routeName: 'Guwahati – Tezpur Highway',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: true,
  },
  {
    id: 'NOTIF-004',
    alertKey: 'weather_changing_low',
    severity: 'LOW',
    titleKey: 'weather_changing_low',
    messageKey: 'weather_changing_low',
    region: 'Mizoram / Aizawl',
    routeId: 'R-009',
    routeName: 'Silchar – Aizawl Highway',
    timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
    read: true,
  }
];

const INITIAL_DISRUPTIONS: DisruptionAlert[] = [
  {
    id: 'ALERT-001',
    routeId: 'R-003',
    routeName: 'Shillong – Silchar Highway',
    title: 'Active Landslide & Mudslide Debris',
    severity: 'critical',
    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
    type: 'Landslide',
    description: 'Debris falling at Sonapur tunnel stretch. Route blocked.'
  },
  {
    id: 'ALERT-002',
    routeId: 'R-006',
    routeName: 'Dimapur – Kohima Highway',
    title: 'Road Surface Subsidence',
    severity: 'high',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    type: 'Road Damage',
    description: 'Heavy cargo traffic restricted near Pagla Pahar.'
  },
  {
    id: 'ALERT-003',
    routeId: 'R-001',
    routeName: 'Guwahati – Shillong Corridor',
    title: 'Reduced Fog Visibility & Rain',
    severity: 'medium',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    type: 'Heavy Rainfall',
    description: 'Visibility down to 4.2 km near Nongpoh.'
  },
  {
    id: 'ALERT-004',
    routeId: 'R-009',
    routeName: 'Silchar – Aizawl Highway',
    title: 'Rockfall Clearing Operations',
    severity: 'high',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'Landslide',
    description: 'Single lane traffic moving under PWD supervision.'
  }
];

const INITIAL_ROUTES = (routesData as RouteSegment[]).map((route, index) => ({
  ...route,
  lastUpdated: normalizeTimestamp(route.lastUpdated, 5 + ((index * 7) % 110)),
}));

const INITIAL_OFFICERS = (officersData as FieldOfficer[]).map((officer, index) => {
  const lastUpdate = normalizeTimestamp(officer.lastUpdate, 8 + ((index * 9) % 100));
  return {
    ...officer,
    lastUpdate,
    lastReportAt: normalizeTimestamp(officer.lastReportAt || officer.lastUpdate, 8 + ((index * 9) % 100)),
  };
});

const INITIAL_FIELD_REPORTS: FieldReport[] = INITIAL_OFFICERS.map((officer, index) => ({
  id: `SEED-REPORT-${officer.id}`,
  officerId: officer.id,
  type: 'Field Officer',
  observation: officer.lastReport,
  severity: index % 4 === 0 ? 'high' : 'medium',
  createdAt: officer.lastReportAt || officer.lastUpdate,
}));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => readStoredUser());

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(readStoredUser());
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('ner-sarthi-auth-changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('ner-sarthi-auth-changed', syncAuth);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('ner_sarthi_auth');
    window.dispatchEvent(new Event('ner-sarthi-auth-changed'));
    setCurrentUser(null);
    showToast('You have been signed out of NER-Saarthi.');
  };

  const [routes, setRoutes] = useState<RouteSegment[]>(INITIAL_ROUTES);
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData as Vehicle[]);

  const [officers, setOfficers] = useState<FieldOfficer[]>(INITIAL_OFFICERS);
  const [disruptions, setDisruptions] = useState<DisruptionAlert[]>(INITIAL_DISRUPTIONS);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(INITIAL_FIELD_REPORTS);

  useEffect(() => {
    const controller = new AbortController();

    loadOperationalData(controller.signal)
      .then(data => {
        setRoutes(data.routes);
        setVehicles(data.vehicles);
        setOfficers(data.officers);
        if (data.fieldReports.length > 0) setFieldReports(data.fieldReports);
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error('Failed to load operational data.', error);
        }
      });

    return () => controller.abort();
  }, []);
  
  const [selectedRoute, setSelectedRoute] = useState<RouteSegment | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<FieldOfficer | null>(null);
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [simulatedTime, setSimulatedTime] = useState<string>(() => formatLocalTime(new Date()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ner_sarthi_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  // Regional Language Support (Default English, persists in localStorage)
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('ner_sarthi_lang') as LanguageCode;
    return savedLang || 'en';
  });

  const setCurrentLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('ner_sarthi_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return getUIText(key, currentLanguage, fallback);
  };

  // Notification Center State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const savedNotifs = localStorage.getItem('ner_sarthi_notifications');
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs) as AppNotification[];
        return parsed.map((notification, index) => ({
          ...notification,
          timestamp: normalizeTimestamp(notification.timestamp, 5 + index * 8),
        }));
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('ner_sarthi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addFieldReportNotification = (report: FieldReport, officerName: string) => {
    const level: AlertLevel = report.severity === 'critical'
      ? 'CRITICAL'
      : report.severity === 'high'
        ? 'HIGH'
        : report.severity === 'medium'
          ? 'MEDIUM'
          : 'LOW';

    setNotifications(prev => [{
      id: `NOTIF-REPORT-${report.id}`,
      alertKey: 'field_report_submitted',
      severity: level,
      titleKey: 'field_report_submitted',
      messageKey: 'field_report_submitted',
      customTitle: 'New field report submitted',
      customMessage: `${officerName} submitted a ${report.type.toLowerCase()} report.`,
      region: report.routeName || 'Field operations',
      routeId: report.routeId,
      routeName: report.routeName,
      timestamp: report.createdAt,
      read: false,
    }, ...prev]);
  };

  const applyFieldReport = (report: FieldReport) => {
    setFieldReports(prev => {
      const exists = prev.some(existing => existing.id === report.id);
      return exists
        ? prev.map(existing => existing.id === report.id ? report : existing)
        : [report, ...prev];
    });

    setOfficers(prev => prev.map(officer => officer.id === report.officerId
      ? { ...officer, lastUpdate: report.createdAt, lastReportAt: report.createdAt, lastReport: report.observation }
      : officer));
    setSelectedOfficer(prev => prev?.id === report.officerId
      ? { ...prev, lastUpdate: report.createdAt, lastReportAt: report.createdAt, lastReport: report.observation }
      : prev);

    if (report.routeId) {
      setRoutes(prev => prev.map(route => route.id === report.routeId
        ? { ...route, lastUpdated: report.createdAt }
        : route));
      setSelectedRoute(prev => {
        if (!prev || prev.id !== report.routeId) return prev;
        return { ...prev, lastUpdated: report.createdAt };
      });
    }
  };

  const submitFieldReport = async (input: SubmitFieldReportInput): Promise<FieldReport> => {
    const officer = officers.find(candidate => candidate.id === input.officerId);
    const route = input.routeId ? routes.find(candidate => candidate.id === input.routeId) : undefined;
    const optimisticReport: FieldReport = {
      id: `LOCAL-REPORT-${Date.now()}`,
      officerId: input.officerId,
      routeId: input.routeId,
      routeName: route?.name,
      type: input.type,
      observation: input.observation.trim(),
      severity: input.severity,
      createdAt: new Date().toISOString(),
    };

    applyFieldReport(optimisticReport);
    addFieldReportNotification(optimisticReport, officer?.name || 'Field officer');

    try {
      const persistedReport = await submitFieldReportApi({ ...input, id: optimisticReport.id });
      applyFieldReport({ ...persistedReport, routeName: persistedReport.routeName || route?.name });
      setNotifications(prev => prev.map(notification => notification.id === `NOTIF-REPORT-${optimisticReport.id}`
        ? { ...notification, id: `NOTIF-REPORT-${persistedReport.id}`, timestamp: persistedReport.createdAt }
        : notification));
      return persistedReport;
    } catch (error) {
      console.warn('Field report API unavailable; keeping the report in this session.', error);
      return optimisticReport;
    }
  };

  // Emergency Alert Banner State
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState<EmergencyAlert | null>(null);

  const triggerEmergencyAlert = (alertData: {
    alertKey: string;
    severity: AlertLevel;
    region: string;
    routeId?: string;
    routeName: string;
    autoDismissMs?: number;
  }) => {
    const newAlert: EmergencyAlert = {
      id: `ALERT-EMG-${Date.now()}`,
      alertKey: alertData.alertKey,
      severity: alertData.severity,
      region: alertData.region,
      routeId: alertData.routeId,
      routeName: alertData.routeName,
      timestamp: new Date().toISOString(),
      autoDismissMs: alertData.autoDismissMs || 9000
    };

    setActiveEmergencyAlert(newAlert);

    // Also add to notification center
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      alertKey: alertData.alertKey,
      severity: alertData.severity,
      titleKey: alertData.alertKey,
      messageKey: alertData.alertKey,
      region: alertData.region,
      routeId: alertData.routeId,
      routeName: alertData.routeName,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const dismissEmergencyAlert = () => {
    setActiveEmergencyAlert(null);
  };

  // Apply theme to document element
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('ner_sarthi_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'light' ? '☀️ Switched to Light Theme' : '🌙 Switched to Dark Theme');
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Clock ticker & Update Countdown
  useEffect(() => {
    const clockTimer = setInterval(() => setSimulatedTime(formatLocalTime(new Date())), 1000);
    const timer = setInterval(() => {
      // Decrement next update minutes
      setRoutes(prev => prev.map(r => ({
        ...r,
        nextUpdateMinutes: r.nextUpdateMinutes > 1 ? r.nextUpdateMinutes - 1 : 180
      })));
    }, 60000);
    return () => {
      clearInterval(clockTimer);
      clearInterval(timer);
    };
  }, []);

  // Vehicle position simulation (every 4 seconds)
  useEffect(() => {
    const vehicleInterval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'On Route' && v.status !== 'Delayed') return v;
        const deltaLat = (Math.random() - 0.48) * 0.003;
        const deltaLng = (Math.random() - 0.48) * 0.003;
        return {
          ...v,
          lat: Number((v.lat + deltaLat).toFixed(4)),
          lng: Number((v.lng + deltaLng).toFixed(4)),
        };
      }));
    }, 4000);

    return () => clearInterval(vehicleInterval);
  }, []);

  // Automatic Alert generator ticker (every 30 seconds)
  useEffect(() => {
    const alertInterval = setInterval(() => {
      const randomRoute = routes[Math.floor(Math.random() * routes.length)];
      if (!randomRoute) return;
      const types: ('Landslide' | 'Heavy Rainfall' | 'Vehicle Delay' | 'Road Damage')[] = [
        'Heavy Rainfall', 'Landslide', 'Road Damage', 'Vehicle Delay'
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const newAlert: DisruptionAlert = {
        id: `ALERT-${Date.now().toString().slice(-4)}`,
        routeId: randomRoute.id,
        routeName: randomRoute.name,
        title: `Auto-Detected ${selectedType} Warning`,
        severity: selectedType === 'Landslide' ? 'high' : 'medium',
        timestamp: new Date().toISOString(),
        type: selectedType,
        description: `Field sensor reported sudden ${selectedType.toLowerCase()} fluctuation along ${randomRoute.sector}.`
      };
      setDisruptions(prev => [newAlert, ...prev.slice(0, 15)]);
    }, 30000);

    return () => clearInterval(alertInterval);
  }, [routes]);

  // Dynamic KPI Computation
  const activeShipments = vehicles.filter(v => v.status === 'On Route').length;
  const delayedShipments = vehicles.filter(v => v.status === 'Delayed').length;
  const highRiskRoutes = routes.filter(r => r.risk >= 50).length;
  const avgTimeSaved = '2h 18m';

  // Demo Simulation Actions
  const simulateLandslide = (targetId?: string) => {
    const targetRouteId = targetId || 'R-001'; // Default to Guwahati-Shillong Corridor
    setRoutes(prev => prev.map(r => {
      if (r.id === targetRouteId) {
        const updated = {
          ...r,
          status: 'blocked' as const,
          risk: 94,
          landslideRisk: 'BLOCKED' as const,
          landslideProbability: 95,
          rainRisk: 88,
          visibility: 1.5,
          lastUpdated: new Date().toISOString(),
        };
        if (selectedRoute?.id === r.id) setSelectedRoute(updated);
        return updated;
      }
      return r;
    }));

    // Delay vehicles on this route
    setVehicles(prev => prev.map(v => {
      if (v.routeId === targetRouteId) {
        return { ...v, status: 'Delayed' as const, risk: 90, eta: '6h 45m (Delayed)' };
      }
      return v;
    }));

    const alertRoute = routes.find(r => r.id === targetRouteId);
    const routeSector = alertRoute ? alertRoute.sector : 'Meghalaya / Assam';
    const routeTitle = alertRoute ? alertRoute.name : 'Guwahati – Shillong Corridor';

    const newAlert: DisruptionAlert = {
      id: `SIM-LS-${Date.now().toString().slice(-4)}`,
      routeId: targetRouteId,
      routeName: routeTitle,
      title: '🔴 SIMULATION: Major Landslide Reported',
      severity: 'critical',
      timestamp: new Date().toISOString(),
      type: 'Landslide',
      description: 'Simulated massive slope collapse. Polyline turned RED. Rerouting recommended!'
    };
    setDisruptions(prev => [newAlert, ...prev]);

    // Trigger Emergency Alert Banner & Notification Center item
    triggerEmergencyAlert({
      alertKey: 'landslide_critical',
      severity: 'CRITICAL',
      region: routeSector,
      routeId: targetRouteId,
      routeName: routeTitle,
      autoDismissMs: 12000
    });

    showToast(`⚠️ Simulated Landslide on ${routeTitle}!`);
  };

  const simulateHeavyRain = (targetId?: string) => {
    const targetRouteId = targetId || 'R-002'; // Default to Tezpur Highway
    setRoutes(prev => prev.map(r => {
      if (r.id === targetRouteId) {
        const updated = {
          ...r,
          status: 'at-risk' as const,
          risk: 68,
          rainRisk: 85,
          landslideRisk: 'MONITOR' as const,
          landslideProbability: 58,
          visibility: 2.8,
          lastUpdated: new Date().toISOString(),
        };
        if (selectedRoute?.id === r.id) setSelectedRoute(updated);
        return updated;
      }
      return r;
    }));

    const alertRoute = routes.find(r => r.id === targetRouteId);
    const routeSector = alertRoute ? alertRoute.sector : 'Assam / Arunachal';
    const routeTitle = alertRoute ? alertRoute.name : 'Guwahati – Tezpur Highway';

    const newAlert: DisruptionAlert = {
      id: `SIM-RAIN-${Date.now().toString().slice(-4)}`,
      routeId: targetRouteId,
      routeName: routeTitle,
      title: '🟡 SIMULATION: Heavy Monsoon Downpour',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      type: 'Heavy Rainfall',
      description: 'Simulated 90mm rainfall outburst. Visibility reduced to 2.8km.'
    };
    setDisruptions(prev => [newAlert, ...prev]);

    // Trigger Emergency Alert Banner & Notification Center item
    triggerEmergencyAlert({
      alertKey: 'heavy_rain_warning',
      severity: 'MEDIUM',
      region: routeSector,
      routeId: targetRouteId,
      routeName: routeTitle,
      autoDismissMs: 10000
    });

    showToast(`🌧️ Simulated Heavy Rain on ${routeTitle}!`);
  };

  const simulateVehicleDelay = (targetVId?: string) => {
    const targetVehicleId = targetVId || 'V-001';
    setVehicles(prev => prev.map(v => {
      if (v.id === targetVehicleId) {
        const updated = {
          ...v,
          status: 'Delayed' as const,
          eta: '4h 30m (+1h 45m)',
          risk: 72
        };
        if (selectedVehicle?.id === v.id) setSelectedVehicle(updated);
        return updated;
      }
      return v;
    }));

    const newAlert: DisruptionAlert = {
      id: `SIM-VD-${Date.now().toString().slice(-4)}`,
      routeId: 'R-001',
      routeName: 'Guwahati – Shillong Corridor',
      title: '🟡 SIMULATION: Vehicle Delivery Bottleneck',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      type: 'Vehicle Delay',
      description: `Vehicle ${targetVehicleId} encountered heavy gradient slowdown. ETA pushed back.`
    };
    setDisruptions(prev => [newAlert, ...prev]);

    triggerEmergencyAlert({
      alertKey: 'vehicle_delay_notice',
      severity: 'MEDIUM',
      region: 'Assam / Meghalaya',
      routeId: 'R-001',
      routeName: 'Vehicle V-001 on NH-6',
      autoDismissMs: 8000
    });

    showToast(`🚚 Vehicle ${targetVehicleId} marked DELAYED!`);
  };

  const clearRoute = (targetId?: string) => {
    const targetRouteId = targetId || 'R-001';
    setRoutes(prev => prev.map(r => {
      if (r.id === targetRouteId) {
        const updated = {
          ...r,
          status: 'clear' as const,
          risk: 15,
          rainRisk: 18,
          landslideRisk: 'CLEAR' as const,
          landslideProbability: 8,
          visibility: 9.0,
          lastUpdated: new Date().toISOString(),
        };
        if (selectedRoute?.id === r.id) setSelectedRoute(updated);
        return updated;
      }
      return r;
    }));

    // Restore vehicles on this route
    setVehicles(prev => prev.map(v => {
      if (v.routeId === targetRouteId) {
        return { ...v, status: 'On Route' as const, risk: 20, eta: '2h 15m' };
      }
      return v;
    }));

    const alertRoute = routes.find(r => r.id === targetRouteId);
    const routeSector = alertRoute ? alertRoute.sector : 'Meghalaya / Assam';
    const routeTitle = alertRoute ? alertRoute.name : 'Target Route';

    const newAlert: DisruptionAlert = {
      id: `SIM-CLR-${Date.now().toString().slice(-4)}`,
      routeId: targetRouteId,
      routeName: routeTitle,
      title: '🟢 SIMULATION: Corridor Debris Cleared',
      severity: 'low',
      timestamp: new Date().toISOString(),
      type: 'Cleared',
      description: 'PWD clearance operations completed. Route restored to CLEAR status.'
    };
    setDisruptions(prev => [newAlert, ...prev]);

    triggerEmergencyAlert({
      alertKey: 'corridor_cleared_low',
      severity: 'LOW',
      region: routeSector,
      routeName: routeTitle,
      autoDismissMs: 7000
    });

    showToast(`✅ Route ${routeTitle} restored to CLEAR status!`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        logout,
        routes,
        vehicles,
        officers,

        disruptions,
        fieldReports,
        selectedRoute,
        selectedVehicle,
        selectedOfficer,
        activeTab,
        simulatedTime,
        toastMessage,
        theme,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        currentLanguage,
        setCurrentLanguage,
        t,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        submitFieldReport,
        activeEmergencyAlert,
        triggerEmergencyAlert,
        dismissEmergencyAlert,
        toggleTheme,
        setSelectedRoute,
        setSelectedVehicle,
        setSelectedOfficer,
        setActiveTab,
        simulateLandslide,
        simulateHeavyRain,
        simulateVehicleDelay,
        clearRoute,
        showToast,
        kpiStats: {
          activeShipments,
          delayedShipments,
          highRiskRoutes,
          avgTimeSaved
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
