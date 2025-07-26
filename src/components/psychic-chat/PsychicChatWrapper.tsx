"use client";

import { Suspense } from 'react';
import type { Locale } from '@/types';
import type { Dictionary } from '@/lib/dictionaries';
import PsychicChatUI from './PsychicChatUI';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PsychicChatWrapperProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PsychicChatWrapper({ 
  dictionary, 
  locale
}: PsychicChatWrapperProps) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
      <PsychicChatUI
        dictionary={dictionary}
        locale={locale}
      />
    </Suspense>
  );
}
