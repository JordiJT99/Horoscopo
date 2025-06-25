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
      prompt: `Genera una imagen de una carta natal astrológica con un diseño de alta tecnología y a la vez místico, como un diagrama celestial digital.

**Estilo General:**
- La estética debe ser una mezcla de mapa estelar antiguo y un diagrama digital de alta resolución.
- El fondo es un espacio profundo, una nebulosa con tonos de azul oscuro y morado.
- Prioriza la claridad, la nitidez y la precisión geométrica sobre un estilo pictórico o borroso.

**Estructura del Círculo:**
- La carta debe ser perfectamente circular, centrada en la imagen.
- El borde exterior es un anillo ancho de color azul real oscuro. Sobre este anillo, incrusta los 12 símbolos del zodíaco en un dorado brillante y nítido.
- Dentro del anillo del zodíaco, debe haber múltiples círculos concéntricos dorados, finos y elegantes.
- El círculo más interno debe estar dividido en 12 secciones (casas) por líneas radiales muy tenues y sutiles.

**Líneas de Aspectos (Punto Clave):**
- El centro debe estar lleno de una compleja red de líneas rectas y de colores vivos.
- **CRÍTICO**: Las líneas deben ser muy finas, nítidas y brillantes, como rayos láser de diferentes colores (rojo, verde, azul, amarillo, rosa). Deben cruzarse limpiamente, formando un patrón geométrico claro y ordenado, no un enredo borroso.

**Información a Excluir (MUY IMPORTANTE):**
- **NO dibujes símbolos de planetas** (como ☉, ☽, ♃).
- **NO escribas ningún texto, número o grado**.
- La imagen debe ser una **plantilla de fondo pura** y hermosa. La aplicación se encargará de superponer los planetas y los grados específicos.
`,
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
