import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Demo records always receive a timestamp relative to seed time. This keeps
// fixture data from appearing in the future as the clock moves on.
function demoTimestamp(index: number, baseMinutes = 5): Date {
  const offsetMinutes = baseMinutes + ((index * 7) % 115);
  return new Date(Date.now() - offsetMinutes * 60000);
}

async function main() {
  const dataDir = path.join(__dirname, '../../src/data');

  // Seed Routes
  const routesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'routes.json'), 'utf-8'));
  for (let i = 0; i < routesData.length; i++) {
    const route = routesData[i];
    await prisma.route.upsert({
      where: { id: route.id },
      update: {
        lastUpdated: demoTimestamp(i),
      },
      create: {
        id: route.id,
        name: route.name,
        origin: route.origin,
        destination: route.destination,
        coordinatesJson: JSON.stringify(route.coordinates),
        status: route.status,
        risk: route.risk,
        rainRisk: route.rainRisk,
        landslideRisk: route.landslideRisk,
        landslideProbability: route.landslideProbability,
        visibility: route.visibility,
        source: route.source,
        confidence: route.confidence,
        lastUpdated: demoTimestamp(i),
        nextUpdateMinutes: route.nextUpdateMinutes,
        assignedOfficerId: route.assignedOfficerId,
        assignedOfficerName: route.assignedOfficerName,
        sector: route.sector,
        lengthKm: route.lengthKm,
      },
    });
  }

  // Seed Officers
  const officersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'officers.json'), 'utf-8'));
  for (let i = 0; i < officersData.length; i++) {
    const officer = officersData[i];
    await prisma.officer.upsert({
      where: { id: officer.id },
      update: {
        lastUpdate: demoTimestamp(i, 8),
        lastReportAt: demoTimestamp(i, 8),
        lastReport: officer.lastReport,
      },
      create: {
        id: officer.id,
        name: officer.name,
        department: officer.department,
        rank: officer.rank,
        controlRoom: officer.controlRoom,
        status: officer.status,
        location: officer.location,
        lat: officer.lat,
        lng: officer.lng,
        lastUpdate: demoTimestamp(i, 8),
        lastReportAt: demoTimestamp(i, 8),
        lastReport: officer.lastReport,
        sector: officer.sector,
      },
    });

    await prisma.fieldReport.upsert({
      where: { id: `SEED-REPORT-${officer.id}` },
      update: {
        officerId: officer.id,
        observation: officer.lastReport,
        createdAt: demoTimestamp(i, 8),
      },
      create: {
        id: `SEED-REPORT-${officer.id}`,
        officerId: officer.id,
        type: 'Field Officer',
        observation: officer.lastReport,
        severity: i % 4 === 0 ? 'high' : 'medium',
        createdAt: demoTimestamp(i, 8),
      },
    });
  }

  // Seed Vehicles
  const vehiclesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'vehicles.json'), 'utf-8'));
  for (const vehicle of vehiclesData) {
    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      update: {},
      create: {
        id: vehicle.id,
        cargo: vehicle.cargo,
        origin: vehicle.origin,
        destination: vehicle.destination,
        eta: vehicle.eta,
        etaMinutes: vehicle.etaMinutes,
        status: vehicle.status,
        lat: vehicle.lat,
        lng: vehicle.lng,
        speed: vehicle.speed,
        routeId: vehicle.routeId,
        risk: vehicle.risk,
        driverName: vehicle.driverName,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
