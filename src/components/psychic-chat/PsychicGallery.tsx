
'use client';

import { psychics } from '@/lib/psychics';
import PsychicCard from './PsychicCard'; // Corrected path
import { useRouter } from 'next/navigation';

const PsychicGallery = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Moved the heading to the page component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {psychics.map((psychic) => (
          <PsychicCard
            key={psychic.id}
            psychic={psychic}
            onClick={() => router.push(`/psychic-chat/${psychic.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default PsychicGallery;
