
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
      report: "La amistad entre dos Aries es pura dinamita. Siempre listos para una nueva aventura, un desafío deportivo o un debate apasionado. Se entienden en su necesidad de acción y espontaneidad. Son amigos leales que se defenderán mutuamente con fiereza. Sin embargo, la competitividad puede surgir incluso en la amistad, y las discusiones pueden ser intensas, aunque suelen olvidarse rápidamente. Necesitan aprender a no tomarse las cosas tan a pecho y a celebrar los éxitos del otro sin envidia. Si lo logran, su amistad será una fuente inagotable de diversión y apoyo enérgico.",
      score: 5
    },
    work: {
      report: "Dos Aries trabajando juntos pueden ser increíblemente productivos o un completo desastre, dependiendo de cómo manejen sus egos. Ambos quieren liderar y tomar la iniciativa. Si pueden definir roles claros o trabajar en proyectos separados que luego se unan, el resultado puede ser innovador y rápido. Sin embargo, las luchas de poder son casi inevitables. La comunicación debe ser directa y sin rodeos. La clave está en canalizar su energía competitiva hacia metas comunes en lugar de enfrentarse. Pueden motivarse mutuamente para alcanzar grandes alturas si aprenden a colaborar.",
      score: 3
    }
  },
  "Taurus-Taurus": {
    love: {
      report: "La unión de dos Tauro crea un oasis de estabilidad, sensualidad profunda y un aprecio compartido por los placeres terrenales de la vida. Ambos valoran la seguridad, el confort material, la lealtad incondicional y la belleza en todas sus formas, lo que puede forjar un vínculo increíblemente sólido, predecible y duradero. Disfrutan de la buena comida, los ambientes acogedores, la naturaleza y la tranquilidad de un hogar bien establecido. El principal desafío radica en su mutua terquedad y resistencia al cambio; ambos pueden ser inflexibles en sus posturas, lo que podría llevar a la rutina o al estancamiento si no se esfuerzan conscientemente por introducir novedad, flexibilidad y estímulo en la relación. Si aprenden a ceder en sus posiciones, a comunicarse abiertamente sobre sus necesidades y a motivarse para explorar nuevas experiencias juntos, su amor será un refugio de paz, placer y satisfacción duradera.",
      score: 4
    },
    friendship: {
      report: "Una amistad entre dos Tauro es un pacto de lealtad y confort. Disfrutan de actividades tranquilas, buena comida y conversaciones sobre cosas prácticas. Son amigos en los que se puede confiar, siempre dispuestos a ofrecer apoyo tangible. La terquedad puede ser un problema si ambos se empecinan en un punto de vista, pero su aprecio por la estabilidad suele prevalecer. Es una amistad sólida, aunque puede necesitar un empujón para salir de la rutina y probar cosas nuevas juntos.",
      score: 4
    },
    work: {
      report: "Dos Tauro en el trabajo son sinónimo de perseverancia y resultados concretos. Son trabajadores, metódicos y buscan la calidad. Pueden construir bases sólidas para cualquier proyecto. La desventaja es que pueden ser lentos para adaptarse a los cambios o a nuevas ideas. Su resistencia a salir de la zona de confort puede limitar la innovación si no se gestiona. Sin embargo, su fiabilidad es incuestionable.",
      score: 4
    }
  },
  "Gemini-Gemini": {
    love: {
      report: "Una pareja de Géminis es sinónimo de diversión efervescente, comunicación constante y una mente ágil multiplicada por dos. Ambos son intrínsecamente curiosos, increíblemente versátiles y disfrutan de la variedad, el estímulo intelectual y el juego de palabras. La relación estará repleta de conversaciones interesantes que pueden durar horas, humor ingenioso y una vida social activa y estimulante. Sin embargo, esta misma necesidad imperiosa de cambio, novedad y estimulación mental constante puede llevar a la inconstancia, la superficialidad emocional o una dificultad para profundizar en el compromiso si no se cultiva con intención. Pueden tener dificultades para tomar decisiones definitivas o para comprometerse a largo plazo, temiendo perder su libertad. Si logran encontrar un ancla emocional, aprenden a valorar la profundidad además de la amplitud y se apoyan en su mutua inteligencia y adaptabilidad, pueden ser compañeros de vida increíblemente estimulantes, manteniendo la relación fresca y emocionante.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Géminis es un torbellino de ideas, risas y planes cambiantes. Nunca se aburren juntos, siempre hay algo nuevo que discutir o explorar. Son excelentes compañeros para actividades sociales y aventuras intelectuales. La comunicación es su fuerte. El desafío es la constancia; pueden hacer muchos planes que no siempre se concretan. Necesitan un poco de estructura para que la amistad se mantenga en el tiempo, más allá de la diversión del momento.",
      score: 4
    },
    work: {
      report: "Dos Géminis trabajando juntos son una fuente inagotable de ideas y soluciones creativas. Son adaptables, rápidos para aprender y excelentes comunicadores. Ideales para brainstorming y proyectos que requieran agilidad mental y multitarea. Sin embargo, pueden tener problemas para enfocarse en una sola tarea y llevarla a término. La organización y la definición de prioridades son cruciales para evitar la dispersión y asegurar que las brillantes ideas se materialicen.",
      score: 3
    }
  },
  "Cancer-Cancer": {
    love: {
      report: "Cuando dos Cáncer se encuentran, la conexión emocional es casi instantánea, intuitiva y profundamente conmovedora. Ambos son seres sensibles, cariñosos por naturaleza, protectores con sus seres queridos y valoran el hogar y la familia por encima de casi todo. Esta relación tiene el potencial de ser un verdadero nido de amor, comprensión incondicional y apoyo mutuo inquebrantable. Sin embargo, la extrema sensibilidad de ambos también puede ser un arma de doble filo, llevándolos a herirse fácilmente con palabras o acciones no intencionadas, o a encerrarse en sus caparazones protectores si se sienten amenazados o inseguros. Pueden volverse demasiado dependientes el uno del otro, caer en estados de ánimo fluctuantes que se reflejan mutuamente o tener dificultades para establecer límites saludables. Necesitan aprender a comunicar sus necesidades y vulnerabilidades abiertamente, a manejar los cambios de humor con paciencia y a darse espacio para respirar y recargar energías individualmente. Si lo logran, su hogar será un verdadero santuario de amor y seguridad.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Cáncer es un refugio de comprensión y apoyo emocional. Se entienden sin necesidad de muchas palabras y siempre están ahí el uno para el otro en los momentos difíciles. Disfrutan de actividades hogareñas y conversaciones íntimas. El riesgo es que pueden caer en un círculo de quejas o preocupaciones si no se cuidan. Necesitan animarse mutuamente a salir de su zona de confort y a ver el lado positivo de las cosas. Su lealtad es incondicional.",
      score: 5
    },
    work: {
      report: "Dos Cáncer en el entorno laboral crean un ambiente de trabajo nutritivo y solidario. Son intuitivos con las necesidades del equipo y se preocupan por el bienestar general. Pueden ser muy dedicados a proyectos que tengan un componente humano o de cuidado. Sin embargo, pueden tomarse las críticas de forma muy personal y su estado de ánimo puede afectar la productividad. Necesitan aprender a separar lo personal de lo profesional y a ser más objetivos en la toma de decisiones.",
      score: 3
    }
  },
  "Leo-Leo": {
    love: {
      report: "Una pareja de Leo es un espectáculo de carisma deslumbrante, pasión ardiente y generosidad sin límites. Ambos son extrovertidos por naturaleza, inherentemente creativos y aman ser el centro de atención y recibir admiración. La relación estará llena de drama (en el buen sentido), romance apasionado, grandes gestos y una celebración constante de la vida. Se entienden perfectamente en su necesidad de brillar y ser reconocidos. El mayor desafío, sin duda, son sus egos magnificados: las luchas por el protagonismo, el orgullo herido y la necesidad de tener siempre la razón pueden ser frecuentes e intensas. Necesitan aprender a compartir el escenario con gracia, a aplaudirse mutuamente con sinceridad y a manejar sus egos con humildad y respeto. Si logran este delicado equilibrio, su amor será una celebración constante, digna de la realeza, llena de lealtad, diversión y una pasión que ilumina todo a su alrededor.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Leo es grandiosa y llena de diversión. Les encanta organizar fiestas, ser el alma de cualquier reunión y apoyarse mutuamente en sus ambiciones. Son amigos generosos que disfrutan celebrando los éxitos del otro (siempre que no opaque demasiado el propio). El orgullo puede ser un problema; necesitan aprender a pedir disculpas y a ceder. Si logran compartir el centro de atención, su amistad será leal, inspiradora y muy entretenida.",
      score: 4
    },
    work: {
      report: "Dos Leo trabajando juntos pueden lograr grandes cosas o chocar espectacularmente. Ambos tienen dotes de liderazgo y aman ser reconocidos. Si pueden colaborar y compartir los laureles, su energía combinada puede ser muy motivadora y creativa. El problema surge cuando ambos quieren ser el único jefe. Necesitan roles bien definidos y un respeto mutuo por sus talentos. Si lo consiguen, el proyecto brillará.",
      score: 3
    }
  },
  "Virgo-Virgo": {
    love: {
      report: "Dos Virgo juntos forman una pareja sumamente práctica, organizada hasta el último detalle y mentalmente estimulante. Ambos son inteligentes, analíticos por naturaleza, perfeccionistas y tienen altos estándares para sí mismos y para los demás. Se entienden profundamente en su necesidad de orden, eficiencia y mejora constante. Pueden ser excelentes compañeros de trabajo y de vida, apoyándose mutuamente en sus metas, disfrutando de conversaciones detalladas y construyendo una vida funcional y bien estructurada. Sin embargo, la tendencia innata de Virgo a la crítica, aunque a menudo bien intencionada, puede volverse en su contra, con ambos analizándose y criticándose mutuamente en exceso, lo que puede generar tensión y resentimiento. Necesitan cultivar la tolerancia, la calidez emocional, aprender a relajarse juntos y a disfrutar de la vida sin buscar la perfección en cada aspecto. Si logran esto, su relación será estable, de apoyo mutuo y muy productiva.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Virgo se basa en el intelecto, el apoyo práctico y una comprensión mutua de la necesidad de orden. Son amigos serviciales, siempre dispuestos a ayudar con un problema o a dar un consejo bien analizado. Disfrutan de conversaciones inteligentes y de actividades que impliquen aprendizaje. La crítica excesiva puede ser un problema si no se maneja con cuidado. Necesitan recordarse mutuamente que no todo tiene que ser perfecto para ser disfrutado.",
      score: 4
    },
    work: {
      report: "Dos Virgo en un equipo de trabajo son la definición de eficiencia y atención al detalle. Son meticulosos, organizados y buscan la perfección en cada tarea. Pueden ser increíblemente productivos juntos. El riesgo es que pueden perderse en los detalles y ser demasiado críticos entre sí o con el trabajo de los demás. Necesitan aprender a delegar y a aceptar que 'suficientemente bueno' a veces es mejor que 'perfecto pero tarde'.",
      score: 5
    }
  },
  "Libra-Libra": {
    love: {
      report: "Una relación entre dos Libra está impregnada de encanto, diplomacia natural, un aprecio por la belleza en todas sus formas y un profundo deseo innato de armonía y equilibrio. Ambos son sociables, amantes del arte, la cultura y las interacciones refinadas, y buscan el equilibrio y la justicia en todas las situaciones. Disfrutarán creando un entorno estéticamente agradable, de una vida social activa y elegante, y de conversaciones civilizadas. Se entienden perfectamente en su aversión al conflicto y su búsqueda de la paz. El problema surge cuando ambos evitan tomar decisiones difíciles o confrontar problemas subyacentes por miedo a alterar esa preciada armonía. La indecisión y la procrastinación pueden ser grandes obstáculos. Si aprenden a ser más asertivos individualmente, a comunicar sus necesidades de manera directa pero amable y a enfrentar los desacuerdos de manera constructiva, pueden crear una unión verdaderamente hermosa, equitativa y llena de gracia.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Libra es elegante, sociable y siempre en busca de la armonía. Disfrutan de actividades culturales, conversaciones interesantes y de crear un ambiente agradable. Son amigos diplomáticos que evitan el conflicto. La indecisión puede ser un problema a la hora de hacer planes. Necesitan animarse mutuamente a tomar partido de vez en cuando y a no temer los desacuerdos, ya que pueden ser constructivos.",
      score: 4
    },
    work: {
      report: "Dos Libra trabajando juntos aportan un gran sentido de la estética, la diplomacia y la capacidad de negociación. Son excelentes para crear un ambiente de trabajo armonioso y para tratar con clientes. Sin embargo, la toma de decisiones puede ser lenta y pueden evitar abordar problemas difíciles por miedo al conflicto. Necesitan un líder claro o roles definidos para ser más efectivos y no caer en la procrastinación.",
      score: 3
    }
  },
  "Scorpio-Scorpio": {
    love: {
      report: "Cuando dos Escorpio se unen, la intensidad es palpable, la pasión electrizante y la conexión emocional puede alcanzar profundidades insondables y transformadoras. Ambos son ferozmente leales, magnéticos, intuitivos y buscan una fusión casi total con su pareja, anhelando trascender los límites superficiales. La comprensión intuitiva entre ellos es a menudo muy fuerte, casi telepática. Sin embargo, esta misma intensidad puede ser su mayor desafío, llevando a luchas de poder titánicas, celos arraigados y una posesividad extrema que puede resultar asfixiante. Ambos necesitan tener el control y pueden ser muy reservados con sus secretos, lo que dificulta la confianza plena. La confianza absoluta es fundamental, pero difícil de alcanzar si las sospechas o los juegos mentales entran en escena. Si logran trascender sus miedos más profundos, practicar la vulnerabilidad y canalizar su poderosa energía conjunta hacia la creación, la sanación mutua y la confianza incondicional, su vínculo será indestructible y profundamente spiritual, capaz de resistir cualquier tormenta.",
      score: 3
    },
    friendship: {
      report: "Una amistad entre dos Escorpio es profunda, leal y a menudo secreta. Se entienden a un nivel que pocos pueden alcanzar y guardarán los secretos del otro hasta la tumba. Son amigos intensos y protectores. El problema surge si la desconfianza o los celos entran en juego. Las luchas de poder pueden ser sutiles pero feroces. Si se basan en la honestidad total, su amistad será inquebrantable y transformadora.",
      score: 4
    },
    work: {
      report: "Dos Escorpio en el trabajo son una fuerza a tener en cuenta. Son estratégicos, determinados y no se detienen ante nada para lograr sus objetivos. Pueden ser excelentes investigadores o estrategas. Sin embargo, las luchas por el control son casi seguras. La competencia puede ser feroz. Necesitan tener metas muy claras y un respeto absoluto por el poder del otro. Si logran trabajar en equipo, son imparables.",
      score: 3
    }
  },
  "Sagittarius-Sagittarius": {
    love: {
      report: "Una pareja de Sagitario es una aventura constante, un torbellino de optimismo contagioso, humor inteligente y un insaciable deseo de explorar el mundo, las ideas y el conocimiento. Ambos son ferozmente independientes, brutalmente honestos (a veces demasiado) y aman la libertad por encima de todo. Su relación será espontánea, llena de risas, viajes inesperados y una búsqueda compartida de la verdad y el significado. Se entienden instintivamente en su necesidad de espacio personal y crecimiento individual. La pasión es alta y la vida juntos nunca es aburrida ni predecible. El desafío principal puede ser el compromiso a largo plazo y la atención a los detalles prácticos de la vida cotidiana, ya que ambos pueden ser reacios a establecerse o a enfrentar responsabilidades que perciben como limitantes. Sin embargo, si encuentran un propósito común que los inspire, aprenden a valorar la estabilidad junto con la aventura y cultivan la confianza mutua, su viaje juntos será una experiencia inolvidable y expansiva.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Sagitario es una fiesta sin fin. Llenos de optimismo, humor y sed de aventura, siempre están listos para explorar algo nuevo, ya sea un lugar, una idea o una filosofía. Se dan mutuamente mucha libertad y se entienden en su necesidad de espacio. La honestidad es total, a veces brutal. El único riesgo es que pueden ser un poco inconsistentes con los planes. Su amistad es divertida, inspiradora y siempre en movimiento.",
      score: 5
    },
    work: {
      report: "Dos Sagitario trabajando juntos aportan entusiasmo, visión y una mentalidad abierta. Son excelentes para generar ideas, explorar nuevas posibilidades y motivar al equipo. Sin embargo, pueden pasar por alto los detalles importantes y tener dificultades para llevar los proyectos a su conclusión. Necesitan a alguien más práctico que les ayude a concretar sus grandes planes. Su optimismo es contagioso, pero deben cuidar la falta de realismo.",
      score: 3
    }
  },
  "Capricorn-Capricorn": {
    love: {
      report: "Dos Capricornio juntos forman una pareja poderosa, sumamente ambiciosa y muy enfocada en construir un futuro sólido, seguro y respetable. Ambos son trabajadores incansables, disciplinados hasta la médula, prácticos y valoran la tradición, el estatus y los logros tangibles. Se respetan mutuamente por su determinación férrea, su resiliencia y su capacidad para alcanzar metas a largo plazo. Pueden ser un equipo formidable en los negocios y en la vida, construyendo un imperio ladrillo a ladrillo. Sin embargo, la relación puede volverse excesivamente seria, competitiva o centrada en el trabajo y las responsabilidades, descuidando la parte emocional, la espontaneidad y la diversión. Necesitan aprender a relajarse juntos, a expresar su afecto (que suele ser profundo pero poco demostrado) y a celebrar y disfrutar de los logros, no solo a planificarlos meticulosamente. Si logran encontrar ese equilibrio, su unión será de una solidez y lealtad inquebrantables.",
      score: 3
    },
    friendship: {
      report: "La amistad entre dos Capricornio se basa en el respeto mutuo, la ambición compartida y un enfoque práctico de la vida. Son amigos leales que se apoyan en sus metas profesionales y personales. Pueden parecer serios, pero su humor es sutil y aprecian la compañía del otro. El riesgo es que la amistad puede volverse demasiado formal o centrada en los logros. Necesitan encontrar tiempo para relajarse y disfrutar de actividades más lúdicas.",
      score: 4
    },
    work: {
      report: "Dos Capricornio en el trabajo son una combinación de poder y eficiencia. Ambos son ambiciosos, trabajadores y muy organizados. Pueden lograr metas impresionantes juntos, construyendo estructuras sólidas y duraderas. El peligro es que pueden ser demasiado competitivos entre sí o volverse excesivamente rígidos. Necesitan reconocer los logros del otro y estar abiertos a diferentes enfoques para mantener un ambiente productivo.",
      score: 5
    }
  },
  "Aquarius-Aquarius": {
    love: {
      report: "Una relación entre dos Acuario es intelectualmente estimulante, deliciosamente poco convencional y firmemente basada en una fuerte amistad, ideales compartidos y un profundo respeto por la individualidad y la libertad del otro. Ambos son progresistas, humanitarios, originales hasta la excentricidad y valoran la libertad por encima de casi cualquier otra cosa. Disfrutarán de conversaciones fascinantes que pueden durar toda la noche, proyectos innovadores con un toque social y una vida social activa y llena de personas interesantes y diversas. La conexión emocional puede ser un desafío, ya que ambos tienden a ser algo desapegados, cerebrales y a racionalizar sus sentimientos en lugar de expresarlos abiertamente. Necesitan hacer un esfuerzo consciente por cultivar la intimidad, la calidez y la vulnerabilidad emocional. Si lo logran, su unión será única, libre de posesividad, llena de inspiración mutua y verdaderamente vanguardista.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Acuario es una conexión de mentes brillantes e ideales compartidos. Son amigos que se entienden en su necesidad de independencia y en su visión progresista del mundo. Disfrutan de debates intelectuales, proyectos humanitarios y de explorar lo no convencional. La amistad es más cerebral que emocional, pero muy leal. Se dan mucho espacio y se respetan mutuamente. Suelen tener un círculo de amigos amplio y diverso.",
      score: 5
    },
    work: {
      report: "Dos Acuario trabajando juntos son una fuerza innovadora y visionaria. Aportan ideas originales, un enfoque humanitario y una mentalidad de equipo. Son excelentes para proyectos que requieran pensamiento fuera de lo común y soluciones creativas. Sin embargo, pueden ser algo rebeldes con las estructuras establecidas y tener dificultades con los detalles prácticos. Necesitan libertad para experimentar, pero también un ancla a la realidad.",
      score: 4
    }
  },
  "Pisces-Pisces": {
    love: {
      report: "Cuando dos Piscis se unen, se crea un mundo de ensueño, compasión infinita y una profunda conexión espiritual que trasciende lo ordinario. Ambos son increíblemente sensibles, intuitivos hasta el punto de la telepatía, románticos empedernidos y con una vena artística muy desarrollada. Se entienden a un nivel anímico y disfrutan escapando juntos de la dureza y la mundaneidad de la realidad, refugiándose en su mundo interior compartido. Su amor puede ser increíblemente tierno, sanador y lleno de empatía. El principal desafío es que ambos pueden ser demasiado idealistas, evasivos ante los problemas o perderse en sus emociones y fantasías, descuidando los aspectos prácticos y las responsabilidades de la vida. Necesitan encontrar un ancla que los mantenga con los pies en la tierra, aprender a establecer límites saludables y a enfrentar los problemas de manera directa en lugar de huir de ellos. Si lo hacen, su relación será un refugio mágico de amor incondicional, creatividad y profunda conexión espiritual.",
      score: 4
    },
    friendship: {
      report: "La amistad entre dos Piscis es un vínculo de almas gemelas, lleno de empatía, comprensión y apoyo incondicional. Se entienden a un nivel intuitivo y comparten un mundo interior rico y creativo. Son amigos compasivos que siempre están ahí para escuchar y consolar. El riesgo es que pueden perderse juntos en sus ensueños o evadir los problemas. Necesitan animarse mutuamente a enfrentar la realidad y a ser un poco más prácticos.",
      score: 5
    },
    work: {
      report: "Dos Piscis trabajando juntos pueden ser increíblemente creativos e inspiradores, especialmente en campos artísticos o de ayuda. Aportan una gran sensibilidad y empatía al entorno laboral. Sin embargo, pueden tener dificultades con la organización, los plazos y los aspectos más prácticos del trabajo. Necesitan un entorno que valore su intuición y creatividad, pero también algo de estructura para mantenerse enfocados. Son muy buenos para el trabajo en equipo si se sienten comprendidos.",
      score: 3
    }
  },
  "Aries-Taurus": {
    love: {
      report: "Aries y Tauro en el amor pueden ser un desafío, pero con potencial. La pasión de Aries choca con la calma de Tauro. Aries busca aventura, Tauro seguridad. Aries debe ser más paciente, y Tauro más flexible. Si logran equilibrar la impulsividad ariana con la sensualidad taurina, pueden construir algo duradero. Tauro ofrece estabilidad, Aries emoción. La clave es la comunicación y el respeto por sus ritmos diferentes.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Aries y Tauro pueden complementarse. Aries empuja a Tauro a la acción, y Tauro ayuda a Aries a ser más constante. Aries valora la lealtad de Tauro, y Tauro la energía de Aries. Pueden chocar por la terquedad de Tauro o la impaciencia de Aries. Si se respetan, pueden ser amigos sólidos que se ofrecen diferentes perspectivas.",
      score: 3
    },
    work: {
      report: "En el trabajo, Aries y Tauro pueden ser un buen equipo. Aries inicia con entusiasmo, y Tauro sigue con perseverancia para asegurar la calidad. Aries debe respetar la necesidad de Tauro de analizar, y Tauro debe apreciar la rapidez de Aries. Juntos pueden cubrir el inicio y la finalización de proyectos, pero necesitan definir bien sus roles para evitar frustraciones.",
      score: 4
    }
  },
  "Aries-Gemini": {
    love: {
      report: "La relación amorosa entre Aries y Géminis es vivaz, divertida y llena de estímulos. Aries admira la inteligencia de Géminis, y Géminis se siente atraído por la pasión de Aries. Disfrutan de la aventura y la conversación. El desafío es mantener el interés a largo plazo y profundizar el compromiso emocional. Necesitan confianza y espacio para sus intereses individuales.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Aries y Géminis son dinamita pura. Siempre listos para una nueva aventura, un debate estimulante o simplemente para divertirse. La comunicación es su fuerte. Se entienden en su amor por la novedad. El único riesgo es que pueden ser algo inconsistentes. Una amistad llena de risas y exploración mental.",
      score: 5
    },
    work: {
      report: "Aries y Géminis en el trabajo son un torbellino de creatividad. Aries impulsa y Géminis idea y comunica. Son excelentes para el brainstorming y proyectos ágiles. Pueden dispersarse si no hay enfoque claro, pero su entusiasmo conjunto suele ser contagioso. Aries debe ser paciente con la naturaleza cambiante de Géminis.",
      score: 4
    }
  },
  "Aries-Cancer": {
    love: {
      report: "Aries y Cáncer en el amor son como el día y la noche. La franqueza de Aries puede herir la sensibilidad de Cáncer. Cáncer puede parecer demasiado dependiente para el independiente Aries. Aries necesita ser más tierno y Cáncer más comprensivo con la autonomía de Aries. Si construyen un puente de afecto, pueden aprender mucho el uno del otro.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Aries y Cáncer requiere comprensión. Aries es directo, Cáncer sensible. Aries puede ofrecer protección, Cáncer cuidado. Si Aries aprende a ser más delicado y Cáncer a no tomar todo personal, pueden tener una amistad protectora, aunque con altibajos emocionales.",
      score: 2
    },
    work: {
      report: "En el trabajo, Aries y Cáncer pueden chocar. Aries es rápido, Cáncer cauteloso. Aries puede impulsar a Cáncer a tomar riesgos, y Cáncer puede aportar intuición. El respeto por sus diferentes estilos es fundamental. Aries debe valorar la necesidad de seguridad de Cáncer en el entorno laboral.",
      score: 3
    }
  },
  "Aries-Leo": {
    love: {
      report: "La relación amorosa entre Aries y Leo es ardiente, dramática y muy divertida. Hay admiración mutua y gran atracción física. Ambos son generosos. Los conflictos pueden surgir por orgullo o querer dominar. Si logran compartir el protagonismo, su relación será una celebración constante, llena de lealtad y pasión.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Aries y Leo son una pareja real. Les encanta la diversión, la aventura y apoyarse mutuamente. Son leales y generosos. El orgullo puede ser un problema, pero su energía combinada es magnética. Una amistad llena de brillo y lealtad.",
      score: 5
    },
    work: {
      report: "Aries y Leo trabajando juntos son un equipo imparable si coordinan sus egos. Aries inicia, Leo da el toque de carisma y creatividad. Irradian confianza. El desafío es evitar luchas de poder. Si definen roles, el éxito está asegurado. Mucha energía y motivación.",
      score: 4
    }
  },
   "Aries-Virgo": {
    love: {
      report: "Aries y Virgo en el amor pueden tener dificultades para entenderse. Aries es impulsivo y pasional, Virgo es práctico y reservado. Aries puede ver a Virgo como frío, y Virgo a Aries como imprudente. Sin embargo, Virgo puede ofrecer estabilidad y Aries puede animar a Virgo. Requiere paciencia y comunicación.",
      score: 2
    },
    friendship: {
      report: "Una amistad entre Aries y Virgo es de contrastes. Aries aporta energía y Virgo análisis. Virgo puede ayudar a Aries a ser más organizado, y Aries puede sacar a Virgo de su rutina. Si se respetan, pueden aprender mucho el uno del otro. Aries debe valorar los consejos prácticos de Virgo.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Aries inicia con entusiasmo y Virgo organiza con detalle. Pueden complementarse bien si Aries respeta la meticulosidad de Virgo, y Virgo la iniciativa de Aries. Aries es el motor, Virgo el planificador. Buena combinación para resultados concretos si se comunican bien.",
      score: 3
    }
  },
  "Aries-Libra": {
    love: {
      report: "Aries y Libra son opuestos que se atraen poderosamente en el amor. La impulsividad de Aries puede chocar con la indecisión de Libra. Aries admira el encanto de Libra, y Libra la confianza de Aries. Si aprenden a negociar y valorar sus diferencias, pueden disfrutar de una relación equilibrada y apasionada.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Aries y Libra se equilibran. Aries empuja a la acción, Libra busca la armonía. Libra puede suavizar a Aries, y Aries puede ayudar a Libra a decidirse. Disfrutan de actividades sociales juntos. Una amistad estimulante donde ambos aprenden.",
      score: 4
    },
    work: {
      report: "En el trabajo, Aries y Libra forman una excelente sociedad. Aries aporta energía y decisión, Libra diplomacia y estrategia. Aries puede ayudar a Libra a actuar, y Libra a Aries a considerar otras perspectivas. El desafío es equilibrar la independencia de Aries con el deseo de colaboración de Libra.",
      score: 4
    }
  },
  "Aries-Scorpio": {
    love: {
      report: "La atracción entre Aries y Escorpio es magnética y poderosa en el amor. Ambos son apasionados y directos. Aries debe aprender a manejar la naturaleza posesiva de Escorpio, y Escorpio debe dar a Aries espacio. Si construyen confianza, la relación puede ser transformadora y muy profunda.",
      score: 3
    },
    friendship: {
      report: "Aries y Escorpio como amigos son leales y protectores. Aries admira la profundidad de Escorpio, y Escorpio la valentía de Aries. Pueden tener enfrentamientos intensos, pero su lealtad es fuerte. Una amistad de extremos, con mucha pasión y defensa mutua.",
      score: 3
    },
    work: {
      report: "En el trabajo, Aries y Escorpio pueden chocar por el control, pero si unen fuerzas, su determinación combinada es imparable. Aries aporta la chispa, Escorpio la estrategia. Necesitan respetar sus diferentes enfoques y compartir el liderazgo para lograr grandes cosas.",
      score: 4
    }
  },
  "Aries-Sagittarius": {
    love: {
      report: "Aries y Sagitario disfrutan de una relación amorosa llena de diversión, risas y aventura. Se entienden instintivamente y se dan el espacio que necesitan. La honestidad y la independencia son valores compartidos. Si encuentran un propósito común y cultivan la confianza, su unión será una fuente constante de alegría e inspiración.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Aries y Sagitario es una fiesta continua. Siempre listos para una nueva aventura, se entienden en su amor por la libertad. Su honestidad es total. Una amistad divertida, inspiradora y siempre en movimiento.",
      score: 5
    },
    work: {
      report: "Aries y Sagitario en el trabajo forman un equipo entusiasta e innovador. Aries inicia con audacia, Sagitario expande con visión. Pueden ser impacientes o pasar por alto detalles. Necesitan un ancla de realidad para sus grandes ideas, pero su energía es contagiosa.",
      score: 4
    }
  },
  "Aries-Capricorn": {
    love: {
      report: "En el amor, Aries y Capricornio tienen necesidades diferentes. Aries busca pasión, Capricornio estabilidad. Aries puede ver a Capricornio como frío, y Capricornio a Aries como inmaduro. Si Aries aprecia la dedicación de Capricornio, y Capricornio se abre a la calidez de Aries, pueden construir una relación que requiere mucho trabajo y madurez.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Aries y Capricornio se respetan por su fuerza. Capricornio puede ofrecer consejos prácticos y Aries puede animar a Capricornio a divertirse. Pueden chocar por sus diferentes ritmos, pero la amistad puede ser sólida si se aceptan. Aries aprende disciplina, Capricornio espontaneidad.",
      score: 3
    },
    work: {
      report: "Aries y Capricornio trabajando juntos pueden lograr mucho si respetan sus roles. Aries es el motor de arranque, Capricornio el estratega. La impaciencia de Aries puede chocar con la cautela de Capricornio. Si combinan la acción de Aries con la planificación de Capricornio, son muy efectivos.",
      score: 4
    }
  },
  "Aries-Aquarius": {
    love: {
      report: "Aries y Acuario disfrutan de una relación amorosa basada en la amistad, la libertad y el estímulo intelectual. No hay lugar para los celos. Ambos valoran su independencia. La conexión emocional puede necesitar atención. Si cultivan la calidez, su relación será única y duradera.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Aries y Acuario es dinámica e innovadora. Comparten un amor por la libertad y las nuevas ideas. Aries impulsa, Acuario inventa. Son amigos que se estimulan mutuamente y respetan su individualidad. Una amistad llena de sorpresas y aventuras intelectuales.",
      score: 5
    },
    work: {
      report: "En el trabajo, Aries y Acuario son un dúo dinámico que puede generar ideas revolucionarias. Aries aporta energía, Acuario visión original. Disfrutan rompiendo moldes. El desafío es mantener el enfoque y llevar las ideas a la práctica. Mucha creatividad e independencia.",
      score: 4
    }
  },
  "Aries-Pisces": {
    love: {
      report: "Aries y Piscis en el amor es una mezcla de fuego y agua. La rudeza de Aries puede herir al sensible Piscis. La evasividad de Piscis puede frustrar a Aries. Aries necesita cultivar ternura, y Piscis expresar sus necesidades. Con amor y comprensión, pueden crear una relación mágica y sanadora.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Aries y Piscis pueden ofrecerse mucho. Aries protege a Piscis, y Piscis ofrece compasión a Aries. Aries puede ayudar a Piscis a ser más asertivo, y Piscis puede enseñar a Aries sobre la empatía. Una amistad de contrastes pero con potencial de crecimiento mutuo.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Aries y Piscis tienen enfoques diferentes. Aries lidera con acción, Piscis con imaginación. Si colaboran, Aries puede ayudar a Piscis a materializar ideas, y Piscis puede aportar creatividad. La comunicación clara es vital para evitar malentendidos y aprovechar sus fortalezas.",
      score: 3
    }
  },
  "Taurus-Gemini": {
    love: {
      report: "Tauro y Géminis en el amor requieren comprensión. Tauro valora la sensualidad, Géminis el estímulo intelectual. Tauro puede encontrar a Géminis inconstante, y Géminis a Tauro posesivo. Si Tauro aprecia la chispa de Géminis, y Géminis valora la lealtad de Tauro, pueden encontrar un punto medio enriquecedor.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Tauro y Géminis puede ser divertida. Géminis aporta variedad y Tauro estabilidad. Géminis puede sacar a Tauro de su rutina, y Tauro puede ofrecer a Géminis un ancla. Disfrutan de conversaciones y actividades diversas. Necesitan respetar sus diferentes ritmos.",
      score: 3
    },
    work: {
      report: "En el trabajo, Tauro y Géminis pueden complementarse. Tauro aporta constancia, Géminis adaptabilidad. Tauro puede ayudar a Géminis a enfocarse, y Géminis a evitar que Tauro se estanque. La comunicación es clave para armonizar sus diferentes estilos y ritmos de trabajo.",
      score: 3
    }
  },
  "Taurus-Cancer": {
    love: {
      report: "Tauro y Cáncer en el amor tienen una alta compatibilidad. Ambos son sensuales, afectuosos y buscan una relación segura. Tauro ofrece estabilidad a Cáncer, y Cáncer colma a Tauro de cariño. Disfrutan creando un hogar acogedor. Una unión tierna, leal y profundamente satisfactoria.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Tauro y Cáncer es cálida y reconfortante. Ambos valoran la lealtad y la seguridad. Disfrutan de actividades tranquilas y hogareñas. Son amigos en los que se puede confiar plenamente. Una amistad sólida y duradera, basada en el afecto y el cuidado mutuo.",
      score: 5
    },
    work: {
      report: "Tauro y Cáncer trabajan bien juntos, creando un ambiente estable y nutritivo. Tauro aporta practicidad, Cáncer intuición. Son capaces de construir proyectos sólidos y duraderos, basados en la confianza mutua y el cuidado por los detalles y el equipo.",
      score: 4
    }
  },
  "Taurus-Leo": {
    love: {
      report: "Tauro y Leo en el amor comparten un gusto por los placeres y una naturaleza apasionada. Leo admira la solidez de Tauro, y Tauro la generosidad de Leo. La necesidad de Leo de ser el centro de atención puede chocar con la reserva de Tauro. La terquedad de ambos puede llevar a discusiones. Si ceden, pueden construir una relación suntuosa y leal.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Tauro y Leo son leales y generosos. Disfrutan de las cosas buenas de la vida. Leo aporta drama y diversión, Tauro estabilidad. Pueden chocar por terquedad, pero su aprecio mutuo es fuerte. Una amistad que puede ser muy gratificante si ambos respetan el espacio del otro.",
      score: 3
    },
    work: {
      report: "En el trabajo, Tauro y Leo pueden ser un equipo poderoso si alinean objetivos. Tauro aporta tenacidad, Leo carisma. El desafío es evitar luchas de poder. Si se respetan y definen roles, pueden alcanzar grandes logros, combinando la practicidad con la creatividad.",
      score: 3
    }
  },
  "Taurus-Virgo": {
    love: {
      report: "La relación amorosa entre Tauro y Virgo es sólida, tranquila y basada en el respeto mutuo. Ambos buscan una conexión estable. Tauro aprecia la inteligencia de Virgo, y Virgo admira la fiabilidad de Tauro. Su amor es profundo, leal y duradero. La comunicación honesta es clave.",
      score: 5
    },
    friendship: {
      report: "Tauro y Virgo como amigos se entienden a la perfección. Son prácticos, leales y se apoyan mutuamente. Disfrutan de actividades tranquilas y conversaciones significativas. Una amistad muy confiable y enriquecedora, basada en valores compartidos y un enfoque similar de la vida.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Tauro y Virgo forman un equipo altamente eficiente. Tauro aporta perseverancia, Virgo análisis y organización. Juntos, pueden llevar cualquier proyecto al éxito con meticulosidad y dedicación. Gran sinergia y enfoque en la calidad.",
      score: 5
    }
  },
  "Taurus-Libra": {
    love: {
      report: "Tauro y Libra en el amor se sienten atraídos por el refinamiento del otro. Disfrutan de ambientes hermosos. Tauro ofrece seguridad, Libra romance. El desafío radica en que Tauro es práctico y Libra idealista. Si Tauro da espacio a Libra y Libra ofrece seguridad a Tauro, su relación puede ser placentera y armoniosa.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Tauro y Libra es agradable y estética. Comparten un gusto por la belleza y la armonía. Libra aporta sociabilidad, Tauro estabilidad. Pueden disfrutar de actividades culturales y conversaciones refinadas. Necesitan paciencia con la indecisión de Libra y la terquedad de Tauro.",
      score: 4
    },
    work: {
      report: "En el trabajo, la colaboración entre Tauro y Libra puede ser estética y orientada a la calidad. Tauro materializa ideas, Libra aporta diplomacia. Pueden tener dificultades si Tauro es obstinado o Libra indeciso. La búsqueda de un terreno común es esencial para su éxito conjunto.",
      score: 3
    }
  },
  "Taurus-Scorpio": {
    love: {
      report: "La relación entre Tauro y Escorpio es profundamente apasionada y transformadora. La conexión es magnética. Tauro ofrece a Escorpio estabilidad, Escorpio aporta intensidad a Tauro. Los celos y la terquedad pueden ser desafíos. Si confían y canalizan su energía, pueden forjar un vínculo inquebrantable.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Tauro y Escorpio son intensamente leales y protectores. Se entienden a un nivel profundo. Pueden surgir conflictos por posesividad o secretos, pero su vínculo es fuerte. Una amistad de 'todo o nada', con gran potencial para la confianza y el apoyo incondicional.",
      score: 4
    },
    work: {
      report: "En el trabajo, Tauro y Escorpio son imparables si unen fuerzas. Tauro aporta constancia, Escorpio estrategia. Pueden surgir luchas de poder, pero su respeto mutuo es grande. Juntos, pueden abordar los proyectos más difíciles con determinación y profundidad.",
      score: 4
    }
  },
  "Taurus-Sagittarius": {
    love: {
      report: "Tauro y Sagitario en el amor deben conciliar sus necesidades. Tauro desea seguridad, Sagitario aventura. Sagitario puede ver a Tauro como posesivo, y Tauro a Sagitario como irresponsable. Si Tauro se abre a la aventura y Sagitario valora la seguridad de Tauro, pueden aprender mucho y ampliar sus horizontes.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Tauro y Sagitario es un aprendizaje. Sagitario puede animar a Tauro a salir de su rutina, y Tauro puede ofrecer a Sagitario un ancla. Disfrutan de placeres diferentes, pero pueden encontrar puntos en común si son pacientes. Una amistad que expande perspectivas.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Tauro y Sagitario tienen enfoques diferentes. Tauro es metódico, Sagitario visionario. Tauro puede ayudar a Sagitario a concretar ideas, Sagitario puede inspirar a Tauro. Requiere mucha paciencia y respeto por los métodos del otro para ser un equipo productivo.",
      score: 2
    }
  },
  "Taurus-Capricorn": {
    love: {
      report: "La relación amorosa entre Tauro y Capricornio es estable, segura y basada en un profundo respeto mutuo. Ambos son realistas y buscan un compañero confiable. Tauro admira la fortaleza de Capricornio, y Capricornio valora la sensualidad de Tauro. Su vínculo es profundo y muy duradero.",
      score: 5
    },
    friendship: {
      report: "Tauro y Capricornio como amigos son la definición de lealtad y apoyo práctico. Comparten valores y ambiciones. Se entienden bien y se ayudan a alcanzar sus metas. Una amistad sólida, confiable y que perdura en el tiempo, basada en el respeto y la comprensión.",
      score: 5
    },
    work: {
      report: "En el trabajo, Tauro y Capricornio son un equipo formidable. Tauro aporta perseverancia, Capricornio estrategia y disciplina. Juntos, pueden alcanzar grandes metas y construir un imperio duradero. Se respetan y complementan a la perfección en el ámbito profesional.",
      score: 5
    }
  },
  "Taurus-Aquarius": {
    love: {
      report: "Tauro y Acuario en el amor pueden tener dificultades para entenderse. Tauro busca conexión física, Acuario es más mental. La necesidad de Acuario de independencia choca con la posesividad de Tauro. Acuario puede encontrar a Tauro convencional, y Tauro a Acuario errático. Requiere un gran esfuerzo de ambas partes.",
      score: 1
    },
    friendship: {
      report: "La amistad entre Tauro y Acuario es inusual. Tauro es práctico, Acuario idealista. Pueden chocar por sus diferentes valores. Sin embargo, si se respetan, Acuario puede aportar ideas nuevas a Tauro, y Tauro puede ofrecer estabilidad a Acuario. Una amistad que desafía las convenciones.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Tauro y Acuario tienen enfoques opuestos. Tauro prefiere métodos probados, Acuario busca innovación. Tauro puede ver a Acuario como poco práctico, y Acuario a Tauro como rígido. Si se respetan, Tauro puede dar forma a las ideas de Acuario, y Acuario modernizar los enfoques de Tauro.",
      score: 2
    }
  },
  "Taurus-Pisces": {
    love: {
      report: "La relación entre Tauro y Piscis es tierna, afectuosa y llena de comprensión. Tauro se siente atraído por la naturaleza dulce de Piscis, y Piscis encuentra en Tauro un refugio seguro. Tauro ayuda a Piscis a mantenerse con los pies en la tierra, y Piscis enseña a Tauro a conectar con sus emociones. Una unión armoniosa y espiritualmente enriquecedora.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Tauro y Piscis se llevan maravillosamente. Tauro ofrece apoyo práctico y Piscis comprensión emocional. Disfrutan de actividades tranquilas y creativas. Una amistad muy nutritiva y leal, donde ambos se sienten cuidados y valorados.",
      score: 5
    },
    work: {
      report: "En el trabajo, Tauro y Piscis pueden colaborar bien. Tauro se encarga de la estructura, Piscis de la visión creativa. Tauro ayuda a Piscis a materializar sueños, y Piscis inspira a Tauro. Un equipo que combina lo práctico con lo imaginativo de manera efectiva.",
      score: 4
    }
  },
  "Gemini-Cancer": {
    love: {
      report: "Géminis y Cáncer en el amor tienen enfoques diferentes. Géminis busca un compañero intelectual, Cáncer un nido seguro. Géminis puede encontrar a Cáncer necesitado, y Cáncer a Géminis superficial. El ingenio de Géminis puede alegrar a Cáncer, y la ternura de Cáncer tocar a Géminis. Necesitan mucha comunicación y paciencia.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Géminis y Cáncer es una mezcla de diversión y cuidado. Géminis aporta la chispa social, Cáncer la escucha atenta. Cáncer puede ofrecer un hombro amigo, y Géminis puede animar a Cáncer a socializar. Necesitan entender sus diferentes formas de expresar afecto.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Cáncer pueden complementarse. Géminis aporta ideas y comunicación, Cáncer intuición y cuidado del equipo. Géminis necesita variedad, Cáncer estabilidad. Si Géminis es considerado con los sentimientos de Cáncer, y Cáncer no ahoga la libertad de Géminis, pueden lograr buenos resultados.",
      score: 3
    }
  },
  "Gemini-Leo": {
    love: {
      report: "La relación entre Géminis y Leo es estimulante y juguetona. Géminis admira la confianza de Leo, y Leo se siente fascinado por la inteligencia de Géminis. Disfrutan de una vida social activa. Si Leo no se vuelve demandante y Géminis ofrece lealtad, su relación será brillante y alegre.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Géminis y Leo son pura diversión. Géminis aporta las ideas, Leo el entusiasmo. Les encanta socializar y ser el centro de atención (Leo un poco más). Una amistad llena de risas, creatividad y apoyo mutuo en sus aventuras sociales e intelectuales.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Leo son un dúo creativo y carismático. Géminis aporta ideas brillantes, Leo liderazgo y entusiasmo. Juntos pueden ser muy persuasivos. Deben cuidar no competir por el protagonismo y enfocarse en metas comunes. Mucha energía positiva.",
      score: 4
    }
  },
  "Gemini-Virgo": {
    love: {
      report: "La conexión amorosa entre Géminis y Virgo es primordialmente mental. Géminis puede encontrar a Virgo demasiado crítico, y Virgo a Géminis inconstante. Si ambos aprecian la inteligencia del otro y Géminis ofrece constancia y Virgo flexibilidad, pueden construir una relación basada en una estimulante compañía intelectual.",
      score: 3
    },
    friendship: {
      report: "Géminis y Virgo como amigos disfrutan de conversaciones inteligentes y debates. Virgo puede ayudar a Géminis a ser más organizado, y Géminis puede enseñar a Virgo a ser menos rígido. Su amistad se basa en el estímulo intelectual. Virgo debe cuidar su crítica y Géminis su tendencia a la dispersión.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Virgo pueden ser un equipo intelectualmente poderoso si sincronizan estilos. Géminis genera ideas, Virgo las perfecciona. La crítica de Virgo puede ser un punto de fricción si no se expresa con cuidado. Juntos pueden lograr gran precisión y comunicación efectiva.",
      score: 4
    }
  },
  "Gemini-Libra": {
    love: {
      report: "Géminis y Libra en el amor disfrutan de una relación ligera, divertida y llena de conversaciones interesantes. Géminis se siente atraído por el encanto de Libra, y Libra admira la inteligencia de Géminis. Pueden necesitar trabajar en la profundidad emocional. Si cultivan la conexión emocional además de la intelectual, su unión puede ser muy feliz y duradera.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Géminis y Libra es naturalmente armoniosa y estimulante. Ambos son sociables, comunicativos y aman la variedad. Disfrutan explorando ideas y actividades culturales juntos. Una amistad llena de encanto, inteligencia y diversión compartida.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Libra colaboran de manera creativa y diplomática. Géminis aporta versatilidad, Libra equilibrio y negociación. El desafío puede surgir si Géminis se dispersa o Libra tarda en decidir. Si se enfocan, son un equipo excelente para la comunicación y las relaciones públicas.",
      score: 4
    }
  },
  "Gemini-Scorpio": {
    love: {
      report: "La atracción entre Géminis y Escorpio puede ser magnética. La necesidad de Escorpio de profundidad emocional puede chocar con la ligereza de Géminis. Escorpio busca fusionarse, Géminis explorar. Si Géminis está dispuesto a profundizar y Escorpio a ofrecer espacio, la relación puede ser transformadora.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Géminis y Escorpio ofrecen una dinámica intrigante. Géminis es curioso, Escorpio reservado. Escorpio puede enseñar a Géminis sobre la profundidad, y Géminis puede aligerar la intensidad de Escorpio. Requiere confianza y respeto por sus naturalezas diferentes.",
      score: 2
    },
    work: {
      report: "Profesionalmente, los estilos de Géminis y Escorpio son muy diferentes. Géminis usa la lógica, Escorpio la estrategia. Escorpio puede encontrar a Géminis superficial, y Géminis a Escorpio controlador. Si se respetan, Géminis puede aportar nuevas perspectivas y Escorpio la capacidad de investigación.",
      score: 3
    }
  },
  "Gemini-Sagittarius": {
    love: {
      report: "Géminis y Sagitario disfrutan de una relación amorosa vivaz, optimista y libre. Se entienden en su necesidad de independencia. Las conversaciones son interminables. El desafío puede ser el compromiso. Si valoran la libertad del otro y encuentran un terreno común, su relación será una fuente de crecimiento y diversión.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Géminis y Sagitario es una aventura constante. Ambos son curiosos, aman aprender y socializar. Se dan mucha libertad y se entienden instintivamente. Una amistad llena de humor, exploración y debates filosóficos.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Sagitario son un equipo creativo y visionario. Géminis aporta comunicación, Sagitario visión amplia. Pueden tener muchas ideas, pero necesitan enfocarse para concretarlas. Su honestidad directa es una ventaja si se maneja con tacto.",
      score: 4
    }
  },
  "Gemini-Capricorn": {
    love: {
      report: "Géminis y Capricornio en el amor requieren mucho trabajo. Géminis busca diversión, Capricornio seguridad. La libertad de Géminis choca con el control de Capricornio. Capricornio puede ofrecer estabilidad a Géminis, y Géminis puede enseñar a Capricornio a relajarse. Paciencia y comprensión son cruciales.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Géminis y Capricornio son polos opuestos. Géminis es adaptable, Capricornio estructurado. Capricornio puede ofrecer consejos sólidos, y Géminis puede aportar ligereza. Si se respetan, pueden tener una amistad que equilibre la diversión con la seriedad.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Géminis y Capricornio pueden encontrar difícil trabajar juntos al principio. Géminis puede ver a Capricornio como rígido, y Capricornio a Géminis como poco fiable. Si se esfuerzan, Géminis puede aportar ideas frescas y Capricornio la estructura para implementarlas.",
      score: 3
    }
  },
  "Gemini-Aquarius": {
    love: {
      report: "Géminis y Acuario disfrutan de una relación amorosa estimulante, poco convencional y basada en una profunda conexión mental. No son excesivamente emocionales o posesivos. Su vida social es activa. Su unión promete ser duradera y llena de descubrimientos.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Géminis y Acuario es una conexión de almas afines. Ambos son intelectuales, curiosos y valoran la libertad. Disfrutan de conversaciones innovadoras y de explorar nuevas ideas. Una amistad basada en el respeto mutuo y la estimulación mental.",
      score: 5
    },
    work: {
      report: "En el trabajo, Géminis y Acuario son un equipo innovador y brillante. Géminis aporta versatilidad, Acuario originalidad. Disfrutan trabajando en proyectos vanguardistas y pueden inspirarse mutuamente. La comunicación fluye sin esfuerzo. Gran potencial creativo.",
      score: 5
    }
  },
  "Gemini-Pisces": {
    love: {
      report: "Géminis y Piscis en el amor pueden sentirse atraídos por el misterio del otro. La necesidad de Piscis de conexión emocional profunda puede chocar con la naturaleza mental de Géminis. Si Géminis aprende a ser más empático y Piscis más directo, pueden encontrar un terreno común en su creatividad.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Géminis y Piscis pueden ser una combinación imaginativa. Géminis aporta ingenio, Piscis sensibilidad. Piscis puede apreciar la ligereza de Géminis, y Géminis la compasión de Piscis. Necesitan claridad en la comunicación para evitar malentendidos.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Géminis y Piscis pueden tener dificultades para entenderse. Géminis busca hechos, Piscis percepciones. La creatividad de Piscis puede inspirar a Géminis, y la elocuencia de Géminis ayudar a Piscis. Necesitan límites claros para trabajar eficazmente.",
      score: 2
    }
  },
  "Cancer-Leo": {
    love: {
      report: "Cáncer y Leo en el amor: Cáncer se siente atraído por la calidez de Leo, y Leo aprecia la devoción de Cáncer. Leo necesita ser el centro, Cáncer disfruta cuidando. Si Leo ofrece seguridad a Cáncer, y Cáncer admira a Leo, pueden construir un hogar lleno de amor y creatividad.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Cáncer y Leo es protectora y cálida. Leo aporta la diversión y el entusiasmo, Cáncer la escucha y el apoyo emocional. Leo disfruta del cuidado de Cáncer, y Cáncer de la generosidad de Leo. Una amistad leal donde ambos se sienten valorados.",
      score: 4
    },
    work: {
      report: "En el trabajo, Cáncer y Leo pueden ser efectivos si Leo lidera con generosidad y Cáncer apoya con lealtad. Leo aporta brillo, Cáncer cuidado. Deben evitar que el dramatismo de Leo abrume la sensibilidad de Cáncer. Juntos pueden crear un ambiente motivador.",
      score: 3
    }
  },
  "Cancer-Virgo": {
    love: {
      report: "Cáncer y Virgo en el amor pueden construir una relación sólida y afectuosa. Cáncer aprecia la dedicación de Virgo, y Virgo valora la ternura de Cáncer. Virgo ayuda a Cáncer a manejar emociones, y Cáncer enseña a Virgo a ser más expresivo. Muy leales y comprometidos.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Cáncer y Virgo se apoyan mutuamente. Virgo ofrece consejos prácticos, Cáncer apoyo emocional. Disfrutan de actividades tranquilas y conversaciones significativas. Una amistad basada en el cuidado y la comprensión mutua.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Cáncer y Virgo trabajan bien juntos. Cáncer aporta intuición, Virgo análisis práctico. Se complementan eficientemente. Virgo ayuda a Cáncer a ser objetivo, y Cáncer aporta calidez al enfoque de Virgo. Un equipo organizado y humano.",
      score: 4
    }
  },
  "Cancer-Libra": {
    love: {
      report: "Cáncer y Libra en el amor se sienten atraídos por la amabilidad del otro. La necesidad de Cáncer de conexión emocional puede ser abrumadora para Libra. Libra puede encontrar a Cáncer posesivo, y Cáncer a Libra superficial. Necesitan trabajar en la comunicación de sus necesidades.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Cáncer y Libra busca la armonía. Cáncer ofrece apoyo emocional, Libra sociabilidad y encanto. Disfrutan de ambientes agradables. Libra debe ser sensible a los cambios de humor de Cáncer, y Cáncer apreciar la necesidad de Libra de interacción social.",
      score: 3
    },
    work: {
      report: "En el trabajo, Cáncer y Libra pueden chocar. Cáncer es intuitivo, Libra lógico. Si encuentran un punto medio, Cáncer puede aportar sensibilidad y Libra habilidades sociales. La toma de decisiones puede ser lenta si Cáncer se retrae o Libra duda.",
      score: 2
    }
  },
  "Cancer-Scorpio": {
    love: {
      report: "La compatibilidad amorosa entre Cáncer y Escorpio es una de las más fuertes. Se entienden a un nivel anímico. Ambos anhelan fusión emocional y son ferozmente leales. La pasión es intensa. Los desafíos pueden surgir de la posesividad de ambos. Su amor profundo suele superar obstáculos.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Cáncer y Escorpio tienen una conexión profunda e intuitiva. Son leales, protectores y se entienden casi sin palabras. Comparten secretos y se ofrecen un apoyo incondicional. Una amistad muy intensa y duradera.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Cáncer y Escorpio son un equipo poderoso y perceptivo. Cáncer aporta sensibilidad, Escorpio determinación y estrategia. Se entienden bien y pueden trabajar con gran dedicación, especialmente en proyectos con componente emocional.",
      score: 4
    }
  },
  "Cancer-Sagittarius": {
    love: {
      report: "Cáncer y Sagitario en el amor deben esforzarse para entenderse. La necesidad de Sagitario de independencia puede hacer que Cáncer se sienta inseguro. La franqueza de Sagitario puede herir a Cáncer. Si Sagitario es considerado y Cáncer da libertad, pueden aprender mucho, pero requiere madurez.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Cáncer y Sagitario es de contrastes. Sagitario es aventurero, Cáncer hogareño. Sagitario puede animar a Cáncer, y Cáncer puede ofrecer un refugio a Sagitario. Necesitan mucha paciencia y aceptación de sus diferencias.",
      score: 2
    },
    work: {
      report: "En el trabajo, Cáncer y Sagitario pueden tener dificultades. Cáncer prefiere estabilidad, Sagitario variedad. Sagitario puede encontrar a Cáncer cauteloso, y Cáncer a Sagitario insensible. El optimismo de Sagitario puede animar a Cáncer, y la intuición de Cáncer guiar a Sagitario.",
      score: 2
    }
  },
  "Cancer-Capricorn": {
    love: {
      report: "Cáncer y Capricornio en el amor pueden ofrecerse lo que al otro le falta. Cáncer anhela la estabilidad de Capricornio, y Capricornio se nutre del afecto de Cáncer. La reserva emocional de Capricornio puede chocar con Cáncer. Si Capricornio se abre y Cáncer comprende, pueden construir un hogar sólido.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Cáncer y Capricornio se respetan y complementan. Capricornio ofrece estructura y consejos prácticos, Cáncer apoyo emocional. Cáncer puede ayudar a Capricornio a relajarse, y Capricornio puede dar seguridad a Cáncer. Una amistad basada en la lealtad y el apoyo mutuo.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Cáncer y Capricornio pueden formar un equipo muy efectivo. Cáncer aporta intuición, Capricornio estructura y disciplina. Cáncer debe entender la dedicación de Capricornio al trabajo, y Capricornio apreciar la sensibilidad de Cáncer. Juntos son constructores.",
      score: 4
    }
  },
  "Cancer-Aquarius": {
    love: {
      report: "Cáncer y Acuario en el amor pueden tener dificultades para conectar. Cáncer necesita afecto constante, Acuario expresa amor de forma más distante. La necesidad de Cáncer de hogar choca con el deseo de Acuario de socializar. Requiere mucha tolerancia y aceptación de las diferencias.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Cáncer y Acuario es inusual. Cáncer es emocional, Acuario intelectual. Acuario puede parecer frío a Cáncer, y Cáncer demasiado necesitado a Acuario. Si se respetan, pueden ofrecerse perspectivas muy diferentes y aprender el uno del otro.",
      score: 2
    },
    work: {
      report: "En el trabajo, Cáncer y Acuario tienen enfoques distintos. Cáncer se guía por la intuición, Acuario por la lógica. Si se respetan, Cáncer puede aportar humanidad y Acuario originalidad. La comunicación debe ser muy clara para evitar malentendidos.",
      score: 2
    }
  },
  "Cancer-Pisces": {
    love: {
      report: "La relación amorosa entre Cáncer y Piscis es mágica y profundamente satisfactoria. Se entienden a un nivel anímico. Ambos son románticos. Cáncer ofrece seguridad a Piscis, y Piscis colma a Cáncer de afecto. Si cultivan la comunicación abierta, su amor será un refugio de paz.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Cáncer y Piscis comparten una conexión emocional e intuitiva. Son compasivos y se apoyan incondicionalmente. Disfrutan de actividades creativas y conversaciones profundas. Una amistad muy tierna y leal.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Cáncer y Piscis pueden crear un ambiente inspirador, especialmente en campos creativos. Cáncer aporta tenacidad, Piscis imaginación. Se entienden bien y se apoyan. Pueden necesitar ayuda con los aspectos más prácticos, pero su empatía es una gran fortaleza.",
      score: 4
    }
  },
  "Leo-Virgo": {
    love: {
      report: "Leo y Virgo en el amor: Leo se siente atraído por la inteligencia de Virgo, Virgo admira la confianza de Leo. La necesidad de Leo de ser el centro puede chocar con la modestia de Virgo. Si Leo aprecia el servicio de Virgo, y Virgo disfruta del brillo de Leo, pueden construir una relación estable y afectuosa.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Virgo es una de apoyo práctico y admiración. Leo aporta entusiasmo, Virgo análisis y ayuda. Virgo puede mantener a Leo con los pies en la tierra, y Leo puede animar a Virgo a brillar. Necesitan paciencia con sus diferentes estilos.",
      score: 3
    },
    work: {
      report: "En el trabajo, Leo y Virgo pueden ser un equipo efectivo si Leo lidera con carisma y Virgo organiza con meticulosidad. Leo inspira, Virgo concreta. Leo debe evitar ser autoritario, y Virgo no ser excesivamente crítico. Combinan bien el liderazgo con la ejecución detallada.",
      score: 4
    }
  },
  "Leo-Libra": {
    love: {
      report: "La relación amorosa entre Leo y Libra es romántica y elegante. Leo se siente atraído por el encanto de Libra, y Libra admira la confianza de Leo. Disfrutan de una vida social activa. Si mantienen viva la llama del romance y el respeto, su unión será brillante y feliz.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Leo y Libra son una pareja glamurosa y sociable. Les encanta la diversión, el arte y la compañía del otro. Libra sabe cómo hacer brillar a Leo, y Leo aprecia la diplomacia de Libra. Una amistad llena de estilo y admiración mutua.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Leo y Libra son un dúo carismático y diplomático. Leo aporta liderazgo, Libra estrategia y habilidades sociales. Juntos pueden ser muy exitosos en relaciones públicas o eventos. Combinan creatividad con un gran sentido estético.",
      score: 4
    }
  },
  "Leo-Scorpio": {
    love: {
      report: "La atracción entre Leo y Escorpio es eléctrica y pasional. Ambos son leales. La necesidad de Leo de admiración choca con la reserva de Escorpio. Los celos y luchas de poder pueden ser un problema. Si aprenden a confiar y respetar sus diferencias, su relación puede ser transformadora.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Escorpio es intensa y poderosa. Ambos son leales y protectores. Leo admira la fuerza de Escorpio, Escorpio la generosidad de Leo. Pueden surgir luchas de poder, pero su vínculo es fuerte si se basa en el respeto mutuo. Una amistad de 'todo o nada'.",
      score: 3
    },
    work: {
      report: "En el trabajo, Leo y Escorpio son invencibles si no compiten. Leo aporta liderazgo, Escorpio estrategia. Deben definir roles para evitar conflictos. Su ambición conjunta puede llevarlos muy lejos. Un equipo con mucha fuerza y determinación.",
      score: 3
    }
  },
  "Leo-Sagittarius": {
    love: {
      report: "La relación amorosa entre Leo y Sagitario es apasionada y alegre. Se admiran mutuamente y disfrutan explorando juntos. Leo ama la franqueza de Sagitario, Sagitario la confianza de Leo. Si cultivan su amistad y pasión, su unión será una aventura emocionante y duradera.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Leo y Sagitario son pura diversión y optimismo. Les encanta la aventura y apoyarse en sus hazañas. Son generosos y honestos. Una amistad llena de risas, energía positiva y exploración constante.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Leo y Sagitario son un equipo inspirador y dinámico. Leo aporta liderazgo, Sagitario visión expansiva. Juntos pueden motivar y lanzar proyectos audaces. La comunicación es abierta. Necesitan cuidar los detalles, pero su energía es contagiosa.",
      score: 4
    }
  },
  "Leo-Capricorn": {
    love: {
      report: "Leo y Capricornio en el amor sienten respeto por la fortaleza del otro. La necesidad de Leo de afecto puede no ser satisfecha por el reservado Capricornio. Si Leo valora la lealtad de Capricornio, y Capricornio disfruta de la calidez de Leo, pueden construir una relación sólida basada en metas compartidas.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Capricornio se basa en la admiración por la ambición del otro. Capricornio puede ofrecer consejos prácticos, y Leo puede animar a Capricornio a celebrar sus éxitos. Pueden parecer diferentes, pero su respeto mutuo puede forjar una amistad duradera.",
      score: 3
    },
    work: {
      report: "En el trabajo, Leo y Capricornio pueden ser un equipo formidable si Leo acepta la guía estratégica de Capricornio y Capricornio valora el carisma de Leo. Leo es el rostro público, Capricornio el cerebro. Deben respetar sus diferentes ritmos para el éxito.",
      score: 4
    }
  },
  "Leo-Aquarius": {
    love: {
      report: "La relación amorosa entre Leo y Acuario es estimulante y poco convencional. Leo se siente atraído por la inteligencia de Acuario, Acuario admira la confianza de Leo. La necesidad de Leo de atención choca con la independencia de Acuario. Si aprecian sus diferencias, su relación será vibrante.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Leo y Acuario son una pareja original y divertida. Leo aporta la calidez, Acuario las ideas innovadoras. Disfrutan de debates intelectuales y proyectos creativos. Se respetan mutuamente y se dan libertad. Una amistad llena de estímulo y originalidad.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Leo y Acuario son un dúo innovador y carismático. Leo aporta liderazgo, Acuario originalidad. Juntos pueden liderar proyectos vanguardistas. El desafío es que Leo no se sienta ignorado por el enfoque grupal de Acuario. Gran potencial creativo.",
      score: 4
    }
  },
  "Leo-Pisces": {
    love: {
      report: "Leo y Piscis en el amor: Leo se siente atraído por la gentileza de Piscis, Piscis admira la fuerza de Leo. Leo ofrece protección, Piscis devoción. Si Leo es tierno y Piscis expresivo, pueden crear una relación mágica, llena de romance y apoyo mutuo.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Leo y Piscis es una de contrastes que se pueden complementar. Leo es el protector, Piscis el soñador compasivo. Leo puede ayudar a Piscis a ganar confianza, y Piscis puede suavizar el ego de Leo. Una amistad con potencial para ser muy cariñosa.",
      score: 3
    },
    work: {
      report: "En el trabajo, los estilos de Leo y Piscis son diferentes. Leo lidera con carisma, Piscis inspira con empatía. Leo puede ayudar a Piscis a ser más visible, y Piscis puede aportar una visión creativa. Necesitan apreciar sus fortalezas mutuas para colaborar eficazmente.",
      score: 3
    }
  },
  "Virgo-Libra": {
    love: {
      report: "Virgo y Libra en el amor comparten un gusto por la belleza. Virgo se siente atraído por el encanto de Libra, Libra admira la inteligencia de Virgo. Si Virgo se relaja y Libra es más práctico, pueden construir una relación armoniosa, basada en el respeto y la compañía agradable.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Virgo y Libra disfrutan de conversaciones refinadas y actividades culturales. Virgo ofrece apoyo práctico, Libra encanto social. Libra puede ayudar a Virgo a socializar más, y Virgo puede ofrecer a Libra consejos sensatos. Una amistad equilibrada y agradable.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Virgo y Libra pueden colaborar bien. Virgo aporta organización, Libra diplomacia y estética. Virgo debe cuidar no ser demasiado crítico, y Libra evitar la indecisión. Juntos pueden crear productos y servicios de alta calidad y bien presentados.",
      score: 4
    }
  },
  "Virgo-Scorpio": {
    love: {
      report: "Virgo y Escorpio en el amor pueden desarrollar una conexión profunda. Virgo se siente atraído por la intensidad de Escorpio, Escorpio valora la lealtad de Virgo. La comunicación honesta y la confianza son claves para superar la crítica de Virgo y los celos de Escorpio.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Virgo y Escorpio es analítica y leal. Ambos son inteligentes y observadores. Se respetan mutuamente y pueden confiar el uno en el otro. Virgo ofrece consejos prácticos, Escorpio una perspectiva profunda. Una amistad sólida y discreta.",
      score: 4
    },
    work: {
      report: "En el trabajo, Virgo y Escorpio son un equipo formidable. Virgo aporta meticulosidad, Escorpio estrategia y determinación. Juntos pueden desentrañar problemas complejos y lograr resultados de alta calidad. Se respetan por su inteligencia y dedicación.",
      score: 5
    }
  },
  "Virgo-Sagittarius": {
    love: {
      report: "Virgo y Sagitario en el amor necesitan mucha adaptación. Virgo busca orden, Sagitario libertad. La franqueza de Sagitario puede herir a Virgo. Para que funcione, Virgo debe ser más flexible, y Sagitario más considerado. Su relación puede ser un constante aprendizaje.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Virgo y Sagitario son muy diferentes. Virgo es práctico, Sagitario aventurero. Sagitario puede sacar a Virgo de su rutina, y Virgo puede ayudar a Sagitario a ser más organizado. Si se respetan, pueden ofrecerse perspectivas muy distintas.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Virgo y Sagitario pueden chocar. Virgo se enfoca en detalles, Sagitario en la visión general. Sagitario puede encontrar a Virgo quisquilloso, y Virgo a Sagitario descuidado. Si valoran sus diferencias, Virgo puede organizar y Sagitario inspirar.",
      score: 2
    }
  },
  "Virgo-Capricorn": {
    love: {
      report: "La relación amorosa entre Virgo y Capricornio es sólida, leal y basada en un profundo entendimiento mutuo. Ambos son realistas y buscan un compañero confiable. Virgo admira la fortaleza de Capricornio, Capricornio valora la inteligencia de Virgo. Su conexión es profunda y duradera.",
      score: 5
    },
    friendship: {
      report: "Virgo y Capricornio como amigos son inseparables. Se apoyan en sus metas, se ofrecen consejos prácticos y comparten un enfoque similar de la vida. Una amistad muy confiable, estable y enriquecedora, basada en el respeto y la lealtad.",
      score: 5
    },
    work: {
      report: "En el trabajo, Virgo y Capricornio son un equipo invencible. Virgo aporta organización y análisis, Capricornio estructura y disciplina. Juntos, pueden construir y lograr cualquier cosa con eficiencia y dedicación. Sinergia perfecta para el éxito.",
      score: 5
    }
  },
  "Virgo-Aquarius": {
    love: {
      report: "Virgo y Acuario en el amor pueden encontrar difícil la conexión emocional. Virgo busca demostración práctica de afecto, Acuario es más desapegado. Si Virgo aprecia la originalidad de Acuario y Acuario valora la dedicación de Virgo, pueden construir una relación basada en el respeto intelectual.",
      score: 2
    },
    friendship: {
      report: "La amistad entre Virgo y Acuario es principalmente intelectual. Virgo es práctico, Acuario idealista. Disfrutan de conversaciones estimulantes. Acuario puede encontrar a Virgo demasiado convencional, y Virgo a Acuario poco práctico. Si se aceptan, la amistad puede ser mentalmente enriquecedora.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Virgo y Acuario pueden complementarse si superan diferencias de estilo. Virgo puede estructurar las ideas innovadoras de Acuario, y Acuario inspirar a Virgo a pensar más ampliamente. La comunicación clara es esencial para su colaboración.",
      score: 3
    }
  },
  "Virgo-Pisces": {
    love: {
      report: "La relación amorosa entre Virgo y Piscis puede ser profundamente sanadora y romántica. Virgo se siente atraído por la sensibilidad de Piscis, Piscis encuentra en Virgo la estabilidad que necesita. Con amor y comprensión, su unión puede ser mágica y complementaria.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Virgo y Piscis se ofrecen un gran apoyo. Virgo ayuda a Piscis a ser más práctico, y Piscis enseña a Virgo sobre la empatía. Se entienden bien y se cuidan mutuamente. Una amistad tierna y llena de comprensión.",
      score: 4
    },
    work: {
      report: "En el trabajo, Virgo y Piscis pueden ser un excelente equipo. Virgo aporta organización, Piscis creatividad e intuición. Virgo puede ayudar a Piscis a materializar ideas, y Piscis inspirar a Virgo. Juntos combinan lo práctico con lo imaginativo.",
      score: 4
    }
  },
  "Libra-Scorpio": {
    love: {
      report: "La atracción entre Libra y Escorpio es fuerte y magnética. La necesidad de Escorpio de control puede chocar con la naturaleza sociable de Libra. Si Libra explora las profundidades emocionales y Escorpio confía, su relación puede ser transformadora y muy apasionada.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Libra y Escorpio es intrigante. Libra aprecia la lealtad de Escorpio, y Escorpio la diplomacia de Libra. Pueden tener una conexión profunda si superan la desconfianza inicial. Libra suaviza a Escorpio, Escorpio da fuerza a Libra.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Libra y Escorpio pueden ser un equipo poderoso. Libra aporta diplomacia, Escorpio estrategia y determinación. Libra suaviza la intensidad de Escorpio, Escorpio ayuda a Libra a decidir. Deben cuidar las luchas de poder sutiles para tener éxito.",
      score: 3
    }
  },
  "Libra-Sagittarius": {
    love: {
      report: "La relación amorosa entre Libra y Sagitario es alegre y estimulante. Ambos valoran la libertad. Disfrutan de viajar y aprender. Si ambos cultivan la confianza y el respeto mutuo, su unión será una fuente constante de felicidad y crecimiento.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Libra y Sagitario son una pareja divertida y optimista. Aman la aventura, las conversaciones interesantes y la vida social. Se dan espacio y se admiran mutuamente. Una amistad llena de risas y exploración.",
      score: 5
    },
    work: {
      report: "En el trabajo, Libra y Sagitario son un dúo creativo y entusiasta. Libra aporta diplomacia, Sagitario visión y espíritu emprendedor. Juntos son persuasivos. La honestidad de Sagitario puede chocar con el deseo de Libra de evitar conflictos, pero suelen resolverlo.",
      score: 4
    }
  },
  "Libra-Capricorn": {
    love: {
      report: "Libra y Capricornio en el amor pueden tener dificultades. Libra necesita romance, Capricornio es reservado. Si Libra aprecia la lealtad de Capricornio, y Capricornio es más expresivo, pueden construir una relación sólida basada en el respeto y metas compartidas.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Libra y Capricornio requiere esfuerzo. Libra es social, Capricornio reservado. Capricornio puede ofrecer estabilidad, Libra encanto. Si encuentran un equilibrio, pueden tener una amistad respetuosa, aunque no muy efusiva.",
      score: 2
    },
    work: {
      report: "Profesionalmente, Libra y Capricornio pueden complementarse. Libra aporta habilidades sociales, Capricornio disciplina y estrategia. Libra ayuda a Capricornio a ser más sociable, Capricornio a Libra a ser más decidido. Sus estilos de trabajo son diferentes, pero pueden ser efectivos.",
      score: 3
    }
  },
  "Libra-Aquarius": {
    love: {
      report: "La relación amorosa entre Libra y Acuario es armoniosa y estimulante. Se entienden casi sin palabras y respetan la individualidad del otro. Su amor es más cerebral que pasional, pero la admiración mutua es fuerte. Una unión duradera, equitativa y llena de descubrimientos intelectuales.",
      score: 5
    },
    friendship: {
      report: "Como amigos, Libra y Acuario son almas gemelas intelectuales. Comparten un amor por la justicia, la originalidad y las conversaciones profundas. Se dan libertad y se apoyan en sus ideales. Una amistad muy estimulante y duradera.",
      score: 5
    },
    work: {
      report: "En el trabajo, Libra y Acuario son un equipo brillante e innovador. Libra aporta diplomacia, Acuario visión de futuro. Disfrutan colaborando en proyectos creativos o sociales. Su comunicación es fluida y se inspiran mutuamente.",
      score: 5
    }
  },
  "Libra-Pisces": {
    love: {
      report: "Libra y Piscis en el amor se sienten atraídos por la sensibilidad del otro. La necesidad de Piscis de fusión emocional puede ser abrumadora para Libra. Si Libra conecta con la profundidad de Piscis, y Piscis comunica sus necesidades, pueden disfrutar de una relación tierna e inspiradora.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Libra y Piscis es artística y compasiva. Libra aprecia la imaginación de Piscis, y Piscis la amabilidad de Libra. Disfrutan de actividades creativas. Necesitan claridad en la comunicación para evitar malentendidos debido a la sensibilidad de Piscis.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Libra y Piscis pueden colaborar bien en campos creativos. Libra aporta estética, Piscis imaginación. El desafío es que ambos pueden ser indecisos o evitar la confrontación. Necesitan estructura para ser más efectivos en la toma de decisiones prácticas.",
      score: 3
    }
  },
  "Scorpio-Sagittarius": {
    love: {
      report: "La atracción entre Escorpio y Sagitario puede ser fuerte. La necesidad de Escorpio de intimidad choca con el deseo de Sagitario de libertad. Si Escorpio confía y da espacio, y Sagitario profundiza en la conexión, pueden tener una relación apasionante y de crecimiento.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Escorpio y Sagitario son una mezcla de intensidad y aventura. Escorpio es profundo, Sagitario expansivo. Sagitario puede animar a Escorpio, y Escorpio puede ofrecer a Sagitario una perspectiva más profunda. Necesitan respetar sus diferentes naturalezas.",
      score: 3
    },
    work: {
      report: "En el trabajo, Escorpio y Sagitario pueden ser un dúo poderoso. Escorpio aporta estrategia, Sagitario visión. La franqueza de Sagitario puede chocar con la reserva de Escorpio. Necesitan confianza y comunicación clara para canalizar su energía conjunta.",
      score: 3
    }
  },
  "Scorpio-Capricorn": {
    love: {
      report: "Escorpio y Capricornio en el amor pueden desarrollar una conexión profunda y duradera. Ambos son reservados pero muy leales. Escorpio admira la fortaleza de Capricornio, Capricornio valora la pasión de Escorpio. El desafío es abrirse emocionalmente. Si lo logran, su unión será inquebrantable.",
      score: 4
    },
    friendship: {
      report: "La amistad entre Escorpio y Capricornio es sólida y se basa en el respeto mutuo. Ambos son serios, ambiciosos y leales. Se apoyan en sus metas y pueden confiar el uno en el otro. Una amistad poderosa y discreta.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Escorpio y Capricornio son un equipo formidable. Escorpio aporta profundidad de análisis, Capricornio estructura y disciplina. Juntos pueden alcanzar cualquier meta. Se respetan y pueden construir un imperio basado en la confianza y la ambición.",
      score: 5
    }
  },
  "Scorpio-Aquarius": {
    love: {
      report: "Escorpio y Acuario en el amor: la atracción puede ser magnética. La necesidad de Escorpio de fusión choca con el deseo de Acuario de independencia. Los celos y luchas de poder pueden ser un problema. Requiere enorme comprensión y tolerancia para que funcione.",
      score: 2
    },
    friendship: {
      report: "Como amigos, Escorpio y Acuario son una combinación inusual. Escorpio es intenso, Acuario desapegado. Pueden fascinarse mutuamente o chocar. Si se respetan, Acuario puede ofrecer a Escorpio una perspectiva más amplia, y Escorpio a Acuario profundidad.",
      score: 2
    },
    work: {
      report: "En el trabajo, los enfoques de Escorpio y Acuario son opuestos. Escorpio profundiza, Acuario innova. Acuario puede encontrar a Escorpio posesivo, y Escorpio a Acuario errático. Si logran respetar sus diferencias, pueden lograr resultados únicos, pero la colaboración es un desafío.",
      score: 2
    }
  },
  "Scorpio-Pisces": {
    love: {
      report: "La compatibilidad amorosa entre Escorpio y Piscis es excepcionalmente profunda. Se aman con intensidad y devoción. Escorpio ofrece fuerza a Piscis, Piscis amor incondicional a Escorpio. Su conexión es anímica. Si mantienen un cable a tierra, su amor será una fuente de felicidad.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Escorpio y Piscis es una de las más profundas y empáticas. Se entienden a un nivel intuitivo y se ofrecen un apoyo incondicional. Comparten un mundo interior rico. Una amistad mágica y transformadora.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Escorpio y Piscis pueden ser un equipo creativo e inspirador. Escorpio aporta determinación, Piscis imaginación y empatía. Se entienden casi telepáticamente. Excelentes para campos artísticos o de sanación. Necesitan un poco de estructura.",
      score: 4
    }
  },
  "Sagittarius-Capricorn": {
    love: {
      report: "Sagitario y Capricornio en el amor deben trabajar para encontrar un terreno común. Sagitario busca libertad, Capricornio estabilidad. Sagitario puede enseñar a Capricornio a relajarse, y Capricornio puede ofrecer a Sagitario una base sólida. Si ambos ceden, pueden construir una relación equilibrada.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Sagitario y Capricornio son muy diferentes. Sagitario es optimista, Capricornio práctico. Capricornio puede ayudar a Sagitario a ser más realista, y Sagitario puede animar a Capricornio a ser más aventurero. Si se respetan, su amistad puede ser enriquecedora.",
      score: 3
    },
    work: {
      report: "En el trabajo, Sagitario y Capricornio pueden complementarse. Sagitario aporta visión, Capricornio estructura. La impaciencia de Sagitario puede chocar con la cautela de Capricornio. Necesitan respetar los métodos del otro para ser un equipo productivo.",
      score: 3
    }
  },
  "Sagittarius-Aquarius": {
    love: {
      report: "Sagitario y Acuario en el amor disfrutan de una relación estimulante, basada en la amistad y el respeto por la independencia. No son posesivos. Su vida social es activa. Una unión divertida, libre y llena de descubrimientos constantes.",
      score: 5
    },
    friendship: {
      report: "La amistad entre Sagitario y Acuario es una aventura intelectual. Aman la libertad, las nuevas ideas y la honestidad. Se estimulan mutuamente y se dan mucho espacio. Una amistad muy divertida y progresista.",
      score: 5
    },
    work: {
      report: "Profesionalmente, Sagitario y Acuario son un dúo innovador y visionario. Sagitario aporta entusiasmo, Acuario originalidad. Disfrutan trabajando en proyectos que desafíen el status quo. Se inspiran mutuamente y la comunicación es fluida.",
      score: 4
    }
  },
  "Sagittarius-Pisces": {
    love: {
      report: "Sagitario y Piscis en el amor necesitan mucha comprensión. Sagitario busca aventura, Piscis conexión emocional. Sagitario puede encontrar a Piscis necesitado, Piscis a Sagitario insensible. Si Sagitario es tierno y Piscis da espacio, pueden encontrar un punto de encuentro en su idealismo.",
      score: 3
    },
    friendship: {
      report: "Como amigos, Sagitario y Piscis son una combinación de optimismo y compasión. Sagitario puede animar a Piscis, y Piscis puede ofrecer a Sagitario una perspectiva más sensible. Necesitan entender sus diferentes formas de ver el mundo para que la amistad florezca.",
      score: 3
    },
    work: {
      report: "En el trabajo, Sagitario y Piscis pueden tener dificultades si no se comunican bien. La franqueza de Sagitario puede herir a Piscis. La visión de Sagitario puede inspirar la creatividad de Piscis. Necesitan claridad y respeto mutuo para colaborar eficazmente.",
      score: 2
    }
  },
  "Capricorn-Aquarius": {
    love: {
      report: "Capricornio y Acuario en el amor pueden encontrar difícil conectar. Capricornio busca estabilidad, Acuario independencia. Capricornio puede ver a Acuario como errático, Acuario a Capricornio como rígido. Si Capricornio se abre y Acuario valora la lealtad, pueden construir una relación basada en el respeto intelectual.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Capricornio y Acuario es interesante. Capricornio es tradicional, Acuario progresista. Se respetan por su inteligencia. Acuario puede aportar nuevas ideas, y Capricornio puede ayudar a Acuario a ser más práctico. Una amistad que desafía lo convencional.",
      score: 3
    },
    work: {
      report: "Profesionalmente, Capricornio y Acuario pueden ser un equipo interesante si Capricornio implementa las ideas vanguardistas de Acuario. Capricornio busca resultados, Acuario originalidad. Deben respetar sus diferentes formas de trabajar para evitar frustraciones.",
      score: 3
    }
  },
  "Capricorn-Pisces": {
    love: {
      report: "La relación amorosa entre Capricornio y Piscis es tierna y leal. Capricornio se siente atraído por la naturaleza gentil de Piscis, Piscis encuentra en Capricornio la estabilidad que anhela. Una unión duradera, basada en el cuidado mutuo y un profundo entendimiento.",
      score: 4
    },
    friendship: {
      report: "Como amigos, Capricornio y Piscis se complementan maravillosamente. Capricornio ofrece apoyo práctico, Piscis comprensión emocional. Se cuidan y respetan. Una amistad sólida y llena de afecto sincero.",
      score: 4
    },
    work: {
      report: "En el trabajo, Capricornio y Piscis trabajan muy bien juntos. Capricornio se encarga de la planificación, Piscis aporta visión creativa y empatía. Capricornio ayuda a Piscis a materializar sueños, Piscis suaviza la rigidez de Capricornio. Un equipo muy equilibrado.",
      score: 4
    }
  },
  "Aquarius-Pisces": {
    love: {
      report: "Acuario y Piscis en el amor pueden formar una unión espiritual. Acuario se siente atraído por la naturaleza mística de Piscis, Piscis admira la originalidad de Acuario. La necesidad de Piscis de conexión emocional puede ser un desafío para el desapegado Acuario. Si se aceptan, pueden construir una relación basada en ideales compartidos.",
      score: 3
    },
    friendship: {
      report: "La amistad entre Acuario y Piscis es compasiva e idealista. Acuario aporta ideas innovadoras, Piscis sensibilidad y empatía. Disfrutan de conversaciones profundas sobre temas humanitarios. Se respetan mutuamente y pueden inspirarse.",
      score: 4
    },
    work: {
      report: "Profesionalmente, Acuario y Piscis pueden ser un equipo creativo e inspirador, especialmente en causas sociales o artísticas. Acuario aporta ideas, Piscis sensibilidad. Deben cuidar que la lógica de Acuario no choque con la emocionalidad de Piscis para trabajar en armonía.",
      score: 3
    }
  }
};

function getGenericCompatibilityReport(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityReportDetail {
  const reportText = `La conexión de ${type} entre ${sign1} y ${sign2} es única, tejida con los hilos de sus elementos y modalidades distintivas. ${sign1}, con su energía inherente, interactúa con ${sign2}, quien aporta su característica distintiva, creando una dinámica que puede ser tanto complementaria como desafiante para este tipo de relación. Es un encuentro de dos mundos que, con entendimiento, pueden enriquecerse mutuamente. (Este es un informe de compatibilidad general para ${type}. Los detalles específicos pueden variar.)`;
  return {
    report: reportText,
    score: Math.floor(Math.random() * 3) + 2 
  };
}

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName, type: 'love' | 'friendship' | 'work', locale: Locale): CompatibilityData {
  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  let reportData: CompatibilityReportDetail;

  if (compatibilityPairings[key1] && compatibilityPairings[key1][type]) {
    reportData = compatibilityPairings[key1][type];
  } else if (compatibilityPairings[key2] && compatibilityPairings[key2][type]) {
    reportData = compatibilityPairings[key2][type];
  } else {
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

    