'use server';
/**
 * @fileOverview A Genkit flow to provide text explanations for a natal chart.
 *
 * - natalChartFlow - A function that handles natal chart text generation.
 * - NatalChartInput - The input type for the natalChartFlow function.
 * - NatalChartOutput - The return type for the natalChartFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema
const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's exact birth time (HH:mm)."),
  birthCity: z.string().describe("The user's birth city."),
  birthCountry: z.string().describe("The user's birth country."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// Output schema (NO LONGER INCLUDES image)
const NatalChartOutputSchema = z.object({
  sun: z.string(),
  moon: z.string(),
  ascendant: z.string(),
  personalPlanets: z.string(),
  transpersonalPlanets: z.string(),
  houses: z.string(),
  aspects: z.string(),
  planetPositions: z.record(
    z.object({
      sign: z.string(),
      degree: z.number(),
    })
  ).describe('Planet positions for rendering the zodiac wheel.'),
});
export type NatalChartOutput = z.infer<typeof NatalChartOutputSchema>;

// Schema for AI prompt
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
});

// AI prompt definition
const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: { schema: NatalChartPromptInputSchema },
  output: { schema: NatalChartOutputSchema.omit({ planetPositions: true }) },
  prompt: `You are an expert astrologer, a wise and eloquent teacher. Your task is to provide explanations for the core components of a natal chart.

The user will provide their birth information and specify a level of detail: 'basic', 'advanced', or 'spiritual'.
You must provide a clear and insightful explanation for EACH of the following 7 sections, tailored to the requested detail level and in the {{locale}} language.

SECTIONS TO EXPLAIN:
1. The Sun
2. The Moon
3. The Ascendant
4. Personal Planets (Mercury, Venus, Mars)
5. Transpersonal Planets (Jupiter, Saturn, Uranus, Neptune, Pluto)
6. The Astrological Houses (General explanation)
7. Important Aspects (Conjunction, Opposition, Trine, Square, Sextile)

Use the user's calculated Sun, Moon, and Ascendant signs to personalize the explanations for sections 1, 2, and 3.

Now, generate the complete JSON object with explanations for all 7 sections.`
});

// Internal flow
const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal',
    inputSchema: NatalChartInputSchema,
    outputSchema: NatalChartOutputSchema,
  },
  async (input) => {
    // MOCK planet positions (replace with actual calculation in future)
    const chartData = {
      sun: { sign: 'Leo', degree: 123.5 },
      moon: { sign: 'Taurus', degree: 45.2 },
      ascendant: { sign: 'Scorpio', degree: 210.0 },
      mercury: { sign: 'Cancer', degree: 95.0 },
      venus: { sign: 'Gemini', degree: 72.3 },
      mars: { sign: 'Aries', degree: 15.0 },
      jupiter: { sign: 'Pisces', degree: 330.5 },
      saturn: { sign: 'Capricorn', degree: 270.0 },
    };

    const promptInput = {
      ...input,
      sunSign: chartData.sun.sign,
      moonSign: chartData.moon.sign,
      ascendantSign: chartData.ascendant.sign,
    };

    const promptResult = await natalChartPrompt(promptInput);
    
    const textExplanations = promptResult.output;

    if (!textExplanations) {
      throw new Error('Natal chart expert provided no explanations.');
    }

    return {
      ...textExplanations,
      planetPositions: chartData,
    };
  }
);

// Exported function
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
