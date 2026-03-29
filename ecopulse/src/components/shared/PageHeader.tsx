import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl md:text-[32px] font-extrabold text-text-primary">{title}</h1>
        <p className="text-text-muted text-sm mt-1">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
