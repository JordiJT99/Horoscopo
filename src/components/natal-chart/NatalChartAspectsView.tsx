'use client';

import React from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper to get unicode symbols for planets and aspects
const getAstrologicalSymbol = (name: string): string => {
  const symbolMap: Record<string, string> = {
    // Planets in Spanish/English, as they come from the AI
    'sol': '☉', 'sun': '☉',
    'luna': '☽', 'moon': '☽',
    'mercurio': '☿', 'mercury': '☿',
    'venus': '♀',
    'marte': '♂', 'mars': '♂',
    'júpiter': '♃', 'jupiter': '♃',
    'saturno': '♄', 'saturn': '♄',
    'urano': '♅', 'uranus': '♅',
    'neptuno': '♆', 'neptune': '♆',
    'plutón': '♇', 'pluto': '♇',
    'ascendente': 'AC', 'ascendant': 'AC',
    // Aspects in Spanish/English
    'conjunción': '☌', 'conjunction': '☌',
    'oposición': '☍', 'opposition': '☍',
    'trígono': '△', 'trine': '△',
    'cuadratura': '□', 'square': '□',
    'sextil': '⚹', 'sextile': '⚹',
    'quincuncio': '⚻', 'quincunx': '⚻'
  };
  return symbolMap[name.toLowerCase()] || '';
};

interface AspectDetail {
  body1: string;
  body2: string;
  type: string;
  degree: number;
  explanation: string;
}

interface NatalChartAspectsViewProps {
  aspectsDetails: AspectDetail[];
  dictionary: Dictionary;
}

const NatalChartAspectsView: React.FC<NatalChartAspectsViewProps> = ({ aspectsDetails, dictionary }) => {
  if (!aspectsDetails || aspectsDetails.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        {dictionary.NatalChartPage?.aspectsDetails?.noAspectsFound || "No significant aspects found in this chart."}
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {aspectsDetails.map((aspect, index) => (
          <AccordionItem key={index} value={`aspect-${index}`} className="bg-card/70 backdrop-blur-sm border border-white/10 rounded-lg shadow-md overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-card/90 transition-colors w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm sm:text-base leading-tight text-foreground">
                    {`${aspect.body1} ${aspect.type} ${aspect.body2}`}
                  </span>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm mt-1">
                    <span title={aspect.body1}>{getAstrologicalSymbol(aspect.body1)}</span>
                    <span title={aspect.type}>{getAstrologicalSymbol(aspect.type)}</span>
                    <span title={aspect.body2}>{getAstrologicalSymbol(aspect.body2)}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-primary font-semibold shrink-0 ml-4">
                  <span>{`${aspect.degree.toFixed(1)}°`}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 text-foreground/80 bg-background/20 text-sm">
              <p>{aspect.explanation}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NatalChartAspectsView;