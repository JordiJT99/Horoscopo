
export type Locale = 'en' | 'es' | 'de' | 'fr';
export type Dictionary = Record<string, any>; // Consider defining a more specific type

// Cache for the promises themselves. The promise should resolve to the Dictionary.
const dictionaryPromisesCache: Partial<Record<Locale, Promise<Dictionary>>> = {};
// Cache for the loaded dictionaries to avoid re-fetching if already resolved.
const loadedDictionariesCache: Partial<Record<Locale, Dictionary>> = {};

const loadFunctions: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => {
  const targetLocale = loadFunctions[locale] ? locale : 'es';

  // If dictionary is already loaded, return an immediately resolved promise
  if (loadedDictionariesCache[targetLocale]) {
    return Promise.resolve(loadedDictionariesCache[targetLocale]!);
  }

  // If a promise for this locale is already in flight, return it
  if (dictionaryPromisesCache[targetLocale]) {
    return dictionaryPromisesCache[targetLocale]!;
  }

  // Create the promise, cache it, and then process it.
  // The cached promise is the one that handles loading and potential fallbacks.
  const newPromise = loadFunctions[targetLocale]()
    .then((dict) => {
      loadedDictionariesCache[targetLocale] = dict; // Cache the successfully loaded dictionary
      delete dictionaryPromisesCache[targetLocale]; // Clean up the promise from cache once resolved
      return dict;
    })
    .catch((error) => {
      console.error(`Failed to load dictionary for ${targetLocale}:`, error);
      // Do NOT delete dictionaryPromisesCache[targetLocale] here if we are about to return a fallback promise for IT.
      // Instead, the original promise for targetLocale will resolve to the outcome of the fallback.

      if (targetLocale !== 'es') {
        console.warn(`Attempting to fall back to 'es' dictionary for ${targetLocale}.`);
        // This recursive call gets or creates the promise for 'es'.
        // The promise for 'targetLocale' will resolve to whatever 'es' resolves to.
        return getDictionary('es'); 
      }
      
      // If 'es' itself failed or was the target.
      console.error(`Fallback 'es' dictionary also failed for ${targetLocale} or was the primary target. Returning empty dictionary.`);
      const emptyDict = {};
      loadedDictionariesCache[targetLocale] = emptyDict; // Cache empty to prevent re-fetch loops
      delete dictionaryPromisesCache[targetLocale]; // Clean up the promise from cache as it's now "resolved" (to empty)
      return emptyDict;
    });

  dictionaryPromisesCache[targetLocale] = newPromise;
  return newPromise;
};

export const getSupportedLocales = (): Locale[] => ['en', 'es', 'de', 'fr'];
