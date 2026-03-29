import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { energyMixTimeSeries, energyMixColors } from '../../data/analyticsData';

const fuels = ['oil', 'gas', 'hydro', 'solar', 'wind'] as const;

export default function EnergyMixChart() {
  const { t } = useTranslation();
  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('analytics.energyMix.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5">{t('analytics.energyMix.sub')}</p>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={energyMixTimeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`${v}%`, t(`fuel.${String(name)}`)]}
            />
            {fuels.map((f) => (
              <Area key={f} type="monotone" dataKey={f} stackId="1" stroke={energyMixColors[f]} fill={energyMixColors[f]} fillOpacity={0.7} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 justify-center flex-wrap">
        {fuels.map((f) => (
          <div key={f} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: energyMixColors[f] }} />
            <span className="text-[11px] text-text-muted">{t(`fuel.${f}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
