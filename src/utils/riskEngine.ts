import { LandslideState, CargoType, LogisticsAnalysisResult, RouteSegment } from '../types';

export function calculateRainRisk(rainfallMm: number, probabilityPercent: number): number {
  const intensityFactor = Math.min(100, (rainfallMm / 100) * 100);
  return Math.round((intensityFactor * 0.6) + (probabilityPercent * 0.4));
}

export function getRainRiskLabel(score: number): { label: string; color: string } {
  if (score <= 30) return { label: 'Low', color: 'text-emerald-700 dark:text-emerald-300' };
  if (score <= 60) return { label: 'Moderate', color: 'text-amber-700 dark:text-amber-300' };
  if (score <= 80) return { label: 'High', color: 'text-orange-700 dark:text-orange-300' };
  return { label: 'Severe', color: 'text-red-700 dark:text-red-300' };
}

export function getVisibilityClassification(visibilityKm: number): { classification: string; riskScore: number; color: string } {
  if (visibilityKm >= 8) return { classification: 'Excellent', riskScore: 10, color: 'text-emerald-700 dark:text-emerald-300' };
  if (visibilityKm >= 5) return { classification: 'Good', riskScore: 30, color: 'text-blue-700 dark:text-blue-300' };
  if (visibilityKm >= 2) return { classification: 'Reduced', riskScore: 65, color: 'text-amber-700 dark:text-amber-300' };
  return { classification: 'Critical', riskScore: 92, color: 'text-red-700 dark:text-red-300' };
}

export function calculateLandslideState(rainRisk: number, landslideProb: number): LandslideState {
  if (landslideProb >= 80 || rainRisk >= 85) return 'BLOCKED';
  if (landslideProb >= 35 || rainRisk >= 45) return 'MONITOR';
  return 'CLEAR';
}

export function calculateCompositeRouteRisk(
  rainRisk: number,
  landslideProb: number,
  roadConditionRisk: number,
  visibilityKm: number,
  historicalFreq: number = 20,
  liveReportImpact: number = 10
): number {
  const visibilityRisk = getVisibilityClassification(visibilityKm).riskScore;
  const rawScore = 
    (rainRisk * 0.25) +
    (landslideProb * 0.30) +
    (roadConditionRisk * 0.20) +
    (visibilityRisk * 0.10) +
    (historicalFreq * 0.10) +
    (liveReportImpact * 0.05);

  return Math.min(99, Math.max(5, Math.round(rawScore)));
}

export function getCargoWeights(cargo: CargoType) {
  switch (cargo) {
    case 'Medicine':
      return { urgency: 95, safetyWeight: 0.45, etaWeight: 0.35, costWeight: 0.10, reliabilityWeight: 0.10 };
    case 'Food':
      return { urgency: 80, safetyWeight: 0.35, etaWeight: 0.35, costWeight: 0.15, reliabilityWeight: 0.15 };
    case 'Agri-Produce':
      return { urgency: 75, safetyWeight: 0.35, etaWeight: 0.30, costWeight: 0.20, reliabilityWeight: 0.15 };
    case 'Construction Material':
    default:
      return { urgency: 55, safetyWeight: 0.25, etaWeight: 0.20, costWeight: 0.35, reliabilityWeight: 0.20 };
  }
}

