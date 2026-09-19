export type LandslideState = 'CLEAR' | 'MONITOR' | 'BLOCKED';
export type RouteStatus = 'clear' | 'at-risk' | 'blocked';
export type DisruptionSeverity = 'low' | 'medium' | 'high' | 'critical';
export type VehicleStatus = 'On Route' | 'Delayed' | 'Stationary' | 'Arrived';
export type CargoType = 'Medicine' | 'Food' | 'Construction Material' | 'Agri-Produce';

export interface Vehicle {
  id: string;
  cargo: CargoType;
  origin: string;
  destination: string;
  eta: string;
  etaMinutes: number;
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number; // km/h
  routeId: string;
  risk: number; // 0-100%
  driverName?: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  origin: string;
  destination: string;
  coordinates: [number, number][]; // array of [lat, lng]
  status: RouteStatus;
  risk: number; // 0-100%
  rainRisk: number; // 0-100%
  landslideRisk: LandslideState;
  landslideProbability: number; // 0-100%
  visibility: number; // in km
  source: string;
  confidence: number; // %
  lastUpdated: string;
  nextUpdateMinutes: number;
  assignedOfficerId: string;
  assignedOfficerName: string;
  sector: string;
  lengthKm: number;
}

export interface FieldOfficer {
  id: string;
  name: string;
  department: string;
  rank: string;
  controlRoom: string;
  status: 'Active' | 'On Break' | 'In Transit';
  location: string;
  lat: number;
  lng: number;
  lastUpdate: string;
  /** ISO-8601 UTC time at which the latest field report was submitted. */
  lastReportAt?: string;
  lastReport: string;
  sector: string;
}

export type FieldReportType = 'Field Officer' | 'Route Incident' | 'Road Condition';

export interface FieldReport {
  id: string;
  officerId: string;
  routeId?: string;
  routeName?: string;
  type: FieldReportType;
  observation: string;
  severity: DisruptionSeverity;
  /** ISO-8601 UTC creation/submission time. */
  createdAt: string;
}

export interface WeatherInfo {
  district: string;
  state: string;
  temperature: number; // celsius
  rainfall: number; // mm
  rainProbability: number; // %
  visibility: number; // km
  wind: number; // km/h
  landslideRisk: LandslideState;
}

export interface DisruptionAlert {
  id: string;
  routeId: string;
  routeName: string;
  title: string;
  severity: DisruptionSeverity;
  timestamp: string;
  type: 'Landslide' | 'Heavy Rainfall' | 'Vehicle Delay' | 'Road Damage' | 'Cleared';
  description: string;
}

export interface DriverReport {
  id: string;
  driverId: string;
  routeId: string;
  routeName: string;
  timestamp: string;
  observation: string;
  severity: DisruptionSeverity;
  confidence: number;
}

export interface SocialReport {
  id: string;
  handle: string;
  routeId: string;
  routeName: string;
  timestamp: string;
  content: string;
  severity: DisruptionSeverity;
  confidence: number;
}

export interface HistoricalDisruption {
  id: string;
  date: string;
  district: string;
  cause: 'Landslide' | 'Flood' | 'Accident' | 'Road Damage' | 'Other';
  severity: string;
  clearanceHours: number;
}

export interface TourismDestination {
  id: string;
  name: string;
  state: string;
  category: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface CulturalFestival {
  id: string;
  name: string;
  state: string;
  month: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface RSSItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: string;
  summary: string;
}

export interface LogisticsAnalysisResult {
  recommendedRouteId: string;
  routeOptions: {
    id: string;
    name: string;
    distanceKm: number;
    baseEtaHours: number;
    riskAdjustedEtaHours: number;
    estimatedCostRupees: number;
    deliveryRiskPercent: number;
    onTimeProbabilityPercent: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    riskColor: string;
    isRecommended: boolean;
    safetyScore: number;
    etaScore: number;
    costScore: number;
    reliabilityScore: number;
  }[];
  explanation: string;
}

export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AppNotification {
  id: string;
  alertKey: string;
  severity: AlertLevel;
  titleKey: string;
  messageKey: string;
  customTitle?: string;
  customMessage?: string;
  region: string;
  routeId?: string;
  routeName?: string;
  timestamp: string;
  read: boolean;
}

export interface EmergencyAlert {
  id: string;
  alertKey: string;
  severity: AlertLevel;
  region: string;
  routeId?: string;
  routeName: string;
  timestamp: string;
  autoDismissMs?: number;
}

export type LoginRole = 'officer' | 'commander' | 'driver' | string;

export interface StoredUser {
  username: string;
  role: LoginRole;
  officerId?: string;
  name: string;
  designation: string;
  department: string;
  status?: string;
  loginTime: string;
  token: string;
}

