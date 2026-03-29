import { useTranslation } from 'react-i18next';
import { Flag, ShieldCheck, Globe, Zap, Leaf } from 'lucide-react';

const milestones = [
  { year: '1990', icon: Flag, titleKey: 'vision.timeline.1990', status: 'past' },
  { year: '2015', icon: ShieldCheck, titleKey: 'vision.timeline.2015', status: 'past' },
  { year: '2024', icon: Globe, titleKey: 'vision.timeline.2024', status: 'present' },
  { year: '2030', icon: Zap, titleKey: 'vision.timeline.2030', status: 'future' },
  { year: '2050', icon: Leaf, titleKey: 'vision.timeline.2050', status: 'future' },
] as const;

export default function MilestoneTimeline() {
  const { t } = useTranslation();

  return (
    <div className="card h-full">
      <h3 className="text-base font-bold text-text-primary mb-6">{t('vision.timeline.title')}</h3>
      
      <div className="mt-4 flex flex-col">
        {milestones.map((item, idx) => {
          const isPast = item.status === 'past';
          const isPresent = item.status === 'present';
          const isFuture = item.status === 'future';
          
          let iconColor = '#6B7280';
          let iconBg = '#18181A';
          let ringColor = 'border-border';

          if (isPast) {
            iconColor = '#A1A1AA';
            iconBg = '#27272A';
          } else if (isPresent) {
            iconColor = '#22C55E';
            iconBg = 'rgba(34,197,94,0.15)';
            ringColor = 'border-accent/40';
          }

          return (
            <div key={item.year} className="relative flex gap-5 pb-8 last:pb-0 group">
              {idx !== milestones.length - 1 && (
                <div className="absolute top-11 bottom-0 left-[21px] w-[2px] bg-border group-hover:bg-border-hover transition-colors" />
              )}
              
              <div 
                className={`relative z-10 w-11 h-11 shrink-0 rounded-xl border-2 ${ringColor} flex items-center justify-center transition-colors`}
                style={{ backgroundColor: iconBg }}
              >
                <item.icon size={20} color={iconColor} />
              </div>

              <div className="pt-1">
                <span className={`text-[12px] font-bold ${isPresent ? 'text-accent' : isFuture ? 'text-text-muted' : 'text-text-secondary'}`}>
                  {item.year}
                </span>
                <h4 className={`text-[15px] font-semibold mt-0.5 ${isFuture ? 'text-text-muted' : 'text-text-primary'}`}>
                  {t(item.titleKey)}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
