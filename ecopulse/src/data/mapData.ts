import { getHotspotCO2, isPredictedYear } from '../utils/predictionEngine';

export interface Co2Sector {
  energyKt: number;
  transportKt: number;
  industryKt: number;
  residentialKt: number;
  otherKt: number;
  energyPct: number;
  transportPct: number;
  industryPct: number;
  residentialPct: number;
  otherPct: number;
}

const REGION_NAME_TO_I18N: Record<string, string> = {
  'Baku': 'regions.baku',
  'Absheron-Khizi': 'regions.absheron_khizi',
  'Ganja-Dashkasan': 'regions.ganja_dashkasan',
  'Shaki-Zagatala': 'regions.shaki_zagatala',
  'Lankaran-Astara': 'regions.lankaran_astara',
  'Guba-Khachmaz': 'regions.guba_khachmaz',
  'Central Aran': 'regions.central_aran',
  'Karabakh': 'regions.karabakh',
  'East Zangezur': 'regions.east_zangezur',
  'Mountainous Shirvan': 'regions.mountainous_shirvan',
  'Nakhchivan': 'regions.nakhchivan',
  'Gazakh-Tovuz': 'regions.gazakh_tovuz',
  'Mil-Mughan': 'regions.mil_mughan',
  'Shirvan-Salyan': 'regions.shirvan_salyan',
};

export interface EconRegionGeo {
  name: string;
  nameAz: string;
  i18nKey: string;
  center: [number, number];
  co2TotalKt: number;
  co2PerCapita: number;
  co2Sectors: Co2Sector;
  color: string;
  capital: string;
  areaKm2: number;
  population: number;
  populationDensity: number;
  districts: string[];
  districtsCount: number;
  cities: string[];
  mainIndustries: string[];
  positions: [number, number][][] | [number, number][][][];
  geometryType: 'Polygon' | 'MultiPolygon';
}

import regionsJson from './economicRegions.json';

interface RegionFeature {
  properties: {
    name: string;
    name_az: string;
    capital: string;
    color: string;
    area_km2: number;
    population_2021: number;
    population_density_per_km2: number;
    districts: string[];
    district_count: number;
    cities: string[];
    main_industries: string[];
    co2_total_kt: number;
    co2_per_capita_tonnes: number;
    co2_energy_kt: number;
    co2_transport_kt: number;
    co2_industry_kt: number;
    co2_residential_kt: number;
    co2_other_kt: number;
    co2_energy_pct: number;
    co2_transport_pct: number;
    co2_industry_pct: number;
    co2_residential_pct: number;
    co2_other_pct: number;
  };
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'MultiPolygon'; coordinates: number[][][][] };
}

function computeCenter(geom: RegionFeature['geometry']): [number, number] {
  const ring =
    geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0];
  let latSum = 0;
  let lngSum = 0;
  for (const [lng, lat] of ring) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / ring.length, lngSum / ring.length];
}

function toLeafletPositions(
  geom: RegionFeature['geometry'],
): { positions: [number, number][][] | [number, number][][][]; geometryType: 'Polygon' | 'MultiPolygon' } {
  if (geom.type === 'Polygon') {
    const positions = geom.coordinates.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number]),
    );
    return { positions, geometryType: 'Polygon' };
  }
  const positions = geom.coordinates.map((poly) =>
    poly.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number]),
    ),
  );
  return { positions, geometryType: 'MultiPolygon' };
}

const regionFeatures = (regionsJson as unknown as { features: RegionFeature[] }).features;

