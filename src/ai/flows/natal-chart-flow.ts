
'use server';
/**
 * @fileOverview A Genkit flow to generate detailed explanations for a natal chart.
 *
 * - natalChartFlow - A function that calls the natal chart explanation flow.
 * - NatalChartInput - The input type for the flow.
 * - NatalChartOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

const NatalChartOutputSchema = z.object({
  sun: z.string().describe('Explanation for the Sun sign.'),
  moon: z.string().describe('Explanation for the Moon sign.'),
  ascendant: z.string().describe('Explanation for the Ascendant sign.'),
  personalPlanets: z.string().describe('Explanation for the personal planets (Mercury, Venus, Mars).'),
  transpersonalPlanets: z.string().describe('Explanation for the transpersonal planets (Jupiter, Saturn, Uranus, Neptune, Pluto).'),
  houses: z.string().describe('Explanation for the 12 astrological houses.'),
  aspects: z.string().describe('Explanation for the major astrological aspects.'),
});
export type NatalChartOutput = z.infer<typeof NatalChartOutputSchema>;

const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: {schema: NatalChartInputSchema},
  output: {schema: NatalChartOutputSchema},
  prompt: `You are an expert astrologer, a wise and eloquent teacher. Your task is to provide explanations for the core components of a natal chart.
The user will specify a level of detail: 'basic', 'advanced', or 'spiritual'.
You must provide a clear and insightful explanation for EACH of the following 7 sections, tailored to the requested detail level and in the {{locale}} language.

SECTIONS TO EXPLAIN:
1. The Sun
2. The Moon
3. The Ascendant
4. Personal Planets (Mercury, Venus, Mars)
5. Transpersonal Planets (Jupiter, Saturn, Uranus, Neptune, Pluto)
6. The Astrological Houses
7. Important Aspects (Conjunction, Opposition, Trine, Square, Sextile)

DETAIL LEVEL GUIDELINES:
- **If detailLevel is 'basic'**: Keep it simple and direct. Use 1-2 sentences per section. Focus on the core meaning (e.g., "The Sun is your ego", "The Moon is your emotions").
- **If detailLevel is 'advanced'**: Provide a more detailed, multi-sentence explanation. Use proper astrological terminology (e.g., "vital force", "unconscious patterns", "karmic patterns"). Explain the 'how' and 'why'.
- **If detailLevel is 'spiritual'**: Frame the explanation in a spiritual or soul-growth context. Talk about divine purpose, soul evolution, karmic lessons, and higher consciousness. Use inspiring and profound language.

Example for the "The Sun" section at 'spiritual' level in 'en':
{
  "sun": "The Sun represents the spiritual light within, your true essence, and the path towards fulfilling your soul's purpose. It's about aligning your conscious will with the divine spark, radiating your unique gifts, and embodying the highest expression of your divine self in this lifetime."
}
Example for the "The Sun" section at 'basic' level in 'es':
{
  "sun": "Tu signo Solar representa tu identidad central, tu ego y tu voluntad consciente. Es tu naturaleza fundamental y la forma en que brillas en el mundo."
}


Now, generate the complete JSON object with explanations for all 7 sections based on the user's request:
- Language: {{locale}}
- Detail Level: {{detailLevel}}

Ensure your response is a single, valid JSON object containing all 7 keys: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "houses", "aspects".
`,
});

const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal',
    inputSchema: NatalChartInputSchema,
    outputSchema: NatalChartOutputSchema,
  },
  async (input) => {
    const {output} = await natalChartPrompt(input);
    if (!output) {
      throw new Error('Natal chart expert provided no explanations.');
    }
    return output;
  }
);

export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
