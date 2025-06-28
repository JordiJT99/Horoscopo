

import type { ZodiacSignName, ZodiacSign, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo, AstrologicalElement, AstrologicalPolarity, AstrologicalModality, UpcomingPhase, MoonPhaseKey, DailyTransit } from '@/types';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Sparkles as SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Layers, Calculator as CalculatorIcon, HelpCircle, Briefcase, Waves, Wind, Sun, Moon, Leaf, Droplets, Flame, Rat as RatIcon, Dog as DogIcon, Bird as BirdIcon, Banana, Worm, Mountain as MountainIcon, Cat, PawPrint, Gitlab, Shell, TrendingUp, Zap, Heart } from 'lucide-react';
import { loveCompatibilityPairings } from './constantslove';
import { friendshipCompatibilityPairings } from './constantsfriendship';
import { workCompatibilityPairings } from './constantswork';
import type { CompatibilityReportDetail } from './constantslove'; 
import { chineseCompatibilityPairings, type ChineseCompatibilityReportDetail } from './constantshoroscopochino';


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
  const day = date.getDate();
  const month = date.getMonth() + 1; // JS months are 0-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS.find(s => s.name === "Aries")!;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Taurus")!;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Gemini")!;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Cancer")!;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Leo")!;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Virgo")!;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Libra")!;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS.find(s => s.name === "Scorpio")!;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS.find(s => s.name === "Sagittarius")!;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS.find(s => s.name === "Aquarius")!;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Pisces")!;
  
  return null;
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
  // A simple deterministic calculation for moon sign
  const moonDegree = ((date.getDate() * 12 + date.getHours() * 0.5) % 360);
  const moonSignName = getSignFromDegree(moonDegree);
  return ZODIAC_SIGNS.find(s => s.name === moonSignName) || null;
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

export const getMoonImageUrl = (phaseKey: MoonPhaseKey, size: string = '80x80'): string => {
  const base = 'https://placehold.co';
  const colors = '2D3748/E2E8F0';
  let text = phaseKey.substring(0, 2).toUpperCase();
  if (phaseKey === 'firstQuarter') text = 'FQ';
  if (phaseKey === 'lastQuarter') text = 'LQ';
  if (phaseKey === 'new') text = 'NM';
  if (phaseKey === 'full') text = 'FM';
  if (phaseKey === 'unknown') text = '??';
  return `${base}/${size}/${colors}.png?text=${text}`;
};

export const getMockUpcomingPhases = (dictionary: Dictionary): UpcomingPhase[] => {
  return [
    { nameKey: "MoonPhase.firstQuarter", date: dictionary['UpcomingPhase.sampleDate1'] || "Jun 2", iconUrl: getMoonImageUrl('firstQuarter', '48x48'), phaseKey: "firstQuarter" },
    { nameKey: "MoonPhase.full", date: dictionary['UpcomingPhase.sampleDate2'] || "Jun 9", iconUrl: getMoonImageUrl('full', '48x48'), phaseKey: "full" },
    { nameKey: "MoonPhase.lastQuarter", date: dictionary['UpcomingPhase.sampleDate3'] || "Jun 16", iconUrl: getMoonImageUrl('lastQuarter', '48x48'), phaseKey: "lastQuarter" },
    { nameKey: "MoonPhase.new", date: dictionary['UpcomingPhase.sampleDate4'] || "Jun 23", iconUrl: getMoonImageUrl('new', '48x48'), phaseKey: "new" },
  ];
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


export const getCurrentLunarData = async (dictionary: Dictionary, locale: Locale = 'es'): Promise<LunarData> => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&daily=moon_phase&timezone=GMT&start_date=${formattedDate}&end_date=${formattedDate}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Open-Meteo API request failed:", response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (data.daily && data.daily.moon_phase && data.daily.moon_phase.length > 0) {
      const phaseValueToday = data.daily.moon_phase[0];
      const { phaseName, illumination, phaseKey } = mapOpenMeteoPhaseToApp(phaseValueToday, dictionary);

      return {
        phase: phaseName,
        phaseKey: phaseKey,
        illumination: illumination,
        currentMoonImage: getMoonImageUrl(phaseKey), 
        upcomingPhases: getMockUpcomingPhases(dictionary), 
      };
    } else {
      console.error("Open-Meteo API response missing expected data:", data);
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error fetching or processing lunar data:", error);
    return {
      phase: dictionary['MoonPhase.unknown'] || "Unknown Phase",
      phaseKey: "unknown",
      illumination: 0,
      currentMoonImage: getMoonImageUrl('unknown'),
      upcomingPhases: getMockUpcomingPhases(dictionary),
      error: (error as Error).message || "Failed to load lunar data",
    };
  }
};


