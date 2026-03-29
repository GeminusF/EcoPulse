import { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  onOpenSettings: () => void;
  onStartTour: () => void;
}

export default function UserMenu({ onOpenSettings, onStartTour }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { theme, update } = useSettings();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const themeOptions = [
    { value: 'dark' as const, label: '🌙 Dark' },
    { value: 'light' as const, label: '☀️ Light' },
    { value: 'auto' as const, label: '💻 Auto' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-accent flex items-center justify-center cursor-pointer border-none text-white font-bold text-sm hover:opacity-90 transition-opacity"
        aria-label="User menu"
      >
        EP
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[240px] bg-surface border border-border rounded-xl shadow-2xl z-50 py-1 animate-fade-in">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">EP</div>
              <div>
                <p className="text-sm font-bold text-text-primary">EcoPulse User</p>
                <p className="text-[11px] text-text-muted">Demo Account</p>
              </div>
            </div>
          </div>

          {/* Theme selector */}
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-1.5">{t('settings.theme', 'Theme')}</p>
            <div className="flex gap-1">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('theme', opt.value)}
                  className={`flex-1 text-[11px] py-1.5 rounded-md border-none cursor-pointer font-sans transition-all ${
                    theme === opt.value
                      ? 'bg-accent text-white font-semibold'
                      : 'bg-surface-2 text-text-muted hover:text-text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu items */}
          <button onClick={() => { onOpenSettings(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer font-sans text-left">
            <Settings size={14} className="text-text-muted" />
            {t('settings.title', 'Settings')}
          </button>
          <button onClick={() => { onStartTour(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer font-sans text-left">
            <HelpCircle size={14} className="text-text-muted" />
            {t('settings.tour', 'Restart Tour')}
          </button>
          <div className="border-t border-border mt-1 pt-1">
            <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-text-muted hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer font-sans text-left">
              <LogOut size={14} />
              {t('settings.logout', 'Log Out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
