
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
import { getSignFromDegree } from '@/lib/constants'; // Import the helper

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
  personalPlanets: z.string().describe('Explanation of personal planets based on their signs.'),
  transpersonalPlanets: z.string().describe('Explanation of transpersonal planets based on their signs.'),
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

// Schema for AI prompt now includes all planet signs for personalization
const NatalChartPromptInputSchema = NatalChartInputSchema.extend({
  sunSign: z.string(),
  moonSign: z.string(),
  ascendantSign: z.string(),
  planetHousePlacements: z.record(z.number()).describe('An object mapping planet names to their house number.'),
  planetSigns: z.record(z.string()).describe('An object mapping planet names to their zodiac sign.'),
});

// AI prompt definition updated to be more specific and demand extensive, personalized content
const natalChartPrompt = ai.definePrompt({
  name: 'natalChartPrompt',
  input: { schema: NatalChartPromptInputSchema },
  output: {
    schema: NatalChartOutputSchema.omit({ planetPositions: true, aspectsDetails: true }),
    format: 'json', // Ensure JSON output
  },
  prompt: `Eres un astrólogo experto, sabio y elocuente. Tu tarea es proporcionar explicaciones claras, personalizadas y MUY EXTENSAS para los componentes de una carta natal.

Datos de nacimiento del usuario:
- Fecha: {{birthDate}}
- Hora: {{birthTime}}
- Ciudad: {{birthCity}}
- País: {{birthCountry}}

He calculado los siguientes signos y posiciones clave:
- Sol: {{sunSign}}
- Luna: {{moonSign}}
- Ascendente: {{ascendantSign}}
- Planetas: Mercurio en {{planetSigns.mercury}}, Venus en {{planetSigns.venus}}, Marte en {{planetSigns.mars}}, Júpiter en {{planetSigns.jupiter}}, Saturno en {{planetSigns.saturn}}.

Tu respuesta DEBE ser un objeto JSON con las siguientes 8 claves: "sun", "moon", "ascendant", "personalPlanets", "transpersonalPlanets", "housesIntroduction", "housesDetails" y "aspects". NO incluyas "planetPositions" ni "aspectsDetails".

Para CADA UNA de las 8 secciones, escribe una explicación PROFUNDA y PERSONALIZADA, adaptando el nivel de detalle a "{{detailLevel}}". Evita las descripciones genéricas.

1.  **Sol (clave "sun"):** Ofrece una interpretación PROFUNDA y EXTENSA (varios párrafos) del significado de tener el Sol en **{{sunSign}}**, conectándolo con la identidad central, el propósito de vida y la vitalidad del usuario.
2.  **Luna (clave "moon"):** Ofrece una interpretación PROFUNDA y EXTENSA (varios párrafos) del significado de tener la Luna en **{{moonSign}}**, relacionándolo con su mundo emocional, sus necesidades de seguridad, sus instintos y su relación con el pasado.
3.  **Ascendente (clave "ascendant"):** Ofrece una interpretación PROFUNDA y EXTENSA (varios párrafos) del significado de tener el Ascendente en **{{ascendantSign}}**, explicando su rol como la 'máscara' social, la primera impresión que da y el camino de vida que debe aprender a integrar.
4.  **Planetas Personales (clave "personalPlanets"):** Proporciona una explicación detallada y personalizada para cada planeta personal. **Escribe un párrafo completo y perspicaz para cada uno:**
    - Explica cómo **Mercurio en {{planetSigns.mercury}}** afecta su estilo de comunicación, pensamiento y aprendizaje.
    - Explica cómo **Venus en {{planetSigns.venus}}** influye en su forma de amar, sus valores y su sentido de la estética.
    - Explica cómo **Marte en {{planetSigns.mars}}** define su energía, su forma de actuar y cómo persigue sus deseos.
5.  **Planetas Transpersonales (clave "transpersonalPlanets"):** Explica el significado de los planetas transpersonales en el contexto de esta carta. **Sé extenso y profundo:**
    - Detalla cómo **Júpiter en {{planetSigns.jupiter}}** moldea su expansión, suerte y creencias.
    - Detalla cómo **Saturno en {{planetSigns.saturn}}** define sus lecciones de vida, su disciplina y sus miedos a superar.
6.  **Introducción a las Casas (clave "housesIntroduction"):** Escribe una única y breve frase introductoria: "A continuación, vemos cómo tus planetas personales activan áreas clave de tu vida."
7.  **Detalles de las Casas (clave "housesDetails"):** ¡INSTRUCCIÓN CRÍTICA! Para esta clave, DEBES generar un ARRAY de objetos JSON. **NO DES UNA DEFINICIÓN GENÉRICA DE LAS 12 CASAS.** Para CADA UNO de los siguientes emplazamientos, crea un objeto JSON con una interpretación personalizada, EXTENSA y profunda (al menos 2-3 frases completas):
    {{#each planetHousePlacements}}
    - {{@key}} en Casa {{this}}
    {{/each}}
    Cada objeto DEBE tener las claves "placement" (ej: "Sol en Casa 10") y "explanation".
8.  **Aspectos Importantes (clave "aspects"):** Proporciona la siguiente explicación general sobre los aspectos: "En astrología, los aspectos son ángulos específicos entre planetas que revelan cómo interactúan sus energías. La conjunción (0 grados) intensifica la energía de los planetas involucrados. La oposición (180 grados) crea tensión y desafíos que requieren integración. El trígono (120 grados) representa armonía y facilidad. La cuadratura (90 grados) indica conflictos y la necesidad de superar obstáculos. Estos son solo algunos ejemplos, y comprender tus aspectos personales puede ofrecer una visión profunda de tu personalidad y tu camino de vida."

Genera el objeto JSON completo en el idioma {{locale}}.
`
});

