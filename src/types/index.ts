
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
