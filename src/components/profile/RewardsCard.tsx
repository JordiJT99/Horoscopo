'use client';

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { CheckCircle, Lock, Award, MessageCircle, Sparkles, Star, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardsCardProps {
  dictionary: Dictionary;
}

const rewards = [
  { level: 5, key: 'exclusiveEmoji', icon: Sparkles },
  { level: 5, key: 'freeChat', icon: MessageCircle },
  { level: 10, key: 'freeChat', icon: MessageCircle },
  { level: 15, key: 'supernovaTitle', icon: Star },
  { level: 15, key: 'auroraBackground', icon: Palette },
  { level: 20, key: 'rosetteBackground', icon: Palette },
];

export default function RewardsCard({ dictionary }: RewardsCardProps) {
  const { level: currentLevel } = useCosmicEnergy();

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
        {rewards.map((reward, index) => {
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
                <span className={cn("font-medium text-sm", !isUnlocked && "text-muted-foreground")}>
                  {dictionary[`Reward.${reward.key}`] || reward.key}
                </span>
              </div>
              <div className={cn("flex items-center gap-2 text-xs font-semibold", isUnlocked ? "text-green-400" : "text-muted-foreground")}>
                {isUnlocked ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>
                  {(dictionary['Reward.unlockedAtLevel'] || 'Lv. {level}').replace('{level}', reward.level.toString())}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
