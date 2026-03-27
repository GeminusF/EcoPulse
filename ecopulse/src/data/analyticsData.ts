export interface EnergyMixEntry {
  year: number;
  oil: number;
  gas: number;
  hydro: number;
  solar: number;
  wind: number;
}

export const energyMixTimeSeries: EnergyMixEntry[] = [
  { year: 2015, oil: 42, gas: 45, hydro: 10, solar: 1, wind: 2 },
  { year: 2016, oil: 40, gas: 46, hydro: 10, solar: 1.5, wind: 2.5 },
  { year: 2017, oil: 38, gas: 47, hydro: 10, solar: 2, wind: 3 },
  { year: 2018, oil: 36, gas: 47, hydro: 11, solar: 2.5, wind: 3.5 },
  { year: 2019, oil: 34, gas: 48, hydro: 11, solar: 3, wind: 4 },
  { year: 2020, oil: 32, gas: 48, hydro: 12, solar: 3.5, wind: 4.5 },
  { year: 2021, oil: 30, gas: 48, hydro: 12, solar: 4.5, wind: 5.5 },
  { year: 2022, oil: 28, gas: 47, hydro: 13, solar: 5.5, wind: 6.5 },
  { year: 2023, oil: 26, gas: 46, hydro: 13, solar: 7, wind: 8 },
  { year: 2024, oil: 24, gas: 45, hydro: 14, solar: 8, wind: 9 },
  { year: 2025, oil: 22, gas: 44, hydro: 14, solar: 10, wind: 10 },
];

export const energyMixColors: Record<string, string> = {
  oil: '#EF4444',
  gas: '#F59E0B',
  hydro: '#3B82F6',
  solar: '#FBBF24',
  wind: '#22D3EE',
};

export interface SectorHistoryEntry {
  year: number;
  transport: number;
  energy: number;
  industry: number;
}

export const sectorHistory: SectorHistoryEntry[] = [
  { year: 2015, transport: 5800, energy: 9200, industry: 2800 },
  { year: 2016, transport: 6000, energy: 9500, industry: 2900 },
  { year: 2017, transport: 6200, energy: 9800, industry: 3000 },
  { year: 2018, transport: 6500, energy: 10200, industry: 3100 },
  { year: 2019, transport: 6800, energy: 10600, industry: 3200 },
  { year: 2020, transport: 6400, energy: 10100, industry: 2900 },
  { year: 2021, transport: 7000, energy: 10800, industry: 3100 },
  { year: 2022, transport: 7300, energy: 11200, industry: 3250 },
  { year: 2023, transport: 7500, energy: 11400, industry: 3350 },
  { year: 2024, transport: 7800, energy: 11900, industry: 3400 },
  { year: 2025, transport: 8200, energy: 12500, industry: 3650 },
];

export interface RegionEmission {
  region: string;
  emissions: number;
  population: number;
  perCapita: number;
}

export const regionEmissions: RegionEmission[] = [
  { region: 'Absheron', emissions: 12600, population: 2200, perCapita: 5.73 },
  { region: 'Aran', emissions: 3200, population: 1950, perCapita: 1.64 },
  { region: 'Ganja-Dashkasan', emissions: 5400, population: 1300, perCapita: 4.15 },
  { region: 'Lankaran', emissions: 1400, population: 930, perCapita: 1.51 },
  { region: 'Mingachevir-Shirvan', emissions: 4100, population: 850, perCapita: 4.82 },
  { region: 'Shaki-Zagatala', emissions: 980, population: 620, perCapita: 1.58 },
  { region: 'Guba-Khachmaz', emissions: 750, population: 570, perCapita: 1.32 },
  { region: 'Upper Karabakh', emissions: 620, population: 340, perCapita: 1.82 },
  { region: 'Kalbajar-Lachin', emissions: 380, population: 210, perCapita: 1.81 },
  { region: 'Nakhchivan', emissions: 520, population: 470, perCapita: 1.11 },
];

export interface CarbonTaxEntry {
  year: number;
  state: number;
  private: number;
}

export const carbonTaxData: CarbonTaxEntry[] = [
  { year: 2015, state: 12, private: 8 },
  { year: 2016, state: 14, private: 9 },
  { year: 2017, state: 16, private: 11 },
  { year: 2018, state: 19, private: 14 },
  { year: 2019, state: 22, private: 17 },
  { year: 2020, state: 20, private: 15 },
  { year: 2021, state: 25, private: 20 },
  { year: 2022, state: 28, private: 24 },
  { year: 2023, state: 32, private: 28 },
  { year: 2024, state: 36, private: 32 },
  { year: 2025, state: 40, private: 36 },
];

export interface CumulativeEntry {
  year: number;
  cumulative: number;
  budget: number;
}

export const cumulativeEmissions: CumulativeEntry[] = [
  { year: 2015, cumulative: 17800, budget: 250000 },
  { year: 2016, cumulative: 36200, budget: 250000 },
  { year: 2017, cumulative: 55200, budget: 250000 },
  { year: 2018, cumulative: 75000, budget: 250000 },
  { year: 2019, cumulative: 95600, budget: 250000 },
  { year: 2020, cumulative: 115000, budget: 250000 },
  { year: 2021, cumulative: 135900, budget: 250000 },
  { year: 2022, cumulative: 157650, budget: 250000 },
  { year: 2023, cumulative: 179900, budget: 250000 },
  { year: 2024, cumulative: 203000, budget: 250000 },
  { year: 2025, cumulative: 227350, budget: 250000 },
];

export interface SectorScore {
  sector: string;
  current: number;
  target: number;
  pctToTarget: number;
  grade: string;
  gradeColor: string;
  trend: string;
}

export const sectorPerformance: SectorScore[] = [
  { sector: 'Transport', current: 8200, target: 6000, pctToTarget: 73, grade: 'C', gradeColor: '#F59E0B', trend: '↑ 5.1%' },
  { sector: 'Energy', current: 12500, target: 9000, pctToTarget: 72, grade: 'C', gradeColor: '#F59E0B', trend: '↑ 5.0%' },
  { sector: 'Industry', current: 3650, target: 2800, pctToTarget: 77, grade: 'B', gradeColor: '#22C55E', trend: '↑ 7.4%' },
  { sector: 'Agriculture', current: 1800, target: 1500, pctToTarget: 83, grade: 'B+', gradeColor: '#22C55E', trend: '↓ 2.1%' },
];

export const keyInsights = [
  { text: 'Energy sector emissions grew 5.0% YoY, driven by increased natural gas consumption during winter months.', type: 'warning' as const },
  { text: 'Renewable energy share reached 20% for the first time — solar and wind each contributing 10%.', type: 'positive' as const },
  { text: 'Absheron region accounts for 52% of national emissions due to Baku\'s concentrated transport and industry.', type: 'neutral' as const },
  { text: 'Cumulative emissions are at 91% of Azerbaijan\'s estimated Paris Agreement carbon budget.', type: 'danger' as const },
];
