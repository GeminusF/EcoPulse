import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>{title}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
