import { TrendingUp, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { keyInsights } from '../../data/analyticsData';

const iconMap = {
  positive: { icon: TrendingUp, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  neutral: { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  danger: { icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function KeyInsights() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>Key Insights</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {keyInsights.map((insight, i) => {
          const cfg = iconMap[insight.type];
          const Icon = cfg.icon;
          return (
            <div key={i} style={{ display: 'flex', gap: 10, padding: 10, background: cfg.bg, borderRadius: 8 }}>
              <Icon size={16} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
