import { baselineEmissions } from '../utils/predictionEngine';

export interface LeverValues {
  evAdoption: number;
  transitInvestment: number;
  fuelTaxRate: number;
  renewableShare: number;
  gasRetirement: number;
  gridEfficiency: number;
  carbonCapture: number;
  regulationLevel: number;
  carbonTaxPerTon: number;
}

export const baselineLevers: LeverValues = {
  evAdoption: 5,
  transitInvestment: 10,
  fuelTaxRate: 3,
  renewableShare: 20,
  gasRetirement: 0,
  gridEfficiency: 5,
  carbonCapture: 2,
  regulationLevel: 15,
  carbonTaxPerTon: 8,
};

export interface PolicyPack {
  id: string;
  icon: string;
  color: string;
  levers: LeverValues;
}

export const policyPacks: PolicyPack[] = [
  {
    id: 'green_transport', icon: 'car', color: '#22D3EE',
    levers: { evAdoption: 50, transitInvestment: 70, fuelTaxRate: 20, renewableShare: 25, gasRetirement: 5, gridEfficiency: 8, carbonCapture: 5, regulationLevel: 20, carbonTaxPerTon: 12 },
  },
  {
    id: 'renewable_energy', icon: 'sun', color: '#F59E0B',
    levers: { evAdoption: 10, transitInvestment: 15, fuelTaxRate: 5, renewableShare: 60, gasRetirement: 35, gridEfficiency: 20, carbonCapture: 10, regulationLevel: 30, carbonTaxPerTon: 15 },
  },
  {
    id: 'industrial_efficiency', icon: 'factory', color: '#A855F7',
    levers: { evAdoption: 8, transitInvestment: 12, fuelTaxRate: 5, renewableShare: 25, gasRetirement: 10, gridEfficiency: 15, carbonCapture: 45, regulationLevel: 70, carbonTaxPerTon: 50 },
  },
  {
    id: 'balanced_plan', icon: 'scale', color: '#22C55E',
    levers: { evAdoption: 30, transitInvestment: 40, fuelTaxRate: 12, renewableShare: 40, gasRetirement: 20, gridEfficiency: 15, carbonCapture: 20, regulationLevel: 40, carbonTaxPerTon: 25 },
  },
];

export interface LeverMeta {
  key: keyof LeverValues;
  unit: string;
  min: number;
  max: number;
  step: number;
  group: 'transport' | 'energy' | 'industry';
}

export const leverMetas: LeverMeta[] = [
  { key: 'evAdoption', unit: '%', min: 0, max: 100, step: 5, group: 'transport' },
  { key: 'transitInvestment', unit: '%', min: 0, max: 100, step: 5, group: 'transport' },
  { key: 'fuelTaxRate', unit: '%', min: 0, max: 50, step: 1, group: 'transport' },
  { key: 'renewableShare', unit: '%', min: 0, max: 100, step: 5, group: 'energy' },
  { key: 'gasRetirement', unit: '%', min: 0, max: 100, step: 5, group: 'energy' },
  { key: 'gridEfficiency', unit: '%', min: 0, max: 30, step: 1, group: 'energy' },
  { key: 'carbonCapture', unit: '%', min: 0, max: 100, step: 5, group: 'industry' },
  { key: 'regulationLevel', unit: '%', min: 0, max: 100, step: 5, group: 'industry' },
  { key: 'carbonTaxPerTon', unit: '$/ton', min: 0, max: 200, step: 5, group: 'industry' },
];

export interface SimulationSectorRow {
  sectorKey: 'transport' | 'energy' | 'industry';
  before: number;
  after: number;
  delta: number;
  reasonKey: string;
  reasonParams: Record<string, string | number>;
}

export interface SimulationResult {
  totalBefore: number;
  totalAfter: number;
  sectors: SimulationSectorRow[];
  hotspotDeltas: { cityKey: string; lat: number; lng: number; before: number; after: number }[];
  projectedTimeline: { year: string; baseline: number; simulated: number }[];
  costBillion: number;
  co2SavedTons: number;
}

export function runSimulation(levers: LeverValues): SimulationResult {
  const transportReduction = (levers.evAdoption * 0.29 + levers.transitInvestment * 0.18 + levers.fuelTaxRate * 0.12) / 100;
  const energyReduction = (levers.renewableShare * 0.35 + levers.gasRetirement * 0.2 + levers.gridEfficiency * 0.15) / 100;
  const industryReduction = (levers.carbonCapture * 0.3 + levers.regulationLevel * 0.2 + levers.carbonTaxPerTon * 0.08) / 100;

  const tBefore = 8200, eBefore = 12500, iBefore = 3650;
  const tAfter = Math.round(tBefore * (1 - Math.min(transportReduction, 0.85)));
  const eAfter = Math.round(eBefore * (1 - Math.min(energyReduction, 0.85)));
  const iAfter = Math.round(iBefore * (1 - Math.min(industryReduction, 0.85)));

  const totalBefore = tBefore + eBefore + iBefore;
  const totalAfter = tAfter + eAfter + iAfter;
  const ratio = totalAfter / totalBefore;

  // Timeline 2023 → 2030 with gradual policy phase-in
  const timelineYears = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const projectedTimeline = timelineYears.map((y, i) => {
    const bl = baselineEmissions[y];
    const phase = Math.min(1, i / (timelineYears.length - 1));
    const sim = Math.round(bl * (1 - (1 - ratio) * phase));
    return { year: String(y), baseline: bl, simulated: sim };
  });

  return {
    totalBefore,
    totalAfter,
    sectors: [
      { sectorKey: 'transport', before: tBefore, after: tAfter, delta: tAfter - tBefore,
        reasonKey: 'sim.reason.transport', reasonParams: { ev: levers.evAdoption, transit: levers.transitInvestment } },
      { sectorKey: 'energy', before: eBefore, after: eAfter, delta: eAfter - eBefore,
        reasonKey: 'sim.reason.energy', reasonParams: { renewable: levers.renewableShare } },
      { sectorKey: 'industry', before: iBefore, after: iAfter, delta: iAfter - iBefore,
        reasonKey: 'sim.reason.industry', reasonParams: { capture: levers.carbonCapture, tax: levers.carbonTaxPerTon } },
    ],
    hotspotDeltas: [
      { cityKey: 'baku', lat: 40.4093, lng: 49.8671, before: 12600, after: Math.round(12600 * ratio) },
      { cityKey: 'sumqayit', lat: 40.5855, lng: 49.6317, before: 9800, after: Math.round(9800 * ratio) },
      { cityKey: 'ganja', lat: 40.6828, lng: 46.3606, before: 5400, after: Math.round(5400 * ratio) },
      { cityKey: 'shirvan', lat: 39.9381, lng: 48.9206, before: 4200, after: Math.round(4200 * ratio) },
      { cityKey: 'mingachevir', lat: 40.7703, lng: 47.0596, before: 3800, after: Math.round(3800 * ratio) },
    ],
    projectedTimeline,
    costBillion: Math.round((levers.transitInvestment * 0.08 + levers.renewableShare * 0.12 + levers.carbonCapture * 0.15 + levers.regulationLevel * 0.03) * 10) / 100,
    co2SavedTons: totalBefore - totalAfter,
  };
}
