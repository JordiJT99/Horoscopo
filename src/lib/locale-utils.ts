import type { Locale } from '@/types';

// Solo mantener idiomas principales con traducciones completas
const MAIN_LOCALES: Locale[] = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ru', 'zh'];

// Mapeo de idiomas secundarios a principales
const LOCALE_FALLBACKS: Record<string, Locale> = {
  // Variantes de español
  'ca': 'es', // Catalán
  'eu': 'es', // Euskera
  'gl': 'es', // Gallego
  
  // Variantes de portugués
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  
  // Variantes de inglés
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
  
  // Variantes de chino
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
  
  // Idiomas nórdicos → inglés o alemán
  'sv': 'en', // Sueco
  'no': 'en', // Noruego
  'da': 'en', // Danés
  'fi': 'en', // Finlandés
  
  // Idiomas eslavos → ruso
  'pl': 'ru', // Polaco
  'cs': 'ru', // Checo
  'sk': 'ru', // Eslovaco
  'uk': 'ru', // Ucraniano
  
  // Otros idiomas europeos
  'nl': 'de', // Holandés → Alemán
  'hu': 'de', // Húngaro → Alemán
  'ro': 'it', // Rumano → Italiano
  'el': 'en', // Griego → Inglés
  
  // Idiomas asiáticos
  'ja': 'en', // Japonés → Inglés
  'ko': 'en', // Coreano → Inglés
  'hi': 'en', // Hindi → Inglés
  'th': 'en', // Tailandés → Inglés
  'vi': 'en', // Vietnamita → Inglés
  'id': 'en', // Indonesio → Inglés
  
  // Idiomas del Medio Oriente
  'ar': 'en', // Árabe → Inglés
  'he': 'en', // Hebreo → Inglés
  'fa': 'en', // Persa → Inglés
  'tr': 'en', // Turco → Inglés
  'ur': 'en', // Urdu → Inglés
  
  // Idiomas africanos
  'sw': 'en', // Swahili → Inglés
  
  // Idiomas de la India
  'ta': 'en', // Tamil → Inglés
  'te': 'en', // Telugu → Inglés
  'mr': 'en', // Marathi → Inglés
  'gu': 'en', // Gujarati → Inglés
  'kn': 'en', // Kannada → Inglés
};

/**
 * Obtiene el idioma efectivo para usar, aplicando fallbacks si es necesario
 */
export function getEffectiveLocale(requestedLocale: string): Locale {
  // Si es un idioma principal, usarlo directamente
  if (MAIN_LOCALES.includes(requestedLocale as Locale)) {
    return requestedLocale as Locale;
  }
  
  // Si hay un fallback definido, usarlo
  if (LOCALE_FALLBACKS[requestedLocale]) {
    return LOCALE_FALLBACKS[requestedLocale];
  }
  
  // Intentar match parcial (ej: 'en-US' → 'en')
  const baseLocale = requestedLocale.split('-')[0];
  if (MAIN_LOCALES.includes(baseLocale as Locale)) {
    return baseLocale as Locale;
  }
  
  // Fallback final a español
  return 'es';
}

/**
 * Detecta el idioma preferido del navegador
 */
export function detectBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  // Obtener idiomas preferidos del navegador
  const languages = window.navigator.languages || [window.navigator.language];
  
  for (const lang of languages) {
    const effectiveLocale = getEffectiveLocale(lang);
    if (effectiveLocale) return effectiveLocale;
  }
  
  return 'es'; // Fallback por defecto
}

export { MAIN_LOCALES, LOCALE_FALLBACKS };
