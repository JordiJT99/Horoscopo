
'use server';
/**
 * @fileOverview A Genkit flow to interpret user-described dreams.
 *
 * - dreamInterpretationFlow - A function that calls the dream interpretation flow.
 * - DreamInterpretationInput - The input type for the dreamInterpretationFlow function.
 * - DreamInterpretationOutput - The return type for the dreamInterpretationFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DreamInterpretationInputSchema = z.object({
  dreamDescription: z.string().describe('A detailed description of the dream provided by the user.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the interpretation language.'),
});
export type DreamInterpretationInput = z.infer<typeof DreamInterpretationInputSchema>;

const DreamInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('A thoughtful and insightful interpretation of the dream, analyzing symbols, emotions, and events. It should be multi-paragraph and detailed if the dream description allows.'),
});
export type DreamInterpretationOutput = z.infer<typeof DreamInterpretationOutputSchema>;

const dreamInterpretationPrompt = ai.definePrompt({
  name: 'dreamInterpretationPrompt',
  input: {schema: DreamInterpretationInputSchema},
  output: {schema: DreamInterpretationOutputSchema},
  prompt: `You are an expert dream interpreter with a deep understanding of symbolism and psychology.
The user will describe a dream they had. Respond in the {{locale}} language.
Analyze the symbols, emotions, characters, and events present in the dream.
Provide a thoughtful, insightful, and multi-paragraph interpretation.
Consider common dream symbolism (e.g., flying, falling, water, specific animals) but also encourage the user to reflect on their personal associations with the dream elements.
Structure your interpretation clearly. You can start with a general overview and then delve into specific symbols or themes.
Avoid definitive statements like "This dream means exactly X." Instead, use phrases like "This could suggest...", "It might represent...", "Consider how this relates to your waking life...".
The user's dream description is:
"{{dreamDescription}}"

Provide only the interpretation text as a JSON object with the key "interpretation".

Example for dream "I was flying over a city made of clouds. I felt free and joyful.":
{
  "interpretation": "Flying in dreams often symbolizes a sense of freedom, liberation, or a desire to rise above current challenges. The city made of clouds could represent a realm of imagination, spirituality, or aspirations that feel ethereal yet accessible to you at this moment. The feeling of joy and freedom is paramount here, suggesting that you may be experiencing a period of personal growth, expanded perspective, or release from previous constraints.\n\nConsider what 'freedom' means to you in your waking life. Are there areas where you are seeking more autonomy or a lighter perspective? The clouds, being transient and ever-changing, might also point towards the creative, a spiritual journey, or perhaps even an idea or project that feels inspiring but not yet fully grounded in reality. This dream could be an encouragement to embrace your imaginative side and explore new possibilities without being weighed down by earthly concerns."
}

Now, interpret the user's dream: "{{dreamDescription}}"
`,
});

const dreamInterpretationFlowInternal = ai.defineFlow(
  {
    name: 'dreamInterpretationFlowInternal',
    inputSchema: DreamInterpretationInputSchema,
    outputSchema: DreamInterpretationOutputSchema,
  },
  async (input) => {
    const {output} = await dreamInterpretationPrompt(input);
     if (!output) {
      throw new Error('Dream interpreter provided no interpretation.');
    }
    return output;
  }
);

export async function dreamInterpretationFlow(input: DreamInterpretationInput): Promise<DreamInterpretationOutput> {
  return dreamInterpretationFlowInternal(input);
}
