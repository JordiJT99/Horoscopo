// This is a new file to handle client-side dynamic rendering based on searchParams.
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import CompatibilityClientContent, { type CompatibilityType } from '@/components/compatibility/CompatibilityClientContent';
import { Heart, Handshake, Briefcase } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface CompatibilityCalculatorClientProps {
    dictionary: Dictionary;
    locale: Locale;
}

function CalculatorContent({ dictionary, locale }: CompatibilityCalculatorClientProps) {
    const searchParams = useSearchParams();
    const compatibilityType = (searchParams.get('type') as CompatibilityType) || 'love';

    let pageTitle = dictionary['CompatibilityPage.calculatorTitleDefault'] || "Zodiac Compatibility Calculator";
    let pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleDefault'] || "Select two signs to see their compatibility report.";
    let Icon = Heart;

    switch (compatibilityType) {
        case 'love':
            pageTitle = dictionary['CompatibilityPage.calculatorTitleLove'] || "Love Compatibility Calculator";
            pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleLove'] || "Discover how well signs match in romance.";
            Icon = Heart;
            break;
        case 'friendship':
            pageTitle = dictionary['CompatibilityPage.calculatorTitleFriendship'] || "Friendship Compatibility Calculator";
            pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleFriendship'] || "Explore the dynamics of friendship between signs.";
            Icon = Handshake;
            break;
        case 'work':
            pageTitle = dictionary['CompatibilityPage.calculatorTitleWork'] || "Work Compatibility Calculator";
            pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleWork'] || "See how signs collaborate in a professional setting.";
            Icon = Briefcase;
            break;
    }

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <SectionTitle
                title={pageTitle}
                subtitle={pageSubtitle}
                icon={Icon}
                className="mb-10 sm:mb-12"
            />
            <CompatibilityClientContent
                dictionary={dictionary}
                locale={locale}
                compatibilityTypeFromPage={compatibilityType}
            />
        </main>
    );
}

export default function CompatibilityCalculatorClient(props: CompatibilityCalculatorClientProps) {
    return (
        <Suspense fallback={
            <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
              <LoadingSpinner className="h-12 w-12 text-primary" />
              <p className="mt-4">Loading calculator...</p>
            </div>
          }>
            <CalculatorContent {...props} />
        </Suspense>
    );
}
