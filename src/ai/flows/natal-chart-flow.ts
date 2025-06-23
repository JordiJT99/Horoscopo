'use server';
/**
 * @fileOverview A Genkit flow to generate detailed explanations for a natal chart.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's exact birth time (HH:mm)."),
  birthCity: z.string().describe("The user's birth city."),
  birthCountry: z.string().describe("The user's birth country."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// 🆕 Extend output schema to include planet positions
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

// Schema passed to the prompt
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
});

const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: { schema: NatalChartPromptInputSchema },
  output: { schema: NatalChartOutputSchema.omit({ planetPositions: true }) },
  prompt: `You are an expert astrologer... (prompt remains the same as before)`
});

const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal',
    inputSchema: NatalChartInputSchema,
    outputSchema: NatalChartOutputSchema,
  },
  async (input) => {
    // 🪐 MOCK planet positions (replace later with real calculations)
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

    // 📤 Prepare prompt input
    const promptInput = {
      ...input,
      sunSign: chartData.sun.sign,
      moonSign: chartData.moon.sign,
      ascendantSign: chartData.ascendant.sign,
    };

    const { output } = await natalChartPrompt(promptInput);

    if (!output) {
      throw new Error('Natal chart expert provided no explanations.');
    }

    // 📦 Return explanations + planet positions
    return {
      ...output,
      planetPositions: chartData,
    };
  }
);

// Exported flow
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
