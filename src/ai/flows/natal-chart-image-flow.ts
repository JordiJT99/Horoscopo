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

    const prompt = `Generate a visually clear and modern natal chart image with a consistent design.

**Style Guidelines:**
- **Background:** Solid, dark navy blue background, evoking a night sky (#0a0a23).
- **Style:** Clean, minimalist, and modern. Use thin, crisp lines. Avoid vintage, ornate, or hand-drawn styles.
- **Color Palette:** The primary elements of the chart (zodiac wheel, house lines, planet glyphs) should use a glowing, light-colored palette like white, light silver, or a very light cyan. Aspect lines should be thin and colored: red for hard aspects (conjunctions, squares, oppositions) and blue for soft aspects (trines, sextiles).
- **Text:** **CRITICAL: Do NOT generate any text, numbers, or dates on the image.** The image should contain only graphical elements and symbols. No labels for signs, planets, or houses.

**Structural Elements:**
1.  **Outer Ring (Zodiac):** A perfect circle divided into 12 equal 30-degree segments for the zodiac signs.
2.  **Zodiac Glyphs:** Place the standard, universally recognized glyph for each of the 12 zodiac signs (Aries, Taurus, Gemini, etc.) within its segment on the outer ring. The glyphs should be simple, white or light-colored, and easily identifiable.
3.  **Inner Ring (Houses):** Inside the zodiac wheel, draw the 12 house cusps as lines radiating from the center. The lines for the four angles (Ascendant, IC, Descendant, MC) should be slightly thicker or more prominent.
4.  **Planet Glyphs:** Place a few standard planet glyphs (e.g., Sun, Moon, Mars, Venus, Mercury) inside the chart, within different house segments. The glyphs should be clean and modern.
5.  **Aspect Lines:** Draw a few clear aspect lines (red and blue) connecting some of the planet glyphs. The lines should be thin and not clutter the center.

The final image must be a high-resolution, clean, and professional-looking astrological diagram, suitable for a modern web application. It must be simple and easy to understand at a glance.`;

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
  }
);
