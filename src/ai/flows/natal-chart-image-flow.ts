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

    const prompt = `Generate a visually clear and modern natal chart image with a consistent design, closely resembling a professional astrology app UI.

**Style Guidelines:**
- **Background:** The overall image background should be a very dark charcoal color (almost black, like #1a1a1a).
- **Chart Area:** The circular chart itself should have a dark, muted purple-grey background (like #4a4a5a).
- **Style:** Clean, flat, minimalist, and modern UI style. Use thin, crisp lines. Avoid shadows, gradients, or hand-drawn styles.
- **Color Palette:**
    - **Zodiac & House Lines:** Use a light grey color for the lines that divide the zodiac signs and houses.
    - **Zodiac & House Numbers:** The glyphs for the 12 zodiac signs on the outer ring should be white or a very light grey. The numbers for the 12 houses (1 through 12) should be placed inside their respective segments, closer to the center, in a subtle, light grey color.
    - **Planet Glyphs:** Place standard planet glyphs inside the chart. Each planet glyph should have a distinct, soft color, such as muted orange, cyan, pink, or light blue.
    - **Aspect Lines:** Draw clear, thin aspect lines connecting the planet glyphs. Use a palette of red, blue, green, and yellow for these lines.

**Structural Elements (CRITICAL: Adhere strictly):**
1.  **Outer Ring (Zodiac):** A perfect circle divided into 12 equal 30-degree segments for the zodiac signs.
2.  **Zodiac Glyphs:** Place the standard, universally recognized glyph for each of the 12 zodiac signs (Aries, Taurus, etc.) within its segment on the outer ring. The glyphs must be simple and white/light grey.
3.  **Inner Ring (Houses):** Inside the zodiac wheel, draw the 12 house cusps as lines radiating from the center. The lines for the four angles (Ascendant, IC, Descendant, MC) should be slightly thicker.
4.  **House Numbers:** Place the numbers 1 through 12 inside each house segment, near the center. Use a clean, simple, sans-serif font.
5.  **Planet Glyphs:** Place several standard planet glyphs (e.g., Sun, Moon, Mars, Venus) inside the chart, within different house segments. They should be clean, modern, and colored as described above.
6.  **Aspect Lines:** Draw a few clear aspect lines (red, blue, green, yellow) connecting some of the planet glyphs. The lines should be thin and not clutter the center.

**Prohibitions:**
- **Do NOT generate any text other than the house numbers (1-12).** No planet names, no sign names, no degrees, no dates. Only the symbols and house numbers are allowed.

The final image must be a high-resolution, professional-looking astrological diagram that looks like it belongs in a modern mobile app.`;

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
