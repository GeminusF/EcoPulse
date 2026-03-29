import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { hotspots } from '../../data/mockData';
import { useSettings } from '../../context/SettingsContext';

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

function buildTooltipHtml(
  spot: (typeof hotspots)[number],
  t: TFunction,
) {
  const changeColor = spot.change.startsWith('↑') ? '#22C55E' : '#EF4444';
  const name = t(spot.nameKey);
  const top = t(spot.topSourceKey);
  const kg = t('common.kgCo2');
  return `
    <div style="display:flex;flex-direction:column;gap:4px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <span style="font-weight:700;font-size:12px;color:var(--color-text-primary)">${name}</span>
        <span style="font-size:10px;font-weight:600;color:${changeColor}">${spot.change}</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:3px">
        <span style="font-size:16px;font-weight:800;color:#22C55E">${spot.co2.toLocaleString()}</span>
        <span style="font-size:10px;color:var(--color-text-muted)">${kg}</span>
      </div>
      <div style="border-top:1px solid var(--color-border);padding-top:4px;font-size:10px;color:var(--color-text-muted)">
        ${top}
      </div>
    </div>
  `;
}

const AZERBAIJAN_CENTER: [number, number] = [40.3, 48.0];

export default function EmissionHotspots() {
  const { t } = useTranslation();
  const { resolvedTheme } = useSettings();
  const tileUrl = resolvedTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="card flex flex-col overflow-hidden relative">
      <h3 className="text-base font-bold text-text-primary">{t('dash.hotspot.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5">{t('dash.hotspot.subtitle')}</p>

      <div className="relative flex-1 rounded-lg overflow-hidden mt-3 min-h-[220px]">
        <MapContainer center={AZERBAIJAN_CENTER} zoom={7} zoomControl={true} scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: 220, borderRadius: 8 }}>
          <TileLayer key={tileUrl} url={tileUrl} attribution="" />
          {hotspots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}
              icon={createHotspotIcon(spot.intensity, spot.co2)}>
              <Tooltip direction="top" offset={[0, -14]} className="hotspot-tooltip" opacity={1}>
                <div dangerouslySetInnerHTML={{ __html: buildTooltipHtml(spot, t) }} />
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 rounded-md px-2.5 py-1">
          <div className="pulse-glow w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-text-muted">{t('dash.hotspot.highEmission')}</span>
        </div>
      </div>
    </div>
  );
}
