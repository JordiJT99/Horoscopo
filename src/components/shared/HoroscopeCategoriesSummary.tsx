
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import type { HoroscopeDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Category {
  nameKey: string; // e.g., "HoroscopeSummary.love"
  percentage: number; // The percentage shown in the image (80, 60, 40)
  dataKey?: keyof HoroscopeDetail; // To map to actual horoscope data if needed later (love, money, health)
}

interface HoroscopeCategoriesSummaryProps {
  dictionary: Dictionary;
  titleKey: string; // e.g., "HoroscopeSummary.essentialToday"
  subtitleKey: string; // e.g., "HoroscopeSummary.relations"
  categories: Category[];
  isLoading: boolean;
  horoscopeDetail: HoroscopeDetail | null; // Actual horoscope data for text
}

export default function HoroscopeCategoriesSummary({
  dictionary,
  titleKey,
  subtitleKey,
  categories,
  isLoading,
  horoscopeDetail,
}: HoroscopeCategoriesSummaryProps) {
  const [animatedProgressValues, setAnimatedProgressValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isLoading && categories.length > 0) {
      // Initial state for animation (e.g., start from 0 or a small value)
      const initialValues: Record<string, number> = {};
      categories.forEach(category => {
        initialValues[category.nameKey] = 5; // Start animation from 5%
      });
      setAnimatedProgressValues(initialValues);

      // Trigger actual values after a short delay to allow CSS transition
      const timer = setTimeout(() => {
        const finalValues: Record<string, number> = {};
        categories.forEach(category => {
          finalValues[category.nameKey] = category.percentage;
        });
        setAnimatedProgressValues(finalValues);
      }, 100); // Small delay for animation to kick in

      return () => clearTimeout(timer);
    } else if (isLoading) {
      // Reset when loading starts
      setAnimatedProgressValues({});
    }
  }, [isLoading, categories]);

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/30 rounded-xl shadow-lg my-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-lg font-semibold text-horoscope-summary-title">
          {dictionary[titleKey] || "Essential"}: <span className="text-primary">{dictionary[subtitleKey] || "Summary"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-4 w-1/4 bg-muted/50" />
              <Skeleton className="h-2 w-full bg-muted/50" />
              <Skeleton className="h-3 w-1/5 bg-muted/50" />
            </div>
          ))
        ) : (
          categories.map((category, index) => (
            <div key={index} className="space-y-1">
              <h4 className="text-sm font-semibold text-horoscope-category-text">
                {dictionary[category.nameKey] || category.nameKey.split('.').pop()}
              </h4>
              <Progress
                value={animatedProgressValues[category.nameKey] || category.percentage}
                className="h-1.5 bg-horoscope-progress-background"
                indicatorClassName="bg-horoscope-progress-indicator progress-indicator-animate"
              />
              <p className="text-xs text-muted-foreground">{category.percentage}%</p>
            </div>
          ))
        )}
        {!isLoading && !horoscopeDetail && (
             <p className="text-sm text-muted-foreground text-center py-4">{dictionary['HoroscopeSection.noData'] || "No data available."}</p>
        )}
      </CardContent>
    </Card>
  );
}
