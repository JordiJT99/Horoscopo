
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

export const natalChartImageFlow = ai.defineFlow(
  {
    name: 'natalChartImageFlow',
    inputSchema: NatalChartImageInputSchema,
    outputSchema: NatalChartImageOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a high-resolution, square background image for an astrological natal chart wheel.
**Theme:** Dark, mystical, cosmic. Use a deep purple and charcoal gray nebula texture.
**Main Feature:** A large, perfect circle in the center.
**Inside the Circle:** Place the 12 standard zodiac glyphs (Aries ♈, Taurus ♉, Gemini ♊, Cancer ♋, Leo ♌, Virgo ♍, Libra ♎, Scorpio ♏, Sagittarius ♐, Capricorn ♑, Aquarius ♒, Pisces ♓) arranged evenly around the edge of the circle.
**Style:**
- The glyphs and any lines should be thin, crisp, and white or light gray.
- The overall aesthetic should be minimalist, modern, and a flat 2D graphic.
- No shadows, gradients, or 3D effects.
**IMPORTANT RESTRICTION:** Do NOT include any planet symbols (like Sun ☉, Moon ☽), numbers, or aspect lines. The image must be a clean, universal background.`;

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

      return { imageUrl: media.url };
    } catch (error: any) {
      console.error(`Natal chart image generation failed. Error: ${error.message}`);
      // Fallback to a placeholder image URL
      return { imageUrl: 'https://placehold.co/400x400/1a1a1a/ffffff.png?text=Chart+Unavailable' };
    }
  }
);
