import type { Locale } from '@/types';

export type Dictionary = Record<string, any>;

// A map of functions that dynamically import the dictionaries.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const supportedLocales: Locale[] = ['en', 'es', 'de', 'fr'];
  // Fallback to 'es' if the requested locale is not supported
  const targetLocale = supportedLocales.includes(locale) ? locale : 'es';

  // Get the loader function for the target locale, defaulting to Spanish
  const loadDictionary = dictionaries[targetLocale] || dictionaries.es;

  try {
    // Await the dynamic import
    return await loadDictionary();
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${targetLocale}":`, error);
    // In case of an error (e.g., file not found), return an empty object to prevent the app from crashing.
    return {};
  }
};

export const getSupportedLocales = (): Locale[] => ['en', 'es', 'de', 'fr'];