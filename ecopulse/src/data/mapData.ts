export interface EconRegionGeo {
  name: string;
  nameAz: string;
  center: [number, number];
  emissions: number;
  color: string;
  capital: string;
  districts: string[];
  districtsCount: number;
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
    districts: string[];
    district_count: number;
  };
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'MultiPolygon'; coordinates: number[][][][] };
}

const REGION_EMISSIONS: Record<string, number> = {
  'Absheron-Khizi': 14200,
  'Aran': 4600,
  'Ganja-Gazakh': 5800,
  'Guba-Khachmaz': 750,
  'Karabakh': 2600,
  'Kalbajar-Lachin': 420,
  'Lankaran': 1400,
  'Mil-Mughan': 1800,
  'Mountainous Shirvan': 1200,
  'Shaki-Zagatala': 980,
  'East Zangezur': 600,
  'Nakhchivan': 520,
};

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
  const { positions, geometryType } = toLeafletPositions(f.geometry);
  return {
    name: f.properties.name,
    nameAz: f.properties.name_az,
    center: computeCenter(f.geometry),
    emissions: REGION_EMISSIONS[f.properties.name] ?? 800,
    color: f.properties.color,
    capital: f.properties.capital,
    districts: f.properties.districts,
    districtsCount: f.properties.district_count,
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
}));

export const INFRA_CATEGORIES: { key: InfraType; label: string; color: string; emoji: string }[] = [
  { key: 'oil_field',            label: 'Oil Fields',       color: '#1E293B', emoji: '🛢️' },
  { key: 'gas_field',            label: 'Gas Fields',       color: '#F97316', emoji: '🔥' },
  { key: 'refinery',             label: 'Refineries',       color: '#A855F7', emoji: '⚙️' },
  { key: 'pipeline_terminal',    label: 'Pipelines',        color: '#6366F1', emoji: '🔗' },
  { key: 'thermal_power_plant',  label: 'Thermal Plants',   color: '#EF4444', emoji: '🏭' },
  { key: 'hydro_power_plant',    label: 'Hydro Plants',     color: '#3B82F6', emoji: '💧' },
  { key: 'wind_farm',            label: 'Wind Farms',       color: '#06B6D4', emoji: '💨' },
  { key: 'solar_plant',          label: 'Solar Plants',     color: '#FACC15', emoji: '☀️' },
  { key: 'compressor_station',   label: 'Compressors',      color: '#78716C', emoji: '🔧' },
  { key: 'petrochemical',        label: 'Petrochemical',    color: '#EC4899', emoji: '🧪' },
];

export interface YearlyHotspotSnapshot {
  year: number;
  spots: { name: string; lat: number; lng: number; co2: number }[];
}

export const yearlySnapshots: YearlyHotspotSnapshot[] = [
  { year: 2020, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 9800 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 7600 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 4200 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 3600 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3400 },
  ]},
  { year: 2021, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 10200 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 8000 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 4500 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 3700 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3500 },
  ]},
  { year: 2022, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 10800 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 8500 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 4800 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 3900 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3600 },
  ]},
  { year: 2023, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 11400 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 9000 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 5000 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 4000 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3700 },
  ]},
  { year: 2024, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 12000 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 9400 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 5200 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 4100 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3800 },
  ]},
  { year: 2025, spots: [
    { name: 'Baku', lat: 40.4093, lng: 49.8671, co2: 12600 },
    { name: 'Sumqayit', lat: 40.5855, lng: 49.6317, co2: 9800 },
    { name: 'Ganja', lat: 40.6828, lng: 46.3606, co2: 5400 },
    { name: 'Shirvan', lat: 39.9381, lng: 48.9206, co2: 4200 },
    { name: 'Mingachevir', lat: 40.7703, lng: 47.0596, co2: 3800 },
  ]},
];
