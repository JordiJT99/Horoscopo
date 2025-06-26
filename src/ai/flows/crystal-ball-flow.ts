'use server';
/**
 * @fileOverview A Genkit flow to get a mystical revelation for the day from a crystal ball.
 *
 * - getCrystalBallRevelation - A function that calls the revelation generation flow.
 * - CrystalBallRevelationInput - The input type for the flow.
 * - CrystalBallRevelationOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrystalBallRevelationInputSchema = z.object({
  locale: z.string().describe('The locale (e.g., "en", "es") for the revelation language.'),
  userName: z.string().optional().describe('The name of the user, for a personalized revelation.'),
});
export type CrystalBallRevelationInput = z.infer<typeof CrystalBallRevelationInputSchema>;

const CrystalBallRevelationOutputSchema = z.object({
  revelation: z.string().describe('A mystical, poetic, and enigmatic revelation about the universe\'s energy for today. It should be 2-4 sentences long.'),
});
export type CrystalBallRevelationOutput = z.infer<typeof CrystalBallRevelationOutputSchema>;

const crystalBallPrompt = ai.definePrompt({
  name: 'crystalBallRevelationPrompt',
  input: {schema: CrystalBallRevelationInputSchema},
  output: {schema: CrystalBallRevelationOutputSchema},
  prompt: `You are a mystical Crystal Ball, an ancient oracle of glass and starlight.
You will provide a revelation about what the universe has in store for today for the user.
Respond in the {{locale}} language.

{{#if userName}}
**PERSONALIZATION:** The user's name is {{userName}}. Address them directly at the beginning of the revelation in a mystical but personal way. For example: "Para ti, {{userName}}, el orbe refleja...", "Hola {{userName}}, hoy los ecos de una estrella...", "Mira de cerca, {{userName}}...".
Your revelation should feel like a personal message for them.
{{else}}
Provide a general revelation about the day's energy.
{{/if}}

Your revelations must be:
- **Mystical and Poetic:** Use metaphors of starlight, shadows, echoes, flowing water, cosmic dust, etc. Frame it as what the universe has in store for the user today.
- **Enigmatic and Vague:** Do NOT give concrete advice, predictions, or direct answers. Offer cryptic insights and reflections on the day's energy as it pertains to the user.
- **Unique:** Vary your phrasing and imagery significantly in every response. Avoid repeating phrases like "The mists swirl" or "The orb reflects".
- **Short and Impactful:** The revelation should be between 2 and 4 sentences.

Example for locale 'es' and userName 'Alex':
{
  "revelation": "Para ti, Alex, el orbe refleja un camino que se bifurca en la niebla. No busques el mapa, sino la brújula en tu corazón. Un viejo recuerdo tiene la llave para la puerta que está por aparecer."
}

Example for locale 'en' without a user:
{
  "revelation": "The cosmic winds whisper a forgotten name today. Seek not answers in the noise, but in the silence between heartbeats. An old door creaks open, revealing not a path, but a question."
}

Now, provide a new, unique revelation for today in the {{locale}} language.
{{#if userName}}
Personalize it for {{userName}}.
{{/if}}
Ensure your response is a JSON object with a single key "revelation".
`,
});

const getCrystalBallRevelationFlow = ai.defineFlow(
  {
    name: 'getCrystalBallRevelationFlow',
    inputSchema: CrystalBallRevelationInputSchema,
    outputSchema: CrystalBallRevelationOutputSchema,
  },
  async (input) => {
    const {output} = await crystalBallPrompt(input);
    if (!output) {
      throw new Error('Crystal ball provided no revelation.');
    }
    return output;
  }
);

export async function getCrystalBallRevelation(input: CrystalBallRevelationInput): Promise<CrystalBallRevelationOutput> {
  return getCrystalBallRevelationFlow(input);
}
