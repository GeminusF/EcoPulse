import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { predictionData } from '../../data/mockData';

interface PredictionEntry {
  year: string;
  kg: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PredictionEntry }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <p style={{ color: 'var(--color-text-muted)' }}>{d.year}</p>
      <p style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
        {d.kg.toLocaleString()} kg
      </p>
    </div>
  );
}

function CustomLabel(props: {
  viewBox?: { x: number; y: number };
}) {
  const { viewBox } = props;
  if (!viewBox) return null;
  const { x, y } = viewBox;
  return (
    <g>
      <foreignObject x={x - 40} y={y - 55} width={80} height={48}>
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            padding: '4px 8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>2030</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            28,000 kg
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

export default function AIEmissionPrediction() {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        AI Emission Prediction
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
        Forecast for Azerbaijan (2020–2030)
      </p>

      <div style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={predictionData} margin={{ top: 30, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="kg"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ fill: '#22C55E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#4ADE80' }}
              isAnimationActive={true}
              animationDuration={1200}
              label={<CustomLabel />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom badge */}
      <div
        style={{
          marginTop: 12,
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Projected increase</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={14} color="var(--color-accent)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)' }}>
            ↑ 15% by 2030
          </span>
        </div>
      </div>
    </div>
  );
}
