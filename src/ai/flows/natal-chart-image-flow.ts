
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

// In-memory cache for the generated image URL
let cachedImageUrl: string | null = null;

export const natalChartImageFlow = ai.defineFlow(
  {
    name: 'natalChartImageFlow',
    inputSchema: NatalChartImageInputSchema,
    outputSchema: NatalChartImageOutputSchema,
  },
  async (input) => {
    // If we have a cached image, return it immediately to avoid API calls
    if (cachedImageUrl) {
      console.log("Returning cached natal chart image.");
      return { imageUrl: cachedImageUrl };
    }

    console.log("No cached image found. Generating a new natal chart image...");

    const prompt = `Generate a visually appealing background for a natal chart wheel. The image should feature a dark, cosmic, or nebula-like background. In the center, draw a large circle divided into 12 equal 30-degree segments, representing the zodiac. Along the outer edge of this circle, place the 12 standard astrological glyphs for the zodiac signs (Aries, Taurus, etc.), one in each segment. The style should be clean, modern, and mystical. Do not include any text, numbers, or planetary glyphs inside the wheel; only the outer zodiac glyphs.`;

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media || !media.url) {
        throw new Error('Generated media is not a valid image with a URL.');
      }

      // Cache the successfully generated image URL
      cachedImageUrl = media.url;
      console.log("Successfully generated and cached new natal chart image.");
      return { imageUrl: cachedImageUrl };

    } catch (error: any) {
      console.error(`Natal chart image generation failed. Error: ${error.message}`);
      // Fallback to a placeholder image URL, but do NOT cache the error
      return { imageUrl: 'https://placehold.co/400x400/1a1a1a/ffffff.png?text=Chart+Unavailable' };
    }
  }
);
