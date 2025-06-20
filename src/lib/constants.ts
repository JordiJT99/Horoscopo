
import type { ZodiacSignName, ZodiacSign, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo, AstrologicalElement, AstrologicalPolarity, AstrologicalModality, UpcomingPhase, MoonPhaseKey } from '@/types';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Sparkles as SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Layers, Calculator as CalculatorIcon, HelpCircle, Briefcase, Waves, Wind, Sun, Moon, Leaf, Mountain, Droplets, Flame } from 'lucide-react';


export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", customIconPath: "/custom_assets/aries_display.png", dateRange: "Mar 21 - Abr 19", element: "Fire", polarity: "Masculine", modality: "Cardinal" },
  { name: "Taurus", customIconPath: "/custom_assets/taurus_display.png", dateRange: "Abr 20 - May 20", element: "Earth", polarity: "Feminine", modality: "Fixed" },
  { name: "Gemini", customIconPath: "/custom_assets/geminis_display.png", dateRange: "May 21 - Jun 20", element: "Air", polarity: "Masculine", modality: "Mutable" },
  { name: "Cancer", customIconPath: "/custom_assets/cancer_display.png", dateRange: "Jun 21 - Jul 22", element: "Water", polarity: "Feminine", modality: "Cardinal" },
  { name: "Leo", customIconPath: "/custom_assets/leo_display.png", dateRange: "Jul 23 - Ago 22", element: "Fire", polarity: "Masculine", modality: "Fixed" },
  { name: "Virgo", customIconPath: "/custom_assets/virgo_display.png", dateRange: "Ago 23 - Sep 22", element: "Earth", polarity: "Feminine", modality: "Mutable" },
  { name: "Libra", customIconPath: "/custom_assets/libra_display.png", dateRange: "Sep 23 - Oct 22", element: "Air", polarity: "Masculine", modality: "Cardinal" },
  { name: "Scorpio", customIconPath: "/custom_assets/scorpio_display.png", dateRange: "Oct 23 - Nov 21", element: "Water", polarity: "Feminine", modality: "Fixed" },
  { name: "Sagittarius", customIconPath: "/custom_assets/sagittarius_display.png", dateRange: "Nov 22 - Dic 21", element: "Fire", polarity: "Masculine", modality: "Mutable" },
  { name: "Capricorn", customIconPath: "/custom_assets/capricorn_display.png", dateRange: "Dic 22 - Ene 19", element: "Earth", polarity: "Feminine", modality: "Cardinal" },
  { name: "Aquarius", customIconPath: "/custom_assets/aquarius_display.png", dateRange: "Ene 20 - Feb 18", element: "Air", polarity: "Masculine", modality: "Fixed" },
  { name: "Pisces", customIconPath: "/custom_assets/pisces_display.png", dateRange: "Feb 19 - Mar 20", element: "Water", polarity: "Feminine", modality: "Mutable" },
];

export const getSunSignFromDate = (date: Date): ZodiacSign | null => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // JS months are 0-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS.find(s => s.name === "Aries")!;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Taurus")!;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Gemini")!;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Cancer")!;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Leo")!;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Virgo")!;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS.find(s => s.name === "Libra")!;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS.find(s => s.name === "Scorpio")!;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS.find(s => s.name === "Sagittarius")!;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS.find(s => s.name === "Aquarius")!;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS.find(s => s.name === "Pisces")!;
  
  return null;
};


export const ALL_SIGN_NAMES = ZODIAC_SIGNS.map(sign => sign.name) as [ZodiacSignName, ...ZodiacSignName[]];

interface CompatibilityReportDetail {
  report: string;
  score: number;
}
interface CompatibilityReportsByType {
  love: CompatibilityReportDetail;
  friendship: CompatibilityReportDetail;
  work: CompatibilityReportDetail;
}

