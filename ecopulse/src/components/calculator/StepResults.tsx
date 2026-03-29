import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Trees, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { azerbaijanAvg, worldAvg, treesPerTonCO2, carbonCreditPricePerTon } from '../../data/calculatorData';

interface Breakdown { transport: number; energy: number; lifestyle: number; }
interface Props { total: number; breakdown: Breakdown; }

const colors = ['#22D3EE', '#F59E0B', '#A855F7'];

export default function StepResults({ total, breakdown }: Props) {
  const { t } = useTranslation();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setAnimated(Math.round(p * total));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  const donutData = [
    { nameKey: 'calc.step.transport', value: breakdown.transport },
    { nameKey: 'calc.step.energy', value: breakdown.energy },
    { nameKey: 'calc.step.lifestyle', value: breakdown.lifestyle },
  ];
  const comparisonRows = [
    { nameKey: 'calc.results.you', value: total },
    { nameKey: 'calc.results.azAvg', value: azerbaijanAvg },
    { nameKey: 'calc.results.world', value: worldAvg },
  ];
  const treesNeeded = Math.ceil((total / 1000) * treesPerTonCO2);
  const creditCost = Math.round((total / 1000) * carbonCreditPricePerTon);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-sm text-text-muted mb-1">{t('dash.carbone.reduction')}</p>
        <p className="text-[48px] font-extrabold text-accent">{animated.toLocaleString()}</p>
        <p className="text-sm text-text-muted">{t('dash.carbone.perYear')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-[13px] font-semibold text-text-muted mb-2">{t('calc.results.breakdown')}</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {donutData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ${t('common.kg')}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {donutData.map((d, i) => (
              <div key={d.nameKey} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                <span className="text-[11px] text-text-muted">{t(d.nameKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <p className="text-[13px] font-semibold text-text-muted mb-2">{t('calc.results.comparison')}</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={comparisonRows.map(r => ({ ...r, name: t(r.nameKey) }))} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={72} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ${t('common.kg')}`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {comparisonRows.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#22C55E' : i === 1 ? '#F59E0B' : '#6B7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(34,197,94,0.15)] flex items-center justify-center shrink-0">
            <Trees size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-[22px] font-extrabold text-accent">{treesNeeded}</p>
            <p className="text-xs text-text-muted">{t('calc.results.trees')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(245,158,11,0.15)] flex items-center justify-center shrink-0">
            <DollarSign size={20} className="text-energy" />
          </div>
          <div>
            <p className="text-[22px] font-extrabold text-energy">${creditCost}</p>
            <p className="text-xs text-text-muted">{t('calc.results.credits')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
