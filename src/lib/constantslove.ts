
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const loveCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Aries-Leo": {
    report: "Una pareja poderosa y apasionada, dos fuegos que se alimentan mutuamente. Su conexión es instantánea, llena de energía, admiración y un deseo compartido de liderazgo. El amor es un gran escenario donde ambos disfrutan brillar. Fortalezas: Lealtad inquebrantable, generosidad y una vida social vibrante. Desafíos: El choque de egos es su principal obstáculo. Ambos quieren dominar y pueden competir por el centro de atención. Clave del éxito: Celebrar los logros del otro como propios, aprender a compartir el protagonismo y transformar la competencia en un juego de equipo.",
    score: 5
  },
  "Taurus-Cancer": {
    report: "Una combinación tierna, segura y profundamente hogareña. Tauro ofrece la estabilidad y la sensualidad que Cáncer anhela, mientras que Cáncer aporta el cuidado y la calidez emocional que Tauro valora. Juntos construyen un refugio del mundo, un santuario de amor, buena comida y confort. Fortalezas: Lealtad absoluta, devoción y un entendimiento mutuo sobre la importancia de la seguridad y el hogar. Desafíos: La terquedad de Tauro puede chocar con la hipersensibilidad de Cáncer. Cáncer debe aprender a comunicar sus necesidades sin indirectas, y Tauro a ser más flexible. Clave del éxito: La paciencia y la comunicación afectuosa son fundamentales. Su amor crece con el tiempo, basado en la confianza y el cuidado mutuo.",
    score: 5
  },
  "Gemini-Libra": {
    report: "Una conexión mental chispeante y socialmente elegante. Como signos de Aire, disfrutan de la comunicación, el arte, la belleza y una vida social activa. Se entienden a un nivel intelectual profundo, creando una relación equilibrada y armoniosa. Fortalezas: Gran complicidad intelectual, excelentes conversaciones y un aprecio mutuo por la estética y la vida social. Son una pareja encantadora. Desafíos: Ambos pueden evitar los conflictos y las conversaciones emocionales profundas. La indecisión, tanto de Géminis como de Libra, puede ser un problema a la hora de tomar decisiones importantes. Clave del éxito: Aprender a abordar los problemas emocionales con la misma habilidad con la que discuten ideas y encontrar un compromiso entre la diversión y la responsabilidad.",
    score: 5
  },
  "Virgo-Capricorn": {
    report: "Práctica, leal y orientada al éxito. Dos signos de Tierra que comparten valores similares sobre el trabajo duro, la ambición y la estabilidad. Se apoyan mutuamente en sus objetivos y construyen una vida sólida y bien organizada. El respeto mutuo es inmenso. Fortalezas: Fiabilidad, metas compartidas y un profundo sentido del deber el uno hacia el otro. Son un equipo formidable en la vida y en el trabajo. Desafíos: Pueden caer en una rutina y descuidar el romance y la espontaneidad. Ambos tienden a ser demasiado críticos, consigo mismos y con el otro. Clave del éxito: Programar tiempo para el romance, celebrar los logros y aprender a relajarse y disfrutar de los frutos de su trabajo juntos.",
    score: 5
  },
  "Scorpio-Pisces": {
    report: "Una conexión de alma profunda, intuitiva y casi mágica. Ambos signos de Agua navegan por las profundidades emocionales con facilidad. Hay una comprensión casi psíquica entre ellos, creando un vínculo increíblemente fuerte y transformador. Fortalezas: Empatía profunda, conexión espiritual y una intimidad emocional que pocos logran. Se sienten seguros y comprendidos el uno con el otro. Desafíos: Pueden perderse en su propio mundo emocional y descuidar los aspectos prácticos de la vida. La intensidad de Escorpio a veces puede abrumar al soñador Piscis. Clave del éxito: Mantener un pie en la realidad, equilibrar la ensoñación con la acción y usar su profunda conexión para sanarse y apoyarse mutuamente.",
    score: 5
  },
  "Aries-Taurus": {
    report: "La impulsividad de Aries choca con la necesidad de seguridad y ritmo pausado de Tauro. Es una relación de 'frenar y acelerar'. Fortalezas: Si logran apreciar sus diferencias, la pasión de Aries puede inspirar a Tauro a la acción, mientras que la sensualidad y calma de Tauro puede enseñar a Aries a disfrutar de los placeres de la vida. Desafíos: La paciencia es el mayor desafío. Aries quiere todo ya, y Tauro necesita su tiempo. Sus diferentes ritmos pueden generar frustración. Clave del éxito: Un enorme respeto mutuo por sus diferentes naturalezas. Aries debe aprender a valorar la estabilidad, y Tauro a aceptar un poco de riesgo y aventura.",
    score: 3
  },
  "Cancer-Libra": {
    report: "Cáncer busca seguridad emocional profunda, mientras que Libra busca equilibrio y armonía social. Cáncer puede ver a Libra como demasiado superficial o indeciso, y Libra puede sentirse abrumado por la intensidad emocional de Cáncer. Fortalezas: Ambos valoran las relaciones y el compromiso. Libra puede enseñar a Cáncer a socializar y ver diferentes perspectivas, y Cáncer puede ayudar a Libra a conectar más profundamente con sus emociones. Desafíos: Sus necesidades emocionales son muy diferentes. Cáncer necesita un nido seguro, Libra necesita interacción social. Clave del éxito: La comunicación abierta sobre sus sentimientos y necesidades es vital. Deben encontrar un punto medio entre la vida social y la intimidad del hogar para que ambos se sientan satisfechos.",
    score: 2
  },
  "Leo-Scorpio": {
    report: "Una pareja de voluntades fuertes, magnéticas y extremadamente apasionadas. La intensidad es altísima, pero también el potencial de conflicto por el control y los celos. Ambos son signos fijos y leales, pero muy posesivos. Fortalezas: Una lealtad feroz y una pasión que puede mover montañas. Cuando están en sintonía, son una pareja poderosa e imparable. Desafíos: Las luchas de poder son casi inevitables. Ambos son orgullosos y les cuesta ceder. Los celos pueden ser un problema destructivo. Clave del éxito: La confianza absoluta es innegociable. Deben aprender a canalizar su energía de forma constructiva, admirar las fortalezas del otro y ceder el control de vez en cuando.",
    score: 3
  },
  "Aquarius-Pisces": {
    report: "El desapego mental de Acuario puede herir la sensible naturaleza de Piscis, que necesita conexión emocional. Sin embargo, ambos comparten un profundo idealismo y compasión por la humanidad. Fortalezas: Juntos pueden soñar con un mundo mejor y trabajar por causas humanitarias. Su conexión puede ser muy creativa y espiritual. Desafíos: La necesidad de espacio de Acuario puede hacer que Piscis se sienta abandonado. La lógica de Acuario choca con la intuición de Piscis. Clave del éxito: Acuario debe aprender a validar los sentimientos de Piscis, y Piscis a respetar la necesidad de independencia de Acuario. Conectar a través de sus ideales compartidos puede ser el puente que una sus mundos.",
    score: 3
  },
  "Aries-Libra": {
    report: "La clásica atracción de los opuestos. Aries, el guerrero impulsivo, se siente fascinado por la gracia y diplomacia de Libra. Libra, a su vez, se siente atraído por la pasión y seguridad de Aries. Fortalezas: Se complementan maravillosamente. Aries toma la iniciativa y Libra se encarga de las relaciones y la estrategia. Juntos forman un equipo dinámico y equilibrado. Desafíos: El estilo de comunicación. Aries es directo y confrontacional, mientras que Libra evita el conflicto. Esto puede llevar a resentimientos si los problemas no se abordan. Clave del éxito: Aries debe aprender a ser más diplomático, y Libra a ser más directo y no temer el desacuerdo. La comunicación honesta es su mejor herramienta.",
    score: 4
  },
  "Taurus-Leo": {
    report: "Una pareja de reyes y reinas que aman el lujo, el placer y la estabilidad. Sin embargo, ambos son signos fijos y muy tercos, lo que puede llevar a luchas de poder épicas. Fortalezas: Ambos son extremadamente leales y protectores con su pareja. Disfrutan construyendo una vida cómoda y hermosa juntos. Su amor es sólido y duradero si superan sus diferencias. Desafíos: La terquedad. Ninguno quiere ceder. Leo necesita admiración constante, y Tauro necesita tranquilidad y seguridad, a veces en conflicto con la necesidad de Leo de ser el centro de atención. Clave del éxito: La admiración mutua es clave. Tauro debe ofrecer a Leo el reconocimiento que necesita, y Leo debe valorar la calma y el apoyo incondicional de Tauro.",
    score: 2
  },
  "Gemini-Virgo": {
    report: "Ambos regidos por Mercurio, su conexión es principalmente mental, pero enfocada de manera muy diferente. Géminis es disperso y curioso, mientras que Virgo es analítico y detallista. Fortalezas: Pueden tener conversaciones fascinantes y aprender mucho el uno del otro. Virgo ayuda a Géminis a enfocarse, y Géminis ayuda a Virgo a relajarse y ver múltiples posibilidades. Desafíos: Virgo puede encontrar a Géminis poco fiable o superficial, y Géminis puede ver a Virgo como demasiado crítico y perfeccionista. La ansiedad puede ser un problema para ambos. Clave del éxito: Valorar la perspectiva del otro como un complemento y no como una crítica. La paciencia y el sentido del humor son esenciales.",
    score: 3
  },
  "Cancer-Capricorn": {
    report: "Otra poderosa pareja de opuestos que se complementan a la perfección. Cáncer (hogar, emoción) y Capricornio (carrera, estructura) son las dos caras de la misma moneda. Fortalezas: Cáncer nutre las ambiciones de Capricornio y le proporciona un refugio seguro. Capricornio le da a Cáncer la estabilidad y seguridad que tanto anhela. Juntos, pueden construir un verdadero imperio basado en el amor, la lealtad y el respeto mutuo. Desafíos: Capricornio puede parecer frío o distante para el sensible Cáncer, y Cáncer puede parecer demasiado emocional o dependiente para el pragmático Capricornio. Clave del éxito: Entender que expresan el amor de maneras diferentes. Capricornio lo demuestra con actos y compromiso, Cáncer con afecto y cuidado. Ambos son valiosos.",
    score: 5
  },
  "Leo-Aquarius": {
    report: "El rey y el rebelde. Estos opuestos del zodíaco sienten una fuerte atracción magnética, una mezcla de fascinación y exasperación. Fortalezas: Son una pareja socialmente brillante, creativa y poco convencional. Leo enseña a Acuario a conectar con su corazón y su lado más personal, mientras que Acuario enseña a Leo a ver más allá de sí mismo y a pensar en el colectivo. Desafíos: Sus necesidades son opuestas. Leo busca adoración personal, Acuario busca libertad e igualdad. Leo es cálido y expresivo, Acuario es más distante y mental. Clave del éxito: Respetar sus diferencias fundamentales. Deben encontrar un equilibrio entre la vida social y la personal, y valorar la perspectiva única que cada uno aporta.",
    score: 4
  },
  "Virgo-Pisces": {
    report: "El sanador y el soñador. Estos opuestos se atraen de una manera profundamente espiritual y compasiva. Su conexión es casi mágica. Fortalezas: El potencial para sanarse mutuamente es inmenso. Virgo ayuda a Piscis a materializar sus sueños y a mantenerse anclado, y Piscis ayuda a Virgo a conectar con la fe, la intuición y a ser menos autocrítico. Desafíos: El pragmatismo de Virgo puede chocar con el escapismo de Piscis. Virgo puede volverse demasiado crítico, y Piscis puede sentirse herido o incomprendido. Clave del éxito: La aceptación incondicional. Virgo debe aceptar el mundo de ensueño de Piscis, y Piscis debe apreciar el cuidado práctico de Virgo. Juntos pueden alcanzar un equilibrio perfecto entre lo místico y lo terrenal.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "Una combinación intrigante y compleja. El sociable y armonioso Libra se siente atraído por la misteriosa intensidad de Escorpio. Escorpio, a su vez, se siente cautivado por el encanto y la belleza de Libra. Fortalezas: Ambos son románticos y buscan una conexión profunda. Su vida íntima puede ser muy apasionada. Libra aporta equilibrio social y Escorpio una profundidad emocional inigualable. Desafíos: La necesidad de paz de Libra choca con la tendencia de Escorpio a explorar las profundidades emocionales, incluyendo los celos y el conflicto. Escorpio puede ver a Libra como superficial, y Libra puede temer la intensidad de Escorpio. Clave del éxito: La confianza y la comunicación son vitales. Libra debe aprender a no temer el conflicto sano, y Escorpio a confiar en la lealtad de Libra.",
    score: 3
  },
  "Scorpio-Sagittarius": {
    report: "Agua y Fuego, una combinación de vapor y pasión. Escorpio es profundo, privado e intenso, mientras que Sagitario es abierto, expansivo y amante de la libertad. Fortalezas: La atracción inicial puede ser explosiva. Sagitario saca a Escorpio de su caparazón, y Escorpio ofrece a Sagitario una profundidad que rara vez encuentra. Juntos, pueden vivir grandes aventuras. Desafíos: Sus naturalezas son muy diferentes. La necesidad de libertad de Sagitario puede activar los celos y la posesividad de Escorpio. Escorpio puede encontrar a Sagitario imprudente o superficial. Clave del éxito: Honestidad radical y mucho espacio. Deben respetar sus diferencias fundamentales y encontrar un equilibrio entre la aventura y la intimidad.",
    score: 2
  },
  "Sagittarius-Capricorn": {
    report: "El optimista aventurero se encuentra con el estratega pragmático. Sagitario puede ayudar a Capricornio a relajarse y ver el lado bueno de la vida, mientras que Capricornio puede dar a Sagitario el enfoque y la estructura necesarios para convertir sus grandes ideas en realidad. Fortalezas: Se equilibran bien si están dispuestos a aprender el uno del otro. Son una pareja que puede lograr grandes cosas, combinando visión y ejecución. Desafíos: Sagitario puede ver a Capricornio como demasiado serio o pesimista, y Capricornio puede ver a Sagitario como irresponsable o poco fiable. Clave del éxito: Respetar sus diferentes enfoques de la vida. Deben valorar lo que el otro aporta a la relación y encontrar un terreno común en sus metas a largo plazo.",
    score: 3
  },
  "Aquarius-Taurus": {
    report: "El innovador y el tradicionalista. Ambos son signos fijos, por lo que son tercos y resistentes al cambio, pero de maneras muy diferentes. Fortalezas: Si logran superar sus diferencias, pueden construir una relación increíblemente estable y leal. Tauro puede ofrecer a Acuario un hogar seguro al que volver, y Acuario puede abrir la mente de Tauro a nuevas ideas y posibilidades. Desafíos: Es una cuadratura desafiante. Acuario vive en el futuro y las ideas, mientras que Tauro se aferra a lo tangible y probado. Sus valores fundamentales pueden chocar constantemente. Clave del éxito: Un inmenso respeto por los valores y el espacio del otro. La paciencia es fundamental. Deben encontrar proyectos en común donde puedan combinar sus talentos únicos.",
    score: 2
  }
};
