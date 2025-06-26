
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
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo DIARIO PERSONALIZADO para {{userName}} (signo {{sign}}) para {{dateDescriptor}} en el idioma {{locale}}.
**INSTRUCCIÓN CLAVE:** El tema astrológico central para este día es **"{{astrologicalTheme}}"**. Basa TODA tu predicción (principal, amor, dinero y salud) en cómo esta energía específica influye en {{userName}} ({{sign}}). No te desvíes de este tema.
Dirígete al usuario por su nombre, {{userName}}, de forma natural dentro del horóscopo cuando sea apropiado (por ejemplo, "Hola {{userName}}, hoy para tu signo {{sign}}...").
{{#if userRelationshipStatus}}
Considera sutilmente su estado sentimental ({{userRelationshipStatus}}) al redactar la sección de amor, sin hacerlo el foco principal. Por ejemplo, si es 'single', enfócate en la autoexploración o nuevas conexiones. Si es 'in-relationship', en la profundización de lazos.
{{/if}}
{{#if userEmploymentStatus}}
Considera sutilmente su situación laboral ({{userEmploymentStatus}}) al redactar la sección de dinero/trabajo, sin hacerlo el foco principal. Por ejemplo, si es 'student', enfócate en el aprendizaje y futuras oportunidades. Si es 'employed', en el desarrollo profesional.
{{/if}}
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para el día) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo, {{userName}}. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."

Para la sección 'main', profundiza en cómo las energías diarias actuales, guiadas por "{{astrologicalTheme}}", podrían influir en {{userName}} ({{sign}}).
Para 'love', ofrece consejos reflexivos para las conexiones de {{userName}}, siempre en relación con "{{astrologicalTheme}}".
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales para {{userName}}, en el contexto de "{{astrologicalTheme}}".
Para 'health', sugiere cómo {{userName}} puede mantener el bienestar, considerando el tema de "{{astrologicalTheme}}".
{{else}}
Genera ÚNICAMENTE el horóscopo DIARIO GENERAL para el signo zodiacal {{sign}} para {{dateDescriptor}} en el idioma {{locale}}.
**INSTRUCCIÓN CLAVE:** El tema astrológico central para este día es **"{{astrologicalTheme}}"**. Basa TODA tu predicción (principal, amor, dinero y salud) en cómo esta energía específica influye en el signo {{sign}}. No te desvíes de este tema.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para el día) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."

Para la sección 'main', profundiza en cómo las energías diarias actuales, guiadas por "{{astrologicalTheme}}", podrían influir en el signo {{sign}}.
Para 'love', ofrece consejos reflexivos para las conexiones para el signo {{sign}}, siempre en relación con "{{astrologicalTheme}}".
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales para el signo {{sign}}, en el contexto de "{{astrologicalTheme}}".
Para 'health', sugiere cómo el signo {{sign}} puede mantener el bienestar, considerando el tema de "{{astrologicalTheme}}".
{{/if}}

IMPORTANTE: No incluyas la descripción de la fecha (como "{{dateDescriptor}}", "hoy", "ayer" o la fecha específica) directamente en el texto de las secciones "main", "love", "money" o "health". El contenido de estas secciones debe ser la predicción para el día indicado por {{dateDescriptor}}, pero sin mencionar explícitamente la fecha dentro del texto de la predicción.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (theme: "un encuentro social sorprendente"):
{
  "main": "Hoy, la energía social te rodea, Aries. Un encuentro inesperado podría cambiar el curso de tu día, ofreciéndote una nueva perspectiva. Mantente abierto a conversaciones con extraños; la sincronicidad está de tu lado.",
  "love": "Si estás en pareja, una salida social podría reavivar la chispa. Para los solteros, este es un día excelente para conocer a alguien en un evento o reunión. Tu carisma estará en su punto más alto.",
  "money": "El networking es tu mejor activo hoy. Una conversación casual podría llevar a una oportunidad profesional o financiera. No subestimes el poder de tus conexiones.",
  "health": "Tu bienestar se beneficia de la interacción social. Compartir una actividad física con amigos, como una caminata o un deporte en equipo, te recargará de energía."
}
Ahora genera el horóscopo diario para {{sign}} en {{locale}} para {{dateDescriptor}} y el tema "{{astrologicalTheme}}", reflejando este estilo perspicaz y empático:
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: PromptInputSchema }, // Using the new PromptInputSchema
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo SEMANAL PERSONALIZADO para ESTA SEMANA ACTUAL para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
Saluda a {{userName}} al inicio del horóscopo de manera natural.
{{else}}
Genera ÚNICAMENTE el horóscopo SEMANAL GENERAL para ESTA SEMANA ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
{{/if}}

Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para la semana, como el ingreso de un planeta en un nuevo sector o signo) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."
Busca una profundidad y un tono similares en tus respuestas, adaptados a una perspectiva semanal.

