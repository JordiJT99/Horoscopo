

import type { ZodiacSignName, ZodiacSign, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo, AstrologicalElement, AstrologicalPolarity, AstrologicalModality, UpcomingPhase, MoonPhaseKey, DailyTransit } from '@/types';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { StardustIcon } from '@/components/shared/StardustIcon'; // Import the new icon component
import {
  Sparkles as SparklesIcon,
  Rabbit as RabbitIcon,
  Feather as FeatherIcon,
  Star as StarIcon,
  Layers,
  Calculator as CalculatorIcon,
  HelpCircle,
  Briefcase,
  Route,
  Wind,
  Sun,
  Moon,
  Leaf,
  Droplets,
  Flame,
  Rat as RatIcon,
  Dog as DogIcon,
  Bird as BirdIcon,
  Banana,
  Worm,
  Mountain as MountainIcon,
  Cat,
  PawPrint,
  Gitlab,
  Shell,
  TrendingUp,
  Zap,
  Heart,
  Hand,
  RefreshCw,
  Baseline,
  Scissors,
  Eye,
} from 'lucide-react';
import { loveCompatibilityPairings } from './constantslove';
import { friendshipCompatibilityPairings } from './constantsfriendship';
import { workCompatibilityPairings } from './constantswork';
import type { CompatibilityReportDetail } from './constantslove'; 
import { chineseCompatibilityPairings, type ChineseCompatibilityReportDetail } from './constantshoroscopochino';
import { getSunLongitude, getMoonLongitude, getAscendantLongitude, getJulianDay, computeLunarPhasesForMonth } from './astronomy';
import React from 'react';

// The custom StardustIcon component is now defined in its own file: src/components/shared/StardustIcon.tsx
// It is imported above and re-exported here for easy access from other parts of the app.
export { StardustIcon };


export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", customIconPath: "/custom_assets/aries_display.png", dateRange: "Mar 21 - Abr 19", element: "Fire", polarity: "Masculine", modality: "Cardinal" },
  { name: "Taurus", customIconPath: "/custom_assets/taurus_display.png", dateRange: "Abr 20 - May 20", element: "Earth", polarity: "Feminine", modality: "Fixed" },
  { name: "Gemini", customIconPath: "/custom_assets/geminis_display.png", dateRange: "May 21 - Jun 20", element: "Air", polarity: "Masculine", modality: "Mutable" },
  { name: "Cancer", customIconPath: "/custom_assets/cancer_display.png", dateRange: "Jun 21 - Jul 22", element: "Water", polarity: "Feminine", modality: "Cardinal" },
  { name: "Leo", customIconPath: "/custom_assets/leo_display.png", dateRange: "Jul 23 - Ago 22", element: "Fire", polarity: "Masculine", modality: "Fixed" },
  { name: "Virgo", customIconPath: "/custom_assets/virgo_display.png", dateRange: "Ago 23 - Sep 22", element: "Earth", polarity: "Feminine", modality: "Mutable" },
  { name: "Libra", customIconPath: "/custom_assets/libra_display.png", dateRange: "Sep 23 - Oct 22", element: "Air", polarity: "Masculine", modality: "Cardinal" },
  { name: "Scorpio", customIconPath: "/custom_assets/scorpio_display.png", dateRange: "Oct 23 - Nov 21", element: "Water", polarity: "Feminine", modality: "Fixed" },
  { name: "Sagittarius", customIconPath: "/custom_assets/sagittarius_display.png", dateRange: "Nov 22 - Dic 21", element: "Fire", polarity: "Masculine", modality: "Mutable" },
  { name: "Capricorn", customIconPath: "/custom_assets/capricorn_display.png", dateRange: "Dic 22 - Ene 19", element: "Earth", polarity: "Feminine", modality: "Cardinal" },
  { name: "Aquarius", customIconPath: "/custom_assets/aquarius_display.png", dateRange: "Ene 20 - Feb 18", element: "Air", polarity: "Masculine", modality: "Fixed" },
  { name: "Pisces", customIconPath: "/custom_assets/pisces_display.png", dateRange: "Feb 19 - Mar 20", element: "Water", polarity: "Feminine", modality: "Mutable" },
];

export const getSunSignFromDate = (date: Date): ZodiacSign | null => {
  const jd = getJulianDay(date);
  const longitude = getSunLongitude(jd);
  const signName = getSignFromDegree(longitude);
  return ZODIAC_SIGNS.find(s => s.name === signName) || null;
};

