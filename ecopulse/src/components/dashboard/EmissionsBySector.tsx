import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { sectorData } from '../../data/mockData';

interface SectorEntry { nameKey: string; value: number; percent: number; color: string; }

function CustomTooltip({
  active,
  payload,
  t,
}: {
  active?: boolean;
  payload?: Array<{ payload: SectorEntry }>;
  t: (k: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-[13px]">
      <p className="font-semibold text-text-primary">{t(d.nameKey)}</p>
      <p className="text-text-muted">{d.value.toLocaleString()} {t('common.kg')} &middot; {d.percent}%</p>
    </div>
  );
}

export default function EmissionsBySector() {
  const { t } = useTranslation();
  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('dash.sector.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5">{t('dash.sector.subtitle')}</p>

      <div className="flex flex-col sm:flex-row gap-6 mt-5 items-center">
        <div className="w-[200px] h-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" innerRadius={65} outerRadius={95}
                dataKey="value" paddingAngle={3} isAnimationActive={true}>
                {sectorData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip t={t} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-4">
          {sectorData.map((sector) => (
            <div key={sector.nameKey} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sector.color }} />
              <span className="text-[15px] font-medium text-text-primary flex-1 min-w-[80px]">{t(sector.nameKey)}</span>
              <span className="text-[15px] font-semibold text-text-muted">{sector.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
