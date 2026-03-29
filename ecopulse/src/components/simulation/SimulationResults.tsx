
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip as RTooltip, Legend,
} from 'recharts';
import { ArrowDown, ArrowUp, DollarSign, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
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
    color, pct, reduced,
  };
}

interface Props { result: SimulationResult; onSave?: () => void; isSaved?: boolean; }

export default function SimulationResults({ result, onSave, isSaved }: Props) {
  const { t } = useTranslation();
  const { resolvedTheme } = useSettings();
  const totalDelta = result.totalAfter - result.totalBefore;
  const totalPct = Math.abs(Math.round((totalDelta / result.totalBefore) * 100));
  const tileUrl = resolvedTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaved}
            className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-xs font-semibold text-text-primary hover:bg-border transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaved ? 'Result Saved ✓' : 'Save to History'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3.5 text-center">
          <p className="text-[11px] text-text-muted">{t('sim.result.before')}</p>
          <p className="text-2xl font-extrabold text-text-primary">{result.totalBefore.toLocaleString()}</p>
          <p className="text-[10px] text-text-muted">{t('common.kgCo2')}</p>
        </div>
        <div className="card p-3.5 text-center">
          <p className="text-[11px] text-text-muted">{t('sim.result.after')}</p>
          <p className="text-2xl font-extrabold text-accent">{result.totalAfter.toLocaleString()}</p>
          <p className="text-[10px] text-text-muted">{t('common.kgCo2')}</p>
        </div>
        <div className="card p-3.5 text-center">
          <p className="text-[11px] text-text-muted">{t('sim.result.reduction')}</p>
          <p className="text-2xl font-extrabold" style={{ color: totalDelta < 0 ? '#22C55E' : '#EF4444' }}>
            {totalDelta < 0 ? '↓' : '↑'} {totalPct}%
          </p>
        </div>
        <div className="card p-3.5 text-center">
          <p className="text-[11px] text-text-muted">{t('sim.result.estCost')}</p>
          <p className="text-2xl font-extrabold text-energy">${result.costBillion}B</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-0 overflow-hidden h-[280px]">
          <MapContainer center={[40.3, 48.0]} zoom={7} zoomControl={false} scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}>
            <TileLayer key={tileUrl} url={tileUrl} attribution="" />
            {result.hotspotDeltas.map((h) => {
              const d = deltaIcon(h.before, h.after);
              const cityLabel = t(`hotspot.${h.cityKey}`);
              return (
                <Marker key={h.cityKey} position={[h.lat, h.lng]} icon={d.icon}>
                  <Tooltip direction="top" offset={[0, -12]} className="hotspot-tooltip" opacity={1}>
                    <div className="font-bold text-xs">{cityLabel}</div>
                    <div className="flex gap-2 text-[11px] mt-0.5">
                      <span className="text-text-muted">{h.before.toLocaleString()}</span>
                      <span style={{ color: d.color }}>→ {h.after.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] font-bold mt-0.5" style={{ color: d.color }}>
                      {d.reduced ? '↓' : '↑'} {d.pct}%
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="flex flex-col gap-2">
          {result.sectors.map((s) => {
            const reduced = s.delta < 0;
            return (
              <div key={s.sectorKey} className="card p-3.5 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: reduced ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
                  {reduced ? <ArrowDown size={16} color="#22C55E" /> : <ArrowUp size={16} color="#EF4444" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{t(`sim.sector.${s.sectorKey}`)}</span>
                    <span className="text-[13px] font-extrabold" style={{ color: reduced ? '#22C55E' : '#EF4444' }}>
                      {s.delta > 0 ? '+' : ''}{s.delta.toLocaleString()} {t('common.kg')}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    {t(s.reasonKey, s.reasonParams as Record<string, string | number>)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="card">
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('sim.result.timeline')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={result.projectedTimeline} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="baseline" name={t('sim.chart.baseline')} stroke="#EF4444" strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Line type="monotone" dataKey="simulated" name={t('sim.chart.simulated')} stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card flex flex-col justify-center gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.15)] flex items-center justify-center mx-auto mb-2">
              <Leaf size={24} color="#22C55E" />
            </div>
            <p className="text-[28px] font-extrabold text-accent">{result.co2SavedTons.toLocaleString()}</p>
            <p className="text-xs text-text-muted">{t('sim.result.saved')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.15)] flex items-center justify-center mx-auto mb-2">
              <DollarSign size={24} color="#F59E0B" />
            </div>
            <p className="text-[28px] font-extrabold text-energy">${result.costBillion}B</p>
            <p className="text-xs text-text-muted">{t('sim.result.investment')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
