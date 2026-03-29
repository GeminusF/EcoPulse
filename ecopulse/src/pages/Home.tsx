import { useTranslation } from 'react-i18next';
import HomeNavbar from './home/HomeNavbar';
import HomeHero from './home/HomeHero';
import HomePlatform from './home/HomePlatform';
import HomeSolutions from './home/HomeSolutions';
import HomeCustomers from './home/HomeCustomers';
import HomeAbout from './home/HomeAbout';
import ScrollToTop from '../components/ui/ScrollToTop';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans overflow-x-hidden selection:bg-accent/30 text-text-primary">
      <HomeNavbar />
      
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
