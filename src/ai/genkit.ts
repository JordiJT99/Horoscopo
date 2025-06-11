
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

// Cargar variables de entorno desde .env si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
  config();
}

const googleAiPlugin = googleAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

if (!process.env.GOOGLE_API_KEY) {
  console.warn(
    'GOOGLE_API_KEY no está configurada. Las llamadas a Gemini fallarán. ' +
    'Asegúrate de crear un archivo .env con tu GOOGLE_API_KEY. ' +
    'Puedes obtener una en https://makersuite.google.com/app/apikey'
  );
}

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-2.0-flash',
});
