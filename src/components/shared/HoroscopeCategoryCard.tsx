
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // Progress is not used here directly anymore
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface HoroscopeCategoryCardProps {
  dictionary: Dictionary;
  titleKey: string;
  icon: React.ElementType;
  content: string | undefined | null;
  isLoading: boolean;
}

const HoroscopeCategoryCard = ({
  dictionary,
  titleKey,
  icon: Icon,
  content,
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
      {isLoading ? (
        <div className="space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ) : (
        <p className={cn(
            "text-sm font-body text-primary/60 leading-relaxed line-clamp-none tracking-tight",
            "sm:text-sm" // ensures sm overrides text-sm if needed, but text-sm is fine.
          )}>
            {content || (dictionary['HoroscopeSection.noData'] || "No data available.")}
        </p>
      )}
    </CardContent>
  </Card>
);

export default HoroscopeCategoryCard;
