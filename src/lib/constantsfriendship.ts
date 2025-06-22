
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const friendshipCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  // Aries Combinations
  "Aries-Aries": {
    report: "Una amistad explosiva y llena de energía. Son compañeros de aventura ideales, siempre listos para un nuevo desafío. La competencia puede surgir, pero suele ser amistosa y motivadora. Se entienden a la perfección.",
    score: 4
  },
  "Aries-Taurus": {
    report: "Una amistad que requiere paciencia. Aries es rápido y Tauro es lento. Si logran sincronizarse, Tauro puede enseñar a Aries a disfrutar de la calma y Aries puede sacar a Tauro de su zona de confort.",
    score: 2
  },
  "Aries-Gemini": {
    report: "Una amistad llena de aventuras y risas. Géminis aporta ideas y diversión, mientras que Aries trae la energía para llevarlas a cabo. Nunca se aburren juntos y siempre están planeando algo nuevo y emocionante.",
    score: 5
  },
  "Aries-Cancer": {
    report: "La naturaleza impulsiva de Aries puede chocar con la sensibilidad de Cáncer. Sin embargo, si Aries aprende a ser más considerado y Cáncer a no tomarse todo tan a pecho, pueden desarrollar un fuerte vínculo protector.",
    score: 3
  },
  "Aries-Leo": {
    report: "Mejores amigos casi instantáneos. Ambos son signos de Fuego, llenos de pasión y entusiasmo por la vida. Se admiran mutuamente y forman un dúo dinámico y leal, siempre listos para la diversión y la aventura.",
    score: 5
  },
  "Aries-Virgo": {
    report: "Una combinación complicada. El impulsivo Aries choca con el meticuloso Virgo. Aries puede ver a Virgo como demasiado crítico, y Virgo a Aries como caótico. La amistad funciona si se basan en el respeto por sus diferencias.",
    score: 2
  },
  "Aries-Libra": {
    report: "Opuestos que se atraen y se equilibran. Aries aporta la acción y la decisión, mientras que Libra aporta la diplomacia y la reflexión. Libra calma a Aries, y Aries ayuda a Libra a tomar partido. Una gran dupla.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Una amistad intensa y poderosa. Ambos son signos guerreros y leales. Si la confianza es total, serán los defensores más feroces el uno del otro. Si no, pueden convertirse en rivales formidables.",
    score: 3
  },
  "Aries-Sagittarius": {
    report: "Los compañeros de aventura definitivos. Dos signos de Fuego que comparten un amor por la libertad, los viajes y las nuevas experiencias. Su amistad es optimista, honesta y llena de risas. Nunca hay un momento aburrido.",
    score: 5
  },
  "Aries-Capricorn": {
    report: "Una amistad basada en el respeto, si logran superar sus diferencias de ritmo. Aries es el impulso, Capricornio es la estrategia. Capricornio puede encontrar a Aries inmaduro, y Aries puede ver a Capricornio como aburrido.",
    score: 2
  },
  "Aries-Aquarius": {
    report: "Grandes amigos que valoran la independencia del otro. Aries se siente atraído por las ideas originales de Acuario, y Acuario se energiza con la pasión de Aries. Juntos son un equipo innovador y social.",
    score: 4
  },
  "Aries-Pisces": {
    report: "Una amistad delicada. La franqueza de Aries puede herir al sensible Piscis. Sin embargo, Aries puede convertirse en el protector de Piscis, y Piscis puede enseñar a Aries sobre la compasión y la empatía. Requiere cuidado mutuo.",
    score: 2
  },
  
  // Other existing combinations
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
  "Gemini-Scorpio": {
    report: "Géminis es un libro abierto, mientras que Escorpio es un misterio. Esta diferencia puede generar fascinación o desconfianza. La amistad requiere un esfuerzo consciente por entender las diferentes formas de ser del otro.",
    score: 2
  }
};
