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

export const PsychicChatInputSchema = z.string();
export type PsychicChatInput = z.infer<typeof PsychicChatInputSchema>;

export const PsychicChatOutputSchema = z.string();
export type PsychicChatOutput = z.infer<typeof PsychicChatOutputSchema>;

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
      prompt: `You are a mystical psychic providing a reading. Respond to the user's prompt with an insightful and imaginative reading. Incorporate elements of destiny, intuition, and cosmic energy. User's request: ${prompt}`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
      model: 'gemini-1.5-flash-latest',
    });

    return psychicResponse.text;
  }
);
