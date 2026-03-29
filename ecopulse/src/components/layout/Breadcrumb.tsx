import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const routeNames: Record<string, string> = {
  '/': 'nav.dashboard',
  '/calculator': 'nav.calculator',
  '/analytics': 'nav.analytics',
  '/prediction': 'nav.prediction',
  '/simulation': 'nav.simulation',
  '/map': 'nav.map',
  '/reports': 'nav.reports',
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  if (pathname === '/') return null;

  const nameKey = routeNames[pathname] ?? pathname.slice(1);
  const label = routeNames[pathname] ? t(nameKey) : nameKey;

  return (
    <nav className="flex items-center gap-1 text-xs text-text-muted" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors no-underline">
        <Home size={12} />
        <span className="hidden sm:inline">{t('nav.dashboard')}</span>
      </Link>
      <ChevronRight size={12} className="opacity-40" />
      <span className="text-text-primary font-medium">{label}</span>
    </nav>
  );
}
