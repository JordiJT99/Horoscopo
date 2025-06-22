
import type { ChineseAnimalSignName } from '@/types';

export interface ChineseCompatibilityReportDetail {
  report: string;
  score: number; // 1 to 5
}

export const chineseCompatibilityPairings: Record<string, ChineseCompatibilityReportDetail> = {
  // Tríada de Afinidad 1: Rata, Dragón, Mono
  "Rat-Dragon": {
    report: "Una de las combinaciones más exitosas y dinámicas. La Rata, con su astucia e ingenio, se siente irresistiblemente atraída por el poder, el carisma y la visión del Dragón. El Dragón, a su vez, admira profundamente la inteligencia y la capacidad de la Rata para encontrar oportunidades donde otros no las ven. Juntos, forman un equipo de poder imparable: el Dragón lidera con confianza y grandeza, mientras que la Rata trabaja tras bastidores, asegurando que cada detalle esté cubierto y cada estrategia sea impecable. Su admiración mutua es la base de un vínculo duradero, ya sea en los negocios, la amistad o el amor.",
    score: 5
  },
  "Rat-Monkey": {
    report: "Pura energía y complicidad. La Rata y el Mono comparten un sentido del humor travieso y una inteligencia aguda que los convierte en compañeros de fechorías perfectos. La Rata se siente fascinada por la creatividad y el ingenio del Mono, mientras que el Mono valora la astucia y la habilidad social de la Rata. Juntos, nunca hay un momento aburrido. Su relación está llena de risas, debates estimulantes y la capacidad de resolver cualquier problema con una solución ingeniosa y poco convencional. Se motivan mutuamente y su vínculo es una fuente constante de diversión y estímulo mental.",
    score: 5
  },
  "Dragon-Monkey": {
    report: "Una alianza de poder y brillantez. El Dragón aporta la visión, el carisma y la capacidad de liderazgo, mientras que el Mono aporta la estrategia, la inteligencia y la habilidad para maniobrar en situaciones complejas. Se admiran profundamente: el Dragón ama tener a su lado a un consejero tan astuto, y el Mono se siente atraído por la fuerza y la ambición del Dragón. Juntos son socialmente magnéticos, capaces de encantar a cualquiera y de llevar a cabo proyectos a gran escala. Su colaboración es exitosa porque el Mono sabe cómo hacer brillar al Dragón, y el Dragón confía plenamente en el ingenio del Mono.",
    score: 5
  },

  // Tríada de Afinidad 2: Buey, Serpiente, Gallo
  "Ox-Snake": {
    report: "Una conexión de almas tranquilas y sabias. El Buey, con su naturaleza paciente y trabajadora, ofrece a la Serpiente la estabilidad y seguridad que tanto valora. La Serpiente, a su vez, aporta una profundidad de pensamiento, una sabiduría y una intuición que fascinan al práctico Buey. Ambos son hogareños y prefieren círculos pequeños y de confianza. Su lealtad es silenciosa pero absoluta, creando un vínculo basado en una comprensión profunda y un respeto mutuo. Es una de las parejas más estables y armoniosas, donde la paz y la inteligencia se unen.",
    score: 5
  },
  "Ox-Rooster": {
    report: "El equipo de la eficiencia y la tradición. El Gallo, con su ojo para el detalle y su habilidad para la planificación, encuentra en el Buey al socio perfecto, diligente y capaz de ejecutar cualquier plan a la perfección. Ambos son trabajadores, conservadores y valoran la honestidad y el orden. El Gallo puede ser crítico, pero el Buey, con su paciencia, no se ofende fácilmente. Juntos, son excelentes para construir un hogar, un negocio o cualquier proyecto que requiera disciplina y atención meticulosa. Su relación es sólida, práctica y se basa en valores compartidos.",
    score: 4
  },
  "Snake-Rooster": {
    report: "Una alianza de mentes brillantes. La Serpiente, sabia e intuitiva, y el Gallo, analítico y perfeccionista, se conectan a un nivel intelectual profundo. Se admiran mutuamente por su inteligencia y su capacidad para ver patrones y detalles que otros pasan por alto. Son excelentes estrategas y planificadores, capaces de anticipar problemas y encontrar soluciones elegantes. Su lealtad es fuerte, basada en un respeto mutuo por la mente del otro. El Gallo aprecia la sabiduría de la Serpiente, y la Serpiente valora la eficiencia y el buen gusto del Gallo.",
    score: 5
  },

  // Tríada de Afinidad 3: Tigre, Caballo, Perro
  "Tiger-Horse": {
    report: "Un torbellino de pasión y libertad. El Tigre y el Caballo son espíritus libres que se sienten instantáneamente atraídos por la energía y el entusiasmo del otro. Su relación es dinámica, aventurera y nunca aburrida. Se dan mutuamente el espacio que necesitan para explorar y crecer, sin celos ni posesividad. Comparten un amor por la vida social, los viajes y las nuevas experiencias, lo que los convierte en compañeros de aventuras ideales. Se respetan profundamente y su conexión es optimista y llena de vida.",
    score: 5
  },
  "Tiger-Dog": {
    report: "Una unión de lealtad y respeto inquebrantables. El Perro, con su naturaleza ansiosa pero profundamente leal, encuentra en el valiente Tigre un protector y un líder en quien confiar. El Tigre, a su vez, valora la honestidad, el idealismo y el apoyo incondicional del Perro, encontrando un refugio seguro para su a veces turbulento corazón. El Perro es capaz de calmar los impulsos del Tigre, y el Tigre defiende al Perro contra cualquier injusticia. Juntos, forman un equipo basado en la confianza mutua y un profundo sentido de la justicia.",
    score: 4
  },
  "Tiger-Dragon": {
    report: "Una combinación de dos de los signos más poderosos y carismáticos del zodiaco. La relación entre el Tigre y el Dragón es una alianza de titanes, llena de energía, ambición y un profundo respeto mutuo por su fuerza. El Dragón admira el coraje y la audacia del Tigre, mientras que el Tigre se siente atraído por el liderazgo natural y la visión del Dragón. Juntos, son una pareja magnética y socialmente dominante, capaces de inspirar a otros y de embarcarse en grandes proyectos. El principal desafío es el choque de egos; ambos quieren liderar y pueden competir por el control. Si aprenden a colaborar como un equipo, donde el Dragón traza la estrategia y el Tigre ejecuta con pasión, su potencial es ilimitado. Es una relación dinámica y emocionante, pero requiere que ambos aprendan a compartir el trono.",
    score: 4
  },
  "Horse-Dog": {
    report: "Una pareja feliz, honesta y llena de calidez. El Caballo, siempre en movimiento, encuentra en el Perro un compañero leal que entiende su necesidad de libertad pero que siempre estará ahí a su regreso. El Perro, por su parte, se siente inspirado por el optimismo y la energía del Caballo, lo que le ayuda a superar sus propias ansiedades. Comparten una visión de la vida honesta y directa, y su comunicación es excelente. Es una relación basada en la amistad, el apoyo mutuo y una profunda lealtad.",
    score: 5
  },

  // Tríada de Afinidad 4: Conejo, Cabra, Cerdo
  "Rabbit-Goat": {
    report: "Una unión de ensueño, llena de arte, sensibilidad y armonía. El Conejo y la Cabra son almas gemelas en su amor por la paz, la belleza y un entorno tranquilo. El Conejo, con su diplomacia, sabe cómo manejar la naturaleza a veces caprichosa de la Cabra, mientras que la Cabra encuentra en el Conejo un compañero comprensivo que valora su creatividad. Ambos son hogareños y prefieren las reuniones íntimas a las grandes multitudes. Su hogar es un refugio de buen gusto y confort emocional. Es una de las combinaciones más pacíficas y artísticas.",
    score: 5
  },
  "Rabbit-Pig": {
    report: "Una conexión de pura bondad y disfrute. El Conejo y el Cerdo comparten un amor por la comodidad, la buena comida y una vida pacífica. La generosidad y el buen corazón del Cerdo hacen que el prudente Conejo se sienta seguro y cuidado. El Conejo, a su vez, aporta tacto y diplomacia, creando un hogar armonioso. Ambos disfrutan de la compañía de amigos y familiares, pero sin dramas ni complicaciones. Su relación es tranquila, estable y muy satisfactoria para ambos.",
    score: 5
  },
  "Goat-Pig": {
    report: "Una pareja de corazones tiernos. La Cabra, creativa y sensible, encuentra en el Cerdo un compañero generoso y tolerante que apoya incondicionalmente sus sueños. El Cerdo, a su vez, se siente atraído por la naturaleza artística y amable de la Cabra. Ambos son empáticos y saben cómo cuidarse mutuamente. Son capaces de crear un hogar lleno de calidez, confort y apoyo emocional. Su capacidad para perdonar y pasar por alto los pequeños defectos del otro hace que su relación sea muy duradera y feliz.",
    score: 5
  },

  // Amigos Secretos (Máxima compatibilidad, diferentes a las tríadas)
  "Rat-Ox": {
    report: "Una unión de poder y estabilidad. Aunque no forman parte de la misma tríada, son 'amigos secretos' en la astrología china, lo que indica una conexión profunda y complementaria. El Buey, fuerte y fiable, proporciona la base sólida y la seguridad que la inquieta Rata necesita. La Rata, a su vez, aporta ingenio, estrategia y una chispa de emoción a la vida del práctico Buey. Se respetan profundamente: la Rata admira la integridad del Buey, y el Buey valora la inteligencia de la Rata. Juntos, forman una pareja formidable tanto en los negocios como en el amor, capaces de construir un futuro próspero y seguro.",
    score: 5
  },
  "Tiger-Pig": {
    report: "Una combinación sorprendentemente armoniosa. El Cerdo, con su naturaleza amable y generosa, es capaz de calmar la naturaleza impulsiva y a veces temperamental del Tigre. El Tigre, a su vez, se siente atraído por la bondad del Cerdo y asume un papel protector. El Cerdo no compite con el Tigre, sino que le ofrece un refugio de paz y confort, algo que el Tigre valora enormemente. A cambio, el Tigre inspira al Cerdo a ser más valiente y a salir de su zona de confort. Es una relación de equilibrio y apoyo mutuo.",
    score: 5
  },
  "Rabbit-Dog": {
    report: "Una de las combinaciones más leales y confiables. El Perro, con su profundo sentido de la justicia y su naturaleza protectora, ofrece al sensible Conejo la seguridad que tanto anhela. El Conejo, por su parte, con su tacto y diplomacia, sabe cómo calmar las ansiedades del Perro y crear un ambiente de paz y armonía. Ambos valoran la tranquilidad del hogar y la lealtad por encima de todo. Es una relación basada en una confianza profunda y un entendimiento mutuo, donde ambos se sienten seguros y apoyados.",
    score: 5
  },
  "Dragon-Rooster": {
    report: "El visionario y el perfeccionista. El Dragón, con sus ideas grandiosas y su carisma, encuentra en el Gallo al socio ideal para llevar sus visiones a la realidad. El Gallo, con su ojo para el detalle, su capacidad de organización y su alto estándar de calidad, se asegura de que los planes del Dragón no solo sean impresionantes, sino también impecables. El Dragón admira la eficiencia del Gallo, y el Gallo se siente inspirado por el poder y la confianza del Dragón. Juntos, forman una pareja de éxito, destinada a lograr grandes cosas y a disfrutar de los frutos de su trabajo.",
    score: 5
  },
  "Snake-Monkey": {
    report: "Una batalla de ingenio en la que ambos ganan. La Serpiente, sabia y estratégica, y el Mono, innovador y astuto, se sienten mutuamente fascinados por su inteligencia. Su relación es un juego constante de ajedrez mental, donde se desafían y se estimulan. Aunque a veces pueden competir, su admiración por las habilidades del otro es mayor. Juntos, son capaces de resolver los problemas más complejos. La Serpiente ayuda a enfocar la energía dispersa del Mono, y el Mono aporta una chispa de diversión y creatividad a la vida de la seria Serpiente.",
    score: 4
  },
  "Horse-Goat": {
    report: "Una combinación dulce y equilibrada. El Caballo, enérgico y social, encuentra en la Cabra un remanso de paz y creatividad. La naturaleza amable y artística de la Cabra calma el espíritu a veces impaciente del Caballo. A cambio, el Caballo saca a la Cabra de su timidez y la introduce en un mundo de aventuras y vida social. Ambos aprecian la belleza y el placer, y juntos pueden crear un hogar lleno de arte y alegría. Es una relación de apoyo donde cada uno equilibra las debilidades del otro.",
    score: 5
  },
    
  // Choques (Peor compatibilidad)
  "Rat-Horse": {
    report: "Esta es la pareja de choque por excelencia. La Rata y el Caballo están en oposición directa en el zodíaco chino, lo que crea una tensión natural. La Rata es estratégica, calculadora y valora la seguridad. El Caballo es impulsivo, ama la libertad y odia sentirse controlado. La Rata puede percibir al Caballo como irresponsable y egocéntrico, mientras que el Caballo puede ver a la Rata como conspiradora y restrictiva. Su relación requiere un esfuerzo y una comprensión enormes para funcionar, ya que sus instintos básicos están en conflicto.",
    score: 1
  },
  "Ox-Goat": {
    report: "Otra pareja en oposición directa. El Buey es práctico, trabajador y metódico. La Cabra es artística, sensible y a veces caprichosa. El Buey no entiende la necesidad de la Cabra de soñar y puede verla como perezosa o poco práctica. La Cabra, por su parte, se siente incomprendida y sofocada por la rigidez y las expectativas del Buey. Sus enfoques de la vida son tan diferentes que la frustración es casi inevitable. Requieren una paciencia infinita para encontrar un terreno común.",
    score: 1
  },
  "Tiger-Monkey": {
    report: "El Tigre y el Mono son oponentes naturales. Es una relación llena de competencia, desconfianza y una constante lucha de poder. El Mono, con su ingenio rápido, disfruta desafiando la autoridad del Tigre, a menudo a través de bromas y trucos. El Tigre, orgulloso y poderoso, no tolera que se burlen de él y puede reaccionar con ira. Ambos son inteligentes, pero su energía choca. El Mono ve al Tigre como demasiado serio y dominante, y el Tigre ve al Mono como poco fiable y disruptivo.",
    score: 1
  },
  "Rabbit-Rooster": {
    report: "Una pareja de personalidades opuestas que difícilmente encuentran la armonía. El Conejo es diplomático, sensible y odia el conflicto. El Gallo es directo, crítico y perfeccionista. La tendencia del Gallo a señalar defectos, aunque sea con buena intención, hiere profundamente al Conejo. El Conejo, a su vez, puede parecerle al Gallo indeciso y poco práctico. El Gallo quiere orden y eficiencia, mientras que el Conejo busca paz y tranquilidad, dos objetivos que rara vez se alinean en esta combinación.",
    score: 1
  },
  "Dragon-Dog": {
    report: "El optimista se encuentra con el pesimista. El Dragón es un líder natural, lleno de confianza y grandes sueños. El Perro, por otro lado, es cauteloso, leal a sus principios y a menudo ve los posibles problemas antes que las oportunidades. El Dragón se siente frenado y criticado por la naturaleza ansiosa del Perro. El Perro, a su vez, desconfía de la arrogancia y la falta de atención a los riesgos del Dragón. Sus visiones del mundo son tan diferentes que les resulta muy difícil apoyarse mutuamente.",
    score: 1
  },
  "Snake-Pig": {
    report: "Una combinación de desconfianza y malentendidos. La Serpiente es reservada, intuitiva y siempre está pensando varios pasos por delante. El Cerdo es honesto, sociable y a veces un poco ingenuo. La Serpiente no puede evitar sospechar de la naturaleza abierta del Cerdo, mientras que el Cerdo se siente confundido y herido por el secretismo y la distancia de la Serpiente. Sus formas de operar en el mundo son tan distintas que la conexión es muy difícil de establecer y mantener.",
    score: 1
  },

  // Otras combinaciones para rellenar
  "Rat-Rabbit": {
    report: "Esta combinación, conocida como la 'penalidad de la falta de cortesía', presenta desafíos. La Rata, con su naturaleza directa y a veces oportunista, puede herir sin querer al Conejo, que es sensible y valora la paz por encima de todo. El Conejo puede ver a la Rata como demasiado agresiva o ruidosa, mientras que la Rata puede encontrar al Conejo demasiado tímido o indeciso. Para que funcione, la Rata debe aprender el arte del tacto, y el Conejo debe desarrollar una piel un poco más gruesa y expresar sus necesidades de forma más clara.",
    score: 2
  },
  "Ox-Tiger": {
    report: "Una relación de voluntades fuertes y estilos opuestos. El Buey es metódico, paciente y conservador. El Tigre es impulsivo, arriesgado y rebelde. El Buey quiere seguir el camino probado y seguro, mientras que el Tigre quiere abrir uno nuevo a través de la jungla. Hay una lucha de poder inherente. El Tigre se siente frustrado por la lentitud del Buey, y el Buey se exaspera con la imprudencia del Tigre. El respeto es posible si logran objetivos juntos, pero la armonía en la vida cotidiana es un desafío constante.",
    score: 2
  },
  "Tiger-Snake": {
    report: "Una combinación de tensión y desconfianza. El Tigre es abierto, directo y actúa por impulso. La Serpiente es reservada, sabia y prefiere planificar en secreto. Sus naturalezas son tan diferentes que les cuesta entenderse. El Tigre no confía en la naturaleza sigilosa de la Serpiente, y la Serpiente ve al Tigre como ruidoso y poco sofisticado. Se miran con recelo, lo que hace que una relación cercana y de confianza sea muy difícil de cultivar.",
    score: 2
  },
  "Horse-Rooster": {
    report: "Una pareja con potencial para la irritación mutua. El Caballo es un espíritu libre que odia ser criticado o controlado. El Gallo es un perfeccionista que no puede evitar señalar los defectos y tratar de 'mejorar' a su pareja. El Gallo ve al Caballo como inconsistente y desorganizado, y el Caballo ve al Gallo como un fastidioso y un aguafiestas. Pueden tener una vida social activa juntos, pero en la intimidad, la crítica constante del Gallo agotará la paciencia del Caballo.",
    score: 2
  }
};
