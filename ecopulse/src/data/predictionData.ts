export interface ForecastPoint {
  year: string;
  baseline: number;
  low95: number;
  low75: number;
  low50: number;
  high50: number;
  high75: number;
  high95: number;
  withPolicy: number;
}

export const forecastFanData: ForecastPoint[] = [
  { year: '2023', baseline: 22250, low95: 22250, low75: 22250, low50: 22250, high50: 22250, high75: 22250, high95: 22250, withPolicy: 22250 },
  { year: '2024', baseline: 23100, low95: 23100, low75: 23100, low50: 23100, high50: 23100, high75: 23100, high95: 23100, withPolicy: 23100 },
  { year: '2025', baseline: 24350, low95: 24000, low75: 24150, low50: 24250, high50: 24450, high75: 24650, high95: 24800, withPolicy: 24350 },
  { year: '2026', baseline: 24000, low95: 23100, low75: 23500, low50: 23750, high50: 24200, high75: 24800, high95: 25400, withPolicy: 23200 },
  { year: '2027', baseline: 23500, low95: 21500, low75: 22200, low50: 22800, high50: 24200, high75: 25100, high95: 26000, withPolicy: 21800 },
  { year: '2028', baseline: 24600, low95: 21400, low75: 22600, low50: 23700, high50: 25500, high75: 26800, high95: 28000, withPolicy: 22400 },
  { year: '2029', baseline: 23800, low95: 19500, low75: 21000, low50: 22500, high50: 25200, high75: 26500, high95: 28500, withPolicy: 20500 },
  { year: '2030', baseline: 22100, low95: 17000, low75: 19000, low50: 20500, high50: 24500, high75: 26000, high95: 28000, withPolicy: 18500 },
];

export interface SectorForecast {
  year: string;
  transport: number;
  transportLow: number;
  transportHigh: number;
  energy: number;
  energyLow: number;
  energyHigh: number;
  industry: number;
  industryLow: number;
  industryHigh: number;
}

export const sectorForecasts: SectorForecast[] = [
  { year: '2023', transport: 7500, transportLow: 7500, transportHigh: 7500, energy: 11390, energyLow: 11390, energyHigh: 11390, industry: 3360, industryLow: 3360, industryHigh: 3360 },
  { year: '2024', transport: 7800, transportLow: 7800, transportHigh: 7800, energy: 11900, energyLow: 11900, energyHigh: 11900, industry: 3400, industryLow: 3400, industryHigh: 3400 },
  { year: '2025', transport: 8200, transportLow: 8000, transportHigh: 8400, energy: 12500, energyLow: 12200, energyHigh: 12800, industry: 3650, industryLow: 3500, industryHigh: 3800 },
  { year: '2026', transport: 8160, transportLow: 7800, transportHigh: 8800, energy: 12290, energyLow: 11500, energyHigh: 13200, industry: 3550, industryLow: 3200, industryHigh: 3900 },
  { year: '2027', transport: 8040, transportLow: 7500, transportHigh: 9200, energy: 11980, energyLow: 10800, energyHigh: 13500, industry: 3480, industryLow: 3000, industryHigh: 4000 },
  { year: '2028', transport: 8490, transportLow: 7300, transportHigh: 10200, energy: 12500, energyLow: 11000, energyHigh: 14800, industry: 3610, industryLow: 3000, industryHigh: 4500 },
  { year: '2029', transport: 8260, transportLow: 6900, transportHigh: 10300, energy: 12040, energyLow: 10200, energyHigh: 14500, industry: 3500, industryLow: 2700, industryHigh: 4500 },
  { year: '2030', transport: 7730, transportLow: 6200, transportHigh: 9800, energy: 11140, energyLow: 8900, energyHigh: 14200, industry: 3230, industryLow: 2400, industryHigh: 4200 },
];

export interface BacktestEntry {
  year: string;
  actual: number;
  predicted: number;
}

export const backtestData: BacktestEntry[] = [
  { year: '2023', actual: 22250, predicted: 22400 },
  { year: '2024', actual: 23100, predicted: 23000 },
  { year: '2025', actual: 24350, predicted: 24200 },
  { year: '2026', actual: 23900, predicted: 24000 },
  { year: '2027', actual: 23400, predicted: 23500 },
  { year: '2028', actual: 24700, predicted: 24600 },
  { year: '2029', actual: 23600, predicted: 23800 },
  { year: '2030', actual: 22200, predicted: 22100 },
];

export const sectorConfidence = [
  { sectorKey: 'sector.transport', confidence: 87, color: '#22D3EE' },
  { sectorKey: 'sector.energy', confidence: 82, color: '#F59E0B' },
  { sectorKey: 'sector.industry', confidence: 72, color: '#A855F7' },
];

export const modelAccuracy = { mape: 3.2, rmse: 480 };

export const modelMetadataKeys = {
  type: 'pred.meta.type',
  features: [
    'pred.meta.feature0',
    'pred.meta.feature1',
    'pred.meta.feature2',
    'pred.meta.feature3',
    'pred.meta.feature4',
    'pred.meta.feature5',
    'pred.meta.feature6',
  ] as const,
  trainingPeriod: 'pred.meta.training',
  trainingPeriodVal: 'pred.meta.trainingVal',
  dataSources: 'pred.meta.sources',
  dataSourcesVal: 'pred.meta.sourcesVal',
  limitations: [
    'pred.meta.limit0',
    'pred.meta.limit1',
    'pred.meta.limit2',
    'pred.meta.limit3',
  ] as const,
};
