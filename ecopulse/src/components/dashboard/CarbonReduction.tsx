import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslation } from 'react-i18next';
import { reductionSparkline } from '../../data/mockData';

export default function CarbonReduction() {
  const { t } = useTranslation();
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <p className="text-[13px] text-text-muted font-medium">{t('sidebar.carbonReduction')}</p>
      <p className="text-[28px] font-extrabold text-accent mt-1">-12%</p>
      <p className="text-xs text-text-muted">{t('sidebar.thisMonth')}</p>
      <div className="mt-2">
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={reductionSparkline}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2}
              fill="url(#greenGrad)" fillOpacity={1} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
