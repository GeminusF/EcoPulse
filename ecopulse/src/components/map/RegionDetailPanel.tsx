import { X, MapPin, Building2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import type { EconRegionGeo } from '../../data/mapData';

interface Props {
  region: EconRegionGeo;
  onClose: () => void;
}

export default function RegionDetailPanel({ region, onClose }: Props) {
  const data = [
    { name: 'Transport', value: Math.round(region.emissions * 0.34), color: '#22D3EE' },
    { name: 'Energy', value: Math.round(region.emissions * 0.51), color: '#F59E0B' },
    { name: 'Industry', value: Math.round(region.emissions * 0.15), color: '#A855F7' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, width: 320, height: '100%', zIndex: 1000,
      background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{region.name}</h3>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{region.nameAz}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={18} color="var(--color-text-muted)" />
        </button>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)' }}>
              <MapPin size={13} />
              <span style={{ fontSize: 10 }}>Capital</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{region.capital}</span>
          </div>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)' }}>
              <Building2 size={13} />
              <span style={{ fontSize: 10 }}>Districts</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{region.districtsCount}</span>
          </div>
        </div>

        {/* Emissions card + intensity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Total Emissions</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-accent)' }}>{region.emissions.toLocaleString()}</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>kg CO₂</p>
          </div>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Intensity</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: region.emissions > 5000 ? '#EF4444' : '#22C55E' }}>
              {region.emissions > 10000 ? 'Very High' : region.emissions > 5000 ? 'High' : region.emissions > 2000 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>

        {/* Intensity badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 8, background: region.emissions > 5000 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: region.emissions > 10000 ? '#EF4444' : region.emissions > 5000 ? '#F59E0B' : region.emissions > 2000 ? '#EAB308' : '#22C55E',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {region.emissions > 10000 ? 'Very High' : region.emissions > 5000 ? 'High' : region.emissions > 2000 ? 'Medium' : 'Low'} Emission Intensity
          </span>
        </div>

        {/* Districts list */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Districts</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {region.districts.map((d) => (
              <span key={d} style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 6,
                background: 'var(--color-surface-2)', color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Sector breakdown chart */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Sector Breakdown</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
