'use server';
/**
 * @fileOverview A Genkit flow to generate detailed explanations for a natal chart.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

import { natalChartImageFlow, NatalChartImageOutput } from './natal-chart-image-flow';
const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's exact birth time (HH:mm)."),
  birthCity: z.string().describe("The user's birth city."),
  birthCountry: z.string().describe("The user's birth country."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// 🆕 Extend output schema to include image data
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
  imageUrl: z.string().optional().describe('URL or data URL of the generated natal chart image.'),
});
export type NatalChartOutput = z.infer<typeof NatalChartOutputSchema>;

// Schema passed to the prompt
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({ // This schema is for the text generation prompt specifically.
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
});

const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: { schema: NatalChartPromptInputSchema },
  output: { schema: NatalChartOutputSchema.omit({ planetPositions: true, imageUrl: true }) }, // Exclude planetPositions and imageUrl from text prompt output
  prompt: `You are an expert astrologer... (prompt remains the same as before)`
});

const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal', // This is the internal flow definition
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

    const [{ output: textExplanations }, { output: imageResult }] = await Promise.all([
      natalChartPrompt(promptInput),
      natalChartImageFlow(input), // Call the image generation flow in parallel
    ]);

    if (!textExplanations) {
      throw new Error('Natal chart expert provided no explanations.');
    }

    // Return explanations, planet positions, and image URL
    return {
      ...textExplanations,
      planetPositions: chartData, // Still using mock data for the wheel
      imageUrl: imageResult?.imageUrl, // Include the image URL from the image flow
    };
}
);

// Exported flow
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input); // Call the internal flow
}
