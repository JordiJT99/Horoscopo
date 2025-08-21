// Sistema híbrido con traducción automática
import type { Locale } from '@/types';

// Idiomas con archivos JSON completos (traducciones perfectas)
const FULL_LOCALES = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ru', 'zh'];

// Idiomas importantes que merecen archivo propio pero simplificado
const IMPORTANT_LOCALES = ['ca', 'sv', 'pl', 'ja', 'ar', 'hi'];

// Fallbacks para idiomas menores
const LOCALE_FALLBACKS = {
  // Nórdicos
  'no': 'sv', // Noruego → Sueco
  'da': 'sv', // Danés → Sueco
  'fi': 'sv', // Finlandés → Sueco
  
  // Eslavos
  'cs': 'pl', // Checo → Polaco
  'sk': 'pl', // Eslovaco → Polaco
  'uk': 'pl', // Ucraniano → Polaco
  
  // Otros
  'nl': 'de', // Holandés → Alemán
  'hu': 'de', // Húngaro → Alemán
  'ro': 'it', // Rumano → Italiano
  'el': 'en', // Griego → Inglés
  // ... etc
};

export async function getDictionary(requestedLocale: Locale): Promise<Dictionary> {
  // 1. Si tiene archivo completo, usarlo
  if (FULL_LOCALES.includes(requestedLocale)) {
    return await loadFullDictionary(requestedLocale);
  }
  
  // 2. Si es idioma importante, usar archivo simplificado + traducción auto
  if (IMPORTANT_LOCALES.includes(requestedLocale)) {
    return await loadImportantLocaleDictionary(requestedLocale);
  }
  
  // 3. Si hay fallback, usar el idioma similar
  const fallback = LOCALE_FALLBACKS[requestedLocale];
  if (fallback) {
    return await getDictionary(fallback);
  }
  
  // 4. Traducción automática desde inglés
  return await translateDictionary('en', requestedLocale);
}

async function translateDictionary(fromLocale: string, toLocale: string): Promise<Dictionary> {
  // Cargar diccionario base
  const baseDictionary = await loadFullDictionary(fromLocale);
  
  // Verificar cache
  const cacheKey = `dict_${toLocale}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Traducir con Google Translate API
  const translated = await translateTexts(baseDictionary, toLocale);
  
  // Guardar en cache
  localStorage.setItem(cacheKey, JSON.stringify(translated));
  
  return translated;
}
