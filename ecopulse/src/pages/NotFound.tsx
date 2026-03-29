import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-[rgba(34,197,94,0.12)] flex items-center justify-center mb-6">
        <Leaf size={40} className="text-accent" />
      </div>
      <h1 className="text-6xl font-extrabold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-bold text-text-primary mb-2">{t('notfound.title', 'Page Not Found')}</h2>
      <p className="text-sm text-text-muted max-w-md mb-6">
        {t('notfound.desc', "The page you're looking for doesn't exist or has been moved. Let's get you back on track.")}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm no-underline hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} />
        {t('notfound.back', 'Back to Dashboard')}
      </Link>
    </div>
  );
}
