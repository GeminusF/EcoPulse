import { Zap, Home } from 'lucide-react';
import { heatingTypes } from '../../data/calculatorData';

interface Props {
  electricityKwh: number;
  heatingType: string;
  homeSizeSqm: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepEnergy({ electricityKwh, heatingType, homeSizeSqm, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={16} color="#F59E0B" /> Monthly Electricity (kWh)
        </label>
        <input
          type="number"
          value={electricityKwh}
          onChange={(e) => onChange('electricityKwh', Number(e.target.value))}
          style={{
            width: '100%', padding: '12px 16px', background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)',
            fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, display: 'block' }}>
          Heating Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {heatingTypes.map((h) => (
            <button
              key={h.id}
              onClick={() => onChange('heatingType', h.id)}
              style={{
                padding: '10px 12px', borderRadius: 8, border: '1px solid',
                borderColor: heatingType === h.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: heatingType === h.id ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                color: heatingType === h.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Home size={16} color="#22C55E" /> Home Size (m²)
        </label>
        <input
          type="number"
          value={homeSizeSqm}
          onChange={(e) => onChange('homeSizeSqm', Number(e.target.value))}
          style={{
            width: '100%', padding: '12px 16px', background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)',
            fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
