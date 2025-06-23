
'use client';

import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect } from 'react';
// Import both flows
import { natalChartFlow, type NatalChartOutput } from '@/ai/flows/natal-chart-flow';
import { natalChartImageFlow } from '@/ai/flows/natal-chart-image-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import NatalChartWheel from './NatalChartWheel';
import { Button } from '@/components/ui/button';
import NatalChartAspectsView from './NatalChartAspectsView'; // Import the new component
import type { AuthUser } from '@/types';

interface BirthData {
  date: string;
  time: string;
  city: string;
  country: string;
}

interface NatalChartClientContentProps {
  dictionary: Dictionary;
  birthData: BirthData;
  user: AuthUser | null;
}

type DetailLevel = 'basic' | 'advanced' | 'spiritual';
type ActiveTab = 'chart' | 'aspects' | 'details'; // Define active tabs

const SectionExplanation = ({ title, content, isLoading }: { title: string, content?: string, isLoading: boolean }) => (
  <div className="mt-8">
    <h3 className="text-2xl font-headline font-semibold text-primary mb-2">{title}</h3>
    {isLoading ? (
      <div className="space-y-2 mt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ) : (
      <p className="mt-2 text-foreground/80 whitespace-pre-line">{content || ''}</p>
    )}
  </div>
);

export default function NatalChartClientContent({ dictionary, birthData, user }: NatalChartClientContentProps) {
  const {
    title,
    underDevelopmentMessage,
    detailLevel: detailLevelDict,
    sunTitle,
    moonTitle,
    ascendantTitle,
    personalPlanetsTitle,
    transpersonalPlanetsTitle,
    housesTitle,
    aspectsTitle,
  } = dictionary.NatalChartPage;

  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chart'); // State for active tab
  const [explanations, setExplanations] = useState<NatalChartOutput | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for the image
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExplanations = async () => {
      setIsLoading(true);
      
      const birthDataString = JSON.stringify(birthData);
      const cacheKey = user ? `natalChart_${user.uid}_${birthDataString}` : null;

      if (cacheKey) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setExplanations(parsedData);
          setImageUrl(parsedData.imageUrl);
          setIsLoading(false);
          return;
        }
      }
      
      try {
        const commonInput = {
          detailLevel,
          locale: dictionary.locale || 'es',
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthCity: birthData.city,
          birthCountry: birthData.country,
        };

        const [textResult, imageResult] = await Promise.all([
          natalChartFlow(commonInput),
          natalChartImageFlow(commonInput)
        ]);
        
        const fullResult = { ...textResult, imageUrl: imageResult.imageUrl };

        setExplanations(fullResult);
        setImageUrl(imageResult.imageUrl);
        
        if (cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(fullResult));
        }

      } catch (error) {
        console.error('Failed to fetch natal chart data:', error);
        toast({
          title: dictionary['Error.genericTitle'] || 'Error',
          description: 'Could not load astrological data. Please try again.',
          variant: 'destructive',
        });
        setExplanations(null);
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExplanations();
    
  }, [detailLevel, birthData, dictionary, toast, user]);
  
  // Filter explanations based on the active tab
  const explanationSections = [
    { title: sunTitle, content: explanations?.sun },
    { title: moonTitle, content: explanations?.moon },
    { title: ascendantTitle, content: explanations?.ascendant },
    { title: personalPlanetsTitle, content: explanations?.personalPlanets },
    { title: transpersonalPlanetsTitle, content: explanations?.transpersonalPlanets },
    { title: housesTitle, content: explanations?.houses }, // Houses are part of 'Details'
  ];

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.download = 'natal-chart.png';
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-primary text-center mb-4">{title}</h2>

      {/* Tab Navigation */}
      {/* Detail Level Selector */}
      <div className="flex justify-center mt-4 mb-8">
        <label htmlFor="detailLevel" className="mr-2 self-center">
          {detailLevelDict?.label || 'Detail Level'}:
        </label>
        <select
          id="detailLevel"
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
          className="bg-card text-card-foreground border border-input rounded-md px-2 py-1 focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <option value="basic">{detailLevelDict.basic}</option>
          <option value="advanced">{detailLevelDict.advanced}</option>
          <option value="spiritual">{detailLevelDict.spiritual}</option>
        </select>
      </div>

      {/* Zodiac Wheel & AI Generated Image */}
      <div className="my-8 flex flex-col items-center">
        {isLoading || !explanations || !imageUrl ? (
          <div className="w-[400px] h-[400px] flex items-center justify-center">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        ) : (
          explanations.planetPositions && (
            <>
              <NatalChartWheel
                planetPositions={explanations.planetPositions}
                imageDataUrl={imageUrl}
              />
              {imageUrl && (
                <Button onClick={handleDownload} className="mt-4">
                  Descargar imagen
                </Button>
              )}
            </>
          )
        )}
      </div>
      
      {/* Section Explanations */}
      {explanationSections.map((section, index) => (
        <SectionExplanation
          key={index}
          title={section.title}
          content={section.content}
          isLoading={isLoading}
        />
      ))}

      <p className="text-center mt-8 text-sm text-muted-foreground">
        {underDevelopmentMessage}
      </p>
    </div>
  );
}
