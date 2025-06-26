
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

  // --- Combinaciones de la Rata ---
  "Rat-Rat": {
    report: "Cuando dos Ratas se unen, la conexión es instantánea. Se reconocen en su inteligencia, su ambición y su encanto social. Juntos, son un equipo formidable para los negocios y la vida social, capaces de crear redes y aprovechar oportunidades que otros no ven. Su hogar es a menudo un centro de actividad y conversación. La competencia puede surgir, ya que ambos son astutos, pero si celebran los éxitos del otro como un logro conjunto, su vínculo es fuerte y próspero.",
    score: 4
  },
  "Rat-Snake": {
    report: "Una combinación intrigante y magnética de astucia y sabiduría. La Rata se siente fascinada por la mente profunda, la calma y el misterio de la Serpiente. La Serpiente, a su vez, respeta la inteligencia rápida y la habilidad de la Rata para prosperar. Son una excelente pareja para la estrategia y la planificación a largo plazo, aunque la naturaleza social de la Rata puede chocar con la posesividad de la Serpiente si no hay confianza plena.",
    score: 4
  },
  "Rat-Goat": {
    report: "Esta es una de las combinaciones más desafiantes. La Rata, práctica y ambiciosa, tiene dificultades para entender la naturaleza emocional, soñadora y a veces poco práctica de la Cabra. La Cabra, a su vez, se siente herida por la crítica directa y el enfoque materialista de la Rata. Para que funcione, la Rata debe aprender a valorar la creatividad y la sensibilidad, y la Cabra a ser un poco más práctica.",
    score: 2
  },
  "Rat-Rooster": {
    report: "Una relación llena de debates y críticas. Tanto la Rata como el Gallo son inteligentes y elocuentes, pero sus estilos chocan. El Gallo es directo, perfeccionista y crítico, lo que irrita a la Rata, que prefiere usar su ingenio de forma más sutil. La Rata puede ver al Gallo como arrogante y ruidoso. La clave del éxito es aprender a respetar sus diferentes estilos de comunicación y no tomarse las críticas como un ataque personal.",
    score: 2
  },
  "Rat-Dog": {
    report: "Una combinación sólida basada en el respeto mutuo. La Rata admira la lealtad, la honestidad y el idealismo del Perro. El Perro, a su vez, respeta la inteligencia y la capacidad de la Rata para cuidar de su familia. El oportunismo ocasional de la Rata puede chocar con el alto sentido de la moralidad del Perro, pero su lealtad mutua generalmente supera cualquier diferencia.",
    score: 3
  },
  "Rat-Pig": {
    report: "Una pareja muy feliz y armoniosa. La naturaleza generosa, optimista y de buen corazón del Cerdo hace que la Rata se sienta completamente segura y amada. El Cerdo no juzga la naturaleza ambiciosa de la Rata, sino que disfruta de la comodidad y la seguridad que esta le proporciona. Es una relación llena de afecto y disfrute mutuo. El único riesgo es que ambos pueden ser un poco indulgentes.",
    score: 4
  },

  // --- Combinaciones del Tigre ---
  "Tiger-Rat": {
    report: "El poderoso Tigre y la astuta Rata forman una pareja intrigante basada en el respeto mutuo por la inteligencia y la capacidad de supervivencia del otro. La Rata admira el coraje y el carisma del Tigre, mientras que el Tigre se siente atraído por el ingenio rápido y la habilidad de la Rata para navegar situaciones sociales complejas. Pueden ser excelentes socios en proyectos que requieren tanto audacia como estrategia. Sin embargo, sus estilos chocan: el Tigre es impulsivo y actúa a gran escala, mientras que la Rata es más cautelosa y oportunista. La Rata puede encontrar al Tigre demasiado imprudente, y el Tigre puede ver a la Rata como demasiado calculadora. Su éxito depende de que el Tigre escuche los consejos estratégicos de la Rata y de que la Rata confíe en el liderazgo valiente del Tigre.",
    score: 3
  },
  "Tiger-Tiger": {
    report: "Dos Tigres juntos son una fuerza de la naturaleza. La atracción es instantánea, basada en una comprensión mutua de su necesidad de libertad, pasión e independencia. Su relación es intensa, emocionante y nunca aburrida. Sin embargo, es precisamente esta similitud la que crea su mayor desafío: ¿quién lidera? Ambos son dominantes y orgullosos, lo que puede llevar a épicas luchas de poder. Si compiten, la relación puede volverse destructiva. Pero si aprenden a funcionar como un equipo de iguales, turnándose el liderazgo o enfocando su energía en un enemigo común, son una pareja imparable. Su lealtad es feroz, pero también lo es su temperamento. La clave es el respeto y el espacio.",
    score: 3
  },
  "Tiger-Goat": {
    report: "Una pareja que combina la fuerza con la creatividad. El Tigre, audaz y enérgico, se siente atraído por la naturaleza amable, artística y gentil de la Cabra. La Cabra, a su vez, admira la confianza y el coraje del Tigre, sintiéndose segura bajo su protección. El Tigre puede inspirar a la Cabra a tener más confianza en sí misma y a mostrar su talento al mundo. Sin embargo, pueden surgir conflictos por sus diferentes ritmos de vida. El Tigre es activo y social, mientras que la Cabra es más hogareña y emocional. El Tigre puede impacientarse con la sensibilidad de la Cabra, y la Cabra puede sentirse descuidada por la independencia del Tigre. Si aprenden a apreciar sus diferencias, el Tigre puede proporcionar la fuerza y la Cabra la inspiración, creando un hogar lleno de pasión y creatividad.",
    score: 3
  },
  "Tiger-Rooster": {
    report: "El líder audaz se encuentra con el perfeccionista meticuloso. El Tigre, con su visión a gran escala y su enfoque en la acción, y el Gallo, con su atención al detalle y su necesidad de orden, tienen estilos de trabajo muy diferentes. El Gallo no puede evitar señalar los defectos y las áreas de mejora, lo que el orgulloso Tigre puede percibir como una crítica constante y una falta de confianza. El Tigre, a su vez, puede ver al Gallo como quisquilloso, limitante y demasiado preocupado por trivialidades. Su relación puede funcionar en un entorno profesional si tienen roles muy definidos, pero en una relación personal, la crítica del Gallo y el orgullo del Tigre están en un curso de colisión constante.",
    score: 2
  },

  // --- Combinaciones del Conejo ---
  "Rabbit-Rat": {
    report: "Esta combinación, conocida como la 'penalidad de la falta de cortesía', presenta desafíos significativos. La Rata, con su naturaleza directa y a veces oportunista, puede herir sin querer al Conejo, que es sensible y valora la paz por encima de todo. El Conejo puede ver a la Rata como demasiado agresiva, ruidosa y egocéntrica, mientras que la Rata puede encontrar al Conejo demasiado tímido, indeciso y pasivo. Para que funcione, la Rata debe aprender el arte del tacto y la consideración, y el Conejo debe desarrollar una piel un poco más gruesa y expresar sus necesidades de forma más clara y directa en lugar de retirarse.",
    score: 2
  },
  "Rabbit-Tiger": {
    report: "Una combinación de poder y gentileza que requiere un cuidado delicado. El diplomático y sensible Conejo puede sentirse fácilmente abrumado por la naturaleza poderosa, directa y a veces impulsiva del Tigre. El Conejo anhela la paz y la armonía, mientras que el Tigre prospera en el desafío y la competencia. Para que esta relación funcione, el Tigre debe aprender a suavizar su enfoque, actuando como un protector gentil en lugar de un depredador. El Conejo, a su vez, debe aprender a expresar sus límites con claridad en lugar de simplemente retirarse. Si el Tigre ofrece seguridad y el Conejo ofrece un refugio de paz, pueden encontrar un equilibrio, pero requiere un esfuerzo consciente de ambas partes.",
    score: 2
  },
  "Rabbit-Ox": {
    report: "El Buey, firme y trabajador, ofrece un ancla de seguridad que el a veces ansioso Conejo encuentra increíblemente reconfortante. El Conejo, a su vez, aporta una gracia social y un refinamiento que suavizan la vida del pragmático Buey. Juntos, pueden construir un hogar muy pacífico y estable, basado en valores compartidos de lealtad y tranquilidad. Fortalezas: Su principal fortaleza es el equilibrio. El Buey proporciona la estructura y la fiabilidad, mientras que el Conejo se encarga de la diplomacia y la estética, creando un ambiente armonioso. El Buey admira la inteligencia y el buen gusto del Conejo, y el Conejo respeta profundamente la integridad y la fuerza silenciosa del Buey. Desafíos: La comunicación puede ser un desafío. El Buey es directo y práctico, mientras que el Conejo es más sutil y evita la confrontación, lo que puede llevar a que los problemas no se discutan abiertamente. El Conejo puede encontrar al Buey demasiado rígido, y el Buey puede ver al Conejo como demasiado cauteloso o indeciso. Clave del éxito: El respeto por sus diferentes ritmos es crucial. Si el Conejo aprende a ser más directo con sus necesidades y el Buey aprende a apreciar la necesidad de paz y belleza del Conejo, forman una pareja sólida y duradera.",
    score: 3
  },
  "Rabbit-Rabbit": {
    report: "Dos Conejos juntos es la encarnación de la paz, la diplomacia y el confort. Se entienden a un nivel profundo, compartiendo un amor por la armonía, la belleza y un hogar tranquilo. Su relación es un refugio seguro del caos del mundo exterior, llena de gentileza y consideración mutua. Son excelentes anfitriones para reuniones íntimas y se apoyan en su necesidad de evitar el drama. Fortalezas: Una comprensión casi telepática. Saben instintivamente cómo hacerse sentir seguros y amados. Su vida social es refinada y su hogar es un santuario de buen gusto y tranquilidad. Desafíos: Su aversión compartida al conflicto es su mayor debilidad. Pueden barrer los problemas debajo de la alfombra hasta que se vuelven insuperables. La falta de un líder decisivo puede llevar a la indecisión y a la pasividad ante los desafíos de la vida, esperando que el otro tome la iniciativa. Clave del éxito: Deben hacer un pacto para abordar los problemas de frente, con la misma diplomacia que usan con los demás. Asumir la responsabilidad por turnos en la toma de decisiones y animarse mutuamente a ser un poco más audaces fortalecerá su vínculo y evitará el estancamiento.",
    score: 4
  },
  "Rabbit-Dragon": {
    report: "Una combinación fascinante de la diplomacia y el poder. El Conejo, astuto y refinado, es uno de los pocos signos que puede manejar el ego y la energía del poderoso Dragón sin entrar en conflicto directo. El Dragón, a su vez, se siente atraído por la inteligencia, el buen gusto y la gracia social del Conejo. Fortalezas: El Conejo es el estratega perfecto detrás del trono, ofreciendo consejos sabios y gestionando las relaciones sociales que el Dragón necesita para su éxito. El Dragón ofrece al Conejo protección, emoción y un estatus social elevado. Juntos, son una pareja socialmente brillante y muy respetada. Desafíos: El Dragón puede ser demasiado dominante y su energía abrumadora puede estresar al sensible Conejo. El Conejo debe tener cuidado de no volverse demasiado pasivo-agresivo si se siente ignorado. El Dragón necesita acción y drama, mientras que el Conejo prefiere la paz, lo que requiere un compromiso constante. Clave del éxito: El Conejo debe aprender a expresar sus necesidades con una diplomacia firme, y el Dragón debe aprender a valorar y escuchar los consejos de su sabio compañero. Si el Dragón protege y el Conejo guía, su unión es exitosa.",
    score: 3
  },
  "Rabbit-Snake": {
    report: "Una pareja elegante, inteligente y muy compatible. Ambos son refinados, sabios y prefieren un enfoque más sutil de la vida. Comparten un amor por el arte, la cultura y un ambiente tranquilo y hermoso. Se comunican a menudo en un nivel no verbal, apreciando la inteligencia y la profundidad del otro. Fortalezas: La Serpiente se siente segura con la naturaleza diplomática y no confrontacional del Conejo. El Conejo admira la sabiduría y la calma de la Serpiente. Ambos son planificadores cuidadosos y disfrutan construyendo una vida confortable y estéticamente agradable. Son leales y valoran la confianza. Desafíos: Ambos pueden ser un poco reservados y posesivos. La Serpiente puede ser más intensa emocionalmente, lo que podría asustar al Conejo si se siente presionado. Deben tener cuidado de no caer en un círculo de sospecha si la comunicación no es clara. Clave del éxito: La confianza es fundamental. Una vez establecida, su vínculo es profundo y duradero. Compartir intereses intelectuales y artísticos fortalecerá su conexión y les dará un terreno común seguro.",
    score: 4
  },
  "Rabbit-Horse": {
    report: "Una combinación desafiante de estabilidad contra libertad. El Conejo anhela un hogar seguro, paz y rutina, mientras que el Caballo necesita aventura, independencia y estímulo constante. Sus necesidades fundamentales están en conflicto directo. Fortalezas: Pueden tener una vida social divertida al principio. El Caballo se siente atraído por el encanto del Conejo, y el Conejo por el optimismo del Caballo. Pueden aprender mucho el uno del otro si están dispuestos a hacer un gran esfuerzo. Desafíos: El estilo de vida impulsivo y arriesgado del Caballo genera ansiedad en el cauteloso Conejo. El Conejo puede ver al Caballo como egoísta e poco fiable. A su vez, el Caballo se siente enjaulado por la necesidad del Conejo de quedarse en casa y su aversión a la espontaneidad. Clave del éxito: Requiere un compromiso enorme. Deben encontrar un equilibrio muy delicado entre la seguridad del hogar y la aventura exterior, y respetar profundamente las necesidades opuestas del otro, lo cual es muy difícil a largo plazo.",
    score: 2
  },
  "Rabbit-Monkey": {
    report: "El diplomático astuto se encuentra con el genio travieso. Esta es una combinación que puede ser divertida o exasperante, dependiendo del contexto. Ambos son inteligentes, pero usan su ingenio de maneras muy diferentes. Fortalezas: Pueden compartir un humor agudo y disfrutar de juegos mentales y sociales. El Mono puede ayudar al Conejo a ser menos serio, y el Conejo puede ayudar al Mono a ser más diplomático. Desafíos: La naturaleza disruptiva y a veces caótica del Mono perturba la paz que el Conejo tanto necesita. El Conejo valora la honestidad y la sutileza, mientras que al Mono le encantan las bromas y los trucos. El Conejo puede encontrar al Mono poco fiable y agotador, y el Mono puede ver al Conejo como aburrido y demasiado sensible. Clave del éxito: Funciona mejor como una amistad casual que como una asociación profunda. Requiere que el Conejo desarrolle un gran sentido del humor y que el Mono aprenda a respetar los límites y la necesidad de tranquilidad del Conejo.",
    score: 2
  },

  // --- Combinaciones del Dragón ---
  "Dragon-Ox": {
    report: "El carismático y visionario Dragón se encuentra con el pragmático y firme Buey. Esta es una unión de poder y estabilidad, pero también de voluntades fuertes y enfoques diferentes. El Dragón, audaz y amante del riesgo, puede encontrar al Buey demasiado conservador y lento. El Buey, por su parte, valora la seguridad y los métodos probados, y puede ver al Dragón como imprudente y arrogante. Fortalezas: Si logran alinear sus metas, son un equipo formidable para construir un imperio. El Dragón aporta la visión y la capacidad de inspirar, mientras que el Buey proporciona la estructura, la disciplina y la determinación para ejecutar el plan a la perfección. El Buey puede anclar al Dragón a la realidad, y el Dragón puede motivar al Buey a pensar a lo grande. Desafíos: La terquedad es su mayor problema. Ambos son signos dominantes y les cuesta ceder. El Dragón necesita admiración y libertad, mientras que el Buey necesita previsibilidad y orden. Sus diferentes ritmos y valores pueden generar conflictos constantes. Clave del éxito: Respeto mutuo por sus diferentes fortalezas. El Dragón debe valorar la increíble fiabilidad y paciencia del Buey, y el Buey debe aprender a confiar en la visión y el carisma del Dragón, dándole espacio para brillar. Roles claros son esenciales.",
    score: 3
  },
  "Dragon-Dragon": {
    report: "Cuando dos Dragones se unen, el resultado es una explosión de carisma, ambición y magnificencia. Es una relación entre dos majestuosas realezas, llena de pasión, drama y un deseo compartido por vivir la vida a lo grande. Se entienden a la perfección en su necesidad de ser admirados y de liderar. Fortalezas: Una energía y confianza combinadas que pueden conquistar el mundo. Se apoyan mutuamente en sus ambiciosas metas y celebran sus éxitos con gran fanfarria. Su vida social es deslumbrante y son una 'power couple' natural que inspira a todos a su alrededor. Desafíos: El choque de egos es inevitable y puede ser de proporciones épicas. ¿Quién es el líder? ¿Quién tiene la última palabra? La competencia por el centro de atención puede ser agotadora y llevar a conflictos dramáticos. Ambos son orgullosos y no se disculpan fácilmente. Clave del éxito: Aprender a gobernar juntos en un reino compartido, no luchar por un solo trono. Deben ver el éxito del otro como un reflejo de su propio éxito. Canalizar su energía competitiva hacia metas externas y practicar la humildad ocasional fortalecerá su vínculo y lo hará verdaderamente invencible.",
    score: 4
  },
  "Dragon-Snake": {
    report: "El magnánimo y extrovertido Dragón se encuentra con la sabia y enigmática Serpiente. Esta es una combinación de poder y sabiduría, donde el carisma se une a la estrategia. La Serpiente, con su mente profunda y su intuición, es uno de los pocos signos que puede fascinar y aconsejar al poderoso Dragón, quien a su vez se siente atraído por la inteligencia y el encanto misterioso de la Serpiente. Fortalezas: El Dragón aporta la energía y la visión para liderar, mientras que la Serpiente proporciona la estrategia y la sabiduría para asegurar que los planes sean sólidos. La Serpiente no compite por el protagonismo, sino que prefiere influir desde las sombras, lo que complace al ego del Dragón. Son una pareja muy inteligente y socialmente hábil. Desafíos: La naturaleza posesiva de la Serpiente puede chocar con la necesidad del Dragón de ser admirado por todos. El Dragón es abierto y directo, mientras que la Serpiente puede ser reservada y calculadora, lo que podría generar desconfianza si la comunicación no es clara. Clave del éxito: El Dragón debe ofrecer a la Serpiente la lealtad y seguridad que anhela, mientras que la Serpiente debe aprender a confiar en la naturaleza social del Dragón sin sentirse amenazada. La admiración mutua por sus diferentes tipos de inteligencia es la base de su éxito.",
    score: 4
  },
  "Dragon-Horse": {
    report: "Una pareja vibrante, enérgica y llena de pasión por la vida. Tanto el Dragón como el Caballo son extrovertidos, aman la aventura y disfrutan de una vida social activa. Se sienten atraídos por la confianza y el entusiasmo del otro, creando una relación dinámica y optimista. Fortalezas: Nunca se aburren. Su vida está llena de viajes, fiestas y nuevos proyectos. Se dan mutuamente la libertad que necesitan para explorar sus intereses individuales, lo que evita la sensación de estar atrapados. Ambos son generosos y de gran corazón. Desafíos: Ambos pueden ser egocéntricos y temperamentales. El Dragón necesita ser el centro del universo, y el Caballo necesita libertad para galopar. Pueden surgir conflictos si el Dragón se vuelve demasiado controlador o si el Caballo parece demasiado independiente y desinteresado. Clave del éxito: El respeto por la independencia del otro es fundamental. Deben encontrar aventuras que puedan compartir juntos para mantener viva la llama. La comunicación abierta sobre sus necesidades de atención (Dragón) y libertad (Caballo) evitará malentendidos.",
    score: 4
  },
  "Dragon-Goat": {
    report: "El poderoso y visionario Dragón se encuentra con la gentil y artística Cabra. Esta es una combinación que requiere mucho esfuerzo y comprensión, ya que sus naturalezas y prioridades son muy diferentes. El Dragón busca la grandeza y el reconocimiento público, mientras que la Cabra anhela la paz, la armonía y la seguridad emocional. Fortalezas: El Dragón puede ofrecer a la Cabra la confianza y la protección que a menudo necesita, animándola a compartir su creatividad con el mundo. La Cabra, a su vez, puede enseñar al Dragón sobre la sensibilidad, la empatía y la importancia de un hogar tranquilo y hermoso, suavizando sus bordes más duros. Desafíos: El Dragón puede ver a la Cabra como demasiado pasiva, indecisa y emocional. La Cabra puede sentirse abrumada, intimidada y descuidada por la energía dominante y el enfoque externo del Dragón. Sus estilos de vida rara vez coinciden. Clave del éxito: El Dragón debe aprender a ser un protector gentil, no un líder autoritario, y a valorar la paz y la creatividad que la Cabra aporta. La Cabra debe desarrollar una mayor confianza en sí misma y aprender a comunicar sus necesidades sin depender de la compasión del Dragón.",
    score: 2
  },
  "Dragon-Pig": {
    report: "El poderoso y extravagante Dragón encuentra un admirador leal y un compañero de disfrute en el generoso y bondadoso Cerdo. El Cerdo no tiene ningún interés en competir por el protagonismo y se siente genuinamente feliz celebrando los éxitos del Dragón. Fortalezas: El Cerdo ofrece al Dragón un amor incondicional, honestidad y una apreciación sincera que nutre el ego del Dragón. El Dragón, a cambio, ofrece al Cerdo emoción, protección y una vida llena de lujos y comodidades que ambos disfrutan. Es una relación muy positiva y de apoyo mutuo. Desafíos: El Dragón debe tener cuidado de no aprovecharse de la naturaleza generosa del Cerdo. La tendencia del Cerdo a ser demasiado confiado puede chocar con la necesidad del Dragón de mantener una imagen poderosa, a veces a costa de la honestidad total. Clave del éxito: Mientras el Dragón sea genuinamente leal y protector con el Cerdo, y el Cerdo continúe ofreciendo su apoyo incondicional, esta es una pareja muy feliz. El disfrute compartido de las cosas buenas de la vida es el pegamento que los mantiene unidos.",
    score: 4
  },

  // Combinaciones restantes
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
