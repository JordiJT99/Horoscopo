
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

// List of Major Arcana cards for the AI to choose from or reference
const MAJOR_ARCANA_CARDS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const TarotReadingInputSchema = z.object({
  question: z.string().describe('The question the user asks for the tarot reading.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the reading language.'),
});
export type TarotReadingInput = z.infer<typeof TarotReadingInputSchema>;

const TarotReadingOutputSchema = z.object({
  cardName: z.string().describe('The name of the drawn tarot card (e.g., "The Magician", "The Lovers"). The AI should pick one from the Major Arcana.'),
  cardMeaning: z.string().describe('A general interpretation or meaning of the drawn tarot card. This should be 2-3 sentences.'),
  advice: z.string().describe('Specific advice or insight related to the user\'s question, based on the drawn card. This should be 2-3 sentences.'),
  imagePlaceholderUrl: z.string().url().describe('A placeholder image URL for the tarot card. Use "https://placehold.co/267x470.png" as a generic placeholder.'),
});
export type TarotReadingOutput = z.infer<typeof TarotReadingOutputSchema>;

const tarotReadingPrompt = ai.definePrompt({
  name: 'tarotReadingPrompt',
  input: {schema: TarotReadingInputSchema},
  output: {schema: TarotReadingOutputSchema},
  prompt: `You are a wise and insightful Tarot reader. The user will ask you a question.
Your task is to:
1. Select ONE Tarot card from the Major Arcana that you feel is most relevant to the user's question.
   The Major Arcana includes: ${MAJOR_ARCANA_CARDS.join(", ")}.
2. Provide the name of the card.
3. Give a general meaning of this card (2-3 sentences).
4. Offer specific advice or insight related to the user's question, based on the drawn card (2-3 sentences).
5. For the image, always return "https://placehold.co/267x470.png" as the imagePlaceholderUrl.

Respond in the {{locale}} language.

User's question: "{{question}}"

Example for question "Should I change my career?" and you (AI) choose "The Fool":
{
  "cardName": "The Fool",
  "cardMeaning": "The Fool represents new beginnings, innocence, spontaneity, and a leap of faith. It signifies embarking on a new journey with an open heart and mind, often without knowing all the details but trusting in the universe.",
  "advice": "Regarding your career change, The Fool suggests that this might be a time for a fresh start and embracing the unknown. It encourages you to take that leap of faith if it feels right, even if it seems unconventional. Trust your instincts and be open to new possibilities.",
  "imagePlaceholderUrl": "https://placehold.co/267x470.png"
}

Now, provide a reading for the user's question: "{{question}}"
`,
});

const tarotReadingFlowInternal = ai.defineFlow(
  {
    name: 'tarotReadingFlowInternal',
    inputSchema: TarotReadingInputSchema,
    outputSchema: TarotReadingOutputSchema,
  },
  async (input) => {
    const {output} = await tarotReadingPrompt(input);
    if (!output) {
      throw new Error('Tarot reader provided no insights.');
    }
    // Ensure the placeholder URL is always set, even if AI fails to include it.
    if (!output.imagePlaceholderUrl) {
        output.imagePlaceholderUrl = "https://placehold.co/267x470.png";
    }
    return output;
  }
);

export async function tarotReadingFlow(input: TarotReadingInput): Promise<TarotReadingOutput> {
  return tarotReadingFlowInternal(input);
}
