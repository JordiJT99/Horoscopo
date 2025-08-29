"use server";
/**
 * Multi-card tarot reading flow (supports 3-5 cards)
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ALL_TAROT_CARDS } from '@/lib/constants';

const getTarotCardImagePath = (cardNameFromAI: string): string => {
  const basePath = '/custom_assets/tarot_cards/';
  const normalizedSearchName = cardNameFromAI.trim().toLowerCase();
  const matchedCanonicalName = ALL_TAROT_CARDS.find(
    (canonicalName) => canonicalName.trim().toLowerCase() === normalizedSearchName
  );

  if (matchedCanonicalName) {
    const fileName = matchedCanonicalName.toLowerCase().replace(/\s+/g, '_') + '.png';
    return `${basePath}${fileName}`;
  }

  console.warn(`[MultiCardFlow] Tarot card name "${cardNameFromAI}" not found. Using placeholder.`);
  return "https://placehold.co/267x470.png";
};

export type MultiCardInput = z.infer<typeof MultiCardInputSchema>;
const MultiCardInputSchema = z.object({
  cards: z.array(z.object({ name: z.string(), isReversed: z.boolean() })).min(3).max(5),
  locale: z.string(),
  userName: z.string().optional(),
});

export type MultiCardOutput = z.infer<typeof MultiCardOutputSchema>;
const MultiCardOutputSchema = z.object({
  reading: z.string(),
});

const multiCardPrompt = ai.definePrompt({
  name: 'multiCardPrompt',
  input: { schema: MultiCardInputSchema },
  output: { schema: MultiCardOutputSchema },
  prompt: `You are an expert Tarot reader. The user has drawn {{cards.length}} cards. Provide a structured, multi-paragraph reading in the {{locale}} language that explains how the cards relate to each other, focusing on themes, interactions and actionable advice. Include orientation (upright/inverted) for each card.

Cards:
{{#each cards}}
- {{name}} ({{#if isReversed}}Reversed{{else}}Upright{{/if}})
{{/each}}

Instructions:
1. Write at least 3 paragraphs describing the combined meaning and dynamics between the cards.
2. Explain any conflicts or reinforcements among cards.
3. Finish with 2-3 practical steps the user can take.
`,
});

const multiCardFlowInternal = ai.defineFlow(
  {
    name: 'multiCardFlowInternal',
    inputSchema: MultiCardInputSchema,
    outputSchema: MultiCardOutputSchema,
  },
  async (input) => {
    const { output: aiOutput } = await multiCardPrompt(input);
    if (!aiOutput?.reading) throw new Error('Multi-card prompt failed to generate reading.');

    return { reading: aiOutput.reading };
  }
);

export async function multiCardFlow(input: MultiCardInput): Promise<MultiCardOutput> {
  return multiCardFlowInternal(input);
}
