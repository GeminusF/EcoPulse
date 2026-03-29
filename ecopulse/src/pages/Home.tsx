import { useTranslation } from 'react-i18next';
import HomeNavbar from './home/HomeNavbar';
import HomeHero from './home/HomeHero';
import HomePlatform from './home/HomePlatform';
import HomeSolutions from './home/HomeSolutions';
import HomeCustomers from './home/HomeCustomers';
import HomeAbout from './home/HomeAbout';
import ScrollToTop from '../components/ui/ScrollToTop';
// @ts-ignore - imported for manual background animation toggle
import TreeAnimation from './home/TreeAnimation'; 
// @ts-ignore - imported for manual background animation toggle
import TreeTechData from './home/TreeTechData';
// @ts-ignore - imported for manual background animation toggle
import TreeWillow from './home/TreeWillow';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans overflow-x-hidden selection:bg-accent/30 text-text-primary">
      <HomeNavbar />

      {/* 
        --- ECOPULSE BACKGROUND ANIMATION TOGGLE ---
        Uncomment ONE of the components below to preview the different tree concepts.
        The animations are fully responsive and automatically adjust to the Light/Dark theme. 
      */}
      
      {/* 1. Original Particle-based Tree */}
      <TreeAnimation />

      {/* 2. Tech/Data Tree (Option 3 - Solid Geometry) */}
      {/* <TreeTechData /> */}

      {/* 3. Ethereal Willow Tree (Option 3 - Solid Geometry) */}
      {/* <TreeWillow /> */}

      <main className="flex-1 flex flex-col relative">
        <HomeHero />
        <HomeSolutions />
        <HomePlatform />
        <HomeCustomers />
        <HomeAbout />
      </main>

      <ScrollToTop />

      {/* Simple Footer */}
      <footer className="border-t border-border mt-12 py-12 relative z-20 bg-background text-text-primary">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm font-medium">
          {t('home.footer.rights')}
        </div>
      </footer>
    </div>
  );
}
