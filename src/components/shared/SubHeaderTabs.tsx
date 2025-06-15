
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
    <div className="bg-sub-header-background shadow-md sticky top-16 z-40"> {/* Adjusted sticky top based on new header height h-16 (4rem) */}
      <div className="container mx-auto px-0 sm:px-1">
        <div className="flex justify-start items-center overflow-x-auto whitespace-nowrap no-scrollbar py-1"> {/* Added no-scrollbar */}
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-md py-2.5 px-6 text-sm font-semibold transition-colors duration-150 ease-in-out flex-shrink-0", // Increased padding and font size
                "hover:bg-sub-header-tab-active-background/20",
                activeTab === tab.id
                  ? "bg-sub-header-tab-active-background text-sub-header-tab-active-foreground shadow-sm"
                  : "text-sub-header-tab-inactive-foreground bg-transparent hover:bg-secondary/30" // Ensure inactive tabs have distinct bg on hover
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
