import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n, { SUPPORTED_LANGUAGES, type AppLanguage } from '../../i18n';
import { useNotifications } from '../../context/NotificationContext';
import { useSearch } from '../../context/SearchContext';
import { useOnboarding } from '../../context/OnboardingContext';
import NotificationPanel from './NotificationPanel';
import Breadcrumb from './Breadcrumb';
import UserMenu from './UserMenu';
import SettingsPanel from './SettingsPanel';

interface Props {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: Props) {
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();
  const { open: openSearch } = useSearch();
  const { startTour } = useOnboarding();
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const current = (i18n.language?.split('-')[0] ?? 'en') as AppLanguage;
  const safeLang = SUPPORTED_LANGUAGES.includes(current) ? current : 'en';

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center px-4 md:px-6 gap-3">
        {/* Mobile menu */}
        <button type="button" onClick={onMenuClick} className="lg:hidden p-1.5 text-text-muted hover:text-text-primary" aria-label="Open menu">
          <Menu size={22} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden md:flex" data-tour="search">
          <Breadcrumb />
        </div>

        <div className="flex-1" />

        {/* Search bar */}
        <button
          type="button"
          onClick={openSearch}
          className="hidden sm:flex items-center bg-surface border border-border rounded-full w-full max-w-md px-4 py-2.5 gap-2.5 cursor-pointer hover:border-text-muted transition-colors"
          aria-label="Search"
        >
          <Search size={16} className="text-text-muted shrink-0" />
          <span className="text-sm text-text-muted flex-1 text-left">{t('topbar.searchPlaceholder')}</span>
          <kbd className="text-[10px] text-text-muted px-1.5 py-0.5 bg-surface-2 rounded border border-border font-mono">⌘K</kbd>
        </button>

        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
          {/* Language selector */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
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

          {/* Notifications */}
          <div className="relative" data-tour="notifications">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-1 text-text-muted hover:text-text-primary transition-colors relative border-none bg-transparent cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* User menu (with theme toggle + settings) */}
          <div data-tour="theme">
            <UserMenu
              onOpenSettings={() => setSettingsOpen(true)}
              onStartTour={startTour}
            />
          </div>
        </div>
      </header>

      {/* Settings Panel (modal) */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
