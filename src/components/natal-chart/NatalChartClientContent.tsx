'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect } from 'react';
import { natalChartFlow, type NatalChartOutput } from '@/ai/flows/natal-chart-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import NatalChartWheel from './NatalChartWheel';
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
}

type DetailLevel = 'basic' | 'advanced' | 'spiritual';

const SectionExplanation = ({ title, content, isLoading }: { title: string, content?: string, isLoading: boolean }) => (
  <div className="mt-8">
    <SectionTitle title={title} />
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

export default function NatalChartClientContent({ dictionary, birthData }: NatalChartClientContentProps) {
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
  const [explanations, setExplanations] = useState<NatalChartOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExplanations = async () => {
      setIsLoading(true);
      try {
        const result = await natalChartFlow({
          detailLevel,
          locale: dictionary.locale || 'es',
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthCity: birthData.city,
          birthCountry: birthData.country,
        });
        setExplanations(result);
      } catch (error) {
        console.error('Failed to fetch natal chart explanations:', error);
        toast({
          title: dictionary['Error.genericTitle'] || 'Error',
          description: 'Could not load astrological explanations. Please try again.',
          variant: 'destructive',
        });
        setExplanations(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (birthData.date && birthData.time && birthData.city && birthData.country) {
      fetchExplanations();
    }
  }, [detailLevel, birthData, dictionary, toast]);

  const explanationSections = [
    { title: sunTitle, content: explanations?.sun },
    { title: moonTitle, content: explanations?.moon },
    { title: ascendantTitle, content: explanations?.ascendant },
    { title: personalPlanetsTitle, content: explanations?.personalPlanets },
    { title: transpersonalPlanetsTitle, content: explanations?.transpersonalPlanets },
    { title: housesTitle, content: explanations?.houses },
    { title: aspectsTitle, content: explanations?.aspects },
  ];

  const handleDownload = () => {
    if (!explanations?.image) return;

    const link = document.createElement('a');
    link.download = 'natal-chart.png';
    link.href = explanations.image.url
      ? explanations.image.url
      : `data:image/png;base64,${explanations.image.base64}`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title={title} />

      {/* Selector de nivel de detalle */}
      <div className="flex justify-center mt-4 mb-6">
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

      {/* Rueda zodiacal */}
      {explanations?.planetPositions && (
        <div className="my-8 flex justify-center">
          <NatalChartWheel planetPositions={explanations.planetPositions} />
        </div>
      )}

      {/* Imagen generada por IA */}
      {isLoading && (
        <div className="my-8 flex justify-center">
          <Skeleton className="w-[400px] h-[400px] rounded-full" />
        </div>
      )}

      {explanations?.image && !isLoading && (
        <div className="my-8 flex flex-col items-center">
          <img
            src={
              explanations.image.url
                ? explanations.image.url
                : `data:image/png;base64,${explanations.image.base64}`
            }
            alt={explanations.image.alt || 'Carta Natal Generada'}
            className="max-w-full h-auto rounded-md border border-muted"
          />
          <Button onClick={handleDownload} className="mt-4">
            Descargar imagen
          </Button>
        </div>
      )}

      {/* Explicaciones de cada sección */}
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
