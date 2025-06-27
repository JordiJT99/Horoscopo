
'use client';

import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect } from 'react';
import { natalChartFlow, type NatalChartOutput } from '@/ai/flows/natal-chart-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import NatalChartWheel from './NatalChartWheel';
import NatalChartAspectsView from './NatalChartAspectsView';
import NatalChartHousesView from './NatalChartHousesView';
import type { AuthUser } from '@/types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

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
export type NatalChartTab = 'chart' | 'aspects' | 'details' | 'houses';

function SectionExplanation({
  title,
  content,
  isLoading,
}: {
  title: string;
  content?: string;
  isLoading: boolean;
}) {
  const getZodiacSymbol = (title: string) => {
    const clean = title.toLowerCase();
    if (clean.includes('sol')) return '☉';
    if (clean.includes('luna')) return '☽';
    if (clean.includes('ascendente')) return '↑';
    if (clean.includes('personal')) return '☿';
    if (clean.includes('transpersonal')) return '♆';
    if (clean.includes('casa')) return '⌂';
    if (clean.includes('aspectos')) return '⚹';
    return '✦';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative p-6 sm:p-8 my-6 rounded-2xl bg-gradient-to-b from-background/70 to-background/40 border border-primary/30 shadow-[0_0_20px_rgba(100,100,255,0.08)] backdrop-blur-xl"
    >
      <div className="absolute top-4 right-4 text-2xl sm:text-3xl text-primary/60 pointer-events-none select-none">
        {getZodiacSymbol(title)}
      </div>
      <h3 className="text-2xl sm:text-3xl font-semibold font-headline text-primary mb-4 tracking-tight">
        {title}
      </h3>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <p className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
          {content || ''}
        </p>
      )}
    </motion.div>
  );
}



export default function NatalChartClientContent({
  dictionary,
  birthData,
  user,
}: NatalChartClientContentProps) {
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
  const [activeTab, setActiveTab] = useState<NatalChartTab>('details');
  const [explanations, setExplanations] = useState<NatalChartOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const staticChartImageUrl = '/custom_assets/natal_chart_bg.png';

  useEffect(() => {
 
    const fetchChartData = async () => {

      setIsLoading(true);
      
      const birthDataString = JSON.stringify(birthData);
      const textCacheKey = user ? `natalChart_text_${user.uid}_${birthDataString}_${detailLevel}` : null;
      let cachedText: NatalChartOutput | null = null;
      
      if (textCacheKey) {
        try {
          const cachedItem = localStorage.getItem(textCacheKey);
          if (cachedItem) {
            cachedText = JSON.parse(cachedItem);
          }
        } catch (e) {
          console.error("Failed to parse cached text data, fetching new data.", e);
          localStorage.removeItem(textCacheKey);
        }
      }

      try {

        let textData: NatalChartOutput;
        if (cachedText) {
          console.log("Loaded natal chart text from cache.");
          textData = cachedText;
        } else {
          const flowInput = {
            detailLevel,
            locale: dictionary.locale || 'es',
            birthDate: birthData.date,
            birthTime: birthData.time,
            birthCity: birthData.city,
            birthCountry: birthData.country,
          };
          textData = await natalChartFlow(flowInput);
          if (textCacheKey) {
            localStorage.setItem(textCacheKey, JSON.stringify(textData));
            console.log("Saved natal chart text data to cache.");

          }
        }
        
        if (textData) {
          setExplanations(textData);
        } else {
          throw new Error("Received null or undefined result from natalChartFlow.");
        }
      } catch (error: any) {
        console.error('Failed to fetch natal chart data:', error);
        toast({
          title: dictionary['Error.genericTitle'] || 'Error',
          description: 'No se pudo cargar la carta astral. Intenta nuevamente.',
          variant: 'destructive',
        });
        setExplanations(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchChartData();
  }, [detailLevel, birthData, dictionary, toast, user]);


  const detailExplanationSections = [
    { title: sunTitle, content: explanations?.sun },
    { title: moonTitle, content: explanations?.moon },
    { title: ascendantTitle, content: explanations?.ascendant },
    { title: personalPlanetsTitle, content: explanations?.personalPlanets },
    { title: transpersonalPlanetsTitle, content: explanations?.transpersonalPlanets },
    { title: aspectsTitle, content: explanations?.aspects },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-primary text-center mb-4">
        {title}
      </h2>

      <div className="flex justify-center mt-4 mb-8">
        <label htmlFor="detailLevel" className="mr-2 self-center">
          {detailLevelDict?.label || 'Nivel de detalle'}:
        </label>
        <select
          id="detailLevel"
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
          className="bg-card text-card-foreground border border-input rounded-md px-2 py-1 focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <option value="basic">{detailLevelDict?.basic}</option>
          <option value="advanced">{detailLevelDict?.advanced}</option>
          <option value="spiritual">{detailLevelDict?.spiritual}</option>
        </select>
      </div>

      {/* Unconditional Chart Wheel rendering */}
      <div className="my-8 flex flex-col items-center">
        {isLoading || !explanations ? (
          <div className="w-[360px] h-[360px] flex items-center justify-center">
            <LoadingSpinner className="w-16 h-16 text-primary" />
          </div>
        ) : (
          explanations.planetPositions && (
            <NatalChartWheel 
              planetPositions={explanations.planetPositions} 
              aspects={explanations.aspectsDetails || []}
              imageDataUrl={staticChartImageUrl} 
            />
          )
        )}
      </div>
      
      <div className="flex justify-center mb-6 space-x-2 sm:space-x-4 flex-wrap">
         <Button variant={activeTab === 'details' ? 'default' : 'ghost'} onClick={() => setActiveTab('details')}>
          {dictionary.NatalChartPage?.detailsTab || 'Details'}
        </Button>
        <Button variant={activeTab === 'aspects' ? 'default' : 'ghost'} onClick={() => setActiveTab('aspects')}>
          {dictionary.NatalChartPage?.aspectsTab || 'Aspects'}
        </Button>
        <Button variant={activeTab === 'houses' ? 'default' : 'ghost'} onClick={() => setActiveTab('houses')}>
          {dictionary.NatalChartPage?.housesTab || 'Houses'}
        </Button>
      </div>

      {activeTab === 'aspects' && explanations?.aspectsDetails && (
        <NatalChartAspectsView aspectsDetails={explanations.aspectsDetails} dictionary={dictionary} />
      )}

      {activeTab === 'houses' && explanations?.housesDetails && (
        <div className="space-y-4 py-4">
          <SectionExplanation
            title={housesTitle}
            content={explanations?.housesIntroduction}
            isLoading={isLoading}
          />
          <NatalChartHousesView 
            housesDetails={explanations.housesDetails}
            dictionary={dictionary}
          />
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6 py-4">
          {detailExplanationSections.map((section, index) => (
            <SectionExplanation
              key={index}
              title={section.title}
              content={section.content}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      <p className="text-center mt-8 text-sm text-muted-foreground">
        {underDevelopmentMessage}
      </p>
    </div>
  );
}