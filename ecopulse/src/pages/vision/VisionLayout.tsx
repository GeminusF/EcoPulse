import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Sun, Shield, Activity, Target, Route as RouteIcon, Folder } from 'lucide-react';

export default function VisionLayout() {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/vision', icon: Activity, labelKey: 'vision.nav.overview', end: true },
    { to: '/vision/gap_analysis', icon: Target, labelKey: 'vision.nav.gapAnalysis' },
    { to: '/vision/roadmap', icon: RouteIcon, labelKey: 'vision.nav.roadmap' },
    { to: '/vision/mega_projects', icon: Folder, labelKey: 'vision.nav.megaProjects' },
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-[40px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-muted mb-3 leading-tight">
            {t('vision.title')}
          </h1>
          <p className="text-base md:text-lg text-text-muted mb-8 leading-relaxed max-w-2xl">
            {t('vision.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-2.5 bg-background/50 backdrop-blur-md border border-border px-4 py-3 rounded-xl shadow-sm">
              <TrendingDown className="text-accent" size={20} />
              <div className="flex flex-col">
                <span className="text-[11px] text-text-muted uppercase tracking-wider font-bold">{t('vision.hero.label.target')}</span>
                <span className="font-semibold text-text-primary text-[14px]">{t('vision.hero.target2030')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 bg-background/50 backdrop-blur-md border border-border px-4 py-3 rounded-xl shadow-sm">
              <Sun className="text-amber-500" size={20} />
              <div className="flex flex-col">
                <span className="text-[11px] text-text-muted uppercase tracking-wider font-bold">{t('vision.hero.label.energy')}</span>
                <span className="font-semibold text-text-primary text-[14px]">{t('vision.hero.renewables')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-background/50 backdrop-blur-md border border-border px-4 py-3 rounded-xl shadow-sm">
              <Shield className="text-blue-400" size={20} />
              <div className="flex flex-col">
                <span className="text-[11px] text-text-muted uppercase tracking-wider font-bold">{t('vision.hero.label.resilience')}</span>
                <span className="font-semibold text-text-primary text-[14px]">{t('vision.hero.netZero')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto scrollbar-hide shrink-0">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center shrink-0 gap-2 px-4 py-3 rounded-t-xl text-[14px] font-bold transition-colors border-b-2
               ${isActive 
                 ? 'text-accent border-accent bg-accent/5' 
                 : 'text-text-muted border-transparent hover:text-text-primary hover:bg-surface-2'
               }`
            }
          >
            <link.icon size={16} />
            {t(link.labelKey)}
          </NavLink>
        ))}
      </div>

      {/* Canvas */}
      <div className="mt-2 flex-1">
        <Outlet />
      </div>

    </div>
  );
}
