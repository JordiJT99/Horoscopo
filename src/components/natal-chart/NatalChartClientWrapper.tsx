'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import BirthDataForm from './BirthDataForm';
import NatalChartClientContent from './NatalChartClientContent';

interface BirthData {
  date: string;
  time: string;
  city: string;
  country: string;
}

interface NatalChartClientWrapperProps {
  dictionary: Dictionary;
}

const NatalChartClientWrapper: React.FC<NatalChartClientWrapperProps> = ({ dictionary }) => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  const handleFormSubmit = (data: BirthData) => {
    setBirthData(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {!birthData ? (
        <BirthDataForm onSubmit={handleFormSubmit} dictionary={dictionary.birthForm} />
      ) : (
        <NatalChartClientContent birthData={birthData} dictionary={dictionary} />
      )}
    </div>
  );
};

export default NatalChartClientWrapper;
