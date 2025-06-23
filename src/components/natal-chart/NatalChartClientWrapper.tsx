
'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import BirthDataForm from './BirthDataForm';
import NatalChartClientContent from './NatalChartClientContent';
import { useAuth } from '@/context/AuthContext';

interface BirthData {
  date: string;
  time: string;
  city: string;
  country: string;
}

const NatalChartClientWrapper: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const { user } = useAuth();
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  const handleFormSubmit = (data: BirthData) => {
    setBirthData(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {!birthData ? (
        <BirthDataForm onSubmit={handleFormSubmit} dictionary={dictionary.birthForm} />
      ) : (
        <NatalChartClientContent birthData={birthData} dictionary={dictionary} user={user} />
      )}
    </div>
  );
};

export default NatalChartClientWrapper;
