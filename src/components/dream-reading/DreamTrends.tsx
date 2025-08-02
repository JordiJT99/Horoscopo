'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/types';
import type { StoredDream } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DreamTrendsProps {
  dictionary: Dictionary;
  newDreamTrigger: number; // A prop to trigger re-calculation when a new dream is added
}

const DreamTrends = ({ dictionary, newDreamTrigger }: DreamTrendsProps) => {
  const [trendingSymbols, setTrendingSymbols] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedDreamsRaw = localStorage.getItem('dreamJournal');
      if (!storedDreamsRaw) return;

      const storedDreams: StoredDream[] = JSON.parse(storedDreamsRaw);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const recentDreams = storedDreams.filter(dream => new Date(dream.timestamp) > oneMonthAgo);

      const symbolCounts: { [key: string]: number } = {};
      recentDreams.forEach(dream => {
        dream.interpretation.dreamElements.symbols?.forEach(symbol => {
          const normalizedSymbol = symbol.toLowerCase().trim();
          if (normalizedSymbol) { // Avoid counting empty strings
             symbolCounts[normalizedSymbol] = (symbolCounts[normalizedSymbol] || 0) + 1;
          }
        });
      });

      const trends = Object.keys(symbolCounts).filter(symbol => symbolCounts[symbol] >= 3);
      setTrendingSymbols(trends);

    } catch (error) {
      console.error("Failed to parse or process dream journal from localStorage", error);
    }
  }, [newDreamTrigger]); // Re-run when a new dream is added

  if (trendingSymbols.length === 0) {
    return (
        <Card className="w-full bg-secondary/20 p-4 sm:p-6 rounded-lg shadow mt-4">
            <CardHeader className="p-0 pb-3 md:pb-4 text-center">
                <CardTitle className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    {dictionary['DreamTrends.title'] || "Trends in Your Dreams"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-center">
                <p className="text-sm text-muted-foreground">
                    {dictionary['DreamTrends.noTrends'] || "No recurring trends yet. Keep logging your dreams to uncover patterns!"}
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full bg-secondary/20 p-4 sm:p-6 rounded-lg shadow mt-4">
      <CardHeader className="p-0 pb-3 md:pb-4 text-center">
        <CardTitle className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            {dictionary['DreamTrends.title'] || "Trends in Your Dreams"}
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-1">{dictionary['DreamTrends.description'] || "Symbols appearing frequently in your dreams this month."}</p>
      </CardHeader>
      <CardContent className="p-0 flex flex-wrap justify-center gap-2">
        {trendingSymbols.map((symbol, index) => (
          <Badge key={index} variant="default" className="text-base font-medium capitalize">
            {symbol}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default DreamTrends;
