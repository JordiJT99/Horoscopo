'use server';
/**
 * @fileOverview A Genkit flow to match a user with the best psychic based on their answers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { psychics, type Psychic } from '@/lib/psychics';
import type { Dictionary } from '@/lib/dictionaries';

// Define the structure for a single Q&A pair
const QAPairSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

// Define the input schema for the flow
const PsychicMatchInputSchema = z.object({
  answers: z.array(QAPairSchema),
  locale: z.string(),
});
export type PsychicMatchInput = z.infer<typeof PsychicMatchInputSchema>;

// Define the output schema for the flow
const PsychicMatchOutputSchema = z.object({
  psychicId: z.string().describe('The ID of the best-matched psychic from the provided list.'),
});
export type PsychicMatchOutput = z.infer<typeof PsychicMatchOutputSchema>;


// The main exported function that client components will call
export async function findMyPsychic(answers: { question: string, answer: string }[], locale: string, dictionary: Dictionary): Promise<PsychicMatchOutput> {
  // Create a summary of psychics to pass to the prompt
  const psychicSummaries = psychics.map(p => {
    // Translate the specialty using the provided dictionary
    const translatedSpecialty = dictionary[p.specialty] || p.specialty;
    return `${p.name} (ID: ${p.id}): Especializado en ${translatedSpecialty}. Lema: "${dictionary[p.phrase] || p.phrase}".`;
  }).join('\n');
  
  const promptInput = { answers, locale, psychicSummaries };
  
  return psychicMatchFlow(promptInput);
}

// Define the prompt with the dynamic psychic list
const psychicMatchPrompt = ai.definePrompt({
    name: 'psychicMatchPrompt',
    input: { schema: PsychicMatchInputSchema.extend({ psychicSummaries: z.string() }) },
    output: { schema: PsychicMatchOutputSchema },
    prompt: `Eres un experto casamentero de psíquicos. Tu tarea es analizar las respuestas de un usuario y asignarle el psíquico más adecuado de la siguiente lista.

**Psíquicos Disponibles y sus Especialidades:**
{{{psychicSummaries}}}

**Respuestas del Usuario:**
{{#each answers}}
- Pregunta: "{{question}}"
  Respuesta: "{{answer}}"
{{/each}}

Analiza las necesidades y el estado emocional del usuario basándote en sus respuestas. Luego, selecciona el ID del psíquico cuya especialidad y lema se alineen mejor con las preocupaciones del usuario. Tu respuesta DEBE ser un objeto JSON con una única clave, "psychicId", que contenga el ID exacto del psíquico elegido.

**CRÍTICO: No inventes un ID. Elige solo de la lista proporcionada.**

Ejemplo de salida si Miss Mia es la mejor opción:
{
  "psychicId": "missmia"
}

Ahora, analiza las respuestas y asigna el psíquico más adecuado.
`
});


// Define the internal flow
const psychicMatchFlow = ai.defineFlow(
  {
    name: 'psychicMatchFlow',
    inputSchema: PsychicMatchInputSchema.extend({ psychicSummaries: z.string() }),
    outputSchema: PsychicMatchOutputSchema,
  },
  async (input) => {
    const { output } = await psychicMatchPrompt(input);
    
    // Fallback logic in case the AI fails or returns an invalid ID
    if (!output?.psychicId || !psychics.some(p => p.id === output.psychicId)) {
      console.warn(`[PsychicMatchFlow] AI returned invalid or no psychicId. Output: ${JSON.stringify(output)}. Assigning a random psychic.`);
      // Assign a random psychic as a fallback
      const randomPsychic = psychics[Math.floor(Math.random() * psychics.length)];
      return { psychicId: randomPsychic.id };
    }
    
    return output;
  }
);
