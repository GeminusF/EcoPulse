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
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-2 border-none cursor-pointer
                   text-text-primary text-sm font-semibold font-sans">
        {title}
        <ChevronDown size={16}
          className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 text-[13px] leading-relaxed text-text-secondary">
          {children}
        </div>
      )}
    </div>
  );
}