// Helper function to get sign based on absolute degree
export const getSignFromDegree = (degree: number): ZodiacSignName => {
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

export const getMoonSign = (date: Date): ZodiacSign | null => {
  const jd = getJulianDay(date);
  const longitude = getMoonLongitude(jd);
  const signName = getSignFromDegree(longitude);
  return ZODIAC_SIGNS.find(s => s.name === signName) || null;
};


export const ALL_SIGN_NAMES = ZODIAC_SIGNS.map(sign => sign.name) as [ZodiacSignName, ...ZodiacSignName[]];

function getGenericCompatibilityReport(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work'): CompatibilityReportDetail {
  const typeTextMap: Record<string, Record<Locale, string>> = {
    love: { es: 'amorosa', en: 'romantic', de: 'romantische', fr: 'romantique' },
    friendship: { es: 'de amistad', en: 'friendship', de: 'freundschaftliche', fr: 'amicale' },
    work: { es: 'laboral', en: 'work', de: 'berufliche', fr: 'professionnelle' }
  };

  const reports: Record<Locale, string> = {
    es: `La conexión ${typeTextMap[type].es} entre ${sign1} y ${sign2} es única, tejida con los hilos de sus elementos y modalidades distintivas. ${sign1}, con su energía inherente, interactúa con ${sign2}, quien aporta su característica distintiva, creando una dinámica que puede ser tanto complementaria como desafiante para este tipo de relación. Es un encuentro de dos mundos que, con entendimiento, pueden enriquecerse mutuamente. (Este es un informe de compatibilidad general para ${typeTextMap[type].es}. Los detalles específicos pueden variar.)`,
    en: `The ${typeTextMap[type].en} connection between ${sign1} and ${sign2} is unique, woven with the threads of their distinct elements and modalities. ${sign1}, with its inherent energy, interacts with ${sign2}, who brings their characteristic distinctiveness, creating a dynamic that can be both complementary and challenging for this type of relationship. It's an encounter of two worlds that, with understanding, can enrich each other. (This is a general compatibility report for ${typeTextMap[type].en}. Specific details may vary.)`,
    de: `Die ${typeTextMap[type].de} Verbindung zwischen ${sign1} und ${sign2} ist einzigartig, gewebt aus den Fäden ihrer unterschiedlichen Elemente und Modalitäten. ${sign1}, mit seiner inhärenten Energie, interagiert mit ${sign2}, der seine charakteristische Besonderheit einbringt, und schafft eine Dynamik, die für diese Art von Beziehung sowohl ergänzend als auch herausfordernd sein kann. Es ist eine Begegnung zweier Welten, die sich mit Verständnis gegenseitig bereichern können. (Dies ist ein allgemeiner Kompatibilitätsbericht für ${typeTextMap[type].de}. Spezifische Details können variieren.)`,
    fr: `La connexion ${typeTextMap[type].fr} entre ${sign1} et ${sign2} est unique, tissée avec les fils de leurs éléments et modalités distincts. ${sign1}, avec son énergie inhérente, interagit avec ${sign2}, qui apporte sa particularité caractéristique, créant une dynamique qui peut être à la fois complémentaire et stimulante pour ce type de relation. C'est une rencontre de deux mondes qui, avec compréhension, peuvent s'enrichir mutuellement. (Ceci est un rapport de compatibilité général pour ${typeTextMap[type].fr}. Les détails spécifiques peuvent varier.)`
  };

  return {
    report: reports,
    score: 3 
  };
}

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityData {
  let pairings: Record<string, CompatibilityReportDetail>;
  switch(type) {
    case 'love':
      pairings = loveCompatibilityPairings;
      break;
    case 'friendship':
      pairings = friendshipCompatibilityPairings;
      break;
    case 'work':
      pairings = workCompatibilityPairings;
      break;
    default:
      pairings = {};
  }

  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  let reportData = pairings[key1] || pairings[key2];
  
  if (!reportData) {
    reportData = getGenericCompatibilityReport(sign1, sign2, type);
  }

  return {
    sign1,
    sign2,
    report: reportData.report[locale] || reportData.report.es, // Fallback to Spanish if locale is not found
    score: reportData.score,
  };
}

const luckyColors: Record<string, Record<Locale, string>> = {
  red: { es: "Rojo", en: "Red", de: "Rot", fr: "Rouge" },
  green: { es: "Verde", en: "Green", de: "Grün", fr: "Vert" },
  blue: { es: "Azul", en: "Blue", de: "Blau", fr: "Bleu" },
  yellow: { es: "Amarillo", en: "Yellow", de: "Gelb", fr: "Jaune" },
  purple: { es: "Púrpura", en: "Purple", de: "Lila", fr: "Violet" },
  orange: { es: "Naranja", en: "Orange", de: "Orange", fr: "Orange" },
};

const luckyGemstones: Record<string, Record<Locale, string>> = {
  diamond: { es: "Diamante", en: "Diamond", de: "Diamant", fr: "Diamant" },
  emerald: { es: "Esmeralda", en: "Emerald", de: "Smaragd", fr: "Émeraude" },
  sapphire: { es: "Zafiro", en: "Sapphire", de: "Saphir", fr: "Saphir" },
  ruby: { es: "Rubí", en: "Ruby", de: "Rubin", fr: "Rubis" },
  amethyst: { es: "Amatista", en: "Amethyst", de: "Amethyst", fr: "Améthyste" },
  topaz: { es: "Topacio", en: "Topaz", de: "Topas", fr: "Topaze" },
};

const motivationalPhrases: Record<Locale, string[]> = {
  es: [
    "La fortuna favorece a los audaces.",
    "Cada día es una nueva oportunidad para brillar.",
    "Confía en tu intuición, te guiará sabiamente.",
    "La perseverancia es la clave del éxito.",
    "Siembra pensamientos positivos y cosecharás alegría."
  ],
  en: [
    "Fortune favors the bold.",
    "Every day is a new opportunity to shine.",
    "Trust your intuition, it will guide you wisely.",
    "Perseverance is the key to success.",
    "Sow positive thoughts and you will reap joy."
  ],
  de: [
    "Das Glück bevorzugt die Mutigen.",
    "Jeder Tag ist eine neue Gelegenheit zu glänzen.",
    "Vertraue deiner Intuition, sie wird dich weise führen.",
    "Ausdauer ist der Schlüssel zum Erfolg.",
    "Säe positive Gedanken und du wirst Freude ernten."
  ],
  fr: [
    "La fortune sourit aux audacieux.",
    "Chaque jour est une nouvelle opportunité de briller.",
    "Faites confiance à votre intuition, elle vous guidera sagement.",
    "La persévérance est la clé du succès.",
    "Semez des pensées positives et vous récolterez la joie."
  ]
};

export const getLuckyNumbers = (sign: ZodiacSignName, locale: Locale = 'es'): LuckyNumbersData => {
  const phrases = motivationalPhrases[locale] || motivationalPhrases.es;
  
  const colorKeys = Object.keys(luckyColors);
  const gemstoneKeys = Object.keys(luckyGemstones);
  
  const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  const randomGemstoneKey = gemstoneKeys[Math.floor(Math.random() * gemstoneKeys.length)];
  
  // Get the translated value, fallback to Spanish
  const selectedColor = luckyColors[randomColorKey]?.[locale] || luckyColors[randomColorKey]?.es || "Color";
  const selectedGemstone = luckyGemstones[randomGemstoneKey]?.[locale] || luckyGemstones[randomGemstoneKey]?.es || "Gemstone";

  return {
    sign,
    numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
    luckyColor: selectedColor,
    luckyGemstone: selectedGemstone,
    motivationalPhrase: phrases[Math.floor(Math.random() * phrases.length)],
  };
};

const mapOpenMeteoPhaseToApp = (
  phaseValue: number,
  dictionary: Dictionary
): { phaseName: string; illumination: number; phaseKey: MoonPhaseKey } => {
  let phaseKey: MoonPhaseKey;
  let phaseName: string;
  let illumination: number;

  if (phaseValue <= 0.5) { 
    illumination = Math.round(phaseValue * 2 * 100);
  } else { 
    illumination = Math.round((1 - phaseValue) * 2 * 100);
  }
  illumination = Math.max(0, Math.min(100, illumination)); 

  if (phaseValue < 0.03 || phaseValue > 0.97) {
    phaseKey = "new";
  } else if (phaseValue < 0.22) {
    phaseKey = "waxingCrescent";
  } else if (phaseValue < 0.28) {
    phaseKey = "firstQuarter";
  } else if (phaseValue < 0.47) {
    phaseKey = "waxingGibbous";
  } else if (phaseValue < 0.53) {
    phaseKey = "full";
  } else if (phaseValue < 0.72) {
    phaseKey = "waningGibbous";
  } else if (phaseValue < 0.78) {
    phaseKey = "lastQuarter";
  } else { 
    phaseKey = "waningCrescent";
  }

  phaseName = dictionary[`MoonPhase.${phaseKey}`] || dictionary['MoonPhase.unknown'] || "Unknown Phase";

  return { phaseName, illumination, phaseKey };
};

const getIlluminationForPhaseKey = (phaseKey: MoonPhaseKey): number => {
    switch (phaseKey) {
        case 'new': return 0;
        case 'full': return 100;
        case 'firstQuarter': return 50;
        case 'lastQuarter': return 50;
        case 'waxingCrescent': return 25;
        case 'waningCrescent': return 25;
        case 'waxingGibbous': return 75;
        case 'waningGibbous': return 75;
        default: return 50;
    }
};

function getUpcomingPhases(dictionary: Dictionary, locale: Locale): UpcomingPhase[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed

  // Calculate for a wider range to ensure we can find pairs
  const mainPhasesRaw = [
    ...computeLunarPhasesForMonth(year, month - 1),
    ...computeLunarPhasesForMonth(year, month),
    ...computeLunarPhasesForMonth(year, month + 1),
    ...computeLunarPhasesForMonth(year, month + 2), // Add another month for safety
  ];

  // Deduplicate and sort
  const uniqueMainPhases = new Map<string, { date: Date, phaseKey: MoonPhaseKey }>();
  mainPhasesRaw.forEach(p => {
    // Deduplicate by date string to avoid floating point issues from different calculation runs
    uniqueMainPhases.set(p.date.toISOString().slice(0, 13), p);
  });
  
  const sortedMainPhases = Array.from(uniqueMainPhases.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

  const allPhases: { date: Date, phaseKey: MoonPhaseKey }[] = [];

  // Iterate through main phases and insert intermediate ones
  for (let i = 0; i < sortedMainPhases.length - 1; i++) {
    const currentMainPhase = sortedMainPhases[i];
    const nextMainPhase = sortedMainPhases[i + 1];

    // Add the main phase itself
    allPhases.push(currentMainPhase);

    // Calculate and add the intermediate phase
    const intermediateTime = (currentMainPhase.date.getTime() + nextMainPhase.date.getTime()) / 2;
    const intermediateDate = new Date(intermediateTime);
    let intermediatePhaseKey: MoonPhaseKey = 'unknown';

    const mainPhasePair = `${currentMainPhase.phaseKey}-${nextMainPhase.phaseKey}`;

    switch (mainPhasePair) {
        case 'new-firstQuarter':
            intermediatePhaseKey = 'waxingCrescent';
            break;
        case 'firstQuarter-full':
            intermediatePhaseKey = 'waxingGibbous';
            break;
        case 'full-lastQuarter':
            intermediatePhaseKey = 'waningGibbous';
            break;
        case 'lastQuarter-new':
            intermediatePhaseKey = 'waningCrescent';
            break;
    }

    if (intermediatePhaseKey !== 'unknown') {
      allPhases.push({ date: intermediateDate, phaseKey: intermediatePhaseKey });
    }
  }

  // Sort all phases again to ensure correct order
  allPhases.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const futurePhases = allPhases
    .filter(p => p.date.getTime() >= now.getTime())
    .slice(0, 8); // Get more phases to show in the scroll area

  return futurePhases.map(p => ({
    nameKey: `MoonPhase.${p.phaseKey}`,
    phaseKey: p.phaseKey,
    date: p.date.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
    time: p.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
    dateObj: p.date,
    illumination: getIlluminationForPhaseKey(p.phaseKey),
  }));
}


export async function getCurrentLunarData(dictionary: Dictionary, locale: Locale = 'es'): Promise<LunarData> {
  try {
    const today = new Date();
    
    // 1. Calculate current illumination and phase
    const jd = getJulianDay(today);
    const sunLon = getSunLongitude(jd);
    const moonLon = getMoonLongitude(jd);
    const phaseValue = ((moonLon - sunLon + 360) % 360) / 360;
    const { phaseName, illumination, phaseKey } = mapOpenMeteoPhaseToApp(phaseValue, dictionary);
    
    // 2. Determine Moon Sign
    const moonSign = getMoonSign(today);

    // 3. Get phase description and insights from dictionary
    const phaseContent = dictionary.LunarPhaseDescriptions?.[phaseKey] || { description: '', insights: [] };

    // 4. Calculate synodic progress
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const prevMonthPhases = computeLunarPhasesForMonth(year, month - 1);
    const currentMonthPhases = computeLunarPhasesForMonth(year, month);
    const allPhasesCalc = [...prevMonthPhases, ...currentMonthPhases, ...computeLunarPhasesForMonth(year, month + 1)];
    
    const uniquePhaseMap = new Map<string, { date: Date, phaseKey: MoonPhaseKey }>();
    allPhasesCalc.forEach(p => { uniquePhaseMap.set(p.date.toISOString(), p); });
    const sortedPhases = Array.from(uniquePhaseMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let lastNewMoon: { date: Date, phaseKey: MoonPhaseKey } | undefined;
    for (let i = sortedPhases.length - 1; i >= 0; i--) {
        if (sortedPhases[i].phaseKey === 'new' && sortedPhases[i].date <= today) {
            lastNewMoon = sortedPhases[i];
            break;
        }
    }
    
    let nextNewMoon: { date: Date, phaseKey: MoonPhaseKey } | undefined;
    for (const phase of sortedPhases) {
        if (phase.phaseKey === 'new' && phase.date > today) {
            nextNewMoon = phase;
            break;
        }
    }

    let synodicProgress = 0;
    if (lastNewMoon && nextNewMoon) {
        const totalCycleMillis = nextNewMoon.date.getTime() - lastNewMoon.date.getTime();
        const elapsedMillis = today.getTime() - lastNewMoon.date.getTime();
        if (totalCycleMillis > 0) {
          synodicProgress = Math.min(100, (elapsedMillis / totalCycleMillis) * 100);
        }
    }

    return {
      phase: phaseName,
      phaseKey: phaseKey,
      illumination: illumination,
      synodicProgress: synodicProgress,
      currentMoonImage: '', // Deprecated in favor of the SVG visualizer
      moonInSign: moonSign ? (dictionary[moonSign.name] || moonSign.name) : (dictionary['Data.notAvailable'] || 'N/A'),
      moonSignIcon: moonSign ? moonSign.name : undefined,
      upcomingPhases: getUpcomingPhases(dictionary, locale),
      description: phaseContent.description,
      insights: phaseContent.insights,
    };
  } catch (error) {
    return {
      phase: dictionary['MoonPhase.unknown'] || "Unknown Phase",
      phaseKey: "unknown",
      illumination: 0,
      synodicProgress: 0,
      currentMoonImage: '',
      upcomingPhases: getUpcomingPhases(dictionary, locale),
      error: (error as Error).message || "Failed to calculate lunar data",
    };
  }
};



export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData | null => {
  // TODO: Implement a proper geocoding service to convert birthCity to lat/lon.
  // Using fixed coordinates for Madrid, Spain as a placeholder.
  const lat = 40.4168;
  const lon = -3.7038;
  
  if (!birthTime) {
    return null;
  }
  const [hour, minute] = birthTime.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute)) {
    return null;
  }

  const dateWithTime = new Date(birthDate);
  dateWithTime.setUTCHours(hour, minute);

  const jd = getJulianDay(dateWithTime);
  const longitude = getAscendantLongitude(jd, lat, lon);
  const signName = getSignFromDegree(longitude);

  return {
    sign: signName,
    briefExplanation: `Your ascendant sign, ${signName}, influences your outer personality and how others perceive you.`,
  };
};

export const AstroAppLogo = SparklesIcon;
export const WesternAstrologyIcon = StarIcon;
export const ChineseAstrologyIcon = RabbitIcon; // Keep RabbitIcon for the main section title
export const MayanAstrologyIcon = FeatherIcon;
export const GalacticTonesIcon = Layers;
export const CompatibilityIcon = HelpCircle; 
export const KinCalculatorIcon = CalculatorIcon;
export const TarotPersonalityTestIcon = HelpCircle; 


export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  { name: "Rat", icon: RatIcon, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Water", descriptionKey: "ChineseHoroscopePage.descriptions.Rat", detailedInterpretationKey: "ChineseHoroscopeDetail.Rat.interpretation" },
  { name: "Ox", icon: Gitlab, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Earth", descriptionKey: "ChineseHoroscopePage.descriptions.Ox", detailedInterpretationKey: "ChineseHoroscopeDetail.Ox.interpretation" },
  { name: "Tiger", icon: Cat, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Wood", descriptionKey: "ChineseHoroscopePage.descriptions.Tiger", detailedInterpretationKey: "ChineseHoroscopeDetail.Tiger.interpretation" },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Wood", descriptionKey: "ChineseHoroscopePage.descriptions.Rabbit", detailedInterpretationKey: "ChineseHoroscopeDetail.Rabbit.interpretation" },
  { name: "Dragon", icon: Flame, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Earth", descriptionKey: "ChineseHoroscopePage.descriptions.Dragon", detailedInterpretationKey: "ChineseHoroscopeDetail.Dragon.interpretation" },
  { name: "Snake", icon: Worm, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fire", descriptionKey: "ChineseHoroscopePage.descriptions.Snake", detailedInterpretationKey: "ChineseHoroscopeDetail.Snake.interpretation" },
  { name: "Horse", icon: PawPrint, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fire", descriptionKey: "ChineseHoroscopePage.descriptions.Horse", detailedInterpretationKey: "ChineseHoroscopeDetail.Horse.interpretation" },
  { name: "Goat", icon: MountainIcon, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931, 2039], element: "Earth", descriptionKey: "ChineseHoroscopePage.descriptions.Goat", detailedInterpretationKey: "ChineseHoroscopeDetail.Goat.interpretation" },
  { name: "Monkey", icon: Banana, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932, 2040], element: "Metal", descriptionKey: "ChineseHoroscopePage.descriptions.Monkey", detailedInterpretationKey: "ChineseHoroscopeDetail.Monkey.interpretation" },
  { name: "Rooster", icon: BirdIcon, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933, 2041], element: "Metal", descriptionKey: "ChineseHoroscopePage.descriptions.Rooster", detailedInterpretationKey: "ChineseHoroscopeDetail.Rooster.interpretation" },
  { name: "Dog", icon: DogIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934, 2042], element: "Earth", descriptionKey: "ChineseHoroscopePage.descriptions.Dog", detailedInterpretationKey: "ChineseHoroscopeDetail.Dog.interpretation" },
  { name: "Pig", icon: Shell, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935, 2043], element: "Water", descriptionKey: "ChineseHoroscopePage.descriptions.Pig", detailedInterpretationKey: "ChineseHoroscopeDetail.Pig.interpretation" },
];
export const ALL_CHINESE_SIGN_NAMES = CHINESE_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];


