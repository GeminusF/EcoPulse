import { TrendingUp, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { keyInsights } from '../../data/analyticsData';

const iconMap = {
  positive: { icon: TrendingUp, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  neutral: { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  danger: { icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function KeyInsights() {
  const { t } = useTranslation();
  return (
    <div className="card p-4">
      <h3 className="text-sm font-bold text-text-primary mb-3">{t('analytics.keyInsights')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {keyInsights.map((insight, i) => {
          const cfg = iconMap[insight.type];
          const Icon = cfg.icon;
          return (
            <div key={i} className="flex gap-2.5 p-2.5 rounded-lg" style={{ background: cfg.bg }}>
              <Icon size={16} color={cfg.color} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-text-secondary">{t(insight.insightKey)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
