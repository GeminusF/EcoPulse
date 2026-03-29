import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { predictionData } from '../../data/mockData';

interface PredictionEntry { year: string; kg: number; }

function CustomTooltip({
  active,
  payload,
  t,
}: {
  active?: boolean;
  payload?: Array<{ payload: PredictionEntry }>;
  t: TFunction;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-[13px]">
      <p className="text-text-muted">{d.year}</p>
      <p className="font-bold text-text-primary">{d.kg.toLocaleString()} {t('common.kg')}</p>
    </div>
  );
}


export default function AIEmissionPrediction() {
  const { t } = useTranslation();
  const first = predictionData[0]?.kg ?? 1;
  const last = predictionData[predictionData.length - 1]?.kg ?? 1;
  const isDecrease = last < first;
  const pct = Math.abs(((last - first) / first) * 100).toFixed(1);

  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('dash.ai.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5">{t('dash.ai.subtitle')}</p>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={predictionData} margin={{ top: 30, right: 20, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={['auto', 'auto']}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Area type="monotone" dataKey="kg" stroke="#22C55E" strokeWidth={2.5} fill="url(#aiGradient)"
              dot={{ fill: '#22C55E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#4ADE80' }}
              isAnimationActive={true} animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 bg-surface-2 border border-border rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-[13px] text-text-muted">{t('dash.ai.projected')}</span>
        <div className="flex items-center gap-1.5">
          {isDecrease ? <TrendingDown size={14} className="text-transport" /> : <TrendingUp size={14} className="text-accent" />}
          <span className={`text-[13px] font-bold ${isDecrease ? 'text-transport' : 'text-accent'}`}>
            {isDecrease ? `↓ ${pct}%` : `↑ ${pct}%`} {t('dash.ai.by2030')}
          </span>
        </div>
      </div>
    </div>
  );
}
