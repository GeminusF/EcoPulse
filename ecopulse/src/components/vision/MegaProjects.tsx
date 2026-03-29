import { useTranslation } from 'react-i18next';
import { Cable, Wind, Home } from 'lucide-react';

const projects = [
  {
    id: 'cable',
    icon: Cable,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.15)',
  },
  {
    id: 'wind',
    icon: Wind,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.15)',
  },
  {
    id: 'smart',
    icon: Home,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.15)',
  }
] as const;

export default function MegaProjects() {
  const { t } = useTranslation();

  return (
    <div className="card flex flex-col">
      <h3 className="text-base font-bold text-text-primary mb-4">{t('vision.mega.title')}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {projects.map((proj) => (
          <div key={proj.id} className="min-w-[260px] flex-1 bg-surface-2 border border-border p-5 rounded-2xl transition-all hover:border-border-hover flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: proj.bg }}>
              <proj.icon size={24} color={proj.color} />
            </div>
            <div>
              <h4 className="text-text-primary font-bold text-[15px] mb-1 leading-tight">
                {t(`vision.mega.${proj.id}.title`)}
              </h4>
              <p className="text-[13px] text-text-muted leading-relaxed">
                {t(`vision.mega.${proj.id}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
