
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
import type { ZodiacSignName } from '@/types'; // Import ZodiacSignName

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
export type AspectDetail = z.infer<typeof AspectDetailSchema>;


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
    schema: NatalChartOutputSchema.omit({ planetPositions: true, aspectsDetails: true }),
    format: 'json', // Ensure JSON output
  },
  prompt: `Eres un astrólogo experto, sabio y elocuente. Tu tarea es proporcionar explicaciones claras y perspicaces para los componentes principales de una carta natal.

Datos de nacimiento del usuario:
- Fecha: {{birthDate}}
- Hora: {{birthTime}}
- Ciudad: {{birthCity}}
- País: {{birthCountry}}

He calculado los siguientes signos clave:
- Sol: {{sunSign}}
- Luna: {{moonSign}}
- Ascendente: {{ascendantSign}}

Tu respuesta DEBE ser un objeto JSON con las siguientes 7 claves: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "houses", y "aspects". NO incluyas "aspectsDetails".

Escribe una explicación personalizada y detallada para CADA UNA de las 7 secciones, adaptando la profundidad al "Nivel de Detalle: {{detailLevel}}". Las explicaciones deben ser coherentes con los datos proporcionados.

1.  **Explicación del Sol (clave "sun"):** Detalla el significado de tener el Sol en **{{sunSign}}**, conectándolo con la identidad central del usuario.
2.  **Explicación de la Luna (clave "moon"):** Detalla el significado de tener la Luna en **{{moonSign}}**, conectándolo con el mundo emocional del usuario.
3.  **Explicación del Ascendente (clave "ascendant"):** Detalla el significado de tener el Ascendente en **{{ascendantSign}}**, explicando su rol como la 'máscara' social y el camino de vida.
4.  **Planetas Personales (clave "personalPlanets"):** Ofrece una explicación general de Mercurio, Venus y Marte.
5.  **Planetas Transpersonales (clave "transpersonalPlanets"):** Ofrece una explicación general de Júpiter, Saturno, Urano, Neptuno y Plutón.
6.  **Las Casas Astrológicas (clave "houses"):** Explica de forma general qué son las 12 casas astrológicas.
7.  **Aspectos Importantes (clave "aspects"):** Explica de forma general qué son los aspectos (conjunción, oposición, trígono, cuadratura, etc.).

Genera el objeto JSON con estas 7 explicaciones en el idioma {{locale}}.
`
});

// Helper function to get sign based on absolute degree
const getSignFromDegree = (degree: number): ZodiacSignName => {
  const d = degree % 360;
  if (d < 30) return 'Aries';
  if (d < 60) return 'Taurus';
  if (d < 90) return 'Gemini';
  if (d < 120) return 'Cancer';
  if (d < 150) return 'Leo';
  if (d < 180) return 'Virgo';
  if (d < 210) return 'Libra';
  if (d < 240) return 'Scorpio';
  if (d < 270) return 'Sagittarius';
  if (d < 300) return 'Capricorn';
  if (d < 330) return 'Aquarius';
  return 'Pisces';
};