export const getChineseZodiacSignAndElement = (birthYear: number): ChineseZodiacResult | null => {
  for (const sign of CHINESE_ZODIAC_SIGNS) {
    if (sign.years.includes(birthYear)) {
      return {
        animal: sign.name,
        element: sign.element,
        year: birthYear,
        icon: sign.icon, 
      };
    }
  }
  return null;
};

export function getChineseCompatibility(animal1: ChineseAnimalSignName, animal2: ChineseAnimalSignName, locale: Locale = 'es'): ChineseCompatibilityData {
  const key1 = `${animal1}-${animal2}`;
  const key2 = `${animal2}-${animal1}`;
  
  const pairingData: ChineseCompatibilityReportDetail | undefined = chineseCompatibilityPairings[key1] || chineseCompatibilityPairings[key2];
  
  if (pairingData) {
    return {
      animal1,
      animal2,
      report: pairingData.report[locale] || pairingData.report.es, // Use selected locale, fallback to Spanish
      score: pairingData.score,
    };
  }
  
  // Generic fallback with translations
  const genericReports: Record<Locale, string> = {
      es: `La conexión entre ${animal1} y ${animal2} es única. No hay una regla fija, pero su dinámica se basa en el respeto mutuo y la comprensión de sus diferencias. (Informe genérico).`,
      en: `The connection between ${animal1} and ${animal2} is unique. There's no fixed rule, but their dynamic relies on mutual respect and understanding their differences. (Generic report).`,
      de: `Die Verbindung zwischen ${animal1} und ${animal2} ist einzigartig. Es gibt keine feste Regel, aber ihre Dynamik beruht auf gegenseitigem Respekt und dem Verständnis ihrer Unterschiede. (Allgemeiner Bericht).`,
      fr: `La connexion entre ${animal1} et ${animal2} est unique. Il n'y a pas de règle fixe, mais leur dynamique repose sur le respect mutuel et la compréhension de leurs différences. (Rapport générique).`
  };

  return {
    animal1,
    animal2,
    report: genericReports[locale] || genericReports.es,
    score: Math.floor(Math.random() * 3) + 2, // Random score between 2 and 4 for generic cases
  };
}


