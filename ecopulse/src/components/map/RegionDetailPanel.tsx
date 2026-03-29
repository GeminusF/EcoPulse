import { X, MapPin, Users, Ruler, Building2, Factory } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { EconRegionGeo } from '../../data/mapData';
import { getRegionCO2, getRegionPerCapita, scaleByYear, isPredictedYear } from '../../utils/predictionEngine';
import PredictedBadge from '../shared/PredictedBadge';

interface Props {
  region: EconRegionGeo;
  year: number;
  onClose: () => void;
}

const SECTOR_COLORS: Record<string, string> = {
  energy: '#F59E0B',
  transport: '#22D3EE',
  industry: '#A855F7',
  residential: '#F97316',
  other: '#6B7280',
};

export default function RegionDetailPanel({ region, year, onClose }: Props) {
  const { t } = useTranslation();
  const s = region.co2Sectors;
  const scaledTotal = getRegionCO2(region.co2TotalKt, year);
  const scaledPerCapita = getRegionPerCapita(region.co2PerCapita, year);
  const sectorData = [
    { key: 'energy', value: scaleByYear(s.energyKt, year), pct: s.energyPct, color: SECTOR_COLORS.energy },
    { key: 'transport', value: scaleByYear(s.transportKt, year), pct: s.transportPct, color: SECTOR_COLORS.transport },
    { key: 'industry', value: scaleByYear(s.industryKt, year), pct: s.industryPct, color: SECTOR_COLORS.industry },
    { key: 'residential', value: scaleByYear(s.residentialKt, year), pct: s.residentialPct, color: SECTOR_COLORS.residential },
    { key: 'other', value: scaleByYear(s.otherKt, year), pct: s.otherPct, color: SECTOR_COLORS.other },
  ].map((row) => ({
    ...row,
    name: t(`sector.chart.${row.key}`),
  }));
  const perCapitaColor = scaledPerCapita > 5 ? '#EF4444' : scaledPerCapita > 3 ? '#EAB308' : '#22C55E';

  const statItems = [
    { icon: <MapPin size={12} />, labelKey: 'region.capital', value: region.capital },
    { icon: <Users size={12} />, labelKey: 'region.population', value: `${(region.population / 1000).toFixed(0)}k` },
    { icon: <Ruler size={12} />, labelKey: 'region.area', value: `${region.areaKm2.toLocaleString()} km²` },
    { icon: <Building2 size={12} />, labelKey: 'region.districts', value: String(region.districtsCount) },
  ];

  return (
    <div className="absolute top-0 right-0 w-full sm:w-[340px] h-full z-[1000] bg-surface border-l border-border
                     flex flex-col overflow-auto">
      <div className="flex justify-between items-center px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-text-primary">{t(region.i18nKey)}</h3>
            <PredictedBadge type={isPredictedYear(year)} />
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">{region.nameAz} — {year}</p>
        </div>
        <button type="button" onClick={onClose} className="bg-transparent border-none cursor-pointer p-1 text-text-muted hover:text-text-primary">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {statItems.map((stat) => (
            <div key={stat.labelKey} className="bg-surface-2 rounded-lg px-2.5 py-2">
              <div className="flex items-center gap-1 text-text-muted mb-0.5">
                {stat.icon}
                <span className="text-[10px]">{t(stat.labelKey)}</span>
              </div>
              <span className="text-[13px] font-bold text-text-primary">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-2 rounded-lg p-2.5">
            <p className="text-[10px] text-text-muted">{t('region.totalCo2')}</p>
            <p className="text-[22px] font-extrabold text-accent">{scaledTotal.toLocaleString()}</p>
            <p className="text-[10px] text-text-muted">{t('region.ktYear')}</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-2.5">
            <p className="text-[10px] text-text-muted">{t('region.perCapita')}</p>
            <p className="text-[22px] font-extrabold" style={{ color: perCapitaColor }}>{scaledPerCapita}</p>
            <p className="text-[10px] text-text-muted">{t('region.tonnesPerson')}</p>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-text-muted mb-1.5">{t('region.co2BySector')}</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sectorData} layout="vertical" margin={{ left: 0, right: 8 }}>
              <XAxis type="number" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${Number(v).toLocaleString()} kt`, '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                {sectorData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-1">
          {sectorData.map((d) => (
            <div key={d.key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
              <span className="text-[11px] text-text-muted flex-1">{d.name}</span>
              <span className="text-[11px] font-semibold text-text-primary min-w-[40px] text-right">{d.pct}%</span>
              <span className="text-[10px] text-text-muted min-w-[50px] text-right">{d.value.toLocaleString()} kt</span>
            </div>
          ))}
        </div>

        {region.mainIndustries.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
              <Factory size={12} />
              <span className="text-xs font-semibold">{t('region.keyIndustries')}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {region.mainIndustries.map((ind) => (
                <span key={ind} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-text-muted border border-border">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
            <Building2 size={12} />
            <span className="text-xs font-semibold">{t('region.districtsCities')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {region.districts.map((d) => (
              <span key={d} className={`text-[10px] px-2 py-0.5 rounded-md border
                ${region.cities.includes(d)
                  ? 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[rgba(34,197,94,0.25)]'
                  : 'bg-surface-2 text-text-muted border-border'}`}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
