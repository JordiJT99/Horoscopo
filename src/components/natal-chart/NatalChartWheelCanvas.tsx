import React, { useRef, useEffect } from 'react';

interface PlanetPosition {
  name: string;
  degree: number;
}

interface Props {
  planetPositions: PlanetPosition[];
}

const zodiacSigns = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓'
];

const NatalChartWheelCanvas: React.FC<Props> = ({ planetPositions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = center - 20;
    const zodiacRadius = radius - 10;

    ctx.clearRect(0, 0, size, size);

    // Fondo
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(center, center, radius + 10, 0, Math.PI * 2);
    ctx.fill();

    // Círculo exterior
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Casas (división 12)
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // Signos
      const signX = center + (radius - 20) * Math.cos(angle + Math.PI / 12);
      const signY = center + (radius - 20) * Math.sin(angle + Math.PI / 12);
      ctx.fillStyle = '#aaa';
      ctx.font = '18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zodiacSigns[i], signX, signY);
    }

    // Planetas
    planetPositions.forEach(({ name, degree }) => {
      const angle = (degree - 90) * (Math.PI / 180); // shift so Aries (0°) is top
      const px = center + (radius - 35) * Math.cos(angle);
      const py = center + (radius - 35) * Math.sin(angle);

      ctx.beginPath();
      ctx.fillStyle = '#f1c40f';
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name.toUpperCase(), px, py - 10);
    });
  }, [planetPositions]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'carta-astral.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        className="rounded-full bg-background shadow-lg border border-white/10"
      />
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      >
        Descargar imagen
      </button>
    </div>
  );
};

export default NatalChartWheelCanvas;
