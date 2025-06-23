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
import { getSunSignFromDate, ZODIAC_SIGNS } from '@/lib/constants'; // Import helpers

// Input schema remains the same
const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's exact birth time (HH:mm)."),
  birthCity: z.string().describe("The user's birth city."),
  birthCountry: z.string().describe("The user's birth country."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// Output schema remains the same
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

// Schema for AI prompt remains the same
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
});

// AI prompt definition remains the same
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

// Internal flow - This is where the logic changes
const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal',
    inputSchema: NatalChartInputSchema,
    outputSchema: NatalChartOutputSchema,
  },
  async (input) => {
    // Parse user's birth data
    const birthDateObj = new Date(input.birthDate + 'T' + input.birthTime);
    const [birthHour] = input.birthTime.split(':').map(Number);

    // --- Dynamic Sign Calculation (Simplified) ---
    // Sun sign is accurate
    const sunSign = getSunSignFromDate(birthDateObj)?.name || 'Leo';
    
    // Moon and Ascendant are pseudo-random but based on user input for a dynamic feel
    // This is NOT astrologically correct but avoids using a complex library
    const moonSign = ZODIAC_SIGNS[(birthDateObj.getDate() - 1) % 12].name;
    const ascendantSign = ZODIAC_SIGNS[birthHour % 12].name;

    // --- Dynamic Planet Positions for the Chart Wheel (Simplified & Deterministic) ---
    // These positions will look varied and are consistent with the text.
    const chartData = {
      sun: { sign: sunSign, degree: 15 + ((birthDateObj.getMonth() * 30 + birthDateObj.getDate()) % 360) },
      moon: { sign: moonSign, degree: (birthDateObj.getDate() * 12) % 360 },
      ascendant: { sign: ascendantSign, degree: (birthHour * 15) % 360 },
      mercury: { sign: ZODIAC_SIGNS[(birthDateObj.getMonth() + 1) % 12].name, degree: (birthDateObj.getDate() * 5) % 360 },
      venus: { sign: ZODIAC_SIGNS[(birthDateObj.getMonth() + 2) % 12].name, degree: (birthDateObj.getDate() * 15) % 360 },
      mars: { sign: ZODIAC_SIGNS[(birthDateObj.getDate() + 3) % 12].name, degree: (birthDateObj.getDate() * 20) % 360 },
      jupiter: { sign: ZODIAC_SIGNS[(birthDateObj.getFullYear()) % 12].name, degree: (birthDateObj.getMonth() * 30) % 360 },
      saturn: { sign: ZODIAC_SIGNS[(birthDateObj.getFullYear() + 2) % 12].name, degree: (birthDateObj.getMonth() * 12) % 360 },
    };

    const promptInput = {
      ...input,
      sunSign: sunSign,
      moonSign: moonSign,
      ascendantSign: ascendantSign,
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
