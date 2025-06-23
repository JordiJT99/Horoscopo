

'use client';

import React from 'react';
import Image from 'next/image';

interface NatalChartWheelProps {
  planetPositions: Record<string, { sign: string; degree: number }>;
  imageDataUrl?: string;
}

// Map planet names to their astrological glyphs
const planetGlyphs: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  ascendant: 'AC',
};

// Map sign names to their zodiac glyphs and starting degrees for calculation
const zodiacSignDetails: Record<string, { glyph: string; start: number }> = {
  Aries: { glyph: '♈', start: 0 },
  Taurus: { glyph: '♉', start: 30 },
  Gemini: { glyph: '♊', start: 60 },
  Cancer: { glyph: '♋', start: 90 },
  Leo: { glyph: '♌', start: 120 },
  Virgo: { glyph: '♍', start: 150 },
  Libra: { glyph: '♎', start: 180 },
  Scorpio: { glyph: '♏', start: 210 },
  Sagittarius: { glyph: '♐', start: 240 },
  Capricorn: { glyph: '♑', start: 270 },
  Aquarius: { glyph: '♒', start: 300 },
  Pisces: { glyph: '♓', start: 330 },
};

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ planetPositions, imageDataUrl }) => {
  const wheelSize = 400; // The size of the wheel container in pixels
  const radius = wheelSize * 0.3; // A radius to place planets within the wheel, adjusted for better positioning

  const calculatePosition = (degree: number) => {
    // Convert astrological degree to cartesian angle in radians
    // 0° Aries is at the 9 o'clock position (180° in cartesian)
    const angleRad = (180 - degree) * (Math.PI / 180);

    // Calculate x and y coordinates
    // Center of the wheel is (wheelSize / 2, wheelSize / 2)
    // Y-axis is inverted in browser coordinates, so we subtract sin
    const x = wheelSize / 2 + radius * Math.cos(angleRad);
    const y = wheelSize / 2 - radius * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="relative flex justify-center items-center" style={{ width: wheelSize, height: wheelSize }}>
      {/* Render the generated background image if available */}
      {imageDataUrl ? (
        <Image
          src={imageDataUrl}
          alt="Generated Natal Chart Wheel"
          width={wheelSize}
          height={wheelSize}
          className="rounded-full shadow-lg"
          data-ai-hint="natal chart wheel"
        />
      ) : (
        /* Fallback to a placeholder if no image */
        <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
          Chart image generating...
        </div>
      )}

      {/* Overlay for planets and degrees */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Object.entries(planetPositions).map(([planet, data]) => {
          if (!planetGlyphs[planet]) return null;

          const { x, y } = calculatePosition(data.degree);
          const signInfo = zodiacSignDetails[data.sign];
          // Use floor to get the integer part of the degree within the sign
          const degreeInSign = Math.floor(data.degree - (signInfo?.start ?? 0));

          return (
            <div
              key={planet}
              className="absolute text-white flex flex-col items-center"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0px 0px 3px rgba(0, 0, 0, 0.7)',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: '1' }}>{planetGlyphs[planet]}</span>
              <span className="text-xs" style={{lineHeight: '1.2'}}>{`${degreeInSign}° ${signInfo?.glyph ?? ''}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NatalChartWheel;
