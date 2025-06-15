
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubHeaderTabsProps {
  dictionary: Dictionary;
  activeTab: 'yesterday' | 'today' | 'tomorrow';
  onTabChange: (tab: 'yesterday' | 'today' | 'tomorrow') => void;
}

const SubHeaderTabs = ({ dictionary, activeTab, onTabChange }: SubHeaderTabsProps) => {
  const tabs = [
    { id: 'yesterday' as const, labelKey: 'HomePage.yesterdayTab' },
    { id: 'today' as const, labelKey: 'HomePage.todayTab' },
    { id: 'tomorrow' as const, labelKey: 'HomePage.tomorrowTab' },
  ];

  return (
    <div className="bg-sub-header-background shadow-md">
      <div className="container mx-auto flex justify-center items-center px-2 sm:px-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 rounded-none py-3 text-sm sm:text-base font-medium transition-colors duration-150 ease-in-out",
              "hover:bg-sub-header-tab-active-background/20",
              activeTab === tab.id
                ? "bg-sub-header-tab-active-background text-sub-header-tab-active-foreground shadow-inner"
                : "text-sub-header-tab-inactive-foreground"
            )}
          >
            {dictionary[tab.labelKey] || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SubHeaderTabs;
