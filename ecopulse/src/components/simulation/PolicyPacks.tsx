import { Car, Sun, Factory, Scale } from 'lucide-react';
import { policyPacks } from '../../data/simulationData';
import type { LeverValues } from '../../data/simulationData';

const iconMap: Record<string, typeof Car> = { car: Car, sun: Sun, factory: Factory, scale: Scale };

interface Props {
  onSelect: (levers: LeverValues) => void;
  activePack: string | null;
}

export default function PolicyPacks({ onSelect, activePack }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {policyPacks.map((p) => {
        const Icon = iconMap[p.icon] ?? Scale;
        const isActive = activePack === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.levers)}
            className="card"
            style={{
              cursor: 'pointer', padding: 16, textAlign: 'left',
              borderColor: isActive ? p.color : undefined,
              background: isActive ? `${p.color}11` : undefined,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Icon size={18} color={p.color} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{p.name}</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}
