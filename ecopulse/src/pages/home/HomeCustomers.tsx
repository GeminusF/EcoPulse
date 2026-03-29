import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

export default function HomeCustomers() {
  const { t } = useTranslation();

  const companies = [
    "SOCAR", "Ministry of Ecology", "BP Caspian", "SOCAR Polymer", "Azenerji", "Azerishiq", "Azergold", "Azercell"
  ];

  return (
    <section id="customers" className="py-24 relative bg-background border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center">
        <ShieldCheck size={40} className="text-text-muted opacity-30 mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-text-secondary">
          {t('home.customers.title')}
        </h2>
      </div>

      {/* Manual CSS Marquee */}
      <div className="relative w-full overflow-hidden whitespace-nowrap py-8 flex items-center group">
        {/* Fade Ends */}
        <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        
        {/* We use inline styles or a custom tailwind class for an infinite marquee scroll */}
        <div className="flex w-max animate-marquee space-x-16 lg:space-x-24 px-8 items-center cursor-default group-hover:[animation-play-state:paused]">
          {[...companies, ...companies, ...companies, ...companies].map((name, i) => (
            <div key={i} className="text-3xl lg:text-5xl font-black flex-shrink-0 tracking-tighter text-text-muted/30 uppercase hover:text-text-primary/70 transition-colors select-none">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