// Helper function to calculate aspects deterministically
function calculateAspects(planetPositions: Record<string, { sign: string; degree: number }>): AspectDetail[] {
  const planets = Object.entries(planetPositions);
  const aspects: AspectDetail[] = [];
  const orbs = { 'Conjunción': 8, 'Oposición': 8, 'Trígono': 8, 'Cuadratura': 7, 'Sextil': 5 };
  const aspectAngles = { 'Conjunción': 0, 'Oposición': 180, 'Trígono': 120, 'Cuadratura': 90, 'Sextil': 60 };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1Name = planets[i][0];
      const p2Name = planets[j][0];
      const p1Degree = planets[i][1].degree;
      const p2Degree = planets[j][1].degree;

      const angleDiff = Math.abs(p1Degree - p2Degree);
      const normalizedAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;

      for (const [aspectName, aspectAngle] of Object.entries(aspectAngles)) {
        const orb = orbs[aspectName as keyof typeof orbs];
        if (Math.abs(normalizedAngle - aspectAngle) <= orb) {
          aspects.push({
            body1: capitalize(p1Name),
            body2: capitalize(p2Name),
            type: aspectName,
            degree: parseFloat(normalizedAngle.toFixed(1)),
            explanation: `Un aspecto de ${aspectName.toLowerCase()} entre ${capitalize(p1Name)} y ${capitalize(p2Name)}. Este aspecto sugiere una interacción dinámica entre dos áreas de tu vida. (Explicación genérica).`
          });
          break; // Find the tightest aspect and move on
        }
      }
    }
  }
  return aspects;
}


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

    // --- Dynamic Planet Positions for the Chart Wheel (Simplified & Deterministic) ---
    const degrees = {
      sun: (15 + ((birthDateObj.getMonth() * 30 + birthDateObj.getDate()) % 360)),
      moon: ((birthDateObj.getDate() * 12) % 360),
      ascendant: ((birthHour * 15) % 360),
      mercury: ((birthDateObj.getMonth() + 1) * 28 % 360),
      venus: ((birthDateObj.getMonth() + 2) * 30 % 360),
      mars: ((birthDateObj.getDate() + 3) * 18 % 360),
      jupiter: ((birthDateObj.getFullYear()) * 30 % 360),
      saturn: ((birthDateObj.getFullYear() + 2) * 12 % 360),
    };

    const chartData = {
      sun: { sign: getSignFromDegree(degrees.sun), degree: degrees.sun },
      moon: { sign: getSignFromDegree(degrees.moon), degree: degrees.moon },
      ascendant: { sign: getSignFromDegree(degrees.ascendant), degree: degrees.ascendant },
      mercury: { sign: getSignFromDegree(degrees.mercury), degree: degrees.mercury },
      venus: { sign: getSignFromDegree(degrees.venus), degree: degrees.venus },
      mars: { sign: getSignFromDegree(degrees.mars), degree: degrees.mars },
      jupiter: { sign: getSignFromDegree(degrees.jupiter), degree: degrees.jupiter },
      saturn: { sign: getSignFromDegree(degrees.saturn), degree: degrees.saturn },
    };
    
    // Call AI prompt for text explanations
    const promptInput = {
      ...input,
      sunSign: chartData.sun.sign,
      moonSign: chartData.moon.sign,
      ascendantSign: chartData.ascendant.sign,
    };

    let aiOutput: Omit<NatalChartOutput, 'planetPositions' | 'aspectsDetails'> = {
        sun: '', moon: '', ascendant: '', personalPlanets: '', transpersonalPlanets: '', houses: '', aspects: ''
    };

    try {
        const { output } = await natalChartPrompt(promptInput);
        if (!output) {
            throw new Error("AI prompt returned no output.");
        }
        aiOutput = output;

    } catch (error: any) {
        console.error(`Natal chart text generation failed for ${input.birthDate}. Error: ${error.message}`);
        // Fallback to generic explanations
        aiOutput = {
            sun: `Ocurrió un error al generar la explicación para tu Sol en ${promptInput.sunSign}. Esto puede ser un problema temporal con el servicio de IA. Por favor, inténtalo de nuevo más tarde. Generalmente, el Sol representa tu identidad central y tu ego.`,
            moon: `Ocurrió un error al generar la explicación para tu Luna en ${promptInput.moonSign}. La Luna rige tu mundo emocional y tus instintos.`,
            ascendant: `Ocurrió un error al generar la explicación para tu Ascendente en ${promptInput.ascendantSign}. El Ascendente es la máscara que muestras al mundo.`,
            personalPlanets: "Ocurrió un error al generar la explicación de los planetas personales. Por favor, inténtalo de nuevo más tarde.",
            transpersonalPlanets: "Ocurrió un error al generar la explicación de los planetas transpersonales. Por favor, inténtalo de nuevo más tarde.",
            houses: "Ocurrió un error al generar la explicación de las casas. Por favor, inténtalo de nuevo más tarde.",
            aspects: "Ocurrió un error al generar la explicación general de los aspectos. Por favor, inténtalo de nuevo más tarde.",
        };
    }
    
    // Calculate aspects deterministically
    const aspectsDetails = calculateAspects(chartData);
    
    return {
      ...aiOutput,
      planetPositions: chartData,
      aspectsDetails: aspectsDetails, // Add the reliably calculated aspects
    };
  }
);

// Exported function
export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
