import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { reductionSparkline } from '../../data/mockData';

export default function CarbonReduction() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
        Carbon Reduction
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-accent)', marginTop: 4 }}>
        -12%
      </p>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>This Month</p>
      <div style={{ marginTop: 8 }}>
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={reductionSparkline}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#greenGrad)"
              fillOpacity={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
