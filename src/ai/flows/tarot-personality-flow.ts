
'use server';
/**
 * @fileOverview A Genkit flow to determine a user's Tarot personality card based on their answers.
 *
 * - tarotPersonalityFlow - A function that calls the Tarot personality determination flow.
 * - TarotPersonalityInputType - The input type for the flow.
 * - TarotPersonalityOutputType - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { TarotPersonalityInputType, TarotPersonalityOutputType } from '@/types';
import { MAJOR_ARCANA_TAROT_CARDS } from '@/lib/constants';

// Schemas are defined in types/index.ts and imported, so no need to redefine here.
// We just need to create Zod schemas for validation if not already done or if they are complex.
// For simple structures like these, direct type usage is fine for the flow definition.

const TarotPersonalityInputSchema = z.object({
  answers: z.array(z.object({
    question: z.string(), // Could be a key or the full question text
    answer: z.string().min(10, "Please provide a more detailed answer."), // User's free-form answer
  })).length(3, "Please answer all three questions."), // Expecting 3 answers
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});

const TarotPersonalityOutputSchema = z.object({
  cardName: z.string().describe('The name of the Major Arcana tarot card that best represents the user.'),
  cardDescription: z.string().describe('An explanation of why this card was chosen for the user based on their answers. This should be insightful and 2-3 paragraphs long.'),
  cardImagePlaceholderUrl: z.string().describe('A placeholder image URL for the tarot card. Use "https://placehold.co/267x470.png" as a generic placeholder.'),
});


const tarotPersonalityPrompt = ai.definePrompt({
  name: 'tarotPersonalityPrompt',
  input: {schema: TarotPersonalityInputSchema},
  output: {schema: TarotPersonalityOutputSchema},
  prompt: `You are an insightful psychologist and tarot expert.
Based on the user's answers to the following three questions, determine which Major Arcana tarot card best represents their core personality, current life theme, or the energy they are embodying.

Available Major Arcana cards for selection: ${MAJOR_ARCANA_TAROT_CARDS.join(", ")}.

User's Answers:
1. Question: "{{answers.[0].question}}"
   Answer: "{{answers.[0].answer}}"
2. Question: "{{answers.[1].question}}"
   Answer: "{{answers.[1].answer}}"
3. Question: "{{answers.[2].question}}"
   Answer: "{{answers.[2].answer}}"

Your task:
1. Select ONE Tarot card from the Major Arcana list that you feel is most relevant to the user's collective answers.
2. Provide the name of the card.
3. Provide a detailed, insightful, and empathetic "cardDescription" (2-3 paragraphs) explaining *why* this card was chosen for the user. Connect specific aspects of their answers to the symbolism and meaning of the chosen card. Avoid generic card meanings; personalize the description based on their input.
4. For "cardImagePlaceholderUrl", always return "https://placehold.co/267x470.png".

Respond in the {{locale}} language.

Example output structure for locale 'en' if user's answers led to "The Hermit":
{
  "cardName": "The Hermit",
  "cardDescription": "Based on your reflections, The Hermit seems to resonate deeply with your current journey. Your desire for introspection, mentioned in your approach to challenges, aligns with The Hermit's quest for inner wisdom and guidance. This card suggests you are in a phase where solitude and contemplation are valuable, allowing you to connect with your inner truth, much like your valued quality of self-awareness. \n\nThe energy you're seeking, one of clarity and understanding, is precisely what The Hermit offers. This isn't about loneliness, but about finding light within. Your answers point towards a path of soul-searching and seeking deeper meaning, which The Hermit champions. Embrace this period of looking inward; it holds profound insights for you.",
  "cardImagePlaceholderUrl": "https://placehold.co/267x470.png"
}

Now, analyze the user's answers provided above and generate the JSON output in the {{locale}} language.
`,
});

const tarotPersonalityFlowInternal = ai.defineFlow(
  {
    name: 'tarotPersonalityFlowInternal',
    inputSchema: TarotPersonalityInputSchema,
    outputSchema: TarotPersonalityOutputSchema,
  },
  async (input: TarotPersonalityInputType) => {
    const {output} = await tarotPersonalityPrompt(input);
    if (!output) {
      throw new Error('Tarot personality expert provided no insights.');
    }
    if (!output.cardImagePlaceholderUrl) {
        output.cardImagePlaceholderUrl = "https://placehold.co/267x470.png";
    }
    return output;
  }
);

export async function tarotPersonalityFlow(input: TarotPersonalityInputType): Promise<TarotPersonalityOutputType> {
  return tarotPersonalityFlowInternal(input);
}
