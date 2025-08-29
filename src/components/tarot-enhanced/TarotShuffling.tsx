/**
 * @fileOverview Componente de Barajado Táctil Mejorado
 * Barajado con corte en 3 montones y semilla RNG visible
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shuffle, Hand, Eye, RotateCcw } from 'lucide-react';
import type { Dictionary } from '@/types';
import type { ShuffleSeed } from '@/types/tarot-enhanced';

interface TarotShufflingProps {
  dictionary: Dictionary;
  onShuffleComplete: (seed: ShuffleSeed) => void;
  className?: string;
}

interface DeckPile {
  id: number;
  cards: number;
  x: number;
  y: number;
  rotation: number;
}

export default function TarotShuffling({ 
  dictionary, 
  onShuffleComplete,
  className 
}: TarotShufflingProps) {
  const [shuffleStep, setShuffleStep] = useState<'instruction' | 'shuffling' | 'cutting' | 'complete'>('instruction');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [piles, setPiles] = useState<DeckPile[]>([]);
  const [cuts, setCuts] = useState<number[]>([]);
  const [seed, setSeed] = useState<ShuffleSeed | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generar semilla inicial
  useEffect(() => {
    const timestamp = Date.now();
    const cut1 = Math.floor(Math.random() * 30) + 15; // 15-44
    const cut2 = Math.floor(Math.random() * 30) + 15; // 15-44
    const cut3 = Math.floor(Math.random() * 30) + 15; // 15-44
    
    setSeed({
      cut1,
      cut2,
      cut3,
      timestamp
    });
  }, []);

  const startShuffling = () => {
    setShuffleStep('shuffling');
    // Animación de barajado automática
    const shuffleInterval = setInterval(() => {
      setShuffleCount(prev => {
        if (prev >= 7) {
          clearInterval(shuffleInterval);
          setShuffleStep('cutting');
          initializePiles();
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const initializePiles = () => {
    const initialPiles: DeckPile[] = [
      { id: 1, cards: 78, x: 0, y: 0, rotation: 0 },
      { id: 2, cards: 0, x: 150, y: 0, rotation: 0 },
      { id: 3, cards: 0, x: 300, y: 0, rotation: 0 }
    ];
    setPiles(initialPiles);
  };

  const handlePileCut = (fromPile: number, toPile: number, cardCount: number) => {
    if (cuts.length >= 2) return;

    setPiles(prev => prev.map(pile => {
      if (pile.id === fromPile) {
        return { ...pile, cards: pile.cards - cardCount };
      }
      if (pile.id === toPile) {
        return { ...pile, cards: pile.cards + cardCount };
      }
      return pile;
    }));

    setCuts(prev => [...prev, cardCount]);

    if (cuts.length === 1) {
      // Segundo corte completado
      setTimeout(() => {
        setShuffleStep('complete');
      }, 500);
    }
  };

  const handleDragEnd = (pileId: number, info: PanInfo) => {
    const { offset } = info;
    
    // Determinar a qué pila se está moviendo basado en la posición
    let targetPile = pileId;
    if (offset.x > 100) targetPile = Math.min(3, pileId + 1);
    if (offset.x < -100) targetPile = Math.max(1, pileId - 1);
    
    if (targetPile !== pileId && cuts.length < 2) {
      const pile = piles.find(p => p.id === pileId);
      if (pile && pile.cards > 0) {
        const cutSize = seed ? (cuts.length === 0 ? seed.cut1 : seed.cut2) : 20;
        const actualCut = Math.min(cutSize, pile.cards);
        handlePileCut(pileId, targetPile, actualCut);
      }
    }
    
    setIsDragging(false);
  };

  const completeShuffling = () => {
    if (seed) {
      onShuffleComplete(seed);
    }
  };

  const resetShuffle = () => {
    setShuffleStep('instruction');
    setShuffleCount(0);
    setPiles([]);
    setCuts([]);
    
    // Generar nueva semilla
    const timestamp = Date.now();
    const cut1 = Math.floor(Math.random() * 30) + 15;
    const cut2 = Math.floor(Math.random() * 30) + 15;
    const cut3 = Math.floor(Math.random() * 30) + 15;
    
    setSeed({
      cut1,
      cut2,
      cut3,
      timestamp
    });
  };

  return (
    <div className={cn("max-w-4xl mx-auto p-6 space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-primary">
          {dictionary['TarotEnhanced.shuffleTitle'] || 'Barajado Sagrado'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {dictionary['TarotEnhanced.shuffleSubtitle'] || 'Conecta con las cartas a través del tacto consciente'}
        </p>
      </motion.div>

      {/* Mostrar semilla RNG */}
      {seed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-muted/50 rounded-lg p-4 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>
              {dictionary['TarotEnhanced.shuffleSeed'] || 'Corte:'} {seed.cut1}–{seed.cut2}–{seed.cut3}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {dictionary['TarotEnhanced.shuffleTrust'] || 'Transparencia energética para tu confianza'}
          </p>
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {shuffleStep === 'instruction' && (
            <motion.div
              key="instruction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Hand className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary['TarotEnhanced.shuffleInstructions'] || 'Preparación Energética'}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2 text-left">
                    <p>• {dictionary['TarotEnhanced.step1'] || 'Respira profundamente y centra tu intención'}</p>
                    <p>• {dictionary['TarotEnhanced.step2'] || 'Las cartas captarán tu energía durante el barajado'}</p>
                    <p>• {dictionary['TarotEnhanced.step3'] || 'Confía en tu intuición para el corte'}</p>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={startShuffling} size="lg" className="px-8">
                <Shuffle className="w-5 h-5 mr-2" />
                {dictionary['TarotEnhanced.beginShuffle'] || 'Comenzar Barajado'}
              </Button>
            </motion.div>
          )}

          {shuffleStep === 'shuffling' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mx-auto shadow-2xl"
                  animate={{
                    rotateY: [0, 180, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: shuffleCount < 7 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shuffle className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {dictionary['TarotEnhanced.shufflingCards'] || 'Barajando las Cartas...'}
                </h3>
                <p className="text-muted-foreground">
                  {dictionary['TarotEnhanced.shuffleProgress'] || `Barajado ${shuffleCount}/7`}
                </p>
              </div>

              <div className="w-full bg-muted rounded-full h-2 max-w-xs mx-auto">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(shuffleCount / 7) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {shuffleStep === 'cutting' && (
            <motion.div
              key="cutting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">
                  {dictionary['TarotEnhanced.cutCards'] || 'Corta el Mazo'}
                </h3>
                <p className="text-muted-foreground">
                  {dictionary['TarotEnhanced.cutInstructions'] || 'Arrastra las cartas para hacer 2 cortes intuitivos'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dictionary['TarotEnhanced.cutsRemaining'] || `Cortes restantes: ${2 - cuts.length}`}
                </p>
              </div>

              <div className="relative h-64 flex justify-center items-center">
                <div className="flex space-x-4">
                  {piles.map((pile) => (
                    <motion.div
                      key={pile.id}
                      className={cn(
                        "relative cursor-grab active:cursor-grabbing",
                        pile.cards === 0 && "opacity-30"
                      )}
                      drag={pile.cards > 0 && cuts.length < 2}
                      dragConstraints={{ left: -200, right: 200, top: -50, bottom: 50 }}
                      dragElastic={0.2}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={(_, info) => handleDragEnd(pile.id, info)}
                      whileHover={{ scale: pile.cards > 0 ? 1.05 : 1 }}
                      whileDrag={{ scale: 1.1, zIndex: 10 }}
                    >
                      <div className={cn(
                        "w-20 h-32 rounded-lg shadow-lg transition-all",
                        pile.cards > 0 
                          ? "bg-gradient-to-br from-purple-600 to-blue-600" 
                          : "bg-muted border-2 border-dashed border-muted-foreground/30"
                      )}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs">
                          <span className="font-bold">{pile.cards}</span>
                          <span>cartas</span>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                        Pila {pile.id}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {cuts.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button onClick={() => setShuffleStep('complete')} size="lg">
                    {dictionary['TarotEnhanced.finishCutting'] || 'Finalizar Corte'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {shuffleStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-32 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mx-auto shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">
                  {dictionary['TarotEnhanced.shuffleComplete'] || 'Barajado Completado'}
                </h3>
                <p className="text-muted-foreground">
                  {dictionary['TarotEnhanced.energyAttuned'] || 'Las cartas están sintonizadas con tu energía'}
                </p>
                
                {seed && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="text-muted-foreground">
                      {dictionary['TarotEnhanced.finalSeed'] || 'Corte final:'} {seed.cut1}–{seed.cut2}–{seed.cut3}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={resetShuffle} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {dictionary['TarotEnhanced.reshuffleCards'] || 'Rebarajar'}
                </Button>
                <Button onClick={completeShuffling} size="lg">
                  {dictionary['TarotEnhanced.proceedToSelection'] || 'Seleccionar Cartas'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