export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", nameKey: "MayanSign.Imix.name", icon: Flame, descriptionKey: "MayanSign.Imix.description", detailedInterpretationKey: "MayanSign.Imix.interpretation", associatedColor: "Rojo" },
  { name: "Ik", nameKey: "MayanSign.Ik.name", icon: Wind, descriptionKey: "MayanSign.Ik.description", detailedInterpretationKey: "MayanSign.Ik.interpretation", associatedColor: "Blanco" },
  { name: "Akbal", nameKey: "MayanSign.Akbal.name", icon: Moon, descriptionKey: "MayanSign.Akbal.description", detailedInterpretationKey: "MayanSign.Akbal.interpretation", associatedColor: "Negro/Azul" },
  { name: "Kan", nameKey: "MayanSign.Kan.name", icon: Leaf, descriptionKey: "MayanSign.Kan.description", detailedInterpretationKey: "MayanSign.Kan.interpretation", associatedColor: "Amarillo" },
  { name: "Chicchan", nameKey: "MayanSign.Chicchan.name", icon: Worm, descriptionKey: "MayanSign.Chicchan.description", detailedInterpretationKey: "MayanSign.Chicchan.interpretation", associatedColor: "Rojo" },
  { name: "Cimi", nameKey: "MayanSign.Cimi.name", icon: RefreshCw, descriptionKey: "MayanSign.Cimi.description", detailedInterpretationKey: "MayanSign.Cimi.interpretation", associatedColor: "Blanco" },
  { name: "Manik", nameKey: "MayanSign.Manik.name", icon: Hand, descriptionKey: "MayanSign.Manik.description", detailedInterpretationKey: "MayanSign.Manik.interpretation", associatedColor: "Azul/Negro" },
  { name: "Lamat", nameKey: "MayanSign.Lamat.name", icon: StarIcon, descriptionKey: "MayanSign.Lamat.description", detailedInterpretationKey: "MayanSign.Lamat.interpretation", associatedColor: "Amarillo" },
  { name: "Muluc", nameKey: "MayanSign.Muluc.name", icon: Droplets, descriptionKey: "MayanSign.Muluc.description", detailedInterpretationKey: "MayanSign.Muluc.interpretation", associatedColor: "Rojo" },
  { name: "Oc", nameKey: "MayanSign.Oc.name", icon: DogIcon, descriptionKey: "MayanSign.Oc.description", detailedInterpretationKey: "MayanSign.Oc.interpretation", associatedColor: "Blanco" },
  { name: "Chuen", nameKey: "MayanSign.Chuen.name", icon: Banana, descriptionKey: "MayanSign.Chuen.description", detailedInterpretationKey: "MayanSign.Chuen.interpretation", associatedColor: "Azul/Negro" },
  { name: "Eb", nameKey: "MayanSign.Eb.name", icon: Route, descriptionKey: "MayanSign.Eb.description", detailedInterpretationKey: "MayanSign.Eb.interpretation", associatedColor: "Amarillo" },
  { name: "Ben", nameKey: "MayanSign.Ben.name", icon: Baseline, descriptionKey: "MayanSign.Ben.description", detailedInterpretationKey: "MayanSign.Ben.interpretation", associatedColor: "Rojo" },
  { name: "Ix", nameKey: "MayanSign.Ix.name", icon: Cat, descriptionKey: "MayanSign.Ix.description", detailedInterpretationKey: "MayanSign.Ix.interpretation", associatedColor: "Blanco" },
  { name: "Men", nameKey: "MayanSign.Men.name", icon: BirdIcon, descriptionKey: "MayanSign.Men.description", detailedInterpretationKey: "MayanSign.Men.interpretation", associatedColor: "Azul/Negro" },
  { name: "Cib", nameKey: "MayanSign.Cib.name", icon: Eye, descriptionKey: "MayanSign.Cib.description", detailedInterpretationKey: "MayanSign.Cib.interpretation", associatedColor: "Amarillo" },
  { name: "Caban", nameKey: "MayanSign.Caban.name", icon: MountainIcon, descriptionKey: "MayanSign.Caban.description", detailedInterpretationKey: "MayanSign.Caban.interpretation", associatedColor: "Rojo" },
  { name: "Etznab", nameKey: "MayanSign.Etznab.name", icon: Scissors, descriptionKey: "MayanSign.Etznab.description", detailedInterpretationKey: "MayanSign.Etznab.interpretation", associatedColor: "Blanco" },
  { name: "Cauac", nameKey: "MayanSign.Cauac.name", icon: Zap, descriptionKey: "MayanSign.Cauac.description", detailedInterpretationKey: "MayanSign.Cauac.interpretation", associatedColor: "Azul/Negro" },
  { name: "Ahau", nameKey: "MayanSign.Ahau.name", icon: Sun, descriptionKey: "MayanSign.Ahau.description", detailedInterpretationKey: "MayanSign.Ahau.interpretation", associatedColor: "Amarillo" },
];

