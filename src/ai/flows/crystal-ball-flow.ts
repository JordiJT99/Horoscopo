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
  revelation: z.string().describe("A gentle, positive, and personalized message for the user's day, consisting of 4-5 short paragraphs. It should include a theme, simple advice, an insight, and an encouraging summary."),
});
export type CrystalBallRevelationOutput = z.infer<typeof CrystalBallRevelationOutputSchema>;

const crystalBallPrompt = ai.definePrompt({
  name: 'crystalBallRevelationPrompt',
  input: {schema: CrystalBallRevelationInputSchema},
  output: {schema: CrystalBallRevelationOutputSchema},
  prompt: `You are a wise and empathetic cosmic guide, speaking through a Crystal Ball. Your purpose is to provide the user with a gentle, positive, and actionable theme for their day.
Respond in the {{locale}} language.

**Core Instruction:** Generate a personalized message for the user that feels like a warm, mystical whisper from the universe.

{{#if userName}}
**PERSONALIZATION:** The user's name is {{userName}}. Start the message with a direct and friendly greeting, like "¡Hola, {{userName}}!" or "Para ti, {{userName}},...".
{{/if}}

**Structure and Tone:**
- **Theme:** Introduce a central, positive theme for the day (e.g., prioritizing well-being, connecting with others, finding joy in small things). Use mystical but clear phrasing like "el universo te susurra que..." or "el cosmos sugiere...".
- **Actionable Advice:** Offer 1-2 simple, gentle suggestions related to the theme (e.g., "un baño relajante," "una caminata," "escuchar tu canción favorita").
- **Insight:** Add a short sentence that provides a deeper, mental or spiritual insight.
- **Encouragement:** End with a positive and encouraging summary for the day.
- **Formatting:** Use newline characters ('\\n\\n') to separate the different parts of the message into distinct paragraphs for readability.

**Example for userName 'Jordi':**
{
  "revelation": "¡Hola, Jordi! Hoy el universo te susurra que es momento de priorizar tu bienestar.\\n\\nTu energía merece un respiro, así que escucha a tu cuerpo.\\n\\nEl cosmos sugiere que incorpores pequeños rituales de cuidado: un baño relajante, una caminata bajo el sol o unos minutos de meditación.\\n\\nRecuerda que la rejuvenescencia no solo es física, también es mental.\\n\\nHoy es un día perfecto para reconectar con lo que te hace sentir pleno y en paz."
}

**Example without userName:**
{
  "revelation": "Hoy es un día para encontrar la magia en lo simple. El cosmos sugiere que bajes el ritmo y observes los detalles a tu alrededor.\\n\\nPermítete disfrutar de una taza de té en silencio, o mirar las nubes pasar por la ventana.\\n\\nLa verdadera maravilla no siempre está en los grandes gestos, sino en la paz de los pequeños momentos. Reconecta con la alegría serena que ya habita en ti."
}

Now, provide a new, unique revelation for today in the {{locale}} language, following this structure and tone precisely.
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
