
'use server';
/**
 * @fileOverview A Genkit flow to generate horoscopes with caching.
 *
 * - getHoroscopeFlow - A function that calls the horoscope generation flow.
 *   It now uses caching for daily, weekly, and monthly horoscopes.
 * - HoroscopeFlowInput - The input type for the getHoroscopeFlow function.
 * - HoroscopeFlowOutput - The return type for the getHoroscopeFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import { format, getISOWeekYear, getMonth, getYear } from 'date-fns';

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
  prompt: `You are a skilled astrologer. Generate ONLY the DAILY horoscope for TODAY for the zodiac sign {{sign}} in the {{locale}} language.
Provide a detailed and insightful horoscope.
For the 'main' section, delve into the general characteristics of the sign and how current energies might influence them, similar to the style: "Si algo resalta de estos nativos es su impulsividad, no en vano son un signo de fuego, dominado por Marte, y su naturaleza es fogosa y dinámica. No suele esperar los acontecimientos, se precipita sobre ellos y claro, es impaciente, lo que muchas veces le lleva a tomar decisiones demasiado rápidas. Es optimista y sincero y valora la amistad como un bien sagrado."
For 'love', 'money', and 'health', provide specific, elaborate insights and advice for the day.
The output must be a JSON object with the following keys: "main", "love", "money", "health".

Example for {{sign}} (Aries) in {{locale}} (es):
{
  "main": "Aries, si algo resalta de ti es tu impulsividad, no en vano eres un signo de fuego, dominado por Marte, y tu naturaleza es fogosa y dinámica. No sueles esperar los acontecimientos, te precipitas sobre ellos y claro, eres impaciente, lo que muchas veces te lleva a tomar decisiones demasiado rápidas. Eres optimista y sincero y valoras la amistad como un bien sagrado. Hoy, esta energía se ve amplificada, empujándote a tomar la iniciativa, pero recuerda moderar tu prisa con un momento de reflexión.",
  "love": "En los asuntos del corazón, tu franqueza puede ser un arma de doble filo. Hoy, podría llevarte a un encuentro apasionado o a una conversación sincera que aclare las cosas. Si estás en una relación, sorprende a tu pareja con un gesto espontáneo. Los solteros podrían sentir un fuerte impulso de conquistar a alguien cautivador.",
  "money": "Financieramente, tu naturaleza audaz podría llevarte a explorar una nueva y emocionante empresa o a realizar una inversión rápida. Aunque se presentan oportunidades de ganancias rápidas, también podría surgir un gasto inesperado relacionado con una decisión impulsiva del pasado. Es un buen día para generar ideas sobre fuentes de ingresos innovadoras en lugar de asumir compromisos importantes.",
  "health": "Tu energía física es excepcionalmente alta, Aries. Es un día excelente para canalizarla en un entrenamiento vigoroso o un deporte competitivo. Sin embargo, ten cuidado con el sobreesfuerzo o las lesiones menores debido a la prisa. Escucha las señales de tu cuerpo y asegúrate de descansar lo suficiente para mantener este ritmo dinámico."
}
Now generate the daily horoscope for {{sign}} in {{locale}} for today:
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the WEEKLY horoscope for THIS CURRENT WEEK for the zodiac sign {{sign}} in the {{locale}} language.
Provide a VERY DETAILED, MULTI-PARAGRAPH, and insightful horoscope for each section (main, love, money, health).
For the 'main' section, provide a comprehensive overview for THE CURRENT WEEK. Start with a general theme for the week for {{sign}}. If appropriate, divide the week into phases (e.g., beginning, middle, end of the week) discussing how different energies might influence them. Touch upon themes like personal growth, challenges, opportunities, and how the sign's core traits interact with these weekly energies. The style should be narrative and elaborate, similar to: "Esta semana, {{sign}}, las estrellas te invitan a enfocarte en tu mundo interior. Podrías sentir una necesidad de introspección a principios de semana, lo cual es perfecto para la planificación y la meditación. Hacia mediados de semana, una energía más social emerge, ideal para conectar con amigos o colegas. El fin de semana podría traer una revelación importante relacionada con un proyecto personal. Recuerda que tu naturaleza [mencionar rasgo, ej: práctica/soñadora] te ayudará a navegar estos cambios."
For 'love', 'money', and 'health', provide specific, elaborate insights, advice, and potential developments for the ENTIRE WEEK. These sections should also be multi-paragraph and detailed.
The output must be a JSON object with the following keys: "main", "love", "money", "health". All string values should be rich, long, and contain multiple paragraphs.

Example for {{sign}} (Virgo) in {{locale}} (es) - THIS IS JUST A STRUCTURE EXAMPLE, MAKE THE ACTUAL CONTENT MUCH MORE DETAILED:
{
  "main": "Virgo, esta semana se presenta como un período de intensa actividad mental y organización. A principios de semana, podrías sentirte impulsado a poner en orden tus ideas y proyectos. Es un momento excelente para la planificación detallada y para abordar tareas que requieren precisión. A medida que avance la semana, es posible que surjan oportunidades para colaborar en equipo; tu habilidad para el análisis será muy valorada, pero no olvides también escuchar las perspectivas de los demás para enriquecer el resultado final. \n\n Hacia el final de la semana, especialmente el fin de semana, la energía te invita a buscar un equilibrio entre tus responsabilidades y tu bienestar personal. Podrías descubrir una nueva afición o una forma de relajarte que te ayude a recargar energías. Considera dedicar tiempo a actividades que nutran tu mente y tu cuerpo, como la lectura, paseos por la naturaleza o alguna práctica de mindfulness. Este período también es propicio para reflexionar sobre tus metas a largo plazo y ajustar tus planes si es necesario, siempre con tu característica atención al detalle.",
  "love": "En el terreno amoroso, Virgo, la comunicación será tu mejor aliada esta semana. Si tienes pareja, es un buen momento para tener conversaciones honestas y profundas sobre vuestros planes y sentimientos. Pequeños gestos de aprecio y atención a los detalles fortalecerán vuestro vínculo. \n\n Para los Virgo solteros, la semana podría traer encuentros interesantes en entornos intelectuales o relacionados con tus intereses. No te cierres a conocer personas nuevas, incluso si al principio no parecen encajar en tu 'tipo' ideal. Una conversación estimulante podría ser el inicio de algo especial. Mantén una actitud abierta y analítica, pero permite también que tu corazón te guíe.",
  "money": "En cuanto a finanzas y carrera, Virgo, tu disciplina y enfoque serán recompensados. Es una semana favorable para organizar tus finanzas, revisar presupuestos y planificar inversiones a futuro. Podrían presentarse oportunidades para demostrar tus habilidades en el trabajo, especialmente aquellas que involucren análisis, optimización de procesos o resolución de problemas complejos. \n\n No obstante, evita la parálisis por análisis. A veces, es necesario tomar decisiones calculadas pero oportunas. Si estás considerando un nuevo proyecto o una inversión, investiga a fondo pero no demores la acción indefinidamente si los indicadores son positivos. La colaboración con colegas podría abrir puertas a nuevas fuentes de ingreso o a proyectos más ambiciosos.",
  "health": "Tu bienestar, Virgo, se beneficiará de rutinas equilibradas y atención a las señales de tu cuerpo. Esta semana, intenta establecer horarios regulares para tus comidas y descanso. La actividad física moderada, como caminar o practicar yoga, te ayudará a liberar el estrés mental acumulado. \n\n Presta especial atención a tu sistema digestivo; opta por alimentos ligeros y nutritivos. Si te sientes abrumado por las responsabilidades, no dudes en tomarte pequeños descansos para reconectar contigo mismo. La meditación o ejercicios de respiración pueden ser herramientas muy útiles para mantener la calma y la claridad mental durante toda la semana."
}
Now generate the VERY DETAILED weekly horoscope for {{sign}} in {{locale}} for this week:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the MONTHLY horoscope for THIS CURRENT MONTH for the zodiac sign {{sign}} in the {{locale}} language.
Provide a VERY DETAILED, MULTI-PARAGRAPH, and insightful horoscope for each section (main, love, money, health).
For the 'main' section, provide a comprehensive overview for THE CURRENT MONTH. Start with a general theme for the month for {{sign}}. Then, divide the month into phases (e.g., first week, mid-month, end of month, or first half, second half) discussing how different energies might influence them. Touch upon themes like personal growth, home life, career aspirations, relationships, creativity, and how the sign's core traits interact with these monthly energies. The style should be narrative and elaborate, similar to: "{{sign}}, este mes entras en una larga etapa, que durará un año, y será apropiada para el comienzo de un nuevo periodo para todo lo relacionado con el hogar... Durante la primera mitad del mes convendrá aprovechar tu deseo de acción... En cambio, en la segunda mitad del mes, esa misma energía se volverá más precisa..."
For 'love', 'money', and 'health', provide specific, elaborate insights, advice, and potential developments for the ENTIRE MONTH. These sections should also be multi-paragraph and very detailed.
The output must be a JSON object with the following keys: "main", "love", "money", "health". All string values should be rich, long, and contain multiple paragraphs.

Example for {{sign}} (Capricorn) in {{locale}} (es) - THIS IS JUST A STRUCTURE EXAMPLE, MAKE THE ACTUAL CONTENT MUCH MORE DETAILED AND LONGER:
{
  "main": "Capricornio, este mes marca el inicio de una fase significativa que podría extenderse a lo largo del año, especialmente influyente en tu vida hogareña y familiar. Es un tiempo propicio para reevaluar tus bases, fortalecer lazos con seres queridos y quizás embarcarte en proyectos de mejora en el hogar, ya sea renovando espacios o simplemente creando un ambiente más armonioso y funcional. Podrías descubrir nuevas facetas de tu historia familiar o encontrar inspiración en tus raíces para construir un futuro más sólido.\n\nDurante la primera quincena del mes, sentirás un impulso de energía conquistadora y autoafirmativa. Es un momento ideal para expresar tus ideas con convicción, tomar la iniciativa en proyectos que te apasionan y no temer dar pasos audaces donde antes dudabas. Esta oleada de dinamismo te permitirá avanzar con determinación. \n\nNo obstante, la segunda mitad del mes te invitará a canalizar esa energía de una forma más meticulosa y estratégica. Será un período excelente para la organización, el perfeccionamiento de métodos de trabajo y el desarrollo de la constancia. Las estrellas te animan a actuar con inteligencia práctica, prestando minuciosa atención a los detalles y discerniendo cuándo es el momento de intervenir activamente y cuándo es más sabio permitir que las situaciones evolucionen por sí mismas. Busca el equilibrio entre la acción decidida y la paciencia estratégica.",
  "love": "En el terreno sentimental, Capricornio, este mes trae una mezcla de introspección y oportunidades para la conexión. Si tienes pareja, las primeras semanas son ideales para fortalecer la comunicación y trabajar juntos en metas comunes, quizás relacionadas con el hogar o planes a largo plazo. La honestidad y el apoyo mutuo serán cruciales. \n\nPara los Capricornio solteros, la primera mitad del mes podría traer encuentros a través de círculos sociales o actividades grupales. Sin embargo, es hacia la segunda mitad del mes cuando las conexiones podrían volverse más profundas y significativas. Busca a alguien que comparta tus valores y tu visión de futuro. No te precipites; la paciencia te permitirá discernir mejor las intenciones y la compatibilidad real. Este mes, el amor se construye sobre cimientos sólidos y entendimiento mutuo.",
  "money": "Profesional y financieramente, Capricornio, este mes se perfila con oportunidades de crecimiento, pero requerirá planificación y esfuerzo sostenido. Durante las primeras semanas, tu ambición estará en alza. Es un buen momento para presentar propuestas, buscar ascensos o iniciar proyectos que requieran liderazgo y visión. \n\nLa segunda mitad del mes favorece la consolidación y la atención al detalle en tus finanzas. Revisa tus presupuestos, estrategias de ahorro e inversión. Podrían surgir oportunidades para mejorar tu eficiencia laboral o para aprender nuevas habilidades que incrementen tu valor en el mercado. Evita gastos impulsivos y enfócate en la seguridad financiera a largo plazo. La disciplina característica de tu signo será tu mayor activo.",
  "health": "Tu bienestar, Capricornio, dependerá de encontrar un equilibrio entre tus responsabilidades y el autocuidado. Este mes, con el énfasis en el hogar y la carrera, es crucial que no descuides tu salud física y mental. Durante la primera parte del mes, canaliza tu energía en actividades físicas que disfrutes, como el senderismo o deportes que te desafíen. \n\nEn la segunda mitad, prioriza el descanso y las rutinas que te ayuden a gestionar el estrés. Prácticas como la meditación o el yoga pueden ser muy beneficiosas. Presta atención a tu estructura ósea y articulaciones; asegúrate de mantener una buena postura y considera ejercicios de fortalecimiento. Una dieta equilibrada y nutritiva te proporcionará la energía necesaria para afrontar tus desafíos."
}
Now generate the VERY DETAILED monthly horoscope for {{sign}} in {{locale}} for this month:
`,
});


async function getDailyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const dateStr = formatDateForDailyCache(currentDate);
  const cacheKey = `daily-${input.sign}-${input.locale}-${dateStr}`;

  if (dailyCache.has(cacheKey)) {
    return dailyCache.get(cacheKey)!;
  }
  const {output} = await dailyHoroscopePrompt(input);
  if (!output?.main || !output?.love || !output?.money || !output?.health) {
    throw new Error('Failed to generate complete daily horoscope details from AI.');
  }
  dailyCache.set(cacheKey, output);
  return output;
}

async function getWeeklyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const weekStr = formatDateForWeeklyCache(currentDate);
  const cacheKey = `weekly-${input.sign}-${input.locale}-${weekStr}`;

  if (weeklyCache.has(cacheKey)) {
    return weeklyCache.get(cacheKey)!;
  }
  const {output} = await weeklyHoroscopePrompt(input);
   if (!output?.main || !output?.love || !output?.money || !output?.health) {
    throw new Error('Failed to generate complete weekly horoscope details from AI.');
  }
  weeklyCache.set(cacheKey, output);
  return output;
}

async function getMonthlyHoroscopeDetails(input: HoroscopeFlowInput, currentDate: Date): Promise<HoroscopeDetail> {
  const monthStr = formatDateForMonthlyCache(currentDate);
  const cacheKey = `monthly-${input.sign}-${input.locale}-${monthStr}`;

  if (monthlyCache.has(cacheKey)) {
    return monthlyCache.get(cacheKey)!;
  }
  const {output} = await monthlyHoroscopePrompt(input);
  if (!output?.main || !output?.love || !output?.money || !output?.health) {
    throw new Error('Failed to generate complete monthly horoscope details from AI.');
  }
  monthlyCache.set(cacheKey, output);
  return output;
}

const horoscopeFlow = ai.defineFlow(
  {
    name: 'horoscopeFlow',
    inputSchema: HoroscopeFlowInputSchema,
    outputSchema: HoroscopeFlowOutputSchema,
  },
  async (input) => {
    const currentDate = new Date(); // Use current date for determining cache periods

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

