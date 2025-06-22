
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
    report: "Una amistad de espejo. Refinada, social y estéticamente agradable. Disfrutan de la cultura y la conversación. Su mayor desafío es la toma de decisiones y la tendencia a evitar conflictos, lo que puede llevar a una falta de profundidad.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "Una amistad intrigante. Libra se siente atraído por el misterio de Escorpio, y Escorpio por el encanto de Libra. Si Escorpio no es demasiado posesivo y Libra no es demasiado superficial, pueden encontrar un equilibrio fascinante.",
    score: 3
  },
  "Libra-Sagittarius": {
    report: "Una pareja de amigos muy divertida y social. Ambos son optimistas y aman explorar. Libra aporta la diplomacia y Sagitario la aventura. Se equilibran bien y disfrutan de debates filosóficos y de una vida social activa.",
    score: 4
  },
  "Libra-Capricorn": {
    report: "El sociable y el trabajador. Libra puede ayudar a Capricornio a relajarse y disfrutar de la vida social, mientras que Capricornio puede dar a Libra el enfoque que necesita. La amistad funciona si respetan sus diferentes prioridades.",
    score: 3
  },
  "Libra-Aquarius": {
    report: "Una amistad basada en ideales compartidos y una gran estimulación intelectual. Disfrutan de largas conversaciones sobre temas sociales y humanitarios. Se respetan mutuamente y valoran su independencia.",
    score: 5
  },
  "Libra-Pisces": {
    report: "Dos almas artísticas y pacíficas. Libra aprecia la creatividad de Piscis, y Piscis admira el sentido de la justicia de Libra. Su amistad es amable y soñadora, pero pueden tener problemas con la toma de decisiones prácticas.",
    score: 3
  },

  // Scorpio Combinations
  "Scorpio-Scorpio": {
    report: "Una amistad de 'todo o nada'. La lealtad es absoluta y la conexión es increíblemente profunda. Se entienden a un nivel que nadie más puede. El único peligro son las luchas de poder o los celos si la confianza se rompe.",
    score: 5
  },
  "Scorpio-Sagittarius": {
    report: "El detective y el explorador. Escorpio se siente fascinado por la honestidad de Sagitario, y Sagitario por la profundidad de Escorpio. La amistad puede ser muy divertida y reveladora si Escorpio no intenta controlar al libre Sagitario.",
    score: 3
  },
  "Scorpio-Capricorn": {
    report: "Una amistad de poder y estrategia. Ambos son ambiciosos y respetan la fuerza. Se apoyan mutuamente en sus metas y son extremadamente leales. Es una amistad sólida, basada en la confianza y el respeto mutuo.",
    score: 5
  },
  "Scorpio-Aquarius": {
    report: "Dos signos fijos con voluntades de hierro. Escorpio es emocionalmente intenso, mientras que Acuario es intelectualmente distante. Se fascinan y se frustran mutuamente. La amistad requiere un gran esfuerzo para respetar sus diferencias.",
    score: 2
  },
  "Scorpio-Pisces": {
    report: "Una de las amistades más profundas y empáticas del zodíaco. Ambos signos de agua se entienden a un nivel intuitivo. Escorpio protege a Piscis, y Piscis ofrece a Escorpio una comprensión incondicional. Amigos del alma.",
    score: 5
  },
  
  // Sagittarius Combinations
  "Sagittarius-Sagittarius": {
    report: "El dúo de aventureros definitivo. Su amistad es un viaje sin fin, lleno de optimismo, risas y planes espontáneos. Se entienden perfectamente en su necesidad de libertad y espacio. El único riesgo es que ninguno de los dos se encargue de los detalles prácticos.",
    score: 5
  },
  "Sagittarius-Capricorn": {
    report: "El aventurero se encuentra con el estratega. Esta amistad es un caso de 'opuestos que se atraen'. Sagitario puede enseñar a Capricornio a relajarse y a disfrutar de la vida, mientras que Capricornio puede dar a Sagitario el enfoque que necesita para materializar sus grandes ideas. Respeto mutuo es la clave.",
    score: 3
  },
  "Sagittarius-Aquarius": {
    report: "Una amistad brillante, intelectual y llena de libertad. Ambos son idealistas y aman explorar nuevas ideas y lugares. Se entienden en su necesidad de independencia y su vida social es activa y diversa. Grandes compañeros de debate y aventura.",
    score: 5
  },
  "Sagittarius-Pisces": {
    report: "El filósofo y el místico. Ambos regidos por Júpiter, comparten una búsqueda de significado. La honestidad brutal de Sagitario puede herir al sensible Piscis, pero si logran superarlo, su amistad será expansiva y muy inspiradora. Requiere tacto por parte de Sagitario y comprensión por parte de Piscis.",
    score: 3
  },

  // Capricorn Combinations
  "Capricorn-Capricorn": {
    report: "Una amistad sólida como una montaña, basada en el respeto, la lealtad y la ambición compartida. Se entienden en su necesidad de trabajar duro y alcanzar metas. Son el apoyo más fiable el uno para el otro. Su único riesgo es volverse demasiado serios.",
    score: 4
  },
  "Capricorn-Aquarius": {
    report: "El tradicionalista y el innovador. Capricornio se basa en las reglas, mientras que Acuario las rompe. Pueden tener debates fascinantes si Capricornio se abre a nuevas ideas y Acuario respeta la sabiduría de la experiencia. Una amistad basada en el respeto intelectual.",
    score: 3
  },
  "Capricorn-Pisces": {
    report: "Una amistad donde los sueños se encuentran con la realidad. Piscis inspira a Capricornio con su imaginación, y Capricornio ayuda a Piscis a poner los pies en la tierra. Se equilibran perfectamente.",
    score: 4
  },

  // Aquarius Combinations
  "Aquarius-Aquarius": {
    report: "Una amistad de mentes brillantes y espíritus libres. Son los mejores amigos para debatir sobre ideas revolucionarias y trabajar en proyectos humanitarios. Se entienden en su necesidad de independencia y no hay lugar para el drama. Su único riesgo es que la amistad sea más intelectual que emocional.",
    score: 4
  },
  "Aquarius-Pisces": {
    report: "El visionario y el soñador. Acuario se siente atraído por la compasión y la creatividad de Piscis, y Piscis admira la mente brillante de Acuario. Pueden tener una amistad muy inspiradora si Acuario no hiere los sentimientos de Piscis con su desapego, y Piscis no agobia a Acuario con sus necesidades emocionales.",
    score: 3
  },

  // Pisces Combinations
  "Pisces-Pisces": {
    report: "Una amistad de almas gemelas. Se entienden a un nivel profundo, empático y casi telepático. Crean un espacio seguro para sus sueños y vulnerabilidades. El único peligro es que ambos se pierdan en un mundo de fantasía y eviten la realidad, o que se absorban mutuamente en sus estados de ánimo melancólicos.",
    score: 4
  }
};

    

  




