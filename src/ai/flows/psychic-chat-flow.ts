import { generate } from '@genkit-ai/ai';
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';

export const psychicChatFlow = defineFlow(
  {
    name: 'psychicChatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const psychicResponse = await generate({
      prompt: `You are a mystical psychic providing a reading. Respond to the user's prompt with an insightful and imaginative reading. Incorporate elements of destiny, intuition, and cosmic energy. User's request: ${prompt}`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
      model: 'gemini-1.5-flash-latest',
    });

    return psychicResponse.text();
  }
);