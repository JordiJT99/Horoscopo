
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

// New schema for structured house placements
const HousePlacementDetailSchema = z.object({
  placement: z.string().describe('The celestial body and house placement (e.g., "Sol en Casa 10").'),
  explanation: z.string().describe('A personalized explanation of this specific placement.'),
});
export type HousePlacementDetail = z.infer<typeof HousePlacementDetailSchema>;


// Output schema updated to include structured housesDetails
const NatalChartOutputSchema = z.object({
  sun: z.string().describe('Explanation of the Sun sign.'),
  moon: z.string().describe('Explanation of the Moon sign.'),
  ascendant: z.string().describe('Explanation of the Ascendant sign.'),
  personalPlanets: z.string().describe('Explanation of personal planets.'),
  transpersonalPlanets: z.string().describe('Explanation of transpersonal planets.'),
  housesIntroduction: z.string().describe('A brief introductory sentence for the houses section.'),
  housesDetails: z.array(HousePlacementDetailSchema).describe('A detailed list of personalized house placements with explanations.'),
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

// Schema for AI prompt now includes planet house placements as a structured object
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
  planetHousePlacements: z.record(z.number()).describe('An object mapping planet names to their house number.'),
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

Tu respuesta DEBE ser un objeto JSON con las siguientes 8 claves: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "housesIntroduction", "housesDetails" y "aspects". NO incluyas "planetPositions" ni "aspectsDetails" en tu respuesta JSON.

Escribe una explicación personalizada y detallada para CADA UNA de las 8 secciones, adaptando la profundidad al "Nivel de Detalle: {{detailLevel}}".

1.  **Explicación del Sol (clave "sun"):** Detalla el significado de tener el Sol en **{{sunSign}}**, conectándolo con la identidad central del usuario.
2.  **Explicación de la Luna (clave "moon"):** Detalla el significado de tener la Luna en **{{moonSign}}**, conectándolo con el mundo emocional del usuario.
3.  **Explicación del Ascendente (clave "ascendant"):** Detalla el significado de tener el Ascendente en **{{ascendantSign}}**, explicando su rol como la 'máscara' social y el camino de vida.
4.  **Planetas Personales (clave "personalPlanets"):** Ofrece una explicación general de Mercurio, Venus y Marte.
5.  **Planetas Transpersonales (clave "transpersonalPlanets"):** Ofrece una explicación general de Júpiter, Saturno, Urano, Neptuno y Plutón.
6.  **Introducción a las Casas (clave "housesIntroduction"):** Escribe una única y breve frase introductoria. Debe ser exactamente: "A continuación, vemos cómo tus planetas personales activan áreas clave de tu vida."
7.  **Detalles de las Casas (clave "housesDetails"):** ¡INSTRUCCIÓN CRÍTICA! Para esta clave, DEBES generar un ARRAY de objetos JSON, uno para cada planeta en la lista de emplazamientos que te proporciono. **NO DES UNA DEFINICIÓN GENÉRICA DE LAS 12 CASAS.**
    Los emplazamientos de planetas en casas son:
    {{#each planetHousePlacements}}
    - {{@key}} en Casa {{this}}
    {{/each}}

    Para CADA UNO de estos emplazamientos, crea un objeto JSON en el array de salida. Cada objeto DEBE tener estas dos claves:
    - "placement": una cadena de texto con el nombre del planeta y la casa (ej: "Sol en Casa 10"). DEBES USAR el planeta y el número de casa de la lista anterior. La primera letra del planeta debe estar en mayúscula.
    - "explanation": una cadena de texto con la interpretación personalizada y detallada para ese emplazamiento específico.
    
    Ejemplo de cómo debe verse el valor de la clave 'housesDetails' si te diera "Sol en Casa 10" y "Luna en Casa 4":
    [
      {
        "placement": "Sol en Casa 10",
        "explanation": "Tu identidad y propósito vital están profundamente ligados a tu carrera y reputación..."
      },
      {
        "placement": "Luna en Casa 4",
        "explanation": "Tus raíces y tu hogar son tu santuario emocional..."
      }
    ]
8.  **Aspectos Importantes (clave "aspects"):** Explica de forma general qué son los aspectos (conjunción, oposición, trígono, cuadratura, etc.).

Genera el objeto JSON con estas 8 explicaciones en el idioma {{locale}}.
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

// Helper function to get the house for a planet using the Whole Sign House system
const getHouseForDegree = (planetDegree: number, ascendantDegree: number): number => {
  // Normalize degrees to be relative to the ascendant
  const relativeDegree = (planetDegree - ascendantDegree + 360) % 360;
  // Each house is 30 degrees in the Whole Sign system
  const house = Math.floor(relativeDegree / 30) + 1;
  return house;
};


// Helper function to calculate aspects deterministically
function calculateAspects(planetPositions: Record<string, { sign: string; degree: number }>): AspectDetail[] {
  const planets = Object.entries(planetPositions);
  const aspects: AspectDetail[] = [];
  // Increased orbs to ensure aspects are always generated
  const orbs = { 'Conjunción': 10, 'Oposición': 10, 'Trígono': 10, 'Cuadratura': 8, 'Sextil': 6 };
  const aspectAngles = { 'Conjunción': 0, 'Oposición': 180, 'Trígono': 120, 'Cuadratura': 90, 'Sextil': 60 };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  const explanationTemplates: Record<string, string> = {
    'Conjunción': `Una Conjunción entre {body1} y {body2} fusiona sus energías. Esto indica un área de gran poder y enfoque en tu vida, donde las características de ambos planetas se combinan intensamente.`,
    'Oposición': `Una Oposición entre {body1} y {body2} crea tensión y conciencia. Te desafía a encontrar un equilibrio entre dos áreas opuestas de tu vida, buscando la integración en lugar del conflicto.`,
    'Trígono': `Un Trígono entre {body1} y {body2} es un aspecto de flujo y armonía. Sus energías colaboran sin esfuerzo, indicando talentos naturales y áreas de la vida donde las cosas tienden a ir bien.`,
    'Cuadratura': `Una Cuadratura entre {body1} y {body2} genera una tensión dinámica que te impulsa a la acción. Representa un desafío interno que, una vez superado, se convierte en una de tus mayores fortalezas.`,
    'Sextil': `Un Sextil entre {body1} y {body2} presenta una oportunidad para el crecimiento. Sus energías se comunican bien, ofreciéndote la oportunidad de desarrollar nuevas habilidades y hacer conexiones creativas.`,
  };

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
          const explanation = (explanationTemplates[aspectName] || `Un aspecto de {type} entre {body1} y {body2} sugiere una interacción dinámica.`)
            .replace('{body1}', capitalize(p1Name))
            .replace('{body2}', capitalize(p2Name))
            .replace('{type}', aspectName.toLowerCase());

          aspects.push({
            body1: capitalize(p1Name),
            body2: capitalize(p2Name),
            type: aspectName,
            degree: parseFloat(normalizedAngle.toFixed(1)),
            explanation: explanation
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
      moon: ((birthDateObj.getDate() * 12 + birthHour * 5) % 360),
      ascendant: ((birthHour * 15 + birthDateObj.getMinutes() / 4) % 360),
      mercury: ((15 + ((birthDateObj.getMonth() * 30 + birthDateObj.getDate()) % 360)) + 20) % 360,
      venus: ((15 + ((birthDateObj.getMonth() * 30 + birthDateObj.getDate()) % 360)) - 35 + 360) % 360,
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

    // Calculate house placements for each planet
    const planetHousePlacements: Record<string, number> = {};
    for (const [planet, data] of Object.entries(chartData)) {
      if (planet !== 'ascendant') { // Ascendant is the cusp of the 1st house, not "in" a house.
        const capitalizedPlanet = planet.charAt(0).toUpperCase() + planet.slice(1);
        planetHousePlacements[capitalizedPlanet] = getHouseForDegree(data.degree, chartData.ascendant.degree);
      }
    }
    
    // Call AI prompt for text explanations
    const promptInput = {
      ...input,
      sunSign: chartData.sun.sign,
      moonSign: chartData.moon.sign,
      ascendantSign: chartData.ascendant.sign,
      planetHousePlacements: planetHousePlacements, // Pass the object
    };

    let aiOutput: Omit<NatalChartOutput, 'planetPositions' | 'aspectsDetails'> = {
        sun: '', moon: '', ascendant: '', personalPlanets: '', transpersonalPlanets: '', 
        housesIntroduction: '', housesDetails: [], aspects: ''
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
            housesIntroduction: "Ocurrió un error al generar la introducción a las casas.",
            housesDetails: [],
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
