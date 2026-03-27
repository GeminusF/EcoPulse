import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function InfoAccordion({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--color-surface-2)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-primary)',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'inherit',
        }}
      >
        {title}
        <ChevronDown
          size={16}
          style={{
            color: 'var(--color-text-muted)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div style={{ padding: 16, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