const compatibilityPairings: Record<string, CompatibilityReportsByType> = {
  "Aries-Aries": {
    love: {
      report: "Cuando dos Aries se unen en el amor, la energía es explosiva y la pasión, desbordante. Ambos son pioneros natos, rebosantes de entusiasmo y con un amor innato por la acción y la aventura. Esta relación puede ser increíblemente dinámica, siempre en busca de nuevos desafíos y experiencias. Sin embargo, la naturaleza inherentemente competitiva de Aries y su fuerte deseo de liderar pueden ser fuente de conflictos frecuentes y luchas de poder intensas. Para que la relación prospere, es crucial que aprendan a ceder el uno al otro, a respetar el espacio individual y a canalizar su energía conjunta hacia metas compartidas en lugar de competir entre sí. Con una comunicación abierta, respeto mutuo y comprensión, pueden formar una pareja verdaderamente imparable y lograr grandes cosas juntos, convirtiéndose en una fuente de inspiración mutua.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Aries es pura dinamita. Siempre listos para una nueva aventura, un desafío deportivo o un debate apasionado, su energía combinada es contagiosa. Se entienden en su necesidad de acción y espontaneidad, y son amigos increíblemente leales que se defenderán mutuamente con fiereza. Sin embargo, la competitividad puede surgir incluso en la amistad, y las discusiones pueden ser intensas, aunque suelen olvidarse rápidamente. Necesitan aprender a no tomarse las cosas tan a pecho y a celebrar los éxitos del otro sin envidia. Si lo logran, su amistad será una fuente inagotable de diversión, apoyo enérgico e inspiración para conquistar el mundo.",
      score: 5
    },
    work: {
      report: "Dos Aries trabajando juntos pueden ser increíblemente productivos o un completo desastre, dependiendo de cómo manejen sus egos. Ambos quieren liderar, tomar la iniciativa e innovar. Si pueden definir roles claros, trabajar en proyectos separados que luego se unan, o si uno reconoce el liderazgo del otro, el resultado puede ser pionero y rápido. Sin embargo, las luchas de poder son casi inevitables si ambos compiten por el mismo puesto de mando. La comunicación debe ser directa y sin rodeos. La clave está en canalizar su energía competitiva hacia metas comunes en lugar de enfrentarse. Pueden motivarse mutuamente para alcanzar grandes alturas si aprenden a colaborar y a compartir los laureles del éxito.",
      score: 3
    }
  },
  "Taurus-Taurus": {
    love: {
      report: "La unión de dos Tauro crea un oasis de estabilidad, sensualidad profunda y un aprecio compartido por los placeres terrenales de la vida. Ambos valoran la seguridad, el confort material, la lealtad incondicional y la belleza en todas sus formas, lo que puede forjar un vínculo increíblemente sólido, predecible y duradero. Disfrutan de la buena comida, los ambientes acogedores, la naturaleza y la tranquilidad de un hogar bien establecido. El principal desafío radica en su mutua terquedad y resistencia al cambio; ambos pueden ser inflexibles en sus posturas, lo que podría llevar a la rutina o al estancamiento si no se esfuerzan conscientemente por introducir novedad, flexibilidad y estímulo en la relación. Si aprenden a ceder en sus posiciones, a comunicarse abiertamente sobre sus necesidades y a motivarse para explorar nuevas experiencias juntos, su amor será un refugio de paz, placer y satisfacción duradera.",
      score: 4
    },
    friendship: {
      report: "Una amistad entre dos Tauro es un pacto de lealtad, confort y placeres compartidos. Disfrutan de actividades tranquilas, buena comida, conversaciones sobre cosas prácticas y la belleza de la naturaleza. Son amigos en los que se puede confiar plenamente, siempre dispuestos a ofrecer apoyo tangible y un hombro en el que apoyarse. La terquedad puede ser un problema si ambos se empecinan en un punto de vista, pero su aprecio por la estabilidad y la armonía suele prevalecer. Es una amistad sólida, aunque puede necesitar un empujón de vez en cuando para salir de la rutina y probar cosas nuevas juntos, enriqueciendo así su ya fuerte vínculo.",
      score: 4
    },
    work: {
      report: "Dos Tauro en el trabajo son sinónimo de perseverancia, fiabilidad y resultados concretos y de calidad. Son trabajadores metódicos, pacientes y buscan construir bases sólidas para cualquier proyecto. Su enfoque práctico y su resistencia les permiten superar obstáculos que otros abandonarían. La desventaja es que pueden ser lentos para adaptarse a los cambios rápidos o a nuevas ideas, y su resistencia a salir de la zona de confort puede limitar la innovación si no se gestiona. Sin embargo, su dedicación y fiabilidad son incuestionables, haciendo de ellos pilares en cualquier equipo que valore la estabilidad y el trabajo bien hecho.",
      score: 4
    }
  },
  "Gemini-Gemini": {
    love: {
      report: "Una pareja de Géminis es sinónimo de diversión efervescente, comunicación constante y una mente ágil multiplicada por dos. Ambos son intrínsecamente curiosos, increíblemente versátiles y disfrutan de la variedad, el estímulo intelectual y el juego de palabras. La relación estará repleta de conversaciones interesantes que pueden durar horas, humor ingenioso y una vida social activa y estimulante. Sin embargo, esta misma necesidad imperiosa de cambio, novedad y estimulación mental constante puede llevar a la inconstancia, la superficialidad emocional o una dificultad para profundizar en el compromiso si no se cultiva con intención. Pueden tener dificultades para tomar decisiones definitivas o para comprometerse a largo plazo, temiendo perder su libertad. Si logran encontrar un ancla emocional, aprenden a valorar la profundidad además de la amplitud y se apoyan en su mutua inteligencia y adaptabilidad, pueden ser compañeros de vida increíblemente estimulantes, manteniendo la relación fresca y emocionante.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Géminis es un torbellino de ideas, risas y planes que cambian constantemente. Nunca se aburren juntos, siempre hay algo nuevo que discutir, aprender o explorar. Son excelentes compañeros para actividades sociales, viajes improvisados y aventuras intelectuales. La comunicación es su mayor fortaleza, fluyendo sin esfuerzo. El desafío principal es la constancia; pueden hacer muchos planes que no siempre se concretan debido a su naturaleza cambiante. Necesitan un poco de estructura autoimpuesta para que la amistad se mantenga sólida en el tiempo, más allá de la diversión del momento. Su vínculo es ligero, entretenido y siempre sorprendente.",
      score: 4
    },
    work: {
      report: "Dos Géminis trabajando juntos son una fuente inagotable de ideas innovadoras y soluciones creativas. Son adaptables, rápidos para aprender y excelentes comunicadores, ideales para roles de brainstorming, marketing o proyectos que requieran agilidad mental y multitarea. Su energía es contagiosa y pueden generar un ambiente de trabajo dinámico. Sin embargo, pueden tener problemas para enfocarse en una sola tarea y llevarla a término, tendiendo a la dispersión. La organización, la definición clara de prioridades y quizás un gestor de proyectos externo son cruciales para asegurar que sus brillantes ideas se materialicen y no se queden en el aire.",
      score: 3
    }
  },
  "Cancer-Cancer": {
    love: {
      report: "Cuando dos Cáncer se encuentran, la conexión emocional es casi instantánea, intuitiva y profundamente conmovedora. Ambos son seres sensibles, cariñosos por naturaleza, protectores con sus seres queridos y valoran el hogar y la familia por encima de casi todo. Esta relación tiene el potencial de ser un verdadero nido de amor, comprensión incondicional y apoyo mutuo inquebrantable. Sin embargo, la extrema sensibilidad de ambos también puede ser un arma de doble filo, llevándolos a herirse fácilmente con palabras o acciones no intencionadas, o a encerrarse en sus caparazones protectores si se sienten amenazados o inseguros. Pueden volverse demasiado dependientes el uno del otro, caer en estados de ánimo fluctuantes que se reflejan mutuamente o tener dificultades para establecer límites saludables. Necesitan aprender a comunicar sus necesidades y vulnerabilidades abiertamente, a manejar los cambios de humor con paciencia y a darse espacio para respirar y recargar energías individualmente. Si lo logran, su hogar será un verdadero santuario de amor y seguridad.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Cáncer es un refugio de comprensión, empatía y apoyo emocional incondicional. Se entienden sin necesidad de muchas palabras y siempre están ahí el uno para el otro en los momentos difíciles, ofreciendo consuelo y cuidado genuino. Disfrutan de actividades hogareñas, cocinar juntos, recordar el pasado y conversaciones íntimas sobre sus sentimientos. El riesgo es que pueden caer en un círculo de quejas o preocupaciones si no se cuidan, o volverse demasiado posesivos. Necesitan animarse mutuamente a salir de su zona de confort de vez en cuando y a ver el lado positivo de las cosas. Su lealtad es incuestionable y su amistad, un tesoro de afecto.",
      score: 5
    },
    work: {
      report: "Dos Cáncer en el entorno laboral crean un ambiente de trabajo nutritivo, solidario y casi familiar. Son intuitivos con las necesidades del equipo y se preocupan genuinamente por el bienestar general. Pueden ser muy dedicados a proyectos que tengan un componente humano, de cuidado o que requieran un toque personal. Sin embargo, pueden tomarse las críticas de forma muy personal y su estado de ánimo puede afectar la productividad. Necesitan aprender a separar lo personal de lo profesional, a ser más objetivos en la toma de decisiones y a no dejarse llevar por la subjetividad emocional para mantener un ambiente laboral eficiente y armonioso.",
      score: 3
    }
  },
  "Leo-Leo": {
    love: {
      report: "Una pareja de Leo es un espectáculo de carisma deslumbrante, pasión ardiente y generosidad sin límites. Ambos son extrovertidos por naturaleza, inherentemente creativos y aman ser el centro de atención y recibir admiración. La relación estará llena de drama (en el buen sentido), romance apasionado, grandes gestos y una celebración constante de la vida. Se entienden perfectamente en su necesidad de brillar y ser reconocidos. El mayor desafío, sin duda, son sus egos magnificados: las luchas por el protagonismo, el orgullo herido y la necesidad de tener siempre la razón pueden ser frecuentes e intensas. Necesitan aprender a compartir el escenario con gracia, a aplaudirse mutuamente con sinceridad y a manejar sus egos con humildad y respeto. Si logran este delicado equilibrio, su amor será una celebración constante, digna de la realeza, llena de lealtad, diversión y una pasión que ilumina todo a su alrededor.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Leo es grandiosa, teatral y llena de diversión y generosidad. Les encanta organizar fiestas, ser el alma de cualquier reunión y apoyarse mutuamente en sus ambiciones creativas y personales. Son amigos increíblemente leales y generosos que disfrutan celebrando los éxitos del otro (siempre que no opaque demasiado el propio). El orgullo puede ser un problema; necesitan aprender a pedir disculpas y a ceder de vez en cuando. Si logran compartir el centro de atención y admirarse sinceramente, su amistad será una fuente inagotable de inspiración, lealtad y entretenimiento de alto voltaje.",
      score: 4
    },
    work: {
      report: "Dos Leo trabajando juntos pueden lograr grandes cosas o chocar espectacularmente, dependiendo de cómo gestionen la dinámica de poder. Ambos tienen dotes de liderazgo innatas, aman ser reconocidos y poseen una gran energía creativa. Si pueden colaborar y compartir los laureles, su energía combinada puede ser muy motivadora e inspiradora para todo el equipo. El problema surge cuando ambos quieren ser el único jefe o destacar individualmente. Necesitan roles bien definidos, un respeto mutuo por sus talentos y la capacidad de ceder el protagonismo. Si lo consiguen, el proyecto brillará con luz propia.",
      score: 3
    }
  },
  "Virgo-Virgo": {
    love: {
      report: "Dos Virgo juntos forman una pareja sumamente práctica, organizada hasta el último detalle y mentalmente estimulante. Ambos son inteligentes, analíticos por naturaleza, perfeccionistas y tienen altos estándares para sí mismos y para los demás. Se entienden profundamente en su necesidad de orden, eficiencia y mejora constante. Pueden ser excelentes compañeros de trabajo y de vida, apoyándose mutuamente en sus metas, disfrutando de conversaciones detalladas y construyendo una vida funcional y bien estructurada. Sin embargo, la tendencia innata de Virgo a la crítica, aunque a menudo bien intencionada, puede volverse en su contra, con ambos analizándose y criticándose mutuamente en exceso, lo que puede generar tensión y resentimiento. Necesitan cultivar la tolerancia, la calidez emocional, aprender a relajarse juntos y a disfrutar de la vida sin buscar la perfección en cada aspecto. Si logran esto, su relación será estable, de apoyo mutuo y muy productiva.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Virgo se basa en el intelecto, el apoyo práctico y una comprensión mutua de la necesidad de orden y eficiencia. Son amigos serviciales, siempre dispuestos a ayudar con un problema, a ofrecer un consejo bien analizado o a organizar un plan detallado. Disfrutan de conversaciones inteligentes, de actividades que impliquen aprendizaje o mejora, y de un humor sutil y agudo. La crítica excesiva puede ser un problema si no se maneja con cuidado, ya que ambos pueden ser muy exigentes. Necesitan recordarse mutuamente que no todo tiene que ser perfecto para ser disfrutado y valorar el esfuerzo del otro. Es una amistad útil, leal y mentalmente estimulante.",
      score: 4
    },
    work: {
      report: "Dos Virgo en un equipo de trabajo son la definición de eficiencia, precisión y atención al detalle. Son meticulosos, organizados y buscan la perfección en cada tarea que emprenden. Pueden ser increíblemente productivos juntos, analizando problemas complejos y encontrando soluciones prácticas. El riesgo es que pueden perderse en los detalles, volverse demasiado críticos entre sí o con el trabajo de los demás, o tardar en tomar decisiones por exceso de análisis. Necesitan aprender a delegar, a confiar en el proceso y a aceptar que 'suficientemente bueno' a veces es mejor que 'perfecto pero tarde'. Su dedicación y calidad de trabajo son indiscutibles.",
      score: 5
    }
  },
  "Libra-Libra": {
    love: {
      report: "Una relación entre dos Libra está impregnada de encanto, diplomacia natural, un aprecio por la belleza en todas sus formas y un profundo deseo innato de armonía y equilibrio. Ambos son sociables, amantes del arte, la cultura y las interacciones refinadas, y buscan el equilibrio y la justicia en todas las situaciones. Disfrutarán creando un entorno estéticamente agradable, de una vida social activa y elegante, y de conversaciones civilizadas. Se entienden perfectamente en su aversión al conflicto y su búsqueda de la paz. El problema surge cuando ambos evitan tomar decisiones difíciles o confrontar problemas subyacentes por miedo a alterar esa preciada armonía. La indecisión y la procrastinación pueden ser grandes obstáculos. Si aprenden a ser más asertivos individualmente, a comunicar sus necesidades de manera directa pero amable y a enfrentar los desacuerdos de manera constructiva, pueden crear una unión verdaderamente hermosa, equitativa y llena de gracia.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Libra es elegante, sociable y siempre en busca de la armonía y la belleza. Disfrutan de actividades culturales, conversaciones interesantes, eventos sociales y de crear un ambiente agradable y estético a su alrededor. Son amigos diplomáticos que evitan el conflicto a toda costa, lo que puede ser tanto una fortaleza como una debilidad. La indecisión puede ser un problema a la hora de hacer planes, ya que ambos querrán complacer al otro. Necesitan animarse mutuamente a tomar partido de vez en cuando y a no temer los desacuerdos, ya que pueden ser constructivos para fortalecer su vínculo refinado y placentero.",
      score: 4
    },
    work: {
      report: "Dos Libra trabajando juntos aportan un gran sentido de la estética, la diplomacia, la justicia y la capacidad de negociación. Son excelentes para crear un ambiente de trabajo armonioso, para mediar en conflictos y para tratar con clientes de manera encantadora. Sin embargo, la toma de decisiones puede ser lenta y pueden evitar abordar problemas difíciles por miedo a generar conflicto o desequilibrio. Necesitan un líder claro o roles bien definidos para ser más efectivos y no caer en la procrastinación o en la búsqueda excesiva del consenso. Suelen destacar en roles de relaciones públicas, diseño o asesoría.",
      score: 3
    }
  },
  "Scorpio-Scorpio": {
    love: {
      report: "Cuando dos Escorpio se unen, la intensidad es palpable, la pasión electrizante y la conexión emocional puede alcanzar profundidades insondables y transformadoras. Ambos son ferozmente leales, magnéticos, intuitivos y buscan una fusión casi total con su pareja, anhelando trascender los límites superficiales. La comprensión intuitiva entre ellos es a menudo muy fuerte, casi telepática. Sin embargo, esta misma intensidad puede ser su mayor desafío, llevando a luchas de poder titánicas, celos arraigados y una posesividad extrema que puede resultar asfixiante. Ambos necesitan tener el control y pueden ser muy reservados con sus secretos, lo que dificulta la confianza plena. La confianza absoluta es fundamental, pero difícil de alcanzar si las sospechas o los juegos mentales entran en escena. Si logran trascender sus miedos más profundos, practicar la vulnerabilidad y canalizar su poderosa energía conjunta hacia la creación, la sanación mutua y la confianza incondicional, su vínculo será indestructible y profundamente spiritual, capaz de resistir cualquier tormenta.",
      score: 3
    },
    friendship: {
      report: "Una amistad entre dos Escorpio es profunda, intensamente leal y a menudo envuelta en un aura de misterio y exclusividad. Se entienden a un nivel que pocos pueden alcanzar y guardarán los secretos del otro hasta la tumba. Son amigos apasionados, protectores y capaces de una honestidad brutal pero necesaria. El problema surge si la desconfianza, los celos o la competencia por el poder entran en juego. Las luchas de poder pueden ser sutiles pero feroces. Si se basan en la honestidad total, la transparencia (hasta donde un Escorpio puede) y el respeto por la fuerza del otro, su amistad será inquebrantable, transformadora y un refugio seguro en un mundo superficial.",
      score: 4
    },
    work: {
      report: "Dos Escorpio en el trabajo son una fuerza a tener en cuenta, capaces de una concentración y determinación formidables. Son estratégicos, perceptivos, no temen a los desafíos y no se detienen ante nada para lograr sus objetivos. Pueden ser excelentes investigadores, estrategas o líderes en situaciones de crisis. Sin embargo, las luchas por el control y el poder son casi seguras si sus roles no están claramente definidos o si ambos aspiran a la misma posición. La competencia puede ser feroz y despiadada. Necesitan tener metas muy claras, un respeto absoluto por el poder del otro y quizás trabajar en áreas complementarias para evitar choques directos. Si logran trabajar en equipo, son imparables.",
      score: 3
    }
  },
  "Sagittarius-Sagittarius": {
    love: {
      report: "Una pareja de Sagitario es una aventura constante, un torbellino de optimismo contagioso, humor inteligente y un insaciable deseo de explorar el mundo, las ideas y el conocimiento. Ambos son ferozmente independientes, brutalmente honestos (a veces demasiado) y aman la libertad por encima de todo. Su relación será espontánea, llena de risas, viajes inesperados y una búsqueda compartida de la verdad y el significado. Se entienden instintivamente en su necesidad de espacio personal y crecimiento individual. La pasión es alta y la vida juntos nunca es aburrida ni predecible. El desafío principal puede ser el compromiso a largo plazo y la atención a los detalles prácticos de la vida cotidiana, ya que ambos pueden ser reacios a establecerse o a enfrentar responsabilidades que perciben como limitantes. Sin embargo, si encuentran un propósito común que los inspire, aprenden a valorar la estabilidad junto con la aventura y cultivan la confianza mutua, su viaje juntos será una experiencia inolvidable y expansiva.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Sagitario es una fiesta sin fin, llena de optimismo, humor contagioso y una sed insaciable de aventura y conocimiento. Siempre están listos para explorar algo nuevo, ya sea un lugar exótico, una idea filosófica o un nuevo deporte. Se dan mutuamente mucha libertad y se entienden en su necesidad de espacio e independencia. La honestidad es total, a veces hasta el punto de la crudeza, pero rara vez hay malicia. El único riesgo es que pueden ser un poco inconsistentes con los planes debido a su naturaleza espontánea. Su amistad es divertida, inspiradora, expansiva y siempre en movimiento, un verdadero soplo de aire fresco.",
      score: 5
    },
    work: {
      report: "Dos Sagitario trabajando juntos aportan un entusiasmo sin límites, una visión optimista y una mentalidad abierta a nuevas ideas. Son excelentes para generar conceptos innovadores, explorar nuevas posibilidades de mercado y motivar al equipo con su energía positiva. Sin embargo, pueden pasar por alto los detalles importantes, ser poco realistas en sus proyecciones o tener dificultades para llevar los proyectos a su conclusión si la tarea se vuelve rutinaria. Necesitan a alguien más práctico que les ayude a concretar sus grandes planes y a mantener el enfoque en los aspectos más mundanos. Su optimismo es contagioso, pero deben cuidar la falta de seguimiento y la posible impaciencia.",
      score: 3
    }
  },
  "Capricorn-Capricorn": {
    love: {
      report: "Dos Capricornio juntos forman una pareja poderosa, sumamente ambiciosa y muy enfocada en construir un futuro sólido, seguro y respetable. Ambos son trabajadores incansables, disciplinados hasta la médula, prácticos y valoran la tradición, el estatus y los logros tangibles. Se respetan mutuamente por su determinación férrea, su resiliencia y su capacidad para alcanzar metas a largo plazo. Pueden ser un equipo formidable en los negocios y en la vida, construyendo un imperio ladrillo a ladrillo. Sin embargo, la relación puede volverse excesivamente seria, competitiva o centrada en el trabajo y las responsabilidades, descuidando la parte emocional, la espontaneidad y la diversión. Necesitan aprender a relajarse juntos, a expresar su afecto (que suele ser profundo pero poco demostrado) y a celebrar y disfrutar de los logros, no solo a planificarlos meticulosamente. Si logran encontrar ese equilibrio, su unión será de una solidez y lealtad inquebrantables.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Capricornio se basa en el respeto mutuo, la ambición compartida y un enfoque práctico y realista de la vida. Son amigos leales que se apoyan en sus metas profesionales y personales, ofreciendo consejos sensatos y ayuda tangible. Pueden parecer serios o reservados al principio, pero su humor es sutil y aprecian la compañía del otro, especialmente si comparten intereses profesionales o aspiraciones similares. El riesgo es que la amistad puede volverse demasiado formal o centrada exclusivamente en los logros y responsabilidades. Necesitan encontrar tiempo para relajarse, disfrutar de actividades más lúdicas y compartir momentos de esparcimiento para fortalecer su vínculo duradero.",
      score: 4
    },
    work: {
      report: "Dos Capricornio en el trabajo son una combinación de poder, eficiencia y ambición. Ambos son trabajadores incansables, estratégicos, muy organizados y orientados a resultados. Pueden lograr metas impresionantes juntos, construyendo estructuras sólidas y duraderas. Se respetan mutuamente por su profesionalismo y dedicación. El peligro es que pueden ser demasiado competitivos entre sí si no hay una jerarquía clara, o volverse excesivamente rígidos y reacios al cambio. Necesitan reconocer los logros del otro, fomentar un ambiente de colaboración en lugar de rivalidad y estar abiertos a diferentes enfoques para mantener un ambiente productivo y exitoso.",
      score: 5
    }
  },
  "Aquarius-Aquarius": {
    love: {
      report: "Una relación entre dos Acuario es intelectualmente estimulante, deliciosamente poco convencional y firmemente basada en una fuerte amistad, ideales compartidos y un profundo respeto por la individualidad y la libertad del otro. Ambos son progresistas, humanitarios, originales hasta la excentricidad y valoran la libertad por encima de casi cualquier otra cosa. Disfrutarán de conversaciones fascinantes que pueden durar toda la noche, proyectos innovadores con un toque social y una vida social activa y llena de personas interesantes y diversas. La conexión emocional puede ser un desafío, ya que ambos tienden a ser algo desapegados, cerebrales y a racionalizar sus sentimientos en lugar de expresarlos abiertamente. Necesitan hacer un esfuerzo consciente por cultivar la intimidad, la calidez y la vulnerabilidad emocional. Si lo logran, su unión será única, libre de posesividad, llena de inspiración mutua y verdaderamente vanguardista.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Acuario es una conexión de mentes brillantes, ideales compartidos y un amor por la libertad y la originalidad. Son amigos que se entienden en su necesidad de independencia, su visión progresista del mundo y su interés por lo humanitario y lo inusual. Disfrutan de debates intelectuales, proyectos grupales innovadores y de explorar lo no convencional. La amistad es más cerebral que emocionalmente efusiva, pero muy leal y basada en el respeto mutuo. Se dan mucho espacio y se aceptan tal como son, con todas sus excentricidades. Suelen tener un círculo de amigos amplio y diverso, y juntos pueden ser catalizadores de cambio.",
      score: 5
    },
    work: {
      report: "Dos Acuario trabajando juntos son una fuerza innovadora, visionaria y altamente creativa. Aportan ideas originales, un enfoque humanitario y una mentalidad de equipo colaborativa. Son excelentes para proyectos que requieran pensamiento fuera de lo común, soluciones tecnológicas o un impacto social positivo. Sin embargo, pueden ser algo rebeldes con las estructuras jerárquicas establecidas y tener dificultades con los detalles prácticos o las tareas rutinarias. Necesitan libertad para experimentar, un ambiente de trabajo flexible y un propósito que los inspire. Si se les da autonomía, pueden lograr resultados sorprendentes.",
      score: 4
    }
  },
  "Pisces-Pisces": {
    love: {
      report: "Cuando dos Piscis se unen, se crea un mundo de ensueño, compasión infinita y una profunda conexión espiritual que trasciende lo ordinario. Ambos son increíblemente sensibles, intuitivos hasta el punto de la telepatía, románticos empedernidos y con una vena artística muy desarrollada. Se entienden a un nivel anímico y disfrutan escapando juntos de la dureza y la mundaneidad de la realidad, refugiándose en su mundo interior compartido. Su amor puede ser increíblemente tierno, sanador y lleno de empatía. El principal desafío es que ambos pueden ser demasiado idealistas, evasivos ante los problemas o perderse en sus emociones y fantasías, descuidando los aspectos prácticos y las responsabilidades de la vida. Necesitan encontrar un ancla que los mantenga con los pies en la tierra, aprender a establecer límites saludables y a enfrentar los problemas de manera directa en lugar de huir de ellos. Si lo hacen, su relación será un refugio mágico de amor incondicional, creatividad y profunda conexión espiritual.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Piscis es un vínculo de almas gemelas, lleno de empatía, comprensión intuitiva y apoyo incondicional. Se entienden a un nivel emocional y espiritual muy profundo, compartiendo un mundo interior rico en imaginación y creatividad. Son amigos compasivos que siempre están ahí para escuchar, consolar y soñar juntos. Disfrutan de actividades artísticas, espirituales o simplemente de estar en silencio, sintiendo la conexión. El riesgo es que pueden perderse juntos en sus ensueños, volverse demasiado dependientes emocionalmente o evadir los problemas prácticos de la vida. Necesitan animarse mutuamente a enfrentar la realidad y a ser un poco más prácticos, sin perder su magia.",
      score: 5
    },
    work: {
      report: "Dos Piscis trabajando juntos pueden ser increíblemente creativos, intuitivos e inspiradores, especialmente en campos artísticos, de sanación, o en roles que requieran una gran sensibilidad y empatía. Aportan una atmósfera de compasión y comprensión al entorno laboral. Sin embargo, pueden tener dificultades con la organización, los plazos, la toma de decisiones pragmáticas y los aspectos más mundanos o estructurados del trabajo. Necesitan un entorno que valore su intuición y creatividad, pero también algo de estructura externa o un compañero más práctico para mantenerse enfocados y productivos. Son muy buenos para el trabajo en equipo si se sienten emocionalmente seguros y comprendidos.",
      score: 3
    }
  },
  "Aries-Taurus": {
    love: {
      report: "Aries y Tauro en el amor pueden ser un desafío, pero con potencial. La pasión de Aries choca con la calma de Tauro. Aries busca aventura, Tauro seguridad. Aries debe ser más paciente, y Tauro más flexible. Si logran equilibrar la impulsividad ariana con la sensualidad taurina, pueden construir algo duradero. Tauro ofrece estabilidad, Aries emoción. La clave es la comunicación y el respeto por sus ritmos diferentes.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Aries y Tauro pueden complementarse si superan sus diferencias iniciales. Aries, el iniciador, puede inspirar a Tauro a salir de su zona de confort, mientras que Tauro, el estabilizador, puede enseñar a Aries el valor de la constancia y la paciencia. Aries valora la lealtad incondicional de Tauro, y Tauro puede admirar la energía y valentía de Aries. Los conflictos pueden surgir por la terquedad de Tauro o la impaciencia de Aries. Si aprenden a respetar sus diferentes ritmos y enfoques, pueden formar una amistad sólida que ofrece una mezcla de aventura y seguridad, donde cada uno aporta una perspectiva valiosa al otro.",
      score: 3
    },
    work: {
      report: "En el trabajo, Aries y Tauro pueden formar un equipo altamente productivo si se definen bien los roles. Aries es excelente para arrancar proyectos con entusiasmo y tomar la iniciativa, mientras que Tauro es perseverante y se asegura de que las tareas se completen con calidad y atención al detalle. Aries debe respetar la necesidad de Tauro de analizar y planificar, y Tauro debe apreciar la rapidez y la capacidad de Aries para superar obstáculos. Juntos pueden cubrir todo el ciclo de un proyecto, desde la concepción hasta la finalización, pero necesitan una comunicación clara para evitar frustraciones por sus diferentes velocidades y estilos de trabajo. Aries aporta la chispa, Tauro la solidez.",
      score: 4
    }
  },
  "Aries-Gemini": {
    love: {
      report: "La relación amorosa entre Aries y Géminis es vivaz, divertida y llena de estímulos. Aries admira la inteligencia de Géminis, y Géminis se siente atraído por la pasión de Aries. Disfrutan de la aventura y la conversación. El desafío es mantener el interés a largo plazo y profundizar el compromiso emocional. Necesitan confianza y espacio para sus intereses individuales.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Aries y Géminis son dinamita pura, una combinación explosiva de energía y curiosidad. Siempre listos para una nueva aventura, un debate estimulante o simplemente para divertirse y reír. La comunicación es su fuerte, y se entienden en su amor por la novedad y la variedad. Géminis aporta ideas frescas y Aries el impulso para llevarlas a cabo. El único riesgo es que pueden ser algo inconsistentes con los planes debido a su naturaleza inquieta. Es una amistad llena de risas, exploración mental y una energía juvenil contagiosa.",
      score: 5
    },
    work: {
      report: "Aries y Géminis en el trabajo son un torbellino de creatividad e iniciativa. Aries impulsa con audacia y Géminis idea y comunica con agilidad. Son excelentes para el brainstorming, el marketing, las ventas y proyectos que requieran adaptabilidad y rapidez mental. Pueden dispersarse si no hay un enfoque claro o si se aburren con la rutina. Aries debe ser paciente con la naturaleza a veces cambiante de Géminis, y Géminis debe apreciar la determinación de Aries para lograr resultados. Su entusiasmo conjunto suele ser contagioso y motivador para el equipo.",
      score: 4
    }
  },
  "Aries-Cancer": {
    love: {
      report: "Aries y Cáncer en el amor son como el día y la noche, el fuego y el agua. La franqueza a veces ruda de Aries puede herir profundamente la sensibilidad de Cáncer, quien anhela seguridad emocional y ternura. Cáncer puede parecer demasiado dependiente o necesitado para el independiente y aventurero Aries. Para que esta relación funcione, Aries necesita aprender a ser más gentil, considerado y paciente, mientras que Cáncer debe esforzarse por ser más comprensivo con la necesidad de autonomía de Aries y comunicar sus necesidades de forma más directa. Si logran construir un puente de afecto y comprensión, pueden aprender mucho el uno del otro, pero requiere un esfuerzo consciente y madurez emocional de ambas partes.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Aries y Cáncer requiere una gran dosis de comprensión y paciencia mutua. Aries es directo y a veces brusco, mientras que Cáncer es emocional y se hiere con facilidad. Aries puede ofrecer protección y valentía, y Cáncer cuidado y un oído atento. Sin embargo, los malentendidos pueden ser frecuentes si Aries no modera su impulsividad y Cáncer no aprende a no tomar todo de manera personal. Si Aries logra ser más delicado y Cáncer más resiliente, pueden tener una amistad protectora, aunque con altibajos emocionales y necesidad de mucha comunicación sobre los sentimientos.",
      score: 2
    },
    work: {
      report: "En el entorno laboral, Aries y Cáncer pueden chocar debido a sus diferentes estilos y ritmos. Aries es rápido, impulsivo y orientado a la acción, mientras que Cáncer es más cauteloso, intuitivo y necesita sentirse seguro. Aries puede impulsar a Cáncer a tomar riesgos y a ser más decidido, mientras que Cáncer puede aportar una valiosa intuición y un enfoque humano a los proyectos. El respeto por sus diferentes estilos es fundamental. Aries debe valorar la necesidad de seguridad y el enfoque emocional de Cáncer en el entorno laboral, y Cáncer debe intentar adaptarse a la velocidad de Aries.",
      score: 3
    }
  },
  "Aries-Leo": {
    love: {
      report: "La relación amorosa entre Aries y Leo es ardiente, dramática y muy divertida. Ambos son signos de fuego, llenos de pasión, entusiasmo y un toque de egocentrismo. Hay una admiración mutua casi instantánea y una gran atracción física. Los dos son generosos, leales y les encanta ser el centro de atención. Los conflictos pueden surgir por orgullo, terquedad o por querer dominar la relación. Si logran compartir el protagonismo, celebrar los éxitos del otro y manejar sus egos con humor y respeto, su relación será una celebración constante, llena de lealtad, pasión y una energía que inspira a todos a su alrededor.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Aries y Leo son una pareja real, casi de la realeza de la diversión y la aventura. Les encanta la emoción, los desafíos y apoyarse mutuamente en sus ambiciones. Son amigos increíblemente leales, generosos y siempre listos para una fiesta o una nueva empresa. El orgullo puede ser un problema ocasional, ya que ambos tienen opiniones fuertes, pero su energía combinada y su aprecio mutuo suelen superar cualquier desacuerdo. Es una amistad llena de brillo, risas, lealtad y un espíritu indomable.",
      score: 5
    },
    work: {
      report: "Aries y Leo trabajando juntos son un equipo imparable y carismático, siempre que coordinen sus egos y ambiciones. Aries inicia con audacia y energía, mientras que Leo aporta el toque de carisma, creatividad y liderazgo inspirador. Irradian confianza y pueden motivar a otros. El desafío principal es evitar las luchas de poder por el liderazgo. Si pueden definir roles claros o compartir el protagonismo, el éxito está prácticamente asegurado. Su combinación de energía y visión puede llevar cualquier proyecto a nuevas alturas.",
      score: 4
    }
  },
   "Aries-Virgo": {
    love: {
      report: "Aries y Virgo en el amor pueden tener dificultades para entenderse al principio debido a sus naturalezas contrastantes. Aries es impulsivo, pasional y directo, mientras que Virgo es práctico, reservado y analítico. Aries puede ver a Virgo como demasiado crítico o frío, y Virgo puede percibir a Aries como imprudente o desconsiderado. Sin embargo, si hay atracción, Virgo puede ofrecer una estabilidad y un apoyo práctico que Aries necesita, y Aries puede animar a Virgo a salir de su rutina y a ser más espontáneo. Requiere mucha paciencia, comunicación abierta y un esfuerzo genuino por apreciar las fortalezas del otro.",
      score: 2
    },
    friendship: {
      report: "Una amistad entre Aries y Virgo es una combinación de contrastes que puede ser sorprendentemente complementaria. Aries aporta energía, entusiasmo y un espíritu aventurero, mientras que Virgo ofrece análisis, consejos prácticos y un apoyo constante. Virgo puede ayudar a Aries a ser más organizado y a pensar antes de actuar, y Aries puede sacar a Virgo de su rutina y animarle a probar cosas nuevas. Si ambos se respetan y valoran sus diferencias, pueden aprender mucho el uno del otro. Aries debe valorar los consejos sensatos de Virgo, y Virgo la capacidad de Aries para tomar la iniciativa.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Aries y Virgo pueden formar un equipo muy efectivo si logran sincronizar sus estilos. Aries es el motor de arranque, lleno de ideas y entusiasmo para iniciar proyectos, mientras que Virgo es el planificador meticuloso que organiza, perfecciona los detalles y asegura la calidad. Aries debe respetar la necesidad de Virgo de analizar y planificar, y Virgo debe apreciar la iniciativa y la rapidez de Aries. Juntos pueden cubrir desde la concepción hasta la ejecución impecable, pero la comunicación clara sobre expectativas y métodos es vital para evitar frustraciones.",
      score: 3
    }
  },
  "Aries-Libra": {
    love: {
      report: "Aries y Libra son opuestos que se atraen poderosamente en el amor, creando una dinámica fascinante. La impulsividad y asertividad de Aries pueden chocar con la indecisión y el deseo de armonía de Libra. Aries admira el encanto, la gracia y la sociabilidad de Libra, mientras que Libra se siente atraído por la confianza, la pasión y la energía de Aries. Para que la relación prospere, Aries debe aprender a ser más considerado y diplomático, y Libra a ser más decidido y a expresar sus necesidades directamente. Si aprenden a negociar, a valorar sus diferencias y a equilibrar la independencia con la unión, pueden disfrutar de una relación estimulante, equilibrada y apasionada.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Aries y Libra se equilibran mutuamente de forma natural. Aries, el guerrero, empuja a la acción y a la aventura, mientras que Libra, el diplomático, busca la armonía, la belleza y las conexiones sociales. Libra puede suavizar los impulsos de Aries y ayudarle a ver diferentes perspectivas, y Aries puede ayudar a Libra a tomar decisiones y a ser más asertivo. Disfrutan de actividades sociales juntos y de conversaciones estimulantes. Es una amistad donde ambos aprenden y crecen, combinando la energía con la gracia.",
      score: 4
    },
    work: {
      report: "En el trabajo, Aries y Libra pueden formar una sociedad excelente y bien equilibrada. Aries aporta energía, decisión e iniciativa, mientras que Libra ofrece diplomacia, estrategia y una gran habilidad para las relaciones interpersonales y la negociación. Aries puede ayudar a Libra a pasar a la acción, y Libra puede ayudar a Aries a considerar todas las partes y a pulir la presentación de las ideas. El desafío principal es equilibrar la independencia y el enfoque directo de Aries con el deseo de colaboración y consenso de Libra. Si lo logran, son un equipo formidable.",
      score: 4
    }
  },
  "Aries-Scorpio": {
    love: {
      report: "La atracción entre Aries y Escorpio es magnética, intensa y profundamente pasional en el amor. Ambos son signos poderosos, directos y no temen a la confrontación. Aries debe aprender a manejar la naturaleza a veces posesiva y celosa de Escorpio, y Escorpio debe aprender a dar a Aries el espacio y la libertad que necesita. La confianza es fundamental y puede ser un desafío construirla, ya que ambos pueden ser algo desconfiados. Si logran superar las luchas de poder y construyen una base sólida de confianza y honestidad, la relación puede ser transformadora, increíblemente profunda y muy leal.",
      score: 3
    },
    friendship: {
      report: "Aries y Escorpio como amigos forman un dúo leal, valiente y protector. Aries admira la profundidad, la astucia y la resiliencia de Escorpio, mientras que Escorpio se siente atraído por la valentía, la energía y la franqueza de Aries. Pueden tener enfrentamientos intensos debido a sus fuertes personalidades, pero su lealtad mutua suele ser inquebrantable. Es una amistad de extremos, con mucha pasión, defensa mutua y la capacidad de enfrentar cualquier desafío juntos. No es una amistad para los débiles de corazón, pero sí muy poderosa.",
      score: 3
    },
    work: {
      report: "En el trabajo, Aries y Escorpio pueden chocar por el control y el liderazgo, pero si logran unir fuerzas, su determinación combinada es imparable. Aries aporta la chispa inicial, la energía y la audacia, mientras que Escorpio ofrece estrategia, profundidad de análisis y una tenacidad inquebrantable. Necesitan respetar sus diferentes enfoques (Aries más directo, Escorpio más sutil) y, idealmente, compartir el liderazgo o tener áreas de responsabilidad bien definidas para lograr grandes cosas juntos. La ambición de ambos puede llevarlos muy lejos si canalizan su energía de forma constructiva.",
      score: 4
    }
  },
  "Aries-Sagittarius": {
    love: {
      report: "Aries y Sagitario disfrutan de una relación amorosa llena de diversión, risas, aventura y una comprensión casi instintiva. Ambos son signos de fuego, optimistas, honestos y aman su independencia. Se entienden en su necesidad de espacio y crecimiento personal, y rara vez se sienten ahogados. La pasión es alta y la vida juntos nunca es aburrida. El desafío puede ser la falta de atención a los detalles prácticos o un compromiso a veces esquivo. Sin embargo, si encuentran un propósito común que los inspire y cultivan la confianza mutua, su unión será una fuente constante de alegría, inspiración y expansión.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Aries y Sagitario es una fiesta continua, una explosión de energía positiva y entusiasmo. Siempre listos para una nueva aventura, un viaje improvisado o un debate filosófico apasionado, se entienden en su amor por la libertad y la exploración. Su honestidad es total, a veces brutal, pero generalmente bien intencionada. Es una amistad divertida, inspiradora, sin dramas innecesarios y siempre en movimiento, donde ambos se sienten libres de ser ellos mismos.",
      score: 5
    },
    work: {
      report: "Aries y Sagitario en el trabajo forman un equipo entusiasta, visionario e innovador. Aries inicia con audacia y energía, mientras que Sagitario expande con una visión amplia y un optimismo contagioso. Son excelentes para generar nuevas ideas, explorar mercados emergentes y motivar a otros. Pueden ser impacientes con la rutina o pasar por alto detalles importantes. Necesitan un ancla de realidad para sus grandes planes, pero su energía combinada es poderosa y puede impulsar proyectos con gran velocidad y entusiasmo.",
      score: 4
    }
  },
  "Aries-Capricorn": {
    love: {
      report: "En el amor, Aries y Capricornio tienen necesidades y enfoques de la vida muy diferentes, lo que puede generar fricción. Aries busca pasión, espontaneidad y acción inmediata, mientras que Capricornio valora la estabilidad, la planificación y la seguridad a largo plazo. Aries puede ver a Capricornio como demasiado serio, restrictivo o frío, y Capricornio puede percibir a Aries como inmaduro, impulsivo o irresponsable. Para que esta relación funcione, Aries debe apreciar la dedicación, la lealtad y la ambición de Capricornio, y Capricornio debe aprender a abrirse emocionalmente, a disfrutar de la calidez y el entusiasmo de Aries, y a ser más flexible. Requiere mucho trabajo, madurez y un deseo genuino de entender y complementar al otro.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Aries y Capricornio se respetan mutuamente por su fuerza y determinación, aunque sus estilos son muy diferentes. Capricornio, práctico y realista, puede ofrecer consejos sólidos y una perspectiva terrenal a Aries. Por su parte, Aries puede animar a Capricornio a salir de su zona de confort, a divertirse más y a ser menos rígido. Pueden chocar por sus diferentes ritmos y prioridades (Aries quiere acción ahora, Capricornio planifica a largo plazo). Sin embargo, si se aceptan y valoran sus diferencias, la amistad puede ser sólida y ofrecer un equilibrio entre la impulsividad y la cautela, donde Aries aprende disciplina y Capricornio algo de espontaneidad.",
      score: 3
    },
    work: {
      report: "Aries y Capricornio trabajando juntos pueden lograr mucho si respetan sus roles y valoran las fortalezas del otro. Aries es el motor de arranque, ideal para iniciar proyectos con energía y superar obstáculos iniciales. Capricornio es el estratega consumado, excelente para la planificación a largo plazo, la organización y la gestión de recursos. La impaciencia de Aries puede chocar con la cautela y el enfoque metódico de Capricornio. Si combinan la acción de Aries con la planificación y la disciplina de Capricornio, y si Capricornio permite que Aries tome la iniciativa bajo su supervisión estratégica, pueden ser un equipo muy efectivo y orientado a resultados.",
      score: 4
    }
  },
  "Aries-Aquarius": {
    love: {
      report: "Aries y Acuario disfrutan de una relación amorosa basada en la amistad, la libertad, el estímulo intelectual y un toque de excentricidad. No hay lugar para los celos o la posesividad excesiva, ya que ambos valoran enormemente su independencia y espacio personal. Aries se siente atraído por la originalidad y la mente brillante de Acuario, mientras que Acuario admira la energía, la valentía y la pasión de Aries. La conexión emocional puede necesitar un poco más de atención, ya que ambos pueden ser algo desapegados. Si cultivan la calidez y la comunicación abierta sobre sus sentimientos, su relación será única, emocionante y duradera, llena de aventuras y proyectos compartidos.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Aries y Acuario es dinámica, innovadora y llena de estímulos. Comparten un amor por la libertad, las nuevas ideas, la aventura y la justicia social. Aries impulsa con su energía y entusiasmo, mientras que Acuario inventa con su originalidad y visión de futuro. Son amigos que se estimulan mutuamente intelectualmente y respetan profundamente su individualidad. Suelen tener muchos intereses en común y disfrutan de actividades grupales o proyectos que desafíen lo convencional. Es una amistad llena de sorpresas, debates interesantes y un espíritu rebelde y progresista.",
      score: 5
    },
    work: {
      report: "En el trabajo, Aries y Acuario forman un dúo dinámico que puede generar ideas revolucionarias y llevar a cabo proyectos vanguardistas. Aries aporta la energía emprendedora, la iniciativa y la capacidad de superar obstáculos, mientras que Acuario ofrece una visión original, soluciones creativas y un enfoque humanitario. Disfrutan rompiendo moldes y explorando nuevos territorios. El desafío es mantener el enfoque en los detalles prácticos y llevar las ideas a una conclusión tangible. Mucha creatividad, independencia y un deseo compartido de innovar marcan su colaboración.",
      score: 4
    }
  },
  "Aries-Pisces": {
    love: {
      report: "Aries y Piscis en el amor es una mezcla intrigante de fuego y agua, donde la pasión y la sensibilidad deben encontrar un delicado equilibrio. La naturaleza directa y a veces ruda de Aries puede herir sin querer al ultrasensible Piscis. La tendencia de Piscis a la evasión o al ensueño puede frustrar al pragmático y activo Aries. Para que esta relación florezca, Aries necesita cultivar la ternura, la paciencia y la empatía, mientras que Piscis debe esforzarse por comunicar sus necesidades y sentimientos de manera más clara y directa, y también ofrecer a Aries la admiración que busca. Con amor, comprensión y un esfuerzo consciente por ambas partes, pueden crear una relación mágica, sanadora y profundamente romántica.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Aries y Piscis pueden ofrecerse mutuamente cualidades que el otro necesita. Aries, el protector, puede defender y animar al soñador Piscis, ayudándole a ser más asertivo y a enfrentar el mundo. Piscis, a su vez, puede ofrecer a Aries una profunda compasión, un refugio emocional y enseñarle sobre la empatía y la sutileza. Es una amistad de contrastes, donde la energía de Aries se encuentra con la sensibilidad de Piscis. Si logran entender y respetar sus diferencias fundamentales, pueden forjar un vínculo de crecimiento mutuo y apoyo incondicional.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Aries y Piscis tienen enfoques y estilos de trabajo muy diferentes. Aries lidera con acción directa y busca resultados rápidos, mientras que Piscis se guía más por la intuición, la creatividad y la atmósfera del entorno. Si logran colaborar, Aries puede ayudar a Piscis a materializar sus ideas y a ser más decidido, y Piscis puede aportar una visión imaginativa, soluciones creativas y un toque de humanidad a los proyectos de Aries. La comunicación clara y el respeto por las fortalezas y debilidades del otro son vitales para evitar malentendidos y aprovechar su potencial complementario.",
      score: 3
    }
  },
  "Taurus-Gemini": {
    love: {
      report: "Tauro y Géminis en el amor requieren una considerable comprensión y adaptación mutua. Tauro, regido por Venus, valora la sensualidad, la estabilidad y la conexión física, mientras que Géminis, regido por Mercurio, busca estímulo intelectual, variedad y comunicación constante. Tauro puede encontrar a Géminis demasiado inconstante, disperso o superficial emocionalmente, mientras que Géminis puede percibir a Tauro como demasiado posesivo, rutinario o lento. Si Tauro aprende a apreciar la chispa, el ingenio y la alegría de Géminis, y Géminis valora la lealtad, la fiabilidad y la sensualidad de Tauro, y ambos se esfuerzan en la comunicación, pueden encontrar un punto medio enriquecedor, aunque siempre será un desafío equilibrar sus necesidades tan dispares.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Tauro y Géminis puede ser sorprendentemente divertida y estimulante si ambos están dispuestos a apreciar sus diferencias. Géminis, con su curiosidad insaciable y su amor por la variedad, puede sacar a Tauro de su cómoda rutina e introducirle a nuevas ideas y actividades. Tauro, a su vez, puede ofrecer a Géminis un ancla de estabilidad, un amigo leal y práctico en quien confiar. Disfrutan de conversaciones animadas y pueden encontrar intereses comunes en el arte o la cultura. Necesitan respetar sus diferentes ritmos y niveles de energía para que la amistad prospere.",
      score: 3
    },
    work: {
      report: "En el trabajo, Tauro y Géminis pueden complementarse si se enfocan en sus fortalezas. Tauro aporta constancia, perseverancia y un enfoque práctico para llevar las tareas a término con calidad. Géminis ofrece adaptabilidad, habilidades de comunicación, rapidez mental y la capacidad de generar múltiples ideas. Tauro puede ayudar a Géminis a enfocarse y a ser más metódico, mientras que Géminis puede ayudar a Tauro a ser más flexible y a considerar nuevas perspectivas. La comunicación clara sobre roles y expectativas es clave para armonizar sus diferentes estilos y ritmos de trabajo y evitar que la lentitud de Tauro frustre a Géminis o la dispersión de Géminis irrite a Tauro.",
      score: 3
    }
  },
  "Taurus-Cancer": {
    love: {
      report: "Tauro y Cáncer en el amor tienen una alta compatibilidad, formando una de las combinaciones más tiernas y seguras del zodiaco. Ambos son signos sensuales, afectuosos, leales y buscan una relación estable y un hogar acogedor. Tauro, práctico y terrenal, ofrece la estabilidad y seguridad que Cáncer tanto anhela. Cáncer, emocional y nutritivo, colma a Tauro de cariño, cuidado y comprensión. Disfrutan de los placeres sencillos de la vida, como una buena comida casera, la comodidad del hogar y la compañía del otro. Su unión tiende a ser profundamente satisfactoria, leal y duradera, construida sobre una base de confianza y afecto genuino.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Tauro y Cáncer es cálida, reconfortante y muy sólida. Ambos valoran la lealtad, la seguridad y la confianza por encima de todo. Disfrutan de actividades tranquilas y hogareñas, como cocinar juntos, ver películas o simplemente charlar en un ambiente relajado. Son amigos en los que se puede confiar plenamente, siempre dispuestos a ofrecer apoyo emocional y práctico. Tauro aprecia la sensibilidad y el cuidado de Cáncer, mientras que Cáncer valora la fiabilidad y la naturaleza práctica de Tauro. Es una amistad que suele durar toda la vida, basada en el afecto profundo y el cuidado mutuo.",
      score: 5
    },
    work: {
      report: "Tauro y Cáncer trabajan excepcionalmente bien juntos, creando un ambiente laboral estable, nutritivo y productivo. Tauro aporta practicidad, perseverancia y un enfoque en la calidad, mientras que Cáncer contribuye con intuición, cuidado por el equipo y una gran dedicación. Son capaces de construir proyectos sólidos y duraderos, basados en la confianza mutua, el respeto y una comprensión intuitiva de las necesidades del otro. Tauro ayuda a mantener el rumbo práctico, y Cáncer asegura que el aspecto humano y emocional del trabajo no se descuide. Una combinación armoniosa y eficiente.",
      score: 4
    }
  },
  "Taurus-Leo": {
    love: {
      report: "Tauro y Leo en el amor comparten un gusto por los placeres de la vida, el lujo y una naturaleza apasionada, aunque sus estilos difieren. Leo, regio y extrovertido, admira la solidez, la sensualidad y la lealtad de Tauro. Tauro, a su vez, se siente atraído por la generosidad, la calidez y el carisma de Leo. La necesidad de Leo de ser el centro de atención y recibir constante admiración puede chocar con la naturaleza más reservada y a veces posesiva de Tauro. La terquedad de ambos signos fijos puede llevar a discusiones épicas si ninguno está dispuesto a ceder. Si Leo ofrece a Tauro la seguridad y el afecto constante que necesita, y Tauro mima a Leo con admiración y placeres, pueden construir una relación suntuosa, leal y muy satisfactoria.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Tauro y Leo son leales, generosos y disfrutan compartiendo las cosas buenas de la vida, como buena comida, eventos sociales y confort. Leo aporta drama, diversión y entusiasmo, mientras que Tauro ofrece estabilidad, un oído atento y consejos prácticos. Pueden chocar por terquedad o por la necesidad de Leo de ser el centro de atención, pero su aprecio mutuo suele ser fuerte. Es una amistad que puede ser muy gratificante si ambos respetan el espacio y las necesidades del otro, y si Tauro está dispuesto a participar en las aventuras sociales de Leo.",
      score: 3
    },
    work: {
      report: "En el trabajo, Tauro y Leo pueden ser un equipo poderoso y productivo si logran alinear sus objetivos y respetar sus diferentes estilos de liderazgo. Tauro aporta tenacidad, un enfoque práctico y la capacidad de llevar las cosas a término con calidad. Leo ofrece carisma, creatividad, visión y la habilidad de motivar a otros. El desafío principal es evitar las luchas de poder, ya que ambos pueden ser dominantes. Si se respetan mutuamente y definen roles claros (quizás Leo como el rostro público y Tauro como el gestor de fondo), pueden alcanzar grandes logros, combinando la practicidad con la ambición y la creatividad.",
      score: 3
    }
  },
  "Taurus-Virgo": {
    love: {
      report: "La relación amorosa entre Tauro y Virgo es una de las más sólidas, tranquilas y armoniosas del zodiaco, basada en el respeto mutuo, valores compartidos y un entendimiento práctico de la vida. Ambos son signos de tierra, lo que significa que buscan seguridad, estabilidad y una conexión tangible. Tauro aprecia la inteligencia, la dedicación y el cuidado de Virgo, mientras que Virgo admira la fiabilidad, la sensualidad y la naturaleza protectora de Tauro. Su amor es profundo, leal y duradero, construido sobre la confianza y el apoyo mutuo. La comunicación honesta y la apreciación por los pequeños detalles fortalecen su vínculo.",
      score: 5
    },
    friendship: {
      report: "Tauro y Virgo como amigos se entienden a la perfección y forman un lazo increíblemente fuerte y confiable. Son prácticos, leales, serviciales y se apoyan mutuamente en todos los aspectos de la vida. Disfrutan de actividades tranquilas, conversaciones significativas, y aprecian la honestidad y la inteligencia del otro. Virgo puede ayudar a Tauro con la organización y el análisis, mientras que Tauro ofrece a Virgo una sensación de calma y seguridad. Es una amistad muy nutritiva, estable y enriquecedora, basada en valores compartidos y un enfoque similar de la vida, que a menudo dura para siempre.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Tauro y Virgo forman un equipo altamente eficiente, productivo y orientado a la calidad. Tauro aporta perseverancia, un enfoque práctico y la capacidad de materializar ideas, mientras que Virgo ofrece análisis detallado, organización impecable y una búsqueda constante de la perfección. Juntos, pueden llevar cualquier proyecto al éxito con meticulosidad, dedicación y un alto estándar de excelencia. Existe una gran sinergia entre ellos, y su enfoque en el trabajo bien hecho y los resultados concretos los convierte en colaboradores ideales. Rara vez hay conflictos, ya que ambos valoran la eficiencia y el profesionalismo.",
      score: 5
    }
  },
  "Taurus-Libra": {
    love: {
      report: "Tauro y Libra, ambos regidos por Venus, se sienten atraídos por la belleza, el arte y el refinamiento del otro, lo que puede crear una base romántica y placentera para el amor. Disfrutan de ambientes hermosos, buena compañía y los placeres sensoriales. Tauro ofrece seguridad, estabilidad y una sensualidad terrenal, mientras que Libra aporta encanto, diplomacia y un toque de romance idealista. El desafío radica en que Tauro es práctico y a veces posesivo, mientras que Libra es más sociable y a veces indeciso. Si Tauro da a Libra el espacio social que necesita y Libra ofrece a Tauro la seguridad emocional y el compromiso que busca, su relación puede ser armoniosa, estéticamente agradable y muy satisfactoria.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Tauro y Libra es agradable, estética y sociable. Comparten un gusto por la belleza, el arte, la música y la armonía en sus relaciones. Libra aporta sociabilidad, encanto y una perspectiva equilibrada, mientras que Tauro ofrece estabilidad, lealtad y un aprecio por el confort. Pueden disfrutar de actividades culturales, salidas elegantes o simplemente de una buena conversación en un entorno agradable. Necesitan paciencia con la indecisión de Libra y la terquedad ocasional de Tauro, pero su aprecio mutuo por las cosas buenas de la vida puede mantener su amistad fuerte y placentera.",
      score: 4
    },
    work: {
      report: "En el trabajo, la colaboración entre Tauro y Libra puede ser productiva si se enfocan en la calidad y la presentación. Tauro es excelente para materializar ideas y asegurar la solidez de los proyectos, mientras que Libra aporta diplomacia, habilidades de negociación y un gran sentido estético, ideal para el trato con clientes o el diseño. Pueden tener dificultades si Tauro se muestra demasiado obstinado en sus métodos o si Libra tarda demasiado en tomar decisiones por buscar el consenso. La búsqueda de un terreno común y el respeto por las diferentes fortalezas de cada uno es esencial para su éxito conjunto en el ámbito profesional.",
      score: 3
    }
  },
  "Taurus-Scorpio": {
    love: {
      report: "La relación entre Tauro y Escorpio, signos opuestos en el zodiaco, es profundamente apasionada, intensa y potencialmente transformadora. La atracción física y emocional suele ser magnética e irresistible desde el principio. Tauro ofrece a Escorpio la estabilidad, la sensualidad y la lealtad que anhela, mientras que Escorpio aporta a Tauro una profundidad emocional, una pasión y una intensidad que pueden despertar facetas desconocidas. Los celos, la posesividad y la terquedad de ambos pueden ser desafíos significativos. Si logran construir una confianza inquebrantable, comunicarse abiertamente sobre sus miedos y canalizar su poderosa energía conjunta de manera constructiva, pueden forjar un vínculo inquebrantable y profundamente satisfactorio.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Tauro y Escorpio pueden formar un lazo de lealtad y protección increíblemente fuerte, aunque a veces complejo. Ambos son signos fijos y muy leales a quienes consideran dignos de su confianza. Se entienden a un nivel profundo que va más allá de las palabras. Sin embargo, pueden surgir conflictos por la posesividad de Escorpio o la terquedad de Tauro, y ambos pueden ser reacios a ceder. Si logran superar la desconfianza inicial y se abren el uno al otro, su amistad será de 'todo o nada', con un gran potencial para la confianza, el apoyo incondicional y una comprensión mutua muy profunda.",
      score: 4
    },
    work: {
      report: "En el trabajo, Tauro y Escorpio son un equipo imparable si logran unir sus considerables fuerzas y no caer en luchas de poder. Tauro aporta constancia, un enfoque práctico y la capacidad de construir sobre bases sólidas. Escorpio ofrece estrategia, una mente investigadora y una determinación feroz para alcanzar los objetivos. Pueden surgir tensiones si ambos intentan imponer su voluntad, pero su respeto mutuo por la competencia y la dedicación del otro suele ser grande. Juntos, pueden abordar los proyectos más difíciles con una combinación de perseverancia y profundidad analítica, logrando resultados impresionantes.",
      score: 4
    }
  },
  "Taurus-Sagittarius": {
    love: {
      report: "Tauro y Sagitario en el amor deben hacer un esfuerzo consciente para conciliar sus necesidades y estilos de vida tan diferentes. Tauro desea seguridad, estabilidad y rutinas placenteras, mientras que Sagitario anhela aventura, libertad y exploración constante. Sagitario puede ver a Tauro como demasiado posesivo o aburrido, y Tauro puede percibir a Sagitario como irresponsable o poco comprometido. Sin embargo, si Tauro se abre a la aventura y a la diversión que Sagitario ofrece, y Sagitario aprende a valorar la seguridad, la lealtad y el confort que Tauro brinda, pueden aprender mucho el uno del otro y ampliar sus horizontes, aunque siempre será una relación que requiera compromiso y adaptación.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Tauro y Sagitario es un aprendizaje constante y una oportunidad para expandir perspectivas. Sagitario, el aventurero, puede animar al hogareño Tauro a salir de su rutina y a probar cosas nuevas, mientras que Tauro, el pragmático, puede ofrecer a Sagitario un ancla de estabilidad y consejos sensatos. Disfrutan de placeres diferentes –Tauro los sensoriales, Sagitario los intelectuales o físicos– pero pueden encontrar puntos en común si son pacientes y abiertos. Es una amistad que puede enriquecer a ambos si se respetan sus diferencias fundamentales en cuanto a ritmo y prioridades.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Tauro y Sagitario tienen enfoques y métodos de trabajo muy diferentes. Tauro es metódico, práctico y enfocado en la calidad y la finalización. Sagitario es visionario, optimista y busca la expansión y las nuevas oportunidades, a veces descuidando los detalles. Tauro puede ayudar a Sagitario a concretar sus grandes ideas y a ser más realista, mientras que Sagitario puede inspirar a Tauro a pensar en grande y a ser menos reacio al cambio. Requiere mucha paciencia y respeto por los métodos del otro para que esta colaboración sea productiva y no genere frustración.",
      score: 2
    }
  },
  "Taurus-Capricorn": {
    love: {
      report: "La relación amorosa entre Tauro y Capricornio es una de las más estables, seguras y duraderas del zodiaco, basada en un profundo respeto mutuo, valores compartidos y un enfoque práctico de la vida. Ambos son signos de tierra, realistas, ambiciosos y buscan un compañero confiable y leal con quien construir un futuro sólido. Tauro admira la fortaleza, la disciplina y la ambición de Capricornio, mientras que Capricornio valora la sensualidad, la lealtad y la naturaleza afectuosa de Tauro. Su vínculo es profundo, comprometido y muy satisfactorio, con una comprensión intuitiva de las necesidades del otro.",
      score: 5
    },
    friendship: {
      report: "Tauro y Capricornio como amigos son la definición de lealtad, fiabilidad y apoyo práctico. Comparten valores similares sobre el trabajo duro, la ambición y la importancia de construir una vida segura. Se entienden bien, se ofrecen consejos sensatos y se ayudan mutuamente a alcanzar sus metas. Aunque pueden parecer serios o reservados para otros, entre ellos existe un humor sutil y un profundo aprecio. Es una amistad sólida, confiable y que perdura en el tiempo, basada en el respeto, la comprensión y una visión similar del mundo.",
      score: 5
    },
    work: {
      report: "En el trabajo, Tauro y Capricornio son un equipo formidable, destinado al éxito. Tauro aporta perseverancia, un enfoque práctico y la capacidad de materializar planes, mientras que Capricornio ofrece estrategia, disciplina, organización y una ambición implacable. Juntos, pueden alcanzar grandes metas, construir empresas duraderas y gestionar proyectos complejos con eficiencia y dedicación. Se respetan profundamente por su ética de trabajo y se complementan a la perfección en el ámbito profesional, formando una alianza poderosa y orientada a resultados.",
      score: 5
    }
  },
  "Taurus-Aquarius": {
    love: {
      report: "Tauro y Acuario en el amor pueden encontrar muchas dificultades para entenderse y conectar a un nivel profundo, ya que representan energías muy diferentes. Tauro, terrenal y posesivo, busca conexión física, seguridad y estabilidad, mientras que Acuario, aéreo e independiente, valora la libertad, el estímulo intelectual y un enfoque más desapegado de las emociones. Acuario puede encontrar a Tauro demasiado convencional o materialista, y Tauro puede percibir a Acuario como errático, impredecible o emocionalmente distante. Para que esta relación funcione, se requiere un enorme esfuerzo, mucha tolerancia y una aceptación genuina de las diferencias fundamentales del otro. Es una combinación desafiante.",
      score: 1
    },
    friendship: {
      report: "La amistad entre Tauro y Acuario es inusual y a menudo presenta desafíos debido a sus diferentes valores y formas de ver el mundo. Tauro es práctico, tradicional y valora la estabilidad, mientras que Acuario es idealista, innovador y necesita libertad. Pueden chocar por sus diferentes enfoques y prioridades. Sin embargo, si logran respetar sus diferencias, Acuario puede aportar ideas nuevas y una perspectiva más amplia a Tauro, y Tauro puede ofrecer a Acuario una dosis de realismo y estabilidad. Es una amistad que, si se da, desafía las convenciones y requiere mucha apertura mental.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Tauro y Acuario tienen enfoques y estilos de trabajo casi opuestos, lo que puede generar tensión o, con mucho esfuerzo, una complementariedad innovadora. Tauro prefiere métodos probados y busca resultados tangibles y seguridad. Acuario busca la innovación, el cambio y valora la libertad intelectual. Tauro puede ver a Acuario como poco práctico o rebelde, y Acuario puede percibir a Tauro como rígido o demasiado lento. Si logran respetar sus diferencias, Tauro puede ayudar a dar forma y estructura a las ideas vanguardistas de Acuario, y Acuario puede modernizar los enfoques de Tauro, pero la colaboración suele ser un desafío.",
      score: 2
    }
  },
  "Taurus-Pisces": {
    love: {
      report: "La relación entre Tauro y Piscis es tierna, afectuosa, romántica y llena de una profunda comprensión mutua. Tauro, práctico y sensual, se siente atraído por la naturaleza dulce, imaginativa y compasiva de Piscis. Piscis, a su vez, encuentra en Tauro un refugio seguro, una estabilidad y una conexión terrenal que anhela. Tauro ayuda a Piscis a mantenerse con los pies en la tierra y a materializar sus sueños, mientras que Piscis enseña a Tauro a conectar con sus emociones más profundas y a apreciar la belleza espiritual de la vida. Es una unión armoniosa, nutritiva y espiritualmente enriquecedora, con un gran potencial para la felicidad duradera.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Tauro y Piscis se llevan maravillosamente bien, formando un lazo de afecto, apoyo y comprensión mutua. Tauro ofrece apoyo práctico, estabilidad y un oído leal, mientras que Piscis aporta sensibilidad, imaginación y una profunda empatía. Disfrutan de actividades tranquilas y creativas, como el arte, la música o simplemente compartir momentos de paz. Es una amistad muy nutritiva y leal, donde ambos se sienten cuidados, valorados y comprendidos a un nivel profundo. Tauro ancla a Piscis, y Piscis inspira a Tauro.",
      score: 5
    },
    work: {
      report: "En el trabajo, Tauro y Piscis pueden colaborar de manera muy efectiva, especialmente en campos que requieran tanto practicidad como creatividad. Tauro se encarga de la estructura, la planificación y la ejecución, mientras que Piscis aporta la visión creativa, la intuición y la empatía. Tauro ayuda a Piscis a materializar sus ideas y a mantenerse enfocado, mientras que Piscis puede inspirar a Tauro y aportar un toque de humanidad a los proyectos. Juntos forman un equipo que combina lo práctico con lo imaginativo de manera armoniosa y productiva.",
      score: 4
    }
  },
  "Gemini-Cancer": {
    love: {
      report: "Géminis y Cáncer en el amor tienen enfoques y necesidades emocionales bastante diferentes, lo que puede crear desafíos. Géminis, mental y comunicativo, busca un compañero intelectual y variedad, mientras que Cáncer, emocional y hogareño, anhela seguridad, afecto constante y un nido seguro. Géminis puede encontrar a Cáncer demasiado necesitado o sensible, y Cáncer puede percibir a Géminis como superficial o poco comprometido. Sin embargo, el ingenio y la alegría de Géminis pueden alegrar a Cáncer, y la ternura y el cuidado de Cáncer pueden tocar el corazón de Géminis. Requiere mucha comunicación, paciencia y un esfuerzo por comprender las necesidades del otro.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Géminis y Cáncer es una mezcla de diversión y cuidado, aunque con algunas diferencias en sus estilos sociales. Géminis aporta la chispa social, la variedad de temas de conversación y el humor, mientras que Cáncer ofrece una escucha atenta, apoyo emocional y un refugio seguro. Cáncer puede apreciar la capacidad de Géminis para sacarlo de su caparazón, y Géminis puede valorar la lealtad y el cuidado genuino de Cáncer. Necesitan entender y respetar sus diferentes formas de expresar afecto y sus necesidades sociales (Géminis más extrovertido, Cáncer más hogareño).",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Cáncer pueden complementarse si logran armonizar sus estilos. Géminis aporta ideas frescas, habilidades de comunicación y adaptabilidad, mientras que Cáncer ofrece intuición, cuidado por el equipo y una dedicación tenaz a los proyectos que le importan. Géminis necesita variedad y estímulo mental, mientras que Cáncer busca estabilidad y un ambiente de trabajo seguro. Si Géminis es considerado con los sentimientos de Cáncer y no lo presiona demasiado, y Cáncer no intenta ahogar la libertad de Géminis con demasiadas expectativas emocionales, pueden lograr buenos resultados juntos, especialmente en roles de cara al público o creativos.",
      score: 3
    }
  },
  "Gemini-Leo": {
    love: {
      report: "La relación entre Géminis y Leo es estimulante, juguetona, social y llena de admiración mutua. Géminis, el comunicador ingenioso, se siente fascinado por la confianza, el carisma y la calidez de Leo. Leo, el rey de la selva, disfruta de la inteligencia, el humor y la versatilidad de Géminis. Ambos disfrutan de una vida social activa, de la diversión y de ser el centro de atención (Leo un poco más). Si Leo no se vuelve demasiado demandante de atención y Géminis ofrece la lealtad y el enfoque que Leo necesita, su relación será brillante, alegre y llena de aventuras compartidas.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Géminis y Leo son pura diversión y dinamismo. Géminis aporta las ideas chispeantes y la conversación animada, mientras que Leo contribuye con el entusiasmo, la generosidad y el liderazgo en las aventuras. Les encanta socializar, organizar eventos y ser el centro de atención de cualquier grupo. Géminis sabe cómo halagar el ego de Leo, y Leo aprecia la inteligencia y el ingenio de Géminis. Es una amistad llena de risas, creatividad, apoyo mutuo en sus empresas y una energía social contagiosa.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Leo forman un dúo creativo, carismático y muy persuasivo. Géminis aporta ideas brillantes, habilidades de comunicación y adaptabilidad, mientras que Leo ofrece liderazgo inspirador, entusiasmo y una gran capacidad para motivar al equipo. Juntos pueden ser muy exitosos en roles de marketing, ventas, relaciones públicas o cualquier proyecto que requiera innovación y una presentación impactante. Deben cuidar no competir por el protagonismo y enfocarse en metas comunes para canalizar su considerable energía positiva.",
      score: 4
    }
  },
  "Gemini-Virgo": {
    love: {
      report: "La conexión amorosa entre Géminis y Virgo, ambos regidos por Mercurio, es primordialmente mental e intelectual. Ambos son inteligentes, comunicativos y disfrutan del análisis y el debate. Géminis puede encontrar a Virgo demasiado crítico, perfeccionista o rutinario, mientras que Virgo puede percibir a Géminis como inconstante, superficial o poco fiable. Sin embargo, si ambos aprecian la inteligencia aguda del otro, Géminis ofrece la constancia y el compromiso que Virgo necesita, y Virgo aprende a ser más flexible y menos crítico, pueden construir una relación basada en una estimulante compañía intelectual, humor ingenioso y un deseo compartido de aprender y mejorar.",
      score: 3
    },
    friendship: {
      report: "Géminis y Virgo como amigos disfrutan de conversaciones inteligentes, debates analíticos y un intercambio constante de información. Virgo, práctico y servicial, puede ayudar a Géminis a ser más organizado y a enfocarse en los detalles. Géminis, a su vez, puede enseñar a Virgo a ser menos rígido, a ver el lado divertido de las cosas y a explorar nuevas ideas. Su amistad se basa en el estímulo intelectual y el respeto por la mente del otro. Virgo debe cuidar su tendencia a la crítica, y Géminis su propensión a la dispersión y a no cumplir los planes.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Virgo pueden ser un equipo intelectualmente poderoso y muy eficiente si logran sincronizar sus diferentes estilos de trabajo. Géminis es excelente generando ideas, comunicando y adaptándose a los cambios, mientras que Virgo es el maestro de la organización, el análisis detallado y la ejecución impecable. La crítica constructiva de Virgo puede ser un punto de fricción si no se expresa con cuidado, pero también puede ayudar a pulir las ideas de Géminis. Juntos pueden lograr una gran precisión, una comunicación efectiva y resultados de alta calidad, especialmente en proyectos que requieran tanto creatividad como atención al detalle.",
      score: 4
    }
  },
  "Gemini-Libra": {
    love: {
      report: "Géminis y Libra, ambos signos de aire, disfrutan de una relación amorosa ligera, divertida, socialmente activa y llena de conversaciones interesantes y estimulantes. Géminis se siente atraído por el encanto, la diplomacia y el sentido estético de Libra, mientras que Libra admira la inteligencia, el ingenio y la versatilidad de Géminis. Ambos valoran la comunicación, la armonía y la variedad. Pueden necesitar trabajar en la profundidad emocional y el compromiso a largo plazo, ya que ambos pueden ser algo indecisos o reacios a la confrontación. Si cultivan la conexión emocional además de la intelectual, y se apoyan mutuamente en la toma de decisiones, su unión puede ser muy feliz, armoniosa y duradera.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Géminis y Libra es naturalmente armoniosa, sociable y mentalmente estimulante. Ambos son comunicativos, curiosos, aman la variedad y disfrutan de la compañía del otro. Disfrutan explorando ideas, actividades culturales, eventos sociales y manteniendo conversaciones ligeras y entretenidas. Libra aprecia el ingenio de Géminis, y Géminis el equilibrio y la gracia de Libra. Es una amistad llena de encanto, inteligencia, diversión compartida y un entendimiento casi instantáneo, con muy pocos conflictos.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Libra colaboran de manera creativa, diplomática y muy efectiva, especialmente en roles que involucren comunicación, relaciones públicas, arte o negociación. Géminis aporta versatilidad, ideas frescas y habilidades de comunicación, mientras que Libra ofrece equilibrio, estrategia, un gran sentido estético y la capacidad de crear armonía en el equipo. El desafío puede surgir si Géminis se dispersa en demasiados proyectos o si Libra tarda demasiado en tomar decisiones por buscar el consenso perfecto. Si se enfocan, son un equipo excelente para generar un ambiente positivo y lograr resultados refinados.",
      score: 4
    }
  },
  "Gemini-Scorpio": {
    love: {
      report: "La atracción entre Géminis, el gemelo aéreo, y Escorpio, el intenso signo de agua, puede ser magnética e intrigante, pero también compleja. La necesidad de Escorpio de profundidad emocional, intimidad total y control puede chocar con la naturaleza más ligera, libre y comunicativa de Géminis. Escorpio busca fusionarse y descubrir todos los secretos, mientras que Géminis valora su independencia y la exploración de múltiples intereses. Si Géminis está dispuesto a profundizar emocionalmente y a ofrecer la lealtad que Escorpio demanda, y Escorpio aprende a ofrecer a Géminis el espacio y la confianza que necesita, la relación puede ser transformadora y fascinante, aunque siempre requerirá un esfuerzo consciente para entender las necesidades del otro.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Géminis y Escorpio ofrecen una dinámica intrigante y a menudo desafiante. Géminis es curioso y abierto, mientras que Escorpio es reservado y perceptivo. Escorpio puede enseñar a Géminis sobre la profundidad emocional y la lealtad intensa, mientras que Géminis puede aligerar la intensidad de Escorpio e introducirle a nuevas perspectivas. Requiere una base sólida de confianza y respeto por sus naturalezas tan diferentes. Si logran conectar, pueden tener conversaciones fascinantes y una amistad que va más allá de lo superficial, aunque los malentendidos son posibles.",
      score: 2
    },
    work: {
      report: "Profesionalmente, los estilos de Géminis y Escorpio son muy diferentes, lo que puede llevar a conflictos o a una complementariedad poderosa si se gestiona bien. Géminis usa la lógica, la comunicación y la adaptabilidad, mientras que Escorpio se basa en la estrategia, la intuición y una determinación implacable. Escorpio puede encontrar a Géminis superficial o poco comprometido, y Géminis puede percibir a Escorpio como demasiado controlador o secreto. Si se respetan, Géminis puede aportar nuevas perspectivas e ideas, y Escorpio la capacidad de investigación profunda y la tenacidad para llevar los proyectos a buen puerto. La clave está en la comunicación clara y la definición de roles.",
      score: 3
    }
  },
  "Gemini-Sagittarius": {
    love: {
      report: "Géminis y Sagitario, opuestos en el zodiaco, disfrutan de una relación amorosa vivaz, optimista, intelectualmente estimulante y muy libre. Se entienden en su necesidad de independencia, aventura y aprendizaje constante. Las conversaciones son interminables, llenas de humor y filosofía. El desafío puede ser el compromiso a largo plazo y la atención a los detalles prácticos, ya que ambos pueden ser reacios a sentirse atados. Si valoran la libertad del otro, mantienen la honestidad (a veces brutal de Sagitario) y encuentran un terreno común en su amor por la exploración, su relación será una fuente constante de crecimiento, diversión y expansión mutua.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Géminis y Sagitario es una aventura constante y una fiesta para la mente. Ambos son curiosos, extrovertidos, aman aprender, viajar y socializar. Se dan mucha libertad y se entienden instintivamente en su aversión a la rutina y las restricciones. Suelen tener debates filosóficos apasionados, mucho humor y una energía que nunca decae. Es una amistad llena de optimismo, exploración, honestidad y una sed compartida de conocimiento y nuevas experiencias.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Sagitario forman un equipo increíblemente creativo, visionario y lleno de ideas. Géminis aporta habilidades de comunicación, versatilidad y una mente rápida, mientras que Sagitario ofrece una visión amplia, optimismo y un espíritu emprendedor. Pueden generar muchas ideas innovadoras, pero necesitan enfocarse para concretarlas y no pasar por alto los detalles. Su honestidad directa es una ventaja si se maneja con tacto. Juntos, pueden ser excelentes en marketing, educación o cualquier campo que requiera pensamiento original y una perspectiva global.",
      score: 4
    }
  },
  "Gemini-Capricorn": {
    love: {
      report: "Géminis y Capricornio en el amor requieren mucho trabajo, paciencia y una voluntad de hierro para comprenderse, ya que sus naturalezas son fundamentalmente diferentes. Géminis busca diversión, variedad y estímulo mental, mientras que Capricornio anhela seguridad, estabilidad y logros tangibles. La libertad y la inconstancia de Géminis pueden chocar frontalmente con la necesidad de control y la seriedad de Capricornio. Sin embargo, Capricornio puede ofrecer la estructura y la estabilidad que a Géminis a veces le falta, y Géminis puede enseñar a Capricornio a relajarse, a ser más flexible y a disfrutar del momento presente. La comunicación clara sobre expectativas es absolutamente crucial.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Géminis y Capricornio son polos opuestos que pueden aprender mucho el uno del otro si se esfuerzan por entenderse. Géminis es adaptable, sociable y siempre en busca de novedad, mientras que Capricornio es estructurado, reservado y práctico. Capricornio puede ofrecer a Géminis consejos sólidos y una perspectiva realista, y Géminis puede aportar ligereza, humor y nuevas ideas a la vida de Capricornio. Si se respetan y valoran sus diferencias, pueden tener una amistad que equilibre la diversión con la seriedad y el pragmatismo con la espontaneidad.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Géminis y Capricornio pueden encontrar difícil trabajar juntos al principio debido a sus estilos contrastantes. Géminis puede ver a Capricornio como demasiado rígido, lento o controlador, mientras que Capricornio puede percibir a Géminis como poco fiable, disperso o carente de seriedad. Sin embargo, si logran superar estas diferencias y se asignan roles claros, pueden ser un equipo sorprendentemente efectivo. Géminis puede aportar ideas frescas, habilidades de comunicación y adaptabilidad, mientras que Capricornio ofrece la estructura, la planificación y la disciplina para implementar esas ideas y asegurar resultados de calidad.",
      score: 3
    }
  },
  "Gemini-Aquarius": {
    love: {
      report: "Géminis y Acuario, ambos signos de aire, disfrutan de una relación amorosa excepcionalmente estimulante, poco convencional y basada en una profunda conexión mental y una amistad sólida. No son excesivamente emocionales o posesivos, y ambos valoran enormemente su independencia y libertad intelectual. Su vida social suele ser activa y llena de personas interesantes. Disfrutan de conversaciones que duran horas, explorando ideas innovadoras y compartiendo un peculiar sentido del humor. Su unión promete ser duradera, igualitaria y llena de descubrimientos mutuos y aventuras intelectuales.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Géminis y Acuario es una conexión de almas afines, una verdadera unión de mentes. Ambos son intelectuales, curiosos, progresistas y valoran la libertad por encima de todo. Disfrutan de conversaciones innovadoras, debates sobre temas sociales o futuristas, y de explorar nuevas ideas y tecnologías. Se dan mucho espacio, se respetan mutuamente y se admiran por su originalidad. Es una amistad basada en el respeto mutuo, la estimulación mental constante y una visión compartida del mundo, a menudo con un toque de excentricidad.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Acuario forman un equipo innovador, brillante y altamente creativo. Géminis aporta versatilidad, habilidades de comunicación y una mente rápida, mientras que Acuario ofrece originalidad, una visión de futuro y un enfoque humanitario. Disfrutan trabajando en proyectos vanguardistas, desafiando el status quo e inspirándose mutuamente. La comunicación fluye sin esfuerzo y suelen entenderse casi telepáticamente. Su colaboración tiene un gran potencial creativo y puede generar soluciones verdaderamente únicas y progresistas.",
      score: 5
    }
  },
  "Gemini-Pisces": {
    love: {
      report: "Géminis y Piscis en el amor pueden sentirse atraídos por el misterio y la naturaleza esquiva del otro, pero su compatibilidad requiere un esfuerzo considerable. La necesidad de Piscis de una conexión emocional profunda, empatía y seguridad puede chocar con la naturaleza más mental, lógica y a veces distante de Géminis. Géminis puede encontrar a Piscis demasiado sensible o irracional, mientras que Piscis puede percibir a Géminis como superficial o poco comprometido. Si Géminis aprende a ser más empático y a validar los sentimientos de Piscis, y Piscis aprende a comunicar sus necesidades de forma más directa y a apreciar el ingenio de Géminis, pueden encontrar un terreno común en su creatividad y compasión mutua.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Géminis y Piscis pueden formar una combinación imaginativa y a veces confusa. Géminis aporta ingenio, variedad y una perspectiva lógica, mientras que Piscis ofrece sensibilidad, compasión y una rica vida interior. Piscis puede apreciar la ligereza y el humor de Géminis, y Géminis puede valorar la empatía y la creatividad de Piscis. Sin embargo, necesitan esforzarse en la comunicación clara para evitar malentendidos, ya que la lógica de Géminis puede chocar con la intuición de Piscis, y la sensibilidad de Piscis puede ser herida por la franqueza de Géminis.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Piscis pueden tener dificultades para entenderse y colaborar eficazmente si no hay una estructura clara. Géminis busca hechos, lógica y comunicación clara, mientras que Piscis se guía más por percepciones, sentimientos y un enfoque más fluido. La creatividad de Piscis puede inspirar a Géminis, y la elocuencia y adaptabilidad de Géminis pueden ayudar a Piscis a expresar sus ideas. Sin embargo, necesitan límites claros, roles definidos y mucha paciencia para que su colaboración sea productiva y no se pierda en la confusión o la falta de dirección.",
      score: 2
    }
  },
  "Cancer-Leo": {
    love: {
      report: "Cáncer y Leo en el amor: el sensible Cáncer se siente atraído por la calidez, la confianza y la generosidad del regio Leo. Leo, a su vez, aprecia la devoción, el cuidado y el apoyo incondicional que Cáncer le ofrece. Leo necesita ser el centro de atención y ser admirado, mientras que Cáncer disfruta cuidando y nutriendo a sus seres queridos. Si Leo ofrece a Cáncer la seguridad emocional y la lealtad que necesita, y Cáncer mima y admira a Leo sin sentirse eclipsado, pueden construir un hogar lleno de amor, creatividad, lealtad y una calidez que irradia a todos los que los rodean.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Cáncer y Leo es protectora, cálida y llena de afecto. Leo aporta la diversión, el entusiasmo y un toque de drama, mientras que Cáncer ofrece una escucha atenta, apoyo emocional y un refugio seguro. Leo disfruta del cuidado y la admiración de Cáncer, y Cáncer se siente atraído por la generosidad y la energía vital de Leo. Pueden surgir pequeños roces si el ego de Leo se impone o si Cáncer se vuelve demasiado posesivo, pero generalmente es una amistad leal donde ambos se sienten valorados y queridos.",
      score: 4
    },
    work: {
      report: "En el trabajo, Cáncer y Leo pueden ser un equipo efectivo si Leo lidera con generosidad y un corazón abierto, y Cáncer apoya con lealtad y dedicación. Leo aporta carisma, creatividad y la capacidad de inspirar, mientras que Cáncer ofrece intuición, cuidado por el equipo y tenacidad. Deben tener cuidado de que el dramatismo o la necesidad de reconocimiento de Leo no abrume la sensibilidad de Cáncer. Juntos pueden crear un ambiente de trabajo motivador, cálido y productivo, especialmente en roles de cara al público o en industrias creativas.",
      score: 3
    }
  },
  "Cancer-Virgo": {
    love: {
      report: "Cáncer y Virgo en el amor pueden construir una relación sólida, afectuosa y muy estable, basada en el cuidado mutuo y un deseo compartido de seguridad. Cáncer, emocional y sensible, aprecia la dedicación, la inteligencia y la naturaleza servicial de Virgo. Virgo, práctico y analítico, valora la ternura, la lealtad y la capacidad de Cáncer para crear un hogar acogedor. Virgo ayuda a Cáncer a manejar sus emociones de forma más racional, y Cáncer enseña a Virgo a ser más expresivo y a conectar con sus sentimientos. Son muy leales, comprometidos y suelen construir un futuro juntos con paciencia y dedicación.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Cáncer y Virgo se apoyan mutuamente de forma incondicional y práctica. Virgo ofrece consejos sensatos, ayuda organizada y una perspectiva analítica, mientras que Cáncer brinda apoyo emocional, una escucha empática y un cuidado genuino. Disfrutan de actividades tranquilas, conversaciones significativas y de ayudarse en los momentos difíciles. Virgo puede ayudar a Cáncer a no ahogarse en sus emociones, y Cáncer puede enseñar a Virgo a ser menos crítico y más compasivo. Es una amistad basada en el cuidado, la confianza y la comprensión mutua.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Cáncer y Virgo trabajan muy bien juntos, formando un equipo eficiente y orientado al detalle. Cáncer aporta intuición, creatividad y un fuerte sentido de lealtad al equipo, mientras que Virgo ofrece análisis práctico, organización impecable y una dedicación a la calidad. Se complementan de manera muy efectiva. Virgo ayuda a Cáncer a ser más objetivo y a estructurar sus ideas, y Cáncer aporta calidez, humanidad y un enfoque centrado en las personas al método de Virgo. Juntos pueden crear un ambiente de trabajo organizado, humano y altamente productivo.",
      score: 4
    }
  },
  "Cancer-Libra": {
    love: {
      report: "Cáncer y Libra en el amor se sienten atraídos inicialmente por la amabilidad, el encanto y el deseo de armonía del otro. Sin embargo, sus necesidades emocionales pueden chocar. La necesidad de Cáncer de una conexión emocional profunda y seguridad constante puede resultar abrumadora para el más sociable e intelectual Libra. Libra puede encontrar a Cáncer demasiado posesivo o temperamental, mientras que Cáncer puede percibir a Libra como superficial o indeciso. Para que funcione, Cáncer debe dar a Libra espacio social y Libra debe esforzarse por ofrecer la seguridad emocional que Cáncer necesita. Requiere mucha comunicación y compromiso.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Cáncer y Libra busca la armonía y el placer estético. Cáncer ofrece apoyo emocional y un refugio seguro, mientras que Libra aporta sociabilidad, encanto y una perspectiva equilibrada. Disfrutan de ambientes agradables, actividades culturales y conversaciones sobre relaciones. Libra debe ser sensible a los cambios de humor de Cáncer y a su necesidad de intimidad, y Cáncer debe apreciar la necesidad de Libra de interacción social y variedad. Pueden ser buenos confidentes si logran entender sus diferentes estilos emocionales.",
      score: 3
    },
    work: {
      report: "En el trabajo, Cáncer y Libra pueden tener dificultades para encontrar un ritmo común. Cáncer es intuitivo y emocional en sus decisiones, mientras que Libra es más lógico y busca el consenso. Si logran encontrar un punto medio, Cáncer puede aportar sensibilidad y cuidado por el equipo, y Libra habilidades sociales, diplomacia y un buen sentido estético. La toma de decisiones puede ser lenta si Cáncer se retrae emocionalmente o si Libra duda demasiado en busca de la solución perfecta. Necesitan roles claros y mucha comunicación.",
      score: 2
    }
  },
  "Cancer-Scorpio": {
    love: {
      report: "La compatibilidad amorosa entre Cáncer y Escorpio es una de las más fuertes y profundas del zodiaco. Ambos son signos de agua, lo que significa que se entienden a un nivel emocional e intuitivo casi telepático. Anhelan una fusión emocional total y son ferozmente leales y protectores con su pareja. La pasión es intensa y la conexión, magnética. Los desafíos pueden surgir de la posesividad o los celos de ambos, o de la tendencia de Escorpio a ser reservado y de Cáncer a ser temperamental. Sin embargo, su amor profundo y su capacidad de comprensión mutua suelen superar cualquier obstáculo, creando un vínculo transformador y duradero.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Cáncer y Escorpio tienen una conexión profunda, intuitiva y extremadamente leal. Son el tipo de amigos que se entienden casi sin palabras y que guardarían los secretos del otro hasta la tumba. Ambos son protectores y ofrecen un apoyo incondicional en los momentos difíciles. Comparten una comprensión de las complejidades emocionales y pueden tener conversaciones muy profundas. Es una amistad muy intensa, significativa y que a menudo dura toda la vida, basada en la confianza y una lealtad a toda prueba.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Cáncer y Escorpio forman un equipo poderoso, perceptivo y muy dedicado. Cáncer aporta sensibilidad, intuición y un fuerte compromiso con el bienestar del equipo. Escorpio ofrece determinación, estrategia, una mente investigadora y la capacidad de profundizar en los problemas. Se entienden bien y pueden trabajar con gran dedicación y enfoque, especialmente en proyectos que requieran un componente emocional, investigativo o estratégico. Juntos, son capaces de descubrir verdades ocultas y lograr objetivos ambiciosos con tenacidad.",
      score: 4
    }
  },
  "Cancer-Sagittarius": {
    love: {
      report: "Cáncer, el cangrejo hogareño, y Sagitario, el arquero aventurero, deben esforzarse considerablemente para entenderse en el amor. La necesidad de Sagitario de independencia, exploración y franqueza directa puede hacer que el sensible Cáncer se sienta inseguro, herido o abandonado. La necesidad de Cáncer de seguridad emocional y un nido acogedor puede parecer limitante para el espíritu libre de Sagitario. Para que esta relación funcione, Sagitario debe ser mucho más considerado y tranquilizador, y Cáncer debe aprender a dar más libertad y a no tomarse las cosas tan a pecho. Si ambos están dispuestos a aprender y crecer, puede ser una relación de expansión, pero requiere mucha madurez y paciencia.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Cáncer y Sagitario es una combinación de contrastes que puede ser estimulante o frustrante. Sagitario es optimista, extrovertido y siempre en busca de nuevas aventuras, mientras que Cáncer es más hogareño, sensible y necesita seguridad emocional. Sagitario puede animar a Cáncer a salir de su caparazón y a ver el lado divertido de la vida, mientras que Cáncer puede ofrecer a Sagitario un refugio seguro y una escucha empática. Necesitan mucha paciencia y una aceptación genuina de sus diferencias fundamentales para que la amistad prospere y no se desgaste por malentendidos.",
      score: 2
    },
    work: {
      report: "En el entorno laboral, Cáncer y Sagitario pueden tener dificultades para sincronizar sus estilos. Cáncer prefiere la estabilidad, un ambiente de trabajo seguro y un enfoque más intuitivo. Sagitario busca la variedad, la libertad y un enfoque más visionario y optimista, a veces pasando por alto los detalles. Sagitario puede encontrar a Cáncer demasiado cauteloso o emocional, mientras que Cáncer puede percibir a Sagitario como insensible o poco fiable. El optimismo de Sagitario puede, sin embargo, animar a Cáncer, y la intuición de Cáncer podría guiar la visión de Sagitario si logran comunicarse eficazmente y respetar sus diferencias.",
      score: 2
    }
  },
  "Cancer-Capricorn": {
    love: {
      report: "Cáncer y Capricornio, signos opuestos en el zodiaco, pueden ofrecerse mutuamente aquello de lo que el otro carece, creando una relación de gran potencial y estabilidad. Cáncer, emocional y nutritivo, anhela la estabilidad, la seguridad y la estructura que Capricornio, práctico y ambicioso, puede proporcionar. Capricornio, a su vez, se nutre del afecto, la ternura y el cuidado hogareño que Cáncer ofrece. La reserva emocional de Capricornio puede chocar inicialmente con la necesidad de expresión afectiva de Cáncer. Si Capricornio aprende a abrirse emocionalmente y a valorar el hogar, y Cáncer comprende y apoya la ambición de Capricornio, pueden construir un hogar y una vida juntos muy sólidos y duraderos.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Cáncer y Capricornio se respetan y complementan de manera significativa. Capricornio ofrece estructura, consejos prácticos y una lealtad inquebrantable, mientras que Cáncer brinda apoyo emocional, comprensión y un refugio seguro. Cáncer puede ayudar a Capricornio a relajarse y a conectar con sus emociones, mientras que Capricornio puede dar a Cáncer la seguridad y la dirección que a veces necesita. Es una amistad basada en la lealtad, el apoyo mutuo en los objetivos de vida y una comprensión profunda de las necesidades del otro, aunque sus estilos de expresión sean diferentes.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Cáncer y Capricornio pueden formar un equipo muy efectivo y orientado al éxito a largo plazo. Cáncer aporta intuición, cuidado por el equipo y una dedicación tenaz, mientras que Capricornio ofrece estructura, disciplina, planificación estratégica y una fuerte ambición. Cáncer debe entender y respetar la dedicación de Capricornio al trabajo y sus metas profesionales, y Capricornio debe apreciar la sensibilidad de Cáncer y su capacidad para crear un ambiente de trabajo armonioso. Juntos son constructores natos, capaces de llevar adelante proyectos importantes con solidez y visión.",
      score: 4
    }
  },
  "Cancer-Aquarius": {
    love: {
      report: "Cáncer, el emocional cangrejo, y Acuario, el independiente aguador, pueden tener serias dificultades para conectar a un nivel profundo y satisfactorio en el amor. Cáncer necesita afecto constante, seguridad emocional y un fuerte sentido de pertenencia, mientras que Acuario valora la libertad, la independencia intelectual y tiende a expresar el amor de una forma más desapegada y universal. La necesidad de Cáncer de un hogar seguro y una intimidad profunda puede chocar con el deseo de Acuario de socializar ampliamente y explorar ideas abstractas. Requiere una enorme cantidad de tolerancia, comunicación y una aceptación genuina de las diferencias fundamentales para que esta relación tenga alguna posibilidad de éxito a largo plazo.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Cáncer y Acuario es inusual y a menudo presenta desafíos debido a sus diferentes enfoques de la vida y las relaciones. Cáncer es emocional, hogareño y busca conexiones íntimas, mientras que Acuario es intelectual, sociable y valora la independencia. Acuario puede parecer frío o distante para Cáncer, y Cáncer puede resultar demasiado necesitado o sensible para Acuario. Sin embargo, si logran respetar sus diferencias, pueden ofrecerse perspectivas muy valiosas: Acuario puede ayudar a Cáncer a ver las cosas desde un ángulo más objetivo, y Cáncer puede enseñar a Acuario sobre la importancia de la conexión emocional.",
      score: 2
    },
    work: {
      report: "En el trabajo, Cáncer y Acuario tienen estilos y prioridades muy distintos. Cáncer se guía por la intuición, la lealtad al equipo y la necesidad de un ambiente seguro y armonioso. Acuario se enfoca en la lógica, la innovación, las ideas progresistas y la colaboración en un sentido más amplio. Si logran respetar sus diferentes enfoques, Cáncer puede aportar humanidad, cuidado y tenacidad a los proyectos, mientras que Acuario puede ofrecer originalidad, una visión de futuro y soluciones no convencionales. La comunicación debe ser muy clara para evitar malentendidos y frustraciones, ya que sus métodos y motivaciones pueden ser radicalmente diferentes.",
      score: 2
    }
  },
  "Cancer-Pisces": {
    love: {
      report: "La relación amorosa entre Cáncer y Piscis es mágica, profundamente satisfactoria y llena de una comprensión intuitiva casi telepática. Ambos son signos de agua, lo que significa que comparten una gran sensibilidad, empatía y una profunda necesidad de conexión emocional. Son románticos, cariñosos y se entienden a un nivel anímico que pocos pueden alcanzar. Cáncer ofrece a Piscis la seguridad y el cuidado que necesita, mientras que Piscis colma a Cáncer de afecto, comprensión y un toque de ensueño. Si logran mantener un cable a tierra para no perderse en sus emociones y cultivan una comunicación abierta, su amor será un refugio de paz, ternura y profunda conexión espiritual.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Cáncer y Piscis comparten una conexión emocional e intuitiva excepcional. Son compasivos, leales y se apoyan incondicionalmente en los buenos y malos momentos. Disfrutan de actividades creativas, conversaciones profundas sobre sentimientos y sueños, y de simplemente estar juntos en un ambiente de paz y comprensión. Piscis entiende la sensibilidad de Cáncer, y Cáncer ofrece a Piscis el apoyo y la estructura que a veces necesita. Es una amistad muy tierna, leal y espiritualmente enriquecedora, donde ambos se sienten profundamente comprendidos y cuidados.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Cáncer y Piscis pueden crear un ambiente de trabajo increíblemente inspirador, creativo y empático, especialmente en campos artísticos, de sanación o de ayuda social. Cáncer aporta tenacidad, intuición y cuidado por el equipo, mientras que Piscis ofrece imaginación, visión y una profunda sensibilidad hacia las necesidades de los demás. Se entienden bien y se apoyan mutuamente. Pueden necesitar ayuda con los aspectos más prácticos, la organización o la toma de decisiones difíciles, pero su capacidad para conectar emocionalmente y su creatividad conjunta son una gran fortaleza.",
      score: 4
    }
  },
  "Leo-Virgo": {
    love: {
      report: "Leo, el rey carismático, y Virgo, el perfeccionista práctico, pueden formar una pareja interesante si ambos están dispuestos a apreciar sus diferencias. Leo se siente atraído por la inteligencia, la dedicación y la naturaleza servicial de Virgo, mientras que Virgo admira la confianza, la calidez y la generosidad de Leo. La necesidad de Leo de ser el centro de atención y recibir halagos puede chocar con la modestia y la tendencia crítica de Virgo. Si Leo aprende a apreciar el cuidado y el apoyo práctico de Virgo, y Virgo disfruta del brillo y la alegría que Leo aporta, y si Virgo modera su crítica, pueden construir una relación estable, afectuosa y mutuamente enriquecedora.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Virgo es una combinación de apoyo práctico y admiración mutua, aunque con estilos diferentes. Leo aporta entusiasmo, generosidad y un toque de dramatismo, mientras que Virgo ofrece análisis sensato, ayuda organizada y una lealtad discreta pero firme. Virgo puede ayudar a Leo a mantener los pies en la tierra y a cuidar los detalles, mientras que Leo puede animar a Virgo a relajarse, a divertirse más y a reconocer sus propios talentos. Necesitan paciencia con sus diferentes enfoques: Leo más extrovertido, Virgo más reservado, pero pueden complementarse bien.",
      score: 3
    },
    work: {
      report: "En el trabajo, Leo y Virgo pueden ser un equipo muy efectivo si Leo lidera con carisma e inspiración, y Virgo organiza y ejecuta con meticulosidad y eficiencia. Leo es excelente para la visión general, la motivación y la presentación, mientras que Virgo se destaca en la planificación, el análisis de detalles y la optimización de procesos. Leo debe evitar ser demasiado autoritario o descuidar los detalles, y Virgo no debe ser excesivamente crítico con las ideas más audaces de Leo. Juntos combinan bien el liderazgo inspirador con la ejecución detallada y de alta calidad.",
      score: 4
    }
  },
  "Leo-Libra": {
    love: {
      report: "La relación amorosa entre Leo, el apasionado rey, y Libra, el encantador diplomático, suele ser romántica, socialmente activa y estéticamente agradable. Leo se siente atraído por el encanto, la gracia y el buen gusto de Libra, mientras que Libra admira la confianza, la generosidad y la calidez de Leo. Ambos disfrutan de una vida social activa, de los placeres de la vida y de rodearse de belleza. La armonía es importante para ambos. Si mantienen viva la llama del romance, se admiran mutuamente y Libra ofrece a Leo la atención que necesita sin perder su propia identidad, su unión será brillante, feliz y muy admirada.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Leo y Libra forman una pareja glamurosa, sociable y muy entretenida. Les encanta la diversión, el arte, la cultura y la compañía del otro. Libra, con su diplomacia natural, sabe cómo hacer brillar a Leo y halagar su ego de forma sincera, mientras que Leo aprecia la elegancia, el buen gusto y la compañía agradable de Libra. Suelen tener muchos amigos en común y disfrutan organizando eventos sociales. Es una amistad llena de estilo, admiración mutua, risas y un fuerte componente social.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Leo y Libra son un dúo carismático, diplomático y muy efectivo, especialmente en roles de cara al público, relaciones públicas, eventos o campos creativos. Leo aporta liderazgo inspirador, entusiasmo y una gran presencia, mientras que Libra ofrece estrategia, habilidades de negociación, un excelente sentido estético y la capacidad de crear armonía en el equipo. Juntos pueden ser muy persuasivos y lograr que sus proyectos destaquen. Combinan creatividad con un gran sentido de la presentación y las relaciones interpersonales.",
      score: 4
    }
  },
  "Leo-Scorpio": {
    love: {
      report: "La atracción entre Leo, el león solar, y Escorpio, el magnético escorpión, es eléctrica, intensa y profundamente pasional. Ambos son signos fijos, leales y posesivos con lo que consideran suyo. La necesidad de Leo de admiración constante y de ser el centro de atención puede chocar con la naturaleza más reservada, misteriosa y a veces controladora de Escorpio. Los celos y las luchas de poder pueden ser un problema recurrente si no se manejan con cuidado. Sin embargo, si aprenden a confiar plenamente, a respetar sus diferencias y a canalizar su inmensa energía conjunta de manera constructiva, su relación puede ser transformadora, increíblemente leal y llena de una pasión que pocos pueden igualar.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Escorpio es intensa, poderosa y a menudo muy protectora. Ambos son leales hasta la médula con sus amigos cercanos. Leo admira la fuerza interior, la perspicacia y la determinación de Escorpio, mientras que Escorpio se siente atraído por la generosidad, la confianza y la vitalidad de Leo. Pueden surgir luchas de poder o celos si no hay un respeto mutuo claro,armonicen sus diferentes estilos y objetivos. Sagitario aporta visión, optimismo, entusiasmo y la capacidad de explorar nuevas oportunidades, mientras que Capricornio ofrece estructura, disciplina, planificación estratégica y una fuerte ética de trabajo. La impaciencia de Sagitario puede chocar con la cautela y el enfoque metódico de Capricornio. Necesitan respetar los métodos del otro; Sagitario puede inspirar y generar ideas, mientras Capricornio las organiza y ejecuta con eficiencia. Con buena comunicación, pueden ser un equipo muy productivo.",
      score: 3
    }
  },
  "Sagittarius-Aquarius": {
    love: {
      report: "Sagitario, el explorador, y Acuario, el innovador, disfrutan de una relación amorosa estimulante, divertida y basada en una profunda amistad, el respeto por la independencia y un amor compartido por la libertad y las nuevas ideas. No son posesivos y se dan mucho espacio mutuamente. Su vida social suele ser activa y llena de personas interesantes. Disfrutan de conversaciones intelectuales, aventuras espontáneas y de luchar por causas justas. Es una unión llena de optimismo, originalidad y un deseo constante de aprender y crecer juntos, tanto individualmente como en pareja.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Sagitario y Acuario es una aventura intelectual y social sin fin. Aman la libertad, las nuevas ideas, la honestidad y la exploración de lo desconocido. Se estimulan mutuamente con sus conversaciones originales y su visión progresista del mundo. Se dan mucho espacio, respetan su individualidad y comparten un peculiar sentido del humor. Es una amistad muy divertida, dinámica, sin dramas innecesarios y siempre abierta a nuevas experiencias y personas. Juntos, pueden ser verdaderos agentes de cambio e inspiración.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Sagitario y Acuario forman un dúo increíblemente innovador, visionario y lleno de entusiasmo. Sagitario aporta optimismo, una visión expansiva y la capacidad de explorar nuevas oportunidades, mientras que Acuario ofrece originalidad, ideas vanguardistas y un enfoque humanitario. Disfrutan trabajando en proyectos que desafíen el status quo, que tengan un impacto social o que requieran pensamiento creativo. Se inspiran mutuamente y la comunicación suele ser fluida y directa. Su colaboración puede generar soluciones verdaderamente únicas y progresistas.",
      score: 4
    }
  },
  "Sagittarius-Pisces": {
    love: {
      report: "Sagitario, el arquero optimista, y Piscis, el pez soñador, necesitan una gran dosis de comprensión y adaptación para que su relación amorosa funcione, ya que sus naturalezas son muy diferentes. Sagitario busca aventura, libertad y una honestidad a veces brutal, mientras que Piscis anhela una conexión emocional profunda, empatía y un refugio seguro. Sagitario puede encontrar a Piscis demasiado sensible, evasivo o necesitado, mientras que Piscis puede percibir a Sagitario como insensible, descuidado o poco comprometido. Si Sagitario aprende a ser más tierno y considerado, y Piscis aprende a dar más espacio y a comunicar sus necesidades de forma más directa, pueden encontrar un punto de encuentro en su idealismo y compasión compartidos.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Sagitario y Piscis forman una combinación de optimismo y compasión que puede ser muy especial si logran entenderse. Sagitario, con su energía expansiva, puede animar a Piscis a salir de su mundo interior y a explorar nuevas posibilidades. Piscis, con su profunda empatía, puede ofrecer a Sagitario una perspectiva más sensible y un oído comprensivo. Sin embargo, necesitan esforzarse en la comunicación para evitar malentendidos, ya que la franqueza de Sagitario puede herir la sensibilidad de Piscis, y la naturaleza evasiva de Piscis puede frustrar a Sagitario. Si se aceptan, su amistad puede ser muy inspiradora.",
      score: 3
    },
    work: {
      report: "En el trabajo, Sagitario y Piscis pueden tener dificultades para sincronizar sus estilos si no hay una comunicación clara y mucho respeto mutuo. La franqueza y el enfoque directo de Sagitario pueden herir la sensibilidad de Piscis, quien prefiere un ambiente más armonioso y empático. Sin embargo, la visión optimista y expansiva de Sagitario puede inspirar la creatividad y la imaginación de Piscis. Si logran colaborar, Sagitario puede aportar la energía para iniciar proyectos, mientras Piscis añade el toque artístico y humano. Necesitan roles bien definidos y un entendimiento de sus diferentes necesidades para ser productivos.",
      score: 2
    }
  },
  "Capricorn-Aquarius": {
    love: {
      report: "Capricornio, el tradicionalista, y Acuario, el innovador, pueden encontrar su relación amorosa llena de contrastes y desafíos, pero también de potencial para el crecimiento mutuo. Capricornio busca estabilidad, seguridad y una estructura clara, mientras que Acuario valora la independencia, la libertad intelectual y un enfoque más desapegado y universal del amor. Capricornio puede ver a Acuario como demasiado errático, impredecible o poco práctico, mientras que Acuario puede percibir a Capricornio como demasiado rígido, convencional o controlador. Si Capricornio aprende a abrirse a nuevas ideas y a ser más flexible, y Acuario valora la lealtad, la dedicación y la estructura que Capricornio ofrece, pueden construir una relación basada en el respeto intelectual y una amistad sólida, aunque la conexión emocional profunda requerirá esfuerzo.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Capricornio y Acuario es interesante y a menudo se basa en un respeto mutuo por la inteligencia y la perspectiva única del otro, a pesar de sus diferencias. Capricornio es tradicional, práctico y ambicioso, mientras que Acuario es progresista, idealista y valora la libertad. Acuario puede aportar a Capricornio ideas nuevas y una visión más amplia del mundo, mientras que Capricornio puede ayudar a Acuario a ser más práctico, a estructurar sus ideas y a llevarlas a cabo. Si se respetan y no intentan cambiarse mutuamente, su amistad puede ser estimulante y desafiar las convenciones.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Capricornio y Acuario pueden ser un equipo sorprendentemente efectivo si logran combinar sus fortalezas. Capricornio es excelente para la planificación estratégica, la organización, la gestión de recursos y la ejecución disciplinada, mientras que Acuario aporta ideas innovadoras, una visión de futuro y un enfoque original para resolver problemas. Capricornio puede ayudar a implementar las ideas vanguardistas de Acuario, y Acuario puede inspirar a Capricornio a pensar fuera de lo común y a adaptarse a los cambios. Deben respetar sus diferentes formas de trabajar y comunicarse claramente para evitar frustraciones y aprovechar su potencial complementario.",
      score: 3
    }
  },
  "Capricorn-Pisces": {
    love: {
      report: "La relación amorosa entre Capricornio, el pragmático, y Piscis, el soñador, puede ser tierna, leal y muy complementaria. Capricornio se siente atraído por la naturaleza gentil, compasiva e imaginativa de Piscis, y encuentra en su compañía un refugio emocional que a veces le cuesta encontrar. Piscis, a su vez, admira la fortaleza, la estabilidad y la dedicación de Capricornio, encontrando en él/ella el anclaje a la realidad que necesita. Capricornio ayuda a Piscis a ser más práctico y a materializar sus sueños, mientras que Piscis suaviza la rigidez de Capricornio y le enseña sobre la empatía y la conexión emocional. Es una unión duradera, basada en el cuidado mutuo y un profundo entendimiento.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Capricornio y Piscis se complementan maravillosamente bien, formando un lazo de apoyo y comprensión mutua. Capricornio ofrece a Piscis apoyo práctico, consejos sensatos y una lealtad inquebrantable, mientras que Piscis brinda a Capricornio comprensión emocional, empatía y una perspectiva más sensible y espiritual de la vida. Capricornio puede ayudar a Piscis a no perderse en sus ensueños, y Piscis puede ayudar a Capricornio a relajarse y a conectar con sus sentimientos. Es una amistad sólida, afectuosa y llena de un respeto genuino por las cualidades del otro.",
      score: 4
    },
    work: {
      report: "En el trabajo, Capricornio y Piscis pueden colaborar de manera muy efectiva, combinando la practicidad con la creatividad. Capricornio se encarga de la planificación estratégica, la organización y la ejecución disciplinada, mientras que Piscis aporta visión creativa, intuición y una gran empatía con clientes o compañeros. Capricornio ayuda a Piscis a materializar sus ideas y a mantenerse enfocado en los objetivos, mientras que Piscis puede inspirar a Capricornio, aportar soluciones originales y suavizar la rigidez ocasional de Capricornio con un toque humano. Juntos forman un equipo muy equilibrado y productivo.",
      score: 4
    }
  },
  "Aquarius-Pisces": {
    love: {
      report: "Acuario, el innovador mental, y Piscis, el soñador empático, pueden formar una unión espiritual y compasiva si logran navegar sus diferencias. Acuario se siente atraído por la naturaleza mística, la creatividad y la compasión de Piscis, mientras que Piscis admira la originalidad, la inteligencia y el idealismo humanitario de Acuario. La necesidad de Piscis de una conexión emocional profunda y una fusión casi total puede ser un desafío para el más desapegado e independiente Acuario. Si Acuario aprende a ofrecer más calidez y seguridad emocional, y Piscis respeta la necesidad de Acuario de libertad y espacio intelectual, pueden construir una relación basada en ideales compartidos, una profunda amistad y una conexión espiritual única.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Acuario y Piscis es compasiva, idealista y a menudo muy inspiradora. Acuario aporta ideas innovadoras, una perspectiva progresista y un enfoque en el bien común, mientras que Piscis ofrece sensibilidad, empatía, una rica imaginación y una profunda comprensión de las emociones humanas. Disfrutan de conversaciones profundas sobre temas humanitarios, espirituales o artísticos. Se respetan mutuamente por su visión única del mundo y pueden inspirarse mutuamente a crecer y a contribuir de manera positiva. Es una amistad que valora tanto la mente como el corazón.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Acuario y Piscis pueden ser un equipo increíblemente creativo, intuitivo e inspirador, especialmente en campos artísticos, de sanación, causas sociales o cualquier área que requiera innovación y un toque humano. Acuario aporta ideas originales, una visión de futuro y la capacidad de pensar fuera de lo común, mientras que Piscis ofrece sensibilidad, empatía, una gran imaginación y la capacidad de conectar con las necesidades de los demás. Deben cuidar que la lógica a veces fría de Acuario no choque con la emocionalidad de Piscis, y que la tendencia de Piscis a la evasión no frustre los planes de Acuario. Si logran comunicarse y colaborar en armonía, pueden lograr resultados sorprendentes.",
      score: 3
    }
  }
};

