'use client';

import { useState } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { getDailyTip } from '@/ai/flows/daily-tip-flow';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyTipWidgetProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function DailyTipWidget({ dictionary, locale }: DailyTipWidgetProps) {
  const [tip, setTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetTip = async () => {
    setIsLoading(true);
    try {
      const result = await getDailyTip({ locale });
      setTip(result.tip);
    } catch (error) {
      console.error("Error getting daily tip:", error);
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['DailyTip.error'] || "The cosmos is quiet... Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/30 transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-base font-semibold font-headline flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            {dictionary.DailyTip?.title || "Daily Tip"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {dictionary.DailyTip?.subtitle || "A bit of wisdom for your day."}
          </CardDescription>
        </div>
        {!tip && !isLoading && (
            <Button size="sm" onClick={handleGetTip}>
                {dictionary.DailyTip?.revealButton || "Reveal"}
            </Button>
        )}
      </CardHeader>
      <AnimatePresence>
        {(isLoading || tip) && (
            <CardContent className="p-4 pt-0">
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="border-t border-border/50 pt-3 text-center">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                                <LoadingSpinner className="h-4 w-4" />
                                <span>{dictionary.DailyTip?.loading || "Consulting the cosmos..."}</span>
                            </div>
                        ) : (
                            <p className="text-sm italic text-foreground/90">"{tip}"</p>
                        )}
                    </div>
                </motion.div>
            </CardContent>
        )}
      </AnimatePresence>
    </Card>
  );
}
