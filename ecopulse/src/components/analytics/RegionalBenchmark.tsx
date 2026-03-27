import { useState } from 'react';
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import TabPanel from '../shared/TabPanel';
import { southCaucasus, otsCountries, cisCountries, normalizeForRadar, radarMetrics } from '../../data/comparisonData';
import type { CountryData } from '../../data/comparisonData';

const groups = [
  { id: 'caucasus', label: 'S. Caucasus', data: southCaucasus },
  { id: 'ots', label: 'OTS', data: otsCountries },
  { id: 'cis', label: 'CIS', data: cisCountries },
];

const radarColors = ['#22C55E', '#F59E0B', '#22D3EE', '#A855F7', '#EF4444', '#3B82F6', '#FBBF24', '#EC4899', '#6366F1'];

export default function RegionalBenchmark() {
  const [group, setGroup] = useState('caucasus');
  const current = groups.find(g => g.id === group)!;
  const radarData = normalizeForRadar(current.data);

  const perCapitaSorted = [...current.data].sort((a, b) => b.perCapita - a.perCapita);

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Regional Benchmark</h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2, marginBottom: 12 }}>
        Azerbaijan vs regional peers
      </p>
      <TabPanel tabs={groups.map(g => ({ id: g.id, label: g.label }))} active={group} onChange={setGroup} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* Radar chart */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>Emission Profile</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarMetrics.map(m => {
              const entry: Record<string, string | number> = { metric: m };
              radarData.forEach(c => { entry[c.country] = c[m]; });
              return entry;
            })}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              {current.data.map((c: CountryData, i: number) => (
                <Radar key={c.country} name={c.country} dataKey={c.country}
                  stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.15} strokeWidth={2} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {current.data.map((c: CountryData, i: number) => (
              <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: radarColors[i] }} />
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{c.country}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-capita ranking */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>CO₂ Per Capita (tons)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={perCapitaSorted} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="perCapita" radius={[0, 4, 4, 0]} barSize={14}>
                {perCapitaSorted.map((d) => (
                  <Cell key={d.country} fill={d.country === 'Azerbaijan' ? '#22C55E' : '#4B5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
