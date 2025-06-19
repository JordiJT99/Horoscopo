

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

export type AstrologicalElement = "Fire" | "Earth" | "Air" | "Water";
export type AstrologicalPolarity = "Masculine" | "Feminine";
export type AstrologicalModality = "Cardinal" | "Fixed" | "Mutable";

export interface ZodiacSign {
  name: ZodiacSignName;
  icon?: React.ElementType; // For Lucide icons or custom components
  customIconPath?: string; // Path for custom image icons
  dateRange: string;
  element: AstrologicalElement;
  polarity: AstrologicalPolarity;
  modality: AstrologicalModality;
}

export interface HoroscopeData {
  sign: ZodiacSignName;
  daily: string;
  weekly: string;
  monthly: string;
}

export interface HoroscopeDetail {
  main: string;
  love: string;
  money: string;
  health: string;
}

// Interface for onboarding data that might be passed to the horoscope flow
// Make fields optional as not all might be available or relevant for every call
export interface HoroscopePersonalizationData {
  name?: string;
  gender?: Gender;
  relationshipStatus?: RelationshipStatus;
  employmentStatus?: EmploymentStatus;
}


export interface HoroscopeFlowInput {
  sign: ZodiacSignName;
  locale: string;
  targetDate?: string; // YYYY-MM-DD format, optional
  onboardingData?: HoroscopePersonalizationData; // Re-added for personalized horoscopes
}

export interface HoroscopeFlowOutput {
  daily: HoroscopeDetail;
  weekly: HoroscopeDetail;
  monthly: HoroscopeDetail;
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

export type MoonPhaseKey = 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous' | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent' | 'unknown';


export interface UpcomingPhase {
  nameKey: string; // e.g., "MoonPhase.FirstQuarter" for translation
  date: string;    // e.g., "Jun 2"
  iconUrl: string;
  phaseKey: MoonPhaseKey;
}
export interface LunarData {
  phase: string; // e.g., "Full Moon", "New Moon", "Waxing Crescent" (translated)
  phaseKey: MoonPhaseKey; // Key for the main current phase
  illumination: number; // Percentage
  currentMoonImage: string; // URL for the large moon image
  moonInSign?: string; // e.g., "Acuario" (translated) - No longer optional
  moonSignIcon?: ZodiacSignName; // e.g., "Aquarius" - No longer optional
  upcomingPhases: UpcomingPhase[];
  error?: string; // Optional error message for API failures
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
  photoURL?: string | null; // Added photoURL for profile images
}

// Onboarding Flow Types
export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say" | "other" | "";
export type RelationshipStatus = "single" | "in-relationship" | "engaged" | "married" | "divorced" | "widowed" | "complicated" | "";
export type EmploymentStatus = "employed-full-time" | "employed-part-time" | "self-employed" | "unemployed" | "student" | "retired" | "homemaker" | "";

export interface OnboardingFormData {
  name: string;
  gender: Gender;
  dateOfBirth: Date | undefined; // Stored as Date object after parsing
  timeOfBirth?: string; // HH:mm, optional
  cityOfBirth?: string; // optional
  relationshipStatus: RelationshipStatus;
  employmentStatus: EmploymentStatus;
  personalizedAdsConsent: boolean;
}

// Profile selector type
export type SelectedProfileType = 'user' | 'generic';
