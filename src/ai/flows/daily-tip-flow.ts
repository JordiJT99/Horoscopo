'use server';
/**
 * @fileOverview A Genkit flow to get a short, positive tip for the day.
 *
 * - getDailyTip - A function that calls the tip generation flow.
 * - DailyTipInput - The input type for the flow.
 * - DailyTipOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const DailyTipInputSchema = z.object({
  locale: z.string().describe('The locale (e.g., "en", "es") for the tip language.'),
});
export type DailyTipInput = z.infer<typeof DailyTipInputSchema>;

const DailyTipOutputSchema = z.object({
  tip: z.string().describe("A short, positive, and inspiring tip for the day. It should be a single sentence."),
});
export type DailyTipOutput = z.infer<typeof DailyTipOutputSchema>;

// Simple in-memory cache for the daily tip
const tipCache = new Map<string, DailyTipOutput>();

const getDailyTipPrompt = ai.definePrompt({
  name: 'dailyTipPrompt',
  input: {schema: DailyTipInputSchema},
  output: {schema: DailyTipOutputSchema},
  prompt: `You are a wise and empathetic cosmic guide. Your purpose is to provide a short, positive, inspiring, and actionable tip for the day.
Respond ONLY in the {{locale}} language.

**Core Instruction:** Generate a single, concise sentence that offers a piece of wisdom or a gentle encouragement for the user to carry with them throughout their day. The tip should be uplifting and easy to understand.

**Example for locale 'es':**
{
  "tip": "Hoy, permítete un momento de silencio para escuchar la sabiduría que ya reside en tu interior."
}

**Example for locale 'en':**
{
  "tip": "Today, find a small moment of silence to listen to the wisdom that already resides within you."
}

Now, provide a new, unique tip for today in the {{locale}} language. Ensure your response is a JSON object with a single key "tip".
`,
});

const getDailyTipFlow = ai.defineFlow(
  {
    name: 'getDailyTipFlow',
    inputSchema: DailyTipInputSchema,
    outputSchema: DailyTipOutputSchema,
  },
  async (input) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `daily-tip-${input.locale}-${today}`;

    if (tipCache.has(cacheKey)) {
        return tipCache.get(cacheKey)!;
    }

    const {output} = await getDailyTipPrompt(input);
    if (!output) {
      throw new Error('Cosmic guide provided no tip.');
    }
    
    tipCache.set(cacheKey, output);
    return output;
  }
);

export async function getDailyTip(input: DailyTipInput): Promise<DailyTipOutput> {
  return getDailyTipFlow(input);
}
