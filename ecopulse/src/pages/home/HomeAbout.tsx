import { useTranslation } from 'react-i18next';
import { Target, Users, Briefcase } from 'lucide-react';

export default function HomeAbout() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 relative bg-surface-2/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            {t('home.about.title')}
          </h2>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <div id="mission" className="scroll-mt-32 w-full bg-surface border border-border p-10 md:p-14 rounded-3xl flex flex-col md:flex-row items-center gap-12 group hover:border-accent/40 transition-colors">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <Target size={36} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">{t('home.about.mission.title')}</h3>
              <p className="text-xl text-text-muted leading-relaxed max-w-3xl">
                {t('home.about.mission.desc')}
              </p>
            </div>
          </div>

          {/* Vision 2030 */}
          <div id="vision-2030" className="scroll-mt-32 w-full bg-surface border border-border p-10 md:p-14 rounded-3xl flex flex-col md:flex-row-reverse items-center gap-12 group hover:border-[#3B82F6]/40 transition-colors">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform">
              <Users size={36} />
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-3xl font-bold text-text-primary mb-4">{t('home.about.vision.title')}</h3>
              <p className="text-xl text-text-muted leading-relaxed max-w-3xl ml-auto">
                {t('home.about.vision.desc')}
              </p>
            </div>
          </div>

          {/* Careers */}
          <div id="careers" className="scroll-mt-32 w-full bg-surface border border-border p-10 md:p-14 rounded-3xl flex flex-col md:flex-row items-center gap-12 group hover:border-[#F59E0B]/40 transition-colors">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform">
              <Briefcase size={36} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">{t('home.about.careers.title')}</h3>
              <p className="text-xl text-text-muted leading-relaxed max-w-3xl">
                {t('home.about.careers.desc')}
              </p>
              <button className="mt-6 px-6 py-2 rounded-full border border-border bg-surface-2 hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]/40 text-text-primary transition-all font-medium">
                View Open Roles →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
