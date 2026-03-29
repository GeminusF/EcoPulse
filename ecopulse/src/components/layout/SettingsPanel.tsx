import { X, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

interface Props { open: boolean; onClose: () => void; }

export default function SettingsPanel({ open, onClose }: Props) {
  const { t } = useTranslation();
  const settings = useSettings();
  const toast = useToast();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]" onClick={onClose}>
      <div className="w-[440px] max-w-[90vw] max-h-[80vh] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">⚙️ {t('settings.title', 'Settings')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-2 transition-colors border-none bg-transparent cursor-pointer">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Units */}
          <div>
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 block">
              {t('settings.units', 'Emission Units')}
            </label>
            <div className="flex gap-2">
              {(['kg', 'tons'] as const).map((u) => (
                <button key={u} onClick={() => settings.update('units', u)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border cursor-pointer font-sans transition-all ${
                    settings.units === u ? 'border-accent bg-accent text-white' : 'border-border bg-surface-2 text-text-muted hover:text-text-primary'
                  }`}
                >
                  {u === 'kg' ? 'kg CO₂' : 'Metric Tons'}
                </button>
              ))}
            </div>
          </div>

          {/* Date Format */}
          <div>
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 block">
              {t('settings.dateFormat', 'Date Format')}
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => settings.update('dateFormat', e.target.value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD')}
              className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-text-primary cursor-pointer font-sans outline-none"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Notifications toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{t('settings.notifications', 'Notifications')}</p>
              <p className="text-xs text-text-muted">Enable system notifications</p>
            </div>
            <button
              onClick={() => settings.update('notificationsEnabled', !settings.notificationsEnabled)}
              className={`w-11 h-6 rounded-full cursor-pointer border-none transition-colors relative ${
                settings.notificationsEnabled ? 'bg-accent' : 'bg-surface-2'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Clear data */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => {
                settings.clearData();
                toast.success('All saved data has been cleared');
              }}
              className="flex items-center gap-2 text-sm text-[#EF4444] hover:opacity-80 transition-opacity border-none bg-transparent cursor-pointer font-sans"
            >
              <Trash2 size={14} />
              {t('settings.clearData', 'Clear all saved data')}
            </button>
            <p className="text-[10px] text-text-muted mt-1">Removes saved calculations, simulation history, and onboarding state.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
