import React, { useState } from 'react';
import PsychicCard from './PsychicCard'; // Assuming PsychicCard component exists

interface Psychic {
  id: string;
  name: string;
  specialty: string;
  rating: number;
}

interface PsychicSelectorProps {
  psychics: Psychic[];
  onSelectPsychic: (psychic: Psychic) => void;
}

const PsychicSelector: React.FC<PsychicSelectorProps> = ({ psychics, onSelectPsychic }) => {
  const [selectedPsychic, setSelectedPsychic] = useState<Psychic | null>(null);

  const handleSelectPsychic = (psychic: Psychic) => {
    setSelectedPsychic(psychic);
    onSelectPsychic(psychic);
  };

  return (
    <div>
      <h2>Select a Psychic</h2>
      <div className="psychic-list">
        {psychics.map((psychic) => (
          <PsychicCard
            key={psychic.id}
            psychic={psychic}
            isSelected={selectedPsychic?.id === psychic.id}
            onSelect={handleSelectPsychic}
          />
        ))}
      </div>
    </div>
  );
};

export default PsychicSelector;