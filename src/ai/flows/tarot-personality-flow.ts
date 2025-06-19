
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
import type { TarotPersonalityInputType as PublicTarotPersonalityInputType } from '@/types';
import { MAJOR_ARCANA_TAROT_CARDS } from '@/lib/constants';

// Helper function to generate image path from card name
const getTarotCardImagePath = (cardNameFromAI: string): string => {
  const basePath = '/custom_assets/tarot_cards/';

  // 1. Normalize the name from AI for searching (trim, lowercase).
  const normalizedSearchName = cardNameFromAI.trim().toLowerCase();

  // 2. Find a matching canonical name from MAJOR_ARCANA_TAROT_CARDS.
  const matchedCanonicalName = MAJOR_ARCANA_TAROT_CARDS.find(
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
    `[AstroVibes - TarotPersonalityFlow] Tarot card name "${cardNameFromAI}" (normalized: "${normalizedSearchName}") not found in MAJOR_ARCANA_TAROT_CARDS. Using placeholder image.`
  );
  return "https://placehold.co/267x470.png";
};


const TarotPersonalityInputSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(10, "Please provide a more detailed answer."),
  })).length(3, "Please answer all three questions."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type TarotPersonalityInput = z.infer<typeof TarotPersonalityInputSchema>;


const TarotPersonalityOutputSchema = z.object({
  cardName: z.string().describe('The name of the Major Arcana tarot card that best represents the user.'),
  cardDescription: z.string().describe('An explanation of why this card was chosen for the user based on their answers. This should be insightful and 2-3 paragraphs long.'),
  cardImagePlaceholderUrl: z.string().describe('A URL for the tarot card image. This will be dynamically generated.'),
});
export type TarotPersonalityOutput = z.infer<typeof TarotPersonalityOutputSchema>;


const tarotPersonalityPrompt = ai.definePrompt({
  name: 'tarotPersonalityPrompt',
  input: {schema: TarotPersonalityInputSchema},
  output: {schema: TarotPersonalityOutputSchema.omit({ cardImagePlaceholderUrl: true })},
  prompt: `You are an insightful psychologist and tarot expert.
Based on the user's answers to the following three questions, determine which Major Arcana tarot card best represents their core personality, current life theme, or the energy they are embodying.

Available Major Arcana cards for selection: ${MAJOR_ARCANA_TAROT_CARDS.join(", ")}.
CRITICAL: Your "cardName" output MUST EXACTLY match one of these names, including capitalization and "The " prefix where applicable (e.g., "The Fool", "Strength").

User's Answers:
1. Question: "{{answers.[0].question}}"
   Answer: "{{answers.[0].answer}}"
2. Question: "{{answers.[1].question}}"
   Answer: "{{answers.[1].answer}}"
3. Question: "{{answers.[2].question}}"
   Answer: "{{answers.[2].answer}}"

Your task:
1. Select ONE Tarot card from the Major Arcana list that you feel is most relevant to the user's collective answers.
2. Provide the name of the card in the "cardName" field.
3. Provide a detailed, insightful, and empathetic "cardDescription" (2-3 paragraphs) explaining *why* this card was chosen for the user. Connect specific aspects of their answers to the symbolism and meaning of the chosen card. Avoid generic card meanings; personalize the description based on their input.

Respond in the {{locale}} language.

Example output structure for locale 'en' if user's answers led to "The Hermit":
{
  "cardName": "The Hermit",
  "cardDescription": "Based on your reflections, The Hermit seems to resonate deeply with your current journey. Your desire for introspection, mentioned in your approach to challenges, aligns with The Hermit's quest for inner wisdom and guidance. This card suggests you are in a phase where solitude and contemplation are valuable, allowing you to connect with your inner truth, much like your valued quality of self-awareness. \\n\\nThe energy you're seeking, one of clarity and understanding, is precisely what The Hermit offers. This isn't about loneliness, but about finding light within. Your answers point towards a path of soul-searching and seeking deeper meaning, which The Hermit champions. Embrace this period of looking inward; it holds profound insights for you."
}

Now, analyze the user's answers provided above and generate the JSON output in the {{locale}} language.
Ensure your "cardName" is an exact match from the provided Major Arcana list.
`,
});

const tarotPersonalityFlowInternal = ai.defineFlow(
  {
    name: 'tarotPersonalityFlowInternal',
    inputSchema: TarotPersonalityInputSchema,
    outputSchema: TarotPersonalityOutputSchema,
  },
  async (input) => {
    const {output: aiOutput} = await tarotPersonalityPrompt(input);
    if (!aiOutput || !aiOutput.cardName || aiOutput.cardName.trim() === "") {
      // Log the problematic output for easier debugging
      console.error('[AstroVibes - TarotPersonalityFlow] AI output missing cardName or cardName is empty. AI Output:', JSON.stringify(aiOutput));
      throw new Error('Tarot personality expert provided no insights or an invalid card name.');
    }
    
    const cardImagePath = getTarotCardImagePath(aiOutput.cardName);

    return {
      ...aiOutput,
      imagePlaceholderUrl: cardImagePath, // Changed from imagePlaceholderUrl to cardImagePlaceholderUrl to match schema
    };
  }
);

export async function tarotPersonalityFlow(input: PublicTarotPersonalityInputType): Promise<TarotPersonalityOutput> {
  const validatedInput = TarotPersonalityInputSchema.parse(input);
  return tarotPersonalityFlowInternal(validatedInput);
}
