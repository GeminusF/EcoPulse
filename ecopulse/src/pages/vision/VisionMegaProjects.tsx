import { useTranslation } from 'react-i18next';
import MegaProjects from '../../components/vision/MegaProjects';

export default function VisionMegaProjects() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="card bg-surface/50 border-border">
        <h2 className="text-[18px] font-bold text-text-primary mb-3">
          {t('vision.page.mega.title')}
        </h2>
        <p className="text-[14px] text-text-muted leading-relaxed max-w-4xl">
          {t('vision.page.mega.desc')}
        </p>
      </div>

      <div className="w-full">
        <MegaProjects />
      </div>
    </div>
  );
}
