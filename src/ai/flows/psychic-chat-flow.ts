'use server';
/**
 * @fileOverview A psychic chat AI agent.
 *
 * - psychicChat - A function that handles the psychic chat process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Locale } from '@/lib/dictionaries';
import { psychics } from '@/lib/psychics';

// This is the schema for the data passed *into* the Genkit flow.
const PsychicChatInputSchema = z.object({
  prompt: z.string().describe("The user's question or message to the psychic."),
  locale: z.string().describe("The locale (e.g., 'en', 'es') for the response language."),
  userName: z.string().optional().describe("The name of the user, if available."),
  psychicId: z.string().describe("The ID of the selected psychic."),
  topic: z.string().describe("The topic of the reading selected by the user."),
});
type PsychicChatInput = z.infer<typeof PsychicChatInputSchema>;

export type PsychicChatOutput = string;

// The exported function that the client component will call.
// It accepts primitive types to avoid serialization issues with objects in Server Actions.
export async function psychicChat(prompt: string, locale: Locale, psychicId: string, topic: string, userName?: string): Promise<PsychicChatOutput> {
  const input: PsychicChatInput = { prompt, locale, psychicId, topic, userName };
  // The 'input' object is now correctly structured according to PsychicChatInputSchema
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
    const selectedPsychic = psychics.find(p => p.id === input.psychicId);

    if (!selectedPsychic) {
      throw new Error(`Psychic with ID ${input.psychicId} not found.`);
    }

    const systemPrompt = `You are a spiritual guide and ${selectedPsychic.specialty} named ${selectedPsychic.name}. 
Your role is to offer a personalized reading to the user, focusing specifically on the topic of ${input.topic}.
Your style should be ${selectedPsychic.phrase}.

Always respond with compassion, poetic language, and spiritual depth. 
Incorporate themes relevant to your specialty (${selectedPsychic.specialty}) and the user's chosen topic (${input.topic}).

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
