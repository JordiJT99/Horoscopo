
'use server';
/**
 * @fileOverview A Genkit flow to generate zodiac sign compatibility reports.
 *
 * - getCompatibilityReportFlow - A function that calls the compatibility report generation flow.
 * - CompatibilityReportInput - The input type for the flow.
 * - CompatibilityReportOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';

// Helper to create a Zod enum from the ZodiacSignName type values
const zodSignEnum = z.enum(ALL_SIGN_NAMES as [ZodiacSignName, ...ZodiacSignName[]]);

const CompatibilityReportInputSchema = z.object({
  sign1: zodSignEnum.describe('The first zodiac sign.'),
  sign2: zodSignEnum.describe('The second zodiac sign.'),
  locale: z.string().describe('The locale (e.g., "en", "es") for the report language.'),
});
export type CompatibilityReportInput = z.infer<typeof CompatibilityReportInputSchema>;

const CompatibilityReportOutputSchema = z.object({
  report: z.string().describe('A detailed compatibility report discussing general dynamics, professional aspects, and love relationship dynamics. Should be 2-3 paragraphs long.'),
  score: z.number().min(1).max(5).describe('A compatibility score from 1 (low) to 5 (high).'),
});
export type CompatibilityReportOutput = z.infer<typeof CompatibilityReportOutputSchema>;

// In-memory cache for compatibility reports
const compatibilityCache = new Map<string, CompatibilityReportOutput>();

const compatibilityPrompt = ai.definePrompt({
  name: 'compatibilityReportPrompt',
  input: {schema: CompatibilityReportInputSchema},
  output: {schema: CompatibilityReportOutputSchema},
  prompt: `Eres un astrólogo experto especializado en la compatibilidad de los signos del zodiaco.
Genera un informe de compatibilidad detallado para {{sign1}} y {{sign2}} en el idioma {{locale}}.

El informe debe tener entre 2 y 3 párrafos de longitud.
Debe discutir sus dinámicas generales, su potencial en un entorno profesional y sus dinámicas en una relación amorosa.
Adopta un léxico perspicaz, que considere los contrastes, el potencial de crecimiento y la complementariedad mutua.

Aquí tienes un ejemplo del estilo deseado para Aries y Tauro:
"Aries y Tauro son un signo cardinal y fijo por ese orden, lo que supone que se encuentran en posiciones relativamente opuestas para todo. En general, si aprenden a ser complementos mutuos, su unión puede resultar muy provechosa, ya que lo que le falta a una parte, la otra lo suple completamente. En el ámbito profesional su actitud suele ser diferente; Aries es quien propone y Tauro quien dispone, por eso, y especialmente en este caso, su relación tiende a ser muy fructífera. Si Aries representa la fuerza y a las ideas renovadoras, Tauro representa a la parte juiciosa y racional de la asociación… Esta es la esencia de su éxito.

Cuando se trata de amor, Aries y Tauro también son distintos; si estas dos personas se encuentran, es difícil que Tauro dé el primer paso, casi seguro que será el signo de Aries quien lo haga. Sin embargo, una vez que su relación se asiente, será Tauro quien propicie el desarrollo de la misma. En cualquier caso, su historia puede ser muy bonita y enriquecedora, Aries será la parte más activa de la unión y Tauro la más reflexiva. El riesgo que corren es que no se pongan de acuerdo y caigan en los reproches constantemente, pero si consiguen superar esto, su amor será tan grande como los contrastes que pueden existir en una relación tan rica y delicada como profunda."

Proporciona también una puntuación de compatibilidad de 1 (baja) a 5 (alta).
Tu respuesta debe ser un objeto JSON con las claves 'report' (string) y 'score' (number).
No incluyas ninguna explicación adicional fuera del objeto JSON.
Asegúrate de que el informe generado para {{sign1}} y {{sign2}} siga este estilo y profundidad.
`,
});

const getCompatibilityReportFlowInternal = ai.defineFlow(
  {
    name: 'getCompatibilityReportFlowInternal',
    inputSchema: CompatibilityReportInputSchema,
    outputSchema: CompatibilityReportOutputSchema,
  },
  async (input) => {
    // Normalize sign order for cache key to ensure (Aries, Taurus) and (Taurus, Aries) use the same cache entry
    const sortedSigns = [input.sign1, input.sign2].sort();
    const cacheKey = `${sortedSigns[0]}-${sortedSigns[1]}-${input.locale}`;

    if (compatibilityCache.has(cacheKey)) {
      console.log(`Cache hit for compatibility: ${cacheKey}`);
      return compatibilityCache.get(cacheKey)!;
    }
    console.log(`Cache miss for compatibility: ${cacheKey}. Generating new report.`);

    const {output} = await compatibilityPrompt(input);
    if (!output) {
      throw new Error('Compatibility report AI provided no output.');
    }
    // Ensure score is an integer if it comes back as float
    output.score = Math.round(output.score);
    if (output.score < 1) output.score = 1;
    if (output.score > 5) output.score = 5;
    
    compatibilityCache.set(cacheKey, output); // Store the generated report in cache
    return output;
  }
);

export async function getCompatibilityReportFlow(input: CompatibilityReportInput): Promise<CompatibilityReportOutput> {
  return getCompatibilityReportFlowInternal(input);
}

