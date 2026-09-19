import { RouteSegment, Vehicle, FieldOfficer } from '../types';
import { formatLocalDateTime } from './timeUtils';

export function exportOperationalReportCSV(
  routes: RouteSegment[],
  vehicles: Vehicle[],
  officers: FieldOfficer[]
) {
  const now = new Date().toLocaleString();
  const activeShipments = vehicles.filter(v => v.status === 'On Route').length;
  const delayedShipments = vehicles.filter(v => v.status === 'Delayed').length;
  const highRiskRoutes = routes.filter(r => r.risk >= 50).length;

  let csvContent = `NER-Sarthi Operational Intelligence Report\n`;
  csvContent += `DEMO DATA — NOT FOR REAL-WORLD OPERATIONAL DECISIONS\n`;
  csvContent += `Generated At: "${now}"\n`;
  csvContent += `Dashboard State Summary: Active Shipments: ${activeShipments} | Delayed Shipments: ${delayedShipments} | High-Risk Routes: ${highRiskRoutes}\n\n`;

  // Route Section
  csvContent += `ROUTE ACCESSIBILITY & INTELLIGENCE DATA\n`;
  csvContent += `"Route ID","Route Name","Status","Risk (%)","Rainfall Risk (%)","Landslide Status","Visibility (km)","Confidence (%)","Last Update","Next Update","Assigned Officer"\n`;

  routes.forEach(r => {
    csvContent += `"${r.id}","${r.name}","${r.status.toUpperCase()}","${r.risk}%","${r.rainRisk}%","${r.landslideRisk}","${r.visibility} km","${r.confidence}%","${formatLocalDateTime(r.lastUpdated)}","in ${r.nextUpdateMinutes}m","${r.assignedOfficerName}"\n`;
  });

  csvContent += `\nFIELD OFFICER DEPLOYMENT NETWORK\n`;
  csvContent += `"Officer ID","Name","Department","Rank","Control Room Contact","Sector","Status","Last Report At","Last Report"\n`;

  officers.forEach(o => {
    csvContent += `"${o.id}","${o.name}","${o.department}","${o.rank}","${o.controlRoom}","${o.sector}","${o.status}","${formatLocalDateTime(o.lastReportAt || o.lastUpdate)}","${o.lastReport.replace(/"/g, '""')}"\n`;
  });

  csvContent += `\nACTIVE SHIPMENT MONITORING\n`;
  csvContent += `"Vehicle ID","Cargo","Origin","Destination","Status","ETA","Risk (%)","Driver Name"\n`;

  vehicles.forEach(v => {
    csvContent += `"${v.id}","${v.cargo}","${v.origin}","${v.destination}","${v.status}","${v.eta}","${v.risk}%","${v.driverName || 'N/A'}"\n`;
  });

  // Trigger client-side download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NER-Sarthi-Operational-Report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
