
'use server';
/**
 * @fileOverview A Genkit flow to simulate a crystal ball providing mystical answers
 * with different levels of precision.
 *
 * - crystalBallFlow - A function that calls the crystal ball answer generation flow.
 * - CrystalBallInput - The input type for the crystalBallFlow function.
 * - CrystalBallOutput - The return type for the crystalBallFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrystalBallInputSchema = z.object({
  question: z.string().describe('The question the user asks the crystal ball.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the answer language.'),
  precisionLevel: z.enum(['basic', 'deep', 'mystic']).default('basic').describe('The desired level of detail and style for the answer: "basic" for short, "deep" for more elaborate, "mystic" for elaborate with a historical/oracle quote.'),
});
export type CrystalBallInput = z.infer<typeof CrystalBallInputSchema>;

const CrystalBallOutputSchema = z.object({
  answer: z.string().describe('The mystical, enigmatic answer from the crystal ball. Its length and style depend on the precisionLevel.'),
});
export type CrystalBallOutput = z.infer<typeof CrystalBallOutputSchema>;

// Define a new input schema for the prompt that includes boolean flags
const PromptInputSchema = CrystalBallInputSchema.extend({
  isBasic: z.boolean(),
  isDeep: z.boolean(),
  isMystic: z.boolean(),
});
type PromptInput = z.infer<typeof PromptInputSchema>;


const crystalBallPrompt = ai.definePrompt({
  name: 'crystalBallPrompt',
  input: {schema: PromptInputSchema}, // Use the extended schema
  output: {schema: CrystalBallOutputSchema},
  prompt: `You are a mystical Crystal Ball. The user will ask you a question.
Respond in the {{locale}} language.
Your answers should have an oracular tone.
Do not provide concrete advice or factual information. Instead, offer cryptic insights, reflections, or ponderings related to the question's theme.

The user's question is: "{{question}}"

{{#if isBasic}}
Provide a SHORT and DIRECT mystical answer, 1-2 sentences.
Example for question "Will I find true love?":
{
  "answer": "The mists swirl, revealing intertwined paths. Patience may illuminate the way."
}
{{else if isDeep}}
Provide a MORE ELABORATE mystical answer, 3-4 sentences. Explore different facets or implications of the question.
Example for question "Will I find true love?":
{
  "answer": "The mists swirl, revealing intertwined paths, some bright, some shadowed. An open heart, like a beacon, may draw forth connection when the celestial tides are right. Seek not with desperate eyes, but with a spirit ready to embrace the unexpected."
}
{{else if isMystic}}
Provide a MYSTICAL answer, 3-4 sentences, and incorporate a wise saying or quote attributed to an ancient oracle or seer. This quote should be thematically relevant to the question.
Example for question "Will I find true love?":
{
  "answer": "The mists swirl, revealing intertwined paths. As the Oracle of Eldoria once whispered, 'Love's echo is found not in the seeking, but in the becoming.' Thus, cultivate your own garden, and the rarest of blooms may yet appear. The stars watch with knowing silence."
}
{{else}}
{{! Default to basic if no specific precisionLevel flag is true }}
Provide a SHORT and DIRECT mystical answer, 1-2 sentences.
Example for question "Will I find true love?":
{
  "answer": "The mists swirl, revealing intertwined paths. Patience may illuminate the way."
}
{{/if}}

Now, answer the user's question "{{question}}" with the style determined by the flags (isBasic: {{isBasic}}, isDeep: {{isDeep}}, isMystic: {{isMystic}}).
`,
});

const crystalBallFlowInternal = ai.defineFlow(
  {
    name: 'crystalBallFlowInternal',
    inputSchema: CrystalBallInputSchema,
    outputSchema: CrystalBallOutputSchema,
  },
  async (input) => {
    const promptInput: PromptInput = {
      ...input,
      isBasic: input.precisionLevel === 'basic',
      isDeep: input.precisionLevel === 'deep',
      isMystic: input.precisionLevel === 'mystic',
    };

    const {output} = await crystalBallPrompt(promptInput);
    if (!output) {
      throw new Error('Crystal ball provided no answer.');
    }
    return output;
  }
);

export async function crystalBallFlow(input: CrystalBallInput): Promise<CrystalBallOutput> {
  return crystalBallFlowInternal(input);
}

