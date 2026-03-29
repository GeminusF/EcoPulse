import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TFunction } from 'i18next';
import { baselineEmissions, YEARS } from '../../utils/predictionEngine';

// Government target trajectory (35% reduction from 2020 baseline by 2030)
const GOV_2020_BASELINE = 60000; // National CO₂ target baseline
const GOV_2030_TARGET = 39000;   // 35% reduction target

const gapData = YEARS.map((y) => {
  const target = Math.round(GOV_2020_BASELINE - (GOV_2020_BASELINE - GOV_2030_TARGET) * ((y - 2020) / 10));
  // AI prediction uses the central prediction engine values, scaled to national level
  const ai = Math.round(baselineEmissions[y] * 2.55); // scale factor to match national aggregate
  return { year: String(y), target, ai };
});

function GapTooltip({ active, payload, t }: { active?: boolean; payload?: any[]; t: TFunction }) {
  if (!active || !payload?.length) return null;
  const target = payload.find(p => p.dataKey === 'target')?.value || 0;
  const ai = payload.find(p => p.dataKey === 'ai')?.value || 0;
  const year = payload[0].payload.year;
  
  const delta = ai - target;
  const isOffTrack = delta > 0 && year !== '2020';

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-xl min-w-[180px]">
      <div className="text-[13px] font-bold text-text-muted mb-3 border-b border-border pb-2">{year}</div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-text-muted">{t('vision.gap.target')}</span>
          <span className="font-semibold text-text-primary">{(target / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[#A855F7]">{t('vision.gap.prediction')}</span>
          <span className="font-semibold text-text-primary">{(ai / 1000).toFixed(1)}k</span>
        </div>
      </div>

      {year !== '2020' && (
        <div className={`mt-3 pt-2 border-t border-border flex items-center justify-between text-[13px] font-bold
          ${isOffTrack ? 'text-red-400' : 'text-accent'}`}>
          <span>{isOffTrack ? t('vision.gap.offTrack') : t('vision.gap.onTrack')}</span>
          <span>{Math.abs(delta / 1000).toFixed(1)}k gap</span>
        </div>
      )}
    </div>
  );
}

export default function AIGapAnalysis() {
  const { t } = useTranslation();

  return (
    <div className="card h-full flex flex-col">
      <div>
        <h3 className="text-base font-bold text-text-primary">{t('vision.gap.title')}</h3>
        <p className="text-[13px] text-text-muted mt-0.5">{t('vision.gap.subtitle')}</p>
      </div>

      <div className="mt-6 w-full min-h-[250px]">
        <ResponsiveContainer width="99%" height={250}>
          <ComposedChart data={gapData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="aiCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
            <Tooltip content={<GapTooltip t={t} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Line type="monotone" dataKey="target" stroke="#22C55E" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Area type="monotone" dataKey="ai" stroke="#A855F7" strokeWidth={3} fill="url(#aiCurveGrad)" dot={{ r: 4, fill: '#A855F7', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#C084FC' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
