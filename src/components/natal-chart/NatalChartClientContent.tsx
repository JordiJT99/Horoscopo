
"use client";

import SectionTitle from '@/components/shared/SectionTitle';
import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect } from 'react';
import { natalChartFlow, type NatalChartOutput } from '@/ai/flows/natal-chart-flow';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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

const SectionExplanation = ({ title, content, isLoading }: { title: string, content?: string, isLoading: boolean }) => {
  return (
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
};

export default function NatalChartClientContent({ dictionary, birthData }: NatalChartClientContentProps) {
  const {
    title,
    underDevelopmentMessage,
    detailLevel: detailLevelDict,
    explanations: staticExplanations,
    sunTitle,
    moonTitle,
    ascendantTitle,
    personalPlanetsTitle,
    transpersonalPlanetsTitle,
    housesTitle,
    aspectsTitle
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
          birthCountry: birthData.country
        });
        setExplanations(result);
      } catch (error) {
        console.error("Failed to fetch natal chart explanations:", error);
        toast({
          title: dictionary['Error.genericTitle'] || "Error",
          description: "Could not load astrological explanations. Please try again.",
          variant: "destructive",
        });
        setExplanations(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanations();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title={title} />

      <div className="flex justify-center mt-4">
        <label htmlFor="detailLevel" className="mr-2 self-center">{detailLevelDict?.label || 'Detail Level'}:</label>
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

      {explanationSections.map((section, index) => (
        <SectionExplanation
          key={index}
          title={section.title}
          content={section.content}
          isLoading={isLoading}
        />
      ))}

      <p className="text-center mt-8 text-sm text-muted-foreground">{underDevelopmentMessage}</p>
    </div>
  );
}
