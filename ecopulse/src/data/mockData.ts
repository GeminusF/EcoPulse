import { getSectorValues, getChangeText, isPredictedYear, YEARS } from '../utils/predictionEngine';

/* ── sparklines (2023 → 2030) ── */
export const totalSparkline = [
  { v: 22250 }, { v: 23100 }, { v: 24350 }, { v: 25000 },
  { v: 25700 }, { v: 26500 }, { v: 27200 }, { v: 28000 },
];
export const transportSparkline = [
  { v: 7500 }, { v: 7800 }, { v: 8200 }, { v: 8500 },
  { v: 8790 }, { v: 9143 }, { v: 9438 }, { v: 9800 },
];
export const energySparkline = [
  { v: 11400 }, { v: 11900 }, { v: 12500 }, { v: 12800 },
  { v: 13107 }, { v: 13462 }, { v: 13763 }, { v: 14112 },
];
export const industrySparkline = [
  { v: 3350 }, { v: 3400 }, { v: 3650 }, { v: 3700 },
  { v: 3804 }, { v: 3896 }, { v: 3998 }, { v: 4088 },
];

export const sectorData = [
  { nameKey: 'sector.transport', value: 8200, percent: 33.7, color: '#22C55E' },
  { nameKey: 'sector.energy', value: 12500, percent: 51.3, color: '#4ADE80' },
  { nameKey: 'sector.industry', value: 3650, percent: 15.0, color: '#166534' },
];

export const predictionData = YEARS.map((y) => ({
  year: String(y),
  kg: getSectorValues(y).total,
}));

/* ── yearly stats (2023 → 2030) ── */
export const yearlyStats: Record<string, {
  total: number; transport: number; energy: number; industry: number;
  totalChange: string; transportPct: string; energyPct: string; industryPct: string;
  predicted: ReturnType<typeof isPredictedYear>;
}> = {};

for (const y of YEARS) {
  const v = getSectorValues(y);
  yearlyStats[String(y)] = {
    total: v.total,
    transport: v.transport,
    energy: v.energy,
    industry: v.industry,
    totalChange: getChangeText(y),
    transportPct: `${(v.transport / v.total * 100).toFixed(1)}%`,
    energyPct: `${(v.energy / v.total * 100).toFixed(1)}%`,
    industryPct: `${(v.industry / v.total * 100).toFixed(1)}%`,
    predicted: isPredictedYear(y),
  };
}

export const hotspots = [
  { id: 'sumqayit', nameKey: 'hotspot.sumqayit', lat: 40.5855, lng: 49.6317, intensity: 'high' as const, co2: 9800, topSourceKey: 'hotspot.source.petrochemical', change: '↑ 3.2%' },
  { id: 'ganja', nameKey: 'hotspot.ganja', lat: 40.6828, lng: 46.3606, intensity: 'medium' as const, co2: 5400, topSourceKey: 'hotspot.source.manufacturing', change: '↑ 1.8%' },
  { id: 'shirvan', nameKey: 'hotspot.shirvan', lat: 39.9381, lng: 48.9206, intensity: 'medium' as const, co2: 4200, topSourceKey: 'hotspot.source.refinery', change: '↓ 0.5%' },
  { id: 'baku', nameKey: 'hotspot.baku', lat: 40.4093, lng: 49.8671, intensity: 'high' as const, co2: 12600, topSourceKey: 'hotspot.source.transportEnergy', change: '↑ 5.1%' },
  { id: 'mingachevir', nameKey: 'hotspot.mingachevir', lat: 40.7703, lng: 47.0596, intensity: 'medium' as const, co2: 3800, topSourceKey: 'hotspot.source.thermal', change: '↓ 1.2%' },
];

export const reductionSparkline = [
  { v: 0 }, { v: -2 }, { v: -5 }, { v: -7 }, { v: -10 }, { v: -12 },
];
