import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type ThemeSetting = 'dark' | 'light' | 'auto';
export type ResolvedTheme = 'dark' | 'light';

interface SettingsValue {
  theme: ThemeSetting;
  units: 'kg' | 'tons';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  notificationsEnabled: boolean;
}

interface SettingsCtx extends SettingsValue {
  resolvedTheme: ResolvedTheme;
  update: <K extends keyof SettingsValue>(key: K, value: SettingsValue[K]) => void;
  clearData: () => void;
}

const STORAGE_KEY = 'ecopulse-settings';

function loadSettings(): SettingsValue {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaults();
}

function defaults(): SettingsValue {
  return { theme: 'dark', units: 'kg', dateFormat: 'DD/MM/YYYY', notificationsEnabled: true };
}

function resolveTheme(setting: ThemeSetting, systemDark: boolean): ResolvedTheme {
  if (setting === 'auto') return systemDark ? 'dark' : 'light';
  return setting;
}

const SettingsContext = createContext<SettingsCtx>({
  ...defaults(),
  resolvedTheme: 'dark',
  update: () => {},
  clearData: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsValue>(loadSettings);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = resolveTheme(settings.theme, systemDark);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', resolvedTheme === 'light');
    root.classList.toggle('dark', resolvedTheme === 'dark');
    localStorage.setItem('ecopulse-theme', resolvedTheme);
  }, [resolvedTheme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = useCallback(<K extends keyof SettingsValue>(key: K, value: SettingsValue[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem('ecopulse-calc-history');
    localStorage.removeItem('ecopulse-sim-history');
    localStorage.removeItem('ecopulse-notifications');
    localStorage.removeItem('ecopulse-onboarding');
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, resolvedTheme, update, clearData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