export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];

export const GALACTIC_TONES: GalacticTone[] = [
  { id: 1, nameKey: "Magnetic", keywordKey: "Unity", questionKey: "WhatIsMyGoal", detailedInterpretationKey: "GalacticTone.Magnetic.interpretation" },
  { id: 2, nameKey: "Lunar", keywordKey: "Challenge", questionKey: "WhatAreTheObstacles", detailedInterpretationKey: "GalacticTone.Lunar.interpretation" },
  { id: 3, nameKey: "Electric", keywordKey: "Service", questionKey: "HowCanIBestServe", detailedInterpretationKey: "GalacticTone.Electric.interpretation" },
  { id: 4, nameKey: "SelfExisting", keywordKey: "Form", questionKey: "WhatIsTheFormOfAction", detailedInterpretationKey: "GalacticTone.SelfExisting.interpretation" },
  { id: 5, nameKey: "Overtone", keywordKey: "Radiance", questionKey: "HowCanIEmpowerMyself", detailedInterpretationKey: "GalacticTone.Overtone.interpretation" },
  { id: 6, nameKey: "Rhythmic", keywordKey: "Equality", questionKey: "HowCanIOrganizeForEquality", detailedInterpretationKey: "GalacticTone.Rhythmic.interpretation" },
  { id: 7, nameKey: "Resonant", keywordKey: "Attunement", questionKey: "HowCanIAlignMyService", detailedInterpretationKey: "GalacticTone.Resonant.interpretation" },
  { id: 8, nameKey: "Galactic", keywordKey: "Integrity", questionKey: "DoILiveWhatIBelieve", detailedInterpretationKey: "GalacticTone.Galactic.interpretation" },
  { id: 9, nameKey: "Solar", keywordKey: "Intention", questionKey: "HowDoIAchieveMyPurpose", detailedInterpretationKey: "GalacticTone.Solar.interpretation" },
  { id: 10, nameKey: "Planetary", keywordKey: "Manifestation", questionKey: "HowDoIPerfectWhatIDo", detailedInterpretationKey: "GalacticTone.Planetary.interpretation" },
  { id: 11, nameKey: "Spectral", keywordKey: "Liberation", questionKey: "HowDoIReleaseAndLetGo", detailedInterpretationKey: "GalacticTone.Spectral.interpretation" },
  { id: 12, nameKey: "Crystal", keywordKey: "Cooperation", questionKey: "HowCanIDedicateToCooperation", detailedInterpretationKey: "GalacticTone.Crystal.interpretation" },
  { id: 13, nameKey: "Cosmic", keywordKey: "Presence", questionKey: "HowCanIExpandMyJoyAndLove", detailedInterpretationKey: "GalacticTone.Cosmic.interpretation" },
];


