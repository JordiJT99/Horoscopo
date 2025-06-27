
'use server';
/**
 * @fileOverview A Genkit flow to generate horoscopes with caching and mock fallbacks.
 *
 * - getHoroscopeFlow - A function that calls the horoscope generation flow.
 *   It now uses caching for daily, weekly, and monthly horoscopes, and fallbacks to mocks on API error.
 *   It can also target a specific date for daily horoscopes.
 *   It can also personalize horoscopes if onboardingData is provided.
 * - HoroscopeFlowInput - The input type for the getHoroscopeFlow function.
 * - HoroscopeFlowOutput - The return type for the getHoroscopeFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName, HoroscopeFlowInput as PublicHoroscopeFlowInput, HoroscopePersonalizationData } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import { format, getISOWeekYear, getMonth, getYear, subDays } from 'date-fns';
import { getRandomMockHoroscope } from '@/lib/mock-horoscopes';

// Helper to create a Zod enum from the ZodiacSignName type values
const zodSignEnum = z.enum(ALL_SIGN_NAMES as [string, ...string[]]);

// Define Zod schema for HoroscopeDetail
const HoroscopeDetailSchema = z.object({
  main: z.string().describe('The main horoscope text for the period.'),
  love: z.string().describe('The love horoscope text for the period.'),
  money: z.string().describe('The money/career horoscope text for the period.'),
  health: z.string().describe('The health horoscope text for the period.'),
});
export type HoroscopeDetail = z.infer<typeof HoroscopeDetailSchema>;

// Define Zod schema for HoroscopeFlowOutput
const HoroscopeFlowOutputSchema = z.object({
  daily: HoroscopeDetailSchema,
  weekly: HoroscopeDetailSchema,
  monthly: HoroscopeDetailSchema,
});
export type HoroscopeFlowOutput = z.infer<typeof HoroscopeFlowOutputSchema>;

// Define Zod schema for HoroscopePersonalizationData
const HoroscopePersonalizationDataSchema = z.object({
  name: z.string().optional().describe('The name of the user.'),
  gender: z.string().optional().describe('The gender of the user.'),
  relationshipStatus: z.string().optional().describe('The relationship status of the user.'),
  employmentStatus: z.string().optional().describe('The employment status of the user.'),
}).optional();


// Input schema for the flow itself (internal, matches public but with Zod enum)
const HoroscopeFlowInputSchemaInternal = z.object({
  sign: zodSignEnum.describe('The zodiac sign for which to generate the horoscope.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the horoscope language.'),
  targetDate: z.string().optional().describe('Target date for the daily horoscope in YYYY-MM-DD format. If not provided, defaults to today. For weekly/monthly, this is ignored and current period is used.'),
  onboardingData: HoroscopePersonalizationDataSchema,
});
type HoroscopeFlowInputInternal = z.infer<typeof HoroscopeFlowInputSchemaInternal>;


// New PromptInputSchema that includes specific fields for personalization
const PromptInputSchema = z.object({
  sign: zodSignEnum,
  locale: z.string(),
  dateDescriptor: z.string().optional(), // Optional for weekly/monthly
  isPersonalized: z.boolean(),
  userName: z.string().optional(),
  userGender: z.string().optional(),
  userRelationshipStatus: z.string().optional(),
  userEmploymentStatus: z.string().optional(),
  astrologicalTheme: z.string().optional().describe('El tema astrológico central del día para guiar la predicción.'),
});
type PromptInput = z.infer<typeof PromptInputSchema>;


// In-memory caches - Now storing HoroscopeDetail objects
const dailyCache = new Map<string, HoroscopeDetail>();
const weeklyCache = new Map<string, HoroscopeDetail>();
const monthlyCache = new Map<string, HoroscopeDetail>();

// Helper to format date for daily cache key (YYYY-MM-DD)
const formatDateForDailyCache = (date: Date): string => format(date, 'yyyy-MM-dd');

// Helper to format date for weekly cache key (YYYY-WW, ISO week)
const formatDateForWeeklyCache = (date: Date): string => `${getISOWeekYear(date)}-W${format(date, 'II')}`;

// Helper to format date for monthly cache key (YYYY-MM)
const formatDateForMonthlyCache = (date: Date): string => format(date, 'yyyy-MM');


// Themes for daily horoscopes to ensure variety
const dailyThemes = [
  "un impulso de energía creativa y autoexpresión",
  "un desafío inesperado en la comunicación que requiere paciencia",
  "una oportunidad para la introspección profunda y el descanso necesario",
  "un encuentro social sorprendente que podría traer nuevas oportunidades",
  "un enfoque renovado en las finanzas y la seguridad material",
  "una necesidad de establecer límites claros en las relaciones personales",
  "un momento de claridad sobre una vieja duda o un problema persistente",
  "un día ideal para la aventura, la espontaneidad y salir de la rutina",
  "una conexión emocional profunda y significativa con alguien cercano",
  "un obstáculo profesional que requiere una estrategia cuidadosa en lugar de acción impulsiva",
  "una revelación sobre la salud y la importancia del bienestar físico y mental",
  "una invitación a aprender algo nuevo o a explorar un interés intelectual",
  "un día de armonía en el hogar y en las relaciones familiares",
  "un conflicto entre la responsabilidad y el deseo de libertad",
  "la llegada de noticias inesperadas que podrían cambiar tus planes",
];

// Function to get a deterministic theme based on date and sign
function getDeterministicTheme(dateStr: string, sign: string, themes: string[]): string {
  let hash = 0;
  const seed = `${dateStr}-${sign}`;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
}


// Daily Horoscope Prompt
const dailyHoroscopePrompt = ai.definePrompt({
  name: 'dailyHoroscopePrompt',
  input: { schema: PromptInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que revela cómo las energías cósmicas del día influirán en la vida del usuario.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo DIARIO PERSONALIZADO para {{userName}} (signo {{sign}}) para {{dateDescriptor}} en el idioma {{locale}}.
**INSTRUCCIÓN CLAVE:** El tema astrológico central para este día es **"{{astrologicalTheme}}"**. Basa TODA tu predicción (principal, amor, dinero y salud) en cómo esta energía específica influye en {{userName}} ({{sign}}).
**Saluda a {{userName}} al principio de la predicción principal de forma natural y amigable.** Tu tono debe ser místico y directo, como si revelaras un secreto del cosmos. Usa frases como "Hola {{userName}}, hoy el universo te depara...", "Para ti, {{userName}}, las estrellas sugieren...", "La energía cósmica de hoy te invita a...".
{{#if userRelationshipStatus}}
Considera sutilmente su estado sentimental ({{userRelationshipStatus}}) al redactar la sección de amor.
{{/if}}
{{#if userEmploymentStatus}}
Considera sutilmente su situación laboral ({{userEmploymentStatus}}) al redactar la sección de dinero/trabajo.
{{/if}}

Para la sección 'main', profundiza en cómo las energías diarias actuales, guiadas por "{{astrologicalTheme}}", podrían influir en {{userName}} ({{sign}}).
Para 'love', ofrece consejos reflexivos para las conexiones de {{userName}}, siempre en relación con "{{astrologicalTheme}}".
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales para {{userName}}, en el contexto de "{{astrologicalTheme}}".
Para 'health', sugiere cómo {{userName}} puede mantener el bienestar, considerando el tema de "{{astrologicalTheme}}".
{{else}}
Genera ÚNICAMENTE el horóscopo DIARIO GENERAL para el signo zodiacal {{sign}} para {{dateDescriptor}} en el idioma {{locale}}.
**INSTRUCCIÓN CLAVE:** El tema astrológico central para este día es **"{{astrologicalTheme}}"**. Basa TODA tu predicción (principal, amor, dinero y salud) en cómo esta energía específica influye en el signo {{sign}}.
Tu tono debe ser místico y predictivo, usando frases como "el cosmos depara", "las estrellas sugieren", "la energía de hoy invita a".

Para la sección 'main', profundiza en cómo las energías diarias actuales, guiadas por "{{astrologicalTheme}}", podrían influir en el signo {{sign}}.
Para 'love', ofrece consejos reflexivos para las conexiones para el signo {{sign}}, siempre en relación con "{{astrologicalTheme}}".
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales para el signo {{sign}}, en el contexto de "{{astrologicalTheme}}".
Para 'health', sugiere cómo el signo {{sign}} puede mantener el bienestar, considerando el tema de "{{astrologicalTheme}}".
{{/if}}

IMPORTANTE: No incluyas la descripción de la fecha (como "{{dateDescriptor}}", "hoy", "ayer" o la fecha específica) directamente en el texto de las secciones "main", "love", "money" o "health".
CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main", "love", "money", "health". NO añadas ninguna otra clave. NO uses markdown.
Ejemplo de estructura de salida para {{userName}}="Alex" y tema="un encuentro social sorprendente" (CASO PERSONALIZADO):
{
  "main": "Hola Alex, para tu signo Aries, el cosmos hoy te depara un encuentro social sorprendente. Una conexión inesperada, ya sea con alguien nuevo o del pasado, tiene el potencial de ofrecerte una perspectiva que no habías considerado. Mantente abierto a las conversaciones espontáneas; las estrellas indican que la sincronicidad está de tu lado.",
  "love": "En el amor, esta energía social te beneficia enormemente. Si estás en pareja, una salida con amigos puede reavivar la chispa. Si estás soltero, Alex, tu carisma estará en su punto más alto en cualquier evento social. No dudes en iniciar una conversación.",
  "money": "El networking es tu mejor activo hoy, Alex. Una conversación casual en un entorno relajado podría llevar a una colaboración inesperada o a una valiosa oportunidad profesional. Escucha atentamente.",
  "health": "Tu bienestar se nutre de la interacción social positiva. Considera una actividad física en grupo, como un deporte de equipo o una clase de baile con amigos. La energía colectiva no solo te motivará, sino que también aliviará el estrés acumulado."
}
Ahora genera el horóscopo diario para {{sign}} en {{locale}} para {{dateDescriptor}} y el tema "{{astrologicalTheme}}", reflejando este estilo perspicaz, empático y detallado.
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: PromptInputSchema }, // Using the new PromptInputSchema
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que revela cómo las energías cósmicas de la semana influirán en la vida del usuario.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo SEMANAL PERSONALIZADO para ESTA SEMANA para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
**Saluda a {{userName}} al principio de la predicción principal de forma natural y amigable.** Tu tono debe ser místico y predictivo, usando frases como "Hola {{userName}}, esta semana el universo te depara...", "Para ti, {{userName}}, las estrellas sugieren...", "La energía cósmica de esta semana te invita a...".
{{else}}
Genera ÚNICAMENTE el horóscopo SEMANAL GENERAL para ESTA SEMANA para el signo zodiacal {{sign}} en el idioma {{locale}}.
Tu tono debe ser místico y predictivo, usando frases como "esta semana el cosmos depara", "las estrellas sugieren", "la energía de la semana invita a".
{{/if}}

Para la sección 'main', proporciona una visión general completa para LA SEMANA ACTUAL. Comienza con un tema general para la semana, posiblemente mencionando cómo un tránsito planetario clave podría influir.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODA LA SEMANA.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main", "love", "money", "health". NO añadas ninguna otra clave. NO uses markdown.
Ejemplo de estructura de salida para {{userName}}="Alex" (CASO PERSONALIZADO):
{
  "main": "Hola Alex, esta semana para tu signo Virgo, el universo te depara una mayor claridad en tus comunicaciones. Con el ingreso de Mercurio en un sector de reflexión profunda, es un momento ideal para expresar tus verdades y organizar tus pensamientos. Las conversaciones que tengas a mitad de semana podrían ser particularmente reveladoras.",
  "love": "En el amor, la influencia de Mercurio te anima a tener esas conversaciones pendientes. Para los Virgo en pareja, es una oportunidad para fortalecer la conexión. Si estás soltero, Alex, tu elocuencia podría atraer a alguien con quien compartes una profunda conexión intelectual.",
  "money": "Profesional y financieramente, tu precisión se ve potenciada esta semana. Es un excelente momento para revisar contratos, planificar presupuestos o presentar proyectos detallados. Tu atención al detalle será tu mayor activo.",
  "health": "Tu bienestar se beneficia de rutinas que fomenten tanto la claridad mental como la física. Considera empezar un diario o practicar ejercicios de respiración para calmar la mente y organizar tus ideas."
}
Ahora genera el horóscopo SEMANAL DETALLADO para {{sign}} en {{locale}} para esta semana, reflejando este estilo perspicaz y personalizándolo si isPersonalized es true:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: PromptInputSchema }, // Using the new PromptInputSchema
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que revela cómo las energías cósmicas del mes influirán en la vida del usuario.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo MENSUAL PERSONALIZADO para ESTE MES para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
**Saluda a {{userName}} al principio de la predicción principal de forma natural y amigable.** Tu tono debe ser místico y predictivo, usando frases como "Hola {{userName}}, este mes el universo te depara...", "Para ti, {{userName}}, las estrellas sugieren...", "La energía cósmica de este mes te invita a...".
{{else}}
Genera ÚNICAMENTE el horóscopo MENSUAL GENERAL para ESTE MES para el signo zodiacal {{sign}} en el idioma {{locale}}.
Tu tono debe ser místico y predictivo, usando frases como "este mes el cosmos depara", "las estrellas sugieren", "la energía del mes invita a".
{{/if}}
Evita marcadores de posición como "[Insertar mes actual]"; el horóscopo es para el mes actual, así que refiérete a él como "este mes" si es necesario.

Para la sección 'main', proporciona una visión general completa para EL MES ACTUAL. Comienza estableciendo los temas generales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODO EL MES.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main", "love", "money", "health". NO añadas ninguna otra clave. NO uses markdown.
Ejemplo de estructura de salida para {{userName}}="Alex" (CASO PERSONALIZADO):
{
  "main": "Hola Alex, para tu signo Capricornio, este mes se perfila como un período de profunda consolidación profesional. El Sol iluminando tu casa de la carrera te invita a tomar el liderazgo y a cosechar los frutos de tu arduo trabajo. Es un momento para la ambición y la estrategia a largo plazo.",
  "love": "En el terreno sentimental, Alex, este mes te pide un equilibrio entre tu vida profesional y personal. Si estás en pareja, asegúrate de dedicar tiempo de calidad. Para los solteros, es más probable que la atracción surja en entornos profesionales o a través de contactos de trabajo.",
  "money": "Financieramente, este mes es para la estrategia y la inversión en tu futuro. Podrías recibir un reconocimiento o un ascenso que venga con una mejora económica. Es un buen momento para planificar tus finanzas con una visión a largo plazo.",
  "health": "Tu bienestar este mes se beneficia enormemente de rutinas que te ayuden a gestionar el estrés laboral. No descuides el descanso. Prácticas como el yoga o simplemente desconectar en la naturaleza serán cruciales para mantener tu energía."
}
Ahora genera el horóscopo MENSUAL DETALLADO para {{sign}} en {{locale}} para este mes, reflejando este estilo perspicaz y personalizándolo si isPersonalized es true:
`,
});

const fallbackHoroscopeDetail: HoroscopeDetail = {
  main: "Información principal del horóscopo no disponible en este momento. Por favor, intente más tarde.",
  love: "Perspectivas de amor no disponibles. Mantenga una actitud abierta.",
  money: "Información financiera no disponible. Sea prudente con sus decisiones.",
  health: "Consejos de salud no disponibles. Cuide su bienestar general.",
};


async function getDailyHoroscopeDetails(input: HoroscopeFlowInputInternal, targetDateObj: Date): Promise<HoroscopeDetail> {
  const dateStr = formatDateForDailyCache(targetDateObj);
  const isPersonalizedRequest = !!input.onboardingData?.name;
  let cacheKey = `daily-${input.sign}-${input.locale}-${dateStr}`;
  if (isPersonalizedRequest) {
    cacheKey += `-user-${input.onboardingData!.name!.replace(/\s+/g, '_')}`;
  }


  if (dailyCache.has(cacheKey)) {
    const cachedValue = dailyCache.get(cacheKey)!;
    const parsed = HoroscopeDetailSchema.safeParse(cachedValue);
    if (parsed.success) return parsed.data;
    console.warn(`Invalid daily horoscope data in cache for ${cacheKey}. Fetching anew.`);
    dailyCache.delete(cacheKey);
  }

  let dateDescriptor = `para la fecha ${dateStr}`;
  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = subDays(today, 1);

  const targetDateNormalized = new Date(targetDateObj);
  targetDateNormalized.setHours(0,0,0,0);


  if (targetDateNormalized.getTime() === today.getTime()) {
    dateDescriptor = "HOY";
  } else if (targetDateNormalized.getTime() === yesterday.getTime()) {
    dateDescriptor = "AYER";
  }
  
  const theme = getDeterministicTheme(dateStr, input.sign, dailyThemes);

  const promptPayload: PromptInput = {
      sign: input.sign,
      locale: input.locale,
      dateDescriptor: dateDescriptor,
      isPersonalized: isPersonalizedRequest,
      userName: input.onboardingData?.name,
      userGender: input.onboardingData?.gender,
      userRelationshipStatus: input.onboardingData?.relationshipStatus,
      userEmploymentStatus: input.onboardingData?.employmentStatus,
      astrologicalTheme: theme,
  };

  try {
    const {output} = await dailyHoroscopePrompt(promptPayload);
    if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            dailyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
             console.warn(`AI response for daily horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Date: ${dateStr}, User: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for daily horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Date: ${dateStr}, User: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('daily');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
    if(parsedMock.success) {
        dailyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Daily mock data for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        dailyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getDailyHoroscopeDetails for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, Date: ${dateStr}, User: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('daily');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for daily horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Date: ${dateStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching daily horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Date: ${dateStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        dailyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Daily mock data (catch) for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
        dailyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }
  }
}

async function getWeeklyHoroscopeDetails(input: HoroscopeFlowInputInternal, currentDate: Date): Promise<HoroscopeDetail> {
  const weekStr = formatDateForWeeklyCache(currentDate);
  const isPersonalizedRequest = !!input.onboardingData?.name;
  let cacheKey = `weekly-${input.sign}-${input.locale}-${weekStr}`;
  if (isPersonalizedRequest) {
    cacheKey += `-user-${input.onboardingData!.name!.replace(/\s+/g, '_')}`;
  }

  if (weeklyCache.has(cacheKey)) {
    const cachedValue = weeklyCache.get(cacheKey)!;
    const parsed = HoroscopeDetailSchema.safeParse(cachedValue);
    if (parsed.success) return parsed.data;
    console.warn(`Invalid weekly horoscope data in cache for ${cacheKey}. Fetching anew.`);
    weeklyCache.delete(cacheKey);
  }

  const promptPayload: PromptInput = {
      sign: input.sign,
      locale: input.locale,
      isPersonalized: isPersonalizedRequest,
      userName: input.onboardingData?.name,
      userGender: input.onboardingData?.gender,
      userRelationshipStatus: input.onboardingData?.relationshipStatus,
      userEmploymentStatus: input.onboardingData?.employmentStatus,
  };

  try {
    const {output} = await weeklyHoroscopePrompt(promptPayload);
     if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            weeklyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
            console.warn(`AI response for weekly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for weekly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('weekly');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
    if(parsedMock.success) {
        weeklyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Weekly mock data for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        weeklyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getWeeklyHoroscopeDetails for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('weekly');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

     if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for weekly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Week: ${weekStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching weekly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Week: ${weekStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        weeklyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Weekly mock data (catch) for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
        weeklyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }
  }
}

async function getMonthlyHoroscopeDetails(input: HoroscopeFlowInputInternal, currentDate: Date): Promise<HoroscopeDetail> {
  const monthStr = formatDateForMonthlyCache(currentDate);
  const isPersonalizedRequest = !!input.onboardingData?.name;
  let cacheKey = `monthly-${input.sign}-${input.locale}-${monthStr}`;
  if (isPersonalizedRequest) {
    cacheKey += `-user-${input.onboardingData!.name!.replace(/\s+/g, '_')}`;
  }

  if (monthlyCache.has(cacheKey)) {
    const cachedValue = monthlyCache.get(cacheKey)!;
    const parsed = HoroscopeDetailSchema.safeParse(cachedValue);
    if (parsed.success) return parsed.data;
    console.warn(`Invalid monthly horoscope data in cache for ${cacheKey}. Fetching anew.`);
    monthlyCache.delete(cacheKey);
  }

  const promptPayload: PromptInput = {
      sign: input.sign,
      locale: input.locale,
      isPersonalized: isPersonalizedRequest,
      userName: input.onboardingData?.name,
      userGender: input.onboardingData?.gender,
      userRelationshipStatus: input.onboardingData?.relationshipStatus,
      userEmploymentStatus: input.onboardingData?.employmentStatus,
  };

  try {
    const {output} = await monthlyHoroscopePrompt(promptPayload);
    if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            monthlyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
            console.warn(`AI response for monthly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for monthly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('monthly');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
     if(parsedMock.success) {
        monthlyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Monthly mock data for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        monthlyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getMonthlyHoroscopeDetails for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('monthly');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for monthly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Month: ${monthStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching monthly horoscope (Personalized: ${isPersonalizedRequest}, Sign: ${input.sign}, Locale: ${input.locale}, Month: ${monthStr}, User: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        monthlyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Monthly mock data (catch) for ${input.sign} (Personalized: ${isPersonalizedRequest}, Locale: ${input.locale}, User: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
        monthlyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }
  }
}

const horoscopeFlowInternal = ai.defineFlow(
  {
    name: 'horoscopeFlowInternal',
    inputSchema: HoroscopeFlowInputSchemaInternal,
    outputSchema: HoroscopeFlowOutputSchema,
  },
  async (input): Promise<HoroscopeFlowOutput> => {
    const currentDate = new Date();
    let dailyTargetDate = currentDate;

    if (input.targetDate) {
        const [year, month, day] = input.targetDate.split('-').map(Number);
        // Use UTC to avoid timezone issues with date parsing if targetDate is YYYY-MM-DD
        const parsedDate = new Date(Date.UTC(year, month - 1, day)); 
        if (!isNaN(parsedDate.getTime())) {
            dailyTargetDate = parsedDate;
        } else {
            console.warn(`Invalid targetDate format: ${input.targetDate}. Defaulting to current date for daily horoscope.`);
        }
    }
    
    // Pass the full input (which includes optional onboardingData) to detail fetchers
    const [dailyDetails, weeklyDetails, monthlyDetails] = await Promise.all([
        getDailyHoroscopeDetails(input, dailyTargetDate),
        getWeeklyHoroscopeDetails(input, currentDate), // input now contains onboardingData if available
        getMonthlyHoroscopeDetails(input, currentDate), // input now contains onboardingData if available
    ]);

    const finalDaily = dailyDetails && typeof dailyDetails === 'object' ? dailyDetails : fallbackHoroscopeDetail;
    const finalWeekly = weeklyDetails && typeof weeklyDetails === 'object' ? weeklyDetails : fallbackHoroscopeDetail;
    const finalMonthly = monthlyDetails && typeof monthlyDetails === 'object' ? monthlyDetails : fallbackHoroscopeDetail;

    const result: HoroscopeFlowOutput = {
      daily: finalDaily,
      weekly: finalWeekly,
      monthly: finalMonthly,
    };

    const parsedResult = HoroscopeFlowOutputSchema.safeParse(result);
    if (!parsedResult.success) {
        console.error("HoroscopeFlowInternal: Final constructed output does not match HoroscopeFlowOutputSchema.", parsedResult.error.flatten());
        // Consider if a different mock strategy is needed if final construction fails
        const genericDaily = getRandomMockHoroscope('daily');
        const genericWeekly = getRandomMockHoroscope('weekly');
        const genericMonthly = getRandomMockHoroscope('monthly');
        return {
            daily: genericDaily,
            weekly: genericWeekly,
            monthly: genericMonthly,
        };
    }
    return parsedResult.data;
  }
);


export async function getHoroscopeFlow(input: PublicHoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  // Validate and map public input to internal schema
  const internalInput: HoroscopeFlowInputInternal = {
    sign: input.sign,
    locale: input.locale,
    targetDate: input.targetDate,
    onboardingData: input.onboardingData, // This will be undefined if not provided from client
  };
  return horoscopeFlowInternal(internalInput);
}




    

    
