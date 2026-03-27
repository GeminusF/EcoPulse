interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabPanel({ tabs, active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface-2)', borderRadius: 8, padding: 4 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: active === t.id ? 600 : 500,
            fontFamily: 'inherit',
            background: active === t.id ? 'var(--color-surface)' : 'transparent',
            color: active === t.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
