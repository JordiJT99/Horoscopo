/**
 * @fileOverview Componente de Tirada Pasado/Presente/Futuro
 * Especializado en la lectura de 3 cartas con síntesis TL;DR
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Calendar, 
  Sparkles, 
  Star, 
  Eye,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import type { Dictionary } from '@/types';
import type { 
  TarotCard, 
  TarotConfiguration, 
  PastPresentFutureReading,
  PastPresentFutureCard
} from '@/types/tarot-enhanced';

interface TarotPastPresentFutureProps {
  dictionary: Dictionary;
  configuration: TarotConfiguration;
  onReadingComplete: (reading: PastPresentFutureReading) => void;
  onBackToStandard?: () => void;
  className?: string;
}

export default function TarotPastPresentFuture({ 
  dictionary, 
  configuration,
  onReadingComplete,
  onBackToStandard,
  className 
}: TarotPastPresentFutureProps) {
  const [phase, setPhase] = useState<'introduction' | 'selection' | 'revealing' | 'interpretation' | 'synthesis'>('introduction');
  const [selectedCards, setSelectedCards] = useState<PastPresentFutureCard[]>([]);
  const [currentPosition, setCurrentPosition] = useState<'past' | 'present' | 'future'>('past');
  const [revealedPositions, setRevealedPositions] = useState<Set<string>>(new Set());
  const [deckCards] = useState<TarotCard[]>(generateDeck());
  const [synthesis, setSynthesis] = useState<string>('');

  const positions = [
    {
      key: 'past' as const,
      title: dictionary['TarotEnhanced.pastPosition'] || 'Pasado',
      subtitle: dictionary['TarotEnhanced.pastSubtitle'] || 'Influencias y experiencias pasadas',
      icon: Clock,
      color: 'from-slate-500 to-gray-600',
      textColor: 'text-slate-600'
    },
    {
      key: 'present' as const,
      title: dictionary['TarotEnhanced.presentPosition'] || 'Presente',
      subtitle: dictionary['TarotEnhanced.presentSubtitle'] || 'Situación actual y energías presentes',
      icon: Calendar,
      color: 'from-blue-500 to-purple-600',
      textColor: 'text-blue-600'
    },
    {
      key: 'future' as const,
      title: dictionary['TarotEnhanced.futurePosition'] || 'Futuro',
      subtitle: dictionary['TarotEnhanced.futureSubtitle'] || 'Tendencias y posibilidades futuras',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600'
    }
  ];

  const startSelection = () => {
    setPhase('selection');
    setCurrentPosition('past');
  };

  const selectCardForPosition = (card: TarotCard) => {
    const newCard: PastPresentFutureCard = {
      ...card,
      position: currentPosition,
      interpretation: '',
      positionMeaning: ''
    };

    setSelectedCards(prev => [...prev, newCard]);

    // Avanzar a la siguiente posición
    if (currentPosition === 'past') {
      setCurrentPosition('present');
    } else if (currentPosition === 'present') {
      setCurrentPosition('future');
    } else {
      // Todas las cartas seleccionadas, comenzar revelado
      setPhase('revealing');
      startRevealProcess();
    }
  };

  const startRevealProcess = () => {
    setRevealedPositions(new Set());
    
    // Revelar posiciones una por una
    const revealSequence = ['past', 'present', 'future'];
    revealSequence.forEach((position, index) => {
      setTimeout(() => {
        setRevealedPositions(prev => new Set([...prev, position]));
        
        if (index === revealSequence.length - 1) {
          // Todas reveladas, pasar a interpretación
          setTimeout(() => {
            setPhase('interpretation');
            generateInterpretations();
          }, 1500);
        }
      }, (index + 1) * 2000);
    });
  };

  const generateInterpretations = () => {
    // Simular interpretaciones (se integrará con AI)
    const interpretations = selectedCards.map(card => ({
      ...card,
      interpretation: generateCardInterpretation(card, configuration),
      positionMeaning: generatePositionMeaning(card.position, card, configuration)
    }));

    setSelectedCards(interpretations);
    
    // Generar síntesis después de un momento
    setTimeout(() => {
      const synthesisText = generateSynthesis(interpretations, configuration);
      setSynthesis(synthesisText);
      setPhase('synthesis');
    }, 3000);
  };

  const resetReading = () => {
    setSelectedCards([]);
    setRevealedPositions(new Set());
    setSynthesis('');
    setPhase('introduction');
    setCurrentPosition('past');
  };

  const getCurrentPositionInfo = () => {
    return positions.find(p => p.key === currentPosition);
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-6 space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-primary">
          {dictionary['TarotEnhanced.pastPresentFutureTitle'] || 'Pasado • Presente • Futuro'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {dictionary['TarotEnhanced.pastPresentFutureDesc'] || 
           'Una perspectiva completa de tu situación: las influencias del pasado, la realidad presente y las posibilidades futuras.'}
        </p>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {phase === 'introduction' && (
            <motion.div
              key="introduction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Vista general de las posiciones */}
              <div className="grid md:grid-cols-3 gap-6">
                {positions.map((position, index) => {
                  const Icon = position.icon;
                  return (
                    <motion.div
                      key={position.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center">
                          <div className={cn(
                            "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
                            "bg-gradient-to-br", position.color
                          )}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className={cn("text-xl", position.textColor)}>
                            {position.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-center">
                            {position.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Enfoque seleccionado */}
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        {dictionary['TarotEnhanced.focus'] || 'Enfoque'}:
                      </span>
                      <Badge variant="secondary">
                        {configuration.focus === 'love' && (dictionary['TarotEnhanced.focusLove'] || 'Amor')}
                        {configuration.focus === 'work_money' && (dictionary['TarotEnhanced.focusWork'] || 'Trabajo/Dinero')}
                        {configuration.focus === 'wellness' && (dictionary['TarotEnhanced.focusWellness'] || 'Bienestar')}
                        {configuration.focus === 'general' && (dictionary['TarotEnhanced.focusGeneral'] || 'General')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        {dictionary['TarotEnhanced.timeframe'] || 'Período'}:
                      </span>
                      <Badge variant="outline">
                        {configuration.timeframe === 'today' && (dictionary['TarotEnhanced.timeframeToday'] || 'Hoy')}
                        {configuration.timeframe === 'week' && (dictionary['TarotEnhanced.timeframeWeek'] || 'Esta semana')}
                        {configuration.timeframe === 'month' && (dictionary['TarotEnhanced.timeframeMonth'] || 'Este mes')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                {onBackToStandard && (
                  <Button onClick={onBackToStandard} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {dictionary['TarotEnhanced.backToStandard'] || 'Lectura Estándar'}
                  </Button>
                )}
                <Button onClick={startSelection} size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {dictionary['TarotEnhanced.beginReading'] || 'Comenzar Lectura'}
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Indicador de progreso */}
              <div className="flex justify-center items-center space-x-4">
                {positions.map((position, index) => {
                  const Icon = position.icon;
                  const isCompleted = selectedCards.some(c => c.position === position.key);
                  const isCurrent = currentPosition === position.key;
                  
                  return (
                    <div key={position.key} className="flex items-center">
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.1 : 1,
                          opacity: isCompleted ? 1 : isCurrent ? 1 : 0.4
                        }}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-2",
                          isCompleted 
                            ? "bg-primary border-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary text-primary"
                            : "border-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      {index < positions.length - 1 && (
                        <div className={cn(
                          "w-8 h-0.5 mx-2",
                          isCompleted || (isCurrent && index === 0) ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Posición actual */}
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className={cn(
                      "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
                      "bg-gradient-to-br", getCurrentPositionInfo()?.color
                    )}>
                      {(() => {
                        const Icon = getCurrentPositionInfo()!.icon;
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {dictionary['TarotEnhanced.selectCardFor'] || 'Selecciona una carta para'}
                      </h3>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {getCurrentPositionInfo()?.title}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {getCurrentPositionInfo()?.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cartas ya seleccionadas */}
              {selectedCards.length > 0 && (
                <div className="max-w-md mx-auto">
                  <h4 className="text-center text-sm text-muted-foreground mb-3">
                    {dictionary['TarotEnhanced.selectedCards'] || 'Cartas seleccionadas'}
                  </h4>
                  <div className="flex justify-center space-x-2">
                    {selectedCards.map((card, index) => (
                      <motion.div
                        key={`selected-${index}`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-12 h-18 bg-primary rounded-md flex items-center justify-center"
                      >
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mazo de cartas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  {dictionary['TarotEnhanced.selectFromDeck'] || 'Selecciona del Mazo'}
                </h3>
                
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {deckCards.slice(0, 30).map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectCardForPosition(card)}
                      className="w-full aspect-[2/3] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 text-center">
                        <Sparkles className="w-6 h-6 text-white mx-auto mb-1" />
                        <div className="text-xs text-white/80 font-medium">
                          {card.id}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {(phase === 'revealing' || phase === 'interpretation' || phase === 'synthesis') && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Spread de 3 cartas */}
              <div className="grid md:grid-cols-3 gap-6">
                {positions.map((position) => {
                  const card = selectedCards.find(c => c.position === position.key);
                  const isRevealed = revealedPositions.has(position.key);
                  const Icon = position.icon;

                  return (
                    <motion.div
                      key={position.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <div className={cn(
                          "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2",
                          "bg-gradient-to-br", position.color
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">{position.title}</h3>
                      </div>

                      {/* Carta */}
                      <div className="flex justify-center">
                        <motion.div
                          initial={{ rotateY: 180 }}
                          animate={{ 
                            rotateY: isRevealed ? 0 : 180,
                            scale: isRevealed ? 1 : 0.9
                          }}
                          transition={{ 
                            duration: 0.8,
                            type: "spring",
                            stiffness: 100
                          }}
                          className="w-32 h-48 rounded-lg relative"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Reverso */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
                               style={{ backfaceVisibility: 'hidden' }}>
                            <Sparkles className="w-12 h-12 text-white" />
                          </div>
                          
                          {/* Frente */}
                          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center border shadow-lg"
                               style={{ 
                                 backfaceVisibility: 'hidden',
                                 transform: 'rotateY(180deg)'
                               }}>
                            <Star className="w-8 h-8 text-yellow-500 mb-3" />
                            <div className="text-sm font-medium text-center mb-2">
                              {card?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {card?.arcana}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Interpretación */}
                      {phase === 'interpretation' && card?.interpretation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Card>
                            <CardContent className="p-4 space-y-3">
                              <h4 className="font-medium text-sm text-primary">
                                {dictionary['TarotEnhanced.positionMeaning'] || 'Significado en esta posición'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {card.positionMeaning}
                              </p>
                              <Separator />
                              <h4 className="font-medium text-sm text-primary">
                                {dictionary['TarotEnhanced.cardInterpretation'] || 'Interpretación'}
                              </h4>
                              <p className="text-sm">
                                {card.interpretation}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Síntesis TL;DR */}
              {phase === 'synthesis' && synthesis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl text-primary">
                          {dictionary['TarotEnhanced.synthesis'] || 'Síntesis • TL;DR'}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg leading-relaxed">
                        {synthesis}
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                          <div className="text-sm font-medium">
                            {dictionary['TarotEnhanced.pastInsight'] || 'Del Pasado'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {dictionary['TarotEnhanced.pastKeyword'] || 'Experiencia'}
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-sm font-medium">
                            {dictionary['TarotEnhanced.presentInsight'] || 'Del Presente'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {dictionary['TarotEnhanced.presentKeyword'] || 'Acción'}
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-sm font-medium">
                            {dictionary['TarotEnhanced.futureInsight'] || 'Del Futuro'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {dictionary['TarotEnhanced.futureKeyword'] || 'Posibilidad'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Acciones */}
              {phase === 'synthesis' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center space-x-4"
                >
                  <Button onClick={resetReading} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {dictionary['TarotEnhanced.newReading'] || 'Nueva Lectura'}
                  </Button>
                  <Button onClick={() => {
                    const reading: PastPresentFutureReading = {
                      id: `ppf-reading-${Date.now()}`,
                      cards: selectedCards,
                      configuration,
                      timestamp: new Date().toISOString(),
                      synthesis,
                      insights: {
                        past: selectedCards.find(c => c.position === 'past')?.interpretation || '',
                        present: selectedCards.find(c => c.position === 'present')?.interpretation || '',
                        future: selectedCards.find(c => c.position === 'future')?.interpretation || ''
                      }
                    };
                    onReadingComplete(reading);
                  }}>
                    <Target className="w-4 h-4 mr-2" />
                    {dictionary['TarotEnhanced.saveReading'] || 'Guardar Lectura'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Funciones auxiliares
function generateDeck(): TarotCard[] {
  // Reutilizar la función del componente anterior
  const majorArcana = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
  ];

  const suits = ["Copas", "Espadas", "Bastos", "Oros"];
  const numbers = ["As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Sota", "Caballo", "Rey"];

  const cards: TarotCard[] = [];

  majorArcana.forEach((name, index) => {
    cards.push({
      id: `major-${index}`,
      name,
      arcana: 'major',
      suit: null,
      number: index,
      keywords: [],
      meaning: '',
      reversedMeaning: '',
      isReversed: false
    });
  });

  suits.forEach(suit => {
    numbers.forEach((number, index) => {
      cards.push({
        id: `minor-${suit}-${index}`,
        name: `${number} de ${suit}`,
        arcana: 'minor',
        suit,
        number: index + 1,
        keywords: [],
        meaning: '',
        reversedMeaning: '',
        isReversed: false
      });
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

function generateCardInterpretation(card: PastPresentFutureCard, config: TarotConfiguration): string {
  // Esta función se expandirá con integración de AI
  const focusContext = {
    love: 'relaciones y amor',
    work_money: 'trabajo y dinero',
    wellness: 'bienestar y salud',
    general: 'aspectos generales de la vida'
  };

  return `En el contexto de ${focusContext[config.focus]}, ${card.name} en la posición de ${card.position} sugiere una influencia significativa que merece tu atención.`;
}

function generatePositionMeaning(position: 'past' | 'present' | 'future', card: PastPresentFutureCard, config: TarotConfiguration): string {
  const meanings = {
    past: `Esta carta revela las influencias del pasado que han moldeado tu situación actual en relación a ${config.focus}.`,
    present: `${card.name} representa las energías y circunstancias que están activas en tu vida en este momento.`,
    future: `Esta carta indica las tendencias y posibilidades que se desarrollarán en relación a tu consulta sobre ${config.focus}.`
  };

  return meanings[position];
}

function generateSynthesis(cards: PastPresentFutureCard[], config: TarotConfiguration): string {
  const past = cards.find(c => c.position === 'past');
  const present = cards.find(c => c.position === 'present');
  const future = cards.find(c => c.position === 'future');

  return `**TL;DR**: Tu consulta sobre ${config.focus} revela que ${past?.name} del pasado ha influenciado tu ${present?.name} actual, y esto está encaminando hacia ${future?.name} en el futuro. La clave está en integrar las lecciones del pasado, actuar conscientemente en el presente y mantener una actitud abierta hacia las posibilidades que se avecinan.`;
}
