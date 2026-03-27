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
  name: string;
  description: string;
  icon: string;
  color: string;
  levers: LeverValues;
}

export const policyPacks: PolicyPack[] = [
  {
    id: 'green_transport',
    name: 'Green Transport',
    description: '50% EV adoption, expanded metro, bike infrastructure',
    icon: 'car',
    color: '#22D3EE',
    levers: { evAdoption: 50, transitInvestment: 70, fuelTaxRate: 20, renewableShare: 25, gasRetirement: 5, gridEfficiency: 8, carbonCapture: 5, regulationLevel: 20, carbonTaxPerTon: 12 },
  },
  {
    id: 'renewable_energy',
    name: 'Renewable Energy',
    description: '40% solar/wind by 2030, retire gas plants',
    icon: 'sun',
    color: '#F59E0B',
    levers: { evAdoption: 10, transitInvestment: 15, fuelTaxRate: 5, renewableShare: 60, gasRetirement: 35, gridEfficiency: 20, carbonCapture: 10, regulationLevel: 30, carbonTaxPerTon: 15 },
  },
  {
    id: 'industrial_efficiency',
    name: 'Industrial Efficiency',
    description: 'Carbon capture, efficiency mandates, penalties',
    icon: 'factory',
    color: '#A855F7',
    levers: { evAdoption: 8, transitInvestment: 12, fuelTaxRate: 5, renewableShare: 25, gasRetirement: 10, gridEfficiency: 15, carbonCapture: 45, regulationLevel: 70, carbonTaxPerTon: 50 },
  },
  {
    id: 'balanced_plan',
    name: 'Balanced National Plan',
    description: 'A moderate mix of all strategies combined',
    icon: 'scale',
    color: '#22C55E',
    levers: { evAdoption: 30, transitInvestment: 40, fuelTaxRate: 12, renewableShare: 40, gasRetirement: 20, gridEfficiency: 15, carbonCapture: 20, regulationLevel: 40, carbonTaxPerTon: 25 },
  },
];

export interface LeverMeta {
  key: keyof LeverValues;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  group: 'transport' | 'energy' | 'industry';
}

export const leverMetas: LeverMeta[] = [
  { key: 'evAdoption', label: 'EV Adoption', unit: '%', min: 0, max: 100, step: 5, group: 'transport' },
  { key: 'transitInvestment', label: 'Public Transit Investment', unit: '%', min: 0, max: 100, step: 5, group: 'transport' },
  { key: 'fuelTaxRate', label: 'Fuel Tax Rate', unit: '%', min: 0, max: 50, step: 1, group: 'transport' },
  { key: 'renewableShare', label: 'Renewable Energy Share', unit: '%', min: 0, max: 100, step: 5, group: 'energy' },
  { key: 'gasRetirement', label: 'Gas Plant Retirement', unit: '%', min: 0, max: 100, step: 5, group: 'energy' },
  { key: 'gridEfficiency', label: 'Grid Efficiency Gain', unit: '%', min: 0, max: 30, step: 1, group: 'energy' },
  { key: 'carbonCapture', label: 'Carbon Capture', unit: '%', min: 0, max: 100, step: 5, group: 'industry' },
  { key: 'regulationLevel', label: 'Regulation Stringency', unit: '%', min: 0, max: 100, step: 5, group: 'industry' },
  { key: 'carbonTaxPerTon', label: 'Carbon Tax', unit: '$/ton', min: 0, max: 200, step: 5, group: 'industry' },
];

export interface SimulationResult {
  totalBefore: number;
  totalAfter: number;
  sectors: { name: string; before: number; after: number; delta: number; reason: string }[];
  hotspotDeltas: { name: string; lat: number; lng: number; before: number; after: number }[];
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

  return {
    totalBefore,
    totalAfter,
    sectors: [
      { name: 'Transport', before: tBefore, after: tAfter, delta: tAfter - tBefore, reason: `EV adoption at ${levers.evAdoption}% and transit investment reduce road emissions` },
      { name: 'Energy', before: eBefore, after: eAfter, delta: eAfter - eBefore, reason: `${levers.renewableShare}% renewable share displaces fossil fuel generation` },
      { name: 'Industry', before: iBefore, after: iAfter, delta: iAfter - iBefore, reason: `Carbon capture at ${levers.carbonCapture}% and $${levers.carbonTaxPerTon}/ton tax incentivize cuts` },
    ],
    hotspotDeltas: [
      { name: 'Baku', lat: 40.4093, lng: 49.8671, before: 12600, after: Math.round(12600 * ratio) },
      { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, before: 9800, after: Math.round(9800 * ratio) },
      { name: 'Ganja', lat: 40.6828, lng: 46.3606, before: 5400, after: Math.round(5400 * ratio) },
      { name: 'Shirvan', lat: 39.9381, lng: 48.9206, before: 4200, after: Math.round(4200 * ratio) },
      { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, before: 3800, after: Math.round(3800 * ratio) },
    ],
    projectedTimeline: [
      { year: '2025', baseline: 24350, simulated: 24350 },
      { year: '2026', baseline: 25000, simulated: Math.round(25000 * (1 - (1 - ratio) * 0.3)) },
      { year: '2027', baseline: 25700, simulated: Math.round(25700 * (1 - (1 - ratio) * 0.5)) },
      { year: '2028', baseline: 26500, simulated: Math.round(26500 * (1 - (1 - ratio) * 0.7)) },
      { year: '2029', baseline: 27200, simulated: Math.round(27200 * (1 - (1 - ratio) * 0.85)) },
      { year: '2030', baseline: 28000, simulated: Math.round(28000 * (1 - (1 - ratio) * 1.0)) },
    ],
    costBillion: Math.round((levers.transitInvestment * 0.08 + levers.renewableShare * 0.12 + levers.carbonCapture * 0.15 + levers.regulationLevel * 0.03) * 10) / 100,
    co2SavedTons: totalBefore - totalAfter,
  };
}
