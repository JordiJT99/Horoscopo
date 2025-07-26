"use client";

import { Suspense } from 'react';
import type { Locale } from '@/types';
import type { Dictionary } from '@/lib/dictionaries';
import CompatibilityCalculatorClient from './CompatibilityCalculatorClient';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface CompatibilityCalculatorWrapperProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function CompatibilityCalculatorWrapper({ 
  dictionary, 
  locale
}: CompatibilityCalculatorWrapperProps) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
      <CompatibilityCalculatorClient
        dictionary={dictionary}
        locale={locale}
      />
    </Suspense>
  );
}
