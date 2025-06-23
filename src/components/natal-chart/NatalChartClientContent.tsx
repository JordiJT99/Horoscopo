
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

const SectionExplanation = ({
  title,
  content,
  isLoading,
}: {
  title: string;
  content?: string;
  isLoading: boolean;
}) => (
  <div>
    <h3 className="text-2xl font-headline font-semibold text-primary mb-3">{title}</h3>
    {isLoading ? (
      <div className="space-y-2 mt-2">
        <Skeleton className="h-4 w-full bg-muted/50" />
        <Skeleton className="h-4 w-5/6 bg-muted/50" />
        <Skeleton className="h-4 w-3/4 bg-muted/50" />
      </div>
    ) : (
      <p className="mt-2 text-foreground/90 whitespace-pre-line leading-relaxed sm:text-lg">{content || ''}</p>
    )}
  </div>
);

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
  } = dictionary.NatalChartPage;

  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const [activeTab, setActiveTab] = useState<NatalChartTab>('chart');
  const [explanations, setExplanations] = useState<NatalChartOutput | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExplanations = async () => {
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
  
        // Run both flows in parallel
        const [textResult, imageResult] = await Promise.all([
          natalChartFlow(commonInput),
          natalChartImageFlow(commonInput),
        ]);
  
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


  const explanationSections = [
    { title: sunTitle, content: explanations?.sun },
    { title: moonTitle, content: explanations?.moon },
    { title: ascendantTitle, content: explanations?.ascendant },
    { title: personalPlanetsTitle, content: explanations?.personalPlanets },
    { title: transpersonalPlanetsTitle, content: explanations?.transpersonalPlanets },
    { title: housesTitle, content: explanations?.houses },
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
      <div className="flex justify-center border-b border-border mb-4 space-x-2">
         <Button variant={activeTab === 'chart' ? 'default' : 'ghost'} onClick={() => setActiveTab('chart')}>
          {dictionary.NatalChartPage?.chartTab || 'Chart'}
        </Button>
        <Button variant={activeTab === 'aspects' ? 'default' : 'ghost'} onClick={() => setActiveTab('aspects')}>
          {dictionary.NatalChartPage?.aspectsTab || 'Aspects'}
        </Button>
        <Button variant={activeTab === 'details' ? 'default' : 'ghost'} onClick={() => setActiveTab('details')}>
          {dictionary.NatalChartPage?.detailsTab || 'Details'}
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
        <div className="space-y-8 py-6">
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
