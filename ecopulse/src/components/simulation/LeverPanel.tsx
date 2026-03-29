import { useState } from 'react';
import { ChevronDown, Truck, Zap, Factory } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SliderInput from '../shared/SliderInput';
import { leverMetas, baselineLevers } from '../../data/simulationData';
import type { LeverValues } from '../../data/simulationData';

const groups = [
  { id: 'transport' as const, labelKey: 'sim.group.transport', icon: Truck, color: '#22D3EE' },
  { id: 'energy' as const, labelKey: 'sim.group.energy', icon: Zap, color: '#F59E0B' },
  { id: 'industry' as const, labelKey: 'sim.group.industry', icon: Factory, color: '#A855F7' },
];

interface Props {
  levers: LeverValues;
  onChange: (key: keyof LeverValues, value: number) => void;
}

export default function LeverPanel({ levers, onChange }: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ transport: true, energy: true, industry: true });

  return (
    <div className="card p-4">
      <h3 className="text-sm font-bold text-text-primary mb-3">{t('sim.levers')}</h3>
      {groups.map((g) => {
        const Icon = g.icon;
        const open = expanded[g.id] !== false;
        const groupLevers = leverMetas.filter(l => l.group === g.id);
        return (
          <div key={g.id} className="mb-2">
            <button type="button" onClick={() => setExpanded(prev => ({ ...prev, [g.id]: !open }))}
              className="w-full flex items-center gap-2 py-2 bg-transparent border-none cursor-pointer font-sans">
              <Icon size={14} color={g.color} />
              <span className="text-[13px] font-semibold text-text-primary flex-1 text-left">{t(g.labelKey)}</span>
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="pl-1 pt-1">
                {groupLevers.map((lm) => (
                  <SliderInput key={lm.key} label={t(`sim.lever.${lm.key}`)} value={levers[lm.key]}
                    min={lm.min} max={lm.max} step={lm.step} unit={lm.unit}
                    baseline={baselineLevers[lm.key]} onChange={(v) => onChange(lm.key, v)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
