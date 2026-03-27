import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip as RTooltip, Legend,
} from 'recharts';
import { ArrowDown, ArrowUp, DollarSign, Leaf } from 'lucide-react';
import type { SimulationResult } from '../../data/simulationData';

function deltaIcon(before: number, after: number) {
  const delta = after - before;
  const pct = Math.abs(Math.round((delta / before) * 100));
  const reduced = delta < 0;
  const size = Math.round(16 + (Math.abs(delta) / before) * 24);
  const dotSize = Math.round(size * 0.35);
  const color = reduced ? '#22C55E' : '#EF4444';
  return {
    icon: L.divIcon({
      className: 'hotspot-marker',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color}80;display:flex;align-items:center;justify-content:center"><div style="width:${dotSize}px;height:${dotSize}px;border-radius:50%;background:${color}"></div></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    }),
    color,
    pct,
    reduced,
  };
}

interface Props {
  result: SimulationResult;
}

export default function SimulationResults({ result }: Props) {
  const totalDelta = result.totalAfter - result.totalBefore;
  const totalPct = Math.abs(Math.round((totalDelta / result.totalBefore) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Before/After stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 14, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Before</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)' }}>{result.totalBefore.toLocaleString()}</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>kg CO₂</p>
        </div>
        <div className="card" style={{ padding: 14, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>After</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-accent)' }}>{result.totalAfter.toLocaleString()}</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>kg CO₂</p>
        </div>
        <div className="card" style={{ padding: 14, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Reduction</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: totalDelta < 0 ? '#22C55E' : '#EF4444' }}>
            {totalDelta < 0 ? '↓' : '↑'} {totalPct}%
          </p>
        </div>
        <div className="card" style={{ padding: 14, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Est. Cost</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B' }}>${result.costBillion}B</p>
        </div>
      </div>

      {/* Delta map + Explanation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: 280 }}>
          <MapContainer center={[40.3, 48.0]} zoom={7} zoomControl={false} scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="" />
            {result.hotspotDeltas.map((h) => {
              const d = deltaIcon(h.before, h.after);
              return (
                <Marker key={h.name} position={[h.lat, h.lng]} icon={d.icon}>
                  <Tooltip direction="top" offset={[0, -12]} className="hotspot-tooltip" opacity={1}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{h.name}</div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, marginTop: 2 }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{h.before.toLocaleString()}</span>
                      <span style={{ color: d.color }}>→ {h.after.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.color, marginTop: 2 }}>
                      {d.reduced ? '↓' : '↑'} {d.pct}%
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.sectors.map((s) => {
            const reduced = s.delta < 0;
            return (
              <div key={s.name} className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: reduced ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {reduced ? <ArrowDown size={16} color="#22C55E" /> : <ArrowUp size={16} color="#EF4444" />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: reduced ? '#22C55E' : '#EF4444' }}>
                      {s.delta > 0 ? '+' : ''}{s.delta.toLocaleString()} kg
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.4 }}>{s.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projection chart + Cost-benefit */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>Projected Timeline</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={result.projectedTimeline} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#EF4444" strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Line type="monotone" dataKey="simulated" name="Simulated" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <Leaf size={24} color="#22C55E" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-accent)' }}>{result.co2SavedTons.toLocaleString()}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>kg CO₂ saved annually</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <DollarSign size={24} color="#F59E0B" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#F59E0B' }}>${result.costBillion}B</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>estimated investment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
