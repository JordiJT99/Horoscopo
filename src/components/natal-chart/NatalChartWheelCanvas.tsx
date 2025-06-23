import React, { useEffect, useRef } from 'react';

interface PlanetPosition {
  name: string;
  degree: number; // 0-360
}

interface Props {
  planetPositions: PlanetPosition[];
}

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

    ctx.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = center - 20;

    // Dibujar rueda
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Dividir en 12 signos (30 grados cada uno)
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Dibujar planetas
    planetPositions.forEach(({ name, degree }) => {
      const rad = (degree * Math.PI) / 180;
      const px = center + (radius - 20) * Math.cos(rad);
      const py = center + (radius - 20) * Math.sin(rad);

      ctx.beginPath();
      ctx.fillStyle = '#ffcc00';
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Texto del planeta
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(name, px + 8, py);
    });
  }, [planetPositions]);

  return (
    <div className="text-center">
      <canvas ref={canvasRef} style={{ backgroundColor: '#1a1a1a', borderRadius: '50%' }} />
      <br />
      <button
        onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const link = document.createElement('a');
            link.download = 'carta-astral.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Descargar imagen
      </button>
    </div>
  );
};

export default NatalChartWheelCanvas;