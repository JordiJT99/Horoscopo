
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type HoroscopePeriod = 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly';

interface SubHeaderTabsProps {
  dictionary: Dictionary;
  activeTab: HoroscopePeriod;
  onTabChange: (tab: HoroscopePeriod) => void;
}

const SubHeaderTabs = ({ dictionary, activeTab, onTabChange }: SubHeaderTabsProps) => {
  const tabs: { id: HoroscopePeriod; labelKey: string }[] = [
    { id: 'yesterday', labelKey: 'HomePage.yesterdayTab' },
    { id: 'today', labelKey: 'HomePage.todayTab' },
    { id: 'tomorrow', labelKey: 'HomePage.tomorrowTab' },
    { id: 'weekly', labelKey: 'HomePage.weeklyTab' },
    { id: 'monthly', labelKey: 'HomePage.monthlyTab' },
  ];

  return (
    // Removed sticky and shadow, as per new design, tabs are part of main content flow
    <div className="bg-transparent"> 
      <div className="container mx-auto px-0 sm:px-1">
        <div className="flex justify-between items-center overflow-x-auto whitespace-nowrap no-scrollbar py-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-full py-2 px-5 text-sm font-semibold transition-colors duration-150 ease-in-out flex-shrink-0 mx-1",
                "hover:text-primary", // Subtle hover for inactive tabs
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md" // Active tab style from image
                  : "text-muted-foreground bg-transparent" 
              )}
            >
              {dictionary[tab.labelKey] || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubHeaderTabs;
