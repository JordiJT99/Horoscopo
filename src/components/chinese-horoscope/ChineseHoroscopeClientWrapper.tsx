"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import ChineseHoroscopeInteractive from './ChineseHoroscopeInteractive';

interface WrapperProps {
    dictionary: Dictionary;
    locale: Locale;
}

export default function ChineseHoroscopeClientWrapper({ dictionary, locale }: WrapperProps) {
  // The level check has been removed. The component now directly renders the interactive part.
  return <ChineseHoroscopeInteractive dictionary={dictionary} locale={locale} />;
}
