
'use server';
/**
 * @fileOverview A Genkit flow to simulate a crystal ball providing mystical answers.
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
});
export type CrystalBallInput = z.infer<typeof CrystalBallInputSchema>;

const CrystalBallOutputSchema = z.object({
  answer: z.string().describe('The mystical, enigmatic answer from the crystal ball. It should be short and oracular in tone.'),
});
export type CrystalBallOutput = z.infer<typeof CrystalBallOutputSchema>;

const crystalBallPrompt = ai.definePrompt({
  name: 'crystalBallPrompt',
  input: {schema: CrystalBallInputSchema},
  output: {schema: CrystalBallOutputSchema},
  prompt: `You are a mystical Crystal Ball. The user will ask you a question.
Respond in the {{locale}} language.
Your answers should be short (1-3 sentences), enigmatic, somewhat vague, and have a mystical or oracular tone.
Do not provide concrete advice or factual information. Instead, offer cryptic insights, reflections, or ponderings related to the question's theme.
The user's question is: "{{question}}"
Provide only the answer text.
Example for question "Will I find true love?":
{
  "answer": "The mists swirl, revealing intertwined paths. Patience and an open heart may illuminate the way when the stars align."
}
Example for question "Should I change my job?":
{
  "answer": "A crossroads appears in the shimmering depths. The winds of change whisper, but only your spirit knows the true direction."
}
Now, answer the user's question: "{{question}}"
`,
});

const crystalBallFlowInternal = ai.defineFlow(
  {
    name: 'crystalBallFlowInternal',
    inputSchema: CrystalBallInputSchema,
    outputSchema: CrystalBallOutputSchema,
  },
  async (input) => {
    const {output} = await crystalBallPrompt(input);
    if (!output) {
      throw new Error('Crystal ball provided no answer.');
    }
    return output;
  }
);

export async function crystalBallFlow(input: CrystalBallInput): Promise<CrystalBallOutput> {
  return crystalBallFlowInternal(input);
}
