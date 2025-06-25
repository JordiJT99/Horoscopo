'use server';
/**
 * @fileOverview A Genkit flow to generate a stylistic image of a natal chart.
 * This version includes in-memory caching to avoid repeated API calls.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NatalChartImageInputSchema = z.object({
  sunSign: z.string().describe('The user\'s sun sign.'),
  moonSign: z.string().describe('The user\'s moon sign.'),
  ascendantSign: z.string().describe('The user\'s ascendant sign.'),
});
export type NatalChartImageInput = z.infer<typeof NatalChartImageInputSchema>;

const NatalChartImageOutputSchema = z.object({
  imageUrl: z.string().describe('A data URI of the generated image.'),
});
export type NatalChartImageOutput = z.infer<typeof NatalChartImageOutputSchema>;

// In-memory cache for the generated image
let cachedImageUrl: string | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // Cache for 1 hour

const natalChartImageFlowInternal = ai.defineFlow(
  {
    name: 'natalChartImageFlowInternal',
    inputSchema: NatalChartImageInputSchema,
    outputSchema: NatalChartImageOutputSchema,
  },
  async (input) => {
    // Check if a valid cached image exists
    if (cachedImageUrl && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      console.log("Returning cached natal chart image.");
      return { imageUrl: cachedImageUrl };
    }

    console.log("Generating new natal chart image.");
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually stunning, artistic, and mystical image of an astrological natal chart.
      The style should be elegant, with deep cosmic blues, purples, and gold highlights, resembling a celestial map or an ancient artifact.
      The chart should be circular, with zodiac symbols clearly visible around the circumference.
      Incorporate abstract representations of the user's key signs:
      - Sun in ${input.sunSign}
      - Moon in ${input.moonSign}
      - Ascendant (Rising) in ${input.ascendantSign}
      Do not include any legible text or specific planet placements. Focus on the artistic and symbolic representation.
      The overall feeling should be magical, profound, and beautiful.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }
    
    // Cache the new image
    cachedImageUrl = media.url;
    cacheTimestamp = Date.now();

    return { imageUrl: cachedImageUrl };
  }
);

export async function natalChartImageFlow(input: NatalChartImageInput): Promise<NatalChartImageOutput> {
  return natalChartImageFlowInternal(input);
}
