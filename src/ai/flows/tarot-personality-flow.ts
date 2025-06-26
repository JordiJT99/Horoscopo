
'use server';
/**
 * @fileOverview A Genkit flow to determine a user's daily Tarot card.
 *
 * - tarotPersonalityFlow - A function that calls the daily Tarot reading flow.
 * - TarotPersonalityInput - The input type for the flow.
 * - TarotPersonalityOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MAJOR_ARCANA_TAROT_CARDS } from '@/lib/constants';

// Helper function to generate image path from card name
const getTarotCardImagePath = (cardNameFromAI: string): string => {
  const basePath = '/custom_assets/tarot_cards/';

  const normalizedSearchName = cardNameFromAI.trim().toLowerCase();
  const matchedCanonicalName = MAJOR_ARCANA_TAROT_CARDS.find(
    (canonicalName) => canonicalName.trim().toLowerCase() === normalizedSearchName
  );

  if (matchedCanonicalName) {
    const fileName = matchedCanonicalName.toLowerCase().replace(/\s+/g, '_') + '.png';
    return `${basePath}${fileName}`;
  }

  console.warn(
    `[AstroVibes - TarotPersonalityFlow] Tarot card name "${cardNameFromAI}" (normalized: "${normalizedSearchName}") not found in MAJOR_ARCANA_TAROT_CARDS. Using placeholder image.`
  );
  return "https://placehold.co/267x470.png";
};


const TarotPersonalityInputSchema = z.object({
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
  userName: z.string().optional().describe('The name of the user, for a personalized reading.'),
});
export type TarotPersonalityInput = z.infer<typeof TarotPersonalityInputSchema>;


const TarotPersonalityOutputSchema = z.object({
  cardName: z.string().describe('The name of the Major Arcana tarot card drawn for the day.'),
  reading: z.string().describe('An insightful, multi-paragraph reading for the user about what this card means for them today. It should touch on a general theme, a piece of advice, and a reflection.'),
  cardImagePlaceholderUrl: z.string().describe('A URL for the tarot card image. This will be dynamically generated.'),
});
export type TarotPersonalityOutput = z.infer<typeof TarotPersonalityOutputSchema>;


const dailyTarotPrompt = ai.definePrompt({
  name: 'dailyTarotPrompt',
  input: {schema: TarotPersonalityInputSchema},
  output: {schema: TarotPersonalityOutputSchema.omit({ cardImagePlaceholderUrl: true })},
  prompt: `You are an insightful and empathetic Tarot reader. Your task is to provide a one-card daily reading for the user.
Respond in the {{locale}} language.

**User Information:**
{{#if userName}}
- User's Name: {{userName}}
{{/if}}

**Instructions:**
1.  Select ONE Tarot card from the Major Arcana that represents the core energy or theme for the user's day today.
    Available Major Arcana cards: ${MAJOR_ARCANA_TAROT_CARDS.join(", ")}.
    CRITICAL: Your "cardName" output MUST EXACTLY match one of these names, including capitalization and "The " prefix where applicable (e.g., "The Fool", "Strength").
2.  Provide the name of the card in the "cardName" field.
3.  Write a thoughtful and personalized "reading" for the user. This should be 2-3 paragraphs, separated by '\\n\\n'.
    - If a userName is provided, start with a warm, personal greeting like "Hola, {{userName}}, la carta que te guía hoy es...".
    - Explain the card's energy in the context of TODAY. What does it suggest for them?
    - Offer a piece of simple, actionable advice based on the card's meaning.
    - Conclude with a point of reflection for them to consider throughout their day.

Example for a user named 'Alex' who draws 'The Star':
{
  "cardName": "The Star",
  "reading": "Hola, Alex, la carta que ilumina tu camino hoy es La Estrella. Este es un día de esperanza renovada, inspiración y una profunda conexión con tu verdad interior. Después de un período de desafíos, La Estrella aparece como una señal de que la sanación y la calma están a tu alcance.\\n\\nEl consejo de hoy es que te permitas soñar y creer en el futuro. Busca un momento de tranquilidad, tal vez bajo el cielo nocturno si es posible, para reconectar con tus esperanzas más profundas. Confía en la guía del universo; te está llevando en la dirección correcta.\\n\\nReflexiona sobre esto: ¿Qué creencia limitante puedes liberar hoy para hacer espacio a la esperanza? Deja que la energía serena de La Estrella te recuerde tu propia luz."
}

Now, provide a new, unique reading for today in the {{locale}} language.
{{#if userName}}
Personalize it for {{userName}}.
{{/if}}
`,
});

const tarotPersonalityFlowInternal = ai.defineFlow(
  {
    name: 'tarotPersonalityFlowInternal',
    inputSchema: TarotPersonalityInputSchema,
    outputSchema: TarotPersonalityOutputSchema,
  },
  async (input) => {
    const {output: aiOutput} = await dailyTarotPrompt(input);
    if (!aiOutput || !aiOutput.cardName || !aiOutput.reading || aiOutput.reading.trim() === "") {
      console.error('[AstroVibes - TarotPersonalityFlow] AI output missing cardName or reading. AI Output:', JSON.stringify(aiOutput));
      throw new Error('Tarot reader provided no insights or an invalid card name.');
    }
    
    const cardImagePath = getTarotCardImagePath(aiOutput.cardName);

    return {
      ...aiOutput,
      cardImagePlaceholderUrl: cardImagePath,
    };
  }
);

export async function tarotPersonalityFlow(input: TarotPersonalityInput): Promise<TarotPersonalityOutput> {
  const validatedInput = TarotPersonalityInputSchema.parse(input);
  return tarotPersonalityFlowInternal(validatedInput);
}
