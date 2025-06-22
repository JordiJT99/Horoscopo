
import type { ChineseAnimalSignName } from '@/types';

export interface ChineseCompatibilityReportDetail {
  report: string;
  score: number; // 1 to 5
}

export const chineseCompatibilityPairings: Record<string, ChineseCompatibilityReportDetail> = {
  // Tríada de Afinidad 1: Rata, Dragón, Mono
  "Rat-Dragon": {
    report: "Una conexión magnética y poderosa. La astucia de la Rata y la majestuosidad del Dragón crean una pareja que puede conquistar el mundo. Ambos son ambiciosos, inteligentes y se admiran mutuamente. La Rata aporta la estrategia y el Dragón la visión, formando un equipo imparable.",
    score: 5
  },
  "Rat-Monkey": {
    report: "Una amistad y romance llenos de diversión, ingenio y travesuras. La Rata queda cautivada por la inteligencia y el humor del Mono, mientras que el Mono respeta la astucia de la Rata. Juntos, resuelven problemas de forma creativa y nunca se aburren. Un vínculo muy estimulante.",
    score: 5
  },
  "Dragon-Monkey": {
    report: "Una pareja dinámica y carismática. El poder y la visión del Dragón se complementan con la inteligencia y la astucia del Mono. Juntos, son socialmente brillantes y capaces de lograr grandes cosas. Se admiran mutuamente y se inspiran para alcanzar nuevas alturas.",
    score: 5
  },

  // Tríada de Afinidad 2: Buey, Serpiente, Gallo
  "Ox-Snake": {
    report: "Una pareja de gran profundidad y entendimiento. La estabilidad y la paciencia del Buey proporcionan un ancla segura para la sabia y misteriosa Serpiente. A su vez, la Serpiente ofrece una perspectiva y una inteligencia que fascinan al Buey. Su lealtad es inquebrantable.",
    score: 5
  },
  "Ox-Rooster": {
    report: "Un equipo altamente eficiente y leal. La honestidad y la diligencia del Buey son muy valoradas por el organizado y observador Gallo. El Gallo ayuda a organizar los planes, y el Buey los ejecuta con determinación. Comparten valores tradicionales y construyen una vida estable juntos.",
    score: 4
  },
  "Snake-Rooster": {
    report: "Una conexión intelectual y estratégica. La sabiduría de la Serpiente y la mente analítica del Gallo crean una pareja formidable. Son excelentes planificadores y estrategas, y se admiran mutuamente por su inteligencia. Su lealtad y apoyo son sólidos como una roca.",
    score: 5
  },

  // Tríada de Afinidad 3: Tigre, Caballo, Perro
  "Tiger-Horse": {
    report: "Una pareja llena de pasión, aventura y energía. Ambos aman la libertad y la acción. Se entienden en su necesidad de independencia y se animan mutuamente a perseguir sus sueños más audaces. Su vida juntos es una aventura constante, llena de emoción y respeto.",
    score: 5
  },
  "Tiger-Dog": {
    report: "Una amistad y romance basados en una lealtad y confianza profundas. El idealismo y la honestidad del Perro resuenan con la naturaleza valiente del Tigre. El Perro ofrece un apoyo incondicional que calma al impulsivo Tigre, y el Tigre protege ferozmente a su leal amigo.",
    score: 4
  },
  "Horse-Dog": {
    report: "Una pareja increíblemente leal y solidaria. El espíritu libre del Caballo se beneficia de la naturaleza estable y honesta del Perro. A su vez, el Perro se inspira en el optimismo y la energía del Caballo. Comparten una visión positiva de la vida y se defienden mutuamente a capa y espada.",
    score: 5
  },

  // Tríada de Afinidad 4: Conejo, Cabra, Cerdo
  "Rabbit-Goat": {
    report: "Una conexión dulce, artística y muy armoniosa. Ambos son signos sensibles y aprecian la belleza y la paz. El Conejo, diplomático, y la Cabra, creativa, crean un hogar lleno de amor y confort. Se entienden a un nivel emocional profundo y evitan los conflictos.",
    score: 5
  },
  "Rabbit-Pig": {
    report: "Una pareja amable y sociable que comparte el amor por las cosas buenas de la vida. La prudencia del Conejo y la generosidad del Cerdo crean un ambiente de calidez y seguridad. Disfrutan de una vida hogareña cómoda y de reuniones sociales tranquilas.",
    score: 5
  },
  "Goat-Pig": {
    report: "Una amistad y romance llenos de empatía y cuidado mutuo. La naturaleza artística y soñadora de la Cabra es apoyada por la generosidad y la buena naturaleza del Cerdo. Juntos, crean un mundo de confort y apoyo emocional. Se perdonan fácilmente y se cuidan mutuamente.",
    score: 5
  },

  // Amigos Secretos (Máxima compatibilidad, diferentes a las tríadas)
  "Rat-Ox": {
    report: "El amigo secreto de la Rata es el Buey. Esta es una de las combinaciones más fuertes y estables. El Buey ofrece la fiabilidad y la seguridad que la Rata necesita, mientras que la Rata aporta ingenio y astucia que el Buey admira. Juntos, son un equipo imparable que puede construir un futuro próspero.",
    score: 5
  },
  "Tiger-Pig": {
    report: "El amigo secreto del Tigre es el Cerdo. El Cerdo, con su naturaleza generosa y su amor por la comodidad, calma la intensidad del Tigre. A su vez, el Tigre protege al Cerdo y le da la confianza para perseguir sus metas. Es una relación de apoyo mutuo y profundo afecto.",
    score: 5
  },
  "Rabbit-Dog": {
    report: "El amigo secreto del Conejo es el Perro. Esta es una unión de gran lealtad y comprensión. El Perro, con su naturaleza honesta y protectora, hace que el prudente Conejo se sienta seguro. El Conejo, a su vez, aporta diplomacia y calma a la vida del a veces ansioso Perro.",
    score: 5
  },
  "Dragon-Rooster": {
    report: "El amigo secreto del Dragón es el Gallo. El Gallo, con su atención al detalle y su mente analítica, ayuda a materializar las grandes visiones del Dragón. El Dragón, a su vez, inspira al Gallo a pensar en grande y le da la confianza para brillar. Juntos son un equipo de éxito garantizado.",
    score: 5
  },
  "Snake-Monkey": {
    report: "El amigo secreto de la Serpiente es el Mono. Esta es una combinación de pura inteligencia y estrategia. Ambos son increíblemente astutos y se admiran mutuamente. La Serpiente aporta la sabiduría y la planificación, y el Mono la innovación y la capacidad de resolver problemas. Juntos, son un equipo intelectualmente formidable.",
    score: 4
  },
  "Horse-Goat": {
    report: "El amigo secreto del Caballo es la Cabra. La naturaleza gentil y artística de la Cabra calma el espíritu inquieto del Caballo. El Caballo, a su vez, inspira a la Cabra a ser más sociable y aventurera. Se equilibran maravillosamente, creando una relación llena de alegría y creatividad.",
    score: 5
  },
    
  // Choques (Peor compatibilidad)
  "Rat-Horse": {
    report: "Una relación de confrontación directa. La Rata, astuta y calculadora, choca con el espíritu libre e impulsivo del Caballo. La Rata puede ver al Caballo como imprudente, y el Caballo puede ver a la Rata como manipuladora. Sus personalidades son opuestas y requieren mucho esfuerzo para encontrar un terreno común.",
    score: 1
  },
  "Ox-Goat": {
    report: "Un choque de valores. El Buey, trabajador y práctico, se frustra con la naturaleza soñadora y a veces poco práctica de la Cabra. La Cabra, a su vez, se siente criticada y limitada por la rigidez del Buey. Es difícil para ellos apreciar las fortalezas del otro.",
    score: 1
  },
  "Tiger-Monkey": {
    report: "Una batalla de ingenio y ego. El Tigre, poderoso y directo, y el Mono, astuto y juguetón, están en constante competencia. El Mono puede burlarse del Tigre, y el Tigre puede sentirse menospreciado. Su relación está llena de desafíos y desconfianza.",
    score: 1
  },
  "Rabbit-Rooster": {
    report: "El diplomático contra el crítico. La naturaleza sensible y amante de la paz del Conejo choca con la franqueza directa y a veces arrogante del Gallo. El Gallo puede ver al Conejo como demasiado débil, y el Conejo puede sentirse constantemente criticado por el Gallo.",
    score: 1
  },
  "Dragon-Dog": {
    report: "El idealista majestuoso contra el realista cínico. El Dragón, lleno de confianza, se enfrenta al Perro, que es más cauteloso y a veces pesimista. El Dragón puede ver al Perro como un aguafiestas, y el Perro puede ver al Dragón como poco realista y arrogante. Sus visiones del mundo son opuestas.",
    score: 1
  },
  "Snake-Pig": {
    report: "El misterioso estratega contra el honesto hedonista. La Serpiente, sabia y reservada, choca con el Cerdo, que es más directo, sociable y confiado. La Serpiente puede desconfiar de la ingenuidad del Cerdo, y el Cerdo puede sentirse confundido por la naturaleza secreta de la Serpiente.",
    score: 1
  },

  // Otras combinaciones para rellenar
  "Rat-Rabbit": {
    report: "Una relación que requiere diplomacia. La Rata puede ser directa y el Conejo muy sensible. Si la Rata aprende a ser más gentil y el Conejo más directo, pueden llevarse bien, pero hay una tensión subyacente.",
    score: 3
  },
  "Ox-Tiger": {
    report: "Una combinación difícil. El Buey es conservador y el Tigre es rebelde. Hay una lucha de poder constante, ya que ambos son líderes a su manera. Respeto mutuo es posible, pero la armonía es rara.",
    score: 2
  },
  "Tiger-Snake": {
    report: "Una relación de sospecha mutua. El Tigre es abierto y audaz, mientras que la Serpiente es reservada y calculadora. No suelen confiar el uno en el otro, lo que dificulta la formación de un vínculo fuerte.",
    score: 2
  },
  "Horse-Rooster": {
    report: "Una relación con fricción. El Caballo ama su libertad y el Gallo puede ser crítico y controlador. El Gallo puede intentar 'organizar' al Caballo, lo cual rara vez funciona bien.",
    score: 2
  }
};
