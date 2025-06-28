
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Star } from 'lucide-react';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface CosmicEnergyBarProps {
  dictionary: Dictionary;
}

export default function CosmicEnergyBar({ dictionary }: CosmicEnergyBarProps) {
  const { level, points, pointsForNextLevel, progress, addDebugPoints } = useCosmicEnergy();
  const { toast } = useToast();

  const handleDevClick = () => {
    const { pointsAdded, leveledUp, newLevel } = addDebugPoints(100);
    if (leveledUp) {
      toast({
        title: `🎉 ${dictionary['CosmicEnergy.levelUpTitle'] || 'Level Up!'}`,
        description: `${(dictionary['CosmicEnergy.levelUpDescription'] || 'You have reached Level {level}!').replace('{level}', newLevel.toString())}`,
      });
    } else {
      toast({
        title: `✨ ${dictionary['CosmicEnergy.pointsEarnedTitle'] || 'Cosmic Energy Gained!'}`,
        description: `+${pointsAdded} EC (Dev)`,
      });
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="p-4 pb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle
                className="text-lg flex items-center gap-2 cursor-pointer"
                onClick={handleDevClick}
                role="button"
                aria-label="Add 100 debug points"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                {dictionary['ProfilePage.cosmicEnergyTitle'] || "Cosmic Energy"}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dev Tool: Click to add 100 EC</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription className="text-xs">
          {dictionary['ProfilePage.cosmicEnergyDescription'] || "Gain points by interacting with the app."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-base">
              {dictionary['ProfilePage.levelLabel'] || "Level"} {level}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {points.toLocaleString()} / {pointsForNextLevel.toLocaleString()} EC
          </span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </CardContent>
    </Card>
  );
}
