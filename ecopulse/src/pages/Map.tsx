import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { economicRegions, infrastructure, yearlySnapshots, INFRA_CATEGORIES, hotspotCityLabelKey } from '../data/mapData';
import RegionDetailPanel from '../components/map/RegionDetailPanel';
import PredictedBadge from '../components/shared/PredictedBadge';
import { useSettings } from '../context/SettingsContext';
import { isPredictedYear, getRegionCO2, getRegionPerCapita } from '../utils/predictionEngine';
import type { EconRegionGeo, InfraType } from '../data/mapData';

function spotIcon(co2: number) {
  const scale = Math.min(1, Math.max(0, (co2 - 3000) / 10000));
  const size = Math.round(16 + scale * 24);
  const dotSize = Math.round(size * 0.35);
  return L.divIcon({
    className: 'hotspot-marker',
    html: `<div class="hotspot-ring high" style="width:${size}px;height:${size}px"><div class="hotspot-dot" style="width:${dotSize}px;height:${dotSize}px"></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const infraEmojiMap: Record<string, string> = Object.fromEntries(INFRA_CATEGORIES.map((c) => [c.key, c.emoji]));
const infraColorMap: Record<string, string> = Object.fromEntries(INFRA_CATEGORIES.map((c) => [c.key, c.color]));

const STATUS_BADGE: Record<string, { bg: string; fg: string }> = {
  operational: { bg: 'rgba(34,197,94,0.15)', fg: '#22C55E' },
  development: { bg: 'rgba(234,179,8,0.15)', fg: '#EAB308' },
  planned: { bg: 'rgba(99,102,241,0.15)', fg: '#818CF8' },
  evaluation: { bg: 'rgba(168,85,247,0.15)', fg: '#A855F7' },
  exploration: { bg: 'rgba(6,182,212,0.15)', fg: '#06B6D4' },
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
  const { t } = useTranslation();
  const { resolvedTheme } = useSettings();
  const [layers, setLayers] = useState({ hotspots: true, regions: true, infra: true });
  const [year, setYear] = useState(2025);
  const [selectedRegion, setSelectedRegion] = useState<EconRegionGeo | null>(null);
  const [activeInfraTypes, setActiveInfraTypes] = useState<Set<InfraType>>(new Set(ALL_TYPES));
  const [infraExpanded, setInfraExpanded] = useState(false);

  const snapshot = useMemo(() => yearlySnapshots.find(s => s.year === year), [year]);
  const filteredInfra = useMemo(() => infrastructure.filter((p) => {
    if (!activeInfraTypes.has(p.type)) return false;
    if (p.yearStart > year) return false;
    if (p.yearEnd !== null && year > p.yearEnd) return false;
    return true;
  }), [activeInfraTypes, year]);

  const toggleLayer = (key: keyof typeof layers) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleInfraType = (ty: InfraType) =>
    setActiveInfraTypes((prev) => {
      const next = new Set(prev);
      if (next.has(ty)) next.delete(ty); else next.add(ty);
      return next;
    });

  const tileUrl = resolvedTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative h-[calc(100vh-64px)] flex">
      <MapContainer center={CENTER} zoom={7} zoomControl={true} scrollWheelZoom={true}
        style={{ flex: 1, height: '100%' }}>
        <TileLayer key={tileUrl} url={tileUrl} attribution="" />

        {layers.regions && economicRegions.map((r) => (
          <Polygon key={r.name}
            positions={r.positions as L.LatLngExpression[][] | L.LatLngExpression[][][]}
            pathOptions={{ color: r.color, fillColor: r.color, fillOpacity: 0.18, weight: 1.5 }}
            eventHandlers={{ click: () => setSelectedRegion(r) }}>
            <Tooltip direction="top" className="hotspot-tooltip" opacity={1}>
              <div className="flex flex-col gap-0.5 min-w-[180px]">
                <div className="flex justify-between items-center gap-2.5">
                  <span className="font-bold text-xs text-text-primary">{t(r.i18nKey)}</span>
                  <span className="text-[10px] text-text-muted">{r.nameAz}</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[15px] font-extrabold text-[#22C55E]">{getRegionCO2(r.co2TotalKt, year).toLocaleString()}</span>
                  <span className="text-[10px] text-text-muted">{t('common.ktCo2')}</span>
                  <span className="text-[10px] ml-1" style={{ color: getRegionPerCapita(r.co2PerCapita, year) > 5 ? '#EF4444' : '#22C55E' }}>
                    ({getRegionPerCapita(r.co2PerCapita, year)} {t('common.tCap')})
                  </span>
                </div>
                <div className="border-t border-border pt-0.5 flex gap-2 text-[10px] text-text-muted">
                  <span>🏛️ {r.capital}</span>
                  <span>👥 {(r.population / 1000).toFixed(0)}k</span>
                  <span>📐 {r.areaKm2.toLocaleString()} km²</span>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {layers.hotspots && snapshot?.spots.map((spot) => (
          <Marker key={spot.cityKey} position={[spot.lat, spot.lng]} icon={spotIcon(spot.co2)}>
            <Tooltip direction="top" offset={[0, -12]} className="hotspot-tooltip" opacity={1}>
              <div className="font-bold text-xs">{t(hotspotCityLabelKey(spot.cityKey))}</div>
              <div className="text-base font-extrabold text-[#22C55E]">
                {spot.co2.toLocaleString()} <span className="text-[10px] text-text-muted">{t('common.kg')}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {layers.infra && filteredInfra.map((p) => {
          const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.operational;
          const statusLabel = t(`map.status.${p.status}` as 'map.status.operational');
          return (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={infraIcon(p.type)}>
              <Tooltip direction="top" className="hotspot-tooltip" opacity={1}>
                <div className="flex flex-col gap-0.5 max-w-[240px]">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-xs text-text-primary">{p.name}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-px rounded capitalize whitespace-nowrap"
                      style={{ background: badge.bg, color: badge.fg }}>
                      {statusLabel}
                    </span>
                  </div>
                  {p.capacity && <div className="text-sm font-extrabold text-[#22C55E]">{p.capacity}</div>}
                  {(() => {
                    const yearIdx = year - 2023;
                    const co2Val = p.co2Trend[yearIdx] ?? p.annualCo2Kt;
                    const prevVal = yearIdx > 0 ? (p.co2Trend[yearIdx - 1] ?? p.annualCo2Kt) : co2Val;
                    const changeNum = prevVal > 0 ? ((co2Val - prevVal) / prevVal * 100) : 0;
                    const changeStr = changeNum >= 0 ? `↑ ${changeNum.toFixed(1)}%` : `↓ ${Math.abs(changeNum).toFixed(1)}%`;
                    return co2Val > 0 ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-bold" style={{ color: p.co2Scope === 'lifecycle' ? '#3B82F6' : '#EF4444' }}>
                          {co2Val.toLocaleString()} kt CO₂
                        </span>
                        <span className="text-[9px] px-1 py-px rounded" style={{ background: p.co2Scope === 'lifecycle' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.1)', color: p.co2Scope === 'lifecycle' ? '#60A5FA' : '#F87171' }}>
                          {p.co2Scope === 'lifecycle' ? '⚡ Lifecycle' : '🏭 Direct'}
                        </span>
                        {yearIdx > 0 && <span className={`text-[9px] ${changeNum <= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{changeStr}</span>}
                      </div>
                    ) : null;
                  })()}
                  {p.operator && <div className="text-[10px] text-text-muted">{p.operator}</div>}
                  {p.subType && <div className="text-[10px] text-text-muted capitalize">{p.subType}</div>}
                  {year > 2025 && p.yearStart > 2025 && (
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-[#A855F7]">
                      <Sparkles size={10} /> Built in {p.yearStart}
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-4 left-4 z-10 bg-surface border border-border rounded-[10px] p-3 w-[200px]
                       max-h-[calc(100vh-140px)] overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Layers size={14} className="text-accent" />
          <span className="text-[13px] font-bold text-text-primary">{t('map.layers')}</span>
        </div>
        {(['hotspots', 'regions'] as const).map((k) => (
          <label key={k} className="flex items-center gap-2 py-1 cursor-pointer text-xs text-text-muted">
            <input type="checkbox" checked={layers[k]} onChange={() => toggleLayer(k)} className="accent-accent" />
            {k === 'hotspots' ? t('map.layer.hotspots') : t('map.layer.regions')}
          </label>
        ))}
        <div className="flex items-center gap-1 py-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted flex-1">
            <input type="checkbox" checked={layers.infra} onChange={() => toggleLayer('infra')} className="accent-accent" />
            {t('map.layer.infra')}
            <span className="text-[10px] opacity-60">({filteredInfra.length})</span>
          </label>
          <button type="button" onClick={() => setInfraExpanded(!infraExpanded)}
            className="bg-transparent border-none cursor-pointer p-0.5 text-text-muted flex">
            {infraExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        {infraExpanded && layers.infra && (
          <div className="pl-[18px] flex flex-col gap-px">
            {INFRA_CATEGORIES.map((cat) => {
              const count = infrastructure.filter((p) => p.type === cat.key).length;
              return (
                <label key={cat.key} className="flex items-center gap-1.5 py-0.5 cursor-pointer text-[11px] text-text-muted">
                  <input type="checkbox" checked={activeInfraTypes.has(cat.key)}
                    onChange={() => toggleInfraType(cat.key)}
                    className="w-[13px] h-[13px]" style={{ accentColor: cat.color }} />
                  <span>{cat.emoji}</span>
                  <span className="flex-1">{t(`infra.${cat.key}`)}</span>
                  <span className="text-[10px] opacity-50">{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-surface border border-border
                       rounded-[10px] px-5 py-2.5 flex items-center gap-3 min-w-[280px] sm:min-w-[400px]">
        <Clock size={14} className="text-accent" />
        <span className="text-[13px] font-bold text-text-primary min-w-[36px]">{year}</span>
        <input type="range" min={2023} max={2030} step={1} value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="flex-1 cursor-pointer accent-accent" />
        <PredictedBadge type={isPredictedYear(year)} />
      </div>

      {selectedRegion && (
        <RegionDetailPanel region={selectedRegion} year={year} onClose={() => setSelectedRegion(null)} />
      )}
    </div>
  );
}
