'use server';
/**
 * @fileOverview A Genkit flow to provide a three-card Past/Present/Future tarot reading.
 * 
 * - pastPresentFutureFlow - A function that calls the Past/Present/Future tarot reading flow.
 * - PastPresentFutureInput - The input type for the flow.
 * - PastPresentFutureOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ALL_TAROT_CARDS } from '@/lib/constants';

// Helper function to generate image path from card name
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

  console.warn(`[PastPresentFutureFlow] Tarot card name "${cardNameFromAI}" not found. Using placeholder.`);
  return "https://placehold.co/267x470.png";
};

export type PastPresentFutureInput = z.infer<typeof PastPresentFutureInputSchema>;
const PastPresentFutureInputSchema = z.object({
  pastCardName: z.string().describe('The name of the Past tarot card drawn.'),
  pastCardReversed: z.boolean().describe('Whether the Past card is reversed.'),
  presentCardName: z.string().describe('The name of the Present tarot card drawn.'),
  presentCardReversed: z.boolean().describe('Whether the Present card is reversed.'),
  futureCardName: z.string().describe('The name of the Future tarot card drawn.'),
  futureCardReversed: z.boolean().describe('Whether the Future card is reversed.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the reading language.'),
  userName: z.string().optional().describe('The name of the user, for a personalized reading.'),
});

const PastPresentFutureCardInfoSchema = z.object({
  cardName: z.string(),
  isReversed: z.boolean(),
  imagePlaceholderUrl: z.string(),
});

export type PastPresentFutureOutput = z.infer<typeof PastPresentFutureOutputSchema>;
const PastPresentFutureOutputSchema = z.object({
  reading: z.string().describe('A detailed interpretation of the Past/Present/Future spread.'),
  pastCard: PastPresentFutureCardInfoSchema,
  presentCard: PastPresentFutureCardInfoSchema,
  futureCard: PastPresentFutureCardInfoSchema,
  tldr: z.string().describe('A brief summary of the reading (TL;DR).'),
});

const pastPresentFuturePrompt = ai.definePrompt({
  name: 'pastPresentFuturePrompt',
  input: { schema: PastPresentFutureInputSchema },
  output: { schema: z.object({ reading: z.string(), tldr: z.string() }) },
  prompt: `You are an expert Tarot reader specializing in Past/Present/Future spreads. The user has drawn three cards representing their journey through time. Provide a comprehensive reading that weaves their story together, along with a concise TL;DR summary. Respond in the {{locale}} language.

**User Information:**
{{#if userName}}
- User's Name: {{userName}}
{{/if}}

**The Cards Drawn:**
1. **PAST: {{pastCardName}}** ({{#if pastCardReversed}}Reversed{{else}}Upright{{/if}})
2. **PRESENT: {{presentCardName}}** ({{#if presentCardReversed}}Reversed{{else}}Upright{{/if}})
3. **FUTURE: {{futureCardName}}** ({{#if futureCardReversed}}Reversed{{else}}Upright{{/if}})

**Instructions for the full reading:**
1. **Temporal Flow:** Explain how the past influences the present, and how the present shapes the future. Show the connections between all three cards.
2. **Structure the Reading:** Write a detailed reading (4-5 paragraphs separated by '\\n\\n'):
   - **Introduction:** Set the scene and introduce the temporal journey
   - **Past Analysis:** Deep dive into what the Past card reveals about influences and experiences
   - **Present Situation:** Analyze the current energy and circumstances
   - **Future Potential:** Explore what the Future card suggests about potential outcomes
   - **Integration & Advice:** Provide actionable guidance based on the complete temporal picture
3. **Card Orientations:** Each card's meaning MUST reflect whether it's upright or reversed
4. **Personalization:** {{#if userName}}Address {{userName}} directly with warmth and insight{{/if}}

**Instructions for the TL;DR:**
Provide a concise 2-3 sentence summary that captures the essence of the reading and key advice.

**Example for { pastCardName: "Three of Cups", pastCardReversed: false, presentCardName: "Five of Pentacles", presentCardReversed: false, futureCardName: "The Sun", futureCardReversed: false, userName: "Maria", locale: "es" }:**
{
  "reading": "María, tu tirada temporal revela un viaje desde la alegría compartida hacia la renovación y el éxito. El Tres de Copas en tu pasado, el Cinco de Pentáculos en tu presente, y El Sol en tu futuro cuentan una historia de transformación profunda.\\n\\nEl Tres de Copas en tu pasado representa un tiempo de celebración, amistad y apoyo comunitario. Has tenido experiencias ricas en conexión humana y momentos de alegría compartida que han formado la base de tu fortaleza emocional. Estas relaciones y experiencias positivas han sido pilares fundamentales en tu desarrollo.\\n\\nActualmente, el Cinco de Pentáculos indica que estás atravesando un período de dificultades materiales o emocionales. Puede que te sientas excluida o enfrentando escasez, pero es importante recordar que esta carta también habla de recursos disponibles que quizás no estás viendo. Tu pasado de conexiones fuertes puede ser la clave para superar estos desafíos presentes.\\n\\nEl Sol en tu futuro es una promesa radiante de éxito, alegría y claridad. Después de este período difícil, emergerás con una nueva perspectiva, logros tangibles y una felicidad renovada. Esta carta sugiere que no solo superarás las dificultades actuales, sino que alcanzarás un nivel de éxito y satisfacción aún mayor que antes.\\n\\nEl consejo de estas cartas es mantener la fe durante este momento difícil. Reconecta con las personas y experiencias positivas de tu pasado, busca el apoyo que necesitas, y mantén la vista en el horizonte brillante que te espera. Tu viaje actual a través de la adversidad te está preparando para un período de gran éxito y felicidad.",
  "tldr": "Has tenido un pasado lleno de conexiones positivas, actualmente enfrentas dificultades pero tienes recursos disponibles, y tu futuro promete gran éxito y alegría. Busca apoyo en tus relaciones pasadas y mantén la fe en tiempos difíciles."
}

Now, generate a unique and insightful Past/Present/Future reading for the user's combination of cards.
`,
});

const pastPresentFutureFlowInternal = ai.defineFlow(
  {
    name: 'pastPresentFutureFlowInternal',
    inputSchema: PastPresentFutureInputSchema,
    outputSchema: PastPresentFutureOutputSchema,
  },
  async (input) => {
    const { output: aiOutput } = await pastPresentFuturePrompt(input);
    if (!aiOutput?.reading || !aiOutput?.tldr) {
      throw new Error("Past/Present/Future prompt failed to generate a complete reading.");
    }
    
    return {
      reading: aiOutput.reading,
      tldr: aiOutput.tldr,
      pastCard: {
        cardName: input.pastCardName,
        isReversed: input.pastCardReversed,
        imagePlaceholderUrl: getTarotCardImagePath(input.pastCardName),
      },
      presentCard: {
        cardName: input.presentCardName,
        isReversed: input.presentCardReversed,
        imagePlaceholderUrl: getTarotCardImagePath(input.presentCardName),
      },
      futureCard: {
        cardName: input.futureCardName,
        isReversed: input.futureCardReversed,
        imagePlaceholderUrl: getTarotCardImagePath(input.futureCardName),
      },
    };
  }
);

export async function pastPresentFutureFlow(input: PastPresentFutureInput): Promise<PastPresentFutureOutput> {
    return pastPresentFutureFlowInternal(input);
}
