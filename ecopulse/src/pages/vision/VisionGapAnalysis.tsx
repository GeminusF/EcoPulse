import { useTranslation } from 'react-i18next';
import AIGapAnalysis from '../../components/vision/AIGapAnalysis';

export default function VisionGapAnalysis() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="card bg-surface/50 border-border">
        <h2 className="text-[18px] font-bold text-text-primary mb-3">
          {t('vision.page.gap.title')}
        </h2>
        <p className="text-[14px] text-text-muted leading-relaxed max-w-4xl">
          {t('vision.page.gap.desc')}
        </p>
      </div>
      
      {/* Container giving the chart massive horizontal scale */}
      <div className="w-full xl:w-5/6 xl:mx-auto">
        <AIGapAnalysis />
      </div>
    </div>
  );
}
