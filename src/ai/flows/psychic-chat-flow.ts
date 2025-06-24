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
import type { ChatMessage } from '@/types';
import type {MessageData} from 'genkit';

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// This is the schema for the data passed *into* the Genkit flow.
const PsychicChatInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe("The conversation history, with the newest message at the end."),
  locale: z.string().describe("The locale (e.g., 'en', 'es') for the response language."),
  userName: z.string().optional().describe("The name of the user, if available."),
  psychicId: z.string().describe("The ID of the selected psychic."),
  topic: z.string().describe("The topic of the reading selected by the user."),
});
type PsychicChatInput = z.infer<typeof PsychicChatInputSchema>;

export type PsychicChatOutput = string;

// The exported function that the client component will call.
// It accepts primitive types to avoid serialization issues with objects in Server Actions.
export async function psychicChat(messages: ChatMessage[], locale: Locale, psychicId: string, topic: string, userName?: string): Promise<PsychicChatOutput> {
  const input: PsychicChatInput = { messages, locale, psychicId, topic, userName };
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

    // New, more balanced system prompt
    const systemPrompt = `You are ${selectedPsychic.name}, a world-class psychic medium specializing in ${selectedPsychic.specialty}.
Your persona: "${selectedPsychic.phrase}".
You are in a live, one-on-one conversation with a user. Your goal is to provide insightful, empathetic, and predictive guidance based on the conversation.
Maintain a natural, human-like conversational style.

**Your Conversational Style:**
- **Provide Insight:** Your primary goal is to offer psychic insights, predictions, and guidance related to the user's questions and the topic of "${input.topic}". Use the entire conversation history to inform your responses and remember what the user has told you.
- **Be Conversational, Not an Interrogator:** While you can ask clarifying questions to understand better, your main role is to provide answers and guidance. Balance your questions with statements and insights. Do not just ask questions back-to-back.
- **Natural Language:** Keep responses concise and natural. Avoid long monologues. Use phrases like "I sense that...", "The energy I'm picking up suggests...", "Tell me more if you feel comfortable, but what I'm seeing is...".
- **Show Empathy:** Acknowledge the user's feelings. Refer back to things they've said earlier in the conversation to show you are listening.
- **Personalize:** ${input.userName ? `The user you are speaking to is named ${input.userName}. Address them by their name when it feels natural to do so.` : 'The user has not provided a name.'}

**The Topic:**
The reading is focused on: ${input.topic}. Gently guide the conversation back to this topic if it strays too far, but allow it to flow naturally.

**Language:**
**CRITICAL: Respond ONLY in the language specified by this locale code: ${input.locale}.** Your entire response must be in ${input.locale}.
`;

    // Map the input messages to the format Genkit expects for history
    const history: MessageData[] = input.messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
    }));
    
    // The last message is the new prompt, which will be passed to `generate`
    const latestMessage = history.pop();
    if (!latestMessage) {
        throw new Error("No messages provided to the psychic chat flow.");
    }
    const prompt = latestMessage.parts[0].text;

    const psychicResponse = await ai.generate({
      prompt: prompt, // The newest message from the user.
      system: systemPrompt,
      history: history, // The rest of the conversation history.
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    return psychicResponse.text;
  }
);
