'use server';
/**
 * @fileOverview A Genkit flow to interpret user-described dreams using a guided wizard and extract key dream elements.
 *
 * - dreamInterpretationFlow - A function that calls the dream interpretation flow.
 * - DreamInterpretationInput - The input type for the dreamInterpretationFlow function.
 * - DreamInterpretationOutput - The return type for the dreamInterpretationFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DreamWizardDataSchema = z.object({
  coreDescription: z.string().describe("The main, detailed narrative of the dream."),
  characters: z.string().optional().describe("Key people, animals, or beings that appeared in the dream."),
  locations: z.string().optional().describe("The primary places or settings where the dream occurred."),
  emotions: z.string().optional().describe("The dominant emotions felt during the dream."),
  symbols: z.string().optional().describe("Specific objects or recurring symbols that stood out."),
});
export type DreamWizardData = z.infer<typeof DreamWizardDataSchema>;

const DreamInterpretationInputSchema = z.object({
  dreamData: DreamWizardDataSchema,
  locale: z.string().describe('The locale (e.g., "en", "es") for the interpretation language.'),
});
export type DreamInterpretationInput = z.infer<typeof DreamInterpretationInputSchema>;


const DreamElementsSchema = z.object({
  symbols: z.array(z.string()).describe('Key symbols or objects that appeared in the dream (e.g., "key", "mirror", "tree"). Max 5 items.'),
  emotions: z.array(z.string()).describe('Dominant emotions felt during the dream (e.g., "joy", "fear", "confusion"). Max 3 items.'),
  characters: z.array(z.string()).describe('Significant characters or beings encountered (e.g., "a tall stranger", "my mother", "a talking animal"). Max 3 items.'),
  locations: z.array(z.string()).describe('Main places or settings where the dream occurred (e.g., "a dark forest", "my childhood home", "a floating city"). Max 3 items.'),
  themes: z.array(z.string()).describe('Recurrent themes or core concepts of the dream (e.g., "escape", "transformation", "loss"). Max 3 items.'),
});

const DreamInterpretationOutputSchema = z.object({
  interpretation: z.string().describe('A thoughtful and insightful interpretation of the dream, analyzing symbols, emotions, and events. It should be multi-paragraph and detailed if the dream description allows.'),
  dreamElements: DreamElementsSchema.describe('Extracted key elements from the dream, categorized for the "Dream Map".'),
});
export type DreamInterpretationOutput = z.infer<typeof DreamInterpretationOutputSchema>;

const dreamInterpretationPrompt = ai.definePrompt({
  name: 'dreamInterpretationPrompt',
  input: {schema: DreamInterpretationInputSchema},
  output: {schema: DreamInterpretationOutputSchema},
  prompt: `You are an expert dream interpreter with a deep understanding of symbolism and psychology.
The user will describe a dream they had in several structured parts. Respond in the {{locale}} language.

Your task is to synthesize this information and then perform two main actions:
1.  Provide a thoughtful, insightful, and multi-paragraph interpretation of the dream. Analyze the symbols, emotions, characters, and events present in the dream. Consider common dream symbolism but also encourage the user to reflect on their personal associations with the dream elements. Structure your interpretation clearly. Avoid definitive statements like "This dream means exactly X." Instead, use phrases like "This could suggest...", "It might represent...", "Consider how this relates to your waking life...".
2.  Extract key elements from the dream to populate a "Dream Map". These elements should be categorized as:
    *   symbols: Key symbols or objects (max 5).
    *   emotions: Dominant emotions felt (max 3).
    *   characters: Significant characters or beings (max 3).
    *   locations: Main places or settings (max 3).
    *   themes: Recurrent themes or core concepts (max 3).

Here is the user's dream, broken down into parts:

**Main Dream Narrative:**
"{{dreamData.coreDescription}}"

{{#if dreamData.characters}}
**Characters Mentioned:**
"{{dreamData.characters}}"
{{/if}}

{{#if dreamData.locations}}
**Locations Mentioned:**
"{{dreamData.locations}}"
{{/if}}

{{#if dreamData.emotions}}
**Emotions Felt:**
"{{dreamData.emotions}}"
{{/if}}

{{#if dreamData.symbols}}
**Key Symbols/Objects:**
"{{dreamData.symbols}}"
{{/if}}


Provide your response as a single JSON object with two main keys: "interpretation" (string) and "dreamElements" (object containing arrays of strings for symbols, emotions, characters, locations, themes).

Example for dream: { coreDescription: "I was flying over a city made of clouds", characters: "my best friend, a shadowy figure", emotions: "exhilaration and fear", symbols: "a glowing orb" }
{
  "interpretation": "Flying in dreams often symbolizes a sense of freedom, liberation, or a desire to rise above current challenges. The city made of clouds could represent a realm of imagination or aspirations. The feeling of exhilaration mixed with fear suggests a complex emotional state regarding this pursuit of freedom or new heights. The shadowy figure might represent an internal fear, an external pressure, or an unresolved issue that feels like it's pursuing you. Your best friend offering a glowing orb is a powerful symbol; friends often represent supportive aspects of ourselves or literal support systems. The orb could signify wisdom, a solution, or a gift you are meant to receive or acknowledge. Consider what this 'glowing orb' might mean to you personally and how your friend's presence makes you feel in the context of being chased.",
  "dreamElements": {
    "symbols": ["city of clouds", "shadowy figure", "glowing orb"],
    "emotions": ["exhilaration", "fear"],
    "characters": ["best friend", "shadowy figure"],
    "locations": ["city of clouds"],
    "themes": ["pursuit", "support", "freedom"]
  }
}

Now, analyze the user's dream and provide the JSON output.
`,
});

const dreamInterpretationFlowInternal = ai.defineFlow(
  {
    name: 'dreamInterpretationFlowInternal',
    inputSchema: DreamInterpretationInputSchema,
    outputSchema: DreamInterpretationOutputSchema,
  },
  async (input) => {
    const {output} = await dreamInterpretationPrompt(input);
     if (!output) {
      throw new Error('Dream interpreter provided no interpretation or elements.');
    }
    // Ensure dreamElements is at least an empty structure if not fully populated
    output.dreamElements = {
      symbols: output.dreamElements?.symbols || [],
      emotions: output.dreamElements?.emotions || [],
      characters: output.dreamElements?.characters || [],
      locations: output.dreamElements?.locations || [],
      themes: output.dreamElements?.themes || [],
    };
    return output;
  }
);

export async function dreamInterpretationFlow(input: DreamInterpretationInput): Promise<DreamInterpretationOutput> {
  return dreamInterpretationFlowInternal(input);
}