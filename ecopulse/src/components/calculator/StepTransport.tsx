import { Car, Plane } from 'lucide-react';
import { vehicleTypes } from '../../data/calculatorData';

interface Props {
  commuteKm: number;
  vehicleType: string;
  flightsPerYear: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepTransport({ commuteKm, vehicleType, flightsPerYear, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Car size={16} color="#22D3EE" /> Daily Commute Distance (km)
        </label>
        <input
          type="number"
          value={commuteKm}
          onChange={(e) => onChange('commuteKm', Number(e.target.value))}
          style={{
            width: '100%', padding: '12px 16px', background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)',
            fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, display: 'block' }}>
          Vehicle Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {vehicleTypes.map((v) => (
            <button
              key={v.id}
              onClick={() => onChange('vehicleType', v.id)}
              style={{
                padding: '10px 8px', borderRadius: 8, border: '1px solid',
                borderColor: vehicleType === v.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: vehicleType === v.id ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                color: vehicleType === v.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Plane size={16} color="#A855F7" /> Flights Per Year
        </label>
        <input
          type="number"
          value={flightsPerYear}
          onChange={(e) => onChange('flightsPerYear', Number(e.target.value))}
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
