
'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import type { DailyTransit } from '@/types';
import { getDailyTransit } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DailyTransitWidgetProps {
  dictionary: Dictionary;
}

export default function DailyTransitWidget({ dictionary }: DailyTransitWidgetProps) {
  const [transit, setTransit] = useState<DailyTransit | null>(null);

  useEffect(() => {
    const today = new Date();
    setTransit(getDailyTransit(today));
  }, []);

  if (!transit) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardHeader className="p-3">
          <Skeleton className="h-5 w-3/4" />
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { titleKey, descriptionKey, icon: Icon } = transit;
  const translatedTitle = dictionary.DailyTransits?.[titleKey] || titleKey;
  const translatedDescription = dictionary.DailyTransits?.[descriptionKey] || descriptionKey;

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/30 transition-shadow">
      <CardHeader className="flex flex-row items-center gap-2 p-3">
        <Icon className="w-5 h-5 text-primary" />
        <CardTitle className="text-sm font-semibold font-headline">{translatedTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground">{translatedDescription}</p>
      </CardContent>
    </Card>
  );
}
