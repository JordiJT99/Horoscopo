/**
 * @fileOverview Enhanced Tarot System Types and Interfaces
 * Nuevo sistema de tarot remodelado con características avanzadas
 */

export type TarotFocus = 'love' | 'work_money' | 'wellness' | 'general';
export type TarotTimeframe = 'today' | 'this_week' | 'this_month';
export type TarotMood = 'anxious' | 'hopeful' | 'confused' | 'excited' | 'peaceful';
export type TarotMode = 'quick' | 'standard' | 'advanced';
export type TarotSpreadType = 'custom' | 'past_present_future';

export interface TarotConfiguration {
  focus: TarotFocus;
  timeframe: TarotTimeframe;
  mood?: TarotMood;
  mode: TarotMode;
  spreadType: TarotSpreadType;
}

export interface TarotCard {
  name: string;
  isReversed: boolean;
  position?: string; // Para spreads específicos como "pasado", "presente", "futuro"
  hint?: string; // Breve pista antes del texto largo
  imagePath: string;
}

export interface ShuffleSeed {
  cut1: number;
  cut2: number;
  cut3: number;
  timestamp: number;
}

export interface TarotReadingStep {
  stepNumber: number;
  title: string;
  description?: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface TarotReadingProgress {
  currentStep: number;
  totalSteps: number;
  steps: TarotReadingStep[];
}

export interface EnhancedTarotCard extends TarotCard {
  shortMeaning: string; // TL;DR para cada carta
  detailedReading: string; // Lectura completa
  energy: 'positive' | 'neutral' | 'challenging';
  keywords: string[];
}

export interface TarotSpreadReading {
  id: string;
  configuration: TarotConfiguration;
  cards: EnhancedTarotCard[];
  shuffleSeed: ShuffleSeed;
  overallMessage: string;
  tldr: string; // Resumen ejecutivo de toda la lectura
  createdAt: Date;
  userId?: string;
}

// Input para el flow de AI
export interface EnhancedTarotInput {
  configuration: TarotConfiguration;
  cards: TarotCard[];
  shuffleSeed: ShuffleSeed;
  userName?: string;
  locale: string;
}

// Output del flow de AI
export interface EnhancedTarotOutput {
  reading: TarotSpreadReading | PastPresentFutureReading;
  success: boolean;
  error?: string;
}

// Estados de la interfaz
export interface TarotUIState {
  currentPhase: 'configuration' | 'shuffling' | 'selection' | 'breathing' | 'revealing' | 'reading';
  progress: TarotReadingProgress;
  isLoading: boolean;
  error?: string;
}

// Cartas especializadas para Pasado/Presente/Futuro
export interface PastPresentFutureCard extends TarotCard {
  position: 'past' | 'present' | 'future';
  interpretation: string;
  positionMeaning: string;
}

// Lectura estándar simplificada
export interface TarotReading {
  id: string;
  cards: TarotCard[];
  configuration: TarotConfiguration;
  timestamp: string;
  interpretations: string[];
}

// Lectura Pasado/Presente/Futuro simplificada
export interface PastPresentFutureReading {
  id: string;
  cards: PastPresentFutureCard[];
  configuration: TarotConfiguration;
  timestamp: string;
  synthesis: string;
  insights: {
    past: string;
    present: string;
    future: string;
  };
}

// Configuraciones predefinidas
export const TAROT_CONFIGURATIONS = {
  quick_love_today: {
    focus: 'love' as TarotFocus,
    timeframe: 'today' as TarotTimeframe,
    mode: 'quick' as TarotMode,
    spreadType: 'custom' as TarotSpreadType
  },
  standard_general_week: {
    focus: 'general' as TarotFocus,
    timeframe: 'this_week' as TarotTimeframe,
    mode: 'standard' as TarotMode,
    spreadType: 'past_present_future' as TarotSpreadType
  },
  advanced_work_month: {
    focus: 'work_money' as TarotFocus,
    timeframe: 'this_month' as TarotTimeframe,
    mode: 'advanced' as TarotMode,
    spreadType: 'custom' as TarotSpreadType
  }
} as const;

// Cantidad de cartas por modo
export const CARDS_BY_MODE: Record<TarotMode, number> = {
  quick: 2,
  standard: 4,
  advanced: 7
};

// Pasos del proceso según el tipo de spread
export const READING_STEPS = {
  custom: [
    { stepNumber: 1, title: 'Intención & Contexto', isComplete: false, isActive: false },
    { stepNumber: 2, title: 'Configuración', isComplete: false, isActive: false },
    { stepNumber: 3, title: 'Barajado Táctil', isComplete: false, isActive: false },
    { stepNumber: 4, title: 'Respiración Consciente', isComplete: false, isActive: false },
    { stepNumber: 5, title: 'Selección de Cartas', isComplete: false, isActive: false },
    { stepNumber: 6, title: 'Revelado Progresivo', isComplete: false, isActive: false },
    { stepNumber: 7, title: 'Lectura Completa', isComplete: false, isActive: false }
  ],
  past_present_future: [
    { stepNumber: 1, title: 'Intención & Contexto', isComplete: false, isActive: false },
    { stepNumber: 2, title: 'Configuración Temporal', isComplete: false, isActive: false },
    { stepNumber: 3, title: 'Barajado Ritual', isComplete: false, isActive: false },
    { stepNumber: 4, title: 'Centrado Temporal', isComplete: false, isActive: false },
    { stepNumber: 5, title: 'Revelado: Pasado', isComplete: false, isActive: false },
    { stepNumber: 6, title: 'Revelado: Presente', isComplete: false, isActive: false },
    { stepNumber: 7, title: 'Revelado: Futuro', isComplete: false, isActive: false },
    { stepNumber: 8, title: 'Síntesis Temporal', isComplete: false, isActive: false }
  ]
};
