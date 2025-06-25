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
      prompt: `Generar una carta natal astrológica circular, con un diseño elegante y místico, en un fondo oscuro con tonos de azul profundo y morado. Agregar detalles en dorado que evoquen la sensación de un antiguo mapa celestial o un artefacto cósmico.

La carta debe incluir de manera destacada los 12 símbolos de los signos zodiacales dispuestos en la circunferencia del círculo, asegurándose de que sean fácilmente legibles. En el centro de la carta, crear un diseño abstracto que represente la interconexión de los planetas y los aspectos astrológicos. Punto crítico: Las líneas que representan las conexiones deben ser el foco principal del centro. Utilizar líneas nítidas, definidas y brillantes. Cada línea debe tener un color distinto (rojo, azul, verde) para ser fácilmente diferenciable. Las líneas no deben superponerse de forma desordenada; deben cruzarse de manera limpia y geométrica, creando un patrón que sea a la vez complejo y claro, fácil de leer y estéticamente agradable.

Incluir representaciones simbólicas de los siguientes signos astrológicos sin mostrar los nombres o posiciones planetarias exactas:

Sol en ${input.sunSign}

Luna en ${input.moonSign}

Ascendente (Rising) en ${input.ascendantSign}

El diseño debe ser puramente artístico, con un enfoque místico y profundo que capture la esencia de una carta natal, sin mostrar detalles excesivos o posiciones planetarias exactas.`,
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
