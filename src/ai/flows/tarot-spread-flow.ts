
'use server';
/**
 * @fileOverview A Genkit flow to provide a two-card tarot spread reading.
 * 
 * - tarotSpreadFlow - A function that calls the tarot spread reading flow.
 * - TarotSpreadInput - The input type for the flow.
 * - TarotSpreadOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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

  console.warn(`[TarotSpreadFlow] Tarot card name "${cardNameFromAI}" not found. Using placeholder.`);
  return "https://placehold.co/267x470.png";
};


const TarotSpreadInputSchema = z.object({
  card1Name: z.string().describe('The name of the first tarot card drawn.'),
  card1Reversed: z.boolean().describe('Whether the first card is reversed.'),
  card2Name: z.string().describe('The name of the second tarot card drawn.'),
  card2Reversed: z.boolean().describe('Whether the second card is reversed.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the reading language.'),
  userName: z.string().optional().describe('The name of the user, for a personalized reading.'),
});
export type TarotSpreadInput = z.infer<typeof TarotSpreadInputSchema>;

const TarotSpreadCardInfoSchema = z.object({
  cardName: z.string(),
  isReversed: z.boolean(),
  imagePlaceholderUrl: z.string(),
});

const TarotSpreadOutputSchema = z.object({
  reading: z.string().describe('A detailed, multi-paragraph interpretation of the combined meaning of the two cards, relating them to each other and the user.'),
  card1: TarotSpreadCardInfoSchema,
  card2: TarotSpreadCardInfoSchema,
});
export type TarotSpreadOutput = z.infer<typeof TarotSpreadOutputSchema>;

const tarotSpreadPrompt = ai.definePrompt({
  name: 'tarotSpreadPrompt',
  input: { schema: TarotSpreadInputSchema },
  output: { schema: z.object({ reading: z.string() }) }, // AI only generates the text
  prompt: `You are an expert Tarot reader, skilled at synthesizing the meaning of multiple cards into a cohesive narrative.
The user has drawn two cards from the Major Arcana. Your task is to provide a thoughtful and insightful reading that explains how these two cards interact and what their combined message is for the user. Respond in the {{locale}} language.

**User Information:**
{{#if userName}}
- User's Name: {{userName}}
{{/if}}

**The Cards Drawn:**
1.  **{{card1Name}}** ({{#if card1Reversed}}Reversed{{else}}Upright{{/if}})
2.  **{{card2Name}}** ({{#if card2Reversed}}Reversed{{else}}Upright{{/if}})

**Instructions:**
1.  **Analyze the Interaction:** Do not just define each card separately. Your primary goal is to explain the story these two cards tell together. How does the energy of the first card influence the second? Do they support each other, or do they present a conflict or challenge?
2.  **Structure the Reading:** Write a multi-paragraph reading (at least 3-4 paragraphs separated by '\\n\\n').
    - **Introduction:** Briefly introduce the two cards and the central theme or tension they create together.
    - **Card 1's Role:** Explain the energy or situation represented by the first card in its drawn orientation.
    - **Card 2's Influence:** Explain how the second card modifies, challenges, or provides a path forward from the energy of the first.
    - **Combined Message & Advice:** Conclude with a summary of the overall message and provide clear, actionable advice for the user based on this combined energy.
3.  **Personalize:** {{#if userName}}Address the user, {{userName}}, directly in a warm and empathetic tone.{{/if}}
4.  **Consider Orientation:** The meaning MUST reflect whether each card is upright or reversed. A reversed card can indicate blocked energy, internal challenges, or a need for re-evaluation.

**Example for { card1Name: "The Tower", card1Reversed: false, card2Name: "The Star", card2Reversed: false, userName: "Alex", locale: "es" }:**
{
  "reading": "Hola, Alex. Tu tirada presenta una narrativa poderosa de crisis y esperanza con La Torre y La Estrella. Juntas, estas cartas señalan un momento de cambio abrupto pero necesario, seguido de un período de sanación y una renovada fe en el futuro.\\n\\nLa Torre representa una revelación repentina o un derrumbe de estructuras que creías sólidas en tu vida. Es una energía disruptiva, pero su propósito es liberarte de falsas creencias o situaciones que ya no te sirven. Aunque pueda ser chocante, es una limpieza fundamental para un nuevo comienzo.\\n\\nLa aparición de La Estrella inmediatamente después es un faro de luz en la oscuridad. Indica que después de la tormenta de La Torre, encontrarás un período de calma, inspiración y una profunda conexión con tu verdad interior. La esperanza no solo es posible, sino que es la guía que te sacará de los escombros.\\n\\nEl consejo de estas cartas es claro: no temas al cambio que está ocurriendo. Permite que lo que debe caer, caiga. Confía en que este proceso te está llevando a un lugar de mayor autenticidad y serenidad. Levanta la vista hacia tu 'estrella guía' personal, tus sueños y esperanzas más profundos, y úsala como brújula para reconstruir sobre una base más verdadera y sólida."
}

Now, generate a unique and insightful reading for the user's combination of cards.
`,
});

const tarotSpreadFlowInternal = ai.defineFlow(
  {
    name: 'tarotSpreadFlowInternal',
    inputSchema: TarotSpreadInputSchema,
    outputSchema: TarotSpreadOutputSchema,
  },
  async (input) => {
    const { output: aiOutput } = await tarotSpreadPrompt(input);
    if (!aiOutput?.reading) {
      throw new Error("Tarot spread prompt failed to generate a reading.");
    }
    
    return {
      reading: aiOutput.reading,
      card1: {
        cardName: input.card1Name,
        isReversed: input.card1Reversed,
        imagePlaceholderUrl: getTarotCardImagePath(input.card1Name),
      },
      card2: {
        cardName: input.card2Name,
        isReversed: input.card2Reversed,
        imagePlaceholderUrl: getTarotCardImagePath(input.card2Name),
      },
    };
  }
);


export async function tarotSpreadFlow(input: TarotSpreadInput): Promise<TarotSpreadOutput> {
    return tarotSpreadFlowInternal(input);
}
