
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
    // Note: This is a conceptual implementation.
    // Calculating exact planet positions requires a dedicated astrology library.
    // This prompt requests a stylized, consistent, but generic natal chart image.

    const prompt = `Generate a visually clear and modern natal chart background image.

**Style Guidelines:**
- **Overall Background:** A very dark charcoal color, almost black (like #1a1a1a).
- **Chart Area:** The chart is a perfect circle in the center. Its background should be a dark, muted purple-grey (like #4a4a5a).
- **Style:** Clean, flat, minimalist, modern UI style. Use thin, crisp lines. NO shadows, gradients, or hand-drawn effects.

**Structural Elements (CRITICAL):**
1.  **Zodiac Ring:** An outer ring divided into 12 equal 30-degree segments for the zodiac signs. Use light grey lines.
2.  **Zodiac Glyphs:** On the outer ring, place the standard glyph for each of the 12 zodiac signs (Aries, Taurus, etc.) in its segment. The glyphs must be simple and white or very light grey.
3.  **House Cusps:** Inside the zodiac ring, draw 12 house cusp lines radiating from the center. The lines for the four angles (1st, 4th, 7th, 10th house cusps, representing Ascendant, IC, Descendant, MC) should be slightly thicker.
4.  **House Numbers:** Place the numbers 1 through 12 inside each house segment, near the center, in a subtle, light grey, sans-serif font.

**ABSOLUTELY NO Planets or Aspect Lines.** The image should only be the static background wheel with zodiac signs and house numbers. The final image must be a high-resolution, professional astrological diagram suitable for a modern app.`;

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
