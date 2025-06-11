
'use server';
/**
 * @fileOverview A Genkit flow to generate horoscopes.
 *
 * - getHoroscopeFlow - A function that calls the horoscope generation flow.
 * - HoroscopeFlowInput - The input type for the getHoroscopeFlow function.
 * - HoroscopeFlowOutput - The return type for the getHoroscopeFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';

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

export async function getHoroscopeFlow(input: HoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  return horoscopeFlow(input);
}

const horoscopeFlowPrompt = ai.definePrompt({
  name: 'horoscopeFlowPrompt',
  input: {schema: HoroscopeFlowInputSchema},
  output: {schema: HoroscopeFlowOutputSchema},
  prompt: `You are a skilled astrologer. Generate a personalized horoscope for the zodiac sign {{sign}} in the {{locale}} language.
Provide predictions for daily, weekly, and monthly periods.
Ensure the tone is engaging, insightful, and positive.
The output must be a JSON object with three keys: "daily", "weekly", and "monthly", each containing the respective horoscope text.
Example for {{sign}} (Aries) in {{locale}} (en):
{
  "daily": "Aries, today your energy is boundless! Tackle that project you've been postponing. Opportunities for quick wins are high.",
  "weekly": "This week, Aries, communication is key. Express your ideas clearly to avoid misunderstandings. A new connection could prove beneficial.",
  "monthly": "Aries, the upcoming month focuses on career advancements. Stay diligent and proactive. Financial stability looks promising towards the end of the month."
}

Now generate the horoscope for {{sign}} in {{locale}}:
`,
});

const horoscopeFlow = ai.defineFlow(
  {
    name: 'horoscopeFlow',
    inputSchema: HoroscopeFlowInputSchema,
    outputSchema: HoroscopeFlowOutputSchema,
  },
  async (input) => {
    const {output} = await horoscopeFlowPrompt(input);
    if (!output) {
      throw new Error('Failed to generate horoscope from AI.');
    }
    return output;
  }
);

