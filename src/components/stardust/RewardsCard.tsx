

'use client';

import type { Dictionary } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { CheckCircle, Lock, Award, MessageCircle, Sparkles, Star, Palette, Moon, Ticket, Download, Crown, Box, Atom } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StardustIcon } from '@/components/shared/StardustIcon';

interface RewardsCardProps {
  dictionary: Dictionary;
}

const rewards = [
  { level: 1, key: 'baseAccess', icon: Sparkles, stardust: 5 },
  { level: 2, key: 'cometFrame', icon: Palette, stardust: 0 },
  { level: 3, key: 'recurringStardust', icon: StardustIcon, stardust: 3 },
  { level: 4, key: 'gaiaNebulaBackground', icon: Palette, stardust: 0 },
  { level: 5, key: 'freePsychicChat', icon: MessageCircle, stardust: 0 },
  { level: 6, key: 'recurringStardust', icon: StardustIcon, stardust: 3 },
  { level: 7, key: 'stardustBonus', icon: StardustIcon, stardust: 0 },
  { level: 8, key: 'ringOfLightFrame', icon: Palette, stardust: 0 },
  { level: 9, key: 'recurringStardust', icon: StardustIcon, stardust: 3 },
  { level: 10, key: 'enlightenedTitle', icon: Crown, stardust: 0 },
];

export default function RewardsCard({ dictionary }: RewardsCardProps) {
  const { level: currentLevel } = useCosmicEnergy();

  const getRewardDescription = (reward: typeof rewards[0]) => {
    let baseText = dictionary[`Reward.${reward.key}`] || reward.key.replace(/([A-Z])/g, ' $1').trim();
    if (reward.key === 'recurringStardust') {
      return (dictionary['Reward.recurringStardustSimple'] || "+{amount} Stardust every 3 levels").replace('{amount}', reward.stardust.toString());
    }
    return baseText;
  }
  
  const uniqueRecurringReward = rewards.find(r => r.key === 'recurringStardust');

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          {dictionary['ProfilePage.rewardsTitle'] || "Level Rewards"}
        </CardTitle>
        <CardDescription className="text-xs">
          {dictionary['ProfilePage.rewardsDescription'] || "Unlock new perks as you level up your Cosmic Energy."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-3">
        {rewards.filter(r => r.key !== 'recurringStardust').map((reward, index) => {
          const isUnlocked = currentLevel >= reward.level;
          const Icon = reward.icon;
          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between p-3 rounded-md transition-all",
                isUnlocked ? "bg-primary/10 border-l-4 border-primary" : "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isUnlocked ? "text-primary" : "text-muted-foreground")} />
                <div>
                    <span className={cn("font-medium text-sm", !isUnlocked && "text-muted-foreground")}>
                      {getRewardDescription(reward)}
                    </span>
                    {reward.stardust > 0 && isUnlocked && (
                        <p className="text-xs text-primary/80 font-semibold">
                            + {reward.stardust} <StardustIcon className="w-3 h-3 inline-block -mt-0.5" />
                        </p>
                    )}
                </div>
              </div>
              <div className={cn("flex items-center gap-2 text-xs font-semibold", isUnlocked ? "text-green-400" : "text-muted-foreground")}>
                {isUnlocked ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>
                  {(dictionary['Reward.levelLabel'] || 'Lvl {level}').replace('{level}', reward.level.toString())}
                </span>
              </div>
            </div>
          );
        })}
        {uniqueRecurringReward && (
           <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md transition-all",
                "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <StardustIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                    <span className="font-medium text-sm text-muted-foreground">
                      {getRewardDescription(uniqueRecurringReward)}
                    </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>
                   (Levels 3, 6, 9...)
                </span>
              </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
