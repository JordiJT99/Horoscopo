/**
 * @fileOverview Interceptor de seguridad para bloquear modelos no autorizados
 * 
 * Este interceptor captura TODAS las llamadas HTTP a Google AI API
 * y bloquea cualquier request que use modelos no autorizados.
 */

// 🚨 LISTA DE MODELOS PROHIBIDOS
const PROHIBITED_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro', 
  'gemini-2.5-flash',
  'gemini-2.5-pro-exp',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
  'gemini-pro',
  'gemini-flash'
];

// ✅ ÚNICO MODELO PERMITIDO
const ALLOWED_MODEL = 'gemini-2.0-flash';

/**
 * Instala el interceptor de seguridad que bloquea modelos no autorizados
 */
export function installSecurityInterceptor(): void {
  if (typeof globalThis === 'undefined' || !globalThis.fetch) {
    console.warn('⚠️ Security Interceptor: globalThis.fetch no disponible');
    return;
  }

  const originalFetch = globalThis.fetch;
  
  globalThis.fetch = async function(input: any, init: any) {
    try {
      // Obtener URL de la request
      const url = typeof input === 'string' ? input : input?.url || '';
      
      // Solo interceptar llamadas a Google AI API
      if (!url.includes('generativelanguage.googleapis.com')) {
        return originalFetch.call(this, input, init);
      }
      
      // Analizar el body de la request
      const body = init?.body;
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body || {});
      
      // 🚨 BLOQUEAR MODELOS PROHIBIDOS
      for (const prohibitedModel of PROHIBITED_MODELS) {
        if (bodyStr.includes(prohibitedModel)) {
          const timestamp = new Date().toISOString();
          console.error('🚨🚨🚨 SECURITY ALERT - MODELO PROHIBIDO DETECTADO 🚨🚨🚨');
          console.error(`📅 Timestamp: ${timestamp}`);
          console.error(`🚫 Modelo prohibido: ${prohibitedModel}`);
          console.error(`📍 URL: ${url}`);
          console.error(`📦 Body: ${bodyStr.substring(0, 200)}...`);
          console.error('🚨🚨🚨 LLAMADA BLOQUEADA - TOKENS SALVADOS 🚨🚨🚨');
          
          throw new Error(`🚨 SECURITY BLOCK: Modelo prohibido detectado: ${prohibitedModel}. Solo se permite: ${ALLOWED_MODEL}`);
        }
      }
      
      // ✅ LOG LLAMADAS AUTORIZADAS
      if (bodyStr.includes(ALLOWED_MODEL)) {
        console.log(`✅ SECURITY OK: Llamada autorizada a ${ALLOWED_MODEL} - ${new Date().toISOString()}`);
      }
      
      // Ejecutar la llamada original si está autorizada
      return originalFetch.call(this, input, init);
      
    } catch (error) {
      console.error('❌ Security Interceptor Error:', error);
      throw error;
    }
  };
  
  console.log('🛡️ Security Interceptor instalado - Bloqueando modelos no autorizados');
}

/**
 * Desinstala el interceptor de seguridad (para testing)
 */
export function uninstallSecurityInterceptor(): void {
  // Esta función podría implementarse si necesitas desactivar el interceptor
  console.log('⚠️ Security Interceptor: Desinstalación no implementada');
}
