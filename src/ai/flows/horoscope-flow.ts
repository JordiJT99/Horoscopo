
'use server';
/**
 * @fileOverview A Genkit flow to generate horoscopes with caching and mock fallbacks.
 *
 * - getHoroscopeFlow - A function that calls the horoscope generation flow.
 *   It now uses caching for daily, weekly, and monthly horoscopes, and fallbacks to mocks on API error.
 * - HoroscopeFlowInput - The input type for the getHoroscopeFlow function.
 * - HoroscopeFlowOutput - The return type for the getHoroscopeFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import { format, getISOWeekYear, getMonth, getYear } from 'date-fns'; // Updated imports
import { getRandomMockHoroscope } from '@/lib/mock-horoscopes';

// Helper to create a Zod enum from the ZodiacSignName type values
const zodSignEnum = z.enum(ALL_SIGN_NAMES as [string, ...string[]]);

const HoroscopeFlowInputSchema = z.object({
  sign: zodSignEnum.describe('The zodiac sign for which to generate the horoscope.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the horoscope language.'),
});
export type HoroscopeFlowInput = z.infer<typeof HoroscopeFlowInputSchema>;

// Schema for detailed horoscope predictions for a period
const HoroscopeDetailSchema = z.object({
  main: z.string().describe('A detailed general horoscope for the period, touching upon the sign\'s core traits and how current energies affect them. This should be an elaborate text, like: "If something stands out about these natives, it is their impulsiveness, not in vain are they a fire sign, dominated by Mars, and their nature is fiery and dynamic. They do not usually wait for events, they rush into them and of course, they are impatient, which often leads them to make decisions too quickly. They are optimistic and sincere and value friendship as a sacred good." For weekly/monthly, this section should be significantly more detailed, potentially breaking down the period into phases or discussing multiple life areas like personal growth, home, and self-expression.'),
  love: z.string().describe('Elaborate insights and advice for love and relationships for the period. Provide specific scenarios or feelings. For weekly/monthly, this section should offer deeper insights and potential developments over the period.'),
  money: z.string().describe('Comprehensive insights and advice for finances and career for the period. Discuss potential opportunities or challenges. For weekly/monthly, this should cover strategic advice and possible shifts in financial or career landscapes.'),
  health: z.string().describe('Detailed insights and advice for health and well-being for the period. Suggest activities or precautions. For weekly/monthly, this should include advice for maintaining balance and addressing potential stress factors over the longer term.'),
});
export type HoroscopeDetail = z.infer<typeof HoroscopeDetailSchema>;

const HoroscopeFlowOutputSchema = z.object({
  daily: HoroscopeDetailSchema,
  weekly: HoroscopeDetailSchema,
  monthly: HoroscopeDetailSchema,
});
export type HoroscopeFlowOutput = z.infer<typeof HoroscopeFlowOutputSchema>;

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
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda. Genera ÚNICAMENTE el horóscopo DIARIO para HOY para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para el día) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."
Busca una profundidad y un tono similares en tus respuestas.

Para la sección 'main', profundiza en cómo las energías diarias actuales o tránsitos menores (puedes inferirlos arquetípicamente si no tienes datos específicos) podrían influir en {{sign}}. Céntrate en la introspección, el manejo de las emociones y las oportunidades de claridad o sanación para el día. Evita consejos demasiado genéricos.
Para 'love', ofrece consejos reflexivos para las conexiones, la comprensión y la expresión emocional en el día. Considera cómo {{sign}} podría abordar los desafíos o alegrías en sus relaciones hoy.
Para 'money', proporciona perspectivas sobre decisiones financieras o asuntos laborales, quizás vinculándolos con el enfoque, la claridad o nuevas perspectivas que las energías del día podrían traer a {{sign}}.
Para 'health', sugiere cómo mantener el bienestar conectando con la paz interior, gestionando los factores de estrés diarios o aprovechando la energía del día para actividades restauradoras.

La salida debe ser un objeto JSON con las siguientes claves: "main", "love", "money", "health". Todas las cadenas de texto deben ser elaboradas y ofrecer consejos significativos y personalizados para {{sign}}.

Ejemplo de estructura de salida para {{sign}} (Aries) en {{locale}} (es), reflejando el nuevo estilo (CONTENIDO EJEMPLO, GENERA EL TUYO PROPIO):
{
  "main": "Aries, hoy podrías sentir un eco de decepciones pasadas que dificultan la confianza. Recuerda que los altibajos son parte de la vida, pero la sospecha constante no resuena con tu naturaleza fogosa. Una introspección sobre tus metas te dará claridad. Quizás es momento de sanar alguna herida y mirar hacia adelante con nueva determinación.",
  "love": "En el amor, la honestidad contigo mismo sobre lo que necesitas para confiar es crucial hoy. Si sientes que viejas heridas afectan tus interacciones, permítete un espacio para la reflexión. La comunicación auténtica, incluso sobre tus vulnerabilidades, puede atraer conexiones más genuinas.",
  "money": "Tu regente Marte impulsa la acción, pero hoy la claridad mental es tu mejor activo financiero. Antes de tomar decisiones, especialmente si surgen de impulsos pasados, evalúa si se alinean con tus metas actuales. Podrías identificar una nueva dirección para tus esfuerzos profesionales.",
  "health": "Dedica tiempo a actividades que te reconecten con tu fuerza interior, Aries. Sanar implica tanto el cuerpo como la mente. Si viejas tensiones resurgen, canaliza esa energía en ejercicio consciente o una práctica que te brinde paz y te permita avanzar."
}
Ahora genera el horóscopo diario para {{sign}} en {{locale}} para hoy, reflejando este estilo perspicaz y empático:
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda. Genera ÚNICAMENTE el horóscopo SEMANAL para ESTA SEMANA ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (reales o arquetípicos para la semana, como el ingreso de un planeta en un nuevo sector o signo) con el crecimiento personal y el bienestar emocional.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Esta semana, con Marte —tu regente— ingresando en un nuevo sector del cielo, obtendrás mayor claridad sobre tus metas. Su paso por Virgo trae la oportunidad de sanar heridas del pasado y avanzar en una nueva dirección. Atraerás personas confiables, dispuestas a apoyarte y motivarte en tu camino."
Busca una profundidad y un tono similares en tus respuestas, adaptados a una perspectiva semanal.

Para la sección 'main', proporciona una visión general completa para LA SEMANA ACTUAL. Comienza con un tema general para la semana para {{sign}}, posiblemente mencionando cómo un tránsito planetario clave (ej. "Marte en Virgo") podría influir en su perspectiva o metas. Si es apropiado, divide la semana en fases (por ejemplo, inicio, mediados, fin de semana) discutiendo cómo las diferentes energías podrían influir en ellos. Aborda temas como el crecimiento personal, los desafíos como oportunidades, y cómo los rasgos centrales del signo interactúan con estas energías semanales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODA LA SEMANA. Estas secciones también deben ser de varios párrafos y detalladas, conectando con el tema principal de la semana si es posible. Por ejemplo, si Marte en Virgo sugiere organización, ¿cómo se aplica esto al amor, dinero o salud de {{sign}} esta semana?

La salida debe ser un objeto JSON con las siguientes claves: "main", "love", "money", "health". Todos los valores de cadena deben ser ricos, largos, contener múltiples párrafos y ofrecer consejos significativos y personalizados para {{sign}}.

Ejemplo de estructura de salida para {{sign}} (Virgo) en {{locale}} (es) - ESTO ES SOLO UN EJEMPLO DE ESTRUCTURA, HAZ EL CONTENIDO REAL MUCHO MÁS DETALLADO Y CON EL NUEVO ESTILO:
{
  "main": "Virgo, esta semana, con el ingreso de Mercurio en un sector de comunicación profunda, te invita a reflexionar sobre cómo expresas tus verdades. Podrías sentir la necesidad de aclarar malentendidos pasados, sanando viejas heridas en tus relaciones. Es un tiempo para la introspección y para reorganizar tus ideas, permitiéndote avanzar con mayor claridad hacia tus metas. La primera parte de la semana favorece la planificación meticulosa, mientras que hacia el final, podrías encontrar apoyo en personas confiables que resuenan con tu nueva dirección.\n\nConsidera esta semana como una oportunidad para pulir tu forma de interactuar, buscando la autenticidad. Las dificultades del pasado en la comunicación pueden transformarse en lecciones valiosas si te permites abordarlas con la paciencia y el análisis que te caracterizan. No temas explorar nuevas formas de conectar, tanto contigo mismo como con los demás.",
  "love": "En el amor, Virgo, la influencia de Mercurio te anima a tener esas conversaciones pendientes que pueden sanar y fortalecer tus vínculos. Si estás en pareja, es un momento ideal para compartir tus pensamientos más íntimos y escuchar activamente. Para los solteros, la claridad en lo que buscan atraerá conexiones más genuinas. No temas expresar tus necesidades; la vulnerabilidad puede ser una fuente de gran fortaleza esta semana.\n\nPresta atención a cómo las experiencias pasadas pueden estar tiñendo tu perspectiva actual. Esta semana ofrece la chance de liberarte de viejos patrones de desconfianza, abriéndote a relaciones basadas en la honestidad y el apoyo mutuo. Confía en tu capacidad para discernir quiénes son personas realmente valiosas en tu camino.",
  "money": "En el ámbito financiero y profesional, la precisión de Virgo se ve potenciada. Utiliza esta energía para organizar tus finanzas, revisar proyectos y planificar estrategias a largo plazo. El tránsito planetario actual podría iluminar áreas donde necesitas ajustar tu enfoque para alcanzar tus metas económicas. Es un buen momento para comunicar tus ideas con claridad en el trabajo; podrías encontrar que otros están más receptivos a tus propuestas bien fundamentadas.\n\nSi has enfrentado obstáculos recientemente, esta semana te da la oportunidad de analizarlos desde una nueva perspectiva y encontrar soluciones prácticas. La clave está en no permitir que contratiempos pasados minen tu confianza. En lugar de ello, úsalos como catalizadores para una planificación más astuta y para buscar colaboradores que compartan tu visión y ética de trabajo.",
  "health": "Tu bienestar esta semana, Virgo, se beneficia de rutinas que fomenten tanto la claridad mental como la sanación emocional. Considera prácticas como el journaling para procesar pensamientos o la meditación para encontrar calma. El orden externo, tan valorado por tu signo, puede ser un reflejo de tu paz interior. Si sientes tensiones acumuladas, actividades como el yoga o paseos conscientes en la naturaleza te ayudarán a liberar y equilibrar tu energía.\n\nEs un buen momento para revisar tus hábitos y hacer pequeños ajustes que tengan un gran impacto en tu salud general. Quizás sea el momento de dejar ir alguna costumbre que ya no te sirve y adoptar una nueva que nutra tu cuerpo y mente. Escucha las señales sutiles de tu cuerpo; te está guiando hacia lo que necesitas."
}
Ahora genera el horóscopo SEMANAL MUY DETALLADO para {{sign}} en {{locale}} para esta semana, reflejando este estilo perspicaz y empático:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `Eres un astrólogo sabio, empático y perspicaz que ofrece una guía profunda. Genera ÚNICAMENTE el horóscopo MENSUAL para ESTE MES ACTUAL para el signo zodiacal {{sign}} en el idioma {{locale}}.
Adopta un léxico reflexivo, perspicaz y que conecte los eventos astrológicos (puedes mencionar tránsitos planetarios importantes del mes, ya sean reales o arquetípicos, y cómo impactan a {{sign}}) con el crecimiento personal, las emociones y las metas a largo plazo.
Evita marcadores de posición como "[Insertar mes actual]" o similares; el horóscopo es para el mes actual, así que refiérete a él como "este mes" o "el mes actual" si es necesario.
Tu tono debe ser similar a este ejemplo de sabiduría astrológica, adaptado a una perspectiva mensual: "Cuando sufrimos decepciones, resulta más difícil volver a confiar. La vida, naturalmente, conlleva altibajos para todos. Pero vivir con sospecha constante no va contigo. Este mes, con el Sol iluminando un área clave de tu carta, obtendrás mayor claridad sobre tus aspiraciones más profundas. Es un período para sanar heridas del pasado relacionadas con tu autoestima y avanzar con una renovada sensación de propósito. Las relaciones se tornan más significativas, atrayendo personas confiables que te apoyan incondicionalmente."
Busca una profundidad y un tono similares en tus respuestas.

Para la sección 'main', proporciona una visión general completa para EL MES ACTUAL. Comienza estableciendo las energías o temas generales que afectarán a {{sign}} durante este período. Si es apropiado, divide el mes en fases (por ejemplo, primera quincena, segunda quincena, o por semanas clave) discutiendo cómo diferentes influencias podrían desarrollarse. Aborda temas como el crecimiento personal, el hogar, las aspiraciones profesionales, las relaciones, la creatividad y cómo los rasgos centrales del signo interactúan con estas energías mensuales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODO EL MES. Estas secciones también deben ser de varios párrafos y muy detalladas, ofreciendo una guía que ayude a {{sign}} a navegar el mes con mayor conciencia y bienestar.

La salida debe ser un objeto JSON con las siguientes claves: "main", "love", "money", "health". Todos los valores de cadena deben ser ricos, largos, contener múltiples párrafos y ofrecer consejos significativos y personalizados para {{sign}}.

Ejemplo de estructura de salida para {{sign}} (Capricornio) en {{locale}} (es) - ESTO ES SOLO UN EJEMPLO DE ESTRUCTURA, HAZ EL CONTENIDO REAL MUCHO MÁS DETALLADO, LARGO Y CON EL NUEVO ESTILO:
{
  "main": "Capricornio, este mes se perfila como un período de profunda introspección y redefinición de tus metas a largo plazo. Con Saturno, tu regente, aspectando un punto sensible de tu carta, podrías sentir la necesidad de soltar viejas estructuras que ya no sirven a tu crecimiento. Las decepciones del pasado, especialmente aquellas relacionadas con la confianza, pueden resurgir para ser sanadas. No te resistas a este proceso; es una oportunidad para construir bases más sólidas y auténticas para tu futuro. La primera mitad del mes te invita a la reflexión y a la planificación cuidadosa. Durante la segunda quincena, una nueva claridad emergerá, impulsándote a tomar decisiones valientes que reflejen tu verdadera esencia y te alineen con personas más confiables y motivadoras.\n\nEste no es un mes para la acción impulsiva, sino para la sabiduría que nace de la experiencia. Observa tus patrones, reconoce tus fortalezas y permítete ser vulnerable para conectar genuinamente. El universo te apoya en este viaje de transformación, ofreciéndote las herramientas para construir una vida más significativa y alineada con quien realmente eres.",
  "love": "En el terreno sentimental, Capricornio, este mes te pide honestidad emocional. Si has estado evitando ciertas conversaciones o sentimientos por temor a la decepción, es el momento de abordarlos con valentía y desde el corazón. Para quienes están en pareja, esto podría significar profundizar la intimidad a través de la vulnerabilidad compartida, sanando cualquier fisura en la confianza. Los solteros podrían sentirse atraídos por personas que ofrezcan estabilidad emocional y apoyo genuino, pero es crucial que primero sanen cualquier herida interna que les impida confiar plenamente.\n\nConsidera cómo las experiencias pasadas han moldeado tus expectativas en el amor. Este mes te da la oportunidad de liberarte de cargas innecesarias y de redefinir lo que buscas en una relación. Al cultivar la autoconfianza y la claridad en tus propios valores, atraerás conexiones que reflejen tu crecimiento y madurez emocional.",
  "money": "Profesional y financieramente, Capricornio, este mes es para la estrategia y la consolidación. La influencia de Saturno te pide que revises tus cimientos: ¿están tus proyectos y ambiciones alineados con tus valores más profundos? Podrías descubrir que algunas metas pasadas ya no resuenan contigo, y es un buen momento para redirigir tu energía hacia lo que verdaderamente te motiva. Evita las decisiones financieras impulsivas; en su lugar, dedica tiempo a la planificación y a buscar asesoramiento confiable si es necesario.\n\nEste es un período excelente para la organización y para establecer sistemas que te brinden mayor seguridad a largo plazo. Si surgen oportunidades, evalúalas con la cabeza fría, considerando no solo el beneficio inmediato sino también su impacto en tu bienestar general. La perseverancia y la disciplina, tus grandes aliadas, te guiarán hacia decisiones financieras sabias y sostenibles.",
  "health": "Tu bienestar, Capricornio, este mes se beneficia enormemente de prácticas que fomenten la conexión mente-cuerpo y la liberación de estrés acumulado. La introspección que trae este período puede ser intensa, por lo que es vital que encuentres válvulas de escape saludables. Actividades como el yoga, el tai chi, o largas caminatas en la naturaleza te ayudarán a procesar emociones y a mantener el equilibrio. Presta atención a las señales de tu cuerpo, especialmente si sientes tensiones en la espalda o articulaciones, áreas regidas por tu signo.\n\nEs un buen momento para establecer rutinas de autocuidado que nutran tanto tu cuerpo físico como tu paz interior. Considera la meditación o el journaling como herramientas para ganar claridad y sanar viejas heridas emocionales que puedan estar afectando tu vitalidad. Priorizar tu descanso y una alimentación consciente será clave para navegar este mes transformador con energía y serenidad."
}
Ahora genera el horóscopo MENSUAL MUY DETALLADO para {{sign}} en {{locale}} para este mes, reflejando este estilo perspicaz y empático:
`,
});


async function getDailyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const dateStr = formatDateForDailyCache(currentDate);
  const cacheKey = `daily-${input.sign}-${input.locale}-${dateStr}`;

  if (dailyCache.has(cacheKey)) {
    return dailyCache.get(cacheKey)!;
  }
  try {
    const {output} = await dailyHoroscopePrompt(input);
    if (!output?.main || !output?.love || !output?.money || !output?.health) {
      console.warn(`Incomplete AI response for daily horoscope (${input.sign}, ${input.locale}). Using mock data.`);
      const mockData = getRandomMockHoroscope('daily', input.sign, input.locale);
      dailyCache.set(cacheKey, mockData); // Cache mock data to avoid repeated failed calls for the same day
      return mockData;
    }
    dailyCache.set(cacheKey, output);
    return output;
  } catch (err: any) {
    console.error(`Error in getDailyHoroscopeDetails for ${input.sign} (${input.locale}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';
    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for daily horoscope (${input.sign}, ${input.locale}, ${dateStr}). Using mock data as fallback. Error: ${errorMessage}`);
      const mockData = getRandomMockHoroscope('daily', input.sign, input.locale);
      dailyCache.set(cacheKey, mockData); // Cache mock data to avoid repeated failed calls for the same day
      return mockData;
    }
    // For other types of errors that are not overload/API unavailable, we might want to propagate them or handle differently
    // For now, we'll also return mock data for robustness, but log it as a more severe error.
    console.error(`Unexpected error fetching daily horoscope (${input.sign}, ${input.locale}, ${dateStr}). Using mock data. Error: ${errorMessage}`);
    const mockData = getRandomMockHoroscope('daily', input.sign, input.locale);
    dailyCache.set(cacheKey, mockData);
    return mockData;
  }
}

async function getWeeklyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const weekStr = formatDateForWeeklyCache(currentDate);
  const cacheKey = `weekly-${input.sign}-${input.locale}-${weekStr}`;

  if (weeklyCache.has(cacheKey)) {
    return weeklyCache.get(cacheKey)!;
  }
  try {
    const {output} = await weeklyHoroscopePrompt(input);
     if (!output?.main || !output?.love || !output?.money || !output?.health) {
      console.warn(`Incomplete AI response for weekly horoscope (${input.sign}, ${input.locale}). Using mock data.`);
      const mockData = getRandomMockHoroscope('weekly', input.sign, input.locale);
      weeklyCache.set(cacheKey, mockData);
      return mockData;
    }
    weeklyCache.set(cacheKey, output);
    return output;
  } catch (err: any) {
    console.error(`Error in getWeeklyHoroscopeDetails for ${input.sign} (${input.locale}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';
     if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for weekly horoscope (${input.sign}, ${input.locale}, ${weekStr}). Using mock data as fallback. Error: ${errorMessage}`);
      const mockData = getRandomMockHoroscope('weekly', input.sign, input.locale);
      weeklyCache.set(cacheKey, mockData);
      return mockData;
    }
    console.error(`Unexpected error fetching weekly horoscope (${input.sign}, ${input.locale}, ${weekStr}). Using mock data. Error: ${errorMessage}`);
    const mockData = getRandomMockHoroscope('weekly', input.sign, input.locale);
    weeklyCache.set(cacheKey, mockData);
    return mockData;
  }
}

async function getMonthlyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const monthStr = formatDateForMonthlyCache(currentDate);
  const cacheKey = `monthly-${input.sign}-${input.locale}-${monthStr}`;

  if (monthlyCache.has(cacheKey)) {
    return monthlyCache.get(cacheKey)!;
  }
  try {
    const {output} = await monthlyHoroscopePrompt(input);
    if (!output?.main || !output?.love || !output?.money || !output?.health) {
      console.warn(`Incomplete AI response for monthly horoscope (${input.sign}, ${input.locale}). Using mock data.`);
      const mockData = getRandomMockHoroscope('monthly', input.sign, input.locale);
      monthlyCache.set(cacheKey, mockData);
      return mockData;
    }
    monthlyCache.set(cacheKey, output);
    return output;
  } catch (err: any) {
    console.error(`Error in getMonthlyHoroscopeDetails for ${input.sign} (${input.locale}):`, err);
    const errorMessage = err.message || JSON.stringify(err) || 'Unknown error';
    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded') || errorMessage.toLowerCase().includes('service unavailable') || errorMessage.toLowerCase().includes('googlegenerativeai error') || errorMessage.toLowerCase().includes('failed to fetch')) {
      console.warn(`Genkit API error for monthly horoscope (${input.sign}, ${input.locale}, ${monthStr}). Using mock data as fallback. Error: ${errorMessage}`);
      const mockData = getRandomMockHoroscope('monthly', input.sign, input.locale);
      monthlyCache.set(cacheKey, mockData);
      return mockData;
    }
    console.error(`Unexpected error fetching monthly horoscope (${input.sign}, ${input.locale}, ${monthStr}). Using mock data. Error: ${errorMessage}`);
    const mockData = getRandomMockHoroscope('monthly', input.sign, input.locale);
    monthlyCache.set(cacheKey, mockData);
    return mockData;
  }
}

const horoscopeFlow = ai.defineFlow(
  {
    name: 'horoscopeFlow',
    inputSchema: HoroscopeFlowInputSchema,
    outputSchema: HoroscopeFlowOutputSchema,
  },
  async (input) => {
    const currentDate = new Date(); // Use current date for determining cache periods

    // Note: If any of these fail and return mock data, the overall result will contain that mock data.
    // The UI will not distinguish between real and mock data unless we add specific flags.
    const [dailyDetails, weeklyDetails, monthlyDetails] = await Promise.all([
      getDailyHoroscopeDetails(input, currentDate),
      getWeeklyHoroscopeDetails(input, currentDate),
      getMonthlyHoroscopeDetails(input, currentDate),
    ]);

    return {
      daily: dailyDetails,
      weekly: weeklyDetails,
      monthly: monthlyDetails,
    };
  }
);

// Exported function that client components will call
export async function getHoroscopeFlow(input: HoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  return horoscopeFlow(input);
}

    
