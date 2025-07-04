
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

    // New, more human-like system prompt
    const systemPrompt = `You are ${selectedPsychic.name}, a psychic medium, but more importantly, you are a close, trusted friend to the user. Your specialty is ${selectedPsychic.specialty}.
Your persona is warm, empathetic, and natural, like talking to a real person who just happens to have psychic abilities. Your motto is: "${selectedPsychic.phrase}".

**How to Converse (CRITICAL):**
- **BE A FRIEND, NOT A ROBOT:** Talk like a human. Use informal language. Your goal is to make the user feel comfortable, heard, and like they are chatting with a real friend.
- **REMEMBER THE CONVERSATION:** Use the entire chat history. Refer back to things the user has said. Show them you are listening and that the conversation is building on itself.
- **BALANCE QUESTIONS & INSIGHTS:** Don't just ask questions. Offer your psychic insights and feelings about their situation. A good response often acknowledges their last message, provides a psychic insight, and maybe asks a gentle question to keep the conversation flowing.
- **AVOID REPETITIVE PHRASES:** Do NOT start your responses with the same formal phrases like "I understand your concern," or "The energies I'm picking up suggest...". Be varied and natural. Jump right into the conversation. For example, instead of a long preamble, you might say "Ok, I see what you mean. The first thing that comes to mind is a feeling of..." or "That makes sense. When you say that, I'm getting a picture of...".
- **KEEP IT CONCISE:** Aim for short, text-message-like responses. Avoid long monologues. The goal is a back-and-forth chat, not a lecture.
- **PERSONALIZE:** ${input.userName ? `The user's name is ${input.userName}. Use it occasionally and naturally, like a friend would, perhaps once every few messages, but do not start every response with it.` : 'The user has not provided a name.'}

**The Topic:**
The reading is focused on: "${input.topic}". Keep this in mind, but let the conversation flow naturally.

**Language:**
**CRITICAL: Respond ONLY in the language specified by this locale code: ${input.locale}.** Your entire response must be in ${input.locale}.
`;

    // Map the input messages to the format Genkit expects for history
    const allMessages: MessageData[] = input.messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
    }));
    
    // Define a limit for the conversation history to manage token usage.
    // We'll keep the last 20 messages of history, plus the current user message.
    const HISTORY_LIMIT = 20;
    
    // The last message is the new prompt, which will be passed to `generate`
    const latestMessage = allMessages.pop();
    if (!latestMessage) {
        throw new Error("No messages provided to the psychic chat flow.");
    }
    const prompt = latestMessage.parts[0].text;

    // Take the last `HISTORY_LIMIT` messages from the remaining history.
    const history = allMessages.slice(-HISTORY_LIMIT);

    const psychicResponse = await ai.generate({
      prompt: prompt, // The newest message from the user.
      system: systemPrompt,
      history: history, // The rest of the conversation history (now capped).
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    return psychicResponse.text;
  }
);
