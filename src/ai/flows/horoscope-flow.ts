
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


const PromptInputSchema = HoroscopeFlowInputSchemaInternal.extend({
  dateDescriptor: z.string().describe('Descriptor for the date, e.g., "HOY", "AYER", "para la fecha YYYY-MM-DD"'),
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


// Daily Horoscope Prompt
const dailyHoroscopePrompt = ai.definePrompt({
  name: 'dailyHoroscopePrompt',
  input: { schema: PromptInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
Genera ÚNICAMENTE el horóscopo DIARIO para {{dateDescriptor}} para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para el día) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."
Busca una profundidad y un tono similares en tus respuestas.

{{#if onboardingData.name}}
Dirígete al usuario por su nombre, {{onboardingData.name}}, de forma natural dentro del horóscopo cuando sea apropiado (por ejemplo, "Hola {{onboardingData.name}}, hoy para tu signo {{sign}}...").
{{#if onboardingData.relationshipStatus}}
Considera sutilmente su estado sentimental ({{onboardingData.relationshipStatus}}) al redactar la sección de amor, sin hacerlo el foco principal. Por ejemplo, si es 'single', enfócate en la autoexploración o nuevas conexiones. Si es 'in-relationship', en la profundización de lazos.
{{/if}}
{{#if onboardingData.employmentStatus}}
Considera sutilmente su situación laboral ({{onboardingData.employmentStatus}}) al redactar la sección de dinero/trabajo, sin hacerlo el foco principal. Por ejemplo, si es 'student', enfócate en el aprendizaje y futuras oportunidades. Si es 'employed', en el desarrollo profesional.
{{/if}}
{{else}}
Genera un horóscopo general para el signo {{sign}}.
{{/if}}

IMPORTANTE: No incluyas la descripción de la fecha (como "{{dateDescriptor}}", "hoy", "ayer" o la fecha específica) directamente en el texto de las secciones "main", "love", "money" o "health". El contenido de estas secciones debe ser la predicción para el día indicado por {{dateDescriptor}}, pero sin mencionar explícitamente la fecha dentro del texto de la predicción.

Para la sección 'main', profundiza en cómo las energías diarias actuales o tránsitos menores (puedes inferirlos arquetípicamente si no tienes datos específicos del día) podrían influir en {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}}. Céntrate en la introspección, el manejo de las emociones y las oportunidades de claridad o sanación para el día. Evita consejos demasiado genéricos.
Para 'love', ofrece consejos reflexivos para las conexiones, la comprensión y la expresión emocional en el día. Considera cómo {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}} podría abordar los desafíos o alegrías en sus relaciones.
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales, quizás vinculándolos con el enfoque, la claridad o nuevas perspectivas que las energías del día podrían traer a {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}}.
Para 'health', sugiere cómo mantener el bienestar conectando con la paz interior, gestionando los factores de estrés diarios o aprovechando la energía del día para actividades restauradoras.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "{{#if onboardingData.name}}Hola {{onboardingData.name}}, hoy para tu signo Aries, podrías sentir un eco de decepciones pasadas.{{else}}Aries, podrías sentir un eco de decepciones pasadas.{{/if}} Recuerda que los altibajos son parte de la vida, pero la sospecha constante no resuena con tu naturaleza fogosa. Una introspección sobre tus metas te dará claridad. Quizás es momento de sanar alguna herida y mirar hacia adelante con nueva determinación.",
  "love": "En el amor, la honestidad contigo mismo sobre lo que necesitas para confiar es crucial. {{#if onboardingData.relationshipStatus}}{{#if (eq onboardingData.relationshipStatus 'single')}}Si estás soltero/a, este es un buen momento para reflexionar sobre tus necesidades antes de buscar nuevas conexiones.{{/if}}{{#if (eq onboardingData.relationshipStatus 'in-relationship')}}Si estás en una relación, la comunicación auténtica fortalecerá el vínculo.{{/if}}{{/if}} Si sientes que viejas heridas afectan tus interacciones, permítete un espacio para la reflexión.",
  "money": "Tu regente Marte impulsa la acción, pero la claridad mental es tu mejor activo financiero. Antes de tomar decisiones, especialmente si surgen de impulsos pasados, evalúa si se alinean con tus metas actuales. Podrías identificar una nueva dirección para tus esfuerzos profesionales.",
  "health": "Dedica tiempo a actividades que te reconecten con tu fuerza interior, {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}}. Sanar implica tanto el cuerpo como la mente. Si viejas tensiones resurgen, canaliza esa energía en ejercicio consciente o una práctica que te brinde paz y te permita avanzar."
}
Ahora genera el horóscopo diario para {{sign}} en {{locale}} para {{dateDescriptor}}, reflejando este estilo perspicaz y empático, y personalizándolo si hay datos de onboardingData:
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchemaInternal },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
Genera ÚNICAMENTE el horóscopo SEMANAL para ESTA SEMANA ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para la semana, como el ingreso de un planeta en un nuevo sector o signo) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."
Busca una profundidad y un tono similares en tus respuestas, adaptados a una perspectiva semanal.

{{#if onboardingData.name}}
Saluda a {{onboardingData.name}} al inicio del horóscopo de manera natural.
{{/if}}

Para la sección 'main', proporciona una visión general completa para LA SEMANA ACTUAL. Comienza con un tema general para la semana para {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}}, posiblemente mencionando cómo un tránsito planetario clave (ej. "Marte en Virgo") podría influir en su perspectiva o metas. Si es apropiado, divide la semana en fases (por ejemplo, inicio, mediados, fin de semana) discutiendo cómo las diferentes energías podrían influir en ellos. Aborda temas como el crecimiento personal, los desafíos como oportunidades, y cómo los rasgos centrales del signo interactúan con estas energías semanales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODA LA SEMANA. Estas secciones también deben ser de varios párrafos y detalladas, conectando con el tema principal de la semana si es posible.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "{{#if onboardingData.name}}Hola {{onboardingData.name}}, esta semana para tu signo Virgo, {{else}}Virgo, esta semana, {{/if}}con el ingreso de Mercurio en un sector de comunicación profunda, te invita a reflexionar sobre cómo expresas tus verdades...",
  "love": "En el amor, Virgo, la influencia de Mercurio te anima a tener esas conversaciones pendientes...",
  "money": "En el ámbito financiero y profesional, la precisión de Virgo se ve potenciada...",
  "health": "Tu bienestar esta semana, Virgo, se beneficia de rutinas que fomenten tanto la claridad mental..."
}
Ahora genera el horóscopo SEMANAL MUY DETALLADO para {{sign}} en {{locale}} para esta semana, reflejando este estilo perspicaz y empático, y personalizándolo si hay datos de onboardingData:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchemaInternal },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda.
Genera ÚNICAMENTE el horóscopo MENSUAL para ESTE MES ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (puedes mencionar tránsitos planetarios importantes del mes, ya sean reales o arquetípicos, y cómo impactan a {{sign}}) con el crecimiento personal, las emociones y las metas a largo plazo.
Evita marcadores de posición como "[Insertar mes actual]" o similares; el horóscopo es para el mes actual, así que refiérete a él como "este mes" o "el mes actual" si es necesario.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica, adaptado a una perspectiva mensual: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Este mes, con el Sol iluminando un área clave de tu carta, obtendrás mayor claridad sobre tus aspiraciones más profundas. Es un período para sanar heridas del pasado relacionadas con tu autoestima y avanzar con una renovada sensación de propósito. Las relaciones se tornan más significativas, atrayendo personas confiables que te apoyan incondicionalmente."
Busca una profundidad y un tono similares en tus respuestas.

{{#if onboardingData.name}}
Saluda a {{onboardingData.name}} al inicio del horóscopo de manera natural.
{{/if}}

Para la sección 'main', proporciona una visión general completa para EL MES ACTUAL. Comienza estableciendo las energías o temas generales que afectarán a {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}} durante este período. Si es apropiado, divide el mes en fases (por ejemplo, primera quincena, segunda quincena, o por semanas clave) discutiendo cómo diferentes influencias podrían desarrollarse. Aborda temas como el crecimiento personal, el hogar, las aspiraciones profesionales, las relaciones, la creatividad y cómo los rasgos centrales del signo interactúan con estas energías mensuales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODO EL MES. Estas secciones también deben ser de varios párrafos y muy detalladas, ofreciendo una guía que ayude a {{#if onboardingData.name}}{{onboardingData.name}} ({{sign}}){{else}}{{sign}}{{/if}} a navegar el mes con mayor conciencia y bienestar.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main" (cadena de texto), "love" (cadena de texto), "money" (cadena de texto), "health" (cadena de texto). NO añadas ninguna otra clave. NO uses markdown en las cadenas.
Ejemplo de estructura de salida (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "{{#if onboardingData.name}}Hola {{onboardingData.name}}, este mes para tu signo Capricornio, {{else}}Capricornio, este mes, {{/if}}se perfila como un período de profunda introspección...",
  "love": "En el terreno sentimental, Capricornio, este mes te pide honestidad emocional...",
  "money": "Profesional y financieramente, Capricornio, este mes es para la estrategia y la consolidación...",
  "health": "Tu bienestar, Capricornio, este mes se beneficia enormemente de prácticas que fomenten la conexión mente-cuerpo..."
}
Ahora genera el horóscopo MENSUAL MUY DETALLADO para {{sign}} en {{locale}} para este mes, reflejando este estilo perspicaz y empático, y personalizándolo si hay datos de onboardingData:
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
  let cacheKey = `daily-${input.sign}-${input.locale}-${dateStr}`;
  if (input.onboardingData?.name) {
    cacheKey += `-user-${input.onboardingData.name.replace(/\s+/g, '_')}`; // Add user distinction to cache key if personalized
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

  const promptPayload: PromptInput = {
      ...input,
      dateDescriptor: dateDescriptor
  };

  try {
    const {output} = await dailyHoroscopePrompt(promptPayload);
    if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            dailyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
             console.warn(`AI response for daily horoscope (${input.sign}, ${input.locale}, ${dateStr}, user: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for daily horoscope (${input.sign}, ${input.locale}, ${dateStr}, user: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('daily');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
    if(parsedMock.success) {
        dailyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Daily mock data for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        dailyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getDailyHoroscopeDetails for ${input.sign} (${input.locale}, ${dateStr}, user: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('daily');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for daily horoscope (${input.sign}, ${input.locale}, ${dateStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching daily horoscope (${input.sign}, ${input.locale}, ${dateStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        dailyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Daily mock data (catch) for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
        dailyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }
  }
}

async function getWeeklyHoroscopeDetails(input: HoroscopeFlowInputInternal, currentDate: Date): Promise<HoroscopeDetail> {
  const weekStr = formatDateForWeeklyCache(currentDate);
  let cacheKey = `weekly-${input.sign}-${input.locale}-${weekStr}`;
  if (input.onboardingData?.name) {
    cacheKey += `-user-${input.onboardingData.name.replace(/\s+/g, '_')}`;
  }

  if (weeklyCache.has(cacheKey)) {
    const cachedValue = weeklyCache.get(cacheKey)!;
    const parsed = HoroscopeDetailSchema.safeParse(cachedValue);
    if (parsed.success) return parsed.data;
    console.warn(`Invalid weekly horoscope data in cache for ${cacheKey}. Fetching anew.`);
    weeklyCache.delete(cacheKey);
  }
  try {
    const {output} = await weeklyHoroscopePrompt(input);
     if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            weeklyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
            console.warn(`AI response for weekly horoscope (${input.sign}, ${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for weekly horoscope (${input.sign}, ${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('weekly');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
    if(parsedMock.success) {
        weeklyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Weekly mock data for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        weeklyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getWeeklyHoroscopeDetails for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('weekly');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

     if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for weekly horoscope (${input.sign}, ${input.locale}, ${weekStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching weekly horoscope (${input.sign}, ${input.locale}, ${weekStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        weeklyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Weekly mock data (catch) for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
        weeklyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }
  }
}

async function getMonthlyHoroscopeDetails(input: HoroscopeFlowInputInternal, currentDate: Date): Promise<HoroscopeDetail> {
  const monthStr = formatDateForMonthlyCache(currentDate);
  let cacheKey = `monthly-${input.sign}-${input.locale}-${monthStr}`;
  if (input.onboardingData?.name) {
    cacheKey += `-user-${input.onboardingData.name.replace(/\s+/g, '_')}`;
  }

  if (monthlyCache.has(cacheKey)) {
    const cachedValue = monthlyCache.get(cacheKey)!;
    const parsed = HoroscopeDetailSchema.safeParse(cachedValue);
    if (parsed.success) return parsed.data;
    console.warn(`Invalid monthly horoscope data in cache for ${cacheKey}. Fetching anew.`);
    monthlyCache.delete(cacheKey);
  }
  try {
    const {output} = await monthlyHoroscopePrompt(input);
    if (output) {
        const parsedOutput = HoroscopeDetailSchema.safeParse(output);
        if (parsedOutput.success) {
            monthlyCache.set(cacheKey, parsedOutput.data);
            return parsedOutput.data;
        } else {
            console.warn(`AI response for monthly horoscope (${input.sign}, ${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed Zod validation. Error details: ${JSON.stringify(parsedOutput.error.flatten())}. AI Output was: ${JSON.stringify(output)}. Using mock data.`);
        }
    } else {
      console.warn(`AI response for monthly horoscope (${input.sign}, ${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) was null. Using mock data.`);
    }

    let mockData = getRandomMockHoroscope('monthly');
    const parsedMock = HoroscopeDetailSchema.safeParse(mockData);
     if(parsedMock.success) {
        monthlyCache.set(cacheKey, parsedMock.data);
        return parsedMock.data;
    } else {
        console.error(`CRITICAL: Monthly mock data for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMock.error.flatten())}. Returning hardcoded fallback.`);
        monthlyCache.set(cacheKey, fallbackHoroscopeDetail);
        return fallbackHoroscopeDetail;
    }

  } catch (err: any) {
    console.error(`Error in getMonthlyHoroscopeDetails for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';

    let mockDataOnError = getRandomMockHoroscope('monthly');
    const parsedMockOnError = HoroscopeDetailSchema.safeParse(mockDataOnError);

    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for monthly horoscope (${input.sign}, ${input.locale}, ${monthStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data as fallback. Error: ${errorMessage}`);
    } else {
      console.error(`Unexpected error fetching monthly horoscope (${input.sign}, ${input.locale}, ${monthStr}, user: ${input.onboardingData?.name || 'N/A'}). Using mock data. Error: ${errorMessage}`);
    }

    if(parsedMockOnError.success) {
        monthlyCache.set(cacheKey, parsedMockOnError.data);
        return parsedMockOnError.data;
    } else {
        console.error(`CRITICAL: Monthly mock data (catch) for ${input.sign} (${input.locale}, user: ${input.onboardingData?.name || 'N/A'}) failed schema. Error: ${JSON.stringify(parsedMockOnError.error.flatten())}. Returning hardcoded fallback.`);
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
        const parsedDate = new Date(Date.UTC(year, month - 1, day));
        if (!isNaN(parsedDate.getTime())) {
            dailyTargetDate = parsedDate;
        } else {
            console.warn(`Invalid targetDate format: ${input.targetDate}. Defaulting to current date for daily horoscope.`);
        }
    }

    const [dailyDetails, weeklyDetails, monthlyDetails] = await Promise.all([
        getDailyHoroscopeDetails(input, dailyTargetDate),
        getWeeklyHoroscopeDetails(input, currentDate),
        getMonthlyHoroscopeDetails(input, currentDate),
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
  const internalInput: HoroscopeFlowInputInternal = {
    sign: input.sign,
    locale: input.locale,
    targetDate: input.targetDate,
    onboardingData: input.onboardingData,
  };
  return horoscopeFlowInternal(internalInput);
}
