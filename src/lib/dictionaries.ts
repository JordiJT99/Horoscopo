import 'server-only';

export type Locale = 'en' | 'es' | 'de' | 'fr';
export type Dictionary = Record<string, any>; // Consider defining a more specific type based on your JSON structure

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] || dictionaries.es; // Fallback to Spanish
  try {
    return await loadDictionary();
  } catch (error) {
    console.error(`Could not load dictionary for locale: ${locale}`, error);
    return await dictionaries.es(); // Fallback to Spanish on error
  }
};

export const getSupportedLocales = (): Locale[] => ['en', 'es', 'de', 'fr'];
