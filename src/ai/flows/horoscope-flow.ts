

'use server';
/**
 * @fileOverview A Genkit flow to generate horoscopes with caching and mock fallbacks.
 *
 * - getHoroscopeFlow - A function that calls the horoscope generation flow.
 *   It can also target a specific date for daily horoscopes.
 *   It can also personalize horoscopes if onboardingData is provided.
 * - HoroscopeFlowInput - The input type for the getHoroscopeFlow function.
 * - HoroscopeFlowOutput - The return type for the getHoroscopeFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ZodiacSignName, HoroscopeFlowInput as PublicHoroscopeFlowInput, HoroscopePersonalizationData, Locale } from '@/types';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import { format, subDays, getISOWeek, getYear } from 'date-fns';
import { getRandomMockHoroscope } from '@/lib/mock-horoscopes';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';

// Helper to create a Zod enum from the ZodiacSignName type values
const zodSignEnum = z.enum(ALL_SIGN_NAMES as [string, ...string[]]);

// Define Zod schema for HoroscopeDetail
const HoroscopeDetailSchema = z.object({
  main: z.string().describe('The main horoscope text for the period. It must be a complete and insightful astrological prediction.'),
  love: z.string().describe('The love horoscope text for the period. It must be a complete and insightful astrological prediction for romance.'),
  money: z.string().describe('The money/career horoscope text for the period. It must be a complete and insightful astrological prediction for finances and work.'),
  health: z.string().describe('The health horoscope text for the period. It must be a complete and insightful astrological prediction for well-being.'),
});
export type HoroscopeDetail = z.infer<typeof HoroscopeDetailSchema>;

// Define Zod schema for HoroscopeFlowOutput
const HoroscopeFlowOutputSchema = z.object({
  daily: HoroscopeDetailSchema,
  weekly: HoroscopeDetailSchema,
  monthly: HoroscopeDetailSchema,
});
export type HoroscopeFlowOutput = z.infer<typeof HoroscopeFlowOutputSchema>;

// Define Zod schema for HoroscopePersonalizationData
const HoroscopePersonalizationDataSchema = z.object({
  name: z.string().optional().describe('The name of the user.'),
  gender: z.string().optional().describe('The gender of the user.'),
  relationshipStatus: z.string().optional().describe('The relationship status of the user.'),
  employmentStatus: z.string().optional().describe('The employment status of the user.'),
}).optional();


// New PromptInputSchema that includes specific fields for personalization
const PromptInputSchema = z.object({
  sign: zodSignEnum,
  locale: z.string(),
  dateDescriptor: z.string().optional(), // Optional for weekly/monthly
  isPersonalized: z.boolean(),
  userName: z.string().optional(),
  userGender: z.string().optional(),
  userRelationshipStatus: z.string().optional(),
  userEmploymentStatus: z.string().optional(),
  astrologicalTheme: z.string().optional().describe('El tema astrológico central del día para guiar la predicción.'),
});
type PromptInput = z.infer<typeof PromptInputSchema>;


// Themes for daily horoscopes to ensure variety
const dailyThemes = [
  "un impulso de energía creativa y autoexpresión",
  "un desafío inesperado en la comunicación que requiere paciencia",
  "una oportunidad para la introspección profunda y el descanso necesario",
  "un encuentro social sorprendente que podría traer nuevas oportunidades",
  "un enfoque renovado en las finanzas y la seguridad material",
  "una necesidad de establecer límites claros en las relaciones personales",
  "un momento de claridad sobre una vieja duda o un problema persistente",
  "un día ideal para la aventura, la espontaneidad y salir de la rutina",
  "una conexión emocional profunda y significativa con alguien cercano",
  "un obstáculo profesional que requiere una estrategia cuidadosa en lugar de acción impulsiva",
  "una revelación sobre la salud y la importancia del bienestar físico y mental",
  "una invitación a aprender algo nuevo o a explorar un interés intelectual",
  "un día de armonía en el hogar y en las relaciones familiares",
  "un conflicto entre la responsabilidad y el deseo de libertad",
  "la llegada de noticias inesperadas que podrían cambiar tus planes",
];

// Function to get a deterministic theme based on date and sign
function getDeterministicTheme(dateStr: string, sign: string, themes: string[]): string {
  let hash = 0;
  const seed = `${dateStr}-${sign}`;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
}


// Daily Horoscope Prompt
const dailyHoroscopePrompt = ai.definePrompt({
  name: 'dailyHoroscopePrompt',
  input: { schema: PromptInputSchema },
  output: { schema: HoroscopeDetailSchema },
  model: 'googleai/gemini-2.0-flash',
  prompt: `Eres un astrólogo experto, empático y perspicaz. Tu tarea es generar un horóscopo DIARIO y completo para el signo zodiacal {{sign}}.

**INSTRUCCIONES CRÍTICAS:**
1.  **IDIOMA:** Responde ÚNICAMENTE en el idioma especificado por el código de locale: **{{locale}}**.
2.  **FORMATO:** Tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al esquema. Las claves deben ser "main", "love", "money", y "health". No añadas claves adicionales ni uses markdown.
3.  **CONTENIDO:** Cada campo ("main", "love", "money", "health") debe contener una predicción astrológica completa, detallada y significativa de al menos 30 palabras. No uses frases de marcador de posición.
4.  **TEMA CENTRAL:** Basa TODA tu predicción en la influencia específica del siguiente tema astrológico para el día de hoy: **"{{astrologicalTheme}}"**. Explica cómo este tema afecta a cada área (principal, amor, dinero, salud) para el signo {{sign}}.

**PERSONALIZACIÓN (Si aplica):**
{{#if isPersonalized}}
Este es un horóscopo PERSONALIZADO para **{{userName}}**.
- **Saludo:** Comienza la predicción 'main' con un saludo cálido y natural a {{userName}}.
- **Contexto:** Considera sutilmente su situación sentimental ({{userRelationshipStatus}}) y laboral ({{userEmploymentStatus}}) al redactar las secciones de amor y dinero respectivamente.
{{else}}
Este es un horóscopo GENERAL para todos los nativos del signo {{sign}}.
{{/if}}

**EJEMPLO DE SALIDA PERFECTA (para un caso personalizado):**
{
  "main": "Hola Alex, para tu signo Aries, el cosmos hoy te depara un encuentro social sorprendente. Una conexión inesperada, ya sea con alguien nuevo o del pasado, tiene el potencial de ofrecerte una perspectiva que no habías considerado. Mantente abierto a las conversaciones espontáneas; las estrellas indican que la sincronicidad está de tu lado, y este evento podría ser clave.",
  "love": "En el amor, esta energía social te beneficia enormemente. Si estás en pareja, una salida con amigos puede reavivar la chispa y traer nueva alegría. Si estás soltero, Alex, tu carisma estará en su punto más alto en cualquier evento social al que asistas. No dudes en iniciar una conversación, pues la conexión que buscas podría surgir de la manera más inesperada.",
  "money": "El networking es tu mejor activo hoy, Alex. Una conversación casual en un entorno relajado, quizás fuera de la oficina, podría llevar a una colaboración inesperada o a una valiosa oportunidad profesional. Escucha atentamente lo que otros tienen que decir; la clave de tu próximo éxito financiero podría estar en las palabras de otra persona.",
  "health": "Tu bienestar se nutre de la interacción social positiva. Considera una actividad física en grupo, como un deporte de equipo o una clase de baile con amigos. La energía colectiva no solo te motivará, sino que también aliviará el estrés acumulado, mejorando tu estado de ánimo y tu vitalidad general."
}

Ahora, genera el horóscopo DIARIO para **{{sign}}** en **{{locale}}**, siguiendo todas las instrucciones al pie de la letra.
`,
});

// Weekly Horoscope Prompt
const weeklyHoroscopePrompt = ai.definePrompt({
  name: 'weeklyHoroscopePrompt',
  input: { schema: PromptInputSchema }, 
  output: { schema: HoroscopeDetailSchema },
  model: 'googleai/gemini-2.0-flash',
  prompt: `Eres un astrólogo sabio, empático y perspicaz que revela cómo las energías cósmicas de la semana influirán en la vida del usuario.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo SEMANAL PERSONALIZADO para ESTA SEMANA para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
**Saluda a {{userName}} al principio de la predicción principal de forma natural y amigable.** Tu tono debe ser místico y predictivo, usando frases como "Hola {{userName}}, esta semana el universo te depara...", "Para ti, {{userName}}, las estrellas sugieren...", "La energía cósmica de esta semana te invita a...".
{{else}}
Genera ÚNICAMENTE el horóscopo SEMANAL GENERAL para ESTA SEMANA para el signo zodiacal {{sign}} en el idioma {{locale}}.
Tu tono debe ser místico y predictivo, usando frases como "esta semana el cosmos depara", "las estrellas sugieren", "la energía de la semana invita a".
{{/if}}

Para la sección 'main', proporciona una visión general completa para LA SEMANA ACTUAL. Comienza con un tema general para la semana, posiblemente mencionando cómo un tránsito planetario clave podría influir.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODA LA SEMANA.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main", "love", "money", "health". NO añadas ninguna otra clave. NO uses markdown.
Ejemplo de estructura de salida para {{userName}}="Alex" (CASO PERSONALIZADO):
{
  "main": "Hola Alex, esta semana para tu signo Virgo, el universo te depara una mayor claridad en tus comunicaciones. Con el ingreso de Mercurio en un sector de reflexión profunda, es un momento ideal para expresar tus verdades y organizar tus pensamientos. Las conversaciones que tengas a mitad de semana podrían ser particularmente reveladoras.",
  "love": "En el amor, la influencia de Mercurio te anima a tener esas conversaciones pendientes. Para los Virgo en pareja, es una oportunidad para fortalecer la conexión. Si estás soltero, Alex, tu elocuencia podría atraer a alguien con quien compartes una profunda conexión intelectual.",
  "money": "Profesional y financieramente, tu precisión se ve potenciada esta semana. Es un excelente momento para revisar contratos, planificar presupuestos o presentar proyectos detallados. Tu atención al detalle será tu mayor activo.",
  "health": "Tu bienestar se beneficia de rutinas que fomenten tanto la claridad mental como la física. Considera empezar un diario o practicar ejercicios de respiración para calmar la mente y organizar tus ideas."
}
Ahora genera el horóscopo SEMANAL DETALLADO para {{sign}} en {{locale}} para esta semana, reflejando este estilo perspicaz y personalizándolo si isPersonalized es true:
`,
});

// Monthly Horoscope Prompt
const monthlyHoroscopePrompt = ai.definePrompt({
  name: 'monthlyHoroscopePrompt',
  input: { schema: PromptInputSchema }, 
  output: { schema: HoroscopeDetailSchema },
  model: 'googleai/gemini-2.0-flash',
  prompt: `Eres un astrólogo sabio, empático y perspicaz que revela cómo las energías cósmicas del mes influirán en la vida del usuario.
{{#if isPersonalized}}
Genera ÚNICAMENTE el horóscopo MENSUAL PERSONALIZADO para ESTE MES para {{userName}} (signo {{sign}}) en el idioma {{locale}}.
**Saluda a {{userName}} al principio de la predicción principal de forma natural y amigable.** Tu tono debe ser místico y predictivo, usando frases como "Hola {{userName}}, este mes el universo te depara...", "Para ti, {{userName}}, las estrellas sugieren...", "La energía cósmica de este mes te invita a...".
{{else}}
Genera ÚNICAMENTE el horóscopo MENSUAL GENERAL para ESTE MES para el signo zodiacal {{sign}} en el idioma {{locale}}.
Tu tono debe ser místico y predictivo, usando frases como "este mes el cosmos depara", "las estrellas sugieren", "la energía del mes invita a".
{{/if}}
Evita marcadores de posición como "[Insertar mes actual]"; el horóscopo es para el mes actual, así que refiérete a él como "este mes" si es necesario.

Para la sección 'main', proporciona una visión general completa para EL MES ACTUAL. Comienza estableciendo los temas generales.
Para 'love', 'money', y 'health', proporciona perspectivas elaboradas, consejos y posibles desarrollos para TODO EL MES.

CRÍTICO: La estructura de tu respuesta DEBE ser un objeto JSON válido que se ajuste estrictamente al siguiente esquema: "main", "love", "money", "health". NO añadas ninguna otra clave. NO uses markdown.
Ejemplo de estructura de salida para {{userName}}="Alex" (CASO PERSONALIZADO):
{
  "main": "Hola Alex, para tu signo Capricornio, este mes se perfila como un período de profunda consolidación profesional. El Sol iluminando tu casa de la carrera te invita a tomar el liderazgo y a cosechar los frutos de tu arduo trabajo. Es un momento para la ambición y la estrategia a largo plazo.",
  "love": "En el terreno sentimental, Alex, este mes te pide un equilibrio entre tu vida profesional y personal. Si estás en pareja, asegúrate de dedicar tiempo de calidad. Para los solteros, es más probable que la atracción surja en entornos profesionales o a través de contactos de trabajo.",
  "money": "Financieramente, este mes es para la estrategia y la inversión en tu futuro. Podrías recibir un reconocimiento o un ascenso que venga con una mejora económica. Es un buen momento para planificar tus finanzas con una visión a largo plazo.",
  "health": "Tu bienestar este mes se beneficia enormemente de rutinas que te ayuden a gestionar el estrés laboral. No descuides el descanso. Prácticas como el yoga o simplemente desconectar en la naturaleza serán cruciales para mantener tu energía."
}
Ahora genera el horóscopo MENSUAL DETALLADO para {{sign}} en {{locale}} para este mes, reflejando este estilo perspicaz y personalizándolo si isPersonalized es true:
`,
});


async function generateHoroscopesWithAI(
    sign: ZodiacSignName,
    locale: Locale,
    targetDate: string,
    onboardingData?: HoroscopePersonalizationData
): Promise<HoroscopeFlowOutput> {
    const isPersonalizedRequest = !!onboardingData?.name;
    const dateObj = new Date(targetDate);
    
    let dateDescriptor = `para la fecha ${targetDate}`;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    if (targetDate === todayStr) {
        dateDescriptor = "HOY";
    } else if (targetDate === yesterdayStr) {
        dateDescriptor = "AYER";
    }

    const theme = getDeterministicTheme(targetDate, sign, dailyThemes);

    const promptPayload: PromptInput = {
        sign,
        locale,
        dateDescriptor,
        isPersonalized: isPersonalizedRequest,
        userName: onboardingData?.name,
        userGender: onboardingData?.gender,
        userRelationshipStatus: onboardingData?.relationshipStatus,
        userEmploymentStatus: onboardingData?.employmentStatus,
        astrologicalTheme: theme,
    };
    
    try {
        console.log("🤖 Realizando llamadas a la API de IA para generar horóscopos...");
        const [dailyResult, weeklyResult, monthlyResult] = await Promise.all([
            dailyHoroscopePrompt(promptPayload),
            weeklyHoroscopePrompt(promptPayload),
            monthlyHoroscopePrompt(promptPayload)
        ]);

        return {
            daily: dailyResult.output || getRandomMockHoroscope('daily'),
            weekly: weeklyResult.output || getRandomMockHoroscope('weekly'),
            monthly: monthlyResult.output || getRandomMockHoroscope('monthly')
        };
    } catch (err: any) {
        console.error(`❌ Error en la generación de IA para ${sign} (${locale}):`, err);
        return {
            daily: getRandomMockHoroscope('daily'),
            weekly: getRandomMockHoroscope('weekly'),
            monthly: getRandomMockHoroscope('monthly'),
        };
    }
}


export async function getHoroscopeFlow(input: PublicHoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  const { sign, locale = 'es', targetDate: targetDateStr, onboardingData } = input;
  
  const today = new Date();
  const dateObj = targetDateStr ? new Date(targetDateStr) : today;
  const dateKey = format(dateObj, 'yyyy-MM-dd');
  const weekKey = `${getYear(dateObj)}-${getISOWeek(dateObj).toString().padStart(2, '0')}`;
  const monthKey = format(dateObj, 'yyyy-MM');

  try {
    const [dailyFromDB, weeklyFromDB, monthlyFromDB] = await Promise.all([
        HoroscopeFirestoreService.loadHoroscopeForSign(sign, dateKey, locale),
        HoroscopeFirestoreService.loadWeeklyHoroscopeForSign(sign, weekKey, locale),
        HoroscopeFirestoreService.loadMonthlyHoroscopeForSign(sign, monthKey, locale),
    ]);
    
    if (dailyFromDB && weeklyFromDB && monthlyFromDB) {
      console.log(`✅ Horóscopos cargados desde Firestore para ${sign} - ${dateKey}, ${weekKey}, ${monthKey}`);
      return { daily: dailyFromDB, weekly: weeklyFromDB, monthly: monthlyFromDB };
    }

    console.log(`🤖 Faltan datos en Firestore. Generando nuevos horóscopos con IA para ${sign}.`);
    const aiGenerated = await generateHoroscopesWithAI(sign, locale, dateKey, onboardingData);

    const savePromises = [];
    if (!dailyFromDB) {
        savePromises.push(HoroscopeFirestoreService.saveDailyHoroscopes(dateKey, { [sign]: aiGenerated.daily } as any, locale));
    }
    if (!weeklyFromDB) {
        savePromises.push(HoroscopeFirestoreService.saveWeeklyHoroscopes(weekKey, { [sign]: aiGenerated.weekly } as any, locale));
    }
    if (!monthlyFromDB) {
        savePromises.push(HoroscopeFirestoreService.saveMonthlyHoroscopes(monthKey, { [sign]: aiGenerated.monthly } as any, locale));
    }
    
    await Promise.all(savePromises).catch(error => {
        console.error("❌ Error guardando horóscopos generados en Firestore:", error);
    });
    
    return aiGenerated;
    
  } catch (error) {
    console.error('❌ Error en getHoroscopeFlow:', error);
    return {
        daily: getRandomMockHoroscope('daily'),
        weekly: getRandomMockHoroscope('weekly'),
        monthly: getRandomMockHoroscope('monthly'),
    };
  }
}
