

export type ZodiacSignName =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface ZodiacSign {
  name: ZodiacSignName;
  icon?: React.ElementType; // For Lucide icons or custom components
  dateRange: string;
}

export interface HoroscopeData {
  sign: ZodiacSignName;
  daily: string;
  weekly: string;
  monthly: string;
}

export interface HoroscopeDetail { // This was missing but used by horoscope-flow.ts
  main: string;
  love: string;
  money: string;
  health: string;
}

export interface CompatibilityData {
  sign1: ZodiacSignName;
  sign2: ZodiacSignName;
  report: string;
  score: number; // e.g., 1-5 or 1-100
}

export interface LuckyNumbersData {
  sign: ZodiacSignName;
  numbers: number[];
  luckyColor: string;
  luckyGemstone: string;
  motivationalPhrase: string;
}

export interface LunarData {
  phase: string; // e.g., "Full Moon", "New Moon", "Waxing Crescent"
  illumination: number; // Percentage
  nextFullMoon: string;
  nextNewMoon: string;
}

export interface AscendantData {
  sign: ZodiacSignName;
  briefExplanation: string;
}

export interface UserBirthData {
  date: Date;
  time: string; // HH:mm
  city: string;
}

// --- New Types for Chinese and Mayan Horoscopes ---

// Chinese Astrology
export type ChineseAnimalSignName =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface ChineseZodiacSign {
  name: ChineseAnimalSignName;
  icon: React.ElementType;
  years: number[];
  element: string;
  description?: string;
}

export interface ChineseZodiacResult {
  animal: ChineseAnimalSignName;
  element: string;
  year: number;
  icon: React.ElementType;
}

export interface ChineseCompatibilityData {
  animal1: ChineseAnimalSignName;
  animal2: ChineseAnimalSignName;
  report: string;
  score: number; // e.g., 1-5
}


// Mayan Astrology
export type MayanSignName =
  | "Imix" | "Ik" | "Akbal" | "Kan" | "Chicchan" | "Cimi"
  | "Manik" | "Lamat" | "Muluc" | "Oc" | "Chuen" | "Eb"
  | "Ben" | "Ix" | "Men" | "Cib" | "Caban" | "Etznab" | "Cauac" | "Ahau";

export interface MayanZodiacSign {
  name: MayanSignName;
  icon: React.ElementType;
  description: string;
  detailedInterpretation: string; // Added for more detailed info
  associatedColor?: string;
}

export interface GalacticTone {
  id: number;
  nameKey: string; // For translation, e.g., "Magnetic", "Lunar"
  keywordKey: string; // For translation, e.g., "Unity", "Challenge"
  questionKey: string; // For translation, e.g., "WhatIsMyGoal", "WhatAreTheObstacles"
  detailedInterpretation: string; // Added for more detailed info
}

export interface ChineseHoroscopeData {
  sign: ChineseAnimalSignName;
  general: string;
  love?: string;
  career?: string;
  health?: string;
}

export interface MayanHoroscopeData {
  sign: MayanSignName;
  dailyEnergy: string;
  advice?: string;
}

export interface MayanKinInfo {
  daySign: MayanZodiacSign;
  tone: GalacticTone;
  kinNumber: number;
}

// Type for Tarot Personality Test
export interface TarotPersonalityAnswer {
  question: string; // The question text (can be a key for dictionary)
  answer: string;   // User's free-form answer
}

export interface TarotPersonalityInputType {
  answers: TarotPersonalityAnswer[];
  locale: string;
}

export interface TarotPersonalityOutputType {
  cardName: string;
  cardDescription: string; // Why this card fits them
  cardImagePlaceholderUrl: string;
}

// User type for Firebase Authentication
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  // You can add more fields here if you retrieve them from Firestore
}
