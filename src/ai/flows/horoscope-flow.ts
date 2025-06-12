
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
  main: z.string().describe('The general horoscope text for the period.'),
  love: z.string().describe('Specific insights for love and relationships for the period.'),
  money: z.string().describe('Specific insights for finances and career for the period.'),
  health: z.string().describe('Specific insights for health and well-being for the period.'),
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
Focus on current energies and opportunities for the day.
The output must be a JSON object with the following keys:
- "main": The general daily horoscope.
- "love": Specific insights for love and relationships today.
- "money": Specific insights for finances and career today.
- "health": Specific insights for health and well-being today.

Example for {{sign}} (Aries) in {{locale}} (en):
{
  "main": "Aries, today your energy is boundless! Tackle that project you've been postponing. Opportunities for quick wins are high.",
  "love": "In love, a direct approach could clear up misunderstandings. Be bold.",
  "money": "Financially, an unexpected expense might arise, but a new income stream looks promising.",
  "health": "Your physical energy is high, perfect for starting a new fitness routine."
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
Focus on the broader themes and challenges for the entire week.
The output must be a JSON object with the following keys:
- "main": The general weekly horoscope.
- "love": Specific insights for love and relationships this week.
- "money": Specific insights for finances and career this week.
- "health": Specific insights for health and well-being this week.

Example for {{sign}} (Aries) in {{locale}} (en):
{
  "main": "This week, Aries, communication is key. Express your ideas clearly to avoid misunderstandings. A new connection could prove beneficial.",
  "love": "Romantic opportunities may arise mid-week. Be open to new encounters.",
  "money": "Focus on long-term financial planning. Avoid impulsive spending.",
  "health": "Prioritize rest and mental well-being this week to avoid burnout."
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
Focus on long-term trends, career, and personal development for the month.
The output must be a JSON object with the following keys:
- "main": The general monthly horoscope.
- "love": Specific insights for love and relationships this month.
- "money": Specific insights for finances and career this month.
- "health": Specific insights for health and well-being this month.

Example for {{sign}} (Aries) in {{locale}} (en):
{
  "main": "Aries, the upcoming month focuses on career advancements. Stay diligent and proactive. Financial stability looks promising towards the end of the month.",
  "love": "Deepen existing bonds or, if single, you might meet someone significant. Emotional honesty is crucial.",
  "money": "This is a good month for investments and exploring new financial ventures. Review your budget.",
  "health": "Maintain a balanced lifestyle. Pay attention to your diet and incorporate stress-relief activities."
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