function getGenericCompatibilityReport(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityReportDetail {
  const typeText = type === 'love' ? (locale === 'es' ? 'amorosa' : 'romantic') : (type === 'friendship' ? (locale === 'es' ? 'de amistad' : 'friendship') : (locale === 'es' ? 'laboral' : 'work'));
  let generalNote = `La conexión ${typeText} entre ${sign1} y ${sign2} es única, tejida con los hilos de sus elementos y modalidades distintivas. ${sign1}, con su energía inherente, interactúa con ${sign2}, quien aporta su característica distintiva, creando una dinámica que puede ser tanto complementaria como desafiante para este tipo de relación. Es un encuentro de dos mundos que, con entendimiento, pueden enriquecerse mutuamente. (Este es un informe de compatibilidad general para ${type}. Los detalles específicos pueden variar.)`;
  
  if (locale === 'en') {
    generalNote = `The ${typeText} connection between ${sign1} and ${sign2} is unique, woven with the threads of their distinct elements and modalities. ${sign1}, with its inherent energy, interacts with ${sign2}, who brings their characteristic distinctiveness, creating a dynamic that can be both complementary and challenging for this type of relationship. It's an encounter of two worlds that, with understanding, can enrich each other. (This is a general compatibility report for ${type}. Specific details may vary.)`;
  } else if (locale === 'de') {
    generalNote = `Die ${typeText} Verbindung zwischen ${sign1} und ${sign2} ist einzigartig, gewebt aus den Fäden ihrer unterschiedlichen Elemente und Modalitäten. ${sign1}, mit seiner inhärenten Energie, interagiert mit ${sign2}, der seine charakteristische Besonderheit einbringt, und schafft eine Dynamik, die für diese Art von Beziehung sowohl ergänzend als auch herausfordernd sein kann. Es ist eine Begegnung zweier Welten, die sich mit Verständnis gegenseitig bereichern können. (Dies ist ein allgemeiner Kompatibilitätsbericht für ${type}. Spezifische Details können variieren.)`;
  } else if (locale === 'fr') {
    generalNote = `La connexion ${typeText} entre ${sign1} et ${sign2} est unique, tissée avec les fils de leurs éléments et modalités distincts. ${sign1}, avec son énergie inhérente, interagit avec ${sign2}, qui apporte sa particularité caractéristique, créant une dynamique qui peut être à la fois complémentaire et stimulante pour ce type de relation. C'est une rencontre de deux mondes qui, avec compréhension, peuvent s'enrichir mutuellement. (Ceci est un rapport de compatibilité général pour ${type}. Les détails spécifiques могут varier.)`;
  }


  let baseScore = 3; 
  const selfPairKey = `${sign1}-${sign1}`;
  if (sign1 === sign2 && compatibilityPairings[selfPairKey] && compatibilityPairings[selfPairKey][type]) {
    baseScore = compatibilityPairings[selfPairKey][type].score;
  }

  return {
    report: generalNote,
    score: baseScore 
  };
}

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityData {
  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  let reportData: CompatibilityReportDetail | undefined;

  const pairingTypeData1 = compatibilityPairings[key1];
  if (pairingTypeData1 && pairingTypeData1[type]) {
    reportData = pairingTypeData1[type];
  } else {
    const pairingTypeData2 = compatibilityPairings[key2];
    if (pairingTypeData2 && pairingTypeData2[type]) {
      reportData = pairingTypeData2[type];
    }
  }
  
  if (!reportData) {
    console.warn(`No specific compatibility report found for ${sign1}-${sign2} of type ${type}. Using generic report.`);
    reportData = getGenericCompatibilityReport(sign1, sign2, type, locale);
  }

  return {
    sign1,
    sign2,
    report: reportData.report,
    score: reportData.score,
  };
}

const motivationalPhrases: Record<Locale, string[]> = {
  es: [
    "La fortuna favorece a los audaces.",
    "Cada día es una nueva oportunidad para brillar.",
    "Confía en tu intuición, te guiará sabiamente.",
    "La perseverancia es la clave del éxito.",
    "Siembra pensamientos positivos y cosecharás alegría."
  ],
  en: [
    "Fortune favors the bold.",
    "Every day is a new opportunity to shine.",
    "Trust your intuition, it will guide you wisely.",
    "Perseverance is the key to success.",
    "Sow positive thoughts and you will reap joy."
  ],
  de: [
    "Das Glück bevorzugt die Mutigen.",
    "Jeder Tag ist eine neue Gelegenheit zu glänzen.",
    "Vertraue deiner Intuition, sie wird dich weise führen.",
    "Ausdauer ist der Schlüssel zum Erfolg.",
    "Säe positive Gedanken und du wirst Freude ernten."
  ],
  fr: [
    "La fortune sourit aux audacieux.",
    "Chaque jour est une nouvelle opportunité de briller.",
    "Faites confiance à votre intuition, elle vous guidera sagement.",
    "La persévérance est la clé du succès.",
    "Semez des pensées positives et vous récolterez la joie."
  ]
};

export const getLuckyNumbers = (sign: ZodiacSignName, locale: Locale = 'es'): LuckyNumbersData => {
  const phrases = motivationalPhrases[locale] || motivationalPhrases.es;
  return {
    sign,
    numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
    luckyColor: ["Rojo", "Verde", "Azul", "Amarillo", "Púrpura", "Naranja"][Math.floor(Math.random() * 6)],
    luckyGemstone: ["Diamante", "Esmeralda", "Zafiro", "Rubí", "Amatista", "Topacio"][Math.floor(Math.random() * 6)],
    motivationalPhrase: phrases[Math.floor(Math.random() * phrases.length)],
  };
};

export const getMoonImageUrl = (phaseKey: MoonPhaseKey, size: string = '80x80'): string => {
  const base = 'https://placehold.co';
  const colors = '2D3748/E2E8F0';
  let text = phaseKey.substring(0, 2).toUpperCase();
  if (phaseKey === 'firstQuarter') text = 'FQ';
  if (phaseKey === 'lastQuarter') text = 'LQ';
  if (phaseKey === 'new') text = 'NM';
  if (phaseKey === 'full') text = 'FM';
  if (phaseKey === 'unknown') text = '??';
  return `${base}/${size}/${colors}.png?text=${text}`;
};

export const getMockUpcomingPhases = (dictionary: Dictionary): UpcomingPhase[] => {
  return [
    { nameKey: "MoonPhase.firstQuarter", date: dictionary['UpcomingPhase.sampleDate1'] || "Jun 2", iconUrl: getMoonImageUrl('firstQuarter', '48x48'), phaseKey: "firstQuarter" },
    { nameKey: "MoonPhase.full", date: dictionary['UpcomingPhase.sampleDate2'] || "Jun 9", iconUrl: getMoonImageUrl('full', '48x48'), phaseKey: "full" },
    { nameKey: "MoonPhase.lastQuarter", date: dictionary['UpcomingPhase.sampleDate3'] || "Jun 16", iconUrl: getMoonImageUrl('lastQuarter', '48x48'), phaseKey: "lastQuarter" },
    { nameKey: "MoonPhase.new", date: dictionary['UpcomingPhase.sampleDate4'] || "Jun 23", iconUrl: getMoonImageUrl('new', '48x48'), phaseKey: "new" },
  ];
};

const mapOpenMeteoPhaseToApp = (
  phaseValue: number,
  dictionary: Dictionary
): { phaseName: string; illumination: number; phaseKey: MoonPhaseKey } => {
  let phaseKey: MoonPhaseKey;
  let phaseName: string;
  let illumination: number;

  if (phaseValue <= 0.5) { 
    illumination = Math.round(phaseValue * 2 * 100);
  } else { 
    illumination = Math.round((1 - phaseValue) * 2 * 100);
  }
  illumination = Math.max(0, Math.min(100, illumination)); 

  if (phaseValue < 0.03 || phaseValue > 0.97) {
    phaseKey = "new";
  } else if (phaseValue < 0.22) {
    phaseKey = "waxingCrescent";
  } else if (phaseValue < 0.28) {
    phaseKey = "firstQuarter";
  } else if (phaseValue < 0.47) {
    phaseKey = "waxingGibbous";
  } else if (phaseValue < 0.53) {
    phaseKey = "full";
  } else if (phaseValue < 0.72) {
    phaseKey = "waningGibbous";
  } else if (phaseValue < 0.78) {
    phaseKey = "lastQuarter";
  } else { 
    phaseKey = "waningCrescent";
  }

  phaseName = dictionary[`MoonPhase.${phaseKey}`] || dictionary['MoonPhase.unknown'] || "Unknown Phase";

  return { phaseName, illumination, phaseKey };
};


export const getCurrentLunarData = async (dictionary: Dictionary, locale: Locale = 'es'): Promise<LunarData> => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&daily=moon_phase&timezone=GMT&start_date=${formattedDate}&end_date=${formattedDate}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Open-Meteo API request failed:", response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (data.daily && data.daily.moon_phase && data.daily.moon_phase.length > 0) {
      const phaseValueToday = data.daily.moon_phase[0];
      const { phaseName, illumination, phaseKey } = mapOpenMeteoPhaseToApp(phaseValueToday, dictionary);

      return {
        phase: phaseName,
        phaseKey: phaseKey,
        illumination: illumination,
        currentMoonImage: getMoonImageUrl(phaseKey), 
        upcomingPhases: getMockUpcomingPhases(dictionary), 
      };
    } else {
      console.error("Open-Meteo API response missing expected data:", data);
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error fetching or processing lunar data:", error);
    return {
      phase: dictionary['MoonPhase.unknown'] || "Unknown Phase",
      phaseKey: "unknown",
      illumination: 0,
      currentMoonImage: getMoonImageUrl('unknown'),
      upcomingPhases: getMockUpcomingPhases(dictionary),
      error: (error as Error).message || "Failed to load lunar data",
    };
  }
};