export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData | null => {
  if (!birthTime) {
    return null;
  }
  const [hour, minute] = birthTime.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute)) {
    return null;
  }

  // This is a simplified deterministic calculation for ascendant sign
  // A real calculation is extremely complex. This provides a believable mock.
  const ascendantDegree = ((hour * 15 + minute / 4) % 360);
  const ascendantSignName = getSignFromDegree(ascendantDegree);

  return {
    sign: ascendantSignName,
    briefExplanation: `Tu signo ascendente, ${ascendantSignName}, influye en tu personalidad externa y cómo te perciben los demás.`,
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
  { name: "Rat", icon: RatIcon, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Water", description: "Inventiva, ingeniosa, encantadora y persuasiva." },
  { name: "Ox", icon: Gitlab, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Earth", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: Cat, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Wood", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Wood", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: Flame, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Earth", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: Worm, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fire", description: "Enigmática, inteligente, sabia e intuitiva." },
  { name: "Horse", icon: PawPrint, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fire", description: "Vivaz, activo, enérgico y le encanta estar entre la multitud." },
  { name: "Goat", icon: MountainIcon, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931, 2039], element: "Earth", description: "Amable, de buenos modales, tímida, estable, comprensiva y amigable." },
  { name: "Monkey", icon: Banana, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932, 2040], element: "Metal", description: "Agudo, inteligente, curioso y travieso." },
  { name: "Rooster", icon: BirdIcon, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933, 2041], element: "Metal", description: "Observador, trabajador, ingenioso, valiente y talentoso." },
  { name: "Dog", icon: DogIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934, 2042], element: "Earth", description: "Leal, honesto, amable, bondadoso, cauteloso y prudente." },
  { name: "Pig", icon: Shell, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935, 2043], element: "Water", description: "Diligente, compasivo, generoso y de trato fácil." },
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


const DefaultMayanIcon = HelpCircle; 

export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Imix.description", detailedInterpretationKey: "MayanSign.Imix.interpretation", associatedColor: "Rojo" },
  { name: "Ik", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Ik.description", detailedInterpretationKey: "MayanSign.Ik.interpretation", associatedColor: "Blanco" },
  { name: "Akbal", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Akbal.description", detailedInterpretationKey: "MayanSign.Akbal.interpretation", associatedColor: "Negro/Azul" },
  { name: "Kan", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Kan.description", detailedInterpretationKey: "MayanSign.Kan.interpretation", associatedColor: "Amarillo" },
  { name: "Chicchan", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Chicchan.description", detailedInterpretationKey: "MayanSign.Chicchan.interpretation", associatedColor: "Rojo" },
  { name: "Cimi", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Cimi.description", detailedInterpretationKey: "MayanSign.Cimi.interpretation", associatedColor: "Blanco" },
  { name: "Manik", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Manik.description", detailedInterpretationKey: "MayanSign.Manik.interpretation", associatedColor: "Azul/Negro" },
  { name: "Lamat", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Lamat.description", detailedInterpretationKey: "MayanSign.Lamat.interpretation", associatedColor: "Amarillo" },
  { name: "Muluc", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Muluc.description", detailedInterpretationKey: "MayanSign.Muluc.interpretation", associatedColor: "Rojo" },
  { name: "Oc", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Oc.description", detailedInterpretationKey: "MayanSign.Oc.interpretation", associatedColor: "Blanco" },
  { name: "Chuen", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Chuen.description", detailedInterpretationKey: "MayanSign.Chuen.interpretation", associatedColor: "Azul/Negro" },
  { name: "Eb", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Eb.description", detailedInterpretationKey: "MayanSign.Eb.interpretation", associatedColor: "Amarillo" },
  { name: "Ben", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Ben.description", detailedInterpretationKey: "MayanSign.Ben.interpretation", associatedColor: "Rojo" },
  { name: "Ix", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Ix.description", detailedInterpretationKey: "MayanSign.Ix.interpretation", associatedColor: "Blanco" },
  { name: "Men", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Men.description", detailedInterpretationKey: "MayanSign.Men.interpretation", associatedColor: "Azul/Negro" },
  { name: "Cib", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Cib.description", detailedInterpretationKey: "MayanSign.Cib.interpretation", associatedColor: "Amarillo" },
  { name: "Caban", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Caban.description", detailedInterpretationKey: "MayanSign.Caban.interpretation", associatedColor: "Rojo" },
  { name: "Etznab", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Etznab.description", detailedInterpretationKey: "MayanSign.Etznab.interpretation", associatedColor: "Blanco" },
  { name: "Cauac", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Cauac.description", detailedInterpretationKey: "MayanSign.Cauac.interpretation", associatedColor: "Azul/Negro" },
  { name: "Ahau", icon: DefaultMayanIcon, descriptionKey: "MayanSign.Ahau.description", detailedInterpretationKey: "MayanSign.Ahau.interpretation", associatedColor: "Amarillo" },
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
