
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const friendshipCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Aries-Gemini": {
    report: "Una amistad llena de aventuras y risas. Géminis aporta ideas y diversión, mientras que Aries trae la energía para llevarlas a cabo. Nunca se aburren juntos y siempre están planeando algo nuevo y emocionante.",
    score: 5
  },
  "Taurus-Virgo": {
    report: "Amigos leales y prácticos que siempre pueden contar el uno con el otro. Comparten un enfoque sensato de la vida y disfrutan de actividades tranquilas. Es una amistad sólida, basada en la confianza y el apoyo mutuo.",
    score: 5
  },
  "Cancer-Scorpio": {
    report: "Una conexión emocional profunda y protectora. Se entienden sin necesidad de palabras y guardan los secretos del otro como si fueran propios. Es una amistad 'hasta la muerte', llena de lealtad e intensidad.",
    score: 5
  },
  "Leo-Sagittarius": {
    report: "Compañeros de fiesta y aventura por excelencia. Ambos son optimistas, extrovertidos y aman la vida. Se animan mutuamente a ser más audaces y a explorar el mundo. Su energía combinada es contagiosa.",
    score: 5
  },
  "Libra-Aquarius": {
    report: "Una amistad basada en ideales compartidos y una gran estimulación intelectual. Disfrutan de largas conversaciones sobre temas sociales y humanitarios. Se respetan mutuamente y valoran su independencia.",
    score: 5
  },
  "Capricorn-Pisces": {
    report: "Una amistad donde los sueños se encuentran con la realidad. Piscis inspira a Capricornio con su imaginación, y Capricornio ayuda a Piscis a poner los pies en la tierra. Se equilibran perfectamente.",
    score: 4
  },
  "Aries-Cancer": {
    report: "La naturaleza impulsiva de Aries puede chocar con la sensibilidad de Cáncer. Sin embargo, si Aries aprende a ser más considerado y Cáncer a no tomarse todo tan a pecho, pueden desarrollar un fuerte vínculo protector.",
    score: 3
  },
  "Gemini-Scorpio": {
    report: "Géminis es un libro abierto, mientras que Escorpio es un misterio. Esta diferencia puede generar fascinación o desconfianza. La amistad requiere un esfuerzo consciente por entender las diferentes formas de ser del otro.",
    score: 2
  }
};
