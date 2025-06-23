'use client';

import React from 'react';
import Image from 'next/image';

interface NatalChartWheelProps {
  planetPositions: Record<string, { sign: string; degree: number }>;
  imageDataUrl?: string; // Add optional imageDataUrl prop
}

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ planetPositions, imageDataUrl }) => {
  return (
    <div className="flex justify-center">
      {/* Render the generated image if available */}
      {imageDataUrl ? (
        <Image
          src={imageDataUrl}
          alt="Generated Natal Chart Wheel"
          width={400}
          height={400}
          className="rounded-full shadow-lg"
          data-ai-hint="natal chart wheel"
        />
      ) : (
        /* Fallback to a placeholder if no image */
        <div className="w-[400px] h-[400px] bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          Chart image generating...
        </div>
      )}
    </div>
  );
};

export default NatalChartWheel;
