import { Car, Sun, Factory, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { policyPacks } from '../../data/simulationData';
import type { LeverValues } from '../../data/simulationData';

const iconMap: Record<string, typeof Car> = { car: Car, sun: Sun, factory: Factory, scale: Scale };

interface Props {
  onSelect: (levers: LeverValues) => void;
  activePack: string | null;
}

export default function PolicyPacks({ onSelect, activePack }: Props) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {policyPacks.map((p) => {
        const Icon = iconMap[p.icon] ?? Scale;
        const isActive = activePack === p.id;
        return (
          <button key={p.id} type="button" onClick={() => onSelect(p.levers)}
            className="card cursor-pointer p-4 text-left transition-colors"
            style={{
              borderColor: isActive ? p.color : undefined,
              background: isActive ? `${p.color}11` : undefined,
            }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
              style={{ background: `${p.color}22` }}>
              <Icon size={18} color={p.color} />
            </div>
            <p className="text-sm font-bold text-text-primary">{t(`sim.pack.${p.id}.name`)}</p>
            <p className="text-[11px] text-text-muted mt-1 leading-snug">{t(`sim.pack.${p.id}.desc`)}</p>
          </button>
        );
      })}
    </div>
  );
}
