import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { energyMixTimeSeries, energyMixColors } from '../../data/analyticsData';

const fuels = ['oil', 'gas', 'hydro', 'solar', 'wind'] as const;

export default function EnergyMixChart() {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Energy Mix</h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Source composition over time (%)</p>
      <div style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={energyMixTimeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`${v}%`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            {fuels.map((f) => (
              <Area key={f} type="monotone" dataKey={f} stackId="1" stroke={energyMixColors[f]} fill={energyMixColors[f]} fillOpacity={0.7} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
        {fuels.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: energyMixColors[f] }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
