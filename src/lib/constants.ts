
import type { ZodiacSignName, ZodiacSign, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo, AstrologicalElement, AstrologicalPolarity, AstrologicalModality, UpcomingPhase, MoonPhaseKey } from '@/types';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Sparkles as SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Layers, Calculator as CalculatorIcon, HelpCircle, Briefcase, Waves, Wind, Sun, Moon, Leaf, Mountain, Droplets, Flame, Rat, Dog, Bird, Banana, Worm } from 'lucide-react';


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


export const ALL_SIGN_NAMES = ZODIAC_SIGNS.map(sign => sign.name) as [ZodiacSignName, ...ZodiacSignName[]];

interface CompatibilityReportDetail {
  report: string;
  score: number;
}
interface CompatibilityReportsByType {
  love: CompatibilityReportDetail;
  friendship: CompatibilityReportDetail;
  work: CompatibilityReportDetail;
}

const compatibilityPairings: Record<string, CompatibilityReportsByType> = {};

function getGenericCompatibilityReport(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityReportDetail {
  const typeText = type === 'love' ? (locale === 'es' ? 'amorosa' : 'romantic') : (type === 'friendship' ? (locale === 'es' ? 'de amistad' : 'friendship') : (locale === 'es' ? 'laboral' : 'work'));
  let generalNote = `La conexión ${typeText} entre ${sign1} y ${sign2} es única, tejida con los hilos de sus elementos y modalidades distintivas. ${sign1}, con su energía inherente, interactúa con ${sign2}, quien aporta su característica distintiva, creando una dinámica que puede ser tanto complementaria como desafiante para este tipo de relación. Es un encuentro de dos mundos que, con entendimiento, pueden enriquecerse mutuamente. (Este es un informe de compatibilidad general para ${type}. Los detalles específicos pueden variar.)`;
  
  if (locale === 'en') {
    generalNote = `The ${typeText} connection between ${sign1} and ${sign2} is unique, woven with the threads of their distinct elements and modalities. ${sign1}, with its inherent energy, interacts with ${sign2}, who brings their characteristic distinctiveness, creating a dynamic that can be both complementary and challenging for this type of relationship. It's an encounter of two worlds that, with understanding, can enrich each other. (This is a general compatibility report for ${type}. Specific details may vary.)`;
  } else if (locale === 'de') {
    generalNote = `Die ${typeText} Verbindung zwischen ${sign1} und ${sign2} ist einzigartig, gewebt aus den Fäden ihrer unterschiedlichen Elemente und Modalitäten. ${sign1}, mit seiner inhärenten Energie, interagiert mit ${sign2}, der seine charakteristische Besonderheit einbringt, und schafft eine Dynamik, die für diese Art von Beziehung sowohl ergänzend als auch herausfordernd sein kann. Es ist eine Begegnung zweier Welten, die sich mit Verständnis gegenseitig bereichern können. (Dies ist ein allgemeiner Kompatibilitätsbericht für ${type}. Spezifische Details können variieren.)`;
  } else if (locale === 'fr') {
    generalNote = `La connexion ${typeText} entre ${sign1} et ${sign2} est unique, tissée avec les fils de leurs éléments et modalités distincts. ${sign1}, avec son énergie inhérente, interagit avec ${sign2}, qui apporte sa particularité caractéristique, créant une dynamique qui peut être à la fois complémentaire et stimulante pour ce type de relation. C'est une rencontre de deux mondes qui, avec compréhension, peuvent s'enrichir mutuellement. (Ceci est un rapport de compatibilité général pour ${type}. Les détails spécifiques могут varier.)`;
  }


  let baseScore = 3; 
  const selfPairKey = `${sign1}-${sign1}`;
  if (sign1 === sign2 && compatibilityPairings[selfPairKey] && compatibilityPairings[selfPairKey][type]) {
    baseScore = compatibilityPairings[selfPairKey][type].score;
  }

  return {
    report: generalNote,
    score: baseScore 
  };
}

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityData {
  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  let reportData: CompatibilityReportDetail | undefined;

  const pairingTypeData1 = compatibilityPairings[key1];
  if (pairingTypeData1 && pairingTypeData1[type]) {
    reportData = pairingTypeData1[type];
  } else {
    const pairingTypeData2 = compatibilityPairings[key2];
    if (pairingTypeData2 && pairingTypeData2[type]) {
      reportData = pairingTypeData2[type];
    }
  }
  
  if (!reportData) {
    console.warn(`No specific compatibility report found for ${sign1}-${sign2} of type ${type}. Using generic report.`);
    reportData = getGenericCompatibilityReport(sign1, sign2, type, locale);
  }

  return {
    sign1,
    sign2,
    report: reportData.report,
    score: reportData.score,
  };
}

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
  return {
    sign,
    numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
    luckyColor: ["Rojo", "Verde", "Azul", "Amarillo", "Púrpura", "Naranja"][Math.floor(Math.random() * 6)],
    luckyGemstone: ["Diamante", "Esmeralda", "Zafiro", "Rubí", "Amatista", "Topacio"][Math.floor(Math.random() * 6)],
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


export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData => {
  const month = birthDate.getMonth(); 
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Tu signo ascendente, ${ascendantSign}, influye en tu personalidad externa y cómo te perciben los demás. Juega un papel importante en tus primeras impresiones y reacciones espontáneas. (Explicación de ejemplo en español, para ${birthCity} a las ${birthTime} del ${birthDate.toLocaleDateString()}).`,
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
  { name: "Rat", icon: Rat, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Water", description: "Inventiva, ingeniosa, encantadora y persuasiva." },
  { name: "Ox", icon: null, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Earth", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: null, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Wood", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Wood", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: Flame, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Earth", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: Worm, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fire", description: "Enigmática, inteligente, sabia e intuitiva." },
  { name: "Horse", icon: null, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fire", description: "Vivaz, activo, enérgico y le encanta estar entre la multitud." },
  { name: "Goat", icon: Mountain, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931, 2039], element: "Earth", description: "Amable, de buenos modales, tímida, estable, comprensiva y amigable." },
  { name: "Monkey", icon: Banana, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932, 2040], element: "Metal", description: "Agudo, inteligente, curioso y travieso." },
  { name: "Rooster", icon: Bird, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933, 2041], element: "Metal", description: "Observador, trabajador, ingenioso, valiente y talentoso." },
  { name: "Dog", icon: Dog, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934, 2042], element: "Earth", description: "Leal, honesto, amable, bondadoso, cauteloso y prudente." },
  { name: "Pig", icon: null, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935, 2043], element: "Water", description: "Diligente, compasivo, generoso y de trato fácil." },
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

export const getChineseCompatibility = (animal1: ChineseAnimalSignName, animal2: ChineseAnimalSignName, locale: Locale = 'es'): ChineseCompatibilityData => {
  const compatibilityPairings: Record<string, { reportKey: string; score: number }> = {
    "Rat-Dragon": { reportKey: "Compatibility.RatDragon", score: 5 },
    "Rat-Monkey": { reportKey: "Compatibility.RatMonkey", score: 5 },
    "Dragon-Monkey": { reportKey: "Compatibility.DragonMonkey", score: 5 },
    "Ox-Snake": { reportKey: "Compatibility.OxSnake", score: 5 },
    "Ox-Rooster": { reportKey: "Compatibility.OxRooster", score: 4 },
    "Snake-Rooster": { reportKey: "Compatibility.SnakeRooster", score: 5 },
    "Tiger-Horse": { reportKey: "Compatibility.TigerHorse", score: 5 },
    "Tiger-Dog": { reportKey: "Compatibility.TigerDog", score: 4 },
    "Horse-Dog": { reportKey: "Compatibility.HorseDog", score: 5 },
    "Rabbit-Goat": { reportKey: "Compatibility.RabbitGoat", score: 5 },
    "Rabbit-Pig": { reportKey: "Compatibility.RabbitPig", score: 5 },
    "Goat-Pig": { reportKey: "Compatibility.GoatPig", score: 5 },
    "Rat-Ox": { reportKey: "Compatibility.RatOx", score: 5 },
    "Tiger-Pig": { reportKey: "Compatibility.TigerPig", score: 5 },
    "Rabbit-Dog": { reportKey: "Compatibility.RabbitDog", score: 5 },
    "Dragon-Rooster": { reportKey: "Compatibility.DragonRooster", score: 5 },
    "Snake-Monkey": { reportKey: "Compatibility.SnakeMonkey", score: 4 },
    "Horse-Goat": { reportKey: "Compatibility.HorseGoat", score: 5 },
    "Rat-Rabbit": { reportKey: "Compatibility.RatRabbit", score: 3 },
    "Ox-Tiger": { reportKey: "Compatibility.OxTiger", score: 2 },
    "Tiger-Snake": { reportKey: "Compatibility.TigerSnake", score: 2 },
    "Dragon-Dog": { reportKey: "Compatibility.DragonDog", score: 1 },
    "Horse-Rooster": { reportKey: "Compatibility.HorseRooster", score: 2 },
  };
  const key1 = `${animal1}-${animal2}`;
  const key2 = `${animal2}-${animal1}`;

  let pairingData = compatibilityPairings[key1] || compatibilityPairings[key2];
  
  let reportText = `La compatibilidad entre ${animal1} y ${animal2} tiene sus propios matices únicos. (Informe genérico).`;
  let score = Math.floor(Math.random() * 3) + 2;

  if (pairingData) {
    reportText = `Informe específico para ${animal1} y ${animal2} (${pairingData.reportKey}).`;
    score = pairingData.score;
  }

  return {
    animal1,
    animal2,
    report: reportText,
    score: score,
  };
};


const DefaultMayanIcon = HelpCircle; 

export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragón/Cocodrilo - Representa el mar primordial, la fuente de toda vida, abundancia y nuevos comienzos.", detailedInterpretation: "Imix es la energía de la iniciación pura, la nutrición y el sustento maternal. Te invita a confiar en la abundancia del universo y a atreverte a empezar de nuevo. Es un día para conectar con tus instintos más primarios y recordar que todo es posible.", associatedColor: "Rojo" },
  { name: "Ik", icon: DefaultMayanIcon, description: "Viento - Simboliza el viento, el aliento, el espíritu, la fuerza vital, la comunicación y la inspiración.", detailedInterpretation: "Ik es el aliento de vida, la comunicación divina y la verdad. Te impulsa a expresar tu verdad con claridad y a escuchar los mensajes sutiles del espíritu. Es un día para la inspiración, las nuevas ideas y la conexión con lo invisible.", associatedColor: "Blanco" },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Noche/Casa - Significa noche, oscuridad, el inframundo y el cuerpo. Un lugar de misterio, sueños e introspección.", detailedInterpretation: "Akbal te sumerge en el misterio de la oscuridad, el mundo de los sueños y la introspección profunda. Es un tiempo para mirar hacia adentro, encontrar la paz en la quietud y descubrir la abundancia que reside en tu ser interior. Confía en tu intuición.", associatedColor: "Negro/Azul" },
  { name: "Kan", icon: DefaultMayanIcon, description: "Semilla/Lagarto - Representa la semilla, la maduración, la manifestación y el potencial de crecimiento.", detailedInterpretation: "Kan es la semilla del potencial, lista para germinar y florecer. Te recuerda tu capacidad inherente para crecer, madurar y manifestar tus sueños. Es un día para plantar intenciones y enfocarte en tu desarrollo personal y creativo.", associatedColor: "Amarillo" },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpiente - Simboliza la vitalidad, la pasión, el instinto, la fuerza vital y la transformación.", detailedInterpretation: "Chicchan es la fuerza vital pura, la energía kundalini que reside en ti. Te conecta con tus instintos, tu cuerpo y tu pasión por la vida. Es un día para la sanación, la transformación y para honrar la sabiduría de tu cuerpo.", associatedColor: "Rojo" },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Muerte/Transformador/Enlazador de Mundos - Representa la muerte, la transformación, la rendición y el desapego.", detailedInterpretation: "Cimi es el gran transformador, el que enlaza los mundos. Te enseña sobre el desapego, la rendición y la belleza de los ciclos de muerte y renacimiento. Es un día para soltar lo viejo y abrirte a nuevas oportunidades y perspectivas.", associatedColor: "Blanco" },
  { name: "Manik", icon: DefaultMayanIcon, description: "Venado/Mano - Simboliza la finalización, el logro, la sanación y las herramientas espirituales.", detailedInterpretation: "Manik es la mano que sana, la herramienta de la realización y el conocimiento. Te guía hacia la finalización de tus proyectos y te recuerda tu poder de sanar y crear. Es un día para la acción, la generosidad y la manifestación de tus dones.", associatedColor: "Azul/Negro" },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Estrella/Conejo - Representa la estrella, la armonía, la abundancia, la belleza y el arte.", detailedInterpretation: "Lamat es la estrella que brilla con armonía y belleza, atrayendo la abundancia. Te inspira a crear, a encontrar la elegancia en todas las cosas y a multiplicar tus talentos. Es un día para la creatividad, la fertilidad y la apreciación del arte.", associatedColor: "Amarillo" },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Agua/Luna - Simboliza el agua, las emociones, la purificación y el flujo de la vida.", detailedInterpretation: "Muluc es el agua primordial, la esencia de las emociones y la purificación. Te invita a fluir con la vida, a limpiar tus emociones y a recordar tu conexión con la conciencia universal. Es un día para la introspección emocional y la renovación.", associatedColor: "Rojo" },
  { name: "Oc", icon: DefaultMayanIcon, description: "Perro - Representa la lealtad, la compañía, la guía y el amor incondicional.", detailedInterpretation: "Oc es el compañero leal, el guía amoroso que te acompaña en tu camino. Te enseña sobre el amor incondicional, la fidelidad y la importancia de las relaciones verdaderas. Es un día para conectar con tus seres queridos y abrir tu corazón.", associatedColor: "Blanco" },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Mono - Simboliza la alegría, la creatividad, el arte, el juego y la magia.", detailedInterpretation: "Chuen es el artista, el mago, el tejedor de la ilusión y la alegría. Te anima a jugar, a ser creativo y a encontrar la magia en lo cotidiano. Es un día para la espontaneidad, la diversión y la expresión artística.", associatedColor: "Azul/Negro" },
  { name: "Eb", icon: DefaultMayanIcon, description: "Camino/Hierba - Representa el sendero, el viaje, el libre albedrío y la vitalidad.", detailedInterpretation: "Eb es el camino de la vida, el libre albedrío y la vitalidad que surge de la tierra. Te recuerda que tienes el poder de elegir tu sendero y te conecta con la abundancia de la naturaleza. Es un día para tomar decisiones conscientes y agradecer las bendiciones.", associatedColor: "Amarillo" },
  { name: "Ben", icon: DefaultMayanIcon, description: "Caña/Caminante del Cielo - Simboliza los pilares de luz, conectando cielo y tierra, el coraje y la exploración.", detailedInterpretation: "Ben es el caminante del cielo, el pilar que une el cielo y la tierra. Te infunde coraje para explorar nuevos horizontes y expandir tu conciencia. Es un día para el crecimiento, la aventura y la conexión con tu sabiduría interior.", associatedColor: "Rojo" },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Mago - Representa el chamanismo, la magia, la intuición y los misterios del corazón de la tierra.", detailedInterpretation: "Ix es el mago, el jaguar que ve en la oscuridad y conoce los secretos de la tierra. Te conecta con tu intuición, tu poder interior y la magia del universo. Es un día para la introspección, la integridad y la conexión con lo sagrado.", associatedColor: "Blanco" },
  { name: "Men", icon: DefaultMayanIcon, description: "Águila - Simboliza la visión, la ambición, la conciencia superior y la mente colectiva.", detailedInterpretation: "Men es el águila que vuela alto, con una visión clara y una conexión con la conciencia superior. Te inspira a perseguir tus sueños más elevados y a confiar en tu visión. Es un día para la esperanza, la ambición y la expansión mental.", associatedColor: "Azul/Negro" },
  { name: "Cib", icon: DefaultMayanIcon, description: "Buitre/Lechuza/Guerrero - Representa la sabiduría, la introspección, el conocimiento ancestral y el perdón.", detailedInterpretation: "Cib es el guerrero sabio, el que extrae conocimiento de las experiencias pasadas y ancestrales. Te enseña sobre el perdón, la confianza y la capacidad de enfrentar tus miedos. Es un día para la introspección profunda y la conexión con la sabiduría interior.", associatedColor: "Amarillo" },
  { name: "Caban", icon: DefaultMayanIcon, description: "Tierra/Terremoto - Simboliza la tierra, la sincronicidad, la navegación y la evolución.", detailedInterpretation: "Caban es la fuerza de la Tierra, la sincronicidad y la evolución constante. Te ayuda a navegar los cambios de la vida y a mantenerte centrado en tu propósito. Es un día para la alineación, la gratitud por la Madre Tierra y la adaptación.", associatedColor: "Rojo" },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Pedernal/Cuchillo/Espejo - Representa la verdad, la claridad, el discernimiento y el sacrificio.", detailedInterpretation: "Etznab es el espejo de la verdad, el cuchillo que corta la ilusión y trae claridad. Te desafía a enfrentar la verdad, a tomar decisiones con discernimiento y a soltar lo que ya no te sirve. Es un día para la honestidad radical y la auto-reflexión.", associatedColor: "Blanco" },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Tormenta/Lluvia - Simboliza la tormenta, la purificación, la transformación y la renovación.", detailedInterpretation: "Cauac es la tormenta que purifica, transforma y renueva. Te trae la energía necesaria para liberar viejos patrones y catalizar cambios profundos. Es un día para la limpieza energética, la activación y la bienvenida a la transformación.", associatedColor: "Azul/Negro" },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sol/Flor/Señor/Iluminación - Representa la iluminación, el amor incondicional, la totalidad y la conexión con lo divino.", detailedInterpretation: "Ahau es la iluminación, el Sol central, la expresión del amor incondicional y la maestría. Te conecta con tu divinidad interior y te recuerda tu capacidad de irradiar luz y amor. Es un día para la celebración, la gratitud y la unión con el Todo.", associatedColor: "Amarillo" },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];

export const GALACTIC_TONES: GalacticTone[] = [
  { id: 1, nameKey: "Magnetic", keywordKey: "Unity", questionKey: "WhatIsMyGoal", detailedInterpretation: "El Tono Magnético es el inicio, el que atrae el propósito. Unifica todas las partes de tu ser para enfocarte en una meta clara. Hoy pregúntate: ¿Cuál es mi verdadera intención? ¿Qué quiero atraer a mi vida?" },
  { id: 2, nameKey: "Lunar", keywordKey: "Challenge", questionKey: "WhatAreTheObstacles", detailedInterpretation: "El Tono Lunar revela la dualidad y los desafíos. Te ayuda a identificar los obstáculos que necesitas superar para alcanzar tu propósito. Hoy reflexiona: ¿Qué polaridades existen en mi situación? ¿Cuáles son los desafíos que me fortalecen?" },
  { id: 3, nameKey: "Electric", keywordKey: "Service", questionKey: "HowCanIBestServe", detailedInterpretation: "El Tono Eléctrico activa el servicio. Es la energía en movimiento, la chispa que enciende la acción. Te pregunta cómo puedes poner tus talentos al servicio de un propósito mayor. Hoy considera: ¿Cómo puedo activar mis recursos? ¿De qué manera mi servicio beneficia a otros?" },
  { id: 4, nameKey: "SelfExisting", keywordKey: "Form", questionKey: "WhatIsTheFormOfAction", detailedInterpretation: "El Tono Auto-Existente define la forma de la acción. Da estructura y medida a tu propósito. Te ayuda a establecer las bases y a entender cómo manifestar tus ideas. Hoy piensa: ¿Cuál es la forma más efectiva para mi acción? ¿Qué patrones y medidas necesito establecer?" },
  { id: 5, nameKey: "Overtone", keywordKey: "Radiance", questionKey: "HowCanIEmpowerMyself", detailedInterpretation: "El Tono Entonado comanda el esplendor y el poder interior. Reúne los recursos y te da la autoridad para brillar. Hoy enfócate en: ¿Cómo puedo reunir mis fuerzas y recursos? ¿De qué manera irradio mi poder personal?" },
  { id: 6, nameKey: "Rhythmic", keywordKey: "Equality", questionKey: "HowCanIOrganizeForEquality", detailedInterpretation: "El Tono Rítmico organiza para la igualdad y el equilibrio. Te ayuda a encontrar el balance en el flujo de la vida y a administrar los desafíos de manera orgánica. Hoy busca: ¿Cómo puedo equilibrar mi vida y mis acciones? ¿Cómo organizo mi entorno para la armonía?" },
  { id: 7, nameKey: "Resonant", keywordKey: "Attunement", questionKey: "HowCanIAlignMyService", detailedInterpretation: "El Tono Resonante canaliza la sintonización y la inspiración. Te conecta con la fuente de la sabiduría y te permite vibrar en armonía con el universo. Hoy sintoniza con: ¿Qué me inspira verdaderamente? ¿Cómo puedo alinear mi ser con mi propósito más elevado?" },
  { id: 8, nameKey: "Galactic", keywordKey: "Integrity", questionKey: "DoILiveWhatIBelieve", detailedInterpretation: "El Tono Galáctico modela la integridad y la armonía. Te invita a vivir de acuerdo con tus creencias y a actuar con coherencia. Hoy examina: ¿Mis acciones reflejan mis valores? ¿Estoy viviendo en integridad con mi verdad?" },
  { id: 9, nameKey: "Solar", keywordKey: "Intention", questionKey: "HowDoIAchieveMyPurpose", detailedInterpretation: "El Tono Solar pulsa la intención y la realización. Te da el impulso final para manifestar tu propósito y alcanzar tus metas. Hoy pregúntate: ¿Cómo puedo dirigir mi energía hacia la realización de mi intención? ¿Qué pasos concretos debo tomar?" },
  { id: 10, nameKey: "Planetary", keywordKey: "Manifestation", questionKey: "HowDoIPerfectWhatIDo", detailedInterpretation: "El Tono Planetario perfecciona la manifestación. Produce lo que has intencionado, haciendo tangible tu visión. Hoy enfócate en: ¿Cómo puedo mejorar y perfeccionar mi creación? ¿Qué se está manifestando a través de mí?" },
  { id: 11, nameKey: "Spectral", keywordKey: "Liberation", questionKey: "HowDoIReleaseAndLetGo", detailedInterpretation: "El Tono Espectral disuelve y libera. Te ayuda a soltar lo que ya no sirve, a desintegrar viejas estructuras y a abrir espacio para lo nuevo. Hoy considera: ¿Qué necesito liberar en mi vida? ¿Cómo puedo dejar ir las ataduras y limitaciones?" },
  { id: 12, nameKey: "Crystal", keywordKey: "Cooperation", questionKey: "HowCanIDedicateToCooperation", detailedInterpretation: "El Tono Cristal dedica a la cooperación y la universalización. Te enseña a compartir tus dones y a trabajar en conjunto por un bien mayor. Hoy reflexiona: ¿Cómo puedo colaborar con otros? ¿De qué manera mis acciones contribuyen a la comunidad?" },
  { id: 13, nameKey: "Cosmic", keywordKey: "Presence", questionKey: "HowCanIExpandMyJoyAndLove", detailedInterpretation: "El Tono Cósmico trasciende con presencia y perdurabilidad. Es el retorno al origen y la expansión de la conciencia. Te invita a vivir plenamente en el presente y a irradiar amor y alegría. Hoy experimenta: ¿Cómo puedo estar más presente? ¿Cómo expando mi alegría y mi amor sin límites?" },
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

