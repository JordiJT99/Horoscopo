/**
 * @fileOverview Componente Principal del Sistema de Tarot Mejorado
 * Orquesta toda la experiencia: configuración → barajado → respiración → selección → lectura
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Shuffle, 
  Heart, 
  Eye, 
  Sparkles, 
  Star,
  ArrowLeft,
  RotateCcw,
  Clock,
  Calendar,
  TrendingUp
} from 'lucide-react';
import type { Dictionary } from '@/types';
import type { 
  TarotConfiguration, 
  ShuffleSeed,
  TarotReading,
  PastPresentFutureReading,
  ReadingStep
} from '@/types/tarot-enhanced';

// Componentes del sistema
import TarotConfiguration from './TarotConfiguration';
import TarotShuffling from './TarotShuffling';
import TarotBreathing from './TarotBreathing';
import TarotCardSelection from './TarotCardSelection';
import TarotPastPresentFuture from './TarotPastPresentFuture';

interface TarotEnhancedSystemProps {
  dictionary: Dictionary;
  onComplete?: (reading: TarotReading | PastPresentFutureReading) => void;
  onClose?: () => void;
  className?: string;
}

export default function TarotEnhancedSystem({ 
  dictionary, 
  onComplete,
  onClose,
  className 
}: TarotEnhancedSystemProps) {
  const [currentStep, setCurrentStep] = useState<ReadingStep>('configuration');
  const [configuration, setConfiguration] = useState<TarotConfiguration | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState<ShuffleSeed | null>(null);
  const [readingHistory, setReadingHistory] = useState<(TarotReading | PastPresentFutureReading)[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const steps: { key: ReadingStep; title: string; icon: any; completed: boolean }[] = [
    {
      key: 'configuration',
      title: dictionary['TarotEnhanced.stepConfiguration'] || 'Configuración',
      icon: Settings,
      completed: !!configuration
    },
    {
      key: 'shuffling',
      title: dictionary['TarotEnhanced.stepShuffling'] || 'Barajado',
      icon: Shuffle,
      completed: !!shuffleSeed
    },
    {
      key: 'breathing',
      title: dictionary['TarotEnhanced.stepBreathing'] || 'Centrado',
      icon: Heart,
      completed: currentStep !== 'configuration' && currentStep !== 'shuffling' && currentStep !== 'breathing'
    },
    {
      key: 'selection',
      title: dictionary['TarotEnhanced.stepSelection'] || 'Selección',
      icon: Eye,
      completed: currentStep === 'interpretation' || currentStep === 'past_present_future'
    },
    {
      key: 'interpretation',
      title: dictionary['TarotEnhanced.stepInterpretation'] || 'Lectura',
      icon: Sparkles,
      completed: readingHistory.length > 0
    }
  ];

  const handleConfigurationComplete = (config: TarotConfiguration) => {
    setConfiguration(config);
    setCurrentStep('shuffling');
  };

  const handleShufflingComplete = (seed: ShuffleSeed) => {
    setShuffleSeed(seed);
    setCurrentStep('breathing');
  };

  const handleBreathingComplete = () => {
    if (configuration?.spreadType === 'past_present_future') {
      setCurrentStep('past_present_future');
    } else {
      setCurrentStep('selection');
    }
  };

  const handleSelectionComplete = (reading: TarotReading) => {
    setReadingHistory(prev => [...prev, reading]);
    setCurrentStep('interpretation');
    if (onComplete) {
      onComplete(reading);
    }
  };

  const handlePastPresentFutureComplete = (reading: PastPresentFutureReading) => {
    setReadingHistory(prev => [...prev, reading]);
    setCurrentStep('interpretation');
    if (onComplete) {
      onComplete(reading);
    }
  };

  const resetReading = () => {
    setCurrentStep('configuration');
    setConfiguration(null);
    setShuffleSeed(null);
  };

  const backToSelection = () => {
    if (configuration?.spreadType === 'past_present_future') {
      setCurrentStep('past_present_future');
    } else {
      setCurrentStep('selection');
    }
  };

  const getCurrentStepInfo = () => {
    return steps.find(s => s.key === currentStep);
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20", className)}>
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header con progreso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Título principal */}
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: currentStep === 'shuffling' ? 360 : 0 }}
                transition={{ duration: 2, repeat: currentStep === 'shuffling' ? Infinity : 0 }}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
              >
                <Star className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                  {dictionary['TarotEnhanced.systemTitle'] || 'Tarot Mejorado'}
                </h1>
                <p className="text-muted-foreground">
                  {getCurrentStepInfo()?.title || 'Experiencia completa de lectura'}
                </p>
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-2">
              {readingHistory.length > 0 && (
                <Button 
                  onClick={() => setShowHistory(!showHistory)} 
                  variant="outline" 
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {dictionary['TarotEnhanced.history'] || 'Historial'} ({readingHistory.length})
                </Button>
              )}
              
              {currentStep !== 'configuration' && (
                <Button onClick={resetReading} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {dictionary['TarotEnhanced.restart'] || 'Reiniciar'}
                </Button>
              )}

              {onClose && (
                <Button onClick={onClose} variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {dictionary['TarotEnhanced.exit'] || 'Salir'}
                </Button>
              )}
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.key;
                const isCompleted = step.completed;
                const isPast = steps.findIndex(s => s.key === currentStep) > index;
                
                return (
                  <div key={step.key} className="flex items-center flex-shrink-0">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted || isPast ? '#3B82F6' : isActive ? '#3B82F6' : '#E5E7EB'
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "transition-colors duration-300"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5",
                        isCompleted || isPast || isActive ? "text-white" : "text-gray-400"
                      )} />
                    </motion.div>
                    
                    <div className="ml-3 min-w-0">
                      <div className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary" : isCompleted || isPast ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </div>
                      {isActive && (
                        <div className="text-xs text-muted-foreground">
                          {dictionary['TarotEnhanced.currentStep'] || 'Paso actual'}
                        </div>
                      )}
                    </div>

                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-4 transition-colors duration-300",
                        isCompleted || isPast ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Historial de lecturas */}
        <AnimatePresence>
          {showHistory && readingHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {dictionary['TarotEnhanced.readingHistory'] || 'Historial de Lecturas'}
                  </h3>
                  <div className="space-y-3">
                    {readingHistory.slice(-3).reverse().map((reading, index) => (
                      <div key={reading.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {'synthesis' in reading ? (
                            <div className="flex space-x-1">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                          ) : (
                            <Sparkles className="w-4 h-4 text-primary" />
                          )}
                          <div>
                            <div className="text-sm font-medium">
                              {'synthesis' in reading 
                                ? (dictionary['TarotEnhanced.pastPresentFutureReading'] || 'Pasado/Presente/Futuro')
                                : (dictionary['TarotEnhanced.standardReading'] || 'Lectura Estándar')
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(reading.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {reading.cards.length} {dictionary['TarotEnhanced.cards'] || 'cartas'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido principal */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[600px]"
        >
          <AnimatePresence mode="wait">
            {currentStep === 'configuration' && (
              <TarotConfiguration
                key="configuration"
                dictionary={dictionary}
                onConfigurationComplete={handleConfigurationComplete}
              />
            )}

            {currentStep === 'shuffling' && configuration && (
              <TarotShuffling
                key="shuffling"
                dictionary={dictionary}
                configuration={configuration}
                onShufflingComplete={handleShufflingComplete}
              />
            )}

            {currentStep === 'breathing' && (
              <TarotBreathing
                key="breathing"
                dictionary={dictionary}
                onBreathingComplete={handleBreathingComplete}
              />
            )}

            {currentStep === 'selection' && configuration && (
              <TarotCardSelection
                key="selection"
                dictionary={dictionary}
                configuration={configuration}
                onReadingComplete={handleSelectionComplete}
              />
            )}

            {currentStep === 'past_present_future' && configuration && (
              <TarotPastPresentFuture
                key="past_present_future"
                dictionary={dictionary}
                configuration={configuration}
                onReadingComplete={handlePastPresentFutureComplete}
                onBackToStandard={backToSelection}
              />
            )}

            {currentStep === 'interpretation' && readingHistory.length > 0 && (
              <motion.div
                key="interpretation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 10,
                      delay: 0.2 
                    }}
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                  >
                    <Star className="w-12 h-12 text-white" />
                  </motion.div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-primary">
                      {dictionary['TarotEnhanced.readingComplete'] || 'Lectura Completada'}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {dictionary['TarotEnhanced.readingCompleteDesc'] || 
                       'Tu lectura ha sido completada con éxito. Las cartas han revelado sus mensajes y la sabiduría está disponible para ti.'}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button onClick={resetReading} size="lg">
                      <Sparkles className="w-5 h-5 mr-2" />
                      {dictionary['TarotEnhanced.newReading'] || 'Nueva Lectura'}
                    </Button>
                    {onClose && (
                      <Button onClick={onClose} variant="outline" size="lg">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {dictionary['TarotEnhanced.backToApp'] || 'Volver a la App'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Resumen de la última lectura */}
                {readingHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl mx-auto"
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                          {dictionary['TarotEnhanced.lastReading'] || 'Última Lectura'}
                        </h3>
                        
                        {(() => {
                          const lastReading = readingHistory[readingHistory.length - 1];
                          return (
                            <div className="space-y-4">
                              <div className="flex justify-center space-x-2">
                                {lastReading.cards.slice(0, 5).map((card, index) => (
                                  <div key={index} className="w-12 h-18 bg-primary/10 rounded-md flex items-center justify-center">
                                    <Star className="w-4 h-4 text-primary" />
                                  </div>
                                ))}
                              </div>
                              
                              <div className="text-center space-y-2">
                                <div className="text-sm font-medium">
                                  {'synthesis' in lastReading 
                                    ? (dictionary['TarotEnhanced.pastPresentFutureReading'] || 'Pasado/Presente/Futuro')
                                    : (dictionary['TarotEnhanced.standardReading'] || 'Lectura Estándar')
                                  }
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {lastReading.cards.length} {dictionary['TarotEnhanced.cards'] || 'cartas'} • {new Date(lastReading.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
