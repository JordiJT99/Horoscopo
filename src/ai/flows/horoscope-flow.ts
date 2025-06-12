
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
  main: z.string().describe('A detailed general horoscope for the period, touching upon the sign\'s core traits and how current energies affect them. This should be an elaborate text, like: "If something stands out about these natives, it is their impulsiveness, not in vain are they a fire sign, dominated by Mars, and their nature is fiery and dynamic. They do not usually wait for events, they rush into them and of course, they are impatient, which often leads them to make decisions too quickly. They are optimistic and sincere and value friendship as a sacred good."'),
  love: z.string().describe('Elaborate insights and advice for love and relationships for the period. Provide specific scenarios or feelings.'),
  money: z.string().describe('Comprehensive insights and advice for finances and career for the period. Discuss potential opportunities or challenges.'),
  health: z.string().describe('Detailed insights and advice for health and well-being for the period. Suggest activities or precautions.'),
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
For the 'main' section, delve into the general characteristics of the sign and how current energies might influence them, similar to the style: "Si algo resalta de estos nativos es su impulsividad, no en balde son un signo de fuego, dominado por Marte, y su naturaleza es fogosa y dinámica. No suele esperar los acontecimientos, se precipita sobre ellos y claro, es impaciente, lo que muchas veces le lleva a tomar decisiones demasiado rápidas. Es optimista y sincero y valora la amistad como un bien sagrado."
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
Provide a detailed and insightful horoscope.
For the 'main' section, delve into the general characteristics of the sign and how the energies of the week might influence them, similar to the style: "Si algo resalta de estos nativos es su impulsividad...".
For 'love', 'money', and 'health', provide specific, elaborate insights and advice for the week.
The output must be a JSON object with the following keys: "main", "love", "money", "health".

Example for {{sign}} (Taurus) in {{locale}} (es):
{
  "main": "Tauro, esta semana te invita a conectar con tu naturaleza paciente y tu amor por la estabilidad. Eres conocido por tu perseverancia y tu aprecio por las cosas buenas de la vida. Las energías de la semana favorecen la consolidación de proyectos y la búsqueda de confort. Sin embargo, podrías sentir una tensión entre tu deseo de seguridad y una llamada interna a explorar nuevos placeres o inversiones. Es un buen momento para disfrutar de los frutos de tu trabajo, pero también para considerar cómo puedes expandir tus horizontes de forma mesurada.",
  "love": "En el amor, la semana se presenta ideal para profundizar la conexión con tu pareja a través de gestos de cariño y momentos de calidad. Si estás soltero, tu natural sensualidad atraerá, pero evita precipitarte; busca conexiones genuinas y estables. La comunicación honesta sobre tus necesidades emocionales será clave.",
  "money": "En cuanto a finanzas y carrera, es una semana para la planificación a largo plazo más que para movimientos arriesgados. Tu enfoque práctico te servirá bien. Podrías recibir reconocimiento por tu esfuerzo constante o encontrar una oportunidad para invertir en algo tangible y seguro. Evita gastos impulsivos en lujos innecesarios.",
  "health": "Para tu bienestar, esta semana enfócate en rutinas que nutran tanto tu cuerpo como tu espíritu. Actividades como la jardinería, cocinar comidas elaboradas o disfrutar de la naturaleza te recargarán. Presta atención a tu cuello y garganta, áreas sensibles para ti, y considera masajes o ejercicios de relajación."
}
Now generate the weekly horoscope for {{sign}} in {{locale}} for this week:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: HoroscopeDetailSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the MONTHLY horoscope for THIS CURRENT MONTH for the zodiac sign {{sign}} in the {{locale}} language.
Provide a detailed and insightful horoscope.
For the 'main' section, delve into the general characteristics of the sign and how the energies of the month might influence them, similar to the style: "Si algo resalta de estos nativos es su impulsividad...".
For 'love', 'money', and 'health', provide specific, elaborate insights and advice for the month.
The output must be a JSON object with the following keys: "main", "love", "money", "health".

Example for {{sign}} (Gemini) in {{locale}} (es):
{
  "main": "Géminis, este mes tu curiosidad innata y tu versatilidad estarán en su apogeo. Regido por Mercurio, tu mente ágil busca constantemente nueva información y conexiones. El mes favorece el aprendizaje, la comunicación y la expansión de tus redes sociales. Sin embargo, tu tendencia a dispersarte podría ser un desafío; enfócate en canalizar tu energía mental hacia proyectos concretos. Las oportunidades para viajes cortos o para iniciar nuevos estudios podrían presentarse.",
  "love": "En el ámbito amoroso, tu encanto y habilidad para conversar te abrirán muchas puertas. Si tienes pareja, es un mes excelente para planificar actividades novedosas juntos y reavivar la chispa intelectual. Los Géminis solteros disfrutarán de una vida social activa, con múltiples oportunidades para conocer gente interesante. Busca a alguien que estimule tu mente tanto como tu corazón.",
  "money": "Profesionalmente, este mes es ideal para el networking, las presentaciones y cualquier actividad que requiera tus habilidades comunicativas. Podrías destacar en proyectos colaborativos o encontrar nuevas vías de ingreso a través de tus contactos. Financieramente, mantén un ojo en tus gastos, ya que tu entusiasmo podría llevarte a compras impulsivas. Considera diversificar tus fuentes de conocimiento financiero.",
  "health": "Tu salud este mes se beneficia de actividades que mantengan tu mente activa y tu cuerpo en movimiento ligero. Prueba nuevas clases de ejercicio, dedica tiempo a la lectura o aprende una nueva habilidad. Es importante que encuentres formas de calmar tu mente inquieta, como la meditación o paseos por la naturaleza, para evitar el estrés mental. Cuida tus manos y sistema respiratorio."
}
Now generate the monthly horoscope for {{sign}} in {{locale}} for this month:
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
