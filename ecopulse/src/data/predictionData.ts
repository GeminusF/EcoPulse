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
  { year: '2020', baseline: 22000, low95: 22000, low75: 22000, low50: 22000, high50: 22000, high75: 22000, high95: 22000, withPolicy: 22000 },
  { year: '2021', baseline: 22500, low95: 22100, low75: 22200, low50: 22300, high50: 22700, high75: 22800, high95: 22900, withPolicy: 22400 },
  { year: '2022', baseline: 23000, low95: 22300, low75: 22500, low50: 22700, high50: 23300, high75: 23500, high95: 23700, withPolicy: 22600 },
  { year: '2023', baseline: 23500, low95: 22400, low75: 22700, low50: 23000, high50: 24000, high75: 24300, high95: 24600, withPolicy: 22500 },
  { year: '2024', baseline: 24000, low95: 22500, low75: 23000, low50: 23400, high50: 24600, high75: 25000, high95: 25500, withPolicy: 22200 },
  { year: '2025', baseline: 24350, low95: 22400, low75: 23100, low50: 23600, high50: 25100, high75: 25600, high95: 26300, withPolicy: 21800 },
  { year: '2026', baseline: 25000, low95: 22200, low75: 23200, low50: 23800, high50: 26200, high75: 26800, high95: 27800, withPolicy: 21200 },
  { year: '2027', baseline: 25700, low95: 22000, low75: 23300, low50: 24000, high50: 27400, high75: 28100, high95: 29400, withPolicy: 20500 },
  { year: '2028', baseline: 26500, low95: 21800, low75: 23400, low50: 24300, high50: 28700, high75: 29600, high95: 31200, withPolicy: 19800 },
  { year: '2029', baseline: 27200, low95: 21500, low75: 23500, low50: 24500, high50: 29900, high75: 30900, high95: 32900, withPolicy: 19000 },
  { year: '2030', baseline: 28000, low95: 21200, low75: 23600, low50: 24800, high50: 31200, high75: 32400, high95: 34800, withPolicy: 18200 },
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
  { year: '2020', transport: 6400, transportLow: 6400, transportHigh: 6400, energy: 10100, energyLow: 10100, energyHigh: 10100, industry: 2900, industryLow: 2900, industryHigh: 2900 },
  { year: '2022', transport: 7300, transportLow: 6800, transportHigh: 7800, energy: 11200, energyLow: 10500, energyHigh: 11900, industry: 3250, industryLow: 3000, industryHigh: 3500 },
  { year: '2024', transport: 7800, transportLow: 7000, transportHigh: 8600, energy: 11900, energyLow: 10800, energyHigh: 13000, industry: 3400, industryLow: 3000, industryHigh: 3800 },
  { year: '2026', transport: 8500, transportLow: 7200, transportHigh: 9800, energy: 12800, energyLow: 11000, energyHigh: 14600, industry: 3700, industryLow: 3000, industryHigh: 4400 },
  { year: '2028', transport: 9200, transportLow: 7400, transportHigh: 11000, energy: 13600, energyLow: 11200, energyHigh: 16000, industry: 4000, industryLow: 3000, industryHigh: 5000 },
  { year: '2030', transport: 9800, transportLow: 7500, transportHigh: 12100, energy: 14200, energyLow: 11400, energyHigh: 17000, industry: 4200, industryLow: 3000, industryHigh: 5400 },
];

export interface BacktestEntry {
  year: string;
  actual: number;
  predicted: number;
}

export const backtestData: BacktestEntry[] = [
  { year: '2018', actual: 19800, predicted: 19500 },
  { year: '2019', actual: 20600, predicted: 20800 },
  { year: '2020', actual: 19400, predicted: 21000 },
  { year: '2021', actual: 20900, predicted: 21200 },
  { year: '2022', actual: 21750, predicted: 21900 },
  { year: '2023', actual: 22250, predicted: 22400 },
  { year: '2024', actual: 23100, predicted: 23000 },
  { year: '2025', actual: 24350, predicted: 24200 },
];

export const sectorConfidence = [
  { sector: 'Transport', confidence: 87, color: '#22D3EE' },
  { sector: 'Energy', confidence: 82, color: '#F59E0B' },
  { sector: 'Industry', confidence: 72, color: '#A855F7' },
];

export const modelMetadata = {
  type: 'LSTM Neural Network with Attention Mechanism',
  features: ['GDP growth rate', 'Population trends', 'Energy prices (oil, gas)', 'Seasonal consumption patterns', 'Policy change indicators', 'Industrial output index', 'Vehicle registration data'],
  trainingPeriod: '2005 – 2023 (18 years of monthly data)',
  dataSources: 'State Statistical Committee of Azerbaijan, IEA, World Bank',
  accuracy: { mape: 3.2, rmse: 480 },
  limitations: [
    'Model accuracy degrades beyond 3-year horizons due to policy uncertainty',
    'COVID-19 disruption (2020) introduced anomalous patterns in training data',
    'Does not account for potential new industrial mega-projects',
    'Assumes linear relationship between GDP growth and energy demand',
  ],
};