const DREAMSPELL_BASE_DATE_GREGORIAN = new Date(1987, 7 - 1, 26); 
const DREAMSPELL_BASE_KIN_NUMBER = 1; 

function getDaysDifference(date1: Date, date2: Date): number {
  const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = utcDate2 - utcDate1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateMayanKin(birthDate: Date): MayanKinInfo | null {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return null;
  }

  const daysDiff = getDaysDifference(DREAMSPELL_BASE_DATE_GREGORIAN, birthDate);
  const kinIndexToday = ( (DREAMSPELL_BASE_KIN_NUMBER - 1 + daysDiff) % 260 + 260) % 260;
  const kinNumber = kinIndexToday + 1;
  const daySignIndex = kinIndexToday % 20;
  const toneId = (kinIndexToday % 13) + 1;

  const daySign = MAYAN_ZODIAC_SIGNS[daySignIndex];
  const tone = GALACTIC_TONES.find(t => t.id === toneId);

  if (!daySign || !tone) {
    console.error("Error calculating Mayan Kin: Could not find sign or tone for indices.", {daySignIndex, toneId, kinIndexToday, daysDiff});
    return null;
  }

  return { daySign, tone, kinNumber };
}

export const MAJOR_ARCANA_TAROT_CARDS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const MINOR_ARCANA_SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const MINOR_ARCANA_RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

