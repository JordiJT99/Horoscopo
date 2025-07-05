
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
  icon: React.ElementType; // Added icon property
}

interface HoroscopeCategoriesSummaryProps {
  dictionary: Dictionary;
  titleKey: string; 
  subtitleKey: string; 
  categories: Category[];
  isLoading: boolean;
  horoscopeDetail: HoroscopeDetail | null; 
}

const primaryChartColor = 'hsl(var(--primary))';
const progressTrackColor = 'hsl(var(--horoscope-progress-background))';


const SingleRadialChart = ({
  percentage,
  label,
  icon: Icon, // Accept icon prop
  color,
  isLoading,
}: {
  percentage: number;
  label: string;
  icon: React.ElementType; // Define icon prop type
  color: string;
  isLoading: boolean;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(0);
    }
  }, [isLoading, percentage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-1.5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <Skeleton className="absolute inset-0 rounded-full bg-muted/50" />
        </div>
        <Skeleton className="h-4 w-12 bg-muted/50" />
        <Skeleton className="h-5 w-8 bg-muted/50" />
      </div>
    );
  }

  const chartData = [{ name: label, value: animatedPercentage, fill: color }];

  return (
    <div className="flex flex-col items-center text-center w-full mx-auto">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%" // Adjust to make space for icon if needed, or keep larger if icon is small
            outerRadius="100%"
            barSize={8} // Adjust bar thickness
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
              className="transition-all duration-1000 ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Icon superpuesto */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-80" />
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground mt-1.5">{label}</p>
      <p className="text-base font-bold text-primary">{animatedPercentage}%</p>
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

  const activeCategories = categories.filter(cat => cat.dataKey !== 'money');

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
                 <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Skeleton className="absolute inset-0 rounded-full bg-muted/50" />
                 </div>
                <Skeleton className="h-4 w-12 bg-muted/50 mt-1.5" />
                <Skeleton className="h-5 w-8 bg-muted/50" />
              </div>
            ))}
          </div>
        ) : horoscopeDetail ? (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-3 sm:gap-4">
            {activeCategories.map((category, index) => (
              <SingleRadialChart
                key={`${category.nameKey}-${index}`}
                percentage={category.percentage}
                label={dictionary[category.nameKey] || category.nameKey.split('.').pop() || "Category"}
                icon={category.icon} // Pass the icon component
                color={primaryChartColor}
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
