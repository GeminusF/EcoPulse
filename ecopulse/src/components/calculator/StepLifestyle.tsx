import { dietTypes } from '../../data/calculatorData';

interface Props {
  diet: string;
  shoppingScore: number;
  recyclingPct: number;
  onChange: (field: string, value: number | string) => void;
}

export default function StepLifestyle({ diet, shoppingScore, recyclingPct, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, display: 'block' }}>
          Diet Type
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dietTypes.map((d) => (
            <button
              key={d.id}
              onClick={() => onChange('diet', d.id)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', borderRadius: 8, border: '1px solid',
                borderColor: diet === d.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: diet === d.id ? 'var(--color-accent-glow)' : 'var(--color-surface-2)',
                color: diet === d.id ? 'var(--color-accent)' : 'var(--color-text-primary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <span>{d.label}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.kgPerYear.toLocaleString()} kg/yr</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Shopping Habits (1 = minimal, 10 = heavy)
          </label>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{shoppingScore}</span>
        </div>
        <input
          type="range" min={1} max={10} step={1} value={shoppingScore}
          onChange={(e) => onChange('shoppingScore', Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Recycling Rate
          </label>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{recyclingPct}%</span>
        </div>
        <input
          type="range" min={0} max={100} step={5} value={recyclingPct}
          onChange={(e) => onChange('recyclingPct', Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
