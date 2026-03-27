import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { cumulativeEmissions } from '../../data/analyticsData';

export default function CumulativeEmissions() {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Cumulative Emissions</h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Running total vs Paris Agreement budget</p>
      <div style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={cumulativeEmissions} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${Number(v).toLocaleString()} kg`, '']}
            />
            <ReferenceLine y={250000} stroke="#EF4444" strokeDasharray="6 3" label={{ value: 'Carbon Budget', position: 'right', fill: '#EF4444', fontSize: 11 }} />
            <Area type="monotone" dataKey="cumulative" stroke="#22C55E" strokeWidth={2} fill="url(#cumGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
