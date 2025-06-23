
'use client';

import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect } from 'react';
import { natalChartFlow, type NatalChartOutput } from '@/ai/flows/natal-chart-flow';
import { natalChartImageFlow } from '@/ai/flows/natal-chart-image-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import NatalChartWheel from './NatalChartWheel';
import NatalChartAspectsView from './NatalChartAspectsView';
import type { AuthUser } from '@/types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
export type NatalChartTab = 'chart' | 'aspects' | 'details';

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
    const symbols: Record<string, string> = {
      'Sol': '☉',
      'Luna': '☽',
      'Ascendente': '↑',
      'Planetas Personales': '☿',
      'Planetas Transpersonales': '♆',
      'Casas': '⌂',
    };

    const clean = title.toLowerCase();
    if (clean.includes('sol')) return '☉';
    if (clean.includes('luna')) return '☽';
    if (clean.includes('ascendente')) return '↑';
    if (clean.includes('personal')) return '☿';
    if (clean.includes('transpersonal')) return '♆';
    if (clean.includes('casa')) return '⌂';

    return '✦';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative p-6 sm:p-8 my-8 rounded-2xl bg-gradient-to-b from-background/70 to-background/40 border border-primary/30 shadow-[0_0_20px_rgba(100,100,255,0.08)] backdrop-blur-xl"
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
  const [activeTab, setActiveTab] = useState<NatalChartTab>('chart');
  const [explanations, setExplanations] = useState<NatalChartOutput | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🧪 birthData en useEffect:', birthData);

    const fetchExplanations = async () => {
      console.log('🧪 Ejecutando fetchExplanations con:', {
        date: birthData?.date,
        time: birthData?.time,
        city: birthData?.city,
        country: birthData?.country,
      });
      setIsLoading(true);
  
      const birthDataString = JSON.stringify(birthData);
      const cacheKey = user ? `natalChart_${user.uid}_${birthDataString}_${detailLevel}` : null;
  
      if (cacheKey) {
        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setExplanations(parsedData);
                setImageUrl(parsedData.imageUrl); // Assuming imageUrl is saved in the cached object
                setIsLoading(false);
                console.log("Loaded natal chart from cache.");
                return; // Exit if loaded from cache
            }
        } catch(e) {
            console.error("Failed to parse cached data, fetching new data.", e);
            localStorage.removeItem(cacheKey); // Remove corrupted data
        }
      }
  
      console.log("Fetching new natal chart data...");
      try {
        const commonInput = {
          detailLevel,
          locale: dictionary.locale || 'es',
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthCity: birthData.city,
          birthCountry: birthData.country,
        };
        console.log('🧪 Enviando a natalChartFlow:', commonInput);

        // Run both flows in parallel
        const [textResult, imageResult] = await Promise.all([
          natalChartFlow(commonInput),
          natalChartImageFlow(commonInput),
        ]);
        console.log('✅ textResult:', textResult);
        console.log('✅ imageResult:', imageResult);
     
  
        if (textResult && imageResult?.imageUrl) {
          const fullResult = { ...textResult, imageUrl: imageResult.imageUrl };
  
          setExplanations(fullResult);
          setImageUrl(imageResult.imageUrl);
  
          if (cacheKey) {
            localStorage.setItem(cacheKey, JSON.stringify(fullResult));
            console.log("Saved natal chart to cache.");
          }
        } else {
          throw new Error("Received null or undefined result from AI flow(s).");
        }
      } catch (error: any) {
        console.error('Failed to fetch natal chart data:', error);
        toast({
          title: dictionary['Error.genericTitle'] || 'Error',
          description: 'No se pudo cargar la carta astral. Intenta nuevamente.',
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


  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.download = 'natal-chart.png';
    link.href = imageUrl;
    link.click();
  };

  const explanationSections = [
    { title: sunTitle, content: explanations?.sun },
    { title: moonTitle, content: explanations?.moon },
    { title: ascendantTitle, content: explanations?.ascendant },
    { title: personalPlanetsTitle, content: explanations?.personalPlanets },
    { title: transpersonalPlanetsTitle, content: explanations?.transpersonalPlanets },
    { title: housesTitle, content: explanations?.houses },
    { title: aspectsTitle, content: explanations?.aspects },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título principal */}
      <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-primary text-center mb-4">
        {title}
      </h2>

      {/* Selector de nivel de detalle */}
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
      
      {/* Pestañas de Navegación */}
      <div className="flex justify-center mb-6 space-x-4">
         <Button variant={activeTab === 'chart' ? 'default' : 'ghost'} onClick={() => setActiveTab('chart')}>
          {dictionary.NatalChartPage?.chartTab}
        </Button>
        <Button variant={activeTab === 'aspects' ? 'default' : 'ghost'} onClick={() => setActiveTab('aspects')}>
          {dictionary.NatalChartPage?.aspectsTab}
        </Button>
        <Button variant={activeTab === 'details' ? 'default' : 'ghost'} onClick={() => setActiveTab('details')}>
          {dictionary.NatalChartPage?.detailsTab}  
        </Button>
      </div>

      {/* Contenido de la Pestaña de la Carta */}
      {activeTab === 'chart' && (
         <div className="my-8 flex flex-col items-center">
          {isLoading || !explanations || !imageUrl ? (
            <div className="w-[400px] h-[400px] flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          ) : (
            explanations.planetPositions && (
              <>
                <NatalChartWheel planetPositions={explanations.planetPositions} imageDataUrl={imageUrl} />
                {imageUrl && (
                  <Button onClick={handleDownload} className="mt-4">
                    Descargar imagen
                  </Button>
                )}
              </>
            )
          )}
        </div>
      )}

      {/* Contenido de la Pestaña de Aspectos */}
      {activeTab === 'aspects' && explanations?.aspectsDetails && (
        <NatalChartAspectsView aspectsDetails={explanations.aspectsDetails} dictionary={dictionary} />
      )}

      {/* Contenido de la Pestaña de Detalles */}
      {activeTab === 'details' && (
        <div className="space-y-6 py-4">
          {explanationSections.map((section, index) => (
            <SectionExplanation
              key={index}
              title={section.title}
              content={section.content}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Mensaje de desarrollo */}
      <p className="text-center mt-8 text-sm text-muted-foreground">
        {underDevelopmentMessage}
      </p>
    </div>
  );
}