const MINOR_ARCANA_TAROT_CARDS = MINOR_ARCANA_SUITS.flatMap(suit => 
  MINOR_ARCANA_RANKS.map(rank => `${rank} of ${suit}`)
);

export const ALL_TAROT_CARDS = [
  ...MAJOR_ARCANA_TAROT_CARDS,
  ...MINOR_ARCANA_TAROT_CARDS
];

// Map of AI card names (English) to the expected filename format
// This map is the single source of truth for converting names to file paths.
const TAROT_CARD_FILENAME_MAP: { [key: string]: string } = {
    // Major Arcana
    "The Fool": "the_fool",
    "The Magician": "the_magician",
    "The High Priestess": "the_high_priestess",
    "The Empress": "the_empress",
    "The Emperor": "the_emperor",
    "The Hierophant": "the_hierophant",
    "The Lovers": "the_lovers",
    "The Chariot": "the_chariot",
    "Strength": "strength",
    "The Hermit": "the_hermit",
    "Wheel of Fortune": "wheel_of_fortune",
    "Justice": "justice",
    "The Hanged Man": "the_hanged_man",
    "Death": "death",
    "Temperance": "temperance",
    "The Devil": "the_devil",
    "The Tower": "the_tower",
    "The Star": "the_star",
    "The Moon": "the_moon",
    "The Sun": "the_sun",
    "Judgement": "judgement",
    "The World": "the_world",
    // Minor Arcana (Wands)
    "Ace of Wands": "ace_of_wands",
    "Two of Wands": "two_of_wands",
    "Three of Wands": "three_of_wands",
    "Four of Wands": "four_of_wands",
    "Five of Wands": "five_of_wands",
    "Six of Wands": "six_of_wands",
    "Seven of Wands": "seven_of_wands",
    "Eight of Wands": "eight_of_wands",
    "Nine of Wands": "nine_of_wands",
    "Ten of Wands": "ten_of_wands",
    "Page of Wands": "page_of_wands",
    "Knight of Wands": "knight_of_wands",
    "Queen of Wands": "queen_of_wands",
    "King of Wands": "king_of_wands",
    // Minor Arcana (Cups)
    "Ace of Cups": "ace_of_cups",
    "Two of Cups": "two_of_cups",
    "Three of Cups": "three_of_cups",
    "Four of Cups": "four_of_cups",
    "Five of Cups": "five_of_cups",
    "Six of Cups": "six_of_cups",
    "Seven of Cups": "seven_of_cups",
    "Eight of Cups": "eight_of_cups",
    "Nine of Cups": "nine_of_cups",
    "Ten of Cups": "ten_of_cups",
    "Page of Cups": "page_of_cups",
    "Knight of Cups": "knight_of_cups",
    "Queen of Cups": "queen_of_cups",
    "King of Cups": "king_of_cups",
    // Minor Arcana (Swords)
    "Ace of Swords": "ace_of_swords",
    "Two of Swords": "two_of_swords",
    "Three of Swords": "three_of_swords",
    "Four of Swords": "four_of_swords",
    "Five of Swords": "five_of_swords",
    "Six of Swords": "six_of_swords",
    "Seven of Swords": "seven_of_swords",
    "Eight of Swords": "eight_of_swords",
    "Nine of Swords": "nine_of_swords",
    "Ten of Swords": "ten_of_swords",
    "Page of Swords": "page_of_swords",
    "Knight of Swords": "knight_of_swords",
    "Queen of Swords": "queen_of_swords",
    "King of Swords": "king_of_swords",
    // Minor Arcana (Pentacles)
    "Ace of Pentacles": "ace_of_pentacles",
    "Two of Pentacles": "two_of_pentacles",
    "Three of Pentacles": "three_of_pentacles",
    "Four of Pentacles": "four_of_pentacles",
    "Five of Pentacles": "five_of_pentacles",
    "Six of Pentacles": "six_of_pentacles",
    "Seven of Pentacles": "seven_of_pentacles",
    "Eight of Pentacles": "eight_of_pentacles",
    "Nine of Pentacles": "nine_of_pentacles",
    "Ten of Pentacles": "ten_of_pentacles",
    "Page of Pentacles": "page_of_pentacles",
    "Knight of Pentacles": "knight_of_pentacles",
    "Queen of Pentacles": "queen_of_pentacles",
    "King of Pentacles": "king_of_pentacles"
};

