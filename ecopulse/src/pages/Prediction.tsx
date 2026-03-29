import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, BarChart, Bar,
} from 'recharts';
import { Brain, TrendingUp, Database, Network, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import SliderInput from '../components/shared/SliderInput';
import {
  forecastFanData, sectorForecasts, backtestData,
  sectorConfidence, modelAccuracy, modelMetadataKeys,
} from '../data/predictionData';
import { generateNarrative } from '../utils/predictionNarrative';

const chartTooltip = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: 12,
};

export default function Prediction() {
  const { t } = useTranslation();
  const [gdpGrowth, setGdpGrowth] = useState(3.5);
  const [oilPrice, setOilPrice] = useState(75);
  const [renewableShare, setRenewableShare] = useState(20);

  const meta = useMemo(() => modelMetadataKeys, []);

  const adjustmentFactor = 1 + (gdpGrowth - 3.5) * 0.04 + (oilPrice - 75) * 0.001 - (renewableShare - 20) * 0.015;
  const adjustedFan = forecastFanData.map(d => ({
    ...d,
    adjusted: Math.round(d.baseline * adjustmentFactor),
  }));

  const narrative = generateNarrative(gdpGrowth, oilPrice, renewableShare, t);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <PageHeader
        title={t('pred.title')}
        subtitle={t('pred.subtitle')}
        action={
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-accent-glow rounded-lg">
            <Brain size={16} className="text-accent" />
            <span className="text-[13px] font-semibold text-accent">{t('pred.modelBadge')}</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="card">
          <h3 className="text-base font-bold text-text-primary">{t('pred.fan.title')}</h3>
          <p className="text-[13px] text-text-muted mt-0.5">{t('pred.fan.sub')}</p>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={adjustedFan} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="band95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTooltip} />
                <Area type="monotone" dataKey="high95" stroke="none" fill="#22C55E" fillOpacity={0.06} />
                <Area type="monotone" dataKey="low95" stroke="none" fill="var(--color-surface)" fillOpacity={1} />
                <Area type="monotone" dataKey="high75" stroke="none" fill="#22C55E" fillOpacity={0.1} />
                <Area type="monotone" dataKey="low75" stroke="none" fill="var(--color-surface)" fillOpacity={1} />
                <Area type="monotone" dataKey="high50" stroke="none" fill="#22C55E" fillOpacity={0.15} />
                <Area type="monotone" dataKey="low50" stroke="none" fill="var(--color-surface)" fillOpacity={1} />
                <Line type="monotone" dataKey="baseline" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: '#22C55E' }} name={t('pred.chart.baseline')} />
                <Line type="monotone" dataKey="withPolicy" stroke="#3B82F6" strokeWidth={2} strokeDasharray="6 3" dot={false} name={t('pred.chart.withPolicy')} />
                <Line type="monotone" dataKey="adjusted" stroke="#F59E0B" strokeWidth={2} dot={false} name={t('pred.chart.whatIf')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-bold text-text-primary mb-4">{t('pred.whatIf.title')}</h3>
          <SliderInput label={t('pred.whatIf.gdp')} value={gdpGrowth} min={0} max={8} step={0.5} unit="%" baseline={3.5} onChange={setGdpGrowth} />
          <SliderInput label={t('pred.whatIf.oil')} value={oilPrice} min={30} max={150} step={5} unit="$" baseline={65} onChange={setOilPrice} />
          <SliderInput label={t('sim.lever.renewableShare')} value={renewableShare} min={5} max={50} step={1} unit="%" baseline={20} onChange={setRenewableShare} />
          
          <div className="mt-4 p-4 bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] rounded-lg text-sm text-text-primary leading-relaxed relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[rgba(34,197,94,0.2)] to-transparent opacity-50 rounded-bl-full ptr-events-none" />
            <TrendingUp size={16} className="text-accent mb-2" />
            <p>{narrative}</p>
          </div>

          <div className="mt-4">
            <p className="text-[13px] font-semibold text-text-muted mb-2">{t('pred.confidence.title')}</p>
            {sectorConfidence.map(s => (
              <div key={s.sectorKey} className="mb-2">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-text-muted">{t(s.sectorKey)}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.confidence}%</span>
                </div>
                <div className="h-1 bg-border rounded-sm">
                  <div className="h-full rounded-sm" style={{ width: `${s.confidence}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-base font-bold text-text-primary">{t('pred.sector.title')}</h3>
          <p className="text-[13px] text-text-muted mt-0.5">{t('pred.sector.sub')}</p>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={sectorForecasts} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="transport" name={t('sector.transport')} stroke="#22D3EE" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="energy" name={t('sector.energy')} stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="industry" name={t('sector.industry')} stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-bold text-text-primary">{t('pred.backtest.title')}</h3>
          <p className="text-[13px] text-text-muted mt-0.5">{t('pred.backtest.sub')}</p>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={backtestData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="actual" name={t('pred.chart.actual')} fill="#22C55E" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="predicted" name={t('pred.chart.predicted')} fill="#4B5563" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2">
              <div className="px-2.5 py-1 bg-surface-2 rounded-md text-[11px]">
                <span className="text-text-muted">{t('pred.mape')} </span>
                <span className="font-bold text-accent">{modelAccuracy.mape}%</span>
              </div>
              <div className="px-2.5 py-1 bg-surface-2 rounded-md text-[11px]">
                <span className="text-text-muted">{t('pred.rmse')} </span>
                <span className="font-bold text-accent">{modelAccuracy.rmse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 md:p-6 mt-2">
        <h3 className="text-base font-bold text-text-primary mb-5">{t('pred.method.title')}</h3>
        
        <div className="flex flex-col md:flex-row gap-5 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border hidden md:block -translate-y-1/2 z-0" />
          
          {/* Node 1: Inputs */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-4 z-10 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(59,130,246,0.15)] flex items-center justify-center shrink-0">
                <Database size={16} className="text-[#3B82F6]" />
              </div>
              <h4 className="font-bold text-[13px] text-text-primary uppercase tracking-wide">{t('pred.method.features')}</h4>
            </div>
            <ul className="text-[11.5px] text-text-muted space-y-1.5 list-disc pl-4 leading-relaxed">
              {meta.features.map(k => <li key={k}>{t(k)}</li>)}
            </ul>
          </div>

          {/* Node 2: Architecture */}
          <div className="flex-[1.2] bg-surface border border-border border-l-accent border-l-4 rounded-xl p-4 z-10 relative shadow-[0_0_20px_rgba(34,197,94,0.05)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center shrink-0">
                <Network size={16} className="text-accent" />
              </div>
              <h4 className="font-bold text-[13px] text-text-primary uppercase tracking-wide">{t('pred.method.arch')}</h4>
            </div>
            <div className="text-[12px] font-bold text-text-primary mb-3 bg-surface-2 px-3 py-2 rounded-lg inline-block border border-border">
              {t(meta.type)}
            </div>
            <div className="flex flex-col gap-1.5 p-3 bg-surface-2 rounded-lg border border-border/50">
              <p className="text-[11px] text-text-muted leading-tight">
                <strong className="text-text-primary">{t(meta.trainingPeriod)}</strong><br/> {t(meta.trainingPeriodVal)}
              </p>
              <p className="text-[11px] text-text-muted leading-tight mt-1">
                <strong className="text-text-primary">{t(meta.dataSources)}</strong><br/> {t(meta.dataSourcesVal)}
              </p>
            </div>
          </div>

          {/* Node 3: Limitations */}
          <div className="flex-1 bg-[rgba(239,68,68,0.02)] border border-[rgba(239,68,68,0.2)] rounded-xl p-4 z-10 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-[#EF4444]" />
              </div>
              <h4 className="font-bold text-[13px] text-[#EF4444] uppercase tracking-wide">{t('pred.method.limits')}</h4>
            </div>
            <ul className="text-[11.5px] text-[#EF4444]/80 space-y-1.5 list-disc pl-4 leading-relaxed">
              {meta.limitations.map(k => <li key={k}>{t(k)}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
