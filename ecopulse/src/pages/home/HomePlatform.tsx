import { useTranslation } from 'react-i18next';
import { Activity, Map as MapIcon, BarChart } from 'lucide-react';

export default function HomePlatform() {
  const { t } = useTranslation();

  return (
    <section id="platform" className="py-24 relative z-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
            {t('home.platform.title')}
          </h2>
          <p className="text-xl text-text-muted">
            {t('home.platform.subtitle')}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Prediction (Large) */}
          <div id="prediction-engine" className="scroll-mt-32 lg:col-span-2 group relative overflow-hidden rounded-3xl bg-surface border border-border p-8 md:p-12 hover:border-accent/40 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-300">
                <Activity size={28} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{t('home.platform.prediction.title')}</h3>
                <p className="text-lg text-text-muted leading-relaxed">{t('home.platform.prediction.desc')}</p>
              </div>
            </div>
            {/* Visual element placeholder for prediction */}
            <div className="absolute right-0 bottom-0 opacity-40 translate-x-1/4 translate-y-1/4 pointer-events-none group-hover:opacity-60 transition-opacity duration-500">
              <svg width="400" height="200" viewBox="0 0 400 200" fill="none" stroke="var(--color-accent)" strokeWidth="4">
                <path d="M0,150 Q50,150 100,100 T200,80 T300,40 T400,20" strokeDasharray="10 10" className="animate-pulse" />
                <path d="M0,180 Q100,160 200,120 T400,100" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Feature 2: Map (Tall) */}
          <div id="interactive-map" className="scroll-mt-32 group relative overflow-hidden rounded-3xl bg-surface border border-border p-8 hover:border-[#3B82F6]/40 transition-colors shadow-sm flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-2xl group-hover:bg-[#3B82F6]/10 transition-colors"></div>
            <div className="w-14 h-14 bg-[#3B82F6]/20 rounded-2xl flex items-center justify-center text-[#3B82F6] mb-8 group-hover:scale-110 transition-transform duration-300">
              <MapIcon size={28} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4">{t('home.platform.map.title')}</h3>
              <p className="text-base text-text-muted leading-relaxed">{t('home.platform.map.desc')}</p>
            </div>
            {/* Map Grid Dots Placeholder */}
            <div className="absolute bottom-4 right-4 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
              ))}
            </div>
          </div>

          {/* Feature 3: Analytics (Wide) */}
          <div id="carbon-analytics" className="scroll-mt-32 lg:col-span-3 group relative overflow-hidden rounded-3xl bg-surface border border-border p-8 md:p-12 hover:border-[#F59E0B]/40 transition-colors shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="absolute bottom-0 left-0 w-96 h-32 bg-[#F59E0B]/5 rounded-full blur-3xl group-hover:bg-[#F59E0B]/10 transition-colors"></div>
            
            <div className="w-full md:w-1/2 relative z-10">
              <div className="w-14 h-14 bg-[#F59E0B]/20 rounded-2xl flex items-center justify-center text-[#F59E0B] mb-8 group-hover:scale-110 transition-transform duration-300">
                <BarChart size={28} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{t('home.platform.analytics.title')}</h3>
              <p className="text-lg text-text-muted leading-relaxed">{t('home.platform.analytics.desc')}</p>
            </div>
            
            <div className="w-full md:w-1/2 flex items-center justify-center pointer-events-none relative z-10">
              {/* Abstract bar chart visual */}
              <div className="flex items-end gap-3 h-32 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {[40, 80, 50, 100, 70, 90].map((height, i) => (
                  <div key={i} className="w-10 rounded-t-lg bg-gradient-to-t from-transparent to-[#F59E0B]/40 backdrop-blur-sm border-t border-[#F59E0B]/50 transition-all duration-500" style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
