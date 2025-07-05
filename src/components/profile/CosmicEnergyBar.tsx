
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Star, MinusCircle, PlusCircle, Gem, HelpCircle } from 'lucide-react';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CosmicEnergyBarProps {
  dictionary: Dictionary;
}

export default function CosmicEnergyBar({ dictionary }: CosmicEnergyBarProps) {
  const { level, points, pointsForNextLevel, progress, addDebugPoints, subtractDebugPoints, stardust, addStardust } = useCosmicEnergy();
  const { toast } = useToast();

  const handleAddPoints = () => {
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

  const handleSubtractPoints = () => {
    subtractDebugPoints(100);
    toast({
      title: `🔧 Dev Tool`,
      description: `-100 EC (Dev)`,
    });
  };

  const handleAddStardust = () => {
    addStardust(50);
    toast({
        title: `🔧 Dev Tool`,
        description: `+50 Stardust (Dev)`,
    });
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="p-4 pb-2">
         <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {dictionary['ProfilePage.cosmicEnergyTitle'] || "Cosmic Energy"}
            </CardTitle>
            <TooltipProvider>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSubtractPoints}>
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Dev Tool: Subtract 100 EC</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAddPoints}>
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Dev Tool: Add 100 EC</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-400" onClick={handleAddStardust}>
                                <Gem className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Dev Tool: Add 50 Stardust</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
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
        <div className="flex justify-end items-center mt-2 text-cyan-400 gap-1">
            <Gem className="w-3.5 h-3.5 mr-1" />
            <span className="font-semibold text-sm">{stardust.toLocaleString()} {dictionary['CosmicEnergy.stardust'] || 'Stardust'}</span>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-primary rounded-full">
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Gem className="h-5 w-5 text-cyan-400" />
                            {dictionary['Stardust.explanationTitle'] || "What is Stardust? 💫"}
                        </DialogTitle>
                        <DialogDescription className="text-left pt-2 whitespace-pre-line">
                            {dictionary['Stardust.explanationContent'] || "Stardust is a special currency..."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
