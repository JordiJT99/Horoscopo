
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
import { format, getISOWeekYear, getYear, getMonth } from 'date-fns';

// Helper to create a Zod enum from the ZodiacSignName type values
const zodSignEnum = z.enum(ALL_SIGN_NAMES as [string, ...string[]]);

const HoroscopeFlowInputSchema = z.object({
  sign: zodSignEnum.describe('The zodiac sign for which to generate the horoscope.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the horoscope language.'),
});
export type HoroscopeFlowInput = z.infer<typeof HoroscopeFlowInputSchema>;

const HoroscopeFlowOutputSchema = z.object({
  daily: z.string().describe('The daily horoscope text.'),
  weekly: z.string().describe('The weekly horoscope text.'),
  monthly: z.string().describe('The monthly horoscope text.'),
});
export type HoroscopeFlowOutput = z.infer<typeof HoroscopeFlowOutputSchema>;

// In-memory caches
const dailyCache = new Map<string, string>();
const weeklyCache = new Map<string, string>();
const monthlyCache = new Map<string, string>();

// Helper to format date for daily cache key (YYYY-MM-DD)
const formatDateForDailyCache = (date: Date): string => format(date, 'yyyy-MM-dd');

// Helper to format date for weekly cache key (YYYY-WW, ISO week)
const formatDateForWeeklyCache = (date: Date): string => `${getISOWeekYear(date)}-W${format(date, 'II')}`;

// Helper to format date for monthly cache key (YYYY-MM)
const formatDateForMonthlyCache = (date: Date): string => format(date, 'yyyy-MM');


// Schema for individual period horoscope prompts
const PeriodHoroscopeOutputSchema = z.object({
  horoscopeText: z.string().describe('The horoscope text for the requested period.'),
});

// Daily Horoscope Prompt
const dailyHoroscopePrompt = ai.definePrompt({
  name: 'dailyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: PeriodHoroscopeOutputSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the DAILY horoscope for TODAY for the zodiac sign {{sign}} in the {{locale}} language.
Focus on current energies and opportunities for the day.
The output must be a JSON object with a single key "horoscopeText" containing the daily horoscope.
Example for {{sign}} (Aries) in {{locale}} (en):
{
  "horoscopeText": "Aries, today your energy is boundless! Tackle that project you've been postponing. Opportunities for quick wins are high."
}
Now generate the daily horoscope for {{sign}} in {{locale}} for today:
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: PeriodHoroscopeOutputSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the WEEKLY horoscope for THIS CURRENT WEEK for the zodiac sign {{sign}} in the {{locale}} language.
Focus on the broader themes and challenges for the entire week.
The output must be a JSON object with a single key "horoscopeText" containing the weekly horoscope.
Example for {{sign}} (Aries) in {{locale}} (en):
{
  "horoscopeText": "This week, Aries, communication is key. Express your ideas clearly to avoid misunderstandings. A new connection could prove beneficial."
}
Now generate the weekly horoscope for {{sign}} in {{locale}} for this week:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: HoroscopeFlowInputSchema },
  output: { schema: PeriodHoroscopeOutputSchema },
  prompt: `You are a skilled astrologer. Generate ONLY the MONTHLY horoscope for THIS CURRENT MONTH for the zodiac sign {{sign}} in the {{locale}} language.
Focus on long-term trends, career, and personal development for the month.
The output must be a JSON object with a single key "horoscopeText" containing the monthly horoscope.
Example for {{sign}} (Aries) in {{locale}} (en):
{
  "horoscopeText": "Aries, the upcoming month focuses on career advancements. Stay diligent and proactive. Financial stability looks promising towards the end of the month."
}
Now generate the monthly horoscope for {{sign}} in {{locale}} for this month:
`,
});


async function getDailyHoroscopeText(input: HoroscopeFlowInput, currentDate: Date): Promise<string> {
  const dateStr = formatDateForDailyCache(currentDate);
  const cacheKey = `daily-${input.sign}-${input.locale}-${dateStr}`;

  if (dailyCache.has(cacheKey)) {
    // console.log(`[Cache HIT] Daily: ${cacheKey}`);
    return dailyCache.get(cacheKey)!;
  }
  // console.log(`[Cache MISS] Daily: ${cacheKey}. Generating...`);
  const {output} = await dailyHoroscopePrompt(input);
  if (!output?.horoscopeText) {
    throw new Error('Failed to generate daily horoscope from AI.');
  }
  dailyCache.set(cacheKey, output.horoscopeText);
  return output.horoscopeText;
}

async function getWeeklyHoroscopeText(input: HoroscopeFlowInput, currentDate: Date): Promise<string> {
  const weekStr = formatDateForWeeklyCache(currentDate);
  const cacheKey = `weekly-${input.sign}-${input.locale}-${weekStr}`;

  if (weeklyCache.has(cacheKey)) {
    // console.log(`[Cache HIT] Weekly: ${cacheKey}`);
    return weeklyCache.get(cacheKey)!;
  }
  // console.log(`[Cache MISS] Weekly: ${cacheKey}. Generating...`);
  const {output} = await weeklyHoroscopePrompt(input);
   if (!output?.horoscopeText) {
    throw new Error('Failed to generate weekly horoscope from AI.');
  }
  weeklyCache.set(cacheKey, output.horoscopeText);
  return output.horoscopeText;
}

async function getMonthlyHoroscopeText(input: HoroscopeFlowInput, currentDate: Date): Promise<string> {
  const monthStr = formatDateForMonthlyCache(currentDate);
  const cacheKey = `monthly-${input.sign}-${input.locale}-${monthStr}`;

  if (monthlyCache.has(cacheKey)) {
    // console.log(`[Cache HIT] Monthly: ${cacheKey}`);
    return monthlyCache.get(cacheKey)!;
  }
  // console.log(`[Cache MISS] Monthly: ${cacheKey}. Generating...`);
  const {output} = await monthlyHoroscopePrompt(input);
  if (!output?.horoscopeText) {
    throw new Error('Failed to generate monthly horoscope from AI.');
  }
  monthlyCache.set(cacheKey, output.horoscopeText);
  return output.horoscopeText;
}

const horoscopeFlow = ai.defineFlow(
  {
    name: 'horoscopeFlow',
    inputSchema: HoroscopeFlowInputSchema,
    outputSchema: HoroscopeFlowOutputSchema,
  },
  async (input) => {
    const currentDate = new Date(); // Use current date for determining cache periods

    const [dailyText, weeklyText, monthlyText] = await Promise.all([
      getDailyHoroscopeText(input, currentDate),
      getWeeklyHoroscopeText(input, currentDate),
      getMonthlyHoroscopeText(input, currentDate),
    ]);

    return {
      daily: dailyText,
      weekly: weeklyText,
      monthly: monthlyText,
    };
  }
);

// Exported function that client components will call
export async function getHoroscopeFlow(input: HoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  return horoscopeFlow(input);
}
