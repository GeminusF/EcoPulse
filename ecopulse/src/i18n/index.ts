import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import az from './locales/az.json';
import fr from './locales/fr.json';

export const SUPPORTED_LANGUAGES = ['en', 'az', 'fr'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function mapToSupported(lng: string): AppLanguage {
  const code = lng.split(/[-_]/)[0]?.toLowerCase() ?? 'en';
  if (code === 'az') return 'az';
  if (code === 'fr') return 'fr';
  return 'en';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'languageOnly',
    resources: {
      en: { translation: en },
      az: { translation: az },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'az', 'fr'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ecopulse-lang',
      convertDetectedLanguage: (lng) => mapToSupported(lng),
    },
    react: { useSuspense: false },
  });

export default i18n;
