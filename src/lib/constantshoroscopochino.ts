
import type { ChineseAnimalSignName } from '@/types';

export interface ChineseCompatibilityReportDetail {
  report: string;
  score: number; // 1 to 5
}

export const chineseCompatibilityPairings: Record<string, ChineseCompatibilityReportDetail> = {
  // Tríada de Afinidad 1: Rata, Dragón, Mono
  "Rat-Dragon": {
    report: "Una de las combinaciones más exitosas y dinámicas del zodiaco chino. La Rata, con su astucia e ingenio, se siente irresistiblemente atraída por el poder, el carisma y la visión del Dragón. Es una atracción de mente y espíritu. El Dragón, a su vez, admira profundamente la inteligencia y la capacidad de la Rata para encontrar oportunidades donde otros no las ven, valorando su consejo estratégico. Juntos, forman un equipo de poder imparable. En el ámbito profesional, el Dragón lidera con confianza y grandeza, inspirando a todos con su audacia, mientras que la Rata trabaja tras bastidores, asegurando que cada detalle esté cubierto y cada estrategia sea impecable. Son el cerebro y el corazón de cualquier proyecto. Su admiración mutua es la base de un vínculo duradero, ya sea en los negocios, la amistad o el amor. Socialmente, son una pareja magnética; el Dragón es el centro de atención y la Rata es el encantador estratega que maneja las conexiones. El único desafío menor puede surgir si el ego del Dragón ignora las advertencias cautelosas de la Rata, pero la capacidad de la Rata para presentar sus argumentos de manera persuasiva generalmente gana el día. Es una alianza destinada al éxito y al respeto mutuo.",
    score: 5
  },
  "Rat-Monkey": {
    report: "Pura energía y complicidad. La Rata y el Mono comparten un sentido del humor travieso y una inteligencia aguda que los convierte en compañeros de fechorías perfectos. La Rata se siente fascinada por la creatividad y el ingenio del Mono, mientras que el Mono valora la astucia y la habilidad social de la Rata. Juntos, nunca hay un momento aburrido. Su relación está llena de risas, debates estimulantes y la capacidad de resolver cualquier problema con una solución ingeniosa y poco convencional. Se motivan mutuamente y su vínculo es una fuente constante de diversión y estímulo mental. En el amor, son juguetones y aventureros. En los negocios, son innovadores y capaces de pensar fuera de la caja, aunque pueden necesitar a alguien más práctico que les ayude a ejecutar sus brillantes planes. Son el tipo de amigos que siempre están tramando algo nuevo y emocionante.",
    score: 5
  },
  "Dragon-Monkey": {
    report: "Una alianza de poder y brillantez. El Dragón aporta la visión, el carisma y la capacidad de liderazgo, mientras que el Mono aporta la estrategia, la inteligencia y la habilidad para maniobrar en situaciones complejas. Se admiran profundamente: el Dragón ama tener a su lado a un consejero tan astuto, y el Mono se siente atraído por la fuerza y la ambición del Dragón. Juntos son socialmente magnéticos, capaces de encantar a cualquiera y de llevar a cabo proyectos a gran escala. Su colaboración es exitosa porque el Mono sabe cómo hacer brillar al Dragón, y el Dragón confía plenamente en el ingenio del Mono. A nivel personal, su relación es divertida y estimulante, aunque el Dragón debe tener cuidado de no ser demasiado dominante, y el Mono debe evitar usar su ingenio para manipular. Cuando hay respeto mutuo, son un equipo invencible.",
    score: 5
  },

  // Tríada de Afinidad 2: Buey, Serpiente, Gallo
  "Ox-Snake": {
    report: "Una conexión de almas tranquilas y sabias. El Buey, con su naturaleza paciente, trabajadora y leal, ofrece a la Serpiente la estabilidad y seguridad que tanto valora. La Serpiente, a su vez, aporta una profundidad de pensamiento, una sabiduría y una intuición que fascinan al práctico Buey. Ambos son hogareños y prefieren círculos sociales pequeños y de confianza. Su lealtad es silenciosa pero absoluta, creando un vínculo basado en una comprensión profunda y un respeto mutuo. Es una de las parejas más estables y armoniosas, donde la paz y la inteligencia se unen. El Buey gestiona el mundo práctico, mientras que la Serpiente navega por las complejidades emocionales y estratégicas. Su hogar es un santuario de paz.",
    score: 5
  },
  "Ox-Rooster": {
    report: "El equipo de la eficiencia y la tradición. El Gallo, con su ojo para el detalle, su perfeccionismo y su habilidad para la planificación, encuentra en el Buey al socio perfecto: diligente, fiable y capaz de ejecutar cualquier plan a la perfección. Ambos son trabajadores, conservadores y valoran la honestidad y el orden. El Gallo puede ser crítico, pero el Buey, con su paciencia infinita, no se ofende fácilmente. Juntos, son excelentes para construir un hogar, un negocio o cualquier proyecto que requiera disciplina y atención meticulosa. Su relación es sólida, práctica y se basa en valores compartidos. El Buey admira la capacidad de organización del Gallo, y el Gallo respeta la increíble ética de trabajo del Buey.",
    score: 4
  },
  "Snake-Rooster": {
    report: "Una alianza de mentes brillantes y estrategas natos. La Serpiente, sabia e intuitiva, y el Gallo, analítico y perfeccionista, se conectan a un nivel intelectual profundo. Se admiran mutuamente por su inteligencia y su capacidad para ver patrones y detalles que otros pasan por alto. Son excelentes planificadores, capaces de anticipar problemas y encontrar soluciones elegantes. Su lealtad es fuerte, basada en un respeto mutuo por la mente del otro. El Gallo aprecia la sabiduría y la calma de la Serpiente, y la Serpiente valora la eficiencia, el buen gusto y la honestidad del Gallo. Juntos, pueden tener éxito en cualquier empresa que requiera inteligencia y planificación meticulosa.",
    score: 5
  },

  // Tríada de Afinidad 3: Tigre, Caballo, Perro
  "Tiger-Horse": {
    report: "Un torbellino de pasión, libertad y aventura. El Tigre y el Caballo son espíritus libres que se sienten instantáneamente atraídos por la energía y el entusiasmo del otro. Su relación es dinámica, optimista y nunca aburrida. Se dan mutuamente el espacio que necesitan para explorar y crecer, sin celos ni posesividad, lo cual es fundamental para ambos. Comparten un amor por la vida social, los viajes y las nuevas experiencias, lo que los convierte en compañeros de aventuras ideales. Se respetan profundamente, y su conexión es una fuente constante de inspiración mutua para vivir la vida al máximo.",
    score: 5
  },
  "Tiger-Dog": {
    report: "Una unión de lealtad y respeto inquebrantables. El Perro, con su naturaleza a veces ansiosa pero profundamente leal, encuentra en el valiente y seguro Tigre un protector y un líder en quien confiar ciegamente. El Tigre, a su vez, valora la honestidad, el idealismo y el apoyo incondicional del Perro, encontrando un refugio seguro para su a veces turbulento corazón. El Perro es capaz de calmar los impulsos más temerarios del Tigre con su prudencia, y el Tigre defiende al Perro contra cualquier injusticia. Juntos, forman un equipo basado en la confianza mutua y un profundo sentido de la justicia, donde ambos se sienten seguros y valorados.",
    score: 4
  },
  "Tiger-Dragon": {
    report: "Una combinación de dos de los signos más poderosos y carismáticos del zodiaco. La relación entre el Tigre y el Dragón es una alianza de titanes, llena de energía, ambición y un profundo respeto mutuo por su fuerza. El Dragón admira el coraje y la audacia del Tigre, mientras que el Tigre se siente atraído por el liderazgo natural y la visión del Dragón. Juntos, son una pareja magnética y socialmente dominante, capaces de inspirar a otros y de embarcarse en grandes proyectos. El principal desafío es el choque de egos; ambos quieren liderar y pueden competir por el control. Si aprenden a colaborar como un equipo, donde el Dragón traza la estrategia y el Tigre ejecuta con pasión, su potencial es ilimitado. Es una relación dinámica y emocionante, pero requiere que ambos aprendan a compartir el trono.",
    score: 4
  },
  "Horse-Dog": {
    report: "Una pareja feliz, honesta y llena de calidez. El Caballo, siempre en movimiento y buscando nuevas experiencias, encuentra en el Perro un compañero leal que entiende su necesidad de libertad pero que siempre estará ahí a su regreso. El Perro, por su parte, se siente inspirado por el optimismo y la energía del Caballo, lo que le ayuda a superar sus propias ansiedades y a ver el lado positivo de la vida. Comparten una visión de la vida honesta y directa, y su comunicación es excelente. Es una relación basada en la amistad, el apoyo mutuo y una profunda lealtad, donde ambos se sienten libres y seguros al mismo tiempo.",
    score: 5
  },

  // Tríada de Afinidad 4: Conejo, Cabra, Cerdo
  "Rabbit-Goat": {
    report: "Una unión de ensueño, llena de arte, sensibilidad y armonía. El Conejo y la Cabra son almas gemelas en su amor por la paz, la belleza y un entorno tranquilo. El Conejo, con su diplomacia y tacto, sabe cómo manejar la naturaleza a veces caprichosa y emocional de la Cabra, ofreciéndole la estabilidad que necesita. La Cabra, a su vez, encuentra en el Conejo un compañero comprensivo que valora y admira su creatividad. Ambos son hogareños y prefieren las reuniones íntimas a las grandes multitudes. Su hogar es un refugio de buen gusto, confort emocional y creatividad. Es una de las combinaciones más pacíficas y artísticas del zodiaco.",
    score: 5
  },
  "Rabbit-Pig": {
    report: "Una conexión de pura bondad, disfrute y confort mutuo. El Conejo y el Cerdo comparten un amor por la comodidad, la buena comida y una vida pacífica y sin complicaciones. La generosidad y el buen corazón del Cerdo hacen que el prudente y a veces cauteloso Conejo se sienta completamente seguro y cuidado. El Conejo, a su vez, aporta tacto, diplomacia y un sentido de la estética que el Cerdo aprecia enormemente, creando un hogar armonioso y acogedor. Ambos disfrutan de la compañía de amigos y familiares, pero sin dramas. Su relación es tranquila, estable y muy satisfactoria para ambos.",
    score: 5
  },
  "Goat-Pig": {
    report: "Una pareja de corazones tiernos y empáticos. La Cabra, creativa, sensible y a veces insegura, encuentra en el Cerdo un compañero generoso, tolerante y optimista que apoya incondicionalmente sus sueños. El Cerdo se siente atraído por la naturaleza artística y amable de la Cabra, y disfruta cuidando de ella. Ambos son capaces de crear un hogar lleno de calidez, confort y apoyo emocional. La capacidad del Cerdo para perdonar y pasar por alto los pequeños dramas de la Cabra, y la apreciación de la Cabra por la bondad del Cerdo, hace que su relación sea muy duradera y feliz.",
    score: 5
  },

  // Amigos Secretos (Máxima compatibilidad, diferentes a las tríadas)
  "Rat-Ox": {
    report: "Una unión de poder y estabilidad. Aunque no forman parte de la misma tríada, son 'amigos secretos' en la astrología china, lo que indica una conexión profunda y complementaria. El Buey, fuerte y fiable, proporciona la base sólida y la seguridad que la inquieta Rata necesita para prosperar. La Rata, a su vez, aporta ingenio, estrategia y una chispa de emoción a la vida del práctico Buey. Se respetan profundamente: la Rata admira la integridad del Buey, y el Buey valora la inteligencia de la Rata. Juntos, forman una pareja formidable tanto en los negocios como en el amor, capaces de construir un futuro próspero y seguro, equilibrando perfectamente el riesgo y la recompensa.",
    score: 5
  },
  "Tiger-Pig": {
    report: "Una combinación sorprendentemente armoniosa de opuestos aparentes. El Cerdo, con su naturaleza amable, generosa y amante del placer, es capaz de calmar la naturaleza impulsiva y a veces temperamental del Tigre. El Tigre, a su vez, se siente profundamente atraído por la bondad del Cerdo y asume un papel protector. El Cerdo no compite con el Tigre, sino que le ofrece un refugio de paz, confort y aceptación, algo que el Tigre valora enormemente. A cambio, el Tigre inspira al Cerdo a ser más valiente y a salir de su zona de confort. Es una relación de equilibrio y apoyo mutuo, donde la fuerza se une a la gentileza.",
    score: 5
  },
  "Rabbit-Dog": {
    report: "Una de las combinaciones más leales y confiables. El Perro, con su profundo sentido de la justicia y su naturaleza protectora, ofrece al sensible y a veces ansioso Conejo la seguridad que tanto anhela. El Conejo, por su parte, con su tacto, diplomacia y amor por la armonía, sabe cómo calmar las ansiedades del Perro y crear un ambiente de paz. Ambos valoran la tranquilidad del hogar y la lealtad por encima de todo. Es una relación basada en una confianza profunda y un entendimiento mutuo, donde ambos se sienten seguros, apoyados y capaces de ser ellos mismos sin temor.",
    score: 5
  },
  "Dragon-Rooster": {
    report: "El visionario y el perfeccionista. El Dragón, con sus ideas grandiosas y su carisma, encuentra en el Gallo al socio ideal para llevar sus visiones a la realidad. El Gallo, con su ojo para el detalle, su capacidad de organización y su alto estándar de calidad, se asegura de que los planes del Dragón no solo sean impresionantes, sino también impecables y funcionales. El Dragón admira la eficiencia del Gallo, y el Gallo se siente inspirado por el poder y la confianza del Dragón. Juntos, forman una pareja de éxito, destinada a lograr grandes cosas y a disfrutar de los frutos de su trabajo, combinando la visión con la ejecución perfecta.",
    score: 5
  },
  "Snake-Monkey": {
    report: "Una batalla de ingenio en la que ambos ganan. La Serpiente, sabia y estratégica, y el Mono, innovador y astuto, se sienten mutuamente fascinados por su inteligencia. Su relación es un juego constante de ajedrez mental, donde se desafían y se estimulan. Aunque a veces pueden competir, su admiración por las habilidades del otro es mayor. Juntos, son capaces de resolver los problemas más complejos. La Serpiente ayuda a enfocar la energía dispersa del Mono, y el Mono aporta una chispa de diversión y creatividad a la vida de la seria Serpiente. Su dinámica es electrizante y nunca aburrida.",
    score: 4
  },
  "Horse-Goat": {
    report: "Una combinación dulce y equilibrada. El Caballo, enérgico, social y amante de la libertad, encuentra en la Cabra un remanso de paz y creatividad. La naturaleza amable y artística de la Cabra calma el espíritu a veces impaciente del Caballo. A cambio, el Caballo saca a la Cabra de su timidez y la introduce en un mundo de aventuras y vida social, dándole la confianza que necesita. Ambos aprecian la belleza y el placer, y juntos pueden crear un hogar lleno de arte y alegría. Es una relación de apoyo donde cada uno equilibra las debilidades del otro, creando una armonía duradera.",
    score: 5
  },
    
  // Choques (Peor compatibilidad)
  "Rat-Horse": {
    report: "Esta es la pareja de choque por excelencia. La Rata y el Caballo están en oposición directa en el zodíaco chino, lo que crea una tensión natural. La Rata es estratégica, calculadora y valora la seguridad. El Caballo es impulsivo, ama la libertad y odia sentirse controlado. La Rata puede percibir al Caballo como irresponsable, egoísta e inconsistente, mientras que el Caballo puede ver a la Rata como conspiradora, restrictiva y tacaña. Su relación requiere un esfuerzo y una comprensión enormes para funcionar, ya que sus instintos básicos y su forma de ver el mundo están en conflicto constante.",
    score: 1
  },
  "Ox-Goat": {
    report: "Otra pareja en oposición directa, donde la practicidad choca con la sensibilidad. El Buey es práctico, trabajador, metódico y espera que los demás también lo sean. La Cabra es artística, emocional, sensible y a veces caprichosa. El Buey no entiende la necesidad de la Cabra de soñar y puede verla como perezosa o poco práctica. La Cabra, por su parte, se siente incomprendida, criticada y sofocada por la rigidez y las expectativas del Buey. Sus enfoques de la vida son tan diferentes que la frustración es casi inevitable.",
    score: 1
  },
  "Tiger-Monkey": {
    report: "El Tigre y el Mono son oponentes naturales en una lucha de poder constante. Es una relación llena de competencia, desconfianza y desafíos. El Mono, con su ingenio rápido, disfruta desafiando la autoridad del Tigre, a menudo a través de bromas y trucos que el Tigre no encuentra divertidos. El Tigre, orgulloso y poderoso, no tolera que se burlen de él y puede reaccionar con ira ante lo que percibe como falta de respeto. Ambos son inteligentes, pero su energía choca. El Mono ve al Tigre como demasiado serio y dominante, y el Tigre ve al Mono como poco fiable, irrespetuoso y disruptivo.",
    score: 1
  },
  "Rabbit-Rooster": {
    report: "Una pareja de personalidades opuestas que difícilmente encuentran la armonía. El Conejo es diplomático, sensible y odia el conflicto por encima de todo. El Gallo es directo, crítico y un perfeccionista nato. La tendencia del Gallo a señalar defectos, aunque sea con la intención de 'ayudar', hiere profundamente la sensibilidad del Conejo. El Conejo, a su vez, con su necesidad de paz y tranquilidad, puede parecerle al Gallo indeciso y poco práctico. El Gallo quiere orden y eficiencia, mientras que el Conejo busca un ambiente de aceptación y calma, dos objetivos que rara vez se alinean en esta combinación.",
    score: 1
  },
  "Dragon-Dog": {
    report: "El optimista visionario se encuentra con el realista cínico. El Dragón es un líder natural, lleno de confianza y grandes sueños, que espera que los demás le sigan. El Perro, por otro lado, es cauteloso, leal a sus principios y a menudo ve los posibles problemas y peligros antes que las oportunidades. El Dragón se siente frenado y criticado por la naturaleza ansiosa y pesimista del Perro. El Perro, a su vez, desconfía de la arrogancia y la falta de atención a los riesgos del Dragón. Sus visiones del mundo son tan diferentes que les resulta muy difícil apoyarse y confiar mutuamente.",
    score: 1
  },
  "Snake-Pig": {
    report: "Una combinación de desconfianza y malentendidos fundamentales. La Serpiente es reservada, intuitiva, compleja y siempre está pensando varios pasos por delante. El Cerdo es honesto, sociable, directo y a veces un poco ingenuo. La Serpiente no puede evitar sospechar de la naturaleza abierta y confiada del Cerdo, viéndolo como simplista. El Cerdo, por su parte, se siente confundido y herido por el secretismo, la distancia emocional y la naturaleza calculadora de la Serpiente. Sus formas de operar en el mundo son tan distintas que la conexión y la confianza son muy difíciles de establecer y mantener.",
    score: 1
  },

  // Otras combinaciones para rellenar
  "Rat-Rabbit": {
    report: "Esta combinación, conocida como la 'penalidad de la falta de cortesía', presenta desafíos significativos. La Rata, con su naturaleza directa y a veces oportunista, puede herir sin querer al Conejo, que es sensible y valora la paz por encima de todo. El Conejo puede ver a la Rata como demasiado agresiva, ruidosa y egocéntrica, mientras que la Rata puede encontrar al Conejo demasiado tímido, indeciso y pasivo. Para que funcione, la Rata debe aprender el arte del tacto y la consideración, y el Conejo debe desarrollar una piel un poco más gruesa y expresar sus necesidades de forma más clara y directa en lugar de retirarse.",
    score: 2
  },
  "Ox-Tiger": {
    report: "Una relación de voluntades fuertes y estilos opuestos. El Buey es metódico, paciente y conservador. El Tigre es impulsivo, arriesgado y rebelde. El Buey quiere seguir el camino probado y seguro, mientras que el Tigre quiere abrir uno nuevo a través de la jungla con un machete. Hay una lucha de poder inherente. El Tigre se siente frustrado por la lentitud y la cautela del Buey, y el Buey se exaspera con la imprudencia y la falta de planificación del Tigre. El respeto es posible si logran objetivos juntos en un entorno profesional, pero la armonía en la vida cotidiana es un desafío constante.",
    score: 2
  },
  "Tiger-Snake": {
    report: "Una combinación de tensión y desconfianza. El Tigre es abierto, directo y actúa por impulso, mostrando sus emociones con facilidad. La Serpiente es reservada, sabia y prefiere planificar en secreto, ocultando sus verdaderas intenciones. Sus naturalezas son tan diferentes que les cuesta entenderse. El Tigre no confía en la naturaleza sigilosa y calculadora de la Serpiente, y la Serpiente ve al Tigre como ruidoso, imprudente y poco sofisticado. Se miran con recelo, lo que hace que una relación cercana y de confianza sea muy difícil de cultivar y mantener.",
    score: 2
  },
  "Horse-Rooster": {
    report: "Una pareja con potencial para la irritación mutua. El Caballo es un espíritu libre que odia ser criticado o controlado, y valora la espontaneidad. El Gallo es un perfeccionista que no puede evitar señalar los defectos y tratar de 'mejorar' a su pareja, valorando el orden y la planificación. El Gallo ve al Caballo como inconsistente, desorganizado y superficial. El Caballo ve al Gallo como un fastidioso, un aguafiestas y demasiado crítico. Pueden tener una vida social activa juntos, pero en la intimidad, la crítica constante del Gallo agotará la paciencia del Caballo.",
    score: 2
  }
};
