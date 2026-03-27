interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  baseline?: number;
  onChange: (v: number) => void;
}

export default function SliderInput({ label, value, min, max, step, unit, baseline, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  const baselinePct = baseline !== undefined ? ((baseline - min) / (max - min)) * 100 : null;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        {baselinePct !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${baselinePct}%`,
              top: 2,
              width: 2,
              height: 16,
              background: 'var(--color-text-muted)',
              borderRadius: 1,
              opacity: 0.5,
              zIndex: 1,
            }}
            title={`Current: ${baseline}${unit}`}
          />
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: 4,
            appearance: 'none',
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
            borderRadius: 2,
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
}
