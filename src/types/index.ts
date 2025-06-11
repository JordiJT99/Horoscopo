
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
  icon: React.ElementType; // Changed to non-optional as we'll provide a placeholder
  years: number[];
  element: string; 
  description?: string; // Added for more detail
}

// Mayan Astrology
export type MayanSignName =
  | "Imix" | "Ik" | "Akbal" | "Kan" | "Chicchan" | "Cimi"
  | "Manik" | "Lamat" | "Muluc" | "Oc" | "Chuen" | "Eb"
  | "Ben" | "Ix" | "Men" | "Cib" | "Caban" | "Etznab" | "Cauac" | "Ahau";

export interface MayanZodiacSign {
  name: MayanSignName;
  icon: React.ElementType; // Changed to non-optional
  description: string;
  associatedColor?: string;
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
