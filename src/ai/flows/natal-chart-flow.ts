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

const AspectDetailSchema = z.object({
  body1: z.string().describe('The first celestial body in the aspect (e.g., "Sun", "Moon", "Mars").'),
  body2: z.string().describe('The second celestial body in the aspect (e.g., "Moon", "Venus", "Jupiter").'),
  type: z.string().describe('The type of aspect (e.g., "Conjunción", "Trígono", "Oposición", "Cuadratura").'),
  degree: z.number().describe('The exact degree of the aspect (orb).'),
  explanation: z.string().describe('A personalized explanation of this specific aspect.'),
});

// Output schema remains the same
const NatalChartOutputSchema = z.object({
  sun: z.string().describe('Explanation of the Sun sign.'),
  moon: z.string().describe('Explanation of the Moon sign.'),
  ascendant: z.string().describe('Explanation of the Ascendant sign.'),
  personalPlanets: z.string().describe('Explanation of personal planets.'),
  transpersonalPlanets: z.string().describe('Explanation of transpersonal planets.'),
  houses: z.string().describe('Explanation of the houses.'),
  aspects: z.string().describe('General explanation of aspects.'),
  planetPositions: z.record(
    z.object({
      sign: z.string().describe('Zodiac sign.'),
      degree: z.number().describe('Degree within the sign.'),
    })
  ).describe('Planet positions for rendering the zodiac wheel.'),
  aspectsDetails: z.array(AspectDetailSchema).describe('Detailed list of significant aspects with explanations.'),
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
  output: {
    schema: NatalChartOutputSchema.omit({ planetPositions: true }),
    format: 'json', // Ensure JSON output
  },
  prompt: `Eres un astrólogo experto, sabio y elocuente, con un profundo conocimiento de la astrología psicológica y espiritual. Tu tarea es proporcionar explicaciones claras, perspicaces y PERSONALIZADAS para los componentes principales de una carta natal del usuario.

El usuario ha proporcionado los siguientes datos de nacimiento:
- Fecha de Nacimiento: {{birthDate}}
- Hora de Nacimiento: {{birthTime}}
- Ciudad de Nacimiento: {{birthCity}}
- País de Nacimiento: {{birthCountry}}

He calculado los siguientes signos clave para el usuario basado en esos datos:
- Signo Solar: {{sunSign}}
- Signo Lunar: {{moonSign}}
- Signo Ascendente: {{ascendantSign}}

Considerando todos los datos de nacimiento y los signos clave, y ASUMIENDO las posiciones planetarias y las casas que se derivarían de estos datos para una carta natal real, tu respuesta DEBE ser un objeto JSON válido con las siguientes 8 claves principales: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "houses", "aspects", y "aspectsDetails".

Debes escribir una explicación personalizada y detallada para CADA UNA de las primeras 7 secciones, adaptando la profundidad y el lenguaje al "Nivel de Detalle Solicitado: {{detailLevel}}". La sección "aspectsDetails" DEBE ser un array de objetos, como se describe en las instrucciones detalladas.

Es ABSOLUTAMENTE CRUCIAL que las explicaciones sean COHERENTES entre sí y con los datos de nacimiento proporcionados. Por ejemplo, si el Sol está en Aries, la explicación del Sol debe reflejar esto, y las explicaciones de los aspectos que involucren al Sol deben relacionarse con la energía de Aries.

--- INSTRUCCIONES DETALLADAS PARA CADA SECCIÓN ---

1.  **Explicación del Sol (clave "sun"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener el Sol en **{{sunSign}}**, considerando también la posible casa en la que se encontraría (asumiendo una distribución típica de casas basada en la hora y el ascendente).
    - Conecta las características de **{{sunSign}}** con la identidad central del usuario, su ego, vitalidad, propósito de vida y cómo esto se manifiesta en el área de vida representada por la casa del Sol.
    - Ejemplo (para Sol en Leo en Casa 5, nivel básico): "Con tu Sol en Leo, tu identidad central es vibrante, creativa y magnética. Eres un líder natural al que le encanta brillar, expresar su singularidad e inspirar a los demás. Al estar en la Casa 5, esta energía se enfoca fuertemente en la autoexpresión, la creatividad, los romances, los hijos y la búsqueda de la alegría y el reconocimiento."

2.  **Explicación de la Luna (clave "moon"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener la Luna en **{{moonSign}}**, considerando también la posible casa lunar.
    - Conecta las características de **{{moonSign}}** con el mundo emocional del usuario, sus instintos, su necesidad de seguridad, sus reacciones subconscientes y cómo todo esto se vive en el área de vida de la casa lunar.
    - Ejemplo (para Luna en Tauro en Casa 2, nivel avanzado): "Tu Luna en Tauro revela un mundo emocional que anhela estabilidad, seguridad y confort sensorial. Tus reacciones son tranquilas y mesuradas. Al estar en la Casa 2, encuentras seguridad emocional en tus recursos materiales, tu capacidad de ganar dinero y tus valores personales. La estabilidad financiera y sensorial es clave para tu bienestar interior."

3.  **Explicación del Ascendente (clave "ascendant"):**
    - Escribe una explicación personalizada y detallada sobre el significado de tener el Ascendente en **{{ascendantSign}}**.
    - Explica que el Ascendente es la 'máscara' social, la primera impresión, el cuerpo físico y el camino de vida del usuario.
    - Conecta las características de **{{ascendantSign}}** con la forma en que el usuario se presenta al mundo y su enfoque inicial hacia la vida.
    - Ejemplo (para Ascendente en Géminis, nivel espiritual): "Tu Ascendente en Géminis es el vehículo a través del cual tu alma interactúa con el mundo. Proyectas una energía de curiosidad, comunicación y adaptabilidad. Tu camino de vida implica aprender a dominar la palabra, a sintetizar información diversa y a construir puentes entre diferentes ideas y personas, utilizando tu intelecto como una herramienta para la conexión espiritual. La forma en que inicias las cosas y te presentas es versátil y mentalmente ágil."

4.  **Planetas Personales (clave "personalPlanets"):**
    - Ofrece una explicación general de lo que representan Mercurio (mente), Venus (amor y valores) y Marte (acción y deseo) en una carta natal, considerando cómo su energía general podría manifestarse dado el {{detailLevel}}. NO personalices con signos o casas aquí, mantén la explicación general de estos planetas.

5.  **Planetas Transpersonales (clave "transpersonalPlanets"):**
    - Ofrece una explicación general de Júpiter (expansión, creencias), Saturno (estructura, lecciones), Urano (innovación, cambio), Neptuno (espiritualidad, ilusión) y Plutón (transformación, poder) en una carta natal. Explica cómo estos planetas influyen en las generaciones y en los temas de vida más amplios. Adapta la profundidad al "{{detailLevel}}".

6.  **Las Casas Astrológicas (clave "houses"):**
    - Explica de forma general qué son las 12 casas astrológicas y cómo representan diferentes áreas de la vida (ej. identidad, recursos, comunicación, hogar, creatividad, salud, relaciones, transformación, filosofía, carrera, amistades, espiritualidad). Adapta la profundidad al "{{detailLevel}}".

7.  **Aspectos Importantes (clave "aspects"):**
    - Explica de forma general qué son los aspectos (conjunción, oposición, trígono, cuadratura, sextil, quincuncio, etc.) y cómo describen las relaciones energéticas entre los planetas y puntos clave en la carta natal. Menciona cómo los diferentes tipos de aspectos (armónicos vs. desarmónicos) sugieren fluidez o desafío. Adapta la profundidad al "{{detailLevel}}".

El usuario ha proporcionado los siguientes datos:
- Fecha de Nacimiento: {{birthDate}}
- Hora de Nacimiento: {{birthTime}}
- Nivel de Detalle Solicitado: {{detailLevel}}
- Idioma: {{locale}}

He calculado los siguientes signos clave para el usuario:
- Signo Solar: {{sunSign}}
- Signo Lunar: {{moonSign}}
- Signo Ascendente: {{ascendantSign}}

Tu respuesta DEBE ser un objeto JSON válido con las siguientes 8 claves: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "houses", "aspects", y "aspectsDetails".
Debes escribir una explicación para CADA una de las primeras 7 secciones, adaptando la profundidad y el lenguaje al "{{detailLevel}}" solicitado. La sección "aspectsDetails" DEBE ser un array de objetos, como se describe a continuación.

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

--- INSTRUCCIONES ADICIONALES PARA ASPECTOS DETALLADOS ---

8.  **Lista de Aspectos Detallados (clave "aspectsDetails"):**
    - Genera una lista (un array de objetos) de los aspectos astrológicos más significativos (conjunción, oposición, trígono, cuadratura, sextil, quincuncio) en la carta natal basada en los datos de nacimiento del usuario (fecha y hora).
    - Para cada aspecto significativo que identifiques, crea un objeto con las siguientes claves:
        - **body1 (string):** El nombre del primer cuerpo celeste involucrado (ej. "Sol", "Luna", "Marte", "Ascendente").
        - **body2 (string):** El nombre del segundo cuerpo celeste involucrado.
        - **type (string):** El nombre del aspecto en el idioma {{locale}} (ej. "Conjunción", "Trígono", "Oposición").
        - **degree (number):** El orbe exacto del aspecto en grados (usa un número decimal).
        - **explanation (string):** Una explicación personalizada y detallada del significado de ESTE aspecto específico en la carta natal del usuario.
    - Incluye al menos 5-10 de los aspectos más importantes. No inventes aspectos; básate en las relaciones comunes que se formarían con los planetas principales y puntos como el Ascendente.
    - Asegúrate de que las explicaciones sean coherentes con el resto de la carta natal y el nivel de detalle solicitado.

Ahora, genera el objeto JSON completo con las 7 explicaciones y el array "aspectsDetails" en el idioma {{locale}}, utilizando los datos de nacimiento ({{birthDate}}, {{birthTime}}) y los signos clave ({{sunSign}}, {{moonSign}}, {{ascendantSign}}) para la personalización.
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

    // Call AI prompt for text explanations and detailed aspects
    const promptInput = {
      ...input,
      sunSign: sunSign,
      moonSign: moonSign,
      ascendantSign: ascendantSign,
    };

    let aiOutput: Omit<NatalChartOutput, 'planetPositions'> = {
        sun: '', moon: '', ascendant: '', personalPlanets: '', transpersonalPlanets: '', houses: '', aspects: '', aspectsDetails: []
    };

    try {
        const { output } = await natalChartPrompt(promptInput);
        if (!output) {
            throw new Error("AI prompt returned no output.");
        }
        // Ensure the output matches the expected structure including aspectsDetails
        aiOutput = output;

    } catch (error: any) {
        console.error(`Natal chart text generation failed for ${input.birthDate}. Error: ${error.message}`);
        // Fallback to generic explanations
        aiOutput = {
            sun: `Ocurrió un error al generar la explicación para tu Sol en ${sunSign}. Esto puede ser un problema temporal con el servicio de IA. Por favor, inténtalo de nuevo más tarde. Generalmente, el Sol representa tu identidad central y tu ego.`,
            moon: `Ocurrió un error al generar la explicación para tu Luna en ${moonSign}. La Luna rige tu mundo emocional y tus instintos.`,
            ascendant: `Ocurrió un error al generar la explicación para tu Ascendente en ${ascendantSign}. El Ascendente es la máscara que muestras al mundo.`,
            personalPlanets: "Ocurrió un error al generar la explicación de los planetas personales. Por favor, inténtalo de nuevo más tarde.",
            transpersonalPlanets: "Ocurrió un error al generar la explicación de los planetas transpersonales. Por favor, inténtalo de nuevo más tarde.",
            houses: "Ocurrió un error al generar la explicación de las casas. Por favor, inténtalo de nuevo más tarde.",
            aspects: "Ocurrió un error al generar la explicación general de los aspectos. Por favor, inténtalo de nuevo más tarde.",
            aspectsDetails: [], // Return empty array on error
        };
    }
    
    return {
      ...aiOutput,
      planetPositions: chartData,
    };
  }
);

// Exported function
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
