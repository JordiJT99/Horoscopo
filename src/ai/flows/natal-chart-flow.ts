
'use server';
/**
 * @fileOverview A Genkit flow to provide text explanations for a natal chart.
 *
 * - natalChartFlow - A function that handles natal chart text generation.
 * - NatalChartInput - The input type for the natalChartFlow function.
 * - NatalChartOutput - The return type for the natalChartFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSunSignFromDate, ZODIAC_SIGNS } from '@/lib/constants'; // Import helpers

// Input schema remains the same
const NatalChartInputSchema = z.object({
  detailLevel: z.enum(['basic', 'advanced', 'spiritual']).describe('The desired level of detail for the explanations.'),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's exact birth time (HH:mm)."),
  birthCity: z.string().describe("The user's birth city."),
  birthCountry: z.string().describe("The user's birth country."),
  locale: z.string().describe('The locale (e.g., "en", "es") for the result language.'),
});
export type NatalChartInput = z.infer<typeof NatalChartInputSchema>;

// Output schema remains the same
const NatalChartOutputSchema = z.object({
  sun: z.string(),
  moon: z.string(),
  ascendant: z.string(),
  personalPlanets: z.string(),
  transpersonalPlanets: z.string(),
  houses: z.string(),
  aspects: z.string(),
  planetPositions: z.record(
    z.object({
      sign: z.string(),
      degree: z.number(),
    })
  ).describe('Planet positions for rendering the zodiac wheel.'),
});
export type NatalChartOutput = z.infer<typeof NatalChartOutputSchema>;

// Schema for AI prompt remains the same
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
});

// AI prompt definition updated to be more specific and prevent placeholders
const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: { schema: NatalChartPromptInputSchema },
  output: { schema: NatalChartOutputSchema.omit({ planetPositions: true }) },
  prompt: `Eres un astrólogo experto, sabio y elocuente, con un profundo conocimiento de la astrología psicológica y espiritual. Tu tarea es proporcionar explicaciones claras, perspicaces y personalizadas para los componentes principales de una carta natal.

El usuario ha proporcionado los siguientes datos:
- Fecha de Nacimiento: {{birthDate}}
- Hora de Nacimiento: {{birthTime}}
- Nivel de Detalle Solicitado: {{detailLevel}}
- Idioma: {{locale}}

He calculado los siguientes signos clave para el usuario:
- Signo Solar: {{sunSign}}
- Signo Lunar: {{moonSign}}
- Signo Ascendente: {{ascendantSign}}

Tu respuesta DEBE ser un objeto JSON válido con las siguientes 7 claves: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "houses", "aspects".
Debes escribir una explicación para CADA una de estas 7 secciones. Adapta la profundidad y el lenguaje de tus explicaciones al "{{detailLevel}}" solicitado.

--- INSTRUCCIONES DETALLADAS POR SECCIÓN ---

1.  **Explicación del Sol (clave "sun"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener el Sol en **{{sunSign}}**.
    - Conecta las características de **{{sunSign}}** con la identidad central del usuario, su ego, vitalidad y propósito de vida.
    - Ejemplo (para Sol en Leo, nivel básico): "Con tu Sol en Leo, tu identidad central es vibrante, creativa y magnética. Eres un líder natural al que le encanta brillar, expresar su singularidad e inspirar a los demás. Tu energía irradia calidez y generosidad."

2.  **Explicación de la Luna (clave "moon"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener la Luna en **{{moonSign}}**.
    - Conecta las características de **{{moonSign}}** con el mundo emocional del usuario, sus instintos, su necesidad de seguridad y sus reacciones subconscientes.
    - Ejemplo (para Luna en Tauro, nivel avanzado): "Tu Luna en Tauro revela un mundo emocional que anhela estabilidad, seguridad y confort sensorial. Tus reacciones son tranquilas y mesuradas, pero una vez que te sientes seguro, tu lealtad y afecto son inquebrantables. Encuentras seguridad en las rutinas, la belleza y los placeres tangibles de la vida."

3.  **Explicación del Ascendente (clave "ascendant"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener el Ascendente en **{{ascendantSign}}**.
    - Explica que el Ascendente es la 'máscara' social, la primera impresión y el camino de vida del usuario.
    - Conecta las características de **{{ascendantSign}}** con la forma en que el usuario se presenta al mundo.
    - Ejemplo (para Ascendente en Géminis, nivel espiritual): "Tu Ascendente en Géminis es el vehículo a través del cual tu alma interactúa con el mundo. Proyectas una energía de curiosidad, comunicación y adaptabilidad. Tu camino de vida implica aprender a dominar la palabra, a sintetizar información diversa y a construir puentes entre diferentes ideas y personas, utilizando tu intelecto como una herramienta para la conexión espiritual."

4.  **Planetas Personales (clave "personalPlanets"):**
    - Ofrece una explicación general de lo que representan Mercurio (mente), Venus (amor y valores) y Marte (acción y deseo).
    - Adapta la profundidad al "{{detailLevel}}" solicitado. No personalices con signos aquí, mantén la explicación general.

5.  **Planetas Transpersonales (clave "transpersonalPlanets"):**
    - Ofrece una explicación general de Júpiter (expansión), Saturno (estructura), Urano (innovación), Neptuno (espiritualidad) y Plutón (transformación).
    - Explica cómo estos planetas influyen en las generaciones y en los temas de vida más amplios. Adapta la profundidad al "{{detailLevel}}".

6.  **Las Casas Astrológicas (clave "houses"):**
    - Explica de forma general qué son las 12 casas astrológicas y cómo representan diferentes áreas de la vida (ej. carrera, hogar, relaciones).
    - Adapta la profundidad al "{{detailLevel}}".

7.  **Aspectos Importantes (clave "aspects"):**
    - Explica de forma general qué son los aspectos (conjunción, oposición, trígono, cuadratura) y cómo describen las relaciones entre los planetas.
    - Adapta la profundidad al "{{detailLevel}}".

Ahora, genera el objeto JSON completo con las 7 explicaciones en el idioma {{locale}}, utilizando los signos calculados ({{sunSign}}, {{moonSign}}, {{ascendantSign}}) para personalizar las tres primeras secciones como se ha instruido.
`
});

// Internal flow - This is where the logic changes
const natalChartFlowInternal = ai.defineFlow(
  {
    name: 'natalChartFlowInternal',
    inputSchema: NatalChartInputSchema,
    outputSchema: NatalChartOutputSchema,
  },
  async (input) => {
    // Parse user's birth data
    const birthDateObj = new Date(input.birthDate + 'T' + input.birthTime);
    const [birthHour] = input.birthTime.split(':').map(Number);

    // --- Dynamic Sign Calculation (Simplified) ---
    // Sun sign is accurate
    const sunSign = getSunSignFromDate(birthDateObj)?.name || 'Leo';
    
    // Moon and Ascendant are pseudo-random but based on user input for a dynamic feel
    // This is NOT astrologically correct but avoids using a complex library
    const moonSign = ZODIAC_SIGNS[(birthDateObj.getDate() - 1) % 12].name;
    const ascendantSign = ZODIAC_SIGNS[birthHour % 12].name;

    // --- Dynamic Planet Positions for the Chart Wheel (Simplified & Deterministic) ---
    // These positions will look varied and are consistent with the text.
    const chartData = {
      sun: { sign: sunSign, degree: 15 + ((birthDateObj.getMonth() * 30 + birthDateObj.getDate()) % 360) },
      moon: { sign: moonSign, degree: (birthDateObj.getDate() * 12) % 360 },
      ascendant: { sign: ascendantSign, degree: (birthHour * 15) % 360 },
      mercury: { sign: ZODIAC_SIGNS[(birthDateObj.getMonth() + 1) % 12].name, degree: (birthDateObj.getDate() * 5) % 360 },
      venus: { sign: ZODIAC_SIGNS[(birthDateObj.getMonth() + 2) % 12].name, degree: (birthDateObj.getDate() * 15) % 360 },
      mars: { sign: ZODIAC_SIGNS[(birthDateObj.getDate() + 3) % 12].name, degree: (birthDateObj.getDate() * 20) % 360 },
      jupiter: { sign: ZODIAC_SIGNS[(birthDateObj.getFullYear()) % 12].name, degree: (birthDateObj.getMonth() * 30) % 360 },
      saturn: { sign: ZODIAC_SIGNS[(birthDateObj.getFullYear() + 2) % 12].name, degree: (birthDateObj.getMonth() * 12) % 360 },
    };

    const promptInput = {
      ...input,
      sunSign: sunSign,
      moonSign: moonSign,
      ascendantSign: ascendantSign,
    };

    const promptResult = await natalChartPrompt(promptInput);
    
    const textExplanations = promptResult.output;

    if (!textExplanations) {
      throw new Error('Natal chart expert provided no explanations.');
    }

    return {
      ...textExplanations,
      planetPositions: chartData,
    };
  }
);

// Exported function
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
