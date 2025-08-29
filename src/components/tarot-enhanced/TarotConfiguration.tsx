/**
 * @fileOverview Componente de Configuración de Tarot Mejorado
 * Fase 1: Intención & Contexto (10-15s)
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Briefcase, Sparkles, Globe, Clock, Smile, Frown, Meh, Sun, Moon } from 'lucide-react';
import type { Dictionary } from '@/types';
import type { TarotConfiguration, TarotFocus, TarotTimeframe, TarotMood, TarotMode, TarotSpreadType } from '@/types/tarot-enhanced';

interface TarotConfigurationProps {
  dictionary: Dictionary;
  onConfigurationComplete: (config: TarotConfiguration) => void;
  className?: string;
}

const focusIcons = {
  love: Heart,
  work_money: Briefcase,
  wellness: Sparkles,
  general: Globe
};

const timeframeIcons = {
  today: Sun,
  this_week: Clock,
  this_month: Moon
};

const moodIcons = {
  anxious: Frown,
  hopeful: Sun,
  confused: Meh,
  excited: Sparkles,
  peaceful: Moon
};

export default function TarotConfiguration({ 
  dictionary, 
  onConfigurationComplete,
  className 
}: TarotConfigurationProps) {
  const [focus, setFocus] = useState<TarotFocus>('general');
  const [timeframe, setTimeframe] = useState<TarotTimeframe>('today');
  const [mood, setMood] = useState<TarotMood | undefined>(undefined);
  const [mode, setMode] = useState<TarotMode>('standard');
  const [spreadType, setSpreadType] = useState<TarotSpreadType>('custom');
  const [showMoodStep, setShowMoodStep] = useState(false);
  const [currentStep, setCurrentStep] = useState<'focus' | 'timeframe' | 'mood' | 'mode' | 'spread'>('focus');

  const handleContinue = () => {
    switch (currentStep) {
      case 'focus':
        setCurrentStep('timeframe');
        break;
      case 'timeframe':
        setShowMoodStep(true);
        setCurrentStep('mood');
        break;
      case 'mood':
        setCurrentStep('mode');
        break;
      case 'mode':
        setCurrentStep('spread');
        break;
      case 'spread':
        onConfigurationComplete({
          focus,
          timeframe,
          mood,
          mode,
          spreadType
        });
        break;
    }
  };

  const skipMood = () => {
    setMood(undefined);
    setCurrentStep('mode');
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'focus':
        return focus !== null;
      case 'timeframe':
        return timeframe !== null;
      case 'mood':
        return true; // Mood es opcional
      case 'mode':
        return mode !== null;
      case 'spread':
        return spreadType !== null;
      default:
        return false;
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto p-6 space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-primary">
          {dictionary['TarotEnhanced.intentionTitle'] || 'Establece tu Intención'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {dictionary['TarotEnhanced.intentionSubtitle'] || 'Las cartas responden mejor cuando conocen tu propósito'}
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Progreso visual */}
        <div className="flex justify-center space-x-2">
          {['focus', 'timeframe', 'mood', 'mode', 'spread'].map((step, index) => (
            <div
              key={step}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index <= ['focus', 'timeframe', 'mood', 'mode', 'spread'].indexOf(currentStep)
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'focus' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {dictionary['TarotEnhanced.selectFocus'] || '¿En qué área de tu vida buscas claridad?'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(focusIcons) as TarotFocus[]).map((focusOption) => {
                  const Icon = focusIcons[focusOption];
                  return (
                    <Card
                      key={focusOption}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        focus === focusOption 
                          ? "ring-2 ring-primary bg-primary/10" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setFocus(focusOption)}
                    >
                      <CardContent className="p-6 text-center space-y-2">
                        <Icon className="w-8 h-8 mx-auto text-primary" />
                        <p className="font-medium">
                          {dictionary[`TarotEnhanced.focus.${focusOption}`] || focusOption}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 'timeframe' && (
            <motion.div
              key="timeframe"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {dictionary['TarotEnhanced.selectTimeframe'] || '¿Cuál es tu horizonte temporal?'}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(timeframeIcons) as TarotTimeframe[]).map((timeframeOption) => {
                  const Icon = timeframeIcons[timeframeOption];
                  return (
                    <Card
                      key={timeframeOption}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        timeframe === timeframeOption 
                          ? "ring-2 ring-primary bg-primary/10" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setTimeframe(timeframeOption)}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <Icon className="w-6 h-6 mx-auto text-primary" />
                        <p className="text-sm font-medium">
                          {dictionary[`TarotEnhanced.timeframe.${timeframeOption}`] || timeframeOption}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 'mood' && showMoodStep && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {dictionary['TarotEnhanced.selectMood'] || '¿Cómo te sientes hoy?'}
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                {dictionary['TarotEnhanced.moodOptional'] || 'Esto ayuda a ajustar el tono de la lectura (opcional)'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(moodIcons) as TarotMood[]).map((moodOption) => {
                  const Icon = moodIcons[moodOption];
                  return (
                    <Card
                      key={moodOption}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        mood === moodOption 
                          ? "ring-2 ring-primary bg-primary/10" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setMood(moodOption)}
                    >
                      <CardContent className="p-3 text-center space-y-1">
                        <Icon className="w-5 h-5 mx-auto text-primary" />
                        <p className="text-sm">
                          {dictionary[`TarotEnhanced.mood.${moodOption}`] || moodOption}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="text-center">
                <Button variant="ghost" onClick={skipMood} className="text-sm">
                  {dictionary['TarotEnhanced.skipMood'] || 'Omitir este paso'}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {dictionary['TarotEnhanced.selectMode'] || 'Elige el tipo de lectura'}
              </h2>
              <div className="space-y-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    mode === 'quick' 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('quick')}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {dictionary['TarotEnhanced.mode.quick'] || 'Rápida (1-2 cartas)'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dictionary['TarotEnhanced.mode.quickDesc'] || 'Respuesta directa e inmediata'}
                        </p>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {dictionary['TarotEnhanced.free'] || 'Gratis'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    mode === 'standard' 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('standard')}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {dictionary['TarotEnhanced.mode.standard'] || 'Estándar (3-5 cartas)'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dictionary['TarotEnhanced.mode.standardDesc'] || 'Lectura balanceada y completa'}
                        </p>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {dictionary['TarotEnhanced.free'] || 'Gratis'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    mode === 'advanced' 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('advanced')}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {dictionary['TarotEnhanced.mode.advanced'] || 'Avanzada (5+ cartas)'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dictionary['TarotEnhanced.mode.advancedDesc'] || 'Análisis profundo y detallado'}
                        </p>
                      </div>
                      <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        {dictionary['TarotEnhanced.premium'] || '👑 Premium'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {currentStep === 'spread' && (
            <motion.div
              key="spread"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {dictionary['TarotEnhanced.selectSpread'] || 'Elige el tipo de tirada'}
              </h2>
              <div className="space-y-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    spreadType === 'custom' 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSpreadType('custom')}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">
                      {dictionary['TarotEnhanced.spread.custom'] || 'Tirada Personalizada'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dictionary['TarotEnhanced.spread.customDesc'] || 'Adaptada a tu intención específica'}
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    spreadType === 'past_present_future' 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSpreadType('past_present_future')}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">
                      {dictionary['TarotEnhanced.spread.pastPresentFuture'] || 'Pasado/Presente/Futuro'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dictionary['TarotEnhanced.spread.pastPresentFutureDesc'] || 'Perspectiva temporal completa con TL;DR'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            size="lg"
            className="px-8"
          >
            {currentStep === 'spread' 
              ? (dictionary['TarotEnhanced.beginReading'] || 'Comenzar Lectura') 
              : (dictionary['TarotEnhanced.continue'] || 'Continuar')
            }
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
