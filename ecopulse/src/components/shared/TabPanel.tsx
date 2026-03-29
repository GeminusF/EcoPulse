interface Tab { id: string; label: string; }

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabPanel({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex-1 px-4 py-2 rounded-md border-none cursor-pointer text-[13px] font-sans transition-all duration-150
            ${active === t.id
              ? 'bg-surface text-accent font-semibold'
              : 'bg-transparent text-text-muted font-medium hover:text-text-primary'}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