export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData => {
  const month = birthDate.getMonth(); 
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Tu signo ascendente, ${ascendantSign}, influye en tu personalidad externa y cómo te perciben los demás. Juega un papel importante en tus primeras impresiones y reacciones espontáneas. (Explicación de ejemplo en español, para ${birthCity} a las ${birthTime} del ${birthDate.toLocaleDateString()}).`,
  };
};

export const AstroAppLogo = SparklesIcon;
export const WesternAstrologyIcon = StarIcon;
export const ChineseAstrologyIcon = RabbitIcon;
export const MayanAstrologyIcon = FeatherIcon;
export const GalacticTonesIcon = Layers;
export const CompatibilityIcon = HelpCircle; 
export const KinCalculatorIcon = CalculatorIcon;
export const TarotPersonalityTestIcon = HelpCircle; 


export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  { name: "Rat", icon: SparklesIcon, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Agua", description: "Inventiva, ingeniosa, encantadora y persuasiva." },
  { name: "Ox", icon: SparklesIcon, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Tierra", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: SparklesIcon, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Madera", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Madera", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: SparklesIcon, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Tierra", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: SparklesIcon, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fuego", description: "Enigmática, inteligente, sabia e intuitiva." },
  { name: "Horse", icon: SparklesIcon, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fuego", description: "Vivaz, activo, enérgico y le encanta estar entre la multitud." },
  { name: "Goat", icon: SparklesIcon, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931, 2039], element: "Tierra", description: "Amable, de buenos modales, tímida, estable, comprensiva y amigable." },
  { name: "Monkey", icon: SparklesIcon, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932, 2040], element: "Metal", description: "Agudo, inteligente, curioso y travieso." },
  { name: "Rooster", icon: SparklesIcon, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933, 2041], element: "Metal", description: "Observador, trabajador, ingenioso, valiente y talentoso." },
  { name: "Dog", icon: SparklesIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934, 2042], element: "Tierra", description: "Leal, honesto, amable, bondadoso, cauteloso y prudente." },
  { name: "Pig", icon: SparklesIcon, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935, 2043], element: "Agua", description: "Diligente, compasivo, generoso y de trato fácil." },
];
export const ALL_CHINESE_SIGN_NAMES = CHINESE_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];


export const getChineseZodiacSignAndElement = (birthYear: number): ChineseZodiacResult | null => {
  for (const sign of CHINESE_ZODIAC_SIGNS) {
    if (sign.years.includes(birthYear)) {
      return {
        animal: sign.name,
        element: sign.element,
        year: birthYear,
        icon: sign.icon,
      };
    }
  }
  return null;
};

export const getChineseCompatibility = (animal1: ChineseAnimalSignName, animal2: ChineseAnimalSignName): ChineseCompatibilityData => {
  const compatibilityPairings: Record<string, { report: string; score: number }> = {
    "Rat-Dragon": { report: "¡Una combinación excelente! La Rata admira el poder del Dragón, y el Dragón aprecia la astucia de la Rata. Juntos forman un equipo imparable, lleno de éxito y prosperidad.", score: 5 },
    "Rat-Monkey": { report: "Gran compatibilidad. La Rata y el Mono comparten un ingenio similar y disfrutan de la compañía mutua. Su relación es divertida, estimulante y llena de aventuras.", score: 5 },
    "Dragon-Monkey": { report: "Una pareja dinámica y exitosa. El Dragón y el Mono se entienden bien y se motivan mutuamente para alcanzar grandes metas. Ambos son inteligentes y ambiciosos.", score: 5 },
    "Ox-Snake": { report: "Una unión armoniosa y estable. El Buey y la Serpiente comparten valores similares y se respetan profundamente. La Serpiente aporta sabiduría y el Buey, constancia.", score: 5 },
    "Ox-Rooster": { report: "Muy compatibles. El Buey y el Gallo son prácticos, trabajadores y leales. Se complementan bien, creando una relación sólida y segura.", score: 4 },
    "Snake-Rooster": { report: "Excelente compatibilidad intelectual y emocional. La Serpiente y el Gallo se admiran mutuamente por su inteligencia y encanto. Relación elegante y exitosa.", score: 5 },
    "Tiger-Horse": { report: "Una pareja apasionada y aventurera. El Tigre y el Caballo aman la libertad y la emoción. Se entienden instintivamente y se apoyan en sus empresas.", score: 5 },
    "Tiger-Dog": { report: "Gran lealtad y apoyo mutuo. El Perro ofrece al Tigre la comprensión y la calma que necesita, mientras que el Tigre inspira al Perro a ser más audaz.", score: 4 },
    "Horse-Dog": { report: "Una relación feliz y armoniosa. El Caballo y el Perro son honestos, leales y disfrutan de la compañía del otro. Comparten muchos intereses y valores.", score: 5 },
    "Rabbit-Goat": { report: "Muy buena compatibilidad. El Conejo y la Cabra son sensibles, artísticos y disfrutan de la paz y la armonía. Crean un hogar confortable y amoroso.", score: 5 },
    "Rabbit-Pig": { report: "Una pareja encantadora y feliz. El Conejo y el Cerdo son amables, generosos y disfrutan de los placeres simples de la vida. Se cuidan mutuamente.", score: 5 },
    "Goat-Pig": { report: "Relación muy armoniosa y comprensiva. La Cabra y el Cerdo se llevan muy bien, ambos son hogareños y buscan el bienestar del otro. Mucha ternura y afecto.", score: 5 },
    "Rat-Ox": { report: "La Rata y el Buey son amigos secretos, una conexión profunda y entendimiento natural. El Buey ofrece estabilidad a la Rata, y la Rata inspira al Buey. ¡Excelente unión!", score: 5 },
    "Tiger-Pig": { report: "El Tigre y el Cerdo son amigos secretos. El Cerdo admira la valentía del Tigre, y el Tigre aprecia la generosidad del Cerdo. Se equilibran y apoyan.", score: 5 },
    "Rabbit-Dog": { report: "El Conejo y el Perro, amigos secretos, tienen lealtad y confianza profundas. Se protegen y ofrecen consuelo. Muy buena compatibilidad.", score: 5 },
    "Dragon-Rooster": { report: "¡Amigos secretos! El Dragón y el Gallo forman una pareja brillante y exitosa. El Gallo admira la majestuosidad del Dragón, y el Dragón se beneficia de la organización del Gallo. Logran grandes cosas juntos.", score: 5 },
    "Snake-Monkey": { report: "Amigos secretos con conexión astuta. La Serpiente y el Mono se desafían intelectualmente y se divierten. Puede haber juegos de poder, pero la atracción es fuerte.", score: 4 },
    "Horse-Goat": { report: "Amigos secretos, el Caballo y la Cabra se entienden emocionalmente. La Cabra suaviza al Caballo, y el Caballo anima a la Cabra. Relación tierna y solidaria.", score: 5 },
    "Rat-Rabbit": { report: "La Rata y el Conejo pueden ser cordiales, pero necesitarán esfuerzo. La Rata puede encontrar al Conejo demasiado sensible, y el Conejo ver a la Rata como agresiva.", score: 3 },
    "Ox-Tiger": { report: "Relación desafiante. El Buey es conservador y el Tigre impulsivo. Sus diferencias pueden llevar a conflictos sin mucho respeto y comprensión.", score: 2 },
    "Tiger-Snake": { report: "Combinación complicada. El Tigre es abierto y directo, la Serpiente reservada y misteriosa. La desconfianza puede surgir fácilmente.", score: 2 },
    "Dragon-Dog": { report: "Pareja opuesta (Choque). El Dragón es optimista y expansivo, el Perro más cauto y a veces pesimista. Requiere mucho trabajo y compromiso.", score: 1 },
    "Horse-Rooster": { report: "Atracción inicial posible, pero el Caballo independiente y el Gallo crítico pueden chocar. Necesitan paciencia y aceptar diferencias.", score: 2 },
  };
  const key1 = `${animal1}-${animal2}`;
  const key2 = `${animal2}-${animal1}`;

  if (compatibilityPairings[key1]) {
    return { animal1, animal2, ...compatibilityPairings[key1] };
  }
  if (compatibilityPairings[key2]) {
    const result = compatibilityPairings[key2];
    return { animal1, animal2, report: result.report, score: result.score };
  }

  return {
    animal1,
    animal2,
    report: `La compatibilidad entre ${animal1} y ${animal2} tiene sus propios matices únicos. En general, las relaciones entre estos dos signos requieren comprensión y esfuerzo para apreciar las fortalezas de cada uno. (Informe genérico).`,
    score: Math.floor(Math.random() * 3) + 2,
  };
};

const DefaultMayanIcon = HelpCircle; 

export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragón/Cocodrilo - Representa el mar primordial, la fuente de toda vida, abundancia y nuevos comienzos.", detailedInterpretation: "Imix es la energía de la iniciación pura, la nutrición y el sustento maternal. Te invita a confiar en la abundancia del universo y a atreverte a empezar de nuevo. Es un día para conectar con tus instintos más primarios y recordar que todo es posible.", associatedColor: "Rojo" },
  { name: "Ik", icon: DefaultMayanIcon, description: "Viento - Simboliza el viento, el aliento, el espíritu, la fuerza vital, la comunicación y la inspiración.", detailedInterpretation: "Ik es el aliento de vida, la comunicación divina y la verdad. Te impulsa a expresar tu verdad con claridad y a escuchar los mensajes sutiles del espíritu. Es un día para la inspiración, las nuevas ideas y la conexión con lo invisible.", associatedColor: "Blanco" },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Noche/Casa - Significa noche, oscuridad, el inframundo y el cuerpo. Un lugar de misterio, sueños e introspección.", detailedInterpretation: "Akbal te sumerge en el misterio de la oscuridad, el mundo de los sueños y la introspección profunda. Es un tiempo para mirar hacia adentro, encontrar la paz en la quietud y descubrir la abundancia que reside en tu ser interior. Confía en tu intuición.", associatedColor: "Negro/Azul" },
  { name: "Kan", icon: DefaultMayanIcon, description: "Semilla/Lagarto - Representa la semilla, la maduración, la manifestación y el potencial de crecimiento.", detailedInterpretation: "Kan es la semilla del potencial, lista para germinar y florecer. Te recuerda tu capacidad inherente para crecer, madurar y manifestar tus sueños. Es un día para plantar intenciones y enfocarte en tu desarrollo personal y creativo.", associatedColor: "Amarillo" },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpiente - Simboliza la vitalidad, la pasión, el instinto, la fuerza vital y la transformación.", detailedInterpretation: "Chicchan es la fuerza vital pura, la energía kundalini que reside en ti. Te conecta con tus instintos, tu cuerpo y tu pasión por la vida. Es un día para la sanación, la transformación y para honrar la sabiduría de tu cuerpo.", associatedColor: "Rojo" },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Muerte/Transformador/Enlazador de Mundos - Representa la muerte, la transformación, la rendición y el desapego.", detailedInterpretation: "Cimi es el gran transformador, el que enlaza los mundos. Te enseña sobre el desapego, la rendición y la belleza de los ciclos de muerte y renacimiento. Es un día para soltar lo viejo y abrirte a nuevas oportunidades y perspectivas.", associatedColor: "Blanco" },
  { name: "Manik", icon: DefaultMayanIcon, description: "Venado/Mano - Simboliza la finalización, el logro, la sanación y las herramientas espirituales.", detailedInterpretation: "Manik es la mano que sana, la herramienta de la realización y el conocimiento. Te guía hacia la finalización de tus proyectos y te recuerda tu poder de sanar y crear. Es un día para la acción, la generosidad y la manifestación de tus dones.", associatedColor: "Azul/Negro" },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Estrella/Conejo - Representa la estrella, la armonía, la abundancia, la belleza y el arte.", detailedInterpretation: "Lamat es la estrella que brilla con armonía y belleza, atrayendo la abundancia. Te inspira a crear, a encontrar la elegancia en todas las cosas y a multiplicar tus talentos. Es un día para la creatividad, la fertilidad y la apreciación del arte.", associatedColor: "Amarillo" },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Agua/Luna - Simboliza el agua, las emociones, la purificación y el flujo de la vida.", detailedInterpretation: "Muluc es el agua primordial, la esencia de las emociones y la purificación. Te invita a fluir con la vida, a limpiar tus emociones y a recordar tu conexión con la conciencia universal. Es un día para la introspección emocional y la renovación.", associatedColor: "Rojo" },
  { name: "Oc", icon: DefaultMayanIcon, description: "Perro - Representa la lealtad, la compañía, la guía y el amor incondicional.", detailedInterpretation: "Oc es el compañero leal, el guía amoroso que te acompaña en tu camino. Te enseña sobre el amor incondicional, la fidelidad y la importancia de las relaciones verdaderas. Es un día para conectar con tus seres queridos y abrir tu corazón.", associatedColor: "Blanco" },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Mono - Simboliza la alegría, la creatividad, el arte, el juego y la magia.", detailedInterpretation: "Chuen es el artista, el mago, el tejedor de la ilusión y la alegría. Te anima a jugar, a ser creativo y a encontrar la magia en lo cotidiano. Es un día para la espontaneidad, la diversión y la expresión artística.", associatedColor: "Azul/Negro" },
  { name: "Eb", icon: DefaultMayanIcon, description: "Camino/Hierba - Representa el sendero, el viaje, el libre albedrío y la vitalidad.", detailedInterpretation: "Eb es el camino de la vida, el libre albedrío y la vitalidad que surge de la tierra. Te recuerda que tienes el poder de elegir tu sendero y te conecta con la abundancia de la naturaleza. Es un día para tomar decisiones conscientes y agradecer las bendiciones.", associatedColor: "Amarillo" },
  { name: "Ben", icon: DefaultMayanIcon, description: "Caña/Caminante del Cielo - Simboliza los pilares de luz, conectando cielo y tierra, el coraje y la exploración.", detailedInterpretation: "Ben es el caminante del cielo, el pilar que une el cielo y la tierra. Te infunde coraje para explorar nuevos horizontes y expandir tu conciencia. Es un día para el crecimiento, la aventura y la conexión con tu sabiduría interior.", associatedColor: "Rojo" },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Mago - Representa el chamanismo, la magia, la intuición y los misterios del corazón de la tierra.", detailedInterpretation: "Ix es el mago, el jaguar que ve en la oscuridad y conoce los secretos de la tierra. Te conecta con tu intuición, tu poder interior y la magia del universo. Es un día para la introspección, la integridad y la conexión con lo sagrado.", associatedColor: "Blanco" },
  { name: "Men", icon: DefaultMayanIcon, description: "Águila - Simboliza la visión, la ambición, la conciencia superior y la mente colectiva.", detailedInterpretation: "Men es el águila que vuela alto, con una visión clara y una conexión con la conciencia superior. Te inspira a perseguir tus sueños más elevados y a confiar en tu visión. Es un día para la esperanza, la ambición y la expansión mental.", associatedColor: "Azul/Negro" },
  { name: "Cib", icon: DefaultMayanIcon, description: "Buitre/Lechuza/Guerrero - Representa la sabiduría, la introspección, el conocimiento ancestral y el perdón.", detailedInterpretation: "Cib es el guerrero sabio, el que extrae conocimiento de las experiencias pasadas y ancestrales. Te enseña sobre el perdón, la confianza y la capacidad de enfrentar tus miedos. Es un día para la introspección profunda y la conexión con la sabiduría interior.", associatedColor: "Amarillo" },
  { name: "Caban", icon: DefaultMayanIcon, description: "Tierra/Terremoto - Simboliza la tierra, la sincronicidad, la navegación y la evolución.", detailedInterpretation: "Caban es la fuerza de la Tierra, la sincronicidad y la evolución constante. Te ayuda a navegar los cambios de la vida y a mantenerte centrado en tu propósito. Es un día para la alineación, la gratitud por la Madre Tierra y la adaptación.", associatedColor: "Rojo" },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Pedernal/Cuchillo/Espejo - Representa la verdad, la claridad, el discernimiento y el sacrificio.", detailedInterpretation: "Etznab es el espejo de la verdad, el cuchillo que corta la ilusión y trae claridad. Te desafía a enfrentar la verdad, a tomar decisiones con discernimiento y a soltar lo que ya no te sirve. Es un día para la honestidad radical y la auto-reflexión.", associatedColor: "Blanco" },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Tormenta/Lluvia - Simboliza la tormenta, la purificación, la transformación y la renovación.", detailedInterpretation: "Cauac es la tormenta que purifica, transforma y renueva. Te trae la energía necesaria para liberar viejos patrones y catalizar cambios profundos. Es un día para la limpieza energética, la activación y la bienvenida a la transformación.", associatedColor: "Azul/Negro" },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sol/Flor/Señor/Iluminación - Representa la iluminación, el amor incondicional, la totalidad y la conexión con lo divino.", detailedInterpretation: "Ahau es la iluminación, el Sol central, la expresión del amor incondicional y la maestría. Te conecta con tu divinidad interior y te recuerda tu capacidad de irradiar luz y amor. Es un día para la celebración, la gratitud y la unión con el Todo.", associatedColor: "Amarillo" },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];

export const GALACTIC_TONES: GalacticTone[] = [
  { id: 1, nameKey: "Magnetic", keywordKey: "Unity", questionKey: "WhatIsMyGoal", detailedInterpretation: "El Tono Magnético es el inicio, el que atrae el propósito. Unifica todas las partes de tu ser para enfocarte en una meta clara. Hoy pregúntate: ¿Cuál es mi verdadera intención? ¿Qué quiero atraer a mi vida?" },
  { id: 2, nameKey: "Lunar", keywordKey: "Challenge", questionKey: "WhatAreTheObstacles", detailedInterpretation: "El Tono Lunar revela la dualidad y los desafíos. Te ayuda a identificar los obstáculos que necesitas superar para alcanzar tu propósito. Hoy reflexiona: ¿Qué polaridades existen en mi situación? ¿Cuáles son los desafíos que me fortalecen?" },
  { id: 3, nameKey: "Electric", keywordKey: "Service", questionKey: "HowCanIBestServe", detailedInterpretation: "El Tono Eléctrico activa el servicio. Es la energía en movimiento, la chispa que enciende la acción. Te pregunta cómo puedes poner tus talentos al servicio de un propósito mayor. Hoy considera: ¿Cómo puedo activar mis recursos? ¿De qué manera mi servicio beneficia a otros?" },
  { id: 4, nameKey: "SelfExisting", keywordKey: "Form", questionKey: "WhatIsTheFormOfAction", detailedInterpretation: "El Tono Auto-Existente define la forma de la acción. Da estructura y medida a tu propósito. Te ayuda a establecer las bases y a entender cómo manifestar tus ideas. Hoy piensa: ¿Cuál es la forma más efectiva para mi acción? ¿Qué patrones y medidas necesito establecer?" },
  { id: 5, nameKey: "Overtone", keywordKey: "Radiance", questionKey: "HowCanIEmpowerMyself", detailedInterpretation: "El Tono Entonado comanda el esplendor y el poder interior. Reúne los recursos y te da la autoridad para brillar. Hoy enfócate en: ¿Cómo puedo reunir mis fuerzas y recursos? ¿De qué manera irradio mi poder personal?" },
  { id: 6, nameKey: "Rhythmic", keywordKey: "Equality", questionKey: "HowCanIOrganizeForEquality", detailedInterpretation: "El Tono Rítmico organiza para la igualdad y el equilibrio. Te ayuda a encontrar el balance en el flujo de la vida y a administrar los desafíos de manera orgánica. Hoy busca: ¿Cómo puedo equilibrar mi vida y mis acciones? ¿Cómo organizo mi entorno para la armonía?" },
  { id: 7, nameKey: "Resonant", keywordKey: "Attunement", questionKey: "HowCanIAlignMyService", detailedInterpretation: "El Tono Resonante canaliza la sintonización y la inspiración. Te conecta con la fuente de la sabiduría y te permite vibrar en armonía con el universo. Hoy sintoniza con: ¿Qué me inspira verdaderamente? ¿Cómo puedo alinear mi ser con mi propósito más elevado?" },
  { id: 8, nameKey: "Galactic", keywordKey: "Integrity", questionKey: "DoILiveWhatIBelieve", detailedInterpretation: "El Tono Galáctico modela la integridad y la armonía. Te invita a vivir de acuerdo con tus creencias y a actuar con coherencia. Hoy examina: ¿Mis acciones reflejan mis valores? ¿Estoy viviendo en integridad con mi verdad?" },
  { id: 9, nameKey: "Solar", keywordKey: "Intention", questionKey: "HowDoIAchieveMyPurpose", detailedInterpretation: "El Tono Solar pulsa la intención y la realización. Te da el impulso final para manifestar tu propósito y alcanzar tus metas. Hoy pregúntate: ¿Cómo puedo dirigir mi energía hacia la realización de mi intención? ¿Qué pasos concretos debo tomar?" },
  { id: 10, nameKey: "Planetary", keywordKey: "Manifestation", questionKey: "HowDoIPerfectWhatIDo", detailedInterpretation: "El Tono Planetario perfecciona la manifestación. Produce lo que has intencionado, haciendo tangible tu visión. Hoy enfócate en: ¿Cómo puedo mejorar y perfeccionar mi creación? ¿Qué se está manifestando a través de mí?" },
  { id: 11, nameKey: "Spectral", keywordKey: "Liberation", questionKey: "HowDoIReleaseAndLetGo", detailedInterpretation: "El Tono Espectral disuelve y libera. Te ayuda a soltar lo que ya no sirve, a desintegrar viejas estructuras y a abrir espacio para lo nuevo. Hoy considera: ¿Qué necesito liberar en mi vida? ¿Cómo puedo dejar ir las ataduras y limitaciones?" },
  { id: 12, nameKey: "Crystal", keywordKey: "Cooperation", questionKey: "HowCanIDedicateToCooperation", detailedInterpretation: "El Tono Cristal dedica a la cooperación y la universalización. Te enseña a compartir tus dones y a trabajar en conjunto por un bien mayor. Hoy reflexiona: ¿Cómo puedo colaborar con otros? ¿De qué manera mis acciones contribuyen a la comunidad?" },
  { id: 13, nameKey: "Cosmic", keywordKey: "Presence", questionKey: "HowCanIExpandMyJoyAndLove", detailedInterpretation: "El Tono Cósmico trasciende con presencia y perdurabilidad. Es el retorno al origen y la expansión de la conciencia. Te invita a vivir plenamente en el presente y a irradiar amor y alegría. Hoy experimenta: ¿Cómo puedo estar más presente? ¿Cómo expando mi amor y mi alegría sin límites?" },
];


const DREAMSPELL_BASE_DATE_GREGORIAN = new Date(1987, 7 - 1, 26); 
const DREAMSPELL_BASE_KIN_NUMBER = 1; 

function getDaysDifference(date1: Date, date2: Date): number {
  const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = utcDate2 - utcDate1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateMayanKin(birthDate: Date): MayanKinInfo | null {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return null;
  }

  const daysDiff = getDaysDifference(DREAMSPELL_BASE_DATE_GREGORIAN, birthDate);
  const kinIndexToday = ( (DREAMSPELL_BASE_KIN_NUMBER - 1 + daysDiff) % 260 + 260) % 260;
  const kinNumber = kinIndexToday + 1;
  const daySignIndex = kinIndexToday % 20;
  const toneId = (kinIndexToday % 13) + 1;

  const daySign = MAYAN_ZODIAC_SIGNS[daySignIndex];
  const tone = GALACTIC_TONES.find(t => t.id === toneId);

  if (!daySign || !tone) {
    console.error("Error calculating Mayan Kin: Could not find sign or tone for indices.", {daySignIndex, toneId, kinIndexToday, daysDiff});
    return null;
  }

  return { daySign, tone, kinNumber };
}

export const MAJOR_ARCANA_TAROT_CARDS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

export { Briefcase as WorkIcon }; 

    

    