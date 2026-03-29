import {
  getEnergyMix, getCumulativeEmissions, getSectorValues,
  YEARS, isPredictedYear,
} from '../utils/predictionEngine';

/* ── Energy Mix (2023 → 2030) ── */
export interface EnergyMixEntry {
  year: number; oil: number; gas: number; hydro: number; solar: number; wind: number;
  predicted: boolean;
}

export const energyMixTimeSeries: EnergyMixEntry[] = [
  { year: 2023, oil: 26, gas: 46, hydro: 13, solar: 7, wind: 8, predicted: false },
  { year: 2024, oil: 24, gas: 45, hydro: 14, solar: 8, wind: 9, predicted: false },
  { year: 2025, oil: 22, gas: 44, hydro: 14, solar: 10, wind: 10, predicted: false },
  ...([2026, 2027, 2028, 2029, 2030] as const).map((y) => {
    const mix = getEnergyMix(y);
    return { year: y, ...mix, predicted: true };
  }),
];

export const energyMixColors: Record<string, string> = {
  oil: '#EF4444', gas: '#F59E0B', hydro: '#3B82F6', solar: '#FBBF24', wind: '#22D3EE',
};

/* ── Sector History (2023 → 2030) ── */
export interface SectorHistoryEntry {
  year: number; transport: number; energy: number; industry: number;
  predicted: boolean;
}

export const sectorHistory: SectorHistoryEntry[] = YEARS.map((y) => {
  const v = getSectorValues(y);
  return {
    year: y,
    transport: v.transport,
    energy: v.energy,
    industry: v.industry,
    predicted: isPredictedYear(y) !== 'actual',
  };
});

/* ── Regional Emissions (from GeoJSON — single source of truth) ── */
export interface RegionEmission {
  regionKey: string; emissions: number; population: number; perCapita: number;
}

import regionsJson from './economicRegions.json';

const REGION_NAME_TO_I18N: Record<string, string> = {
  'Baku': 'regions.baku',
  'Absheron-Khizi': 'regions.absheron_khizi',
  'Ganja-Dashkasan': 'regions.ganja_dashkasan',
  'Shaki-Zagatala': 'regions.shaki_zagatala',
  'Lankaran-Astara': 'regions.lankaran_astara',
  'Guba-Khachmaz': 'regions.guba_khachmaz',
  'Central Aran': 'regions.central_aran',
  'Karabakh': 'regions.karabakh',
  'East Zangezur': 'regions.east_zangezur',
  'Mountainous Shirvan': 'regions.mountainous_shirvan',
  'Nakhchivan': 'regions.nakhchivan',
  'Gazakh-Tovuz': 'regions.gazakh_tovuz',
  'Mil-Mughan': 'regions.mil_mughan',
  'Shirvan-Salyan': 'regions.shirvan_salyan',
};

interface RegionGeoFeature {
  properties: {
    name: string;
    co2_total_kt: number;
    population_2021: number;
    co2_per_capita_tonnes: number;
  };
}

const regionFeatures = (regionsJson as unknown as { features: RegionGeoFeature[] }).features;

export const regionEmissions: RegionEmission[] = regionFeatures
  .map((f) => ({
    regionKey: REGION_NAME_TO_I18N[f.properties.name] ?? `regions.${f.properties.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    emissions: f.properties.co2_total_kt,
    population: Math.round(f.properties.population_2021 / 1000),
    perCapita: f.properties.co2_per_capita_tonnes,
  }))
  .sort((a, b) => b.emissions - a.emissions);

/* ── Carbon Tax (2023 → 2030) ── */
export interface CarbonTaxEntry {
  year: number; state: number; private: number; predicted: boolean;
}

export const carbonTaxData: CarbonTaxEntry[] = [
  { year: 2023, state: 32, private: 28, predicted: false },
  { year: 2024, state: 36, private: 32, predicted: false },
  { year: 2025, state: 40, private: 36, predicted: false },
  { year: 2026, state: 44, private: 40, predicted: true },
  { year: 2027, state: 48, private: 44, predicted: true },
  { year: 2028, state: 53, private: 49, predicted: true },
  { year: 2029, state: 58, private: 54, predicted: true },
  { year: 2030, state: 64, private: 60, predicted: true },
];

/* ── Cumulative Emissions (2023 → 2030) ── */
export interface CumulativeEntry {
  year: number; cumulative: number; budget: number; predicted: boolean;
}

export const cumulativeEmissions: CumulativeEntry[] = YEARS.map((y) => ({
  year: y,
  cumulative: getCumulativeEmissions(y),
  budget: 250000,
  predicted: isPredictedYear(y) !== 'actual',
}));

/* ── Sector Performance Scores ── */
export interface SectorScore {
  sectorKey: string; current: number; target: number; pctToTarget: number;
  grade: string; gradeColor: string; trend: string;
}

export const sectorPerformance: SectorScore[] = [
  { sectorKey: 'analytics.sector.transport', current: 8200, target: 6000, pctToTarget: 73, grade: 'C', gradeColor: '#F59E0B', trend: '↑ 5.1%' },
  { sectorKey: 'analytics.sector.energy', current: 12500, target: 9000, pctToTarget: 72, grade: 'C', gradeColor: '#F59E0B', trend: '↑ 5.0%' },
  { sectorKey: 'analytics.sector.industry', current: 3650, target: 2800, pctToTarget: 77, grade: 'B', gradeColor: '#22C55E', trend: '↑ 7.4%' },
  { sectorKey: 'analytics.sector.agriculture', current: 1800, target: 1500, pctToTarget: 83, grade: 'B+', gradeColor: '#22C55E', trend: '↓ 2.1%' },
];

/* ── Key Insights ── */
export const keyInsights = [
  { insightKey: 'analytics.insight0', type: 'warning' as const },
  { insightKey: 'analytics.insight1', type: 'positive' as const },
  { insightKey: 'analytics.insight2', type: 'neutral' as const },
  { insightKey: 'analytics.insight3', type: 'danger' as const },
];
