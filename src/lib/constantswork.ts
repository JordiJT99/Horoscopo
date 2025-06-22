
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const workCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Taurus-Capricorn": {
    report: "El equipo de trabajo soñado para cualquier empresa. Ambos son prácticos, disciplinados y orientados a resultados. Trabajan de manera constante y fiable, construyendo proyectos sólidos y duraderos. Respeto y profesionalismo definen su relación.",
    score: 5
  },
  "Gemini-Aquarius": {
    report: "Una dupla innovadora y llena de ideas revolucionarias. Ambos signos de Aire prosperan en entornos que requieren pensamiento original y comunicación. Son excelentes para brainstorming, estrategia y proyectos de vanguardia.",
    score: 5
  },
  "Cancer-Pisces": {
    report: "Compañeros de trabajo increíblemente intuitivos y empáticos. Crean un ambiente laboral de apoyo y colaboración. Son ideales para profesiones creativas o de cuidado, donde la sensibilidad es una fortaleza.",
    score: 4
  },
  "Cancer-Scorpio": {
    report: "Un equipo increíblemente intuitivo y poderoso. Se entienden a un nivel profundo y son ferozmente leales. Excelentes para roles que requieren estrategia, profundidad y confianza. Pueden ser un poco cerrados con los demás.",
    score: 5
  },
  "Cancer-Capricorn": {
    report: "El eje hogar-carrera del zodíaco. Se complementan a la perfección en un entorno de negocios. Cáncer gestiona el bienestar emocional del equipo, mientras que Capricornio impulsa los objetivos empresariales. Un equipo formidable.",
    score: 5
  },
  "Leo-Libra": {
    report: "Un equipo con gran carisma y habilidades sociales. Leo lidera con confianza y Libra aporta diplomacia y estrategia. Juntos son excelentes en roles de cara al público, ventas, marketing y relaciones públicas.",
    score: 4
  },
  "Aries-Sagittarius": {
    report: "Dinámicos, entusiastas y siempre listos para un nuevo desafío. Este par de Fuego no teme tomar riesgos y son pioneros en su campo. Se motivan mutuamente y mantienen la moral del equipo alta, aunque deben cuidar los detalles.",
    score: 4
  },
  "Virgo-Scorpio": {
    report: "Una combinación de precisión y profundidad. Virgo se enfoca en los detalles y la eficiencia, mientras que Escorpio investiga hasta encontrar la raíz del problema. Juntos son imbatibles en tareas de análisis, investigación y resolución de problemas complejos.",
    score: 5
  },
  "Aries-Virgo": {
    report: "El enfoque impulsivo de Aries puede frustrar al meticuloso Virgo. Aries quiere empezar ya, mientras que Virgo necesita planificar cada detalle. La paciencia y la delegación de tareas según las fortalezas de cada uno es crucial.",
    score: 2
  },
  "Leo-Taurus": {
    report: "Ambos son signos fijos y tercos, lo que puede llevar a luchas de poder. Leo busca reconocimiento, mientras que Tauro busca seguridad y resultados tangibles. Necesitan encontrar un terreno común y respetar los métodos del otro para tener éxito.",
    score: 2
  },
  "Aries-Aries": {
    report: "Un dúo de alta energía y competitividad. Pueden ser grandes motivadores si trabajan hacia un objetivo común, pero también pueden chocar por el liderazgo. La comunicación clara sobre roles es esencial.",
    score: 3
  },
  "Aries-Taurus": {
    report: "El enfoque rápido de Aries choca con el ritmo metódico de Tauro. Tauro puede ver a Aries como imprudente, y Aries a Tauro como lento. Necesitan respetar sus diferentes estilos para funcionar.",
    score: 2
  },
  "Aries-Gemini": {
    report: "Un equipo dinámico y creativo. Aries aporta la energía para iniciar, mientras que Géminis ofrece ideas brillantes y habilidades de comunicación. Son excelentes para proyectos que requieren agilidad y pensamiento rápido.",
    score: 4
  },
  "Aries-Cancer": {
    report: "Una combinación delicada. La franqueza de Aries puede chocar con la sensibilidad de Cáncer. Aries debe ser más considerado y Cáncer más directo para evitar malentendidos en el entorno laboral.",
    score: 2
  },
  "Aries-Leo": {
    report: "Un dúo poderoso y carismático. Ambos son líderes natos y se admiran mutuamente. Si logran alinear sus egos y trabajar en equipo, son imparables en la consecución de objetivos ambiciosos.",
    score: 5
  },
  "Aries-Libra": {
    report: "Una excelente combinación de acción y diplomacia. Aries toma la iniciativa, mientras que Libra aporta equilibrio, estrategia y habilidades interpersonales. Juntos cubren todas las bases.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Dos potencias regidas por Marte. Su intensidad combinada puede mover montañas o desatar conflictos. Son excelentes en situaciones de crisis, pero deben tener cuidado con las luchas de poder.",
    score: 3
  },
  "Aries-Capricorn": {
    report: "El velocista y el maratonista. Aries busca resultados rápidos, mientras que Capricornio construye un plan a largo plazo. Pueden tener éxito si Capricornio valora la iniciativa de Aries y Aries respeta la estrategia de Capricornio.",
    score: 3
  },
  "Aries-Aquarius": {
    report: "Una pareja innovadora. Acuario tiene las ideas originales y futuristas, y Aries tiene la energía y el coraje para ponerlas en marcha. Son excelentes para startups y proyectos disruptivos.",
    score: 4
  },
  "Aries-Pisces": {
    report: "El líder y el soñador. Aries puede proporcionar la dirección y el impulso que Piscis necesita para concretar sus ideas creativas. Piscis, a su vez, puede aportar una perspectiva intuitiva que Aries a menudo pasa por alto.",
    score: 3
  },
  "Taurus-Taurus": {
    report: "Un equipo increíblemente sólido y fiable. Juntos, son la definición de constancia y trabajo duro. Son excelentes para tareas que requieren paciencia y un enfoque metódico. Su principal desafío es la resistencia al cambio; pueden ser demasiado lentos para adaptarse a nuevas ideas.",
    score: 4
  },
  "Taurus-Gemini": {
    report: "El pragmático y el comunicador. Tauro aporta la estabilidad y el enfoque en la calidad, mientras que Géminis trae versatilidad y nuevas ideas. Tauro puede frustrarse con la falta de constancia de Géminis, y Géminis puede aburrirse con el ritmo lento de Tauro. Si se respetan, son un gran equipo.",
    score: 3
  },
  "Taurus-Cancer": {
    report: "Un dúo laboral muy nutritivo y de apoyo. Ambos valoran la seguridad y trabajan para crear un ambiente estable. Tauro se encarga de la parte práctica y financiera, mientras que Cáncer cuida del bienestar del equipo. Ideales para negocios familiares o proyectos a largo plazo.",
    score: 4
  },
  "Taurus-Leo": {
    report: "Una dupla de poder, pero con voluntades de hierro. Tauro se enfoca en la calidad y la sustancia, mientras que Leo busca el reconocimiento y el brillo. Pueden chocar por el presupuesto y los métodos, pero si se respetan, crean un producto final de lujo. Leo es el frontman, Tauro el productor ejecutivo.",
    score: 3
  },
  "Taurus-Virgo": {
    report: "El equipo de tierra perfecto. Ambos son prácticos, detallistas y trabajadores. Su ética de trabajo combinada es insuperable. Se entienden sin palabras y se centran en producir resultados de alta calidad. Una de las mejores combinaciones para cualquier proyecto.",
    score: 5
  },
  "Taurus-Libra": {
    report: "Ambos, regidos por Venus, aprecian un ambiente de trabajo armonioso y estético. Tauro se centra en el resultado tangible y la rentabilidad, mientras que Libra se enfoca en las relaciones públicas y la estrategia. Funcionan bien si Libra no pospone las decisiones y Tauro se abre a nuevas perspectivas.",
    score: 3
  },
  "Taurus-Scorpio": {
    report: "Una pareja poderosa y decidida. Tauro aporta la resistencia y la determinación, mientras que Escorpio ofrece la estrategia y la capacidad de ver lo que otros no ven. Son un dúo formidable en finanzas e investigación, pero deben tener cuidado con las luchas de poder por su naturaleza fija.",
    score: 4
  },
  "Taurus-Sagittarius": {
    report: "El conservador y el arriesgado. Tauro prefiere métodos probados y seguros, mientras que Sagitario está dispuesto a experimentar y tomar riesgos. Pueden chocar en sus enfoques, pero si se respetan, Sagitario puede abrir nuevos mercados y Tauro puede asegurar que sean rentables.",
    score: 2
  },
  "Taurus-Aquarius": {
    report: "Una combinación desafiante. Tauro es tradicionalista y resistente al cambio, mientras que Acuario es un innovador que busca romper las reglas. Ambos son tercos. Acuario puede ver a Tauro como anticuado, y Tauro a Acuario como poco práctico. El éxito requiere un gran respeto mutuo.",
    score: 2
  },
  "Taurus-Pisces": {
    report: "El ancla y el soñador. Tauro puede ayudar a Piscis a dar forma práctica a sus ideas creativas y a mantenerse enfocado. Piscis, a su vez, inspira a Tauro y aporta una visión y empatía que pueden ser clave en el trato con clientes y el equipo. Se complementan muy bien.",
    score: 4
  },
  "Gemini-Gemini": {
    report: "Una usina de ideas y comunicación. Juntos son excelentes para brainstorming y roles de cara al público. El desafío es mantener el enfoque y llevar las ideas a la práctica. Pueden dispersarse fácilmente.",
    score: 4
  },
  "Gemini-Cancer": {
    report: "Géminis aporta las ideas y Cáncer la intuición sobre el equipo o los clientes. Puede ser una buena dupla creativa, pero Géminis debe ser sensible con la comunicación y Cáncer debe aprender a no tomarse las cosas de manera personal.",
    score: 3
  },
  "Gemini-Leo": {
    report: "El equipo perfecto para marketing y relaciones públicas. Géminis escribe el discurso y Leo lo presenta con carisma. Se llevan bien si Leo recibe suficiente reconocimiento y Géminis tiene libertad para explorar nuevas ideas.",
    score: 4
  },
  "Gemini-Virgo": {
    report: "Ambos regidos por Mercurio, pero con enfoques opuestos. Géminis es macro, Virgo es micro. Virgo se frustra con la falta de atención al detalle de Géminis, y Géminis se siente limitado por el perfeccionismo de Virgo. Pueden complementarse si respetan sus roles.",
    score: 3
  },
  "Gemini-Libra": {
    report: "Una colaboración intelectualmente estimulante. Son excelentes negociadores, abogados o creativos. Ambos son sociables y buenos comunicadores. Su principal desafío es pasar de la deliberación a la acción concreta.",
    score: 4
  },
  "Gemini-Scorpio": {
    report: "El periodista y el detective. Géminis es bueno para recopilar información superficial, mientras que Escorpio es un maestro en la investigación profunda. Juntos son un equipo de investigación formidable, aunque la desconfianza de Escorpio puede chocar con la naturaleza abierta de Géminis.",
    score: 3
  },
  "Gemini-Sagittarius": {
    report: "La pareja de la expansión de ideas. Ambos aman aprender, comunicar y explorar. Son excelentes en roles de educación, viajes o medios de comunicación. El reto es la constancia y el seguimiento de los proyectos hasta el final.",
    score: 4
  },
  "Gemini-Capricorn": {
    report: "El innovador y el CEO. Géminis tiene las ideas nuevas y Capricornio tiene la disciplina para estructurarlas y hacerlas rentables. Capricornio debe tener paciencia con la naturaleza cambiante de Géminis, y Géminis debe respetar la necesidad de estructura de Capricornio.",
    score: 3
  },
  "Gemini-Pisces": {
    report: "Un dúo altamente creativo e imaginativo. Ideal para las artes, la publicidad o campos espirituales. El desafío está en la comunicación: Géminis es lógico y Piscis es intuitivo. Necesitan un terreno común para no perderse en malentendidos.",
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
  "Cancer-Sagittarius": {
    report: "Una mezcla desafiante. La necesidad de seguridad de Cáncer choca con el deseo de Sagitario de tomar riesgos y explorar. La comunicación directa de Sagitario puede herir la sensibilidad de Cáncer. Requiere mucho esfuerzo para alinear sus estilos de trabajo.",
    score: 2
  },
  "Cancer-Aquarius": {
    report: "El tradicionalista y el innovador. Cáncer prefiere métodos probados y un ambiente seguro, mientras que Acuario busca constantemente nuevas formas de hacer las cosas. Acuario puede parecer demasiado desapegado para Cáncer, y Cáncer demasiado emocional para Acuario. Una colaboración difícil.",
    score: 2
  },
  "Leo-Leo": {
    report: "Un dúo de pura realeza y carisma. Son excelentes para roles de liderazgo, ventas y relaciones públicas. Su energía combinada es magnética. El principal desafío es la lucha de egos; ambos quieren ser la estrella. Si aprenden a compartir el protagonismo, son imparables.",
    score: 4
  },
  "Leo-Virgo": {
    report: "El líder y el organizador. Leo aporta la visión y el carisma, mientras que Virgo se encarga de los detalles y la ejecución perfecta. Leo puede ver a Virgo como demasiado crítico, y Virgo a Leo como descuidado. Si respetan sus roles, son un equipo muy eficaz.",
    score: 3
  },
  "Leo-Sagittarius": {
    report: "El equipo de Fuego perfecto para la motivación. Ambos son optimistas, enérgicos e inspiradores. Ideales para startups, marketing y roles que requieran entusiasmo y visión de futuro. Mantienen la moral alta y no temen a los grandes desafíos.",
    score: 5
  },
  "Leo-Scorpio": {
    report: "Dos signos de voluntad de hierro. Su determinación combinada es inmensa. Son excelentes para proyectos de alto riesgo que requieren agallas. Sin embargo, las luchas de poder son casi inevitables. Ambos son fijos y quieren el control, lo que puede generar un ambiente de trabajo intenso.",
    score: 3
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
  }
};

