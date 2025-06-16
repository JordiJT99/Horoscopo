
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface HoroscopeCategoryCardProps {
  dictionary: Dictionary;
  titleKey: string;
  icon: React.ElementType;
  content: string | undefined | null;
  progressValue?: number; // Made optional
  isLoading: boolean;
}

const HoroscopeCategoryCard = ({
  dictionary,
  titleKey,
  icon: Icon,
  content,
  progressValue, // Now optional
  isLoading,
}: HoroscopeCategoryCardProps) => (
  <Card className="shadow-lg bg-card/80 hover:shadow-primary/30 transition-shadow duration-300 backdrop-blur-sm rounded-xl">
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-center mb-1.5 sm:mb-2">
        <div className="bg-primary/10 p-1.5 rounded-full mr-2 sm:mr-3">
          <Icon className="h-4 w-4 sm:h-5 sm:h-5 text-primary" />
        </div>
        <CardTitle className="text-sm sm:text-base font-semibold font-headline text-foreground">{dictionary[titleKey]}</CardTitle>
      </div>
      {isLoading && progressValue !== undefined ? <Skeleton className="h-1.5 w-1/4 mb-1.5" /> : 
       progressValue !== undefined && <Progress value={progressValue} className="h-1.5 sm:h-2 w-full mb-1.5 sm:mb-2 bg-muted/50" indicatorClassName="bg-gradient-to-r from-primary to-purple-500" />
      }
      {isLoading ? <Skeleton className="h-10 w-full" /> : <p className="text-xs sm:text-sm font-body text-card-foreground/80 leading-relaxed line-clamp-none">{content || (dictionary['HoroscopeSection.noData'] || "No data available.")}</p>}
    </CardContent>
  </Card>
);

export default HoroscopeCategoryCard;
