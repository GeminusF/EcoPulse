import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { hotspots } from '../../data/mockData';

const CO2_MIN = 3800;
const CO2_MAX = 12600;
const RING_MIN = 18;
const RING_MAX = 40;

function ringSize(co2: number) {
  const t = Math.min(1, Math.max(0, (co2 - CO2_MIN) / (CO2_MAX - CO2_MIN)));
  return Math.round(RING_MIN + t * (RING_MAX - RING_MIN));
}

function createHotspotIcon(intensity: 'high' | 'medium', co2: number) {
  const size = ringSize(co2);
  const dotSize = Math.round(size * 0.35);
  return L.divIcon({
    className: 'hotspot-marker',
    html: `<div class="hotspot-ring ${intensity}" style="width:${size}px;height:${size}px">
             <div class="hotspot-dot" style="width:${dotSize}px;height:${dotSize}px"></div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildTooltipHtml(spot: (typeof hotspots)[number]) {
  const changeColor = spot.change.startsWith('↑') ? '#22C55E' : '#EF4444';
  return `
    <div style="display:flex;flex-direction:column;gap:4px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <span style="font-weight:700;font-size:12px;color:var(--color-text-primary)">${spot.name}</span>
        <span style="font-size:10px;font-weight:600;color:${changeColor}">${spot.change}</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:3px">
        <span style="font-size:16px;font-weight:800;color:#22C55E">${spot.co2.toLocaleString()}</span>
        <span style="font-size:10px;color:var(--color-text-muted)">kg CO₂</span>
      </div>
      <div style="border-top:1px solid var(--color-border);padding-top:4px;font-size:10px;color:var(--color-text-muted)">
        ${spot.topSource}
      </div>
    </div>
  `;
}

const AZERBAIJAN_CENTER: [number, number] = [40.3, 48.0];
const DEFAULT_ZOOM = 7;

export default function EmissionHotspots() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        Emission Hotspots in Azerbaijan
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
        Real-time monitoring of key regions
      </p>

      <div style={{ position: 'relative', flex: 1, borderRadius: 8, overflow: 'hidden', marginTop: 12, minHeight: 220 }}>
        <MapContainer
          center={AZERBAIJAN_CENTER}
          zoom={DEFAULT_ZOOM}
          zoomControl={true}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: 220, borderRadius: 8 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution=""
          />

          {hotspots.map((spot) => (
            <Marker
              key={spot.name}
              position={[spot.lat, spot.lng]}
              icon={createHotspotIcon(spot.intensity, spot.co2)}
            >
              <Tooltip
                direction="top"
                offset={[0, -14]}
                className="hotspot-tooltip"
                opacity={1}
              >
                <div dangerouslySetInnerHTML={{ __html: buildTooltipHtml(spot) }} />
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 6,
            padding: '4px 10px',
          }}
        >
          <div className="pulse-glow" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>High Emission</span>
        </div>
      </div>
    </div>
  );
}
