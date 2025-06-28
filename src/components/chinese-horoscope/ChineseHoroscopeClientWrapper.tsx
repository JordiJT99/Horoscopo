
"use client";

import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import ChineseHoroscopeInteractive from './ChineseHoroscopeInteractive';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Lock } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface WrapperProps {
    dictionary: Dictionary;
    locale: Locale;
}

const UNLOCK_LEVEL = 3;

export default function ChineseHoroscopeClientWrapper({ dictionary, locale }: WrapperProps) {
  const { level } = useCosmicEnergy();

  if (level < UNLOCK_LEVEL) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center p-8 bg-card/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
            <div className="mx-auto bg-primary/20 rounded-full p-3 w-fit">
                <Lock className="w-10 h-10 text-primary" />
            </div>
          <CardTitle className="mt-4">{dictionary['Reward.lockedTitle'] || 'Content Locked'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            {(dictionary['Reward.unlockAtLevel'] || 'Unlock this feature at Level {level}. Keep exploring the app to gain Cosmic Energy!')
              .replace('{level}', UNLOCK_LEVEL.toString())}
          </p>
          <Button asChild>
            <Link href={`/${locale}/profile`}>{dictionary['Reward.viewProgress'] || 'View Your Progress'}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <ChineseHoroscopeInteractive dictionary={dictionary} locale={locale} />;
}
