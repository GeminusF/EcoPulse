import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Leaf, ArrowRight, ChevronDown, Sun, Moon,
  Building2, Globe, Factory, Activity, Map as MapIcon, 
  BarChart, Users, Target, Briefcase, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n, { SUPPORTED_LANGUAGES, type AppLanguage } from '../../i18n';
import { useSettings } from '../../context/SettingsContext';

const NavDropdown = ({ title, link, items }: { title: string, link?: string, items?: { label: string, desc: string, href: string, icon: React.ReactNode }[] }) => {
  if (!items) {
    return (
      <a href={link} className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors py-2">
        {title}
      </a>
    );
  }

  return (
    <div className="relative group py-2">
      <button className="flex items-center gap-1 text-sm font-semibold text-text-muted group-hover:text-text-primary transition-colors">
        {title} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-60" />
      </button>
      
      {/* Invisible bridge to keep hover active while moving mouse down */}
      <div className="absolute top-full left-0 w-full h-6"></div>

      <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[90vw] md:w-[380px] bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[9999] overflow-hidden">
        <div className="p-2 grid grid-cols-1 gap-1">
          {items.map((item, i) => (
            <a key={i} href={item.href} className="flex items-start gap-4 p-3 hover:bg-surface-2 rounded-xl transition-all duration-200 group/item relative">
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-surface border border-border text-text-muted group-hover/item:text-accent group-hover/item:border-accent/30 transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-primary group-hover/item:text-accent transition-colors flex items-center gap-2">
                  {item.label}
                </div>
                <div className="text-[13px] text-text-muted mt-1 leading-relaxed">{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HomeNavbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resolvedTheme, update } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const current = (i18n.language?.split('-')[0] ?? 'en') as AppLanguage;
  const safeLang = SUPPORTED_LANGUAGES.includes(current) ? current : 'en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Leaf className="text-accent" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent tracking-tight">
            EcoPulse
          </span>
        </div>

        {/* Center Links (Hidden on md, absolute positioning for larger navs) */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-50">
          <NavDropdown title="Solutions" items={[
            { label: 'Enterprise Compliance', desc: 'Automate CBAM footprint reporting and ESG metrics.', href: '#enterprise-compliance', icon: <Building2 size={20} /> },
            { label: 'Public Sector', desc: 'Track Vision 2030 nationwide targets across regions.', href: '#public-sector', icon: <Globe size={20} /> },
            { label: 'Energy Providers', desc: 'Monitor shifting infrastructure demands to renewables.', href: '#energy-providers', icon: <Factory size={20} /> }
          ]} />
          
          <NavDropdown title="Platform" items={[
            { label: 'Prediction Engine', desc: 'LSTM forecasting for precise carbon trajectories.', href: '#prediction-engine', icon: <Activity size={20} /> },
            { label: 'Interactive Map', desc: 'Live geopolitical monitoring of 45+ infrastructure nodes.', href: '#interactive-map', icon: <MapIcon size={20} /> },
            { label: 'Carbon Analytics', desc: 'Deep-dive charts detailing scope 1, 2, and 3 emissions.', href: '#carbon-analytics', icon: <BarChart size={20} /> }
          ]} />

          <NavDropdown title="Customers" link="#customers" />

          <NavDropdown title="About" items={[
            { label: 'Our Mission', desc: 'Accelerating Azerbaijan’s aggressive decarbonization.', href: '#mission', icon: <Target size={20} /> },
            { label: 'Vision 2030', desc: 'Fulfilling our COP29 emission reduction commitments.', href: '#vision-2030', icon: <Users size={20} /> },
            { label: 'Careers', desc: 'Join the team building the future of climate tech.', href: '#careers', icon: <Briefcase size={20} /> }
          ]} />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={() => update('theme', resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:flex p-2.5 text-text-muted hover:text-accent hover:bg-surface-2 rounded-full transition-colors order-1 lg:order-none"
            title="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language selector */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
            {SUPPORTED_LANGUAGES.map((lng) => (
              <button
                key={lng} type="button"
                onClick={() => { void i18n.changeLanguage(lng); }}
                className={`px-2 py-1 rounded text-[11px] font-bold font-sans transition-colors border-none cursor-pointer ${
                  safeLang === lng ? 'bg-accent text-[#0A0A0A]' : 'bg-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-border mx-2"></div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white 
                       bg-accent hover:bg-accent-hover transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]
                       hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-0.5 overflow-hidden w-40"
          >
            {/* The hidden element to set the exact dimensions of the button so it doesn't resize */}
            <div className="opacity-0 pointer-events-none flex items-center gap-2">
              <span>{t('home.hero.cta')}</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full">
              <span>{t('home.hero.cta')}</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] translate-y-full group-hover:translate-y-0">
              <span className="tracking-wide">Platform Access</span>
              <ArrowRight size={16} className="ml-1" />
            </div>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden p-2.5 text-text-muted hover:text-accent hover:bg-surface-2 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-background z-[9998] flex flex-col p-6 overflow-y-auto lg:hidden animate-fade-in-up">
          <div className="flex flex-col gap-6">
            <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-text-primary">
              Solutions
            </a>
            <div className="pl-4 border-l-2 border-border flex flex-col gap-4">
              <a href="#enterprise-compliance" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-accent">Enterprise Compliance</a>
              <a href="#public-sector" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-[#3B82F6]">Public Sector</a>
              <a href="#energy-providers" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-energy">Energy Providers</a>
            </div>

            <a href="#platform" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-text-primary mt-4">
              Platform
            </a>
            <div className="pl-4 border-l-2 border-border flex flex-col gap-4">
              <a href="#prediction-engine" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-accent">Prediction Engine</a>
              <a href="#interactive-map" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-[#3B82F6]">Interactive Map</a>
              <a href="#carbon-analytics" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-[#F59E0B]">Carbon Analytics</a>
            </div>

            <a href="#customers" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-text-primary mt-4">
              Customers
            </a>

            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-text-primary mt-4">
              About
            </a>
            <div className="pl-4 border-l-2 border-border flex flex-col gap-4">
              <a href="#mission" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-text-primary">Mission</a>
              <a href="#vision-2030" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-[#3B82F6]">Vision 2030</a>
              <a href="#careers" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-muted hover:text-[#F59E0B]">Careers</a>
            </div>

            {/* Mobile Actions */}
            <div className="mt-8 pt-8 border-t border-border flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-lg font-medium">Theme</span>
                <button
                  onClick={() => update('theme', resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="p-3 text-text-muted hover:text-accent bg-surface rounded-xl transition-colors"
                >
                  {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
                {SUPPORTED_LANGUAGES.map((lng) => (
                  <button
                    key={lng} type="button"
                    onClick={() => { void i18n.changeLanguage(lng); setIsMobileMenuOpen(false); }}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold font-sans transition-colors ${
                      safeLang === lng ? 'bg-accent text-[#0A0A0A]' : 'bg-transparent text-text-muted'
                    }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full mt-4 py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
