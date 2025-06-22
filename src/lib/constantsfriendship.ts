
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const friendshipCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  // Aries Combinations
  "Aries-Aries": {
    report: "Una amistad explosiva y llena de energía. Son los compañeros de aventura ideales, siempre listos para un nuevo desafío o una salida espontánea. Se entienden a la perfección en su necesidad de acción y honestidad directa. La competencia puede surgir, pero suele ser amistosa y sirve para motivarse mutuamente. El principal desafío es que ambos quieren liderar y pueden chocar por el control. Sin embargo, su capacidad para perdonar y olvidar rápidamente evita que los rencores duren mucho. Juntos, son una fuerza de la naturaleza.",
    score: 4
  },
  "Aries-Taurus": {
    report: "Una amistad que une el impulso y la paciencia. Aries es el motor de arranque, siempre con una nueva idea y ganas de empezar, mientras que Tauro es el constructor, que prefiere un ritmo constante y seguro. Si logran sincronizarse, pueden ser un equipo increíble. Tauro enseña a Aries a disfrutar de los placeres sencillos y a terminar lo que empieza, y Aries saca a Tauro de su zona de confort para vivir nuevas experiencias. La clave es el respeto por sus diferentes ritmos de vida.",
    score: 2
  },
  "Aries-Gemini": {
    report: "Una amistad llena de aventuras, risas y conversaciones que nunca terminan. Géminis aporta un sinfín de ideas y un ingenio chispeante, mientras que Aries trae la energía y el entusiasmo para llevarlas a cabo. Nunca se aburren juntos. Desde un viaje por carretera improvisado hasta probar el nuevo bar de la ciudad, siempre están planeando algo nuevo y emocionante. Su vínculo se basa en la diversión y el estímulo mutuo, y ambos valoran la independencia del otro.",
    score: 5
  },
  "Aries-Cancer": {
    report: "Una dinámica de 'protector y protegido'. La naturaleza impulsiva y a veces brusca de Aries puede chocar con la extrema sensibilidad de Cáncer. Sin embargo, si Aries aprende a ser más considerado, se convierte en el defensor más feroz de su amigo Cáncer. A su vez, Cáncer puede ofrecer a Aries un refugio seguro y un cuidado genuino que el carnero raramente encuentra. La amistad florece si Cáncer aprende a no tomarse todo tan a pecho y Aries a suavizar su franqueza.",
    score: 3
  },
  "Aries-Leo": {
    report: "Mejores amigos casi instantáneos, un dúo dinámico de Fuego. Ambos son apasionados, leales y tienen un gran corazón. Se admiran mutuamente: Aries admira el carisma de Leo, y Leo admira el coraje de Aries. Son el tipo de amigos que se animan en público y se defienden a muerte en privado. Su vida social es vibrante y llena de diversión. El único desafío es la competencia por el protagonismo, pero su generosidad mutua suele superar cualquier ego.",
    score: 5
  },
  "Aries-Virgo": {
    report: "Una combinación complicada de 'caos vs. orden'. El impulsivo Aries choca frontalmente con el meticuloso y planificador Virgo. Aries puede ver a Virgo como demasiado crítico o aburrido, y Virgo puede ver a Aries como imprudente y desorganizado. Para que la amistad funcione, debe basarse en un profundo respeto por sus diferencias. Virgo puede ayudar a Aries a organizar su vida, y Aries puede ayudar a Virgo a relajarse y a tomar más riesgos. Es una amistad de aprendizaje mutuo.",
    score: 2
  },
  "Aries-Libra": {
    report: "Opuestos que se atraen y se equilibran maravillosamente. Como signos opuestos en el zodíaco, cada uno tiene lo que al otro le falta. Aries aporta la acción, la decisión y la energía, mientras que Libra aporta la diplomacia, la reflexión y el equilibrio. Libra calma la impulsividad de Aries con su gracia, y Aries ayuda a Libra a tomar decisiones y a no temer el conflicto. Juntos forman una gran dupla, tanto social como personal.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Una amistad intensa, poderosa y de 'todo o nada'. Ambos son signos guerreros (regidos por Marte) y valoran la lealtad por encima de todo. Si la confianza es total, serán los defensores más feroces el uno del otro, compartiendo secretos profundos y apoyándose incondicionalmente. Pero si esa confianza se rompe, pueden convertirse en rivales formidables. Es una amistad de extremos, con un potencial para una profundidad y lealtad inmensas.",
    score: 3
  },
  "Aries-Sagittarius": {
    report: "Los 'compañeros de crimen' definitivos. Dos signos de Fuego que comparten un amor innato por la libertad, los viajes, la honestidad brutal y las nuevas experiencias. Su amistad es optimista, directa y llena de risas. Nunca hay un momento aburrido. Se entienden en su necesidad de espacio e independencia, y se inspiran mutuamente para soñar más grande y vivir más audazmente. Una de las mejores combinaciones de amistad del zodíaco.",
    score: 5
  },
  "Aries-Capricorn": {
    report: "Una amistad basada en el respeto mutuo, si logran superar sus diferencias fundamentales de ritmo y enfoque. Aries es el impulso y la chispa, mientras que Capricornio es la estrategia y la resistencia. Capricornio puede admirar la valentía de Aries, y Aries puede respetar la disciplina de Capricornio. Sin embargo, Aries puede ver a Capricornio como demasiado lento o pesimista, y Capricornio puede ver a Aries como inmaduro o imprudente. Funcionan mejor si trabajan juntos en un proyecto con roles claros.",
    score: 2
  },
  "Aries-Aquarius": {
    report: "Grandes amigos que valoran la independencia y la originalidad del otro. Aries se siente atraído por las ideas innovadoras y el espíritu humanitario de Acuario, mientras que Acuario se energiza con la pasión y la iniciativa de Aries. Juntos forman un equipo innovador y social, siempre listos para defender una causa o iniciar una nueva tendencia. No hay dramas ni posesividad, solo un respeto mutuo por la libertad de cada uno.",
    score: 4
  },
  "Aries-Pisces": {
    report: "Una amistad delicada entre el 'guerrero' y el 'soñador'. La franqueza directa de Aries puede herir sin querer al sensible y empático Piscis. Sin embargo, si Aries adopta un rol protector, puede darle a Piscis la confianza que necesita. A cambio, Piscis puede enseñar a Aries sobre la compasión, la intuición y la importancia de conectar con las emociones. Requiere un esfuerzo consciente de cuidado y comprensión por ambas partes.",
    score: 2
  },
  
  // Taurus Combinations
  "Taurus-Taurus": {
    report: "Una amistad sólida como una roca, basada en la lealtad y el amor por las cosas buenas de la vida. Comparten un aprecio por la comodidad, la buena comida, la música y la estabilidad. Son amigos increíblemente fiables y constantes, el tipo de persona a la que llamas en medio de la noche. Su principal desafío es su terquedad combinada; cuando no están de acuerdo, puede ser un punto muerto épico. A pesar de ello, su vínculo es duradero y muy confortable.",
    score: 4
  },
  "Taurus-Gemini": {
    report: "Una mezcla de tierra y aire que puede ser fascinante. Tauro ofrece una estabilidad y un ancla que el inquieto Géminis a menudo necesita. Géminis, a su vez, aporta diversión, novedad y una perspectiva más ligera a la vida de Tauro. Tauro puede encontrar a Géminis un poco inconsistente y superficial, mientras que Géminis puede ver a Tauro como demasiado lento o posesivo. Sin embargo, pueden aprender mucho el uno del otro si valoran sus diferencias.",
    score: 3
  },
  "Taurus-Cancer": {
    report: "Una amistad natural, cálida y profundamente reconfortante. Ambos valoran la seguridad, el confort y la lealtad por encima de todo. Disfrutan de noches tranquilas en casa, cocinando juntos, viendo películas y manteniendo conversaciones sinceras. Tauro ofrece una estabilidad sólida que Cáncer aprecia enormemente, y Cáncer ofrece un cuidado emocional que hace que Tauro se sienta seguro y valorado. Son amigos para toda la vida.",
    score: 5
  },
  "Taurus-Leo": {
    report: "Dos signos fijos que aprecian el lujo, la lealtad y la buena vida. Su amistad puede ser fuerte y generosa si logran superar su mutua terquedad. Leo disfruta de la generosidad y el buen gusto de Tauro, y Tauro admira la calidez y el carisma de Leo. El principal punto de fricción es el control y el ritmo. Leo necesita atención y drama, mientras que Tauro necesita paz y tranquilidad. Si encuentran un equilibrio, su lealtad es inquebrantable.",
    score: 3
  },
  "Taurus-Virgo": {
    report: "La amistad de tierra por excelencia. Son amigos leales, prácticos y que siempre pueden contar el uno con el otro sin necesidad de grandes dramas. Comparten un enfoque sensato de la vida, una ética de trabajo similar y disfrutan de actividades tranquilas y constructivas. Es una amistad sólida, basada en la confianza, el apoyo mutuo y un entendimiento profundo y silencioso. Virgo ayuda a Tauro a organizarse y Tauro ayuda a Virgo a relajarse.",
    score: 5
  },
  "Taurus-Libra": {
    report: "Ambos regidos por Venus, comparten un amor innato por la belleza, el arte y la armonía. Disfrutan de salidas culturales, buena comida y una vida social tranquila y refinada. Libra ayuda a Tauro a ser más sociable y a ver diferentes perspectivas, mientras que Tauro ofrece a Libra una estabilidad y una decisión que a menudo le faltan. Es una amistad muy agradable y estéticamente placentera, aunque a veces Tauro puede encontrar a Libra demasiado indeciso.",
    score: 4
  },
  "Taurus-Scorpio": {
    report: "Una amistad de opuestos magnéticos: intensa, profunda y ferozmente leal. Ambos valoran la confianza y la autenticidad por encima de todo. Si logran superar la desconfianza inicial, se convierten en amigos para toda la vida, protectores y posesivos el uno con el otro. Comparten un entendimiento que va más allá de las palabras. Tauro ancla a Escorpio, y Escorpio ofrece a Tauro una profundidad emocional que le fascina.",
    score: 4
  },
  "Taurus-Sagittarius": {
    report: "El hogareño se encuentra con el aventurero. Sus estilos de vida y valores son muy diferentes, lo que hace que esta amistad sea un desafío. Sagitario puede ver a Tauro como aburrido o materialista, y Tauro puede ver a Sagitario como poco fiable e imprudente. La amistad requiere un gran esfuerzo para encontrar un terreno común, que suele ser el disfrute de los placeres de la vida, aunque de maneras muy distintas. Generalmente, funciona mejor en pequeñas dosis.",
    score: 2
  },
  "Taurus-Capricorn": {
    report: "Una de las amistades más sólidas, fiables y duraderas del zodíaco. Como dos signos de Tierra, se entienden a la perfección en su necesidad de seguridad, estructura y metas a largo plazo. Son prácticos, leales y ambiciosos. Se apoyan mutuamente en sus carreras y proyectos personales, ofreciendo consejos sensatos y un apoyo inquebrantable. Una amistad para toda la vida, basada en el respeto y la admiración mutua.",
    score: 5
  },
  "Taurus-Aquarius": {
    report: "Una combinación difícil de 'tradición vs. innovación'. El tradicional y metódico Tauro choca con el poco convencional y rebelde Acuario. Ambos son tercos y les cuesta ceder en sus posturas. Si logran respetar sus diferencias, Acuario puede abrir la mente de Tauro a nuevas ideas, y Tauro puede ofrecer a Acuario un ancla necesaria a la realidad y al sentido común. Es una amistad que requiere mucha paciencia y espacio.",
    score: 2
  },
  "Taurus-Pisces": {
    report: "Una amistad dulce, artística y muy reconfortante. El práctico y protector Tauro ofrece la estabilidad y la seguridad que el sensible y soñador Piscis necesita para no perderse en sus fantasías. A su vez, Piscis aporta imaginación, empatía y una profunda comprensión emocional que Tauro valora y disfruta enormemente. Juntos, pueden pasar horas disfrutando del arte, la música y la naturaleza. Un vínculo muy especial y sanador.",
    score: 4
  },

  // Gemini Combinations
  "Gemini-Gemini": {
    report: "Una amistad de alta energía, llena de chistes internos, curiosidad sin fin y conversaciones que saltan de un tema a otro a la velocidad de la luz. Nunca se aburren y siempre tienen un nuevo plan, una nueva idea o un nuevo chisme que compartir. El desafío es la constancia; pueden tener dificultades para profundizar emocionalmente o para llevar a cabo sus grandiosos planes. Es una amistad de pura diversión y estímulo intelectual.",
    score: 4
  },
  "Gemini-Cancer": {
    report: "El ingenio rápido de Géminis puede chocar con la profunda sensibilidad de Cáncer. Para que funcione, Géminis debe aprender a ser más empático y consciente de sus palabras, mientras que Cáncer debe entender que la naturaleza de Géminis no es malintencionada. Si lo logran, Géminis puede sacar a Cáncer de su caparazón con humor y Cáncer puede enseñar a Géminis a conectar con sus propias emociones. Es una amistad que requiere traducción emocional.",
    score: 3
  },
  "Gemini-Leo": {
    report: "La pareja social perfecta. A Leo le encanta tener a Géminis cerca por su ingenio y sus habilidades para romper el hielo, y Géminis disfruta del carisma, la generosidad y el brillo de Leo. Juntos son el alma de cualquier fiesta, combinando ideas brillantes con un liderazgo natural. Se admiran mutuamente y su amistad es divertida, optimista y muy entretenida. Leo necesita ser el centro de atención, y Géminis es el maestro de ceremonias perfecto.",
    score: 4
  },
  "Gemini-Virgo": {
    report: "Dos mentes regidas por Mercurio, pero con enfoques diametralmente opuestos. Géminis ama la variedad, las ideas generales y la multitarea. Virgo ama el detalle, la precisión y el análisis profundo. Pueden tener grandes debates y aprender mucho el uno del otro, pero Virgo puede ver a Géminis como poco fiable o caótico, y Géminis puede ver a Virgo como demasiado crítico o quisquilloso. Su amistad se basa en un respeto intelectual mutuo.",
    score: 3
  },
  "Gemini-Libra": {
    report: "Una amistad de Aire excepcionalmente fluida y armoniosa. Se entienden a un nivel intelectual casi instantáneo. Disfrutan de la vida social, el arte, la cultura y, sobre todo, de largas y fascinantes conversaciones sobre cualquier tema imaginable. Libra aporta el equilibrio y la diplomacia que a veces le falta a Géminis, y Géminis aporta la chispa y la variedad que Libra adora. Se divierten muchísimo juntos y forman una pareja de amigos muy popular.",
    score: 5
  },
  "Gemini-Scorpio": {
    report: "Una amistad de 'superficie vs. profundidad'. Géminis es un libro abierto, sociable y comunicativo, mientras que Escorpio es reservado, intenso y misterioso. Esta diferencia fundamental puede generar una fascinación inicial o una desconfianza insuperable. Para que la amistad funcione, Géminis debe respetar la necesidad de privacidad de Escorpio, y Escorpio debe aprender a no ser tan posesivo o sospechoso con la naturaleza social de Géminis.",
    score: 2
  },
  "Gemini-Sagittarius": {
    report: "Opuestos en el zodíaco que se atraen y se complementan a la perfección. Ambos son los eternos estudiantes, curiosos, amantes de la libertad y del aprendizaje constante. Su amistad está llena de aventuras, viajes, debates filosóficos y un gran sentido del humor. Se dan mutuamente el espacio y la independencia que tanto necesitan, creando un vínculo sin ataduras y lleno de estímulo. Son los mejores compañeros de viaje y de vida.",
    score: 5
  },
  "Gemini-Capricorn": {
    report: "Una amistad poco probable pero potencialmente fructífera, donde la ligereza se encuentra con la seriedad. La naturaleza juguetona y cambiante de Géminis choca con el enfoque estructurado y disciplinado de Capricornio. Si encuentran un terreno común, Capricornio puede dar a Géminis el enfoque que necesita para materializar sus ideas, y Géminis puede enseñar al trabajador Capricornio a relajarse y a disfrutar más de la vida. Se basa en el respeto por sus diferentes talentos.",
    score: 2
  },
  "Gemini-Aquarius": {
    report: "Una amistad brillante y futurista. Dos mentes innovadoras que se entienden a la perfección en su amor por las ideas, la libertad y las causas sociales. Valoran la independencia mutua, las conversaciones poco convencionales y el pensamiento original. Son grandes compañeros para proyectos humanitarios, tecnológicos o cualquier cosa que implique romper moldes. Su vínculo es más cerebral que emocional, pero increíblemente estimulante.",
    score: 5
  },
  "Gemini-Pisces": {
    report: "La mente y el corazón en una danza delicada. La lógica y la comunicación verbal de Géminis pueden chocar con la intuición y la sensibilidad emocional de Piscis. Géminis puede herir sin querer los sentimientos de Piscis con su franqueza o sus bromas. Sin embargo, si se esfuerzan, pueden tener una amistad muy creativa y llena de imaginación, donde Géminis da voz a los sueños de Piscis. Requiere mucha paciencia y empatía por parte de ambos.",
    score: 2
  },

  // Cancer Combinations
  "Cancer-Cancer": {
    report: "Dos Cáncer juntos crean un vínculo de amistad increíblemente intuitivo, empático y nutritivo. Se entienden a un nivel emocional profundo, creando un espacio seguro donde ambos pueden ser vulnerables sin temor a ser juzgados. Son el tipo de amigos que se cuidan mutuamente, a menudo actuando como una segunda familia. Su principal desafío es evitar caer en un ciclo de negatividad o codependencia. Si uno está de mal humor, puede arrastrar fácilmente al otro. Sin embargo, en sus mejores momentos, son el refugio perfecto el uno para el otro, compartiendo un amor por el hogar y la comodidad.",
    score: 4
  },
  "Cancer-Leo": {
    report: "El protector y el rey. Esta es una amistad de lealtad y calidez. Cáncer se siente seguro con la fuerza y la generosidad de Leo, y disfruta cuidando de su amigo real. Leo, a su vez, adora la lealtad incondicional y el apoyo emocional que Cáncer le brinda. Leo saca a Cáncer de su caparazón para divertirse, mientras que Cáncer ofrece a Leo un refugio seguro. La amistad es fuerte si Leo es consciente y cuidadoso con los sentimientos de Cáncer, ya que su franqueza puede herir sin querer.",
    score: 3
  },
  "Cancer-Virgo": {
    report: "Una amistad maravillosa basada en el cuidado y el servicio mutuo. Cáncer se siente seguro y atendido por la naturaleza práctica y detallista de Virgo, quien siempre está dispuesto a ayudar de forma tangible. A su vez, Virgo se siente profundamente apreciado y valorado por la calidez emocional y la lealtad de Cáncer. Es una amistad sólida, de apoyo y sin mucho drama, ideal para construir una confianza duradera y ayudarse en los asuntos cotidianos de la vida.",
    score: 4
  },
  "Cancer-Libra": {
    report: "Ambos signos buscan la armonía, pero de maneras muy diferentes. Cáncer anhela la seguridad emocional de un vínculo profundo, mientras que Libra busca el equilibrio y la paz en sus interacciones sociales. Libra puede encontrar a Cáncer demasiado temperamental o posesivo, y Cáncer puede ver a Libra como demasiado distante o superficial en sus emociones. Para que la amistad funcione, Libra debe hacer un esfuerzo por ofrecer un apoyo emocional más profundo, y Cáncer debe entender la necesidad de Libra de socializar y mantener la ligereza.",
    score: 3
  },
  "Cancer-Scorpio": {
    report: "Una conexión de almas gemelas. Como dos signos de agua, se entienden a un nivel casi psíquico. Su amistad es profunda, intensa y ferozmente protectora. Guardarán los secretos del otro hasta la tumba. Cáncer se siente seguro con la fuerza de Escorpio, y Escorpio se siente libre de ser vulnerable con Cáncer. Pueden pasar horas hablando de sus sentimientos más profundos, creando un vínculo indestructible. Son el tipo de amigos que se defenderían mutuamente sin dudarlo.",
    score: 5
  },
  "Cancer-Sagittarius": {
    report: "El casero se encuentra con el aventurero. Cáncer necesita un nido seguro y rutinas, mientras que Sagitario necesita libertad y exploración constante. La honestidad brutal y sin filtros de Sagitario puede herir profundamente al sensible Cáncer. Esta amistad es un desafío. Sagitario puede ver a Cáncer como demasiado pegajoso, y Cáncer puede ver a Sagitario como poco fiable. Requiere mucho espacio, paciencia y comprensión para funcionar.",
    score: 2
  },
  "Cancer-Capricorn": {
    report: "Opuestos en el zodíaco que se atraen y se respetan profundamente. Cáncer admira la fortaleza, la disciplina y la fiabilidad de Capricornio. Capricornio, aunque más reservado, se siente cuidado y valorado por la lealtad incondicional y el apoyo emocional de Cáncer. Cáncer aporta calidez y hogar a la vida de Capricornio, mientras que Capricornio aporta estructura y seguridad a la de Cáncer. Juntos, forman un vínculo sólido y protector, como una familia.",
    score: 4
  },
  "Cancer-Aquarius": {
    report: "Una amistad complicada debido a sus diferentes enfoques de la vida. Cáncer es personal, subjetivo y emocional. Acuario es más desapegado, objetivo y orientado al grupo. Cáncer puede sentirse desatendido o como 'uno más' en la amplia red social de Acuario. A su vez, Acuario puede sentirse sofocado por las necesidades emocionales de Cáncer. La amistad funciona mejor cuando se basa en un interés o causa común, en lugar de una conexión puramente personal.",
    score: 2
  },
  "Cancer-Pisces": {
    report: "Una amistad de ensueño, salida de un cuento de hadas. Dos signos de agua que nadan en las mismas profundidades emocionales. Se entienden a un nivel casi telepático, compartiendo una conexión empática, compasiva y muy creativa. Son el tipo de amigos que pueden llorar y reír juntos en la misma conversación, apoyándose en sus sueños y vulnerabilidades. Crean un espacio seguro y mágico donde ambos pueden ser auténticos. Una de las mejores combinaciones de amistad.",
    score: 5
  },

  // Leo Combinations
  "Leo-Leo": {
    report: "Dos soles brillando juntos. Esta amistad es una explosión de calidez, generosidad, diversión y drama. Ambos son leales, de gran corazón y se entienden perfectamente en su necesidad de ser vistos y apreciados. Son los mejores animadores del otro, celebrando los éxitos a lo grande. Su principal desafío es la competencia por ser el centro de atención. Si logran compartir el escenario y celebrar el brillo del otro, serán una pareja de amigos imparable y magnética, el alma de cualquier fiesta.",
    score: 4
  },
  "Leo-Virgo": {
    report: "El rey y su consejero. Leo, con su gran visión y carisma, se beneficia enormemente de la mente analítica y la ayuda práctica de Virgo. A su vez, Virgo admira en secreto la confianza y la calidez de Leo. La amistad funciona si Leo está dispuesto a aceptar la crítica constructiva (y a veces quisquillosa) de Virgo, y si Virgo aprende a no apagar el brillo de Leo con demasiada preocupación y análisis. Virgo mantiene a Leo con los pies en la tierra, y Leo ayuda a Virgo a disfrutar más de la vida.",
    score: 3
  },
  "Leo-Libra": {
    report: "El dúo más glamuroso y social del zodíaco. Ambos aman la fiesta, el arte, la belleza y una vida social activa. Libra sabe instintivamente cómo halagar el ego de Leo, y Leo admira profundamente el estilo, la gracia y la diplomacia de Libra. Juntos, son una pareja de amigos irresistible, siempre rodeados de gente y disfrutando de las cosas buenas de la vida. Su vínculo se basa en la admiración mutua y la búsqueda de la armonía y el placer.",
    score: 4
  },
  "Leo-Scorpio": {
    report: "Dos voluntades de hierro y dos corazones leales. Esta es una amistad de 'todo o nada', basada en un respeto y una intensidad extremos. Si se hacen amigos, se defenderán a muerte, compartiendo una lealtad inquebrantable. Pero si chocan, la lucha de poder puede ser épica. Ambos son signos fijos y orgullosos, y ninguno cede fácilmente. Es una amistad poderosa, magnética y potencialmente transformadora, pero no para los débiles de corazón.",
    score: 3
  },
  "Leo-Sagittarius": {
    report: "Compañeros de fiesta y aventura por excelencia. Dos signos de Fuego que se entienden a la perfección. Ambos son optimistas, extrovertidos, generosos y aman la vida. Se animan mutuamente a ser más audaces, a viajar, a aprender y a explorar el mundo. Su energía combinada es contagiosa y su amistad está llena de risas, honestidad y un apoyo incondicional. Nunca hay un momento aburrido entre ellos.",
    score: 5
  },
  "Leo-Capricorn": {
    report: "Una amistad basada en la admiración mutua por el poder, la ambición y el estatus. Leo admira la disciplina y la capacidad de logro de Capricornio, y Capricornio respeta el liderazgo natural y el carisma de Leo. Pueden chocar en sus estilos de vida: Leo es extravagante y busca el placer, mientras que Capricornio es más conservador y enfocado en el trabajo. Sin embargo, pueden ser un gran apoyo el uno para el otro en sus respectivas carreras, formando una alianza poderosa.",
    score: 2
  },
  "Leo-Aquarius": {
    report: "Opuestos polares que se atraen magnéticamente. Leo representa el 'yo' y el corazón, mientras que Acuario representa el 'nosotros' y la mente. Leo es el rey, Acuario es el pueblo. Se fascinan mutuamente por sus diferencias. Juntos pueden ser una fuerza creativa e influyente increíble, si respetan sus distintos enfoques. Leo enseña a Acuario a ser más cálido y personal, y Acuario enseña a Leo a pensar en el colectivo. Su amistad es estimulante y nunca aburrida.",
    score: 4
  },
  "Leo-Pisces": {
    report: "El protector y el soñador. El fuerte y confiado Leo se siente instintivamente atraído por la naturaleza gentil, empática y a veces vulnerable de Piscis, y a menudo adopta un papel de guardián. Piscis, a su vez, ofrece a Leo una audiencia devota, una admiración genuina y una profunda comprensión emocional que calma el corazón del león. Es una amistad muy teatral y romántica, donde la compasión y la creatividad fluyen libremente.",
    score: 3
  },

  // Virgo Combinations
  "Virgo-Virgo": {
    report: "Una amistad basada en una profunda comprensión mutua y un perfeccionismo compartido. Se entienden en su necesidad de orden, eficiencia y mejora constante. Son los mejores consejeros el uno para el otro, ofreciendo consejos prácticos y un apoyo tangible. Juntos, pueden organizar cualquier cosa. El único riesgo es caer en un ciclo de crítica o preocupación mutua, donde ambos amplifican sus ansiedades. Si se enfocan en apoyarse en lugar de 'arreglarse', su vínculo es increíblemente sólido.",
    score: 4
  },
  "Virgo-Libra": {
    report: "Una amistad refinada y civilizada. El analítico Virgo aprecia el buen gusto, la diplomacia y el sentido de la justicia de Libra. Libra, a su vez, valora la inteligencia, la fiabilidad y la atención al detalle de Virgo. Libra puede ayudar a Virgo a socializar y a ver las cosas desde una perspectiva más equilibrada, mientras que Virgo puede ayudar a Libra a ser más decidido y a organizar sus ideas. Es una amistad agradable, aunque a veces la crítica de Virgo puede alterar la paz de Libra.",
    score: 3
  },
  "Virgo-Scorpio": {
    report: "Una amistad de profunda confianza, análisis y lealtad. Ambos son signos observadores, inteligentes y prefieren la sustancia a la superficialidad. Virgo se siente seguro con la lealtad inquebrantable de Escorpio, y Escorpio respeta profundamente la mente aguda y la integridad de Virgo. Son excelentes para resolver problemas juntos, ya que Virgo analiza los detalles y Escorpio percibe las motivaciones ocultas. Un equipo de detectives formidable.",
    score: 5
  },
  "Virgo-Sagittarius": {
    report: "El planificador meticuloso se encuentra con el aventurero filosófico. Esta es una amistad de cuadratura, lo que significa que hay tensión y mucho que aprender. Virgo se estresa con la falta de planificación y la imprudencia de Sagitario. Sagitario se siente limitado por la cautela y la preocupación por los detalles de Virgo. Para que funcione, deben valorar sus diferencias. Virgo puede enseñar a Sagitario a ser más organizado, y Sagitario puede enseñar a Virgo a tener una visión más amplia y a relajarse.",
    score: 2
  },
  "Virgo-Capricorn": {
    report: "La amistad de tierra por excelencia. Es una de las combinaciones más sólidas y fiables del zodíaco. Se entienden a la perfección en su ética de trabajo, sus valores prácticos y su lealtad. Es una amistad de bajo mantenimiento pero de alto rendimiento, basada en el apoyo mutuo, el respeto y la admiración. Son el tipo de amigos que siempre están ahí, pase lo que pase, ofreciendo consejos sensatos y ayuda práctica. Una amistad para toda la vida.",
    score: 5
  },
  "Virgo-Aquarius": {
    report: "Una amistad principalmente cerebral. Ambos son inteligentes, analíticos y disfrutan de un buen debate. Virgo puede ayudar a Acuario a poner en práctica sus ideas revolucionarias con planes concretos, y Acuario puede ayudar a Virgo a pensar de forma más abstracta y a ver el panorama general. Respetan la mente del otro, aunque Virgo puede encontrar a Acuario demasiado excéntrico y Acuario puede ver a Virgo como demasiado convencional.",
    score: 3
  },
  "Virgo-Pisces": {
    report: "Opuestos polares que se complementan de una manera casi mágica. El práctico Virgo ancla al soñador Piscis a la realidad, ofreciéndole la estructura y el apoyo que necesita. A su vez, el compasivo Piscis ayuda al ansioso y autocrítico Virgo a relajarse, a perdonarse y a confiar en la intuición. Es una amistad de servicio y sanación mutua. Virgo cuida de Piscis en lo práctico, y Piscis cuida del alma de Virgo. Un vínculo muy especial.",
    score: 4
  },

  // Libra Combinations
  "Libra-Libra": {
    report: "Una amistad que es como mirarse en un espejo elegante y armonioso. Dos Libra juntos crean un vínculo basado en la cortesía, la belleza, la justicia y una vida social activa. Disfrutan de largas conversaciones sobre arte, cultura y relaciones, y son excelentes anfitriones. Se entienden en su aversión al conflicto, lo que crea un ambiente pacífico pero que a veces carece de honestidad brutal. Su mayor desafío es la toma de decisiones; pueden quedar atrapados en un bucle de '¿qué te apetece a ti?', sopesando pros y contras hasta el infinito. Esta indecisión y su tendencia a evitar problemas puede hacer que los resentimientos se acumulen bajo una superficie de amabilidad, siendo su talón de Aquiles.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "El diplomático social se encuentra con el psicólogo intenso, una combinación magnética y compleja. Libra se siente atraído por la profundidad y el misterio de Escorpio, mientras que Escorpio se siente intrigado por el encanto y la gracia de Libra. Si se establece la confianza, Escorpio ofrece una lealtad y una profundidad emocional que Libra rara vez encuentra. A su vez, Libra puede suavizar los bordes de Escorpio y ofrecerle una perspectiva más equilibrada y objetiva. El desafío principal es que la necesidad de paz de Libra choca con la tendencia de Escorpio a investigar las profundidades, incluyendo los aspectos oscuros y conflictivos. La intensidad de Escorpio puede asustar a Libra, y la indecisión o superficialidad aparente de Libra puede frustrar a Escorpio.",
    score: 3
  },
  "Libra-Sagittarius": {
    report: "Una de las parejas de amigos más divertidas y sociales. El idealismo de Libra se une al optimismo de Sagitario. Ambos son extrovertidos, aman aprender, viajar y debatir sobre grandes ideas. Sagitario aporta la aventura y la honestidad brutal, mientras que Libra aporta la elegancia y la diplomacia. Juntos son excelentes compañeros para explorar nuevas culturas o para tener una conversación que dure toda la noche. Se dan el espacio y la libertad que tanto necesitan, creando una amistad fácil, sin dramas y muy estimulante, donde el crecimiento mutuo es constante.",
    score: 4
  },
  "Libra-Capricorn": {
    report: "El embajador y el CEO en una amistad. Libra, con su enfoque en las relaciones y la armonía, y Capricornio, con su enfoque en la estructura y la ambición, pueden formar una amistad basada en un respeto práctico. Libra puede ayudar a Capricornio a mejorar sus habilidades sociales, mientras que Capricornio ofrece a Libra una estabilidad que a menudo le falta. La amistad funciona mejor cuando se enfoca en metas compartidas, como organizar un evento o un proyecto, aunque en el plano personal, Capricornio puede ver a Libra como indeciso y superficial, y Libra a Capricornio como demasiado serio y restrictivo.",
    score: 3
  },
  "Libra-Aquarius": {
    report: "Una amistad de mentes gemelas. Como dos signos de Aire, su conexión es instantánea, intelectual y progresista. Ambos son idealistas, humanitarios y aman debatir sobre ideas que pueden cambiar el mundo. Valoran la justicia, la igualdad y la libertad. Es una amistad sin dramas, basada en el respeto mutuo, la comunicación fluida y la libertad para ser uno mismo. Son los mejores amigos para ir a una protesta, un museo o simplemente para tener una conversación estimulante que dure toda la noche sobre el futuro de la humanidad.",
    score: 5
  },
  "Libra-Pisces": {
    report: "El artista y el soñador. Esta es una amistad amable, compasiva y muy creativa. Ambos son románticos, idealistas y tienen un profundo aprecio por el arte, la música y la belleza. Libra se siente atraído por la imaginación y la empatía de Piscis, y Piscis admira el sentido de la justicia y la gracia de Libra. Su principal desafío es la falta de practicidad y la tendencia a evitar la confrontación. Pueden construir mundos de ensueño juntos, pero lucharán con las duras realidades si no hay una influencia más terrenal que los ancle.",
    score: 3
  },

  // Scorpio Combinations
  "Scorpio-Scorpio": {
    report: "Una amistad de intensidad magnética. Dos Escorpio juntos es una conexión de 'todo o nada'. Cuando son amigos, son los más leales, protectores y comprensivos que existen, compartiendo un vínculo casi telepático. Se entienden en su necesidad de profundidad, verdad y privacidad. Sin embargo, si la confianza se rompe, pueden convertirse en los peores enemigos, usando sus conocimientos mutuos como armas. Es una amistad poderosa, transformadora y no apta para cardíacos. La confianza absoluta es la única regla. Pueden pasar horas en silencio, simplemente sabiendo lo que el otro piensa.",
    score: 5
  },
  "Scorpio-Sagittarius": {
    report: "El detective se encuentra con el filósofo. Escorpio se siente fascinado por la honestidad brutal y el espíritu libre de Sagitario, mientras que Sagitario se siente intrigado por la profundidad y el misterio de Escorpio. Esta amistad puede ser muy divertida y reveladora, llena de debates apasionados sobre la vida y la muerte. El desafío radica en que la necesidad de control y privacidad de Escorpio choca con el amor por la libertad de Sagitario. Si Escorpio aprende a soltar y Sagitario a respetar los límites emocionales, pueden aprender inmensamente el uno del otro.",
    score: 3
  },
  "Scorpio-Capricorn": {
    report: "Una alianza de poder. Esta es una de las amistades más sólidas y respetuosas del zodíaco. Ambos son signos ambiciosos, estratégicos y valoran la lealtad por encima de todo. Se admiran mutuamente por su fuerza y determinación. Capricornio aporta la estructura y la disciplina, mientras que Escorpio aporta la perspicacia y la pasión. Juntos, son un equipo formidable que puede lograr cualquier cosa, ya sea en los negocios o en la vida personal. Su lealtad es silenciosa pero inquebrantable, y ambos saben que pueden contar el uno con el otro en las situaciones más difíciles.",
    score: 5
  },
  "Scorpio-Aquarius": {
    report: "Una amistad de voluntades de hierro y perspectivas opuestas. Escorpio, el signo de la profundidad emocional, y Acuario, el signo del desapego intelectual, se fascinan y se frustran mutuamente. Ambos son signos fijos, obstinados en sus creencias. Su amistad requiere un inmenso respeto por sus diferencias. Si lo logran, pueden tener conversaciones increíblemente profundas y reveladoras, desafiando las perspectivas del otro. Sin embargo, es más común que sus diferentes enfoques (emocional vs. lógico) creen una distancia insalvable.",
    score: 2
  },
  "Scorpio-Pisces": {
    report: "Una amistad de almas gemelas. Como dos signos de agua, se entienden a un nivel intuitivo y emocional que pocos pueden comprender. Escorpio se convierte en el protector feroz del sensible y soñador Piscis. Piscis, a su vez, ofrece a Escorpio un espacio de aceptación incondicional donde puede bajar la guardia y ser vulnerable. Su vínculo es profundo, empático y casi mágico. Son el tipo de amigos que pueden comunicarse sin palabras y que guardarían los secretos del otro hasta la tumba, creando un santuario emocional para ambos.",
    score: 5
  },
  
  // Sagittarius Combinations
  "Sagittarius-Sagittarius": {
    report: "Los compañeros de aventura definitivos. Dos Sagitario juntos son un torbellino de optimismo, risas, viajes espontáneos y debates filosóficos que duran hasta el amanecer. Se entienden a la perfección en su necesidad de libertad, honestidad y nuevas experiencias. Su amistad es expansiva y nunca aburrida. El único riesgo es que ambos pueden ser un poco irresponsables con los detalles prácticos de la vida, y su honestidad brutal mutua puede llevar a discusiones explosivas (aunque generalmente se olvidan rápidamente). Son el tipo de amigos con los que decides ir a otro país con un día de antelación.",
    score: 5
  },
  "Sagittarius-Capricorn": {
    report: "El explorador se encuentra con el arquitecto. Esta es una amistad de respeto mutuo, aunque sus estilos de vida son muy diferentes. Sagitario admira la disciplina y la capacidad de logro de Capricornio, mientras que Capricornio admira en secreto el coraje y el optimismo de Sagitario. Sagitario puede enseñar a Capricornio a relajarse y a disfrutar más del viaje, y Capricornio puede dar a Sagitario el enfoque que a veces necesita para convertir sus grandes ideas en realidad. La clave es la paciencia y valorar sus fortalezas complementarias. Es una amistad que madura con el tiempo.",
    score: 3
  },
  "Sagittarius-Aquarius": {
    report: "Una amistad brillante, idealista y con visión de futuro. Ambos son signos intelectuales que aman la libertad y las ideas innovadoras. Disfrutan de conversaciones sobre temas sociales, políticos y filosóficos. Se entienden en su necesidad de independencia y no hay lugar para la posesividad. Juntos, son excelentes compañeros para proyectos humanitarios, viajes poco convencionales o simplemente para cambiar el mundo, una idea a la vez. Su vínculo es más cerebral que emocional, pero increíblemente estimulante y progresista.",
    score: 5
  },
  "Sagittarius-Pisces": {
    report: "El filósofo y el místico. Ambos regidos por Júpiter, comparten una búsqueda de un significado más profundo en la vida. Sagitario busca la verdad a través de la exploración del mundo exterior, mientras que Piscis la busca a través de la exploración del mundo interior. Su amistad puede ser increíblemente inspiradora. Sin embargo, la honestidad directa de Sagitario puede herir fácilmente la sensibilidad de Piscis, y la naturaleza evasiva de Piscis puede frustrar al directo Sagitario. Si logran comunicarse con compasión, su amistad puede ser una fuente de crecimiento espiritual para ambos.",
    score: 3
  },

  // Capricorn Combinations
  "Capricorn-Capricorn": {
    report: "Una amistad sólida como una montaña, basada en el respeto, la lealtad y la ambición compartida. Dos Capricornio se entienden a un nivel profundo, apreciando la disciplina, la ética de trabajo y el humor seco del otro. Son el tipo de amigos que se apoyan en sus metas profesionales y personales, ofreciendo consejos prácticos y un apoyo inquebrantable. Su vínculo se construye lentamente pero está hecho para durar. Su único riesgo es volverse demasiado serios o competitivos entre sí. Si aprenden a relajarse y a disfrutar juntos de sus logros, su amistad es una fortaleza.",
    score: 4
  },
  "Capricorn-Aquarius": {
    report: "El tradicionalista y el innovador. Capricornio se basa en las reglas y la estructura, mientras que Acuario busca romperlas. Esta amistad se basa en un respeto intelectual mutuo, aunque sus enfoques de la vida son opuestos. Capricornio puede admirar la genialidad de Acuario, y Acuario puede respetar la capacidad de Capricornio para construir cosas duraderas. Pueden tener debates fascinantes si Capricornio se abre a nuevas ideas y Acuario valora la sabiduría de la experiencia. La clave es no intentar cambiarse el uno al otro.",
    score: 3
  },
  "Capricorn-Pisces": {
    report: "Una amistad donde los sueños se encuentran con la realidad. Capricornio, el signo de tierra pragmático, ofrece la estabilidad y la estructura que el soñador Piscis necesita para sentirse seguro. A su vez, Piscis aporta imaginación, compasión y una profunda conexión emocional a la vida de Capricornio, ayudándole a suavizar sus bordes. Se equilibran perfectamente, con Capricornio anclando a Piscis y Piscis inspirando a Capricornio. Es un vínculo de apoyo y muy gratificante para ambos.",
    score: 4
  },

  // Aquarius Combinations
  "Aquarius-Aquarius": {
    report: "Una amistad de mentes brillantes y espíritus libres. Dos Acuario juntos son una fuerza de innovación y pensamiento no convencional. Se entienden en su necesidad de independencia, su amor por las causas humanitarias y su desdén por las normas sociales. Son los mejores amigos para debatir sobre ideas revolucionarias, ir a una protesta o simplemente observar a la gente. Su único riesgo es que la amistad sea tan cerebral y desapegada que carezca de una conexión emocional profunda. Si logran compartir sus vulnerabilidades, el vínculo se vuelve inquebrantable.",
    score: 4
  },
  "Aquarius-Pisces": {
    report: "El visionario y el soñador. Acuario se siente atraído por la compasión, la creatividad y la naturaleza mística de Piscis. Piscis, a su vez, admira la mente brillante, los ideales humanitarios y la originalidad de Acuario. Juntos, pueden formar una amistad muy inspiradora y creativa. Acuario puede dar voz a las ideas de Piscis, y Piscis puede enseñar a Acuario sobre la empatía y el poder de la intuición. Si Acuario es cuidadoso con los sentimientos de Piscis y Piscis respeta la necesidad de espacio de Acuario, su amistad puede ser una hermosa mezcla de mente y alma.",
    score: 3
  },

  // Pisces Combinations
  "Pisces-Pisces": {
    report: "Una amistad de almas gemelas que nadan en el mismo océano de emociones, sueños y compasión. Se entienden a un nivel profundo, empático y casi telepático, creando un espacio seguro donde ambos pueden ser completamente vulnerables. Es un vínculo lleno de creatividad, apoyo emocional y una profunda conexión espiritual. El único peligro es que ambos pueden perderse en un mundo de fantasía y evadir las responsabilidades de la vida real, o que pueden absorberse mutuamente en sus estados de ánimo melancólicos. Si se ayudan a mantener un pie en la realidad, su amistad es un refugio mágico y sanador.",
    score: 4
  }
};

    

  







  
