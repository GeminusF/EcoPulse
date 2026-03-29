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
    <div className="mb-3.5">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-text-muted font-medium">{label}</span>
        <span className="text-[13px] font-bold text-text-primary">{value}{unit}</span>
      </div>
      <div className="relative h-5 flex items-center">
        {baselinePct !== null && (
          <div className="absolute top-0.5 w-0.5 h-4 bg-text-muted rounded-sm opacity-50 z-[1]"
            style={{ left: `${baselinePct}%` }}
            title={`Current: ${baseline}${unit}`} />
        )}
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-sm outline-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
          }} />
      </div>
    </div>
  );
}