// Centralized function to get tarot card image paths correctly.
export const getTarotCardImagePath = (cardNameFromAI: string): string => {
  const basePath = '/custom_assets/tarot_cards/';
  const fallbackImage = "https://placehold.co/220x385.png?text=Error";

  if (!cardNameFromAI) {
    console.warn(`[getTarotCardImagePath] Received an empty card name. Using placeholder.`);
    return fallbackImage;
  }
  
  const fileName = TAROT_CARD_FILENAME_MAP[cardNameFromAI.trim()];

  if (fileName) {
    return `${basePath}${fileName}.png`;
  }
  
  // Fallback for names that might not be in the map (should not happen with a complete map)
  console.warn(`[getTarotCardImagePath] Card name "${cardNameFromAI}" not found in map. Falling back to a generic name.`);
  const genericFileName = cardNameFromAI.trim().toLowerCase().replace(/\s+/g, '_');
  return `${basePath}${genericFileName}.png`;
};


export { Briefcase as WorkIcon };

const transits: DailyTransit[] = [
  { titleKey: "VenusTrineMoon", descriptionKey: "EnergyForLove", icon: Heart },
  { titleKey: "SunConjunctMercury", descriptionKey: "ExcellentForCommunication", icon: Sun },
  { titleKey: "MarsSquareSaturn", descriptionKey: "ChallengesRequiringPatience", icon: Zap },
  { titleKey: "JupiterEntersPisces", descriptionKey: "ExpansionOfCreativity", icon: TrendingUp },
  { titleKey: "MercuryRetrograde", descriptionKey: "ReviewReflect", icon: TrendingUp },
  { titleKey: "FullMoonInScorpio", descriptionKey: "EmotionalIntensity", icon: Moon },
  { titleKey: "SunTrineJupiter", descriptionKey: "OptimismGrowth", icon: StarIcon },
];

export const getDailyTransit = (date: Date): DailyTransit => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return transits[dayOfYear % transits.length];
};
