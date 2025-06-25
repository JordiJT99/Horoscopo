
'use client';

import React from 'react';
import Image from 'next/image';

interface AspectDetail {
  body1: string;
  body2: string;
  type: string;
  degree: number;
  explanation: string;
}

interface NatalChartWheelProps {
  planetPositions: Record<string, { sign: string; degree: number }>;
  aspects: AspectDetail[];
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

// Map aspect types to colors for line drawing
const aspectColors: Record<string, string> = {
  // Spanish
  'Conjunción': '#FFD700', // Gold
  'Oposición': '#E53E3E',   // Red
  'Trígono': '#3182CE',    // Blue
  'Cuadratura': '#E53E3E',  // Red
  'Sextil': '#38A169',     // Green
  // English fallbacks
  'Conjunction': '#FFD700',
  'Opposition': '#E53E3E',
  'Trine': '#3182CE',
  'Square': '#E53E3E',
  'Sextile': '#38A169',
};


const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ planetPositions, aspects, imageDataUrl }) => {
  const wheelSize = 400; // The size of the wheel container in pixels
  const radius = wheelSize * 0.38; // Radius to place planets within the wheel

  const calculatePosition = (degree: number) => {
    // Convert astrological degree to cartesian angle in radians
    const angleRad = (180 - degree) * (Math.PI / 180);

    const x = wheelSize / 2 + radius * Math.cos(angleRad);
    const y = wheelSize / 2 - radius * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="relative flex justify-center items-center" style={{ width: wheelSize, height: wheelSize }}>
      {/* Render the static background image */}
      {imageDataUrl && (
        <Image
          src={imageDataUrl}
          alt="Natal Chart Wheel Background"
          width={wheelSize}
          height={wheelSize}
          className="rounded-full shadow-lg"
          data-ai-hint="natal chart background"
        />
      )}

      {/* SVG overlay for aspect lines */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
        {aspects.map((aspect, index) => {
            // Find planet positions, converting aspect body names to lowercase
            const planet1 = planetPositions[aspect.body1.toLowerCase()];
            const planet2 = planetPositions[aspect.body2.toLowerCase()];
            
            if (!planet1 || !planet2) return null;
            
            // We need a different radius for the aspect lines so they are drawn inside the planets
            const lineRadius = wheelSize * 0.3; // A smaller radius for the line endpoints
            const pos1 = {
                x: wheelSize / 2 + lineRadius * Math.cos((180 - planet1.degree) * Math.PI / 180),
                y: wheelSize / 2 - lineRadius * Math.sin((180 - planet1.degree) * Math.PI / 180)
            };
            const pos2 = {
                x: wheelSize / 2 + lineRadius * Math.cos((180 - planet2.degree) * Math.PI / 180),
                y: wheelSize / 2 - lineRadius * Math.sin((180 - planet2.degree) * Math.PI / 180)
            };
            
            const color = aspectColors[aspect.type] || 'rgba(255, 255, 255, 0.5)';
            
            return (
                <line
                    key={index}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.8"
                />
            );
        })}
      </svg>

      {/* Div overlay for planet glyphs (on top of lines) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Object.entries(planetPositions).map(([planet, data]) => {
          if (!planetGlyphs[planet]) return null;

          const { x, y } = calculatePosition(data.degree);
          const signInfo = zodiacSignDetails[data.sign];
          const degreeInSign = Math.floor(data.degree - (signInfo?.start ?? 0));

          return (
            <div
              key={planet}
              className="absolute text-white flex flex-col items-center"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0px 0px 4px rgba(0, 0, 0, 0.9)',
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
