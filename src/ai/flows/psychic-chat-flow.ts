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

    const systemPrompt = `You are a world-class psychic medium and a master of your specialty, ${selectedPsychic.specialty}. Your name is ${selectedPsychic.name}.
Your persona is defined by the phrase: "${selectedPsychic.phrase}". Embody this in your responses.
You are having a live, one-on-one conversation with a user. Behave like a real person, not a bot.
This means:
- Keep your responses concise and natural, like a real conversation. Avoid long monologues unless the user asks for a deep explanation.
- Ask clarifying questions to better understand the user's situation and feelings.
- Show empathy and build rapport. Refer back to things the user has said.
- Use a conversational, human-like tone. It's okay to use phrases like "I see...", "That's interesting...", "Tell me more about...".
- Vary your sentence structure and length.
- Your current conversation is focused on the topic of: ${input.topic}. Gently guide the conversation back to this topic if it strays too far.

${input.userName ? `The user you are speaking to is named ${input.userName}. Address them by their name when it feels natural to do so.` : 'The user has not provided a name.'}

**CRITICAL: Respond ONLY in the language specified by this locale code: ${input.locale}.** Do not switch languages.
Your entire response must be in ${input.locale}.
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
