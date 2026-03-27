import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { economicRegions, infrastructure, yearlySnapshots, INFRA_CATEGORIES } from '../data/mapData';
import RegionDetailPanel from '../components/map/RegionDetailPanel';
import type { EconRegionGeo, InfraType } from '../data/mapData';

function spotIcon(co2: number) {
  const t = Math.min(1, Math.max(0, (co2 - 3000) / 10000));
  const size = Math.round(16 + t * 24);
  const dotSize = Math.round(size * 0.35);
  return L.divIcon({
    className: 'hotspot-marker',
    html: `<div class="hotspot-ring high" style="width:${size}px;height:${size}px"><div class="hotspot-dot" style="width:${dotSize}px;height:${dotSize}px"></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const infraEmojiMap: Record<string, string> = Object.fromEntries(
  INFRA_CATEGORIES.map((c) => [c.key, c.emoji]),
);
const infraColorMap: Record<string, string> = Object.fromEntries(
  INFRA_CATEGORIES.map((c) => [c.key, c.color]),
);

const STATUS_BADGE: Record<string, { bg: string; fg: string }> = {
  operational:  { bg: 'rgba(34,197,94,0.15)',  fg: '#22C55E' },
  development:  { bg: 'rgba(234,179,8,0.15)',  fg: '#EAB308' },
  planned:      { bg: 'rgba(99,102,241,0.15)', fg: '#818CF8' },
  evaluation:   { bg: 'rgba(168,85,247,0.15)', fg: '#A855F7' },
  exploration:  { bg: 'rgba(6,182,212,0.15)',   fg: '#06B6D4' },
};

function infraIcon(type: string) {
  const color = infraColorMap[type] ?? '#94A3B8';
  const emoji = infraEmojiMap[type] ?? '📍';
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;box-shadow:0 0 6px ${color}80;border:2px solid ${color}">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const CENTER: [number, number] = [40.3, 48.0];

const ALL_TYPES = new Set<InfraType>(INFRA_CATEGORIES.map((c) => c.key));

export default function MapPage() {
  const [layers, setLayers] = useState({ hotspots: true, regions: true, infra: true });
  const [year, setYear] = useState(2025);
  const [selectedRegion, setSelectedRegion] = useState<EconRegionGeo | null>(null);
  const [activeInfraTypes, setActiveInfraTypes] = useState<Set<InfraType>>(new Set(ALL_TYPES));
  const [infraExpanded, setInfraExpanded] = useState(false);

  const snapshot = useMemo(() => yearlySnapshots.find(s => s.year === year), [year]);

  const filteredInfra = useMemo(
    () => infrastructure.filter((p) => activeInfraTypes.has(p.type)),
    [activeInfraTypes],
  );

  const toggle = (key: keyof typeof layers) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleInfraType = (t: InfraType) =>
    setActiveInfraTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)', display: 'flex' }}>
      <MapContainer center={CENTER} zoom={7} zoomControl={true} scrollWheelZoom={true}
        style={{ flex: 1, height: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="" />

        {/* Region polygons */}
        {layers.regions && economicRegions.map((r) => (
          <Polygon
            key={r.name}
            positions={r.positions as L.LatLngExpression[][] | L.LatLngExpression[][][]}
            pathOptions={{ color: r.color, fillColor: r.color, fillOpacity: 0.18, weight: 1.5 }}
            eventHandlers={{ click: () => setSelectedRegion(r) }}
          >
            <Tooltip direction="top" className="hotspot-tooltip" opacity={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-text-primary)' }}>{r.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{r.nameAz}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#22C55E' }}>{r.emissions.toLocaleString()}</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>kg CO₂</span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 3, display: 'flex', gap: 8, fontSize: 10, color: 'var(--color-text-muted)' }}>
                  <span>🏛️ {r.capital}</span>
                  <span>📍 {r.districtsCount} districts</span>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* Hotspot markers */}
        {layers.hotspots && snapshot?.spots.map((spot) => (
          <Marker key={spot.name} position={[spot.lat, spot.lng]} icon={spotIcon(spot.co2)}>
            <Tooltip direction="top" offset={[0, -12]} className="hotspot-tooltip" opacity={1}>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{spot.name}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#22C55E' }}>{spot.co2.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>kg</span></div>
            </Tooltip>
          </Marker>
        ))}

        {/* Infrastructure — all 45 GeoJSON sites */}
        {layers.infra && filteredInfra.map((p) => {
          const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.operational;
          return (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={infraIcon(p.type)}>
              <Tooltip direction="top" className="hotspot-tooltip" opacity={1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 220 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-text-primary)' }}>{p.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                      background: badge.bg, color: badge.fg, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                      {p.status}
                    </span>
                  </div>
                  {p.capacity && (
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#22C55E' }}>{p.capacity}</div>
                  )}
                  {p.operator && (
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{p.operator}</div>
                  )}
                  {p.subType && (
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{p.subType}</div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Layer controls overlay */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000, background: 'var(--color-surface)',
        border: '1px solid var(--color-border)', borderRadius: 10, padding: 12, width: 200,
        maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Layers size={14} color="var(--color-accent)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>Layers</span>
        </div>

        {([['hotspots', 'Hotspots'], ['regions', 'Regions']] as const).map(([k, label]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', fontSize: 12, color: 'var(--color-text-muted)' }}>
            <input type="checkbox" checked={layers[k]} onChange={() => toggle(k)}
              style={{ accentColor: 'var(--color-accent)' }} />
            {label}
          </label>
        ))}

        {/* Infrastructure master toggle + expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--color-text-muted)', flex: 1 }}>
            <input type="checkbox" checked={layers.infra} onChange={() => toggle('infra')}
              style={{ accentColor: 'var(--color-accent)' }} />
            Infrastructure
            <span style={{ fontSize: 10, opacity: 0.6 }}>({filteredInfra.length})</span>
          </label>
          <button onClick={() => setInfraExpanded(!infraExpanded)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--color-text-muted)', display: 'flex' }}>
            {infraExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Infrastructure sub-layer toggles */}
        {infraExpanded && layers.infra && (
          <div style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {INFRA_CATEGORIES.map((cat) => {
              const count = infrastructure.filter((p) => p.type === cat.key).length;
              return (
                <label key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', cursor: 'pointer', fontSize: 11, color: 'var(--color-text-muted)' }}>
                  <input type="checkbox" checked={activeInfraTypes.has(cat.key)}
                    onChange={() => toggleInfraType(cat.key)}
                    style={{ accentColor: cat.color, width: 13, height: 13 }} />
                  <span>{cat.emoji}</span>
                  <span style={{ flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.5 }}>{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Time slider */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10,
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 320,
      }}>
        <Clock size={14} color="var(--color-accent)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 36 }}>{year}</span>
        <input
          type="range" min={2020} max={2025} step={1} value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--color-accent)' }}
        />
      </div>

      {/* Region detail panel */}
      {selectedRegion && (
        <RegionDetailPanel region={selectedRegion} onClose={() => setSelectedRegion(null)} />
      )}
    </div>
  );
}
