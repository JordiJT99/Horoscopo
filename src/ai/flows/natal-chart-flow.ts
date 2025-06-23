
'use server';
/**
 * @fileOverview A Genkit flow to generate detailed explanations for a natal chart.
 *
 * - natalChartFlow - A function that calls the natal chart explanation flow.
 * - NatalChartInput - The input type for the flow.
 * - NatalChartOutput - The return type for the flow.
 */

// Removed 'astrology' import as the library is not installed.
// We will use mock data for the chart calculation.
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe('The user\'s birth date (YYYY-MM-DD).'),
  birthTime: z.string().describe('The user\'s exact birth time (HH:mm).'),
  birthCity: z.string().describe('The user\'s birth city.'),
  birthCountry: z.string().describe('The user\'s birth country.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// Placeholder for the natal chart data type.
type NatalChartData = {
  sun: string;
  moon: string;
  ascendant: string;
};

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

// New schema for the prompt input, including the calculated signs.
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string().describe("The user's calculated Sun sign."),
  moonSign: z.string().describe("The user's calculated Moon sign."),
  ascendantSign: z.string().describe("The user's calculated Ascendant sign."),
});


const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: {schema: NatalChartPromptInputSchema}, // Use the new extended schema
  output: {schema: NatalChartOutputSchema},
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

DETAIL LEVEL GUIDELINES:
- **If detailLevel is 'basic'**: Keep it simple and direct. Use 1-2 sentences per section. Focus on the core meaning (e.g., "The Sun is your ego", "The Moon is your emotions").
- **If detailLevel is 'advanced'**: Provide a more detailed, multi-sentence explanation. Use proper astrological terminology (e.g., "vital force", "unconscious patterns", "karmic patterns"). Explain the 'how' and 'why'.
- **If detailLevel is 'spiritual'**: Frame the explanation in a spiritual or soul-growth context. Talk about divine purpose, soul evolution, karmic lessons, and higher consciousness. Use inspiring and profound language.

You will be given the user's calculated Sun, Moon, and Ascendant signs. Use these to personalize the explanations for sections 1, 2, and 3. For the remaining sections (4-7), provide general explanations based on the detail level.

Example for the "The Sun" section at 'spiritual' level in 'en' for a specific sign:
{
  "sun": "The Sun represents the spiritual light within, your true essence, and the path towards fulfilling your soul's purpose. It's about aligning your conscious will with the divine spark, radiating your unique gifts, and embodying the highest expression of your divine self in this lifetime."
}
Example for the "The Sun" section at 'basic' level in 'es':
{
  "sun": "Tu signo Solar representa tu identidad central, tu ego y tu voluntad consciente. Es tu naturaleza fundamental y la forma en que brillas en el mundo."
}

The user's natal data is:
- Sun Sign: {{sunSign}}
- Moon Sign: {{moonSign}}
- Ascendant Sign: {{ascendantSign}}

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
    // **Step 1: Calculate Natal Chart Data (MOCK)**
    // This is a placeholder as a real astrology library is not available in the project.
    // In a real application, you would use a library to calculate this from birth data.
    // For now, we use mock data to demonstrate the flow's functionality.
    const chartData: NatalChartData = {
      sun: 'Leo',
      moon: 'Taurus',
      ascendant: 'Scorpio',
    };

    // **Step 2: Generate Explanations using the AI Model**
    const promptInput = {
      ...input,
      sunSign: chartData.sun,
      moonSign: chartData.moon,
      ascendantSign: chartData.ascendant,
    };
    
    const { output } = await natalChartPrompt(promptInput);

    if (!output) {
      throw new Error('Natal chart expert provided no explanations.');
    }
    return output;
  }
);

export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
