
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const workCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Taurus-Capricorn": {
    report: "El equipo de trabajo soñado para cualquier empresa. Ambos son prácticos, disciplinados y orientados a resultados. Trabajan de manera constante y fiable, construyendo proyectos sólidos y duraderos. Respeto y profesionalismo definen su relación.",
    score: 5
  },
  "Gemini-Aquarius": {
    report: "Una dupla innovadora y llena de ideas revolucionarias. Ambos signos de Aire prosperan en entornos que requieren pensamiento original y comunicación. Son excelentes para brainstorming, estrategia y proyectos de vanguardia.",
    score: 5
  },
  "Cancer-Pisces": {
    report: "Compañeros de trabajo increíblemente intuitivos y empáticos. Crean un ambiente laboral de apoyo y colaboración. Son ideales para profesiones creativas o de cuidado, donde la sensibilidad es una fortaleza.",
    score: 4
  },
  "Leo-Libra": {
    report: "Un equipo con gran carisma y habilidades sociales. Leo lidera con confianza y Libra aporta diplomacia y estrategia. Juntos son excelentes en roles de cara al público, ventas, marketing y relaciones públicas.",
    score: 4
  },
  "Aries-Sagittarius": {
    report: "Dinámicos, entusiastas y siempre listos para un nuevo desafío. Este par de Fuego no teme tomar riesgos y son pioneros en su campo. Se motivan mutuamente y mantienen la moral del equipo alta, aunque deben cuidar los detalles.",
    score: 4
  },
  "Virgo-Scorpio": {
    report: "Una combinación de precisión y profundidad. Virgo se enfoca en los detalles y la eficiencia, mientras que Escorpio investiga hasta encontrar la raíz del problema. Juntos son imbatibles en tareas de análisis, investigación y resolución de problemas complejos.",
    score: 5
  },
  "Aries-Virgo": {
    report: "El enfoque impulsivo de Aries puede frustrar al meticuloso Virgo. Aries quiere empezar ya, mientras que Virgo necesita planificar cada detalle. La paciencia y la delegación de tareas según las fortalezas de cada uno es crucial.",
    score: 2
  },
  "Leo-Taurus": {
    report: "Ambos son signos fijos y tercos, lo que puede llevar a luchas de poder. Leo busca reconocimiento, mientras que Tauro busca seguridad y resultados tangibles. Necesitan encontrar un terreno común y respetar los métodos del otro para tener éxito.",
    score: 2
  }
};
