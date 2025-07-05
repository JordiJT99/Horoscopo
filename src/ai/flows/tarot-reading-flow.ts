
'use server';
/**
 * @fileOverview A Genkit flow to provide a one-card tarot reading based on a user's question.
 *
 * - tarotReadingFlow - A function that calls the tarot card reading flow.
 * - TarotReadingInput - The input type for the tarotReadingFlow function.
 * - TarotReadingOutput - The return type for the tarotReadingFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ALL_TAROT_CARDS } from '@/lib/constants';

// Helper function to generate image path from card name
const getTarotCardImagePath = (cardNameFromAI: string): string => {
  const basePath = '/custom_assets/tarot_cards/';

  // 1. Normalize the name from AI for searching (trim, lowercase).
  const normalizedSearchName = cardNameFromAI.trim().toLowerCase();

  // 2. Find a matching canonical name from ALL_TAROT_CARDS.
  const matchedCanonicalName = ALL_TAROT_CARDS.find(
    (canonicalName) => canonicalName.trim().toLowerCase() === normalizedSearchName
  );

  if (matchedCanonicalName) {
    // 3. If a match is found, normalize the CANONICAL name for the filename.
    const fileName = matchedCanonicalName.toLowerCase().replace(/\s+/g, '_') + '.png';
    return `${basePath}${fileName}`;
  }

  // Fallback if no exact match is found after normalization.
  // This logs to the server console where Genkit flows run.
  console.warn(
    `[AstroVibes - TarotReadingFlow] Tarot card name "${cardNameFromAI}" (normalized: "${normalizedSearchName}") not found in ALL_TAROT_CARDS. Using placeholder image.`
  );
  return "https://placehold.co/267x470.png";
};

export type TarotReadingInput = z.infer<typeof TarotReadingInputSchema>;
const TarotReadingInputSchema = z.object({
  question: z.string().describe('The question the user asks for the tarot reading.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the reading language.'),
});

export type TarotReadingOutput = z.infer<typeof TarotReadingOutputSchema>;
const TarotReadingOutputSchema = z.object({
  cardName: z.string().describe('The name of the drawn tarot card (e.g., "The Magician", "Ten of Wands"). The AI should pick one from the full 78-card Tarot deck.'),
  cardMeaning: z.string().describe('A general interpretation or meaning of the drawn tarot card. This should be 2-3 sentences.'),
  advice: z.string().describe('Specific advice or insight related to the user\'s question, based on the drawn card. This should be 2-3 sentences.'),
  imagePlaceholderUrl: z.string().describe('A URL for the tarot card image. This will be dynamically generated based on cardName.'),
});

const tarotReadingPrompt = ai.definePrompt({
  name: 'tarotReadingPrompt',
  input: {schema: TarotReadingInputSchema},
  output: {schema: TarotReadingOutputSchema.omit({ imagePlaceholderUrl: true })},
  prompt: `You are a wise and insightful Tarot reader. The user will ask you a question.

Your task is to perform these steps:
1. Select ONE Tarot card from the full 78-card deck that is most relevant to the user's question. The available cards are: ${ALL_TAROT_CARDS.join(", ")}.
2. In the response, provide the name of the card in the "cardName" field. CRITICAL: The "cardName" value MUST ALWAYS BE IN ENGLISH and MUST EXACTLY match one of the names from the list (e.g., "The Fool", "Ace of Wands").
3. Write a general meaning of this card (2-3 sentences) in the "cardMeaning" field, written in the language specified by the {{locale}} code.
4. Write specific advice related to the user's question (2-3 sentences) in the "advice" field, also in the {{locale}} language.

User's question: "{{question}}"

Example for question "Should I change my career?", with locale "es", and you (the AI) choose "The Fool":
{
  "cardName": "The Fool",
  "cardMeaning": "El Loco representa nuevos comienzos, inocencia, espontaneidad y un salto de fe. Significa embarcarse en un nuevo viaje con el corazón y la mente abiertos, a menudo sin conocer todos los detalles pero confiando en el universo.",
  "advice": "Con respecto a tu cambio de carrera, El Loco sugiere que este podría ser un momento para un nuevo comienzo y abrazar lo desconocido. Te anima a dar ese salto de fe si te parece correcto, incluso si parece poco convencional. Confía en tus instintos y mantente abierto a nuevas posibilidades."
}

Now, provide a reading for the user's question: "{{question}}".
Ensure your "cardName" is an exact match from the provided 78-card list and is in English, while "cardMeaning" and "advice" are in the {{locale}} language.
`,
});

const tarotReadingFlowInternal = ai.defineFlow(
  {
    name: 'tarotReadingFlowInternal',
    inputSchema: TarotReadingInputSchema,
    outputSchema: TarotReadingOutputSchema,
  },
  async (input) => {
    const {output: aiOutput} = await tarotReadingPrompt(input);
    if (!aiOutput || !aiOutput.cardName || aiOutput.cardName.trim() === "") {
      // Log the problematic output for easier debugging
      console.error('[AstroVibes - TarotReadingFlow] AI output missing cardName or cardName is empty. AI Output:', JSON.stringify(aiOutput));
      throw new Error('Tarot reader provided no insights or an invalid card name.');
    }
    
    const cardImagePath = getTarotCardImagePath(aiOutput.cardName);

    return {
      ...aiOutput,
      imagePlaceholderUrl: cardImagePath,
    };
  }
);

export async function tarotReadingFlow(input: TarotReadingInput): Promise<TarotReadingOutput> {
  return tarotReadingFlowInternal(input);
}

    