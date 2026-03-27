import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Trees, DollarSign } from 'lucide-react';
import { azerbaijanAvg, worldAvg, treesPerTonCO2, carbonCreditPricePerTon } from '../../data/calculatorData';

interface Breakdown {
  transport: number;
  energy: number;
  lifestyle: number;
}

interface Props {
  total: number;
  breakdown: Breakdown;
}

const colors = ['#22D3EE', '#F59E0B', '#A855F7'];

export default function StepResults({ total, breakdown }: Props) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setAnimated(Math.round(t * total));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  const donutData = [
    { name: 'Transport', value: breakdown.transport },
    { name: 'Home Energy', value: breakdown.energy },
    { name: 'Lifestyle', value: breakdown.lifestyle },
  ];

  const comparisonData = [
    { name: 'You', value: total },
    { name: 'AZ Avg', value: azerbaijanAvg },
    { name: 'World', value: worldAvg },
  ];

  const treesNeeded = Math.ceil((total / 1000) * treesPerTonCO2);
  const creditCost = Math.round((total / 1000) * carbonCreditPricePerTon);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Big animated number */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 4 }}>Your Annual Carbon Footprint</p>
        <p style={{ fontSize: 48, fontWeight: 800, color: 'var(--color-accent)' }}>
          {animated.toLocaleString()}
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>kg CO₂ per year</p>
      </div>

      {/* Donut + Comparison side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Breakdown donut */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {donutData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} kg`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 4 }}>
            {donutData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i] }} />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison bars */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Comparison</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} kg`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {comparisonData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#22C55E' : i === 1 ? '#F59E0B' : '#6B7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Offset estimator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trees size={20} color="#22C55E" />
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-accent)' }}>{treesNeeded}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>trees needed to offset</p>
          </div>
        </div>
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#F59E0B' }}>${creditCost}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>in carbon credits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
