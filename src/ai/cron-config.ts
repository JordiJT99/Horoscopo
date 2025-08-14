/**
 * @fileOverview Configuración de entorno para Cron Jobs y APIs
 * 
 * Este archivo asegura que los cron jobs y APIs usen exclusivamente Gemini 2.0 Flash
 * incluso en entornos de producción como Vercel.
 */

import { config } from 'dotenv';
import { validateModel, getAllowedModel } from './model-config';

// Cargar variables de entorno explícitamente
config();

/**
 * Inicializa y valida la configuración del entorno para cron jobs
 */
export function initializeCronEnvironment(): void {
  const authorizedModel = getAllowedModel();
  
  console.log('🔧 CRON ENVIRONMENT INITIALIZATION');
  console.log('================================');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Node Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 Google API Key: ${process.env.GOOGLE_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`🤖 Modelo Autorizado: ${authorizedModel}`);
  
  // Validar que el modelo sea el correcto
  try {
    validateModel(authorizedModel);
    console.log('✅ VALIDACIÓN EXITOSA: Modelo autorizado verificado');
  } catch (error) {
    console.error('❌ ERROR DE VALIDACIÓN:', error);
    throw new Error(`Configuración de modelo inválida: ${error}`);
  }
  
  // Verificar variable de entorno crítica
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY no está configurada en el entorno');
  }
  
  console.log('🚀 Entorno de cron job inicializado correctamente');
  console.log('================================\n');
}

/**
 * Configuración específica para Vercel y otros entornos serverless
 */
export function configureServerlessEnvironment(): void {
  // Asegurar que dotenv esté cargado en serverless
  if (typeof process !== 'undefined' && process.env) {
    config({ override: false });
  }
  
  initializeCronEnvironment();
}
