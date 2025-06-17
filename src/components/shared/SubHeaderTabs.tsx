
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Import for layoutId animation

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
    <div className="sticky top-14 z-30 bg-background/90 backdrop-blur-sm shadow-sm"> {/* h-14 is default TopBar height */}
      <div className="container mx-auto px-0 sm:px-1">
        <div className="flex justify-between items-center overflow-x-auto whitespace-nowrap no-scrollbar py-2" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                role="tab"
                aria-selected={isActive.toString()}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "rounded-none py-2 px-4 sm:px-5 text-xs sm:text-sm font-semibold transition-colors duration-150 ease-in-out flex-shrink-0 mx-1 relative",
                  "bg-transparent", // Common background for all
                  isActive
                    ? "text-primary" // Active tab text color
                    : "text-muted-foreground hover:text-primary/80" 
                )}
              >
                {dictionary[tab.labelKey] || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
                {isActive && (
                  <motion.div
                    className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary" // Adjust bottom to align with button padding if needed
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubHeaderTabs;
