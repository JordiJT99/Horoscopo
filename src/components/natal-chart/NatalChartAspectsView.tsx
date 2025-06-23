'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

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

// Assuming a helper component or function to render astrological symbols exists
// Replace with your actual implementation if different
const AstrologicalSymbol = ({ symbol }: { symbol: string }) => {
  // This is a placeholder. Implement actual symbol rendering (e.g., using a font or SVG)
  return <span>{symbol}</span>;
};

const NatalChartAspectsView: React.FC<NatalChartAspectsViewProps> = ({ aspectsDetails, dictionary }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (!aspectsDetails || aspectsDetails.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        {dictionary.NatalChartPage?.aspectsDetails?.noAspectsFound || "No significant aspects found in this chart."}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
        {aspectsDetails.map((aspect, index) => (
          <AccordionItem key={index} value={`aspect-${index}`}>
            <AccordionTrigger className="flex justify-between items-center px-4 py-3 bg-card hover:bg-card/80 transition-colors rounded-md mb-2">
              <div className="flex items-center space-x-2">
                {/* Placeholder symbols - replace with actual rendering */}
                <span>{aspect.body1}</span>
                <span>{aspect.type}</span>
                <span>{aspect.body2}</span>
                <span className="ml-2 font-medium">
                  {`${aspect.body1} ${aspect.type} ${aspect.body2}`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{`${aspect.degree.toFixed(1)}°`}</div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-foreground/80 bg-card-foreground/10 rounded-md mt-1">
              {aspect.explanation}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NatalChartAspectsView;
'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

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

// Assuming a helper component or function to render astrological symbols exists
// Replace with your actual implementation if different
const AstrologicalSymbol = ({ symbol }: { symbol: string }) => {
  // This is a placeholder. Implement actual symbol rendering (e.g., using a font or SVG)
  return <span>{symbol}</span>;
};

const NatalChartAspectsView: React.FC<NatalChartAspectsViewProps> = ({ aspectsDetails, dictionary }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (!aspectsDetails || aspectsDetails.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        {dictionary.NatalChartPage?.aspectsDetails?.noAspectsFound || "No significant aspects found in this chart."}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
        {aspectsDetails.map((aspect, index) => (
          <AccordionItem key={index} value={`aspect-${index}`}>
            <AccordionTrigger className="flex justify-between items-center px-4 py-3 bg-card hover:bg-card/80 transition-colors rounded-md mb-2">
              <div className="flex items-center space-x-2">
                <AstrologicalSymbol symbol={aspect.body1} />
                <AstrologicalSymbol symbol={aspect.type} />
                <AstrologicalSymbol symbol={aspect.body2} />
                <span className="ml-2 font-medium">
                  {/* You might want to translate aspect.type here if it's not symbols */}
                  {`${aspect.body1} ${aspect.type} ${aspect.body2}`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{`${aspect.degree.toFixed(1)}°`}</div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-foreground/80 bg-card-foreground/10 rounded-md mt-1">
              {aspect.explanation}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NatalChartAspectsView;