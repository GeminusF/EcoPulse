import type { TFunction } from 'i18next';

export function generateNarrative(
  gdpGrowth: number,
  oilPrice: number,
  renewableShare: number,
  t: TFunction
): string {
  const parts: string[] = [];

  // GDP impact
  const gdpBaseline = 3.5;
  const gdpDiff = gdpGrowth - gdpBaseline;
  if (Math.abs(gdpDiff) > 0.2) {
    const impact = Math.abs(Math.round(gdpDiff * 800));
    const key = gdpDiff > 0 ? 'pred.narrative.gdp.increase' : 'pred.narrative.gdp.decrease';
    parts.push(t(key, { gdp: gdpGrowth.toFixed(1), diff: Math.abs(gdpDiff).toFixed(1), impact: impact.toLocaleString() }));
  }

  // Oil price impact
  const oilBaseline = 65;
  const oilDiff = oilPrice - oilBaseline;
  if (Math.abs(oilDiff) > 5) {
    const impact = Math.abs(Math.round(oilDiff * 25));
    const key = oilDiff > 0 ? 'pred.narrative.oil.increase' : 'pred.narrative.oil.decrease';
    parts.push(t(key, { price: oilPrice, diff: Math.abs(oilDiff).toFixed(0), impact: impact.toLocaleString() }));
  }

  // Renewable impact
  const renewBaseline = 20;
  const renewDiff = renewableShare - renewBaseline;
  if (Math.abs(renewDiff) > 3) {
    const impact = Math.abs(Math.round(renewDiff * 120));
    const key = renewDiff > 0 ? 'pred.narrative.renew.decrease' : 'pred.narrative.renew.increase';
    parts.push(t(key, { renew: renewableShare, diff: Math.abs(renewDiff).toFixed(0), impact: impact.toLocaleString() }));
  }

  if (parts.length === 0) {
    parts.push(t('pred.narrative.baseline'));
  }

  return parts.join(' ');
}