export function analyzeLogisticsRoutes(
  origin: string,
  destination: string,
  cargo: CargoType,
  allRoutes: RouteSegment[]
): LogisticsAnalysisResult {
  const weights = getCargoWeights(cargo);
  
  // Find primary matching route or default fallback
  const directRoute = allRoutes.find(
    r => (r.origin.toLowerCase() === origin.toLowerCase() && r.destination.toLowerCase() === destination.toLowerCase()) ||
         (r.origin.toLowerCase() === destination.toLowerCase() && r.destination.toLowerCase() === origin.toLowerCase())
  ) || allRoutes[0];

  const distanceBase = directRoute ? directRoute.lengthKm : 180;

  // Generate 3 realistic route choices
  const routeA = {
    id: 'ROUTE-A',
    name: `Corridor Alpha (Via ${directRoute.name})`,
    distanceKm: distanceBase,
    baseEtaHours: Math.round((distanceBase / 45) * 10) / 10,
    riskAdjustedEtaHours: Math.round(((distanceBase / 45) * (1 + (directRoute.risk / 150))) * 10) / 10,
    estimatedCostRupees: Math.round(distanceBase * 28 + (weights.urgency * 12)),
    deliveryRiskPercent: Math.min(95, Math.max(10, directRoute.risk)),
    onTimeProbabilityPercent: Math.max(15, 100 - directRoute.risk - 8),
    riskLevel: (directRoute.risk < 35 ? 'Low' : directRoute.risk < 65 ? 'Moderate' : 'High') as 'Low' | 'Moderate' | 'High',
    riskColor: directRoute.risk < 35 ? 'text-emerald-700 dark:text-emerald-300' : directRoute.risk < 65 ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300',
    isRecommended: true,
    safetyScore: Math.max(10, 100 - directRoute.risk),
    etaScore: Math.max(10, 100 - Math.round(distanceBase / 3)),
    costScore: 78,
    reliabilityScore: directRoute.confidence,
  };

  const routeB = {
    id: 'ROUTE-B',
    name: `Corridor Beta (State Highway Bypass)`,
    distanceKm: Math.round(distanceBase * 1.18),
    baseEtaHours: Math.round(((distanceBase * 1.18) / 42) * 10) / 10,
    riskAdjustedEtaHours: Math.round((((distanceBase * 1.18) / 42) * 1.08) * 10) / 10,
    estimatedCostRupees: Math.round(distanceBase * 31 + (weights.urgency * 10)),
    deliveryRiskPercent: Math.max(12, Math.round(directRoute.risk * 0.55)),
    onTimeProbabilityPercent: Math.min(92, Math.max(30, 95 - Math.round(directRoute.risk * 0.4))),
    riskLevel: (directRoute.risk * 0.55 < 35 ? 'Low' : 'Moderate') as 'Low' | 'Moderate' | 'High',
    riskColor: directRoute.risk * 0.55 < 35 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300',
    isRecommended: false,
    safetyScore: Math.max(20, 100 - Math.round(directRoute.risk * 0.55)),
    etaScore: Math.max(10, 100 - Math.round((distanceBase * 1.18) / 3)),
    costScore: 65,
    reliabilityScore: 88,
  };

  const routeC = {
    id: 'ROUTE-C',
    name: `Corridor Gamma (Hill Expressway Cutoff)`,
    distanceKm: Math.round(distanceBase * 0.88),
    baseEtaHours: Math.round(((distanceBase * 0.88) / 35) * 10) / 10,
    riskAdjustedEtaHours: Math.round((((distanceBase * 0.88) / 35) * 1.45) * 10) / 10,
    estimatedCostRupees: Math.round(distanceBase * 24 + (weights.urgency * 8)),
    deliveryRiskPercent: Math.min(98, Math.round(directRoute.risk * 1.35) + 10),
    onTimeProbabilityPercent: Math.max(10, 100 - Math.round(directRoute.risk * 1.35) - 15),
    riskLevel: (directRoute.risk * 1.35 > 60 ? 'High' : 'Moderate') as 'Low' | 'Moderate' | 'High',
    riskColor: directRoute.risk * 1.35 > 60 ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300',
    isRecommended: false,
    safetyScore: Math.max(5, 100 - Math.round(directRoute.risk * 1.35)),
    etaScore: Math.max(10, 100 - Math.round((distanceBase * 0.88) / 3)),
    costScore: 88,
    reliabilityScore: 62,
  };

  // Decide recommendation based on cargo urgency
  let recommended = routeA;
  if (cargo === 'Medicine' && directRoute.risk > 45) {
    recommended = routeB;
    routeB.isRecommended = true;
    routeA.isRecommended = false;
  } else if (cargo === 'Construction Material' && routeC.deliveryRiskPercent < 60) {
    // Construction can accept slightly higher risk for lower cost
    recommended = routeA;
  }

  // Generate plain English explanation
  let explanation = '';
  if (recommended.id === 'ROUTE-B') {
    explanation = `Route B (${routeB.name}) is strongly recommended for ${cargo} transport from ${origin} to ${destination}. Although it adds approximately ${Math.round((routeB.distanceKm - routeA.distanceKm))} km to the journey, it bypasses elevated landslide and rainfall hazards on ${directRoute.name}, reducing critical delivery risk from ${routeA.deliveryRiskPercent}% down to ${routeB.deliveryRiskPercent}% and boosting on-time delivery confidence to ${routeB.onTimeProbabilityPercent}%.`;
  } else if (cargo === 'Medicine') {
    explanation = `Route A (${routeA.name}) is recommended for high-priority ${cargo} shipment (Urgency Score: ${weights.urgency}/100). Weather and terrain conditions along this corridor remain stable with an estimated on-time arrival probability of ${routeA.onTimeProbabilityPercent}%. Minimal disruption risk detected along active checkposts.`;
  } else {
    explanation = `Route A (${routeA.name}) presents the optimal balance of speed, cost (₹${routeA.estimatedCostRupees.toLocaleString()}), and terrain stability for carrying ${cargo}. Predicted ETA is ${routeA.riskAdjustedEtaHours} hours with an acceptable delivery risk profile of ${routeA.deliveryRiskPercent}%.`;
  }

  return {
    recommendedRouteId: recommended.id,
    routeOptions: [routeA, routeB, routeC],
    explanation
  };
}
