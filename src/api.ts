import routesData from './data/routes.json';
import vehiclesData from './data/vehicles.json';
import officersData from './data/officers.json';
import { FieldOfficer, FieldReport, RouteSegment, Vehicle } from './types';
import { normalizeTimestamp } from './utils/timeUtils';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = (configuredApiUrl || '/api').replace(/\/$/, '');

const fetchCollection = async <T>(
  resource: string,
  fallback: T[],
  signal: AbortSignal,
): Promise<T[]> => {
  try {
    const response = await fetch(`${apiBaseUrl}/${resource}`, { signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error(`Invalid ${resource} response`);
    return data as T[];
  } catch (error) {
    if (signal.aborted) throw error;
    console.warn(`Using local ${resource} data because the API is unavailable.`, error);
    return fallback;
  }
};

export const loadOperationalData = async (signal: AbortSignal) => {
  const [routes, vehicles, officers, fieldReports] = await Promise.all([
    fetchCollection<RouteSegment>('routes', routesData as RouteSegment[], signal),
    fetchCollection<Vehicle>('vehicles', vehiclesData as Vehicle[], signal),
    fetchCollection<FieldOfficer>('officers', officersData as FieldOfficer[], signal),
    fetchCollection<FieldReport>('field-reports', [], signal),
  ]);

  return {
    routes: routes.map((route, index) => ({
      ...route,
      lastUpdated: normalizeTimestamp(route.lastUpdated, 5 + ((index * 7) % 110)),
    })),
    vehicles,
    fieldReports: fieldReports.map((report) => ({
      ...report,
      createdAt: normalizeTimestamp(report.createdAt),
    })),
    officers: officers.map((officer, index) => {
      const lastUpdate = normalizeTimestamp(officer.lastUpdate, 8 + ((index * 9) % 100));
      return {
        ...officer,
        lastUpdate,
        lastReportAt: normalizeTimestamp(officer.lastReportAt || officer.lastUpdate, 8 + ((index * 9) % 100)),
      };
    }),
  };
};

export interface SubmitFieldReportInput {
  id?: string;
  officerId: string;
  routeId?: string;
  type: FieldReport['type'];
  observation: string;
  severity: FieldReport['severity'];
}

export const submitFieldReport = async (
  input: SubmitFieldReportInput,
  signal?: AbortSignal,
): Promise<FieldReport> => {
  const response = await fetch(`${apiBaseUrl}/field-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return (await response.json()) as FieldReport;
};
