import type { Locale } from '@/types';
import { getEffectiveLocale } from './locale-utils';

export type Dictionary = Record<string, any>;

// Solo mantener idiomas principales con traducciones completas
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
  pt: () => import('@/locales/pt.json').then((module) => module.default),
  it: () => import('@/locales/it.json').then((module) => module.default),
  ru: () => import('@/locales/ru.json').then((module) => module.default),
  zh: () => import('@/locales/zh-CN.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Obtener el idioma efectivo usando fallbacks
  const effectiveLocale = getEffectiveLocale(locale);
  
  // Usar el loader para el idioma efectivo
  const loadDictionary = dictionaries[effectiveLocale] || dictionaries.es;

  try {
    return await loadDictionary();
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${effectiveLocale}":`, error);
    // Fallback final a español
    return await dictionaries.es();
  }
};

export const getSupportedLocales = (): Locale[] => Object.keys(dictionaries) as Locale[];