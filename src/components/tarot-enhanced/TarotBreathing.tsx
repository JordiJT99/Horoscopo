/**
 * @fileOverview Componente de Respiración Consciente
 * Micro-interacción de respiración 3-2-1 antes de voltear las cartas
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Waves, Heart, Eye } from 'lucide-react';
import type { Dictionary } from '@/types';

interface TarotBreathingProps {
  dictionary: Dictionary;
  onBreathingComplete: () => void;
  className?: string;
}

export default function TarotBreathing({ 
  dictionary, 
  onBreathingComplete,
  className 
}: TarotBreathingProps) {
  const [phase, setPhase] = useState<'preparation' | 'breathing' | 'complete'>('preparation');
  const [breathCount, setBreathCount] = useState(3);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    if (!isBreathing) return;

    const breathingCycle = () => {
      // Inhalar (4 segundos)
      setBreathPhase('inhale');
      
      setTimeout(() => {
        setBreathPhase('hold');
        
        setTimeout(() => {
          setBreathPhase('exhale');
          
          setTimeout(() => {
            setBreathPhase('pause');
            
            setTimeout(() => {
              setBreathCount(prev => {
                const newCount = prev - 1;
                if (newCount <= 0) {
                  setIsBreathing(false);
                  setPhase('complete');
                  return 0;
                }
                return newCount;
              });
            }, 1000); // Pausa de 1 segundo
          }, 4000); // Exhalar 4 segundos
        }, 2000); // Mantener 2 segundos
      }, 4000); // Inhalar 4 segundos
    };

    const interval = setInterval(breathingCycle, 11000); // Ciclo completo de 11 segundos
    breathingCycle(); // Empezar inmediatamente

    return () => clearInterval(interval);
  }, [isBreathing]);

  const startBreathing = () => {
    setPhase('breathing');
    setIsBreathing(true);
    setBreathCount(3);
  };

  const skipBreathing = () => {
    setPhase('complete');
    onBreathingComplete();
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return dictionary['TarotEnhanced.breathInhale'] || 'Inhala profundamente...';
      case 'hold':
        return dictionary['TarotEnhanced.breathHold'] || 'Mantén...';
      case 'exhale':
        return dictionary['TarotEnhanced.breathExhale'] || 'Exhala lentamente...';
      case 'pause':
        return dictionary['TarotEnhanced.breathPause'] || 'Pausa...';
      default:
        return '';
    }
  };

  const getBreathingScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 1.3;
      case 'hold':
        return 1.3;
      case 'exhale':
        return 0.8;
      case 'pause':
        return 1;
      default:
        return 1;
    }
  };

  const getBreathingDuration = () => {
    switch (breathPhase) {
      case 'inhale':
        return 4;
      case 'hold':
        return 2;
      case 'exhale':
        return 4;
      case 'pause':
        return 1;
      default:
        return 1;
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
          {dictionary['TarotEnhanced.breathingTitle'] || 'Centrado Energético'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {dictionary['TarotEnhanced.breathingSubtitle'] || 'Conecta con tu intuición antes de revelar las cartas'}
        </p>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {phase === 'preparation' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Waves className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary['TarotEnhanced.breathingPrep'] || 'Preparación Mental'}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2 text-left">
                    <p>• {dictionary['TarotEnhanced.breathingStep1'] || 'Siéntate cómodamente y relaja los hombros'}</p>
                    <p>• {dictionary['TarotEnhanced.breathingStep2'] || 'Enfoca tu mente en la pregunta que formulaste'}</p>
                    <p>• {dictionary['TarotEnhanced.breathingStep3'] || 'Confía en que las cartas revelarán lo que necesitas saber'}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {dictionary['TarotEnhanced.breathingBenefit'] || 'La respiración consciente amplifica tu conexión intuitiva'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button onClick={skipBreathing} variant="outline">
                  {dictionary['TarotEnhanced.skipBreathing'] || 'Omitir'}
                </Button>
                <Button onClick={startBreathing} size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  {dictionary['TarotEnhanced.beginBreathing'] || 'Comenzar Respiración'}
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8"
            >
              {/* Círculo de respiración */}
              <div className="relative flex items-center justify-center h-80">
                <motion.div
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-20"
                  animate={{
                    scale: getBreathingScale(),
                  }}
                  transition={{
                    duration: getBreathingDuration(),
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 opacity-40"
                  animate={{
                    scale: getBreathingScale(),
                  }}
                  transition={{
                    duration: getBreathingDuration(),
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-700 to-pink-700"
                  animate={{
                    scale: getBreathingScale(),
                  }}
                  transition={{
                    duration: getBreathingDuration(),
                    ease: "easeInOut"
                  }}
                />
                
                {/* Contador en el centro */}
                <motion.div
                  className="absolute text-4xl font-bold text-primary"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {breathCount}
                </motion.div>
              </div>

              {/* Instrucciones de respiración */}
              <div className="space-y-4">
                <motion.h3
                  key={breathPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-semibold text-primary"
                >
                  {getBreathInstruction()}
                </motion.h3>
                
                <p className="text-muted-foreground">
                  {dictionary['TarotEnhanced.breathingRemaining'] || `Respiraciones restantes: ${breathCount}`}
                </p>

                {/* Barra de progreso del ciclo */}
                <div className="max-w-xs mx-auto">
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: breathPhase === 'inhale' ? '25%' :
                               breathPhase === 'hold' ? '50%' :
                               breathPhase === 'exhale' ? '75%' : '100%'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dictionary['TarotEnhanced.breathingCycle'] || 'Ciclo de respiración'}
                  </p>
                </div>
              </div>

              {/* Opción para saltar */}
              <Button 
                onClick={skipBreathing} 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {dictionary['TarotEnhanced.skipBreathing'] || 'Omitir respiración'}
              </Button>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.2 
                }}
                className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center"
              >
                <Eye className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-primary">
                  {dictionary['TarotEnhanced.breathingComplete'] || 'Mente Centrada'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {dictionary['TarotEnhanced.breathingCompleteDesc'] || 'Tu intuición está activa y receptiva. Es momento de revelar lo que las cartas tienen que decirte.'}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={onBreathingComplete} size="lg" className="px-8">
                  {dictionary['TarotEnhanced.revealCards'] || 'Revelar las Cartas'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
