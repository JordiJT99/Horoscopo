import { Button } from '@/components/ui/button';
import { Gift, Sparkles } from 'lucide-react';
import { useRewardedAd } from '@/hooks/use-admob-ads';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';

interface RewardedAdButtonProps {
  dictionary: Dictionary;
  rewardPoints?: number;
  disabled?: boolean;
  className?: string;
}

export const RewardedAdButton = ({ 
  dictionary, 
  rewardPoints = 50,
  disabled = false,
  className = ""
}: RewardedAdButtonProps) => {
  const { addEnergyPoints } = useCosmicEnergy();
  const { toast } = useToast();
  
  const { showAd, isReady, isAvailable } = useRewardedAd({
    onRewardEarned: (reward) => {
      console.log('Reward earned:', reward);
      // Agregar puntos de energía cósmica
      const result = addEnergyPoints('read_daily_horoscope', rewardPoints);
      
      toast({
        title: `✨ ${dictionary['RewardedAd.rewardEarnedTitle'] || 'Reward Earned!'}`,
        description: `${dictionary['RewardedAd.rewardEarnedDescription'] || 'You earned'} +${result.pointsAdded} EC!`,
      });

      if (result.leveledUp) {
        setTimeout(() => {
          toast({
            title: `🎉 ${dictionary['CosmicEnergy.levelUpTitle'] || 'Level Up!'}`,
            description: `${dictionary['CosmicEnergy.levelUpDescription']?.replace('{level}', result.newLevel.toString()) || `You have reached Level ${result.newLevel}!`}`,
          });
        }, 500);
      }
    },
    onAdShown: () => {
      console.log('Rewarded ad shown');
    },
    onAdClosed: () => {
      console.log('Rewarded ad closed');
    },
    onAdFailedToShow: (error) => {
      console.error('Rewarded ad failed to show:', error);
      toast({
        title: dictionary['RewardedAd.errorTitle'] || 'Ad Error',
        description: dictionary['RewardedAd.errorDescription'] || 'Failed to show reward ad. Please try again.',
        variant: "destructive",
      });
    }
  });

  const handleWatchAd = async () => {
    if (!isAvailable) {
      toast({
        title: dictionary['RewardedAd.notAvailableTitle'] || 'Ads Not Available',
        description: dictionary['RewardedAd.notAvailableDescription'] || 'Reward ads are not available right now.',
        variant: "destructive",
      });
      return;
    }

    if (!isReady) {
      toast({
        title: dictionary['RewardedAd.notReadyTitle'] || 'Ad Loading',
        description: dictionary['RewardedAd.notReadyDescription'] || 'Please wait for the ad to load.',
      });
      return;
    }

    await showAd();
  };

  // No mostrar el botón si los anuncios no están disponibles
  if (!isAvailable) {
    return null;
  }

  return (
    <Button
      onClick={handleWatchAd}
      disabled={disabled || !isReady}
      className={`${className} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0`}
      size="default"
    >
      <Gift className="h-4 w-4 mr-2" />
      {isReady ? (
        <>
          {dictionary['RewardedAd.watchForReward'] || 'Watch Ad'} 
          <Sparkles className="h-4 w-4 ml-1" />
          +{rewardPoints} EC
        </>
      ) : (
        dictionary['RewardedAd.loading'] || 'Loading...'
      )}
    </Button>
  );
};

export default RewardedAdButton;
