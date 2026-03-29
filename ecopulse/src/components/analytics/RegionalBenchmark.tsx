import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import TabPanel from '../shared/TabPanel';
import { southCaucasus, otsCountries, cisCountries, normalizeForRadar, radarMetricKeys } from '../../data/comparisonData';
import type { CountryData, NormalizedRadarRow } from '../../data/comparisonData';

const groups = [
  { id: 'caucasus', labelKey: 'group.caucasus', data: southCaucasus },
  { id: 'ots', labelKey: 'group.ots', data: otsCountries },
  { id: 'cis', labelKey: 'group.cis', data: cisCountries },
];

const radarColors = ['#22C55E', '#F59E0B', '#22D3EE', '#A855F7', '#EF4444', '#3B82F6', '#FBBF24', '#EC4899', '#6366F1'];

export default function RegionalBenchmark() {
  const { t } = useTranslation();
  const [group, setGroup] = useState('caucasus');
  const current = groups.find(g => g.id === group)!;
  const radarRows = useMemo(() => normalizeForRadar(current.data), [current.data]);
  const perCapitaSorted = useMemo(() =>
    [...current.data].sort((a, b) => b.perCapita - a.perCapita).map(c => ({
      ...c,
      countryLabel: t(c.countryKey),
    })), [current.data, t]);

  const radarChartData = useMemo(() =>
    radarMetricKeys.map((mk) => {
      const entry: Record<string, string | number> = { metric: t(`radar.${mk}`) };
      radarRows.forEach((r: NormalizedRadarRow) => {
        entry[r.countryKey] = r[mk];
      });
      return entry;
    }), [radarRows, t]);

  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('analytics.benchmark.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5 mb-3">{t('analytics.benchmark.sub')}</p>
      <TabPanel tabs={groups.map(g => ({ id: g.id, label: t(g.labelKey) }))} active={group} onChange={setGroup} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs font-semibold text-text-muted mb-1">{t('analytics.benchmark.profile')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarChartData} outerRadius="60%" margin={{ top: 20, right: 25, bottom: 20, left: 25 }}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              {current.data.map((c: CountryData, i: number) => (
                <Radar key={c.countryKey} name={t(c.countryKey)} dataKey={c.countryKey}
                  stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.15} strokeWidth={2} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center">
            {current.data.map((c: CountryData, i: number) => (
              <div key={c.countryKey} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: radarColors[i] }} />
                <span className="text-[10px] text-text-muted">{t(c.countryKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-text-muted mb-1">{t('analytics.benchmark.perCapita')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={perCapitaSorted} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="countryLabel" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="perCapita" radius={[0, 4, 4, 0]} barSize={14}>
                {perCapitaSorted.map((d) => (
                  <Cell key={d.countryKey} fill={d.countryKey === 'country.azerbaijan' ? '#22C55E' : '#4B5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
