/**
 * @fileOverview Componente de Selección y Revelado Progresivo de Cartas
 * Permite al usuario seleccionar cartas del mazo y las revela progresivamente
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Sparkles, Eye, Star, Lock } from 'lucide-react';
import type { Dictionary } from '@/types';
import type { 
  TarotCard, 
  TarotConfiguration, 
  TarotMode,
  TarotReading 
} from '@/types/tarot-enhanced';

interface TarotCardSelectionProps {
  dictionary: Dictionary;
  configuration: TarotConfiguration;
  onReadingComplete: (reading: TarotReading) => void;
  className?: string;
}

export default function TarotCardSelection({ 
  dictionary, 
  configuration,
  onReadingComplete,
  className 
}: TarotCardSelectionProps) {
  const [phase, setPhase] = useState<'selection' | 'revealing' | 'complete'>('selection');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<TarotCard[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [deckCards] = useState<TarotCard[]>(generateDeck());
  const [showHint, setShowHint] = useState(false);

  const getCardCount = (mode: TarotMode): number => {
    switch (mode) {
      case 'quick': return 2;
      case 'standard': return 4;
      case 'advanced': return 6;
      default: return 2;
    }
  };

  const cardCount = getCardCount(configuration.mode);

  useEffect(() => {
    if (selectedCards.length === cardCount) {
      setPhase('revealing');
      startRevealProcess();
    }
  }, [selectedCards, cardCount]);

  const startRevealProcess = () => {
    setCurrentRevealIndex(0);
    setRevealedCards([]);
    
    // Revelar cartas una por una con delays
    const revealNext = (index: number) => {
      if (index < selectedCards.length) {
        setTimeout(() => {
          setRevealedCards(prev => [...prev, selectedCards[index]]);
          setCurrentRevealIndex(index + 1);
          
          if (index + 1 < selectedCards.length) {
            revealNext(index + 1);
          } else {
            // Todas las cartas reveladas
            setTimeout(() => {
              setPhase('complete');
              onReadingComplete({
                id: `reading-${Date.now()}`,
                cards: selectedCards,
                configuration,
                timestamp: new Date().toISOString(),
                interpretations: generateInterpretations(selectedCards, configuration)
              });
            }, 1500);
          }
        }, 2000); // 2 segundos entre cada carta
      }
    };

    revealNext(0);
  };

  const selectCard = (card: TarotCard) => {
    if (selectedCards.length < cardCount) {
      setSelectedCards(prev => [...prev, card]);
      setShowHint(false);
    }
  };

  const resetSelection = () => {
    setSelectedCards([]);
    setRevealedCards([]);
    setCurrentRevealIndex(0);
    setPhase('selection');
    setShowHint(false);
  };

  const showSelectionHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-6 space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-primary">
          {dictionary['TarotEnhanced.cardSelectionTitle'] || 'Selección de Cartas'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {phase === 'selection' && (
            dictionary['TarotEnhanced.cardSelectionDesc'] || `Elige ${cardCount} cartas que resuenen contigo`
          )}
          {phase === 'revealing' && (
            dictionary['TarotEnhanced.cardRevealingDesc'] || 'Las cartas se están revelando...'
          )}
          {phase === 'complete' && (
            dictionary['TarotEnhanced.cardCompleteDesc'] || 'Tu lectura está completa'
          )}
        </p>
      </motion.div>

      {/* Configuración seleccionada */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                {dictionary['TarotEnhanced.focus'] || 'Enfoque'}:
              </span>
              <span className="capitalize font-medium">
                {configuration.focus === 'love' && (dictionary['TarotEnhanced.focusLove'] || 'Amor')}
                {configuration.focus === 'work_money' && (dictionary['TarotEnhanced.focusWork'] || 'Trabajo/Dinero')}
                {configuration.focus === 'wellness' && (dictionary['TarotEnhanced.focusWellness'] || 'Bienestar')}
                {configuration.focus === 'general' && (dictionary['TarotEnhanced.focusGeneral'] || 'General')}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                {dictionary['TarotEnhanced.mode'] || 'Modo'}:
              </span>
              <span className="capitalize font-medium">
                {configuration.mode === 'quick' && (dictionary['TarotEnhanced.modeQuick'] || 'Rápida')}
                {configuration.mode === 'standard' && (dictionary['TarotEnhanced.modeStandard'] || 'Estándar')}
                {configuration.mode === 'advanced' && (dictionary['TarotEnhanced.modeAdvanced'] || 'Avanzada')}
                {(configuration.mode === 'standard' || configuration.mode === 'advanced') && (
                  <Star className="w-4 h-4 inline ml-1 text-yellow-500" />
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progreso de selección */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{dictionary['TarotEnhanced.cardsSelected'] || 'Cartas seleccionadas'}</span>
                  <span>{selectedCards.length}/{cardCount}</span>
                </div>
                <Progress value={(selectedCards.length / cardCount) * 100} className="h-2" />
              </div>

              {/* Cartas seleccionadas */}
              {selectedCards.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">
                    {dictionary['TarotEnhanced.yourSelection'] || 'Tu Selección'}
                  </h3>
                  <div className="flex justify-center space-x-2">
                    {selectedCards.map((card, index) => (
                      <motion.div
                        key={`selected-${index}`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-16 h-24 bg-primary rounded-lg flex items-center justify-center"
                      >
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mazo de cartas */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {dictionary['TarotEnhanced.selectFromDeck'] || 'Selecciona del Mazo'}
                  </h3>
                  <div className="flex space-x-2">
                    <Button onClick={showSelectionHint} variant="outline" size="sm">
                      {dictionary['TarotEnhanced.hint'] || 'Consejo'}
                    </Button>
                    {selectedCards.length > 0 && (
                      <Button onClick={resetSelection} variant="outline" size="sm">
                        {dictionary['TarotEnhanced.reset'] || 'Reiniciar'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Consejo de selección */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                    >
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {dictionary['TarotEnhanced.selectionHint'] || 
                         'Deja que tu intuición te guíe. Mira las cartas y selecciona aquellas que sientes que "te llaman". No hay elecciones correctas o incorrectas.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Grid de cartas */}
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {deckCards.slice(0, 50).map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectCard(card)}
                      className={cn(
                        "w-full aspect-[2/3] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg cursor-pointer",
                        "flex items-center justify-center relative overflow-hidden",
                        "hover:shadow-lg transition-shadow duration-200",
                        selectedCards.some(c => c.id === card.id) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 text-center">
                        <Sparkles className="w-6 h-6 text-white mx-auto mb-1" />
                        <div className="text-xs text-white/80 font-medium">
                          {card.id}
                        </div>
                      </div>
                      
                      {selectedCards.some(c => c.id === card.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'revealing' && (
            <motion.div
              key="revealing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8"
            >
              <h3 className="text-2xl font-semibold text-primary">
                {dictionary['TarotEnhanced.revealingCards'] || 'Revelando las Cartas...'}
              </h3>

              {/* Cartas en revelado */}
              <div className="flex justify-center space-x-4">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={`reveal-${index}`}
                    initial={{ rotateY: 180 }}
                    animate={{ 
                      rotateY: revealedCards.includes(card) ? 0 : 180,
                      scale: currentRevealIndex === index ? 1.1 : 1
                    }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                    className={cn(
                      "w-24 h-36 rounded-lg relative",
                      currentRevealIndex === index && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Reverso de la carta */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"
                         style={{ backfaceVisibility: 'hidden' }}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Frente de la carta */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center border"
                         style={{ 
                           backfaceVisibility: 'hidden',
                           transform: 'rotateY(180deg)'
                         }}>
                      <Star className="w-6 h-6 text-yellow-500 mb-2" />
                      <div className="text-xs font-medium text-center">
                        {card.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {card.arcana}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progreso de revelado */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{dictionary['TarotEnhanced.cardsRevealed'] || 'Cartas reveladas'}</span>
                  <span>{revealedCards.length}/{selectedCards.length}</span>
                </div>
                <Progress value={(revealedCards.length / selectedCards.length) * 100} className="h-2" />
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                <Star className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-primary">
                  {dictionary['TarotEnhanced.selectionComplete'] || 'Selección Completa'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {dictionary['TarotEnhanced.selectionCompleteDesc'] || 
                   'Tus cartas han sido reveladas y están listas para la interpretación.'}
                </p>
              </div>

              {/* Cartas finales */}
              <div className="flex justify-center space-x-2">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={`final-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-20 h-30 bg-white dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center border shadow-sm"
                  >
                    <Star className="w-5 h-5 text-yellow-500 mb-1" />
                    <div className="text-xs font-medium text-center">
                      {card.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Funciones auxiliares
function generateDeck(): TarotCard[] {
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

  // Arcanos Mayores
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

  // Arcanos Menores
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

  return cards.sort(() => Math.random() - 0.5); // Barajar
}

function generateInterpretations(cards: TarotCard[], config: TarotConfiguration): string[] {
  // Esta función se expandirá con la integración de AI
  return cards.map(card => `Interpretación para ${card.name} en contexto de ${config.focus}`);
}
