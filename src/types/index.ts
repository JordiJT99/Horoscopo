

import type { DreamInterpretationOutput } from '@/ai/flows/dream-interpretation-flow';
import type { TarotReadingOutput } from '@/ai/flows/tarot-reading-flow';
import type { TarotPersonalityOutput } from '@/ai/flows/tarot-personality-flow';


export type Locale = 'en' | 'es' | 'de' | 'fr';

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
  icon?: React.ElementType; 
  customIconPath?: string; 
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
  health: string;
}

export interface HoroscopePersonalizationData {
  name?: string;
  gender?: Gender;
  relationshipStatus?: RelationshipStatus;
  employmentStatus?: EmploymentStatus;
}


export interface HoroscopeFlowInput {
  sign: ZodiacSignName;
  locale: string;
  targetDate?: string; 
  onboardingData?: HoroscopePersonalizationData;
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
  score: number;
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
  nameKey: string;
  date: string;
  phaseKey: MoonPhaseKey;
  dateObj: Date;
  time?: string;
  illumination?: number;
}

export interface LunarData {
  phase: string;
  phaseKey: MoonPhaseKey;
  illumination: number;
  currentMoonImage: string;
  moonInSign?: string;
  moonSignIcon?: ZodiacSignName;
  upcomingPhases: UpcomingPhase[];
  error?: string;
  synodicProgress?: number;
  description?: string;
  insights?: string[];
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

export type ChineseAnimalSignName =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface ChineseZodiacSign {
  name: ChineseAnimalSignName;
  icon: React.ElementType | null;
  years: number[];
  element: string;
  description?: string;
  descriptionKey?: string;
  detailedInterpretationKey?: string;
}

export interface ChineseZodiacResult {
  animal: ChineseAnimalSignName;
  element: string;
  year: number;
  icon: React.ElementType | null;
}

export interface ChineseCompatibilityData {
  animal1: ChineseAnimalSignName;
  animal2: ChineseAnimalSignName;
  report: string;
  score: number;
}


export type MayanSignName =
  | "Imix" | "Ik" | "Akbal" | "Kan" | "Chicchan" | "Cimi"
  | "Manik" | "Lamat" | "Muluc" | "Oc" | "Chuen" | "Eb"
  | "Ben" | "Ix" | "Men" | "Cib" | "Caban" | "Etznab" | "Cauac" | "Ahau";

export interface MayanZodiacSign {
  name: MayanSignName;
  icon: React.ElementType;
  nameKey: string;
  descriptionKey: string;
  detailedInterpretationKey: string;
  associatedColor?: string;
}

export interface GalacticTone {
  id: number;
  nameKey: string;
  keywordKey: string;
  questionKey: string;
  detailedInterpretationKey: string;
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


export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say" | "other" | "";
export type RelationshipStatus = "single" | "in-relationship" | "engaged" | "married" | "divorced" | "widowed" | "complicated" | "";
export type EmploymentStatus = "employed-full-time" | "employed-part-time" | "self-employed" | "unemployed" | "student" | "retired" | "homemaker" | "";

export interface OnboardingFormData {
  name: string;
  gender: Gender;
  dateOfBirth: Date | undefined;
  timeOfBirth?: string;
  cityOfBirth?: string;
  relationshipStatus: RelationshipStatus;
  employmentStatus: EmploymentStatus;
  personalizedAdsConsent: boolean;
}

export type SelectedProfileType = 'user' | 'generic';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AspectDetail {
  body1: string;
  body2: string;
  type: string;
  degree: number;
  explanation: string;
}

export interface HousePlacementDetail {
  placement: string;
  explanation: string;
}

export interface StoredDream {
  id: string;
  timestamp: string;
  interpretation: DreamInterpretationOutput;
  vividness: number;
}

export type { TarotReadingOutput, TarotPersonalityOutput };

export interface NatalChartOutput {
  sun: string;
  moon: string;
  ascendant: string;
  personalPlanets: string;
  transpersonalPlanets: string;
  housesIntroduction: string;
  housesDetails: HousePlacementDetail[];
  aspects: string;
  planetPositions: Record<string, { sign: string; degree: number }>;
  aspectsDetails: AspectDetail[];
}

export interface Psychic {
  id: string;
  name: string;
  image: string;
  specialty: string; 
  phrase: string;
  rating: number;
  reviews: number;
  experience: number; 
  status: "Available" | "Busy" | "Meditating";
  aiHint: string;
}

export type PostType = 'text' | 'dream' | 'tarot_reading' | 'tarot_personality';

export interface NewPostData {
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorZodiacSign: ZodiacSignName;
  authorLevel?: number;
  postType: PostType;
  textContent?: string;
  dreamData?: DreamInterpretationOutput;
  tarotReadingData?: TarotReadingOutput;
  tarotPersonalityData?: TarotPersonalityOutput;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: string;
}

export interface CommunityPost extends NewPostData {
  id: string;
  timestamp: string;
  reactions: Record<string, string>;
  commentCount: number;
}

export type GameActionId = 
  | 'read_daily_horoscope'
  | 'read_weekly_horoscope'
  | 'read_monthly_horoscope'
  | 'complete_profile'
  | 'draw_tarot_card'
  | 'draw_personality_card'
  | 'use_crystal_ball'
  | 'use_dream_reading'
  | 'add_community_comment'
  | 'react_to_post'
  | 'daily_stardust';

export interface CosmicEnergyState {
  points: number;
  level: number;
  stardust: number;
  freeChats: number;
  lastGained: Record<GameActionId, string>;
  hasRatedApp: boolean;
  bio?: string; // Adding bio to the state to be stored in Firestore
}

export interface DailyTransit {
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
}

export interface UserAstrologyProfile {
  sun: ZodiacSign | null;
  moon: ZodiacSign | null;
  ascendant: ZodiacSign | null;
}

export interface AwardStardustResult {
    success: boolean;
    amount: number;
}
