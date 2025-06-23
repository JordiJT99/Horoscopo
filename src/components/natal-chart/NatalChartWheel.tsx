'use client';

import React from 'react';
import Image from 'next/image';

interface NatalChartWheelProps {
  planetPositions: Record<string, { sign: string; degree: number }>;
}

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ planetPositions }) => {
  return (
    <div className="flex justify-center">
      <Image
        src="https://placehold.co/400x400.png"
        alt="Natal Chart Wheel Placeholder"
        width={400}
        height={400}
        className="rounded-full shadow-lg"
        data-ai-hint="natal chart wheel"
      />
    </div>
  );
};

export default NatalChartWheel;
