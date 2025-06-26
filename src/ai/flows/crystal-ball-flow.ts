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
You will provide a revelation about what the universe has in store for today.
Respond in the {{locale}} language.

Your revelations must be:
- **Mystical and Poetic:** Use metaphors of starlight, shadows, echoes, flowing water, cosmic dust, etc.
- **Enigmatic and Vague:** Do NOT give concrete advice, predictions, or direct answers. Offer cryptic insights and reflections on the day's energy.
- **Unique:** Vary your phrasing and imagery significantly in every response. Avoid repeating phrases like "The mists swirl" or "The orb reflects".
- **Short and Impactful:** The revelation should be between 2 and 4 sentences.

Example for locale 'es':
{
  "revelation": "Los hilos del destino tiemblan con una nueva melodía hoy. Escucha no con tus oídos, sino con el pulso de tu espíritu. Lo que fue sembrado en la sombra busca ahora un resquicio de luz."
}

Example for locale 'en':
{
  "revelation": "The cosmic winds whisper a forgotten name today. Seek not answers in the noise, but in the silence between heartbeats. An old door creaks open, revealing not a path, but a question."
}

Example for locale 'fr':
{
  "revelation": "Les échos d'une étoile lointaine atteignent enfin le rivage du présent. Ne vous fiez pas à ce que vos yeux voient, mais à ce que votre âme ressent. Une graine de possibilité attend la pluie du courage."
}

Now, provide a new, unique revelation for today in the {{locale}} language.
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
