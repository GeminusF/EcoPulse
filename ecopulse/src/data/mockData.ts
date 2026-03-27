export const totalSparkline = [
  { v: 22000 }, { v: 22500 }, { v: 23100 }, { v: 23400 }, { v: 23800 }, { v: 24350 },
];
export const transportSparkline = [
  { v: 7200 }, { v: 7500 }, { v: 7700 }, { v: 7900 }, { v: 8000 }, { v: 8200 },
];
export const energySparkline = [
  { v: 10500 }, { v: 11000 }, { v: 11500 }, { v: 12000 }, { v: 12200 }, { v: 12500 },
];
export const industrySparkline = [
  { v: 3200 }, { v: 3300 }, { v: 3400 }, { v: 3500 }, { v: 3600 }, { v: 3650 },
];

export const sectorData = [
  { name: 'Transport', value: 8200, percent: 33.7, color: '#22C55E' },
  { name: 'Energy', value: 12500, percent: 51.3, color: '#4ADE80' },
  { name: 'Industry', value: 3650, percent: 15.0, color: '#166534' },
];

export const predictionData = [
  { year: '2020', kg: 22000 },
  { year: '2022', kg: 23000 },
  { year: '2024', kg: 24000 },
  { year: '2026', kg: 25000 },
  { year: '2028', kg: 26500 },
  { year: '2030', kg: 28000 },
];

export const yearlyStats: Record<string, {
  total: number; transport: number; energy: number; industry: number;
  totalChange: string; transportPct: string; energyPct: string; industryPct: string;
}> = {
  '2025': {
    total: 24350, transport: 8200, energy: 12500, industry: 3650,
    totalChange: '↑ 5.2%', transportPct: '33.7%', energyPct: '51.3%', industryPct: '15.0%',
  },
  '2024': {
    total: 23100, transport: 7800, energy: 11900, industry: 3400,
    totalChange: '↑ 3.8%', transportPct: '33.8%', energyPct: '51.5%', industryPct: '14.7%',
  },
  '2023': {
    total: 22250, transport: 7500, energy: 11400, industry: 3350,
    totalChange: '↑ 2.1%', transportPct: '33.7%', energyPct: '51.2%', industryPct: '15.1%',
  },
};

export const hotspots = [
  { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, intensity: 'high' as const, co2: 9800, topSource: 'Petrochemical plants', change: '↑ 3.2%' },
  { name: 'Ganja', lat: 40.6828, lng: 46.3606, intensity: 'medium' as const, co2: 5400, topSource: 'Industrial manufacturing', change: '↑ 1.8%' },
  { name: 'Shirvan', lat: 39.9381, lng: 48.9206, intensity: 'medium' as const, co2: 4200, topSource: 'Oil refinery operations', change: '↓ 0.5%' },
  { name: 'Baku', lat: 40.4093, lng: 49.8671, intensity: 'high' as const, co2: 12600, topSource: 'Transport & energy', change: '↑ 5.1%' },
  { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, intensity: 'medium' as const, co2: 3800, topSource: 'Thermal power station', change: '↓ 1.2%' },
];

export const reductionSparkline = [
  { v: 0 }, { v: -2 }, { v: -5 }, { v: -7 }, { v: -10 }, { v: -12 },
];
