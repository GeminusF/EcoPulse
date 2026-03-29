import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Target, Route as RouteIcon, Folder, ArrowRight } from 'lucide-react';

export default function VisionOverview() {
  const { t } = useTranslation();

  const cards = [
    { to: 'gap_analysis', icon: Target, title: 'vision.gap.title', desc: 'vision.overview.hub.gapDesc', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { to: 'roadmap', icon: RouteIcon, title: 'vision.timeline.title', desc: 'vision.overview.hub.mapDesc', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { to: 'mega_projects', icon: Folder, title: 'vision.mega.title', desc: 'vision.overview.hub.megaDesc', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Strategy Content Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-3 leading-tight">{t('vision.overview.strategy')}</h2>
          <p className="text-[14px] text-text-muted leading-relaxed mb-4">{t('vision.overview.strategyDesc1')}</p>
          <p className="text-[14px] text-text-muted leading-relaxed">{t('vision.overview.strategyDesc2')}</p>
        </div>

        <div className="card bg-accent/5 border-accent/20">
          <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2 leading-tight">
             <span className="text-accent">EcoPulse</span> {t('vision.overview.contribution')}
          </h2>
          <p className="text-[14px] text-[#A1A1D6] leading-relaxed mb-4">{t('vision.overview.contributionDesc1')}</p>
          <p className="text-[14px] text-[#A1A1D6] leading-relaxed">{t('vision.overview.contributionDesc2')}</p>
        </div>
      </div>
      
      {/* Hub Navigation Gallery */}
      <div>
        <h3 className="text-base font-bold text-text-primary mb-4 uppercase tracking-widest">{t('vision.overview.hubTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(c => (
             <Link key={c.to} to={c.to} className="card group hover:border-accent/40 bg-surface-2 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)] flex flex-col justify-between h-full cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${c.bg}`}>
                    <c.icon size={24} className={c.color} />
                  </div>
                  <h4 className="text-[16px] font-bold text-text-primary mb-2 transition-colors group-hover:text-accent">{t(c.title)}</h4>
                  <p className="text-[13px] text-text-muted leading-relaxed">{t(c.desc)}</p>
                </div>

                <div className="relative z-10 mt-8 flex items-center text-[13px] font-bold text-text-secondary group-hover:text-accent transition-colors">
                  {t('vision.overview.explore')} 
                  <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
