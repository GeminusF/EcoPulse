import { useState } from 'react';
import { ChevronDown, Truck, Zap, Factory } from 'lucide-react';
import SliderInput from '../shared/SliderInput';
import { leverMetas, baselineLevers } from '../../data/simulationData';
import type { LeverValues } from '../../data/simulationData';

const groups = [
  { id: 'transport' as const, label: 'Transport', icon: Truck, color: '#22D3EE' },
  { id: 'energy' as const, label: 'Energy', icon: Zap, color: '#F59E0B' },
  { id: 'industry' as const, label: 'Industry', icon: Factory, color: '#A855F7' },
];

interface Props {
  levers: LeverValues;
  onChange: (key: keyof LeverValues, value: number) => void;
}

export default function LeverPanel({ levers, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ transport: true, energy: true, industry: true });

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>Adjustment Levers</h3>
      {groups.map((g) => {
        const Icon = g.icon;
        const open = expanded[g.id] !== false;
        const groupLevers = leverMetas.filter(l => l.group === g.id);
        return (
          <div key={g.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [g.id]: !open }))}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <Icon size={14} color={g.color} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', flex: 1, textAlign: 'left' }}>{g.label}</span>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {open && (
              <div style={{ paddingLeft: 4, paddingTop: 4 }}>
                {groupLevers.map((lm) => (
                  <SliderInput
                    key={lm.key}
                    label={lm.label}
                    value={levers[lm.key]}
                    min={lm.min}
                    max={lm.max}
                    step={lm.step}
                    unit={lm.unit}
                    baseline={baselineLevers[lm.key]}
                    onChange={(v) => onChange(lm.key, v)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
