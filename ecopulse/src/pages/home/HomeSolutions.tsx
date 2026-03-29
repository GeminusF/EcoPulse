import { useTranslation } from 'react-i18next';
import { Building2, Globe, Factory } from 'lucide-react';

export default function HomeSolutions() {
  const { t } = useTranslation();

  return (
    <section id="solutions" className="py-32 relative bg-surface-2/30 border-y border-border overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
            {t('home.solutions.title')}
          </h2>
          <p className="text-xl text-text-muted">
            {t('home.solutions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Enterprise */}
          <div id="enterprise-compliance" className="scroll-mt-32 card group hover:border-accent/40 bg-surface/50 backdrop-blur-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
              <Building2 size={28} className="text-text-muted group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{t('home.solutions.enterprise.title')}</h3>
            <p className="text-text-muted leading-relaxed">
              {t('home.solutions.enterprise.desc')}
            </p>
          </div>

          {/* Public Sector */}
          <div id="public-sector" className="scroll-mt-32 card group hover:border-accent/40 bg-surface/50 backdrop-blur-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#3B82F6]/10 group-hover:border-[#3B82F6]/30 transition-all duration-300">
              <Globe size={28} className="text-text-muted group-hover:text-[#3B82F6] transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{t('home.solutions.public.title')}</h3>
            <p className="text-text-muted leading-relaxed">
              {t('home.solutions.public.desc')}
            </p>
          </div>

          {/* Energy Providers */}
          <div id="energy-providers" className="scroll-mt-32 card group hover:border-accent/40 bg-surface/50 backdrop-blur-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-energy/10 group-hover:border-energy/30 transition-all duration-300">
              <Factory size={28} className="text-text-muted group-hover:text-energy transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{t('home.solutions.energy.title')}</h3>
            <p className="text-text-muted leading-relaxed">
              {t('home.solutions.energy.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
