
'use client';

import React from 'react';
import type { Dictionary } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper to get unicode symbols for planets
const getPlanetSymbol = (placement: string): string => {
  const name = placement.split(' ')[0].toLowerCase();
  const symbolMap: Record<string, string> = {
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
  };
  return symbolMap[name] || '•'; // default dot
};

interface HousePlacementDetail {
  placement: string;
  explanation: string;
}

interface NatalChartHousesViewProps {
  housesDetails: HousePlacementDetail[];
  dictionary: Dictionary;
}

const NatalChartHousesView: React.FC<NatalChartHousesViewProps> = ({ housesDetails, dictionary }) => {
  if (!housesDetails || housesDetails.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        {dictionary.NatalChartPage?.housesDetails?.noPlacementsFound || "No significant house placements found."}
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {housesDetails.map((house, index) => (
          <AccordionItem key={index} value={`house-${index}`} className="bg-card/70 backdrop-blur-sm border border-white/10 rounded-lg shadow-md overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-card/90 transition-colors w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 text-left">
                   <span className="text-primary text-xl">{getPlanetSymbol(house.placement)}</span>
                   <span className="font-medium text-sm sm:text-base leading-tight text-foreground">
                    {house.placement}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 text-foreground/80 bg-background/20 text-sm">
              <p>{house.explanation}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NatalChartHousesView;
