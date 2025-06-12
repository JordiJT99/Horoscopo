
export type Locale = 'en' | 'es' | 'de' | 'fr';
export type Dictionary = Record<string, any>; // Consider defining a more specific type based on your JSON structure

// Cache for the promises for React.use()
const dictionaryPromisesCache: Partial<Record<Locale, Promise<Dictionary>>> = {};
// Cache for the loaded dictionaries themselves (optional optimization, but good practice)
const loadedDictionariesCache: Partial<Record<Locale, Dictionary>> = {};

const loadFunctions: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => {
  const targetLocale = loadFunctions[locale] ? locale : 'es'; // Fallback to Spanish if locale is invalid

  // If dictionary is already loaded and cached, return an immediately resolved promise with it
  if (loadedDictionariesCache[targetLocale]) {
    return Promise.resolve(loadedDictionariesCache[targetLocale]!);
  }

  // If a promise for this locale already exists in cache, return it
  if (dictionaryPromisesCache[targetLocale]) {
    return dictionaryPromisesCache[targetLocale]!;
  }

  // Otherwise, create a new promise, cache it, load the dictionary, and cache the result
  const promise = loadFunctions[targetLocale]()
    .then((dict) => {
      loadedDictionariesCache[targetLocale] = dict; // Cache the loaded dictionary object
      return dict;
    })
    .catch(async (error) => {
      console.error(`Could not load dictionary for locale: ${targetLocale}. Error: ${error}`);
      // Attempt to load fallback 'es' dictionary if the requested one failed (and isn't 'es' itself)
      delete dictionaryPromisesCache[targetLocale]; // Remove failed promise from cache
      if (targetLocale !== 'es') {
        console.warn(`Falling back to 'es' dictionary for locale '${targetLocale}'.`);
        return getDictionary('es'); // Recursively call to get 'es', which will also be cached
      }
      // If 'es' also fails (should be rare if file exists), throw or return empty
      console.error('Fallback dictionary "es" also failed to load.');
      // Depending on requirements, you might throw an error or return a default empty object
      // throw new Error('Critical: Fallback dictionary "es" also failed to load.');
      return {}; // Return an empty dictionary as a last resort
    });

  dictionaryPromisesCache[targetLocale] = promise;
  return promise;
};

export const getSupportedLocales = (): Locale[] => ['en', 'es', 'de', 'fr'];
