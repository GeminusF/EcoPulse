import { useTranslation } from 'react-i18next';
import { ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomeHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[70%] bg-accent/20 rounded-full blur-[120px] opacity-60 dark:opacity-30"></div>
        <div className="absolute top-[20%] -right-[20%] w-[50%] h-[60%] bg-[#3B82F6]/10 rounded-full blur-[150px] opacity-60 dark:opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center z-10 space-y-8 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          {t('home.hero.badge')}
        </div>

        {/* Huge Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.1] text-text-primary animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {t('home.hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-text-muted max-w-3xl leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {t('home.hero.subtitle')}
        </p>

        {/* Primary CTA Action */}
        <div className="pt-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-white text-lg font-semibold rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] transition-shadow duration-300 overflow-hidden"
          >
            {/* Invisible structural layer to define exact dimensions */}
            <div className="opacity-0 pointer-events-none flex items-center gap-3">
              <span>{t('home.hero.cta')}</span>
              <ArrowRight size={20} />
            </div>
            
            {/* Default State */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full">
              <span>{t('home.hero.cta')}</span>
              <ArrowRight size={20} />
            </div>

            {/* Hover State */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] translate-y-full group-hover:translate-y-0">
              <Activity size={20} className="animate-pulse" />
              <span>Live Demo</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
