
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
  },
  "Aries-Aries": {
    report: "Un dúo de alta energía y competitividad. Pueden ser grandes motivadores si trabajan hacia un objetivo común, pero también pueden chocar por el liderazgo. La comunicación clara sobre roles es esencial.",
    score: 3
  },
  "Aries-Taurus": {
    report: "El enfoque rápido de Aries choca con el ritmo metódico de Tauro. Tauro puede ver a Aries como imprudente, y Aries a Tauro como lento. Necesitan respetar sus diferentes estilos para funcionar.",
    score: 2
  },
  "Aries-Gemini": {
    report: "Un equipo dinámico y creativo. Aries aporta la energía para iniciar, mientras que Géminis ofrece ideas brillantes y habilidades de comunicación. Son excelentes para proyectos que requieren agilidad y pensamiento rápido.",
    score: 4
  },
  "Aries-Cancer": {
    report: "Una combinación delicada. La franqueza de Aries puede chocar con la sensibilidad de Cáncer. Aries debe ser más considerado y Cáncer más directo para evitar malentendidos en el entorno laboral.",
    score: 2
  },
  "Aries-Leo": {
    report: "Un dúo poderoso y carismático. Ambos son líderes natos y se admiran mutuamente. Si logran alinear sus egos y trabajar en equipo, son imparables en la consecución de objetivos ambiciosos.",
    score: 5
  },
  "Aries-Libra": {
    report: "Una excelente combinación de acción y diplomacia. Aries toma la iniciativa, mientras que Libra aporta equilibrio, estrategia y habilidades interpersonales. Juntos cubren todas las bases.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Dos potencias regidas por Marte. Su intensidad combinada puede mover montañas o desatar conflictos. Son excelentes en situaciones de crisis, pero deben tener cuidado con las luchas de poder.",
    score: 3
  },
  "Aries-Capricorn": {
    report: "El velocista y el maratonista. Aries busca resultados rápidos, mientras que Capricornio construye un plan a largo plazo. Pueden tener éxito si Capricornio valora la iniciativa de Aries y Aries respeta la estrategia de Capricornio.",
    score: 3
  },
  "Aries-Aquarius": {
    report: "Una pareja innovadora. Acuario tiene las ideas originales y futuristas, y Aries tiene la energía y el coraje para ponerlas en marcha. Son excelentes para startups y proyectos disruptivos.",
    score: 4
  },
  "Aries-Pisces": {
    report: "El líder y el soñador. Aries puede proporcionar la dirección y el impulso que Piscis necesita para concretar sus ideas creativas. Piscis, a su vez, puede aportar una perspectiva intuitiva que Aries a menudo pasa por alto.",
    score: 3
  }
};
