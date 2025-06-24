
import PsychicCard from '@/components/PsychicCard';
import { psychics } from '@/lib/psychics';
import Link from 'next/link';

const PsychicSelectionPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Psychic Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {psychics.map((psychic) => (
          <Link key={psychic.id} href={`/psychic-chat/${psychic.id}`}>
            <PsychicCard psychic={psychic} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PsychicSelectionPage;