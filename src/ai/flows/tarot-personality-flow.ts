
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
import { ALL_TAROT_CARDS } from '@/lib/constants';

// Helper function to generate image path from card name
const getCardImagePath = (cardName: string): string => {
    const basePath = '/custom_assets/tarot_cards/';
    // Normalize the name: lowercase, replace spaces with underscores.
    // This is a more direct and robust way to match the file names.
    const fileName = cardName.toLowerCase().replace(/\s+/g, '_') + '.png';
    return `${basePath}${fileName}`;
};


export type TarotPersonalityInput = z.infer<typeof TarotPersonalityInputSchema>;
const TarotPersonalityInputSchema = z.object({
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
  userName: z.string().optional().describe('The name of the user, for a personalized reading.'),
});


export type TarotPersonalityOutput = z.infer<typeof TarotPersonalityOutputSchema>;
const TarotPersonalityOutputSchema = z.object({
  cardName: z.string().describe('The name of the Tarot card drawn for the day.'),
  isReversed: z.boolean().describe('Whether the card is drawn in a reversed position.'),
  reading: z.string().describe('An insightful, multi-paragraph reading for the user about what this card means for them today. It should touch on a general theme, a piece of advice, and a reflection.'),
  cardImagePlaceholderUrl: z.string().describe('A URL for the tarot card image. This will be dynamically generated.'),
});

// New schema for the prompt input, including the pre-selected card
const DailyTarotPromptInputSchema = TarotPersonalityInputSchema.extend({
    cardName: z.string().describe('The pre-selected Tarot card to be interpreted.'),
    isReversed: z.boolean().describe('Whether the pre-selected card is reversed.'),
});

// The AI prompt now only needs to return the reading text.
const DailyTarotPromptOutputSchema = z.object({
    reading: z.string().describe('The interpretation text for the given card and orientation.'),
});


const dailyTarotPrompt = ai.definePrompt({
  name: 'dailyTarotPrompt',
  input: {schema: DailyTarotPromptInputSchema},
  output: {schema: DailyTarotPromptOutputSchema},
  prompt: `You are an insightful and empathetic Tarot reader. Your task is to provide a one-card daily reading for the user based on a pre-selected card.

**Card Drawn:** {{cardName}}
**Orientation:** {{#if isReversed}}Reversed{{else}}Upright{{/if}}

**User Information:**
{{#if userName}}
- User's Name: {{userName}}
{{/if}}

**Instructions:**
1.  **DO NOT CHOOSE A CARD.** You are given the card name ("{{cardName}}") and its orientation ("{{#if isReversed}}Reversed{{else}}Upright{{/if}}"). Your only task is to interpret it.
2.  Write a thoughtful and personalized "reading" for the user in the {{locale}} language. This should be 2-3 paragraphs, separated by '\\n\\n'.
    - If a userName is provided, start with a warm, personal greeting like "Hola, {{userName}}, la carta que te guía hoy es...".
    - Explain the card's energy in the context of TODAY. What does it suggest for them?
    - Offer a piece of simple, actionable advice based on the card's meaning.
    - Conclude with a point of reflection for them to consider throughout their day.
    - **CRITICAL: The reading MUST reflect the given orientation.** If 'isReversed' is true, the reading must focus on the reversed meaning (internal blockages, re-evaluation, etc.). If 'isReversed' is false, it must focus on the upright meaning.

Example for input: { cardName: "The Star", isReversed: false, locale: "es", userName: "Alex" }
{
  "reading": "Hola, Alex, la carta que ilumina tu camino hoy es La Estrella. Este es un día de esperanza renovada, inspiración y una profunda conexión con tu verdad interior. Después de un período de desafíos, La Estrella aparece como una señal de que la sanación y la calma están a tu alcance.\\n\\nEl consejo de hoy es que te permitas soñar y creer en el futuro. Busca un momento de tranquilidad, tal vez bajo el cielo nocturno si es posible, para reconectar con tus esperanzas más profundas. Confía en la guía del universo; te está llevando en la dirección correcta.\\n\\nReflexiona sobre esto: ¿Qué creencia limitante puedes liberar hoy para hacer espacio a la esperanza? Deja que la energía serena de La Estrella te recuerde tu propia luz."
}

Example for input: { cardName: "The Chariot", isReversed: true, locale: "es" }
{
  "reading": "Hoy, El Carro aparece invertido en tu lectura. Esto no señala un fracaso, sino una poderosa llamada a la introspección. Sientes un fuerte impulso de avanzar, pero una falta de dirección o un conflicto interno te está frenando. La energía está presente, pero dispersa.\\n\\nEl consejo de hoy es detenerse y reevaluar tu rumbo antes de seguir adelante. ¿Están tus acciones alineadas con tus verdaderos deseos? En lugar de forzar el avance, concéntrate en encontrar tu equilibrio interno. La victoria no siempre consiste en avanzar rápido, sino en moverse con un propósito claro.\\n\\nReflexiona sobre esto: ¿Qué fuerzas opuestas luchan dentro de ti en este momento? Encuentra la armonía entre ellas antes de volver a tomar las riendas."
}

Now, provide the reading for "{{cardName}}" ({{#if isReversed}}Reversed{{else}}Upright{{/if}}).
{{#if userName}}
Personalize the "reading" for {{userName}}.
{{/if}}
Ensure the "reading" is in the {{locale}} language.
`,
});

const tarotPersonalityFlowInternal = ai.defineFlow(
  {
    name: 'tarotPersonalityFlowInternal',
    inputSchema: TarotPersonalityInputSchema,
    outputSchema: TarotPersonalityOutputSchema,
  },
  async (input) => {
    // True randomness is now handled by code, not the LLM.
    const cardIndex = Math.floor(Math.random() * ALL_TAROT_CARDS.length);
    const cardName = ALL_TAROT_CARDS[cardIndex];
    const isReversed = Math.random() < 0.3; // 30% chance of being reversed

    const {output: aiOutput} = await dailyTarotPrompt({
        ...input, // Pass locale and userName
        cardName,
        isReversed,
    });
    
    if (!aiOutput || !aiOutput.reading || aiOutput.reading.trim() === '') {
      console.error('[AstroVibes - TarotPersonalityFlow] AI output missing reading. AI Output:', JSON.stringify(aiOutput));
      throw new Error('Tarot reader provided no insights.');
    }
    
    const cardImagePath = getCardImagePath(cardName);

    return {
      cardName,
      isReversed,
      reading: aiOutput.reading,
      cardImagePlaceholderUrl: cardImagePath,
    };
  }
);

export async function tarotPersonalityFlow(input: TarotPersonalityInput): Promise<TarotPersonalityOutput> {
  const validatedInput = TarotPersonalityInputSchema.parse(input);
  return tarotPersonalityFlowInternal(validatedInput);
}

    
