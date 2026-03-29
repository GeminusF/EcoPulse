import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HomeCustomers() {
  const { t } = useTranslation();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeTween = useRef<gsap.core.Tween | null>(null);

  const companies = [
    "SOCAR", "Ministry of Ecology", "BP Caspian", "SOCAR Polymer", "Azenerji", "Azerishiq", "Azergold", "Azercell"
  ];

  const items = [...companies, ...companies, ...companies, ...companies];

  useGSAP(() => {
    if (!marqueeRef.current) return;
    marqueeTween.current = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: 'none',
      duration: 40,
      repeat: -1,
    });
  }, []);

  const handleMouseEnter = () => marqueeTween.current?.pause();
  const handleMouseLeave = () => marqueeTween.current?.play();

  return (
    <section id="customers" className="py-24 relative bg-background border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center">
        <ShieldCheck size={40} className="text-text-muted opacity-30 mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-text-secondary">
          {t('home.customers.title')}
        </h2>
      </div>

      {/* GSAP Marquee (Responsive & Seamless) */}
      <div 
        className="relative w-full overflow-hidden whitespace-nowrap py-8 flex items-center group cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        
        <div ref={marqueeRef} className="flex w-max items-center">
          {items.map((name, i) => (
            <div key={i} className="text-3xl lg:text-5xl font-black flex-shrink-0 tracking-tighter text-text-muted/30 uppercase hover:text-text-primary/70 transition-colors select-none pr-16 lg:pr-24">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