export const economicRegions: EconRegionGeo[] = regionFeatures.map((f) => {
  const p = f.properties;
  const { positions, geometryType } = toLeafletPositions(f.geometry);
  return {
    name: p.name,
    nameAz: p.name_az,
    i18nKey: REGION_NAME_TO_I18N[p.name] ?? `regions.${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    center: computeCenter(f.geometry),
    co2TotalKt: p.co2_total_kt,
    co2PerCapita: p.co2_per_capita_tonnes,
    co2Sectors: {
      energyKt: p.co2_energy_kt,
      transportKt: p.co2_transport_kt,
      industryKt: p.co2_industry_kt,
      residentialKt: p.co2_residential_kt,
      otherKt: p.co2_other_kt,
      energyPct: p.co2_energy_pct,
      transportPct: p.co2_transport_pct,
      industryPct: p.co2_industry_pct,
      residentialPct: p.co2_residential_pct,
      otherPct: p.co2_other_pct,
    },
    color: p.color,
    capital: p.capital,
    areaKm2: p.area_km2,
    population: p.population_2021,
    populationDensity: p.population_density_per_km2,
    districts: p.districts,
    districtsCount: p.district_count,
    cities: p.cities,
    mainIndustries: p.main_industries,
    positions,
    geometryType,
  };
});

export type InfraType =
  | 'oil_field'
  | 'gas_field'
  | 'refinery'
  | 'pipeline_terminal'
  | 'thermal_power_plant'
  | 'hydro_power_plant'
  | 'wind_farm'
  | 'solar_plant'
  | 'compressor_station'
  | 'petrochemical';

export interface InfrastructurePoint {
  id: string;
  name: string;
  type: InfraType;
  subType: string;
  status: string;
  operator: string;
  lat: number;
  lng: number;
  capacity: string | null;
  location: string;
  notes: string;
  yearStart: number;
  yearEnd: number | null;
  annualCo2Kt: number;
  co2Scope: 'direct' | 'lifecycle';
  co2Trend: number[];
}

interface GeoFeature {
  id: string;
  geometry: { coordinates: [number, number] };
  properties: {
    name: string;
    type: string;
    sub_type?: string;
    status: string;
    operator?: string;
    location?: string;
    notes?: string;
    capacity_mw?: number;
    capacity_mt_yr?: number;
    capacity_bbl_d?: number;
    throughput_bbl_d?: number;
    annual_generation_gwh?: number;
    reserves_oil_mt?: number;
    reserves_gas_bcm?: number;
    year_start?: number;
    year_end?: number | null;
    annual_co2_kt?: number;
    co2_scope?: string;
    co2_trend_2023_2030?: number[];
    [key: string]: unknown;
  };
}

function formatCapacity(p: GeoFeature['properties']): string | null {
  if (p.capacity_mw) return `${p.capacity_mw.toLocaleString()} MW`;
  if (p.capacity_mt_yr) return `${p.capacity_mt_yr} Mt/yr`;
  if (p.capacity_bbl_d) return `${p.capacity_bbl_d.toLocaleString()} bbl/d`;
  if (p.throughput_bbl_d) return `${p.throughput_bbl_d.toLocaleString()} bbl/d`;
  if (p.annual_generation_gwh) return `${p.annual_generation_gwh.toLocaleString()} GWh/yr`;
  if (p.reserves_gas_bcm) return `${p.reserves_gas_bcm} bcm reserves`;
  if (p.reserves_oil_mt) return `${p.reserves_oil_mt} Mt reserves`;
  return null;
}

import energySitesJson from './energySites.json';

const features = (energySitesJson as unknown as { features: GeoFeature[] }).features;

export const infrastructure: InfrastructurePoint[] = features.map((f) => ({
  id: f.id,
  name: f.properties.name,
  type: f.properties.type as InfraType,
  subType: (f.properties.sub_type ?? '').replace(/_/g, ' '),
  status: f.properties.status,
  operator: f.properties.operator ?? '',
  lat: f.geometry.coordinates[1],
  lng: f.geometry.coordinates[0],
  capacity: formatCapacity(f.properties),
  location: f.properties.location ?? '',
  notes: f.properties.notes ?? '',
  yearStart: f.properties.year_start ?? 2000,
  yearEnd: f.properties.year_end ?? null,
  annualCo2Kt: f.properties.annual_co2_kt ?? 0,
  co2Scope: (f.properties.co2_scope ?? 'direct') as 'direct' | 'lifecycle',
  co2Trend: f.properties.co2_trend_2023_2030 ?? [],
}));

export const INFRA_CATEGORIES: { key: InfraType; color: string; emoji: string }[] = [
  { key: 'oil_field',            color: '#1E293B', emoji: '🛢️' },
  { key: 'gas_field',            color: '#F97316', emoji: '🔥' },
  { key: 'refinery',             color: '#A855F7', emoji: '⚙️' },
  { key: 'pipeline_terminal',    color: '#6366F1', emoji: '🔗' },
  { key: 'thermal_power_plant',  color: '#EF4444', emoji: '🏭' },
  { key: 'hydro_power_plant',    color: '#3B82F6', emoji: '💧' },
  { key: 'wind_farm',            color: '#06B6D4', emoji: '💨' },
  { key: 'solar_plant',          color: '#FACC15', emoji: '☀️' },
  { key: 'compressor_station',   color: '#78716C', emoji: '🔧' },
  { key: 'petrochemical',        color: '#EC4899', emoji: '🧪' },
];

const CITY_HOTSPOT_KEYS = {
  baku: 'hotspot.baku',
  sumqayit: 'hotspot.sumqayit',
  ganja: 'hotspot.ganja',
  shirvan: 'hotspot.shirvan',
  mingachevir: 'hotspot.mingachevir',
} as const;

export type HotspotCityKey = keyof typeof CITY_HOTSPOT_KEYS;

export interface YearlyHotspotSnapshot {
  year: number;
  predicted: boolean;
  spots: { cityKey: HotspotCityKey; lat: number; lng: number; co2: number }[];
}

const CITY_COORDS: Record<HotspotCityKey, { lat: number; lng: number }> = {
  baku: { lat: 40.4093, lng: 49.8671 },
  sumqayit: { lat: 40.5855, lng: 49.6317 },
  ganja: { lat: 40.6828, lng: 46.3606 },
  shirvan: { lat: 39.9381, lng: 48.9206 },
  mingachevir: { lat: 40.7703, lng: 47.0596 },
};

export const yearlySnapshots: YearlyHotspotSnapshot[] = (
  [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030] as const
).map((year) => ({
  year,
  predicted: isPredictedYear(year) !== 'actual',
  spots: (Object.keys(CITY_COORDS) as HotspotCityKey[]).map((cityKey) => ({
    cityKey,
    ...CITY_COORDS[cityKey],
    co2: getHotspotCO2(cityKey, year),
  })),
}));

export function hotspotCityLabelKey(cityKey: HotspotCityKey): string {
  return CITY_HOTSPOT_KEYS[cityKey];
}
