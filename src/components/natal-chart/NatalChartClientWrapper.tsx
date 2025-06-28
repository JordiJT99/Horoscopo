

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
  
  // Construct the expected dictionary object for the form
  const birthFormDictionary = {
    dateLabel: dictionary['birthForm.dateLabel'] || 'Birth Date',
    timeLabel: dictionary['birthForm.timeLabel'] || 'Birth Time',
    cityLabel: dictionary['birthForm.cityLabel'] || 'Birth City',
    countryLabel: dictionary['birthForm.countryLabel'] || 'Birth Country',
    submitButton: dictionary['birthForm.submitButton'] || 'Generate Natal Chart',
    validationErrors: {
      required: dictionary['birthForm.validationErrors.required'] || 'This field is required.',
    },
    pickDate: dictionary['birthForm.pickDate'] || 'Pick a date',
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {!birthData ? (
        <BirthDataForm onSubmit={handleFormSubmit} dictionary={birthFormDictionary} />
      ) : (
        <NatalChartClientContent birthData={birthData} dictionary={dictionary} user={user} />
      )}
    </div>
  );
};

export default NatalChartClientWrapper;
