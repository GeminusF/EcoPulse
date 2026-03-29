export interface CountryData {
  countryKey: string;
  totalEmissions: number;
  perCapita: number;
  renewablePct: number;
  industrialShare: number;
  transportShare: number;
}

export const southCaucasus: CountryData[] = [
  { countryKey: 'country.azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { countryKey: 'country.georgia', totalEmissions: 12400, perCapita: 3.3, renewablePct: 32, industrialShare: 22, transportShare: 38 },
  { countryKey: 'country.armenia', totalEmissions: 7600, perCapita: 2.6, renewablePct: 36, industrialShare: 24, transportShare: 32 },
];

export const otsCountries: CountryData[] = [
  { countryKey: 'country.azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { countryKey: 'country.turkey', totalEmissions: 428000, perCapita: 5.0, renewablePct: 42, industrialShare: 32, transportShare: 22 },
  { countryKey: 'country.kazakhstan', totalEmissions: 268000, perCapita: 13.8, renewablePct: 12, industrialShare: 42, transportShare: 18 },
  { countryKey: 'country.uzbekistan', totalEmissions: 105000, perCapita: 3.0, renewablePct: 10, industrialShare: 36, transportShare: 20 },
  { countryKey: 'country.kyrgyzstan', totalEmissions: 9800, perCapita: 1.5, renewablePct: 48, industrialShare: 18, transportShare: 28 },
  { countryKey: 'country.turkmenistan', totalEmissions: 72000, perCapita: 11.5, renewablePct: 2, industrialShare: 40, transportShare: 16 },
];

export const cisCountries: CountryData[] = [
  { countryKey: 'country.azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { countryKey: 'country.russia', totalEmissions: 1640000, perCapita: 11.4, renewablePct: 18, industrialShare: 38, transportShare: 16 },
  { countryKey: 'country.kazakhstan', totalEmissions: 268000, perCapita: 13.8, renewablePct: 12, industrialShare: 42, transportShare: 18 },
  { countryKey: 'country.belarus', totalEmissions: 58000, perCapita: 6.2, renewablePct: 8, industrialShare: 34, transportShare: 24 },
  { countryKey: 'country.uzbekistan', totalEmissions: 105000, perCapita: 3.0, renewablePct: 10, industrialShare: 36, transportShare: 20 },
  { countryKey: 'country.armenia', totalEmissions: 7600, perCapita: 2.6, renewablePct: 36, industrialShare: 24, transportShare: 32 },
  { countryKey: 'country.moldova', totalEmissions: 5200, perCapita: 2.0, renewablePct: 22, industrialShare: 20, transportShare: 30 },
  { countryKey: 'country.kyrgyzstan', totalEmissions: 9800, perCapita: 1.5, renewablePct: 48, industrialShare: 18, transportShare: 28 },
  { countryKey: 'country.tajikistan', totalEmissions: 6400, perCapita: 0.6, renewablePct: 52, industrialShare: 16, transportShare: 20 },
];

export const radarMetricKeys = ['total', 'perCapita', 'renewable', 'industrial', 'transport'] as const;
export type RadarMetricKey = (typeof radarMetricKeys)[number];

export interface NormalizedRadarRow {
  countryKey: string;
  total: number;
  perCapita: number;
  renewable: number;
  industrial: number;
  transport: number;
}

export function normalizeForRadar(countries: CountryData[]): NormalizedRadarRow[] {
  const maxes = {
    totalEmissions: Math.max(...countries.map(c => c.totalEmissions)),
    perCapita: Math.max(...countries.map(c => c.perCapita)),
  };
  return countries.map(c => ({
    countryKey: c.countryKey,
    total: Math.round((c.totalEmissions / maxes.totalEmissions) * 100),
    perCapita: Math.round((c.perCapita / maxes.perCapita) * 100),
    renewable: c.renewablePct,
    industrial: c.industrialShare,
    transport: c.transportShare,
  }));
}
