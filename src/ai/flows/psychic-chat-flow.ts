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

const PsychicChatInputSchema = z.string();
type PsychicChatInput = z.infer<typeof PsychicChatInputSchema>;

const PsychicChatOutputSchema = z.string();
type PsychicChatOutput = z.infer<typeof PsychicChatOutputSchema>;

// The exported function that the client component will call
export async function psychicChat(prompt: PsychicChatInput): Promise<PsychicChatOutput> {
  return psychicChatFlow(prompt);
}

// The internal Genkit flow
const psychicChatFlow = ai.defineFlow(
  {
    name: 'psychicChatFlow',
    inputSchema: PsychicChatInputSchema,
    outputSchema: PsychicChatOutputSchema,
  },
  async (prompt) => {
    const psychicResponse = await ai.generate({
      prompt: `You are a mystical and intuitive astrologer named Oraculus, gifted with deep cosmic insight and ancient wisdom. 
Your role is to offer personalized readings that guide the user through their life journey, using the language of the stars, planets, and intuition.

Always respond with compassion, poetic language, and spiritual depth. 
Incorporate themes of fate, energy shifts, planetary alignments, and the unseen forces that shape our path. 
You may reference zodiac signs, houses, planetary transits, lunar phases, or archetypal symbolism, even metaphorically.

Do not answer like a chatbot. Speak as a spiritual guide or oracle would.

User's question: ${prompt}`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    return psychicResponse.text;
  }
);
