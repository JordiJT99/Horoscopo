/**
 * @fileOverview Configuración centralizada de modelos de IA
 * 
 * POLÍTICA ESTRICTA: Solo se permite el uso de Gemini 2.0 Flash
 * Cualquier intento de usar otro modelo debe ser rechazado explícitamente.
 */

// ÚNICO MODELO PERMITIDO EN TODA LA APLICACIÓN
export const ALLOWED_MODEL = 'googleai/gemini-2.0-flash' as const;

// Lista de modelos PROHIBIDOS (para verificaciones de seguridad)
const PROHIBITED_MODELS = [
  'googleai/gemini-1.0-pro',
  'googleai/gemini-1.5-pro',
  'googleai/gemini-2.5-pro',
  'googleai/gemini-2.5-pro-exp',
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-2.0-pro',
  'googleai/gemini-1.5-flash',
  'googleai/gemini-2.0-flash-exp',
  'googleai/gemini-pro',
  'googleai/gemini-flash',
  'openai/gpt-4',
  'openai/gpt-3.5-turbo',
  'anthropic/claude',
] as const;

/**
 * Verifica que el modelo especificado sea el único permitido
 * @param model - El identificador del modelo a verificar
 * @throws Error si el modelo no es el permitido
 */
export function validateModel(model: string): void {
  if (model !== ALLOWED_MODEL) {
    throw new Error(
      `❌ MODELO NO AUTORIZADO: "${model}". ` +
      `Solo se permite usar: "${ALLOWED_MODEL}". ` +
      `Este error es intencional para mantener consistencia.`
    );
  }
}

/**
 * Obtiene el único modelo permitido de forma segura
 * @returns El identificador del modelo autorizado
 */
export function getAllowedModel(): typeof ALLOWED_MODEL {
  return ALLOWED_MODEL;
}

/**
 * Verifica si un modelo está en la lista de prohibidos
 * @param model - El modelo a verificar
 * @returns true si el modelo está prohibido
 */
export function isProhibitedModel(model: string): boolean {
  return PROHIBITED_MODELS.includes(model as any);
}
