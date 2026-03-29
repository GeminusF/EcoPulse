import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { sectorPerformance } from '../../data/analyticsData';

export default function SectorPerformance() {
  const { t } = useTranslation();
  const rows = useMemo(() => sectorPerformance, []);

  return (
    <div className="card">
      <h3 className="text-base font-bold text-text-primary">{t('analytics.perf.title')}</h3>
      <p className="text-[13px] text-text-muted mt-0.5 mb-4">{t('analytics.perf.sub')}</p>
      <div className="flex flex-col gap-3">
        {rows.map((s) => {
          const barWidth = Math.min(100, (s.current / s.target) * 100);
          const sectorName = t(s.sectorKey);
          return (
            <div key={s.sectorKey} className="p-3 bg-surface-2 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-text-primary">{sectorName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{s.trend}</span>
                  <span className="text-base font-extrabold rounded-md px-2.5 py-0.5"
                    style={{ color: s.gradeColor, background: `${s.gradeColor}22` }}>
                    {s.grade}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-[width] duration-[600ms] ease-out"
                  style={{ width: `${barWidth}%`, background: barWidth > 100 ? '#EF4444' : s.gradeColor }} />
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-text-muted">
                <span>{t('analytics.perf.current', { n: s.current.toLocaleString() })}</span>
                <span>{t('analytics.perf.target', { n: s.target.toLocaleString() })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
