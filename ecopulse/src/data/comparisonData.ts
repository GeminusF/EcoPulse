export interface CountryData {
  country: string;
  totalEmissions: number;
  perCapita: number;
  renewablePct: number;
  industrialShare: number;
  transportShare: number;
}

export const southCaucasus: CountryData[] = [
  { country: 'Azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { country: 'Georgia', totalEmissions: 12400, perCapita: 3.3, renewablePct: 32, industrialShare: 22, transportShare: 38 },
  { country: 'Armenia', totalEmissions: 7600, perCapita: 2.6, renewablePct: 36, industrialShare: 24, transportShare: 32 },
];

export const otsCountries: CountryData[] = [
  { country: 'Azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { country: 'Turkey', totalEmissions: 428000, perCapita: 5.0, renewablePct: 42, industrialShare: 32, transportShare: 22 },
  { country: 'Kazakhstan', totalEmissions: 268000, perCapita: 13.8, renewablePct: 12, industrialShare: 42, transportShare: 18 },
  { country: 'Uzbekistan', totalEmissions: 105000, perCapita: 3.0, renewablePct: 10, industrialShare: 36, transportShare: 20 },
  { country: 'Kyrgyzstan', totalEmissions: 9800, perCapita: 1.5, renewablePct: 48, industrialShare: 18, transportShare: 28 },
  { country: 'Turkmenistan', totalEmissions: 72000, perCapita: 11.5, renewablePct: 2, industrialShare: 40, transportShare: 16 },
];

export const cisCountries: CountryData[] = [
  { country: 'Azerbaijan', totalEmissions: 35200, perCapita: 3.4, renewablePct: 20, industrialShare: 30, transportShare: 34 },
  { country: 'Russia', totalEmissions: 1640000, perCapita: 11.4, renewablePct: 18, industrialShare: 38, transportShare: 16 },
  { country: 'Kazakhstan', totalEmissions: 268000, perCapita: 13.8, renewablePct: 12, industrialShare: 42, transportShare: 18 },
  { country: 'Belarus', totalEmissions: 58000, perCapita: 6.2, renewablePct: 8, industrialShare: 34, transportShare: 24 },
  { country: 'Uzbekistan', totalEmissions: 105000, perCapita: 3.0, renewablePct: 10, industrialShare: 36, transportShare: 20 },
  { country: 'Armenia', totalEmissions: 7600, perCapita: 2.6, renewablePct: 36, industrialShare: 24, transportShare: 32 },
  { country: 'Moldova', totalEmissions: 5200, perCapita: 2.0, renewablePct: 22, industrialShare: 20, transportShare: 30 },
  { country: 'Kyrgyzstan', totalEmissions: 9800, perCapita: 1.5, renewablePct: 48, industrialShare: 18, transportShare: 28 },
  { country: 'Tajikistan', totalEmissions: 6400, perCapita: 0.6, renewablePct: 52, industrialShare: 16, transportShare: 20 },
];

export const radarMetrics = ['Total CO₂', 'Per Capita', 'Renewable %', 'Industrial %', 'Transport %'] as const;

export function normalizeForRadar(countries: CountryData[]) {
  const maxes = {
    totalEmissions: Math.max(...countries.map(c => c.totalEmissions)),
    perCapita: Math.max(...countries.map(c => c.perCapita)),
    renewablePct: 100,
    industrialShare: 100,
    transportShare: 100,
  };
  return countries.map(c => ({
    country: c.country,
    'Total CO₂': Math.round((c.totalEmissions / maxes.totalEmissions) * 100),
    'Per Capita': Math.round((c.perCapita / maxes.perCapita) * 100),
    'Renewable %': c.renewablePct,
    'Industrial %': c.industrialShare,
    'Transport %': c.transportShare,
  }));
}
