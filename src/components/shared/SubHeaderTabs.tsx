
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type HoroscopePeriod = 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly';

interface SubHeaderTabsProps {
  dictionary: Dictionary;
  activeTab: HoroscopePeriod;
  onTabChange: (tab: HoroscopePeriod) => void;
}

const SubHeaderTabs = ({ dictionary, activeTab, onTabChange }: SubHeaderTabsProps) => {
  const { } = useCosmicEnergy();
  const isPremium = true; // All users have premium access now
  const { toast } = useToast();
  
  const tabs: { id: HoroscopePeriod; labelKey: string }[] = [
    { id: 'yesterday', labelKey: 'HomePage.yesterdayTab' },
    { id: 'today', labelKey: 'HomePage.todayTab' },
    { id: 'tomorrow', labelKey: 'HomePage.tomorrowTab' },
    { id: 'weekly', labelKey: 'HomePage.weeklyTab' },
    { id: 'monthly', labelKey: 'HomePage.monthlyTab' },
  ];

  const handleTabClick = (tab: HoroscopePeriod) => {
    // Eliminar restricción premium - permitir acceso a todos los tabs
    onTabChange(tab);
  };

  return (
    <div className={cn(
      "sticky top-14 z-30 bg-background/10 backdrop-blur-md border-b border-primary/30 rounded-b-lg",
      "shadow-[0_0_15px_0px_hsl(var(--primary)/0.2)]" 
    )}>
      <div className="container mx-auto px-0 sm:px-1">
        <div className="flex justify-between items-center overflow-x-auto whitespace-nowrap no-scrollbar py-2" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            // Eliminar lógica de bloqueo premium
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "rounded-full py-1.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors duration-150 ease-in-out flex-shrink-0 mx-1.5 sm:mx-2 relative",
                  "bg-transparent", 
                  isActive
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-primary/80"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_2px_hsl(var(--primary)/0.6)]" 
                    layoutId="activeTabPill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{ zIndex: 0 }} 
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }} className="flex items-center gap-1.5">
                  {dictionary[tab.labelKey] || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubHeaderTabs;
