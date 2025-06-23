'use server';

import { ai } from '@genkit-ai/ai';
import { defineFlow, z, run } from 'genkit';

const NatalChartImageInputSchema = z.object({
  birthDate: z.string().describe('The date of birth (YYYY-MM-DD).'),
  birthTime: z.string().describe('The time of birth (HH:MM).'),
  birthCity: z.string().describe('The city of birth.'),
  birthCountry: z.string().describe('The country of birth.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for potential text elements in the image.'),
});

export type NatalChartImageInput = z.infer<typeof NatalChartImageInputSchema>;

const NatalChartImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated natal chart image.'),
});

export type NatalChartImageOutput = z.infer<typeof NatalChartImageOutputSchema>;

export const natalChartImageFlow = defineFlow(
  {
    name: 'natalChartImageFlow',
    inputSchema: NatalChartImageInputSchema,
    outputSchema: NatalChartImageOutputSchema,
  },
  async (input) => {
    // Note: This is a conceptual implementation.
    // Calculating exact planet positions requires a dedicated astrology library
    // which is not directly available within the Genkit flow environment by default.
    // A real implementation would involve:
    // 1. Using an external service or library to calculate positions based on input.
    // 2. Passing these calculated positions to the image generation model
    //    either as detailed instructions or by using a model capable of
    //    rendering based on structured data.
    // For this example, we'll create a prompt requesting a generic,
    // aesthetically pleasing natal chart image based on the input data,
    // without calculating precise positions.

    const prompt = `Generate a detailed and visually appealing image of a natal chart.
    The chart should include the circular zodiac wheel with the 12 signs clearly marked.
    Depict the inner houses, lines representing aspects between planetary positions,
    and symbols for the planets.
    The overall style should be aesthetic and mystical.
    Include the birth information subtly on the image if possible, for example:
    Date: ${input.birthDate}, Time: ${input.birthTime}, Location: ${input.birthCity}, ${input.birthCountry}.
    Ensure the image is clear and the astrological symbols are recognizable.
    The text labels (like sign names) should be in the ${input.locale} language if the model supports it, otherwise use English.`;

    const mediaResponse = await ai.generate({
      model: 'gemini-1.5-flash-latest', // Or your preferred Gemini model with vision
      prompt: [{ text: prompt }],
      output: { format: 'media' },
      config: {
        maxOutputTokens: 2048, // Adjust as needed
      }
    });

    if (!mediaResponse.candidates || mediaResponse.candidates.length === 0) {
      throw new Error('Failed to generate natal chart image.');
    }

    const image = mediaResponse.candidates[0].output.media?.[0];

    if (!image || !image.url) {
        throw new Error('Generated media is not a valid image with a URL.');
    }

    return { imageUrl: image.url };
  }
);