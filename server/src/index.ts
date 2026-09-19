import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ner-sarthi-api' });
});

// Routes API
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    // Parse coordinatesJson back to array
    const formattedRoutes = routes.map(route => ({
      ...route,
      coordinates: JSON.parse(route.coordinatesJson)
    }));
    res.json(formattedRoutes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Officers API
app.get('/api/officers', async (req, res) => {
  try {
    const officers = await prisma.officer.findMany();
    res.json(officers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vehicles API
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Field reports API. The server owns createdAt so submitted reports use the
// actual persistence time, independent of a browser clock.
app.get('/api/field-reports', async (_req, res) => {
  try {
    const reports = await prisma.fieldReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/field-reports', async (req, res) => {
  const { id, officerId, routeId, type, observation, severity } = req.body ?? {};
  const validTypes = new Set(['Field Officer', 'Route Incident', 'Road Condition']);
  const validSeverities = new Set(['low', 'medium', 'high', 'critical']);

  if (
    (id !== undefined && typeof id !== 'string') ||
    typeof officerId !== 'string' ||
    (routeId !== undefined && routeId !== null && typeof routeId !== 'string') ||
    !validTypes.has(type) ||
    typeof observation !== 'string' ||
    !observation.trim() ||
    !validSeverities.has(severity)
  ) {
    res.status(400).json({ error: 'Invalid field report payload' });
    return;
  }

  try {
    const createdAt = new Date();
    const reportId = id || `REPORT-${createdAt.getTime()}`;
    const result = await prisma.$transaction(async (transaction) => {
      const officer = await transaction.officer.findUnique({ where: { id: officerId } });
      if (!officer) throw new Error('Officer not found');

      const route = routeId
        ? await transaction.route.findUnique({ where: { id: routeId } })
        : null;
      if (routeId && !route) throw new Error('Route not found');

      const report = await transaction.fieldReport.create({
        data: {
          id: reportId,
          officerId,
          routeId: routeId || null,
          type,
          observation: observation.trim(),
          severity,
          createdAt,
        },
      });

      await transaction.officer.update({
        where: { id: officerId },
        data: {
          lastUpdate: createdAt,
          lastReportAt: createdAt,
          lastReport: observation.trim(),
        },
      });

      if (routeId) {
        await transaction.route.update({
          where: { id: routeId },
          data: { lastUpdated: createdAt },
        });
      }

      return {
        ...report,
        routeName: route?.name,
      };
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && (error.message === 'Officer not found' || error.message === 'Route not found')) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      res.status(409).json({ error: 'A report with this id already exists' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const clientDistDir = path.resolve(
  process.env.CLIENT_DIST_DIR || path.join(__dirname, '../../dist'),
);
const clientIndexFile = path.join(clientDistDir, 'index.html');

if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
}

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && fs.existsSync(clientIndexFile)) {
    res.sendFile(clientIndexFile);
    return;
  }
  next();
});

const server = app.listen(port, host, () => {
  console.log(`NER-Sarthi API is running on http://${host}:${port}`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
