
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import type { HoroscopeDetail } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface Category {
  nameKey: string; 
  percentage: number; 
  dataKey?: keyof HoroscopeDetail; 
}

interface HoroscopeCategoriesSummaryProps {
  dictionary: Dictionary;
  titleKey: string; 
  subtitleKey: string; 
  categories: Category[];
  isLoading: boolean;
  horoscopeDetail: HoroscopeDetail | null; 
}

// Using a single primary color for all progress bars as per the image
const primaryChartColor = 'hsl(var(--primary))';
const progressTrackColor = 'hsl(var(--horoscope-progress-background))';


const SingleRadialChart = ({ percentage, label, color, isLoading }: { percentage: number, label: string, color: string, isLoading: boolean }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimatedPercentage(percentage), 100); // Small delay for animation to be visible
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(0); // Reset on load
    }
  }, [isLoading, percentage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-1.5">
        <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted/50" />
        <Skeleton className="h-4 w-12 bg-muted/50" />
        <Skeleton className="h-5 w-8 bg-muted/50" />
      </div>
    );
  }

  const chartData = [{ name: label, value: animatedPercentage, fill: color }];

  return (
    <div className="flex flex-col items-center text-center w-full mx-auto">
      <div className="w-20 h-20 sm:w-24 sm:h-24"> {/* Increased size */}
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            barSize={7} // Adjusted bar size
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: progressTrackColor }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
              className="transition-all duration-1000 ease-out" // For value animation
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm font-semibold text-foreground mt-1.5">{label}</p> {/* Text in foreground color, bold */}
      <p className="text-base font-bold text-primary">{animatedPercentage}%</p> {/* Percentage in primary color, bold */}
    </div>
  );
};

export default function HoroscopeCategoriesSummary({
  dictionary,
  titleKey,
  subtitleKey,
  categories,
  isLoading,
  horoscopeDetail,
}: HoroscopeCategoriesSummaryProps) {

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/30 rounded-xl shadow-lg my-4">
      <CardHeader className="p-4 pb-2 text-center sm:text-left">
        <CardTitle className="font-headline text-lg font-semibold text-horoscope-summary-title">
          {dictionary[titleKey] || "Essential"}: <span className="text-primary">{dictionary[subtitleKey] || "Summary"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {isLoading && !horoscopeDetail ? (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-radial-${index}`} className="flex flex-col items-center space-y-1.5">
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted/50" />
                <Skeleton className="h-4 w-12 bg-muted/50 mt-1.5" />
                <Skeleton className="h-5 w-8 bg-muted/50" />
              </div>
            ))}
          </div>
        ) : horoscopeDetail ? (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <SingleRadialChart
                key={`${category.nameKey}-${index}`}
                percentage={category.percentage}
                label={dictionary[category.nameKey] || category.nameKey.split('.').pop() || "Category"}
                color={primaryChartColor} // Use the same primary color for all bars
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
             <p className="text-sm text-muted-foreground text-center py-4">{dictionary['HoroscopeSection.noData'] || "No data available."}</p>
        )}
      </CardContent>
    </Card>
  );
}
