
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Star, MinusCircle, PlusCircle, Gem, HelpCircle, Crown } from 'lucide-react';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CosmicEnergyBarProps {
  dictionary: Dictionary;
}

export default function CosmicEnergyBar({ dictionary }: CosmicEnergyBarProps) {
  const { level, points, pointsForNextLevel, progress, addDebugPoints, subtractDebugPoints, stardust, addStardust, subtractStardust, lastGained } = useCosmicEnergy();
  const { toast } = useToast();
  const isPremium = true; // All users have premium access now

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

  const handleSubtractStardust = () => {
    subtractStardust(50);
    toast({
        title: `🔧 Dev Tool`,
        description: `-50 Stardust (Dev)`,
    });
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="p-4 pb-2">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {dictionary['ProfilePage.cosmicEnergyTitle'] || "Cosmic Energy"}
                    {isPremium && <Crown className="h-5 w-5 text-yellow-400" title={dictionary['PremiumPage.title'] || 'Premium Member'} />}
                </CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-primary rounded-full">
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                {dictionary['CosmicEnergy.explanationTitle'] || "What is Cosmic Energy? ✨"}
                            </DialogTitle>
                            <DialogDescription className="text-left pt-2 whitespace-pre-line">
                                {dictionary['CosmicEnergy.explanationContent'] || "Cosmic Energy (CE) is a measure of your engagement with the app. It's like your experience points!\n\n**What is it for?**\n- **Level Up:** Accumulating CE allows you to level up your profile.\n- **Unlock Rewards:** Each new level grants you rewards like exclusive avatar frames, profile backgrounds, Stardust, and even free psychic chats.\n\n**How to get it?**\nYou earn CE automatically by using the app's features, such as:\n- Reading your daily, weekly, or monthly horoscopes.\n- Getting a tarot card reading.\n- Consulting the crystal ball.\n- Participating in the community."}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <TooltipProvider>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-500" onClick={handleSubtractStardust}>
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Dev Tool: Subtract 50 Stardust</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-400" onClick={handleAddStardust}>
                                <PlusCircle className="h-4 w-4" />
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
        <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-cyan-400 gap-1">
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
                                {dictionary['Stardust.explanationContent'] || "Stardust is a special currency within AstroVibes. You can use it to unlock premium features, such as sending messages in Psychic Chats.\n\nYou can earn Stardust by:\n- Leveling up your Cosmic Energy.\n- Claiming special rewards (like rating the app).\n- Watching ads.\n- Purchasing Stardust packs (coming soon)."}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            {isPremium && lastGained.daily_stardust_reward === new Date().toISOString().split('T')[0] && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                           <p className="text-xs text-green-400 flex items-center gap-1">✅ {dictionary['Toast.dailyStardustClaimed'] || 'Daily bonus claimed!'}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{dictionary['Toast.dailyStardustDescription'] || 'You received your daily 100 Stardust for being a Premium member.'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