Para la sección 'main', proporciona una visión general completa para LA SEMANA ACTUAL.
{{#if isPersonalized}}
Comienza con un tema general para la semana para {{userName}} ({{sign}}), posiblemente mencionando cómo un tránsito planetario clave (ej. "Marte en Virgo") podría influir en su perspectiva o metas.
{{else}}
Comienza con un tema general para la semana para el signo {{sign}}, posiblemente mencionando cómo un tránsito planetario clave (ej. "Marte en Virgo") podría influir en su perspectiva o metas.
{{/if}}
Si es apropiado, divide la semana en fases (por ejemplo, inicio, mediados, fin de semana) discutiendo cómo las diferentes energías podrían influir. Aborda temas como el crecimiento personal, los desafíos como oportunidades, y cómo los rasgos centrales del signo interactúan con estas energías semanales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODA LA SEMANA. Estas secciones también deben ser de varios párrafos y detalladas, conectando con el tema principal de la semana si es posible.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "{{#if isPersonalized}}Hola {{userName}}, esta semana para tu signo Virgo, {{else}}Virgo, esta semana, {{/if}}con el ingreso de Mercurio en un sector de comunicación profunda, te invita a reflexionar sobre cómo expresas tus verdades...",
  "love": "En el amor, {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}}, la influencia de Mercurio te anima a tener esas conversaciones pendientes...",
  "money": "En el ámbito financiero y profesional, la precisión de {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}} se ve potenciada...",
  "health": "Tu bienestar esta semana, {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}}, se beneficia de rutinas que fomenten tanto la claridad mental..."
}
Ahora genera el horóscopo SEMANAL MUY DETALLADO para {{sign}} en {{locale}} para esta semana, reflejando este estilo perspicaz y empático, y personalizándolo si isPersonalized es true:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: PromptInputSchema }, // Using the new PromptInputSchema
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo MENSUAL PERSONALIZADO para ESTE MES ACTUAL para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
Saluda a {{userName}} al inicio del horóscopo de manera natural.
{{else}}
Genera ÚNICAMENTE el horóscopo MENSUAL GENERAL para ESTE MES ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
{{/if}}

Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (puedes mencionar tránsitos planetarios importantes del mes, ya sean reales o arquetípicos, y cómo impactan a {{sign}}) con el crecimiento personal, las emociones y las metas a largo plazo.
Evita marcadores de posición como "[Insertar mes actual]" o similares; el horóscopo es para el mes actual, así que refiérete a él como "este mes" o "el mes actual" si es necesario.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica, adaptado a una perspectiva mensual: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Este mes, con el Sol iluminando un área clave de tu carta, obtendrás mayor claridad sobre tus aspiraciones más profundas. Es un período para sanar heridas del pasado relacionadas con tu autoestima y avanzar con una renovada sensación de propósito. Las relaciones se tornan más significativas, atrayendo personas confiables que te apoyan incondicionalmente."
Busca una profundidad y un tono similares en tus respuestas.

Para la sección 'main', proporciona una visión general completa para EL MES ACTUAL.
{{#if isPersonalized}}
Comienza estableciendo las energías o temas generales que afectarán a {{userName}} ({{sign}}) durante este período.
{{else}}
Comienza estableciendo las energías o temas generales que afectarán al signo {{sign}} durante este período.
{{/if}}
Si es apropiado, divide el mes en fases (por ejemplo, primera quincena, segunda quincena, o por semanas clave) discutiendo cómo diferentes influencias podrían desarrollarse. Aborda temas como el crecimiento personal, el hogar, las aspiraciones profesionales, las relaciones, la creatividad y cómo los rasgos centrales del signo interactúan con estas energías mensuales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODO EL MES. Estas secciones también deben ser de varios párrafos y muy detalladas, ofreciendo una guía que ayude a {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}} a navegar el mes con mayor conciencia y bienestar.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "{{#if isPersonalized}}Hola {{userName}}, este mes para tu signo Capricornio, {{else}}Capricornio, este mes, {{/if}}se perfila como un período de profunda introspección...",
  "love": "En el terreno sentimental, {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}}, este mes te pide honestidad emocional...",
  "money": "Profesional y financieramente, {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}}, este mes es para la estrategia y la consolidación...",
  "health": "Tu bienestar, {{#if isPersonalized}}{{userName}} ({{sign}}){{else}}{{sign}}{{/if}}, este mes se beneficia enormemente de prácticas que fomenten la conexión mente-cuerpo..."
}
Ahora genera el horóscopo MENSUAL MUY DETALLADO para {{sign}} en {{locale}} para este mes, reflejando este estilo perspicaz y empático, y personalizándolo si isPersonalized es true:
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




    