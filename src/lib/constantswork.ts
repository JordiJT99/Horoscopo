
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const workCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Aries-Aries": {
    report: "Un dúo de alta energía, ambición y una sana (a veces no tan sana) competitividad. Juntos, son una fuerza de la naturaleza para iniciar proyectos y tomar la iniciativa. Son excelentes para motivarse mutuamente y trabajar en entornos de ritmo rápido. Fortalezas: Rapidez, decisión y una valentía compartida. No temen a los desafíos. Desafíos: La lucha por el liderazgo es su mayor obstáculo. Ambos quieren estar al mando y pueden chocar si los roles no están claramente definidos. La impaciencia es otro problema; pueden apresurar las cosas sin planificar. Clave del éxito: Definir claramente quién lidera qué. Canalizar su espíritu competitivo hacia metas externas en lugar de entre ellos es fundamental.",
    score: 3
  },
  "Aries-Taurus": {
    report: "El velocista y el maratonista. Aries aporta la chispa inicial y la energía para empezar, mientras que Tauro proporciona la resistencia, la paciencia y el enfoque metódico para asegurar que el trabajo se haga bien y se complete. Esta colaboración puede ser la base de un negocio exitoso si aprenden a valorar sus dones únicos. Fortalezas: Si logran sincronizar sus ritmos, cubren todo el ciclo de un proyecto. Aries inicia y Tauro construye y finaliza. Desafíos: Sus ritmos son opuestos. Aries puede ver a Tauro como exasperantemente lento y adverso al riesgo, y Tauro puede ver a Aries como imprudente, descuidado y propenso a errores por la prisa. La frustración puede surgir si no se respetan mutuamente. Clave del éxito: Respeto absoluto por sus diferentes estilos. Aries debe aprender a valorar la calidad y la planificación de Tauro, y Tauro debe confiar en la visión y la iniciativa de Aries, dándole un voto de confianza para explorar.",
    score: 3
  },
  "Aries-Gemini": {
    report: "Un equipo creativo, dinámico y lleno de ideas. Aries es el motor que impulsa la acción, y Géminis es la mente brillante que genera múltiples opciones y estrategias de comunicación. Son una dupla fantástica para brainstorming, marketing, redes sociales y proyectos que requieren agilidad mental y ejecución rápida. Fortalezas: Energía inagotable, creatividad y una excelente capacidad para adaptarse a los cambios. Nunca se estancan y su ambiente de trabajo es divertido y estimulante. Desafíos: Ambos pueden carecer de constancia y seguimiento. Pueden saltar de una idea a otra sin terminar la anterior. La falta de atención a los detalles puede ser un problema recurrente que requiera supervisión externa. Clave del éxito: Designar a un tercero (o que uno de ellos asuma el rol, aunque les cueste) para que se encargue de la planificación detallada y el seguimiento, asegurando que sus brillantes ideas se materialicen.",
    score: 4
  },
  "Aries-Cancer": {
    report: "Una combinación laboral delicada que requiere mucha conciencia emocional. La naturaleza directa y a veces abrasiva de Aries puede chocar fácilmente con la sensibilidad de Cáncer, quien puede tomarse las críticas como algo personal. Fortalezas: Aries puede motivar a Cáncer a salir de su zona de confort y a ser más asertivo. Cáncer puede enseñar a Aries la importancia de la intuición y el trabajo en equipo. Desafíos: La comunicación. Aries valora la franqueza, Cáncer la diplomacia. Los malentendidos son frecuentes si no se esfuerzan por comprender el estilo del otro. Clave del éxito: Aries debe aprender a ser un líder protector y no un jefe autoritario. Cáncer debe desarrollar una piel un poco más gruesa y comunicar sus necesidades de forma más directa.",
    score: 2
  },
  "Aries-Leo": {
    report: "El dúo dinámico del zodiaco. Dos signos de Fuego que se admiran, se respetan y se motivan mutuamente. Ambos son líderes natos, carismáticos y no temen tomar el centro del escenario. Juntos, pueden inspirar a todo un equipo. Fortalezas: Una ambición y energía compartidas. Son excelentes para ventas, marketing y roles de liderazgo. Se apoyan y celebran sus éxitos. Desafíos: La lucha de egos. Ambos quieren ser la estrella y pueden competir por el reconocimiento. Clave del éxito: Aprender a compartir el protagonismo y a funcionar como una 'power couple'. Si ven el éxito del otro como un éxito compartido, son verdaderamente imparables.",
    score: 5
  },
  "Aries-Virgo": {
    report: "El caos se encuentra con el orden. Aries es todo impulso y 'manos a la obra', mientras que Virgo es todo planificación, análisis y atención al detalle. Esta colaboración puede ser altamente productiva o un desastre de frustración. Fortalezas: Cubren todas las fases de un proyecto. Aries lo inicia con energía y Virgo lo perfecciona hasta el último detalle. Desafíos: Sus métodos son opuestos. Virgo se estresa con la falta de planificación de Aries, y Aries se impacienta con el meticuloso análisis de Virgo. Clave del éxito: Una delegación de tareas clara y un respeto absoluto por sus diferentes habilidades. Aries debe confiar en el proceso de Virgo, y Virgo debe confiar en la visión de Aries.",
    score: 2
  },
  "Aries-Libra": {
    report: "Una excelente combinación de 'músculo' y 'cerebro social'. Aries aporta la energía, la decisión y la acción directa, mientras que Libra aporta la estrategia, la diplomacia y la capacidad de construir puentes y negociar. Fortalezas: Se equilibran perfectamente. Son un equipo ideal para lanzar un nuevo producto o empresa, donde Aries impulsa el desarrollo y Libra gestiona las relaciones públicas y las alianzas. Desafíos: La aversión de Libra al conflicto puede chocar con la naturaleza confrontacional de Aries. Libra puede tardar en decidir, frustrando al impaciente Aries. Clave del éxito: Libra debe aprender a ser más directo, y Aries a valorar la diplomacia. Juntos, son la combinación perfecta de acción y estrategia.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Dos guerreros regidos por Marte en el mismo campo de batalla. La intensidad, la pasión y la determinación son enormes. Son un equipo formidable en situaciones de alta presión o crisis, donde su valentía combinada brilla. Fortalezas: Ambición, resiliencia y una capacidad para ir hasta el final. No se rinden fácilmente. Desafíos: Las luchas de poder son casi una garantía. Ambos son dominantes y quieren tener el control. La desconfianza puede surgir si no son completamente transparentes. Clave del éxito: La confianza y el respeto mutuo son innegociables. Deben tener roles muy bien definidos y aprender a canalizar su intensidad hacia metas comunes, en lugar de competir entre ellos.",
    score: 3
  },
  "Aries-Sagittarius": {
    report: "El equipo de Fuego de los pioneros. Dinámicos, optimistas y siempre en busca de la próxima gran aventura. Son excelentes para explorar nuevos mercados, lanzar ideas innovadoras y mantener la moral del equipo por las nubes. Fortalezas: Una energía y entusiasmo contagiosos. Se entienden en su necesidad de libertad y no temen tomar riesgos calculados. Desafíos: La falta de atención a los detalles y la planificación a largo plazo. Pueden ser geniales para empezar, pero necesitan a alguien que se ocupe del seguimiento y la ejecución detallada. Clave del éxito: Equilibrar su visión con un plan práctico. Disfrutar del viaje mientras mantienen el ojo en el destino final.",
    score: 4
  },
  "Aries-Capricorn": {
    report: "El impulso se encuentra con la estrategia. Aries es el cohete que quiere despegar ya, y Capricornio es la torre de control que planifica la trayectoria hasta el último detalle. Es una combinación de respeto mutuo si logran superar sus diferencias de ritmo. Fortalezas: Aries aporta la energía para la innovación y la acción rápida, mientras que Capricornio aporta la disciplina y la visión a largo plazo para construir algo duradero y exitoso. Desafíos: La impaciencia de Aries choca con la cautela de Capricornio. Aries puede ver a Capricornio como un freno, y Capricornio a Aries como imprudente. Clave del éxito: La paciencia. Capricornio debe valorar la capacidad de Aries para iniciar, y Aries debe respetar la sabiduría y la planificación estratégica de Capricornio. Juntos, pueden conquistar cualquier cima.",
    score: 3
  },
  "Aries-Aquarius": {
    report: "El inventor y el emprendedor. Acuario tiene las ideas geniales, originales y a menudo revolucionarias, y Aries tiene el coraje, la energía y el impulso para llevarlas al mercado. Son una pareja ideal para startups, tecnología y cualquier campo que requiera innovación. Fortalezas: Una combinación de visión de futuro y acción presente. Ambos son independientes y respetan la libertad del otro. Desafíos: La conexión emocional puede ser débil. Acuario puede ser demasiado desapegado para el apasionado Aries. La ejecución de los detalles puede no ser el fuerte de ninguno de los dos. Clave del éxito: Trabajar en proyectos que les apasionen a ambos. Celebrar la originalidad del otro y encontrar a alguien que se ocupe de la gestión del día a día.",
    score: 4
  },
  "Aries-Pisces": {
    report: "El líder y el visionario creativo. Aries puede proporcionar la estructura, la dirección y la confianza que el soñador Piscis a menudo necesita para concretar sus ideas. A su vez, Piscis puede aportar una perspectiva intuitiva y una creatividad sin límites que inspira a Aries. Fortalezas: Piscis puede visualizar el producto final, y Aries puede trazar el camino para llegar allí. Juntos, son excelentes en campos artísticos, publicitarios o de ayuda social. Desafíos: La comunicación debe ser delicada. La franqueza de Aries puede herir la sensibilidad de Piscis. La tendencia de Piscis a ser evasivo puede frustrar al directo Aries. Clave del éxito: Aries debe actuar como un líder protector, no como un sargento. Piscis debe hacer un esfuerzo por ser más claro y directo en sus comunicaciones.",
    score: 3
  },
  "Taurus-Taurus": {
    report: "Un equipo increíblemente sólido, fiable y trabajador. Juntos, son la definición de la constancia y la dedicación. Son excelentes para tareas que requieren paciencia, un enfoque metódico y una alta calidad de ejecución. Construyen lentamente pero sobre cimientos sólidos y duraderos. Fortalezas: Fiabilidad absoluta, una ética de trabajo compartida y un enfoque práctico. Son la columna vertebral de cualquier proyecto, garantizando que las promesas se cumplan. Desafíos: Su principal debilidad es la resistencia al cambio. Pueden ser demasiado lentos para adaptarse a nuevas ideas o tecnologías, y su terquedad combinada puede llevar a un estancamiento si no están de acuerdo. El lema 'siempre lo hemos hecho así' puede ser su perdición. Clave del éxito: Hacer un esfuerzo consciente por estar abiertos a la innovación y practicar la flexibilidad. Designar a uno como 'decisor final' en caso de desacuerdo puede evitar bloqueos y resentimientos.",
    score: 4
  },
  "Taurus-Gemini": {
    report: "El pragmático y el comunicador. Tauro aporta la estabilidad, el enfoque en la calidad y la determinación para terminar el trabajo. Géminis trae versatilidad, nuevas ideas y la habilidad para vender el proyecto a otros. Es una dupla de marketing y producción. Fortalezas: Tauro puede anclar las ideas dispersas de Géminis y darles forma, mientras que Géminis puede ayudar a Tauro a ser más flexible y a comunicarse mejor con clientes y equipos. Desafíos: Sus ritmos de trabajo son opuestos. Tauro puede frustrarse con la falta de constancia de Géminis, y Géminis puede aburrirse con el ritmo lento y metódico de Tauro, sintiéndose microgestionado. Clave del éxito: Una clara división de roles es esencial. Géminis se encarga de la comunicación, el brainstorming y las redes; Tauro se encarga de la producción, las finanzas y la gestión. El respeto por sus diferentes estilos es fundamental para no volverse locos.",
    score: 3
  },
  "Taurus-Cancer": {
    report: "Un dúo laboral muy nutritivo y de apoyo. Ambos valoran la seguridad y trabajan para crear un ambiente estable y casi familiar. Son excelentes en negocios relacionados con la hostelería, el sector inmobiliario, la alimentación o cualquier campo que requiera confianza y cuidado a largo plazo. Fortalezas: Tauro gestiona la parte práctica y financiera con solidez, mientras que Cáncer se ocupa del bienestar del equipo y de la intuición sobre las necesidades del cliente. Su lealtad mutua es inquebrantable, creando un negocio con alma. Desafíos: Ambos pueden ser reacios al riesgo y a los cambios, prefiriendo mantenerse en su zona de confort, lo que puede llevar al estancamiento. Cáncer puede tomar las decisiones de negocio de forma demasiado personal. Clave del éxito: Animar al otro a tomar riesgos calculados. Su combinación de practicidad e intuición les da una gran ventaja si se atreven a usarla para innovar en lugar de solo para protegerse.",
    score: 4
  },
  "Taurus-Leo": {
    report: "Una dupla de poder que aprecia la calidad y el lujo. Sin embargo, sus voluntades de hierro pueden chocar. Tauro se enfoca en la sustancia y la rentabilidad, mientras que Leo busca el reconocimiento y la presentación espectacular. Fortalezas: Si logran alinear sus objetivos, pueden crear productos o servicios de alta gama. Leo es el carismático portavoz y Tauro el sólido productor ejecutivo que se asegura de que todo funcione. Desafíos: Las luchas de poder por el control y el presupuesto son comunes. Leo puede ser extravagante, mientras que Tauro es más conservador. Ambos son tercos. Clave del éxito: Un profundo respeto por las habilidades del otro. Leo debe confiar en el juicio financiero de Tauro, y Tauro debe permitir que Leo brille y sea la cara del proyecto.",
    score: 3
  },
  "Taurus-Virgo": {
    report: "El equipo de tierra perfecto. Prácticamente la combinación más productiva y fiable del zodíaco. Ambos son prácticos, detallistas, trabajadores y tienen un alto estándar de calidad. Se entienden sin necesidad de muchas palabras. Fortalezas: Eficiencia, organización y una ética de trabajo impecable. Juntos, pueden abordar las tareas más complejas con precisión y paciencia. Desafíos: Pueden ser demasiado cautelosos y perder oportunidades por analizar en exceso. También corren el riesgo de quedarse atascados en los detalles y perder la visión general. Clave del éxito: Confiar en su proceso y animarse mutuamente a tomar riesgos calculados de vez en cuando. Deben recordar levantar la vista para ver el panorama completo.",
    score: 5
  },
  "Taurus-Libra": {
    report: "Ambos regidos por Venus, aprecian un ambiente de trabajo armonioso y estético. Tauro se centra en el resultado tangible y la calidad del producto, mientras que Libra se enfoca en las relaciones con los clientes, la estrategia de marca y la estética. Fortalezas: Crean un ambiente de trabajo agradable y pueden producir productos o servicios que son tanto funcionales como hermosos. Libra es excelente en la negociación, y Tauro en la ejecución. Desafíos: La indecisión de Libra puede frustrar al práctico Tauro. Libra puede priorizar la armonía sobre la eficiencia, lo que choca con el enfoque de Tauro en los resultados. Clave del éxito: Tauro debe dar a Libra el espacio para negociar y crear, mientras que Libra debe respetar la necesidad de Tauro de tomar decisiones prácticas y avanzar.",
    score: 3
  },
  "Taurus-Scorpio": {
    report: "Una pareja poderosa, decidida y con una increíble capacidad de concentración. Como signos opuestos, se atraen y se complementan. Tauro aporta la resistencia y la determinación para construir, mientras que Escorpio ofrece la estrategia, la perspicacia y la capacidad de ver lo que otros no ven. Fortalezas: Un dúo formidable en finanzas, investigación o cualquier campo que requiera profundidad y resistencia. Son extremadamente leales si la confianza está establecida. Desafíos: Su naturaleza fija los hace tercos. Las luchas de poder pueden ser intensas. Escorpio puede ser reservado, mientras que Tauro es más transparente, lo que puede generar desconfianza. Clave del éxito: La confianza y la transparencia son absolutamente cruciales. Deben alinear sus objetivos y respetar la autoridad del otro en sus respectivas áreas de especialización.",
    score: 4
  },
  "Taurus-Sagittarius": {
    report: "El conservador y el aventurero. Tauro prefiere métodos probados y seguros, mientras que Sagitario está dispuesto a experimentar, tomar riesgos y explorar nuevos horizontes. Sus enfoques fundamentales del trabajo y el dinero pueden chocar. Fortalezas: Sagitario puede abrir nuevos mercados y oportunidades que Tauro nunca consideraría, mientras que Tauro puede asegurar que esas aventuras sean rentables y sostenibles a largo plazo. Desafíos: Sagitario puede ver a Tauro como aburrido y restrictivo. Tauro puede ver a Sagitario como imprudente y poco fiable. Clave del éxito: Una clara división de roles. Sagitario explora y vende la visión, y Tauro gestiona los recursos y la ejecución. Requiere una gran dosis de respeto por sus diferentes filosofías.",
    score: 2
  },
  "Taurus-Capricorn": {
    report: "El equipo de trabajo soñado para cualquier empresa. Dos signos de Tierra que comparten una ética de trabajo impecable, ambición y un enfoque práctico de la vida. Se respetan profundamente y trabajan juntos de manera constante y fiable hacia metas a largo plazo. Fortalezas: Disciplina, paciencia y una dedicación compartida a la calidad. Son excelentes construyendo negocios, gestionando finanzas y llevando a cabo proyectos complejos. Su relación es profesional y sólida. Desafíos: Pueden ser tan enfocados en el trabajo que se olvidan de celebrar los logros o de innovar. Corren el riesgo de ser demasiado conservadores. Clave del éxito: Animar al otro a pensar fuera de la caja de vez en cuando y recordar disfrutar del proceso y los frutos de su trabajo.",
    score: 5
  },
  "Taurus-Aquarius": {
    report: "Una combinación desafiante de lo tradicional y lo radical. Tauro es un constructor que valora la tradición y la seguridad. Acuario es un innovador que valora la libertad y el cambio. Ambos son signos fijos, lo que significa que son extremadamente tercos en sus posturas. Fortalezas: Si logran unirse, pueden ser revolucionarios. Tauro puede dar a las ideas de Acuario la base sólida que necesitan para manifestarse, y Acuario puede sacar a Tauro de su estancamiento. Desafíos: Sus valores fundamentales chocan. Acuario puede ver a Tauro como anticuado y materialista, y Tauro puede ver a Acuario como poco práctico y errático. Clave del éxito: Un inmenso respeto mutuo por sus diferentes perspectivas. Deben encontrar un proyecto donde la estabilidad y la innovación sean igualmente necesarias.",
    score: 2
  },
  "Taurus-Pisces": {
    report: "El ancla y el soñador. Esta es una colaboración laboral maravillosamente sinérgica. Tauro, con su enfoque práctico y su estabilidad, puede ayudar a dar forma y estructura a las ideas creativas y a menudo abstractas de Piscis. Fortalezas: Piscis inspira a Tauro con su visión y empatía, lo que puede ser clave en el trato con clientes o en campos creativos. Tauro proporciona la seguridad y la gestión que Piscis necesita para no perderse en sus sueños. Se complementan a la perfección. Desafíos: Tauro puede frustrarse con la falta de organización o la naturaleza evasiva de Piscis. Piscis puede sentirse limitado por el enfoque puramente práctico de Tauro. Clave del éxito: Tauro debe actuar como el productor de las ideas de Piscis, no como su crítico. Piscis debe apreciar la estabilidad que Tauro le proporciona.",
    score: 4
  },
  "Gemini-Gemini": {
    report: "Una usina de ideas, comunicación y multitarea. Juntos son excelentes para brainstorming, redes sociales, ventas y cualquier rol que requiera agilidad mental y social. La energía es alta y nunca se aburren, lo que crea un ambiente de trabajo dinámico. Fortalezas: Creatividad sin fin, adaptabilidad y una capacidad innata para conectar con la gente y vender una idea. Son flexibles ante los cambios de última hora. Desafíos: El principal problema es el enfoque y la finalización. Pueden tener cientos de ideas brillantes pero dificultades para llevar una sola a término. La organización, el seguimiento y la atención al detalle no son sus puntos fuertes, lo que puede llevar al caos. Clave del éxito: Necesitan un sistema, un plan o un tercer miembro del equipo (probablemente un signo de Tierra) que aporte estructura y se asegure de que las tareas se completen. La disciplina autoimpuesta es clave.",
    score: 4
  },
  "Gemini-Cancer": {
    report: "La mente y el corazón. Géminis aporta las ideas lógicas y las habilidades de comunicación, mientras que Cáncer aporta la intuición sobre las necesidades del equipo o de los clientes. Pueden ser una gran dupla creativa, especialmente en marketing, recursos humanos o cualquier campo que requiera tanto ingenio como empatía. Fortalezas: Géminis puede articular las ideas intuitivas de Cáncer, y Cáncer puede añadir una capa de empatía y cuidado a la comunicación de Géminis, creando mensajes que conectan emocionalmente. Desafíos: La comunicación directa de Géminis, a veces sin filtro, puede herir la sensibilidad de Cáncer. Cáncer debe aprender a no tomarse las cosas de manera tan personal en un entorno profesional y a comunicar sus necesidades de forma más directa en lugar de esperar que los demás las adivinen. Clave del éxito: Géminis debe cultivar la empatía en su comunicación, y Cáncer debe esforzarse por ser más directo. Si lo logran, se convierten en un equipo de comunicación muy completo.",
    score: 3
  },
  "Gemini-Leo": {
    report: "El equipo perfecto para marketing, relaciones públicas y cualquier rol de cara al público. Géminis es el brillante estratega de la comunicación, capaz de crear mensajes ingeniosos, mientras que Leo es el carismático portavoz que los entrega con pasión y confianza. Fortalezas: Son una pareja socialmente magnética. Se admiran mutuamente y se divierten trabajando juntos, creando un ambiente de trabajo positivo y enérgico. Juntos, son un espectáculo que puede cautivar a cualquier audiencia. Desafíos: Leo necesita ser el centro de atención, y Géminis, aunque no compite por el protagonismo, puede distraerse y no darle a Leo el 'feedback' positivo y la admiración que necesita para mantenerse motivado. Clave del éxito: Géminis debe usar su ingenio para hacer brillar a Leo, y Leo debe valorar y dar crédito a las brillantes ideas de Géminis. Es una relación simbiótica si ambos entienden sus roles.",
    score: 4
  },
  "Gemini-Virgo": {
    report: "Dos mentes regidas por Mercurio, pero con enfoques diametralmente opuestos. Géminis es el generalista que ve el panorama general y genera ideas, mientras que Virgo es el especialista que se sumerge en los detalles y los perfecciona. Fortalezas: Potencialmente, un equipo de edición, planificación y revisión imbatible. Géminis crea el borrador y Virgo lo pule a la perfección. Pueden tener debates intelectuales muy estimulantes. Desafíos: La frustración es un riesgo constante. Virgo se exaspera con la falta de atención al detalle y la inconsistencia de Géminis. Géminis se siente limitado, criticado y microgestionado por el perfeccionismo de Virgo. Clave del éxito: Respeto absoluto por sus diferentes dones y una división de tareas muy clara. No deben intentar hacer el trabajo del otro. Géminis crea, Virgo refina.",
    score: 3
  },
  "Gemini-Libra": {
    report: "Una colaboración intelectualmente estimulante y socialmente hábil. Como dos signos de Aire, su comunicación es fluida, natural y diplomática. Son excelentes en roles que requieren negociación, mediación, derecho, arte o estrategia de marca. Fortalezas: Comparten un enfoque mental y objetivo. Son capaces de ver múltiples perspectivas y encontrar soluciones justas y equilibradas. Suelen crear un ambiente de trabajo armonioso, justo y agradable. Desafíos: Su principal desafío es pasar de la deliberación a la acción concreta. Pueden pasar demasiado tiempo discutiendo ideas y sopesando opciones, lo que retrasa la ejecución. Ambos pueden evitar el conflicto necesario para avanzar. Clave del éxito: Establecer plazos claros y roles definidos para la toma de decisiones. Uno de ellos debe asumir la responsabilidad de dar el paso final para evitar la parálisis por análisis.",
    score: 4
  },
  "Gemini-Scorpio": {
    report: "El periodista y el detective. Géminis es experto en recopilar una amplia gama de información de la superficie, mientras que Escorpio es un maestro en la investigación profunda y en descubrir secretos. Fortalezas: Juntos, forman un equipo de investigación formidable. Pueden descubrir cualquier cosa, desde tendencias de mercado hasta fallos ocultos en un sistema. La agilidad de Géminis y la profundidad de Escorpio se complementan. Desafíos: La confianza. La naturaleza abierta y comunicativa de Géminis puede chocar con el secretismo y la desconfianza natural de Escorpio. Escorpio puede ver a Géminis como superficial, y Géminis puede ver a Escorpio como demasiado intenso y controlador. Clave del éxito: La transparencia es clave. Géminis debe ser directo y honesto para ganarse la confianza de Escorpio, y Escorpio debe aprender a no sospechar de la naturaleza social de Géminis.",
    score: 3
  },
  "Gemini-Sagittarius": {
    report: "La pareja de la expansión de ideas y la comunicación. Como signos opuestos, se complementan y se desafían. Ambos aman aprender, enseñar y explorar nuevos horizontes. Son excelentes en roles de educación, viajes, publicaciones o medios de comunicación. Fortalezas: Una visión amplia y una curiosidad insaciable. Juntos, pueden generar ideas grandiosas y comunicarlas de manera efectiva y entretenida. Desafíos: La constancia y el seguimiento no son el fuerte de ninguno. Ambos pueden empezar proyectos con gran entusiasmo pero perder el interés rápidamente. La honestidad brutal de Sagitario puede chocar con la diplomacia más juguetona de Géminis. Clave del éxito: Necesitan un plan sólido y metas intermedias para no desviarse. La pasión por el tema en cuestión mantendrá a ambos comprometidos.",
    score: 4
  },
  "Gemini-Capricorn": {
    report: "El innovador y el CEO. Géminis tiene las ideas nuevas, frescas y a veces caóticas, y Capricornio tiene la disciplina, la estructura y la visión a largo plazo para hacerlas rentables y duraderas. Fortalezas: Capricornio puede dar a Géminis el enfoque que necesita para materializar sus ideas. Géminis puede ayudar a Capricornio a ser más flexible y a adaptarse a los cambios del mercado con agilidad. Desafíos: Sus ritmos son completamente diferentes. Capricornio debe tener paciencia con la naturaleza cambiante y la necesidad de variedad de Géminis. Géminis debe respetar la necesidad de Capricornio de seguir un plan y cumplir los plazos. Clave del éxito: Una comunicación clara sobre las expectativas. Si Géminis entiende los objetivos a largo plazo y Capricornio valora la innovación, pueden ser un equipo muy exitoso.",
    score: 3
  },
  "Gemini-Aquarius": {
    report: "Una dupla innovadora, cerebral y llena de ideas revolucionarias. Dos signos de Aire que prosperan en entornos que requieren pensamiento original, comunicación y colaboración en equipo. Son excelentes para brainstorming, planificación estratégica y proyectos de vanguardia. Fortalezas: Una conexión mental casi telepática. Respetan la independencia del otro y trabajan bien sin necesidad de supervisión constante. Son visionarios. Desafíos: Pueden ser tan teóricos que se olviden de los aspectos prácticos de la ejecución. La conexión emocional puede ser secundaria, lo que podría afectar la moral del equipo si no son conscientes de ello. Clave del éxito: Deben asegurarse de tener un plan de acción claro y de asignar tareas prácticas. Combinar su visión con un enfoque en los resultados los hará imparables.",
    score: 5
  },
  "Gemini-Pisces": {
    report: "Un dúo altamente creativo, imaginativo y adaptable. Son perfectos para las artes, la publicidad, la escritura o cualquier campo donde la imaginación sea el activo principal. Géminis puede dar voz y estructura a las ideas intuitivas de Piscis. Fortalezas: Creatividad sin límites y una gran flexibilidad para adaptarse a los cambios. Desafíos: La comunicación es el mayor desafío. Géminis es lógico, Piscis es emocional. Piscis puede sentirse herido por la franqueza de Géminis, y Géminis puede frustrarse con la falta de claridad de Piscis. Ambos pueden carecer de enfoque práctico. Clave del éxito: La paciencia y la empatía son cruciales. Necesitan un terreno común, como un proyecto creativo apasionante, para alinear sus energías y un 'traductor' o sistema para asegurar que ambos están en la misma página.",
    score: 3
  },
  "Cancer-Cancer": {
    report: "Un equipo increíblemente unido e intuitivo. Crean un ambiente de trabajo que se siente como una familia. Son muy protectores entre sí y excelentes en roles que requieren empatía y cuidado. Su desafío es no volverse demasiado emocionales o cerrados a nuevas ideas.",
    score: 4
  },
  "Cancer-Leo": {
    report: "El protector y el líder carismático. Cáncer se asegura de que el equipo esté feliz y motivado, mientras que Leo inspira y da la cara por el proyecto. Funciona bien si Leo valora el apoyo de Cáncer y Cáncer no se siente eclipsado por el brillo de Leo.",
    score: 3
  },
  "Cancer-Virgo": {
    report: "Una combinación laboral casi perfecta. Ambos son dedicados, responsables y orientados al servicio. Cáncer aporta la intuición y el cuidado, mientras que Virgo aporta la organización y la atención al detalle. Juntos, crean un producto o servicio de alta calidad y con un toque humano.",
    score: 5
  },
  "Cancer-Libra": {
    report: "Ambos buscan un ambiente de trabajo armonioso. Cáncer aporta la inteligencia emocional, mientras que Libra se destaca en la negociación y las relaciones públicas. Son un gran equipo para roles de servicio al cliente o gestión de equipos, aunque pueden evitar tomar decisiones difíciles.",
    score: 3
  },
  "Cancer-Scorpio": {
    report: "Un equipo increíblemente intuitivo y poderoso. Se entienden a un nivel profundo y son ferozmente leales. Excelentes para roles que requieren estrategia, profundidad y confianza. Pueden ser un poco cerrados con los demás.",
    score: 5
  },
  "Cancer-Sagittarius": {
    report: "Una mezcla desafiante. La necesidad de seguridad de Cáncer choca con el deseo de Sagitario de tomar riesgos y explorar. La comunicación directa de Sagitario puede herir la sensibilidad de Cáncer. Requiere mucho esfuerzo para alinear sus estilos de trabajo.",
    score: 2
  },
  "Cancer-Capricorn": {
    report: "El eje hogar-carrera del zodíaco. Se complementan a la perfección en un entorno de negocios. Cáncer gestiona el bienestar emocional del equipo, mientras que Capricornio impulsa los objetivos empresariales. Un equipo formidable.",
    score: 5
  },
  "Cancer-Aquarius": {
    report: "El tradicionalista y el innovador. Cáncer prefiere métodos probados y un ambiente seguro, mientras que Acuario busca constantemente nuevas formas de hacer las cosas. Acuario puede parecer demasiado desapegado para Cáncer, y Cáncer demasiado emocional para Acuario. Una colaboración difícil.",
    score: 2
  },
  "Cancer-Pisces": {
    report: "Compañeros de trabajo increíblemente intuitivos y empáticos. Crean un ambiente laboral de apoyo y colaboración. Son ideales para profesiones creativas o de cuidado, donde la sensibilidad es una fortaleza.",
    score: 4
  },
  "Leo-Leo": {
    report: "Un dúo de pura realeza y carisma. Son excelentes para roles de liderazgo, ventas y relaciones públicas. Su energía combinada es magnética. El principal desafío es la lucha de egos; ambos quieren ser la estrella. Si aprenden a compartir el protagonismo, son imparables.",
    score: 4
  },
  "Leo-Virgo": {
    report: "El líder y el organizador. Leo aporta la visión y el carisma, mientras que Virgo se encarga de los detalles y la ejecución perfecta. Leo puede ver a Virgo como demasiado crítico, y Virgo a Leo como descuidado. Si respetan sus roles, son un equipo muy eficaz.",
    score: 3
  },
  "Leo-Libra": {
    report: "Un equipo con gran carisma y habilidades sociales. Leo lidera con confianza y Libra aporta diplomacia y estrategia. Juntos son excelentes en roles de cara al público, ventas, marketing y relaciones públicas.",
    score: 4
  },
  "Leo-Scorpio": {
    report: "Dos signos de voluntad de hierro. Su determinación combinada es inmensa. Son excelentes para proyectos de alto riesgo que requieren agallas. Sin embargo, las luchas de poder son casi inevitables. Ambos son fijos y quieren el control, lo que puede generar un ambiente de trabajo intenso.",
    score: 3
  },
  "Leo-Sagittarius": {
    report: "El equipo de Fuego perfecto para la motivación. Ambos son optimistas, enérgicos e inspiradores. Ideales para startups, marketing y roles que requieran entusiasmo y visión de futuro. Mantienen la moral alta y no temen a los grandes desafíos.",
    score: 5
  },
  "Leo-Capricorn": {
    report: "El rey y el estratega. Ambos son ambiciosos y orientados al éxito. Leo aporta el carisma y la visión, mientras que Capricornio aporta la disciplina y la estructura para alcanzar la cima. Pueden chocar si Leo ve a Capricornio como demasiado restrictivo, o Capricornio ve a Leo como demasiado derrochador.",
    score: 3
  },
  "Leo-Aquarius": {
    report: "Una pareja creativa y poco convencional. Leo se enfoca en la expresión personal y el liderazgo, mientras que Acuario se enfoca en el equipo y la innovación. Juntos, pueden ser geniales para proyectos creativos o de impacto social. Deben respetar sus diferentes enfoques del trabajo en equipo.",
    score: 4
  },
  "Leo-Pisces": {
    report: "El líder inspirador y el visionario creativo. Leo puede dar a Piscis la confianza y la estructura para brillar, mientras que Piscis aporta una intuición y una creatividad que pueden llevar los proyectos a otro nivel. Leo debe ser cuidadoso con las críticas para no herir la sensibilidad de Piscis.",
    score: 3
  },
  "Virgo-Virgo": {
    report: "El equipo de los perfeccionistas. Juntos, no se les escapa ni un solo detalle. Son increíblemente eficientes, organizados y fiables. Su principal desafío es evitar la parálisis por análisis o ser demasiado críticos el uno con el otro. Crean sistemas y procesos impecables.",
    score: 5
  },
  "Virgo-Libra": {
    report: "Una combinación de servicio y diplomacia. Virgo se encarga de la logística y la calidad, mientras que Libra gestiona las relaciones con clientes y el equipo. Libra aporta una visión estética que Virgo puede ejecutar a la perfección. Una dupla muy profesional y agradable.",
    score: 4
  },
  "Virgo-Scorpio": {
    report: "Una combinación de precisión y profundidad. Virgo se enfoca en los detalles y la eficiencia, mientras que Escorpio investiga hasta encontrar la raíz del problema. Juntos son imbatibles en tareas de análisis, investigación y resolución de problemas complejos.",
    score: 5
  },
  "Virgo-Sagittarius": {
    report: "El planificador meticuloso frente al visionario expansivo. Virgo puede frustrarse con la falta de atención al detalle de Sagitario, y Sagitario puede sentirse limitado por la cautela de Virgo. Sin embargo, si aprenden a respetar sus roles, Virgo puede dar estructura a las grandes ideas de Sagitario.",
    score: 2
  },
  "Virgo-Capricorn": {
    report: "Una de las combinaciones más productivas y eficientes del zodíaco. Ambos son signos de Tierra, trabajadores, prácticos y orientados a objetivos. Se respetan mutuamente y forman un equipo que garantiza la máxima calidad y fiabilidad. Juntos, construyen imperios.",
    score: 5
  },
  "Virgo-Aquarius": {
    report: "El analista y el innovador. Virgo puede ayudar a Acuario a aterrizar sus ideas futuristas con planes realistas, mientras que Acuario puede enseñar a Virgo a pensar fuera de la caja. La comunicación es clave para que Virgo no vea a Acuario como caótico, y Acuario no vea a Virgo como demasiado rígido.",
    score: 3
  },
  "Virgo-Pisces": {
    report: "El sanador y el soñador, aplicados al trabajo. Virgo aporta la estructura y el orden, mientras que Piscis aporta la creatividad, la intuición y la empatía. Son excelentes en campos creativos, de sanación o de servicio social. Virgo mantiene el proyecto en marcha y Piscis le da alma.",
    score: 4
  },
  "Libra-Libra": {
    report: "El equipo de la diplomacia y la estética. Son excelentes en roles que requieren negociación, mediación y un alto sentido del estilo. Su principal desafío es la toma de decisiones; pueden pasar demasiado tiempo deliberando para mantener la armonía. Necesitan un líder claro o plazos estrictos.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "El diplomático y el estratega. Libra puede manejar las relaciones públicas mientras Escorpio profundiza en la investigación y la estrategia. Una combinación potente en derecho o consultoría, aunque Libra puede sentirse incómodo con la intensidad de Escorpio.",
    score: 3
  },
  "Libra-Sagittarius": {
    report: "Una dupla expansiva y optimista. Ideal para roles en relaciones públicas, marketing internacional o educación. Libra aporta la estrategia social y Sagitario la visión y el entusiasmo. Juntos, pueden encantar y convencer a cualquiera.",
    score: 4
  },
  "Libra-Capricorn": {
    report: "Una pareja de poder social y corporativo. Libra es la cara pública y el negociador, mientras que Capricornio es el arquitecto del negocio. Se respetan mutuamente y pueden alcanzar un alto estatus, siempre que Capricornio no vea a Libra como indeciso y Libra no vea a Capricornio como demasiado rígido.",
    score: 4
  },
  "Libra-Aquarius": {
    report: "El equipo de los idealistas. Dos signos de Aire que conectan a nivel intelectual. Son excelentes para trabajar en organizaciones sin fines de lucro, causas sociales o proyectos tecnológicos innovadores. Valoran la justicia y la comunicación por encima de todo.",
    score: 5
  },
  "Libra-Pisces": {
    report: "El equipo creativo y compasivo. Perfectos para las artes, el diseño, la moda o campos de sanación. Libra aporta el sentido estético y el equilibrio, mientras que Piscis aporta la imaginación y la empatía. Su desafío es mantenerse organizados y enfocados en los objetivos prácticos.",
    score: 3
  },
  "Scorpio-Scorpio": {
    report: "Dos Escorpio juntos son una fuerza imparable de intensidad y enfoque. Son un equipo de investigación de élite, capaces de descubrir cualquier secreto o resolver los problemas más complejos. Su lealtad es absoluta, pero las luchas de poder pueden ser un gran problema. La confianza total es esencial.",
    score: 4
  },
  "Scorpio-Sagittarius": {
    report: "El detective y el explorador. Escorpio se sumerge en la profundidad, mientras que Sagitario busca la visión general. Pueden chocar, ya que Escorpio puede ver a Sagitario como superficial, y Sagitario puede sentirse agobiado por la intensidad de Escorpio. Funcionan si Sagitario respeta la necesidad de Escorpio de ir al fondo del asunto.",
    score: 2
  },
  "Scorpio-Capricorn": {
    report: "Una 'power couple' del mundo laboral. La perspicacia de Escorpio combinada con la ambición y la disciplina de Capricornio crea un equipo formidable para cualquier objetivo. Ambos son estratégicos y orientados a resultados, construyendo planes sólidos y ejecutándolos con precisión.",
    score: 5
  },
  "Scorpio-Aquarius": {
    report: "El psicólogo y el futurista. Ambos son signos fijos con fuertes convicciones. Escorpio opera desde la emoción y la profundidad, mientras que Acuario lo hace desde la lógica y el desapego. Pueden chocar fuertemente, pero si unen sus perspectivas, pueden lograr innovaciones con un profundo impacto.",
    score: 2
  },
  "Scorpio-Pisces": {
    report: "Una conexión increíblemente intuitiva y creativa. Escorpio proporciona la estrategia y el enfoque, mientras que Piscis aporta la imaginación y la empatía. Juntos son un dúo increíble en campos artísticos, de sanación o de investigación, donde la intuición es clave. Se entienden sin palabras.",
    score: 5
  },
  "Sagittarius-Sagittarius": {
    report: "Un equipo lleno de optimismo, energía y grandes ideas. Son excelentes para roles de marketing, ventas y cualquier proyecto que requiera una visión expansiva y entusiasmo. Su principal desafío es la falta de atención a los detalles y la tendencia a empezar muchos proyectos sin terminarlos. Necesitan a alguien que los ancle a la realidad.",
    score: 4
  },
  "Sagittarius-Capricorn": {
    report: "El visionario y el arquitecto. Sagitario aporta las ideas audaces y la visión a futuro, mientras que Capricornio crea el plan y la estructura para hacerlas realidad. Pueden chocar por el ritmo y la aversión al riesgo, pero si se respetan, son un dúo de éxito garantizado.",
    score: 3
  },
  "Sagittarius-Aquarius": {
    report: "Un dúo intelectual, innovador y con visión de futuro. Ambos aman la libertad y las ideas no convencionales. Son perfectos para startups, proyectos de I+D o causas sociales. Su colaboración es estimulante y siempre está mirando hacia el futuro.",
    score: 4
  },
  "Sagittarius-Pisces": {
    report: "El filósofo y el soñador. Ambos regidos por Júpiter, comparten un deseo de expansión. Sagitario aporta la energía y la visión optimista, mientras que Piscis aporta la creatividad y la intuición. Juntos, son excelentes en campos creativos o espirituales, aunque deben tener cuidado con la falta de enfoque práctico.",
    score: 3
  },
  "Capricorn-Capricorn": {
    report: "El equipo directivo definitivo. Dos Capricornio juntos son la definición de ambición y profesionalismo. Se respetan mutuamente y trabajan con una disciplina inquebrantable hacia metas compartidas. El único riesgo es que la competencia interna se vuelva demasiado seria o que se olviden de celebrar los éxitos.",
    score: 4
  },
  "Capricorn-Aquarius": {
    report: "El tradicionalista y el innovador. Capricornio aporta la estructura y Acuario las ideas rompedoras. Si Capricornio está abierto a nuevas formas de hacer las cosas y Acuario respeta la necesidad de un plan, pueden ser un equipo muy poderoso que combine lo mejor de ambos mundos.",
    score: 3
  },
  "Capricorn-Pisces": {
    report: "Una combinación sorprendentemente eficaz. Capricornio proporciona la estructura y la dirección que Piscis necesita para canalizar su inmensa creatividad. Piscis, a su vez, aporta una visión y una empatía que pueden suavizar el enfoque a veces rígido de Capricornio. Juntos, hacen que los sueños se hagan realidad.",
    score: 4
  },
  "Aquarius-Aquarius": {
    report: "Un laboratorio de ideas en constante ebullición. Dos Acuario juntos son brillantes, innovadores y siempre están pensando en el futuro. Son excelentes para proyectos de vanguardia, tecnología y causas sociales. Su desafío es asegurarse de que alguien se encargue de los detalles prácticos y la ejecución del día a día.",
    score: 4
  },
  "Aquarius-Pisces": {
    report: "El visionario y el soñador. Esta pareja puede concebir las ideas más humanitarias y creativas. Acuario aporta la lógica y la visión de futuro, mientras que Piscis aporta la compasión y la intuición. Necesitan un tercer compañero más práctico para ayudarles a materializar sus ideas.",
    score: 3
  },
  "Pisces-Pisces": {
    report: "Un equipo increíblemente creativo, empático e intuitivo. Son perfectos para trabajar en las artes, campos de sanación o cualquier rol que requiera una gran imaginación. Su principal desafío es mantenerse organizados, cumplir con los plazos y no dejarse llevar por las emociones del entorno laboral.",
    score: 4
  }
};

