
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
  
  // Taurus Combinations
  "Taurus-Taurus": {
    report: "Una amistad sólida como una roca. Comparten el amor por la comodidad, la buena comida y la lealtad. Son amigos fiables y constantes, aunque su terquedad combinada puede llevar a algún que otro punto muerto.",
    score: 4
  },
  "Taurus-Gemini": {
    report: "Una mezcla de tierra y aire. Tauro ofrece estabilidad, mientras que Géminis aporta diversión y novedad. Tauro puede encontrar a Géminis un poco inconsistente, y Géminis a Tauro un poco lento, pero pueden aprender mucho el uno del otro.",
    score: 3
  },
  "Taurus-Cancer": {
    report: "Una amistad natural y reconfortante. Ambos valoran la seguridad y el confort. Disfrutan de noches tranquilas en casa, buena comida y conversaciones sinceras. Tauro ofrece una estabilidad que Cáncer aprecia enormemente.",
    score: 5
  },
  "Taurus-Leo": {
    report: "Dos signos fijos que aprecian el lujo y la lealtad. Su amistad puede ser fuerte si superan la terquedad. Leo disfruta de la generosidad de Tauro, y Tauro de la calidez de Leo, pero pueden chocar por el control.",
    score: 3
  },
  "Taurus-Virgo": {
    report: "Amigos leales y prácticos que siempre pueden contar el uno con el otro. Comparten un enfoque sensato de la vida y disfrutan de actividades tranquilas. Es una amistad sólida, basada en la confianza y el apoyo mutuo.",
    score: 5
  },
  "Taurus-Libra": {
    report: "Ambos regidos por Venus, comparten un amor por la belleza y la armonía. Disfrutan de salidas culturales y una vida social tranquila. Libra ayuda a Tauro a socializar y Tauro ofrece a Libra una estabilidad reconfortante.",
    score: 4
  },
  "Taurus-Scorpio": {
    report: "Una amistad de opuestos magnéticos: intensa y profundamente leal. Ambos valoran la confianza por encima de todo. Si se ganan el respeto mutuo, serán amigos para toda la vida, protectores y posesivos el uno con el otro.",
    score: 4
  },
  "Taurus-Sagittarius": {
    report: "El hogareño se encuentra con el aventurero. Sus estilos de vida son muy diferentes. Sagitario puede ver a Tauro como aburrido, y Tauro puede ver a Sagitario como poco fiable. La amistad requiere un gran esfuerzo para encontrar un terreno común.",
    score: 2
  },
  "Taurus-Capricorn": {
    report: "Una de las amistades más sólidas y fiables del zodíaco. Ambos son signos de Tierra, prácticos, leales y ambiciosos. Se entienden y se apoyan mutuamente en sus metas a largo plazo. Una amistad para toda la vida.",
    score: 5
  },
  "Taurus-Aquarius": {
    report: "Una combinación difícil. El tradicional Tauro choca con el poco convencional Acuario. Ambos son tercos y les cuesta ceder. Si logran respetar sus diferencias, Acuario puede abrir la mente de Tauro, y Tauro puede ofrecer a Acuario un ancla a la realidad.",
    score: 2
  },
  "Taurus-Pisces": {
    report: "Una amistad dulce y reconfortante. Tauro ofrece la estabilidad y la protección que el sensible Piscis necesita. Piscis, a su vez, aporta imaginación, empatía y una profunda comprensión emocional que Tauro valora enormemente.",
    score: 4
  },

  // Gemini Combinations
  "Gemini-Gemini": {
    report: "Una amistad de alta energía, llena de chistes internos y conversaciones que saltan de un tema a otro. Nunca se aburren, pero pueden tener dificultades para profundizar o llevar a cabo sus planes. Pura diversión.",
    score: 4
  },
  "Gemini-Cancer": {
    report: "El ingenio de Géminis puede chocar con la sensibilidad de Cáncer. Si Géminis aprende a ser más empático y Cáncer a no tomarse todo tan a pecho, pueden disfrutar de una amistad donde uno anima al otro a salir de su caparazón.",
    score: 3
  },
  "Gemini-Leo": {
    report: "La pareja social perfecta. A Leo le encanta tener a Géminis cerca por su ingenio y habilidades sociales, y Géminis disfruta del carisma y la generosidad de Leo. Juntos son el alma de cualquier fiesta.",
    score: 4
  },
  "Gemini-Virgo": {
    report: "Dos mentes regidas por Mercurio, pero con enfoques diferentes. Géminis ama la variedad y Virgo el detalle. Pueden tener grandes debates, pero Virgo puede ver a Géminis como poco fiable, y Géminis a Virgo como demasiado crítico.",
    score: 3
  },
  "Gemini-Libra": {
    report: "Una amistad de Aire excepcionalmente fluida. Se entienden a nivel intelectual, disfrutan de la vida social y de largas conversaciones sobre cualquier tema. Se equilibran y se divierten muchísimo juntos.",
    score: 5
  },
  "Gemini-Scorpio": {
    report: "Géminis es un libro abierto, mientras que Escorpio es un misterio. Esta diferencia puede generar fascinación o desconfianza. La amistad requiere un esfuerzo consciente por entender las diferentes formas de ser del otro.",
    score: 2
  },
  "Gemini-Sagittarius": {
    report: "Opuestos que se atraen y se complementan. Ambos son curiosos, amantes de la libertad y del aprendizaje. Su amistad está llena de aventuras, viajes y debates filosóficos. Se dan el espacio que necesitan.",
    score: 5
  },
  "Gemini-Capricorn": {
    report: "Una amistad poco probable pero interesante. La ligereza de Géminis choca con la seriedad de Capricornio. Si encuentran un terreno común, Capricornio puede dar a Géminis el enfoque que necesita, y Géminis puede enseñar a Capricornio a relajarse.",
    score: 2
  },
  "Gemini-Aquarius": {
    report: "Una amistad brillante. Dos mentes innovadoras que se entienden a la perfección. Valoran la independencia mutua, las ideas originales y las conversaciones poco convencionales. Son grandes compañeros para proyectos humanitarios o tecnológicos.",
    score: 5
  },
  "Gemini-Pisces": {
    report: "La mente y el corazón. La lógica de Géminis puede chocar con la intuición de Piscis. Géminis puede herir sin querer los sentimientos de Piscis, pero si se esfuerzan, pueden tener una amistad muy creativa y llena de imaginación.",
    score: 2
  },

  // Cancer Combinations
  "Cancer-Cancer": {
    report: "Una amistad increíblemente intuitiva y nutritiva. Crean un espacio seguro donde ambos pueden ser vulnerables. Su principal desafío es evitar caer en un ciclo de negatividad o codependencia. Son el refugio del otro.",
    score: 4
  },
  "Cancer-Leo": {
    report: "El protector y el rey. Cáncer ofrece lealtad y apoyo incondicional, algo que Leo adora. Leo, a su vez, aporta calidez y diversión a la vida de Cáncer. La amistad es fuerte si Leo es cuidadoso con los sentimientos de Cáncer.",
    score: 3
  },
  "Cancer-Virgo": {
    report: "Grandes amigos que se cuidan mutuamente. Cáncer se siente seguro con la naturaleza práctica y servicial de Virgo, y Virgo aprecia la calidez emocional y la lealtad de Cáncer. Es una amistad sólida y de apoyo.",
    score: 4
  },
  "Cancer-Libra": {
    report: "Ambos buscan armonía, pero de maneras diferentes. Cáncer busca seguridad emocional, mientras que Libra busca equilibrio social. Libra puede encontrar a Cáncer demasiado temperamental, y Cáncer a Libra demasiado distante. La amistad requiere un esfuerzo por entender sus diferentes necesidades.",
    score: 3
  },
  "Cancer-Scorpio": {
    report: "Una conexión emocional profunda y protectora. Se entienden sin necesidad de palabras y guardan los secretos del otro como si fueran propios. Es una amistad 'hasta la muerte', llena de lealtad e intensidad.",
    score: 5
  },
  "Cancer-Sagittarius": {
    report: "El casero y el aventurero. Cáncer necesita un nido, Sagitario necesita el mundo. La honestidad brutal de Sagitario puede herir al sensible Cáncer. Es una amistad difícil que requiere mucho espacio y comprensión.",
    score: 2
  },
  "Cancer-Capricorn": {
    report: "Opuestos que se atraen y se respetan. Cáncer admira la fortaleza y la disciplina de Capricornio. Capricornio, a su vez, se siente cuidado y apreciado por la lealtad de Cáncer. Juntos, forman un vínculo sólido y protector.",
    score: 4
  },
  "Cancer-Aquarius": {
    report: "Una amistad complicada. Cáncer es personal y emocional, mientras que Acuario es más desapegado y orientado al grupo. Cáncer puede sentirse desatendido, y Acuario puede sentirse sofocado. La amistad funciona mejor en un contexto de grupo.",
    score: 2
  },
  "Cancer-Pisces": {
    report: "Una amistad de ensueño. Dos signos de agua que se entienden a un nivel casi psíquico. Su vínculo es empático, compasivo y muy creativo. Son el tipo de amigos que pueden llorar y reír juntos en la misma conversación.",
    score: 5
  },

  // Other existing combinations
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
  }
};
