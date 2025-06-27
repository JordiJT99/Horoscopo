import type { Locale } from '@/types';

export type Dictionary = Record<string, any>;

// A simple cache for the loaded dictionaries.
const loadedDictionaries: Partial<Record<Locale, Dictionary>> = {};

const loadDictionary = async (locale: Locale): Promise<Dictionary> => {
  // We use a switch statement to ensure that we are loading the correct file.
  switch (locale) {
    case 'en':
      return import('@/locales/en.json').then((module) => module.default);
    case 'es':
      return import('@/locales/es.json').then((module) => module.default);
    case 'de':
      return import('@/locales/de.json').then((module) => module.default);
    case 'fr':
      return import('@/locales/fr.json').then((module) => module.default);
    default:
      // This should not happen if locales are managed correctly, but as a fallback:
      console.warn(`Attempted to load unsupported locale: ${locale}. Falling back to 'es'.`);
      return import('@/locales/es.json').then((module) => module.default);
  }
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const supportedLocales: Locale[] = ['en', 'es', 'de', 'fr'];
  const targetLocale = supportedLocales.includes(locale) ? locale : 'es';

  // Return from cache if available
  if (loadedDictionaries[targetLocale]) {
    return loadedDictionaries[targetLocale]!;
  }

  try {
    const dictionary = await loadDictionary(targetLocale);
    loadedDictionaries[targetLocale] = dictionary; // Cache the successfully loaded dictionary
    return dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${targetLocale}":`, error);

    // If the requested locale fails, attempt to fall back to 'es'.
    if (targetLocale !== 'es') {
      console.warn(`Falling back to 'es' dictionary.`);
      // Check cache for 'es' first
      if (loadedDictionaries['es']) {
        return loadedDictionaries['es']!;
      }
      try {
        const fallbackDict = await loadDictionary('es');
        loadedDictionaries['es'] = fallbackDict; // Cache the fallback
        // Also cache the result for the failed locale to prevent re-fetching
        loadedDictionaries[targetLocale] = fallbackDict; 
        return fallbackDict;
      } catch (fallbackError) {
        console.error(`FATAL: Fallback 'es' dictionary also failed to load:`, fallbackError);
        return {}; // Return empty object as a last resort
      }
    }
    
    // If 'es' itself was the one that failed
    return {};
  }
};

export const getSupportedLocales = (): Locale[] => ['en', 'es', 'de', 'fr'];
