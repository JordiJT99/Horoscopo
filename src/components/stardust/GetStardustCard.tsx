
'use client';

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { useState } from 'react';
import { ShoppingBag, Star, Clapperboard, Gem, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const GetStardustCard = ({ dictionary }: { dictionary: Dictionary }) => {
    const { addStardust, claimRateReward, hasRatedApp } = useCosmicEnergy();
    const [isAdPlaying, setIsAdPlaying] = useState(false);
    const { toast } = useToast();
    const [showExplanation, setShowExplanation] = useState(false);

    const handleRateApp = () => {
        const { success, amount } = claimRateReward();
        if (success) {
            toast({
                title: dictionary['Toast.rateSuccessTitle'] || "Thank You!",
                description: (dictionary['Toast.rateSuccessDescription'] || "You've been awarded {amount} Stardust for your feedback.").replace('{amount}', amount.toString())
            });
        } else {
             toast({
                title: dictionary['Toast.alreadyRated'] || "Already Rewarded",
                description: "You have already claimed this reward."
            });
        }
    };

    const handleWatchAd = () => {
        setIsAdPlaying(true);
        setTimeout(() => {
            const adReward = 2;
            addStardust(adReward);
            setIsAdPlaying(false);
            toast({
                 title: dictionary['Toast.adWatchedTitle'] || "Ad Finished",
                description: (dictionary['Toast.adWatchedDescription'] || "You've earned {amount} Stardust.").replace('{amount}', adReward.toString())
            });
        }, 2000); // Simulate ad watch time
    };

    const stardustPacks = [
        { amount: 100, price: "$0.99", popular: false, icon: '💎' },
        { amount: 550, price: "$4.99", popular: true, icon: '✨' },
        { amount: 1200, price: "$9.99", popular: false, icon: '🌟' }
    ];

    return (
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    {dictionary['ProfilePage.getMoreStardustTitle'] || "Get More Stardust"}
                </CardTitle>
                <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary mt-1 justify-start" onClick={() => setShowExplanation(!showExplanation)}>
                    <HelpCircle className="w-4 h-4 mr-1.5" />
                    {showExplanation 
                        ? (dictionary['Stardust.hideExplanationButton'] || "Hide Explanation")
                        : (dictionary['Stardust.showExplanationButton'] || "What is Stardust?")
                    }
                </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                 {showExplanation && (
                    <Card className="mb-4 p-4 bg-background/50 border-primary/20">
                        <CardTitle className="text-md font-semibold mb-2 flex items-center gap-1.5">{dictionary['Stardust.explanationTitle'] || "What is Stardust? 💫"}</CardTitle>
                        <p className="text-sm text-card-foreground/80 whitespace-pre-line">
                            {dictionary['Stardust.explanationContent'] || "Stardust is a special currency within AstroVibes. You can use it to unlock premium features, such as sending messages in Psychic Chats.\n\nYou can earn Stardust by:\n- Leveling up your Cosmic Energy.\n- Claiming special rewards (like rating the app).\n- Watching ads.\n- Purchasing Stardust packs (coming soon)."}
                        </p>
                    </Card>
                )}
                <Button onClick={handleRateApp} disabled={hasRatedApp} className="w-full justify-between h-auto py-3 px-4">
                    <div className="flex items-center gap-3">
                         <Star className="h-5 w-5"/>
                         <div className="text-left">
                            <p className="font-semibold">{dictionary['ProfilePage.rateAppButton'] || "Rate the App"}</p>
                            <p className="text-xs font-normal opacity-80">{(dictionary['ProfilePage.rateAppDescription'] || "+{amount} 💫 for your feedback!").replace('{amount}', '4')}</p>
                         </div>
                    </div>
                    <span>{hasRatedApp ? '✅' : '▶️'}</span>
                </Button>
                 <Button onClick={handleWatchAd} disabled={isAdPlaying} className="w-full justify-between h-auto py-3 px-4">
                    <div className="flex items-center gap-3">
                         <Clapperboard className="h-5 w-5"/>
                         <div className="text-left">
                            <p className="font-semibold">{dictionary['ProfilePage.watchAdButton'] || "Watch an Ad"}</p>
                            <p className="text-xs font-normal opacity-80">{(dictionary['ProfilePage.watchAdDescription'] || "+{amount} 💫 for your time!").replace('{amount}', '2')}</p>
                         </div>
                    </div>
                    <span>{isAdPlaying ? '...' : '▶️'}</span>
                </Button>

                <div className="pt-4">
                    <h4 className="text-center font-semibold mb-3">{dictionary['ProfilePage.buyStardustTitle'] || "Buy Stardust"}</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {stardustPacks.map(pack => (
                             <Button key={pack.amount} variant="outline" className="w-full justify-between h-auto py-3 px-4 disabled:opacity-60" disabled>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{pack.icon}</span>
                                    <p className="font-semibold">{pack.amount.toLocaleString()} 💫</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{pack.price}</p>
                                    <p className="text-xs font-normal text-muted-foreground">{dictionary['MorePage.comingSoon']}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default GetStardustCard;
