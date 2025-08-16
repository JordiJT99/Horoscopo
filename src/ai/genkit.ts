
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';
import { getAllowedModel, validateModel } from './model-config';
import { installSecurityInterceptor } from './security-interceptor';

// Cargar variables de entorno desde .env de forma incondicional para Genkit
config();

// 🛡️ INSTALAR INTERCEPTOR DE SEGURIDAD ANTES DE CUALQUIER LLAMADA
installSecurityInterceptor();

const googleAiPlugin = googleAI({
  apiKey: process.env.GOOGLE_API_KEY,
  // 🚨 CONFIGURACIÓN ESTRICTA: Solo permitir Gemini 2.0 Flash
  models: ['googleai/gemini-2.0-flash'], // Limitar modelos disponibles
});

if (!process.env.GOOGLE_API_KEY) {
  console.warn(
    'GOOGLE_API_KEY no está configurada. Las llamadas a Gemini fallarán. ' +
    'Asegúrate de que el archivo .env existe en la raíz del proyecto y contiene tu GOOGLE_API_KEY. ' +
    'Puedes obtener una en https://makersuite.google.com/app/apikey'
  );
}

// 🛡️ VALIDACIÓN ADICIONAL: Verificar variables de entorno restrictivas
if (process.env.GENKIT_MODEL && process.env.GENKIT_MODEL !== 'googleai/gemini-2.0-flash') {
  throw new Error(`❌ MODELO NO AUTORIZADO EN ENV: ${process.env.GENKIT_MODEL}`);
}

if (process.env.ALLOWED_AI_MODELS && !process.env.ALLOWED_AI_MODELS.includes('googleai/gemini-2.0-flash')) {
  throw new Error(`❌ CONFIGURACIÓN INVÁLIDA: ALLOWED_AI_MODELS debe incluir googleai/gemini-2.0-flash`);
}

// Verificar que solo usamos el modelo permitido
const AUTHORIZED_MODEL = getAllowedModel();
validateModel(AUTHORIZED_MODEL);

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: AUTHORIZED_MODEL, // EXCLUSIVAMENTE Gemini 2.0 Flash mediante configuración centralizada
});

// 🛡️ VALIDADOR GLOBAL: Log de todas las llamadas para detectar modelos no autorizados
console.log(`� GENKIT CONFIGURADO EXCLUSIVAMENTE PARA: ${AUTHORIZED_MODEL}`);
console.log(`🚫 MODELOS BLOQUEADOS: gemini-2.5-*, gemini-1.5-*, etc.`);