// Helper function to get the house for a planet using the Whole Sign House system
const getHouseForDegree = (planetDegree: number, ascendantDegree: number): number => {
  // Normalize degrees to be relative to the ascendant
  const relativeDegree = (planetDegree - ascendantDegree + 360) % 360;
  // Each house is 30 degrees in the Whole Sign system
  const house = Math.floor(relativeDegree / 30) + 1;
  return house;
};


// Helper function to calculate aspects deterministically with more detailed explanations
function calculateAspects(planetPositions: Record<string, { sign: string; degree: number }>): AspectDetail[] {
  const planets = Object.entries(planetPositions);
  const aspects: AspectDetail[] = [];
  const orbs = { 'Conjunción': 10, 'Oposición': 10, 'Trígono': 10, 'Cuadratura': 8, 'Sextil': 6 };
  const aspectAngles = { 'Conjunción': 0, 'Oposición': 180, 'Trígono': 120, 'Cuadratura': 90, 'Sextil': 60 };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  const explanationTemplates: Record<string, string> = {
    'Conjunción': `Este aspecto indica una poderosa fusión de energías entre {body1} y {body2} en tu carta. Sus características se combinan para actuar como una sola fuerza, creando un área de inmenso enfoque y potencial. Esta es una zona de tu vida donde tus acciones e identidad están profundamente entrelazadas, ofreciendo grandes dones pero también una posible falta de objetividad. Es un punto de poder que define una parte significativa de tu personalidad.`,
    'Oposición': `Una Oposición entre {body1} y {body2} crea una tensión dinámica que te impulsa hacia la conciencia y el crecimiento. Representa dos áreas de tu vida que parecen estar en conflicto, exigiéndote que encuentres un equilibrio y una integración en lugar de elegir un lado. Este aspecto te desafía a reconciliar dos fuerzas opuestas, y al hacerlo, puedes alcanzar una mayor sabiduría y plenitud. Es una invitación a ver las dos caras de la misma moneda.`,
    'Trígono': `Un Trígono entre {body1} y {body2} es un don cósmico en tu carta. Estas energías planetarias fluyen juntas en armonía, sin esfuerzo, indicando talentos naturales y áreas de la vida donde las cosas tienden a ir bien para ti. Representa tus fortalezas innatas y las bendiciones que puedes dar por sentadas. Es un aspecto de suerte y facilidad que, si se utiliza conscientemente, puede ser una fuente de gran alegría y creatividad.`,
    'Cuadratura': `Una Cuadratura entre {body1} y {body2} genera una tensión interna que actúa como un motor para la acción y el crecimiento personal. Representa un desafío fundamental en tu personalidad, un punto de fricción que te empuja a evolucionar. Aunque puede manifestarse como un obstáculo recurrente, el trabajo consciente para superar esta tensión puede convertirla en una de tus mayores fortalezas y fuentes de poder. Es la presión que crea el diamante.`,
    'Sextil': `Un Sextil entre {body1} y {body2} representa una oportunidad para el crecimiento y la manifestación. Las energías de estos planetas se comunican de manera amistosa, abriendo puertas y ofreciéndote la oportunidad de desarrollar nuevas habilidades, hacer conexiones creativas y aprovechar las circunstancias favorables. Es un aspecto que no actúa por sí solo; requiere que tomes la iniciativa para aprovechar las oportunidades que presenta.`,
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
            .replace(/{body1}/g, capitalize(p1Name))
            .replace(/{body2}/g, capitalize(p2Name))
            .replace('{type}', aspectName.toLowerCase());

          aspects.push({
            body1: capitalize(p1Name),
            body2: capitalize(p2Name),
            type: aspectName,
            degree: parseFloat(normalizedAngle.toFixed(1)),
            explanation: explanation
          });
          break; 
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
    const birthDateObj = new Date(input.birthDate + 'T' + input.birthTime);
    const [birthHour] = input.birthTime.split(':').map(Number);

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

    const planetHousePlacements: Record<string, number> = {};
    const planetSigns: Record<string, string> = {};
    for (const [planet, data] of Object.entries(chartData)) {
      if (planet !== 'ascendant') {
        const capitalizedPlanet = planet.charAt(0).toUpperCase() + planet.slice(1);
        planetHousePlacements[capitalizedPlanet] = getHouseForDegree(data.degree, chartData.ascendant.degree);
        planetSigns[planet] = data.sign;
      }
    }
    
    const promptInput = {
      ...input,
      sunSign: chartData.sun.sign,
      moonSign: chartData.moon.sign,
      ascendantSign: chartData.ascendant.sign,
      planetHousePlacements: planetHousePlacements,
      planetSigns: planetSigns,
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
        aiOutput = {
            sun: `Ocurrió un error al generar la explicación para tu Sol en ${promptInput.sunSign}. Generalmente, el Sol representa tu identidad central.`,
            moon: `Ocurrió un error al generar la explicación para tu Luna en ${promptInput.moonSign}. La Luna rige tu mundo emocional.`,
            ascendant: `Ocurrió un error al generar la explicación para tu Ascendente en ${promptInput.ascendantSign}. El Ascendente es tu máscara social.`,
            personalPlanets: "Ocurrió un error al generar la explicación de los planetas personales.",
            transpersonalPlanets: "Ocurrió un error al generar la explicación de los planetas transpersonales.",
            housesIntroduction: "A continuación, las áreas de tu vida donde se manifiestan tus planetas.",
            housesDetails: [],
            aspects: "Ocurrió un error al generar la explicación general de los aspectos.",
        };
    }
    
    const aspectsDetails = calculateAspects(chartData);
    
    return {
      ...aiOutput,
      planetPositions: chartData,
      aspectsDetails: aspectsDetails,
    };
  }
);

export async function natalChartFlow(input: NatalChartInput): Promise<NatalChartOutput> {
  return natalChartFlowInternal(input);
}
