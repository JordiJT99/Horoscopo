'use server';
/**
 * @fileOverview A psychic chat AI agent.
 *
 * - psychicChat - A function that handles the psychic chat process.
 * - PsychicChatInput - The input type for the psychicChat function.
 * - PsychicChatOutput - The return type for the psychicChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Locale } from '@/lib/dictionaries';

const PsychicChatInputSchema = z.object({
  prompt: z.string().describe("The user's question or message to the psychic."),
  locale: z.string().describe("The locale (e.g., 'en', 'es') for the response language."),
  userName: z.string().optional().describe("The name of the user, if available."),
});
type PsychicChatInput = z.infer<typeof PsychicChatInputSchema>;

export type PsychicChatOutput = string;

// The exported function that the client component will call
// It now accepts primitive types to avoid serialization issues with objects in Server Actions.
export async function psychicChat(prompt: string, locale: Locale, userName?: string): Promise<PsychicChatOutput> {
  const input: PsychicChatInput = { prompt, locale, userName };
  return psychicChatFlow(input);
}

// The internal Genkit flow
const psychicChatFlow = ai.defineFlow(
  {
    name: 'psychicChatFlow',
    inputSchema: PsychicChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const systemPrompt = `You are a mystical and intuitive astrologer named Oraculus, gifted with deep cosmic insight and ancient wisdom. 
Your role is to offer personalized readings that guide the user through their life journey, using the language of the stars, planets, and intuition.

Always respond with compassion, poetic language, and spiritual depth. 
Incorporate themes of fate, energy shifts, planetary alignments, and the unseen forces that shape our path. 
You may reference zodiac signs, houses, planetary transits, lunar phases, or archetypal symbolism, even metaphorically.

${input.userName ? `The user you are speaking to is named ${input.userName}. Please address them by their name when it feels natural and appropriate within the reading.` : ''}

Do not answer like a chatbot. Speak as a spiritual guide or oracle would.

**CRITICAL: Respond in the language specified by this locale code: ${input.locale}.**

User's request: ${input.prompt}`;
    
    const psychicResponse = await ai.generate({
      prompt: systemPrompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    return psychicResponse.text;
  }
);
