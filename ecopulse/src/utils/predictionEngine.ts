/**
 * Prediction Engine — shared utility providing consistent 2023–2030
 * forecasted data. April 2026 onward = AI-predicted.
 */

export const TIMELINE_START = 2023;
export const TIMELINE_END = 2030;
export const ACTUAL_DATA_END_YEAR = 2026;

export function isPredictedYear(year: number): 'actual' | 'mixed' | 'predicted' {
  if (year < ACTUAL_DATA_END_YEAR) return 'actual';
  if (year === ACTUAL_DATA_END_YEAR) return 'mixed';
  return 'predicted';
}

export const YEARS = Array.from(
  { length: TIMELINE_END - TIMELINE_START + 1 },
  (_, i) => TIMELINE_START + i,
);

// Baseline total emissions by year (kg CO₂)
// Realistically fluctuates to simulate AI learning policy changes, economic rebounds, etc.
export const baselineEmissions: Record<number, number> = {
  2023: 22250, 2024: 23100, 2025: 24350, // Historical upward
  2026: 24000, // Policy drop 
  2027: 23500, // Continued drop
  2028: 24600, // Economic rebound
  2029: 23800, // Green tech absorption
  2030: 22100, // Milestone drop
};

// Per-sector breakdown ratios
const sectorRatios: Record<number, { transport: number; energy: number; industry: number }> = {
  2023: { transport: 0.337, energy: 0.512, industry: 0.151 },
  2024: { transport: 0.338, energy: 0.515, industry: 0.147 },
  2025: { transport: 0.337, energy: 0.513, industry: 0.150 },
  2026: { transport: 0.340, energy: 0.512, industry: 0.148 },
  2027: { transport: 0.342, energy: 0.510, industry: 0.148 },
  2028: { transport: 0.345, energy: 0.508, industry: 0.147 },
  2029: { transport: 0.347, energy: 0.506, industry: 0.147 },
  2030: { transport: 0.350, energy: 0.504, industry: 0.146 },
};

export function getSectorValues(year: number) {
  const total = baselineEmissions[year] ?? 28000;
  const r = sectorRatios[year] ?? sectorRatios[2030];
  return {
    total,
    transport: Math.round(total * r.transport),
    energy: Math.round(total * r.energy),
    industry: Math.round(total * r.industry),
  };
}

export function getChangeText(year: number): string {
  const prev = baselineEmissions[year - 1];
  const cur = baselineEmissions[year];
  if (!prev || !cur) return '—';
  const pct = ((cur - prev) / prev * 100).toFixed(1);
  return cur >= prev ? `↑ ${pct}%` : `↓ ${Math.abs(Number(pct)).toFixed(1)}%`;
}

// Hotspot CO₂ scaling by year (base year = 2025)
const hotspotBase: Record<string, number> = {
  baku: 12600, sumqayit: 9800, ganja: 5400, shirvan: 4200, mingachevir: 3800,
};

export function getHotspotCO2(cityKey: string, year: number): number {
  const base = hotspotBase[cityKey] ?? 5000;
  const ratio = (baselineEmissions[year] ?? 24350) / baselineEmissions[2025];
  return Math.round(base * ratio);
}

// Energy mix projections (oil/gas decline, renewables rise)
export function getEnergyMix(year: number) {
  const diff = year - 2025;
  return {
    oil: Math.max(8, 22 + diff * -2),
    gas: Math.max(30, 44 + diff * -1.5),
    hydro: Math.min(20, 14 + diff * 0.5),
    solar: Math.min(22, 10 + diff * 1.8),
    wind: Math.min(22, 10 + diff * 1.7),
  };
}

// Cumulative emissions through a given year
export function getCumulativeEmissions(year: number): number {
  const known: Record<number, number> = {
    2023: 179900, 2024: 203000, 2025: 227350,
  };
  if (known[year]) return known[year];
  let sum = known[2025];
  for (let y = 2026; y <= year; y++) {
    sum += baselineEmissions[y] ?? 28000;
  }
  return sum;
}

// Scale any base-year value to a given year using national emission trajectory
const BASE_YEAR = 2025;
export function scaleByYear(baseValue: number, year: number): number {
  const ratio = (baselineEmissions[year] ?? baselineEmissions[BASE_YEAR]) / baselineEmissions[BASE_YEAR];
  return Math.round(baseValue * ratio);
}

// Region CO₂ scaling by year (base data from GeoJSON is for ~2021-2025 snapshot)
export function getRegionCO2(baseCo2Kt: number, year: number): number {
  return scaleByYear(baseCo2Kt, year);
}

// Region per capita scaling
export function getRegionPerCapita(basePc: number, year: number): number {
  const ratio = (baselineEmissions[year] ?? baselineEmissions[BASE_YEAR]) / baselineEmissions[BASE_YEAR];
  return Math.round(basePc * ratio * 100) / 100;
}
