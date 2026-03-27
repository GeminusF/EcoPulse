import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { sectorData } from '../../data/mockData';

interface SectorEntry {
  name: string;
  value: number;
  percent: number;
  color: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SectorEntry }> }) {
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
      <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{d.name}</p>
      <p style={{ color: 'var(--color-text-muted)' }}>
        {d.value.toLocaleString()} kg &middot; {d.percent}%
      </p>
    </div>
  );
}

export default function EmissionsBySector() {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        CO₂ Emissions by Sector
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
        Distribution across key sectors
      </p>

      <div style={{ display: 'flex', gap: 32, marginTop: 20, alignItems: 'center' }}>
        {/* Donut chart */}
        <div style={{ width: 220, height: 220, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                paddingAngle={3}
                isAnimationActive={true}
              >
                {sectorData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          {sectorData.map((sector) => (
            <div key={sector.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: sector.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  flex: 1,
                  minWidth: 80,
                }}
              >
                {sector.name}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {sector.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
