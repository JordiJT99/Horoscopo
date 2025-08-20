import type { Locale } from '@/types';

export type Dictionary = Record<string, any>;

// A map of functions that dynamically import the dictionaries.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
  pt: () => import('@/locales/pt.json').then((module) => module.default),
  it: () => import('@/locales/it.json').then((module) => module.default),
  ru: () => import('@/locales/ru.json').then((module) => module.default),
  zh: () => import('@/locales/zh-CN.json').then((module) => module.default),
  ja: () => import('@/locales/ja.json').then((module) => module.default),
  ko: () => import('@/locales/ko.json').then((module) => module.default),
  hi: () => import('@/locales/hi.json').then((module) => module.default),
  th: () => import('@/locales/th.json').then((module) => module.default),
  vi: () => import('@/locales/vi.json').then((module) => module.default),
  tr: () => import('@/locales/tr.json').then((module) => module.default),
  pl: () => import('@/locales/pl.json').then((module) => module.default),
  nl: () => import('@/locales/nl.json').then((module) => module.default),
  sv: () => import('@/locales/sv.json').then((module) => module.default),
  no: () => import('@/locales/no.json').then((module) => module.default),
  da: () => import('@/locales/da.json').then((module) => module.default),
  fi: () => import('@/locales/fi.json').then((module) => module.default),
  cs: () => import('@/locales/cs.json').then((module) => module.default),
  hu: () => import('@/locales/hu.json').then((module) => module.default),
  ro: () => import('@/locales/ro.json').then((module) => module.default),
  uk: () => import('@/locales/uk.json').then((module) => module.default),
  el: () => import('@/locales/el.json').then((module) => module.default),
  he: () => import('@/locales/he.json').then((module) => module.default),
  fa: () => import('@/locales/fa.json').then((module) => module.default),
  ur: () => import('@/locales/ur.json').then((module) => module.default),
  id: () => import('@/locales/id.json').then((module) => module.default),
  sw: () => import('@/locales/sw.json').then((module) => module.default),
  ta: () => import('@/locales/ta.json').then((module) => module.default),
  te: () => import('@/locales/te.json').then((module) => module.default),
  mr: () => import('@/locales/mr.json').then((module) => module.default),
  gu: () => import('@/locales/gu.json').then((module) => module.default),
  kn: () => import('@/locales/kn.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const supportedLocales: Locale[] = Object.keys(dictionaries) as Locale[];
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

export const getSupportedLocales = (): Locale[] => Object.keys(dictionaries) as Locale[];