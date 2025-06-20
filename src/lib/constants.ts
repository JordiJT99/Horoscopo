
import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo, AstrologicalElement, AstrologicalPolarity, AstrologicalModality, UpcomingPhase, MoonPhaseKey } from '@/types';
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


const genericHoroscopeText = "Hoy es un día de nuevos comienzos. Abraza el cambio y busca oportunidades. Tus niveles de energía son altos, ¡aprovéchalos al máximo! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const getHoroscope = (sign: ZodiacSignName): HoroscopeData => ({
  sign,
  daily: `Horóscopo Diario para ${sign}: ${genericHoroscopeText} Concéntrate en proyectos personales.`,
  weekly: `Horóscopo Semanal para ${sign}: Esta semana trae una mezcla de desafíos y recompensas. ${genericHoroscopeText} Planifica tus finanzas cuidadosamente.`,
  monthly: `Horóscopo Mensual para ${sign}: El mes que viene es crucial para tu crecimiento profesional. ${genericHoroscopeText} Las relaciones requerirán atención.`,
});

interface CompatibilityReport {
  report: string;
  score: number;
}

// Extended compatibility pairings based on previous interactions
const compatibilityPairings: Record<string, CompatibilityReport> = {
  "Aries-Aries": {
    report: "Cuando dos Aries se unen, la energía y la pasión son explosivas. Ambos son pioneros, llenos de entusiasmo y aman la acción. Esta relación puede ser increíblemente dinámica y divertida, siempre en busca de nuevas aventuras. Sin embargo, la naturaleza competitiva de Aries y su deseo de liderar pueden generar choques y luchas de poder. Necesitan aprender a ceder el uno al otro y a darse espacio para sus iniciativas individuales. La clave es canalizar su energía conjunta hacia metas compartidas en lugar de competir entre sí. Con respeto y comprensión, pueden ser una pareja imparable.",
    score: 4
  },
  "Taurus-Taurus": {
    report: "Dos Tauro juntos crean una relación de profunda estabilidad, sensualidad y aprecio por los placeres de la vida. Ambos valoran la seguridad, el confort y la lealtad, lo que puede generar un vínculo muy sólido y duradero. Disfrutan de la buena comida, los ambientes acogedores y la tranquilidad. El principal desafío es que ambos pueden ser muy tercos y resistentes al cambio, lo que podría llevar a la rutina o al estancamiento si no se esfuerzan por introducir novedad y flexibilidad. Si aprenden a ceder en sus posturas y a estimularse mutuamente, su amor será un refugio de paz y placer.",
    score: 4
  },
  "Gemini-Gemini": {
    report: "Una pareja de Géminis es sinónimo de diversión, comunicación constante y una mente ágil multiplicada por dos. Ambos son curiosos, versátiles y disfrutan de la variedad y el estímulo intelectual. La relación estará llena de conversaciones interesantes, humor y una vida social activa. Sin embargo, esta misma necesidad de cambio y novedad puede llevar a la inconstancia o a una falta de profundidad emocional si no se cultiva. Pueden tener dificultades para tomar decisiones o para comprometerse a largo plazo. Si logran encontrar un ancla emocional y se apoyan en su mutua inteligencia, pueden ser compañeros de vida increíblemente estimulantes.",
    score: 3
  },
  "Cancer-Cancer": {
    report: "Cuando dos Cáncer se encuentran, la conexión emocional es inmediata y profunda. Ambos son sensibles, cariñosos, protectores y valoran el hogar y la familia por encima de todo. Esta relación puede ser un nido de amor, comprensión y apoyo mutuo. Sin embargo, la extrema sensibilidad de ambos puede llevar a que se hieran fácilmente o a que se encierren en sus caparazones si se sienten amenazados. Pueden volverse demasiado dependientes el uno del otro o caer en estados de ánimo fluctuantes. Necesitan aprender a comunicar sus necesidades abiertamente y a darse espacio para respirar. Si lo logran, su hogar será un verdadero santuario.",
    score: 4
  },
  "Leo-Leo": {
    report: "Una pareja de Leo es un espectáculo de carisma, pasión y generosidad. Ambos son extrovertidos, creativos y aman ser el centro de atención y admiración. La relación estará llena de drama (en el buen sentido), romance y grandes gestos. Se entienden en su necesidad de brillar. El mayor desafío son sus egos: las luchas por el protagonismo y el orgullo herido pueden ser frecuentes. Necesitan aprender a compartir el escenario y a aplaudirse mutuamente. Si logran manejar sus egos con humildad y respeto, su amor será una celebración constante, digna de la realeza.",
    score: 4
  },
  "Virgo-Virgo": {
    report: "Dos Virgo juntos forman una pareja práctica, organizada y mentalmente estimulante. Ambos son inteligentes, analíticos y tienen altos estándares. Se entienden en su necesidad de orden y eficiencia. Pueden ser muy buenos compañeros de trabajo y de vida, apoyándose en sus metas y disfrutando de conversaciones detalladas. Sin embargo, la tendencia de Virgo a la crítica puede volverse en su contra, con ambos analizándose y criticándose mutuamente en exceso. Necesitan cultivar la tolerancia, la calidez emocional y aprender a relajarse y disfrutar sin buscar la perfección en todo. Si lo hacen, su relación será estable y de apoyo.",
    score: 3
  },
  "Libra-Libra": {
    report: "Una relación entre dos Libra está llena de encanto, diplomacia, belleza y un profundo deseo de armonía. Ambos son sociables, amantes del arte y buscan el equilibrio en todo. Disfrutarán creando un entorno estético y de una vida social refinada. Se entienden en su aversión al conflicto. El problema surge cuando ambos evitan tomar decisiones difíciles o confrontar problemas por miedo a alterar la paz. La indecisión puede ser un gran obstáculo. Si aprenden a ser más asertivos y a enfrentar los desacuerdos de manera constructiva, pueden crear una unión verdaderamente hermosa y equitativa.",
    score: 4
  },
  "Scorpio-Scorpio": {
    report: "Cuando dos Escorpio se unen, la intensidad, la pasión y la conexión emocional son profundas y transformadoras. Ambos son leales, magnéticos y buscan una fusión total con su pareja. La comprensión intuitiva es muy fuerte. Sin embargo, esta misma intensidad puede llevar a luchas de poder, celos y una posesividad extrema. Ambos necesitan tener el control y pueden ser muy reservados con sus secretos. La confianza absoluta es fundamental, pero difícil de alcanzar si hay sospechas. Si logran trascender sus miedos y canalizar su poderosa energía hacia la creación y la sanación mutua, su vínculo será indestructible y profundamente espiritual.",
    score: 3
  },
  "Sagittarius-Sagittarius": {
    report: "Una pareja de Sagitario es una aventura constante, llena de optimismo, humor y un insaciable deseo de explorar el mundo y el conocimiento. Ambos son independientes, honestos y aman la libertad. Su relación será espontánea, divertida y llena de risas. Se entienden en su necesidad de espacio y crecimiento personal. El desafío es el compromiso a largo plazo y la atención a los detalles de la vida cotidiana. Pueden ser reacios a establecerse o a enfrentar responsabilidades. Si encuentran un propósito común que los inspire y aprenden a valorar la estabilidad junto con la aventura, su viaje juntos será inolvidable.",
    score: 4
  },
  "Capricorn-Capricorn": {
    report: "Dos Capricornio juntos forman una pareja poderosa, ambiciosa y muy enfocada en construir un futuro sólido y seguro. Ambos son trabajadores, disciplinados, prácticos y valoran la tradición y el estatus. Se respetan mutuamente por su determinación y su capacidad para alcanzar metas. Pueden ser un equipo formidable en los negocios y en la vida. Sin embargo, la relación puede volverse demasiado seria, competitiva o centrada en el trabajo, descuidando la parte emocional y la diversión. Necesitan aprender a relajarse, a expresar su afecto y a disfrutar de los logros juntos, no solo a planificarlos.",
    score: 3
  },
  "Aquarius-Aquarius": {
    report: "Una relación entre dos Acuario es intelectualmente estimulante, poco convencional y basada en una fuerte amistad y respeto por la individualidad. Ambos son progresistas, humanitarios, originales y valoran la libertad por encima de todo. Disfrutarán de conversaciones fascinantes, proyectos innovadores y una vida social llena de personas interesantes. La conexión emocional puede ser un desafío, ya que ambos tienden a ser algo desapegados y a racionalizar sus sentimientos. Necesitan hacer un esfuerzo consciente por cultivar la intimidad y la calidez. Si lo logran, su unión será única, libre y llena de inspiración mutua.",
    score: 4
  },
  "Pisces-Pisces": {
    report: "Cuando dos Piscis se unen, se crea un mundo de ensueño, compasión y una profunda conexión espiritual. Ambos son sensibles, intuitivos, románticos y artísticos. Se entienden a un nivel anímico y disfrutan escapando juntos de la dureza de la realidad. Su amor puede ser increíblemente tierno y sanador. El principal desafío es que ambos pueden ser demasiado idealistas, evasivos o perderse en sus emociones, descuidando los aspectos prácticos de la vida. Necesitan encontrar un ancla que los mantenga con los pies en la tierra y aprender a enfrentar los problemas en lugar de huir de ellos. Si lo hacen, su relación será un refugio mágico de amor incondicional.",
    score: 4
  },
  "Aries-Taurus": {
    report: "Aries, signo de fuego cardinal, y Tauro, signo de tierra fijo, representan dos energías muy distintas que, no obstante, pueden complementarse. Aries aporta la chispa inicial, la iniciativa y el dinamismo, mientras que Tauro ofrece estabilidad, paciencia y una visión práctica. En un entorno profesional, esta combinación puede ser poderosa. Aries puede generar ideas innovadoras y Tauro se encarga de darles forma y llevarlas a la práctica de manera organizada y persistente. El desafío reside en que Aries aprenda a valorar la meticulosidad de Tauro, y Tauro se abra a la espontaneidad de Aries. Si logran encontrar un punto medio, su colaboración será exitosa. La clave es la comunicación y el respeto mutuo por sus diferencias.\n\nEn el ámbito amoroso, la compatibilidad entre Aries y Tauro puede ser compleja pero gratificante. Aries se siente atraído por la solidez y la sensualidad de Tauro, mientras que Tauro admira la pasión y la energía de Aries. Sin embargo, sus diferentes ritmos y necesidades pueden generar conflictos. Aries busca la aventura y la novedad, mientras que Tauro anhela la seguridad y la rutina. Para que la relación funcione, Aries debe aprender a ser más paciente y considerado con las necesidades de Tauro, y Tauro debe esforzarse por ser más flexible y abierto a las experiencias que propone Aries. Si ambos están dispuestos a ceder y a comprender al otro, su relación puede ser duradera y profundamente enriquecedora. La clave está en encontrar un equilibrio entre la pasión y la estabilidad, la aventura y la seguridad.",
    score: 3
  },
  "Aries-Gemini": {
    report: "Aries, con su energía de fuego y acción, encuentra en Géminis, un signo de aire mutable, un compañero estimulante y lleno de ideas. Ambos son curiosos y disfrutan de la novedad. Profesionalmente, esta es una dupla dinámica y creativa. Aries impulsa la acción y Géminis aporta versatilidad y habilidades comunicativas, ideal para brainstorming y proyectos que requieran agilidad mental. Pueden dispersarse si no hay un enfoque claro, pero su entusiasmo conjunto suele ser contagioso y productivo. Aries debe tener paciencia con la naturaleza cambiante de Géminis, y Géminis debe apreciar la franqueza de Aries.\n\nEn el amor, la relación entre Aries y Géminis es vivaz, divertida y llena de estímulos. Ambos disfrutan de la aventura, la conversación y la variedad. La chispa intelectual es fuerte. Aries admira la inteligencia y el ingenio de Géminis, mientras que Géminis se siente atraído por la pasión y la confianza de Aries. El principal desafío es mantener el interés a largo plazo y profundizar en el compromiso emocional. Si ambos cultivan la confianza y se dan espacio para sus intereses individuales, pueden disfrutar de una relación emocionante y libre de monotonía.",
    score: 4
  },
  "Aries-Cancer": {
    report: "La unión de Aries, fuego cardinal, con Cáncer, agua cardinal, es una mezcla de impulsividad y sensibilidad. Representan el día y la noche, la acción directa y la emoción profunda. Profesionalmente, pueden chocar debido a sus diferentes estilos de trabajo. Aries es directo y rápido, mientras que Cáncer es más cauteloso y necesita seguridad emocional en el entorno laboral. Sin embargo, si logran complementarse, Aries puede impulsar a Cáncer a tomar riesgos calculados, y Cáncer puede aportar una valiosa intuición y cuidado al equipo. El respeto por sus diferencias es fundamental.\n\nEn el terreno amoroso, Aries y Cáncer sienten una fuerte atracción inicial, pero la convivencia puede ser un desafío. Aries puede herir sin querer la sensibilidad de Cáncer con su franqueza, y Cáncer puede parecer demasiado dependiente o cambiante para el independiente Aries. Aries necesita aprender a ser más tierno y considerado, mientras que Cáncer debe esforzarse por comprender la necesidad de autonomía de Aries y no tomarse todo tan personal. Si logran construir un puente de comprensión y afecto, pueden ofrecerse mutuamente un gran aprendizaje y una relación protectora y estimulante.",
    score: 2
  },
  "Aries-Leo": {
    report: "Dos signos de fuego, Aries (cardinal) y Leo (fijo), forman una pareja explosiva, llena de pasión, entusiasmo y energía. Ambos son líderes natos, competitivos y aman ser el centro de atención. Profesionalmente, pueden ser un equipo imparable si logran coordinar sus egos y ambiciones. Juntos irradian confianza y son capaces de motivar a otros. Aries aporta la iniciativa y Leo la creatividad y el carisma. El principal desafío es evitar luchas de poder; si definen bien sus roles, el éxito está asegurado.\n\nEn el amor, la relación entre Aries y Leo es ardiente, dramática y muy divertida. Hay una admiración mutua y una gran atracción física. Ambos son generosos y les encanta agasajarse. Disfrutan de la aventura y de una vida social activa. Los conflictos pueden surgir por orgullo o por querer dominar. Necesitan aprender a ceder y a compartir el protagonismo. Si logran mantener viva la llama del respeto y la admiración, su relación será una celebración constante, llena de lealtad y pasión.",
    score: 5
  },
  "Aries-Virgo": {
    report: "Aries, el impetuoso signo de fuego, y Virgo, el meticuloso signo de tierra, presentan una combinación que requiere mucho ajuste. Aries es impulsivo y directo, mientras que Virgo es analítico, práctico y reservado. En el ámbito profesional, sus diferencias pueden ser una fuente de tensión o de gran complemento. Aries puede iniciar proyectos con entusiasmo, y Virgo puede encargarse de los detalles y la organización. Aries debe aprender a valorar la crítica constructiva de Virgo, y Virgo debe intentar ser menos crítico y más flexible con los métodos de Aries.\n\nEn el amor, Aries y Virgo pueden encontrar difícil entender las necesidades del otro. Aries puede percibir a Virgo como demasiado frío o crítico, mientras que Virgo puede ver a Aries como imprudente o desconsiderado. Sin embargo, Virgo puede ofrecer a Aries una base de estabilidad y cuidado práctico, y Aries puede ayudar a Virgo a salir de su rutina y a ser más espontáneo. La clave está en la paciencia, la comunicación y el deseo genuino de apreciar las cualidades únicas del otro. Si se esfuerzan, pueden construir una relación basada en el apoyo mutuo.",
    score: 2
  },
  "Aries-Libra": {
    report: "Aries, fuego cardinal, y Libra, aire cardinal, son signos opuestos en el zodíaco, lo que crea una atracción magnética y una dinámica de complementariedad. Aries es individualista y directo, mientras que Libra busca la armonía y la cooperación. Profesionalmente, pueden formar una excelente sociedad. Aries aporta la energía y la decisión, mientras que Libra ofrece diplomacia, estrategia y habilidades sociales. Aries puede ayudar a Libra a tomar decisiones, y Libra puede suavizar las asperezas de Aries. El desafío es equilibrar la necesidad de independencia de Aries con el deseo de unión de Libra.\n\nEn el amor, la atracción entre Aries y Libra es instantánea y poderosa. Aries se siente cautivado por el encanto y la elegancia de Libra, y Libra admira la confianza y la pasión de Aries. Su relación puede ser romántica y estimulante. Sin embargo, la impulsividad de Aries puede chocar con la indecisión de Libra, y la necesidad de complacer de Libra puede irritar al franco Aries. Si aprenden a negociar y a valorar sus diferencias como fortalezas complementarias, pueden disfrutar de una relación equilibrada y apasionada.",
    score: 4
  },
  "Aries-Scorpio": {
    report: "Aries y Escorpio tienen una dinámica compleja pero potencialmente gratificante. La comunicación es clave. Aries aporta pasión e impulsividad, mientras que Escorpio ofrece intensidad y profundidad emocional. En el trabajo, pueden chocar por el control, pero si unen fuerzas, su determinación combinada es imparable. Aries admira la tenacidad de Escorpio, y Escorpio puede verse energizado por el entusiasmo ariano. Necesitan respetar sus diferentes enfoques.\n\nEn el amor, la atracción es magnética y poderosa. Ambos son signos apasionados y directos, lo que puede llevar a una conexión intensa o a conflictos explosivos. La lealtad es fundamental para ambos. Aries debe aprender a manejar la naturaleza posesiva y a veces reservada de Escorpio, mientras que Escorpio debe dar a Aries espacio para su independencia. Si logran construir confianza y canalizar su energía conjunta, la relación puede ser transformadora y muy profunda.",
    score: 3
  },
  "Aries-Sagittarius": {
    report: "La combinación de Aries y Sagitario, ambos signos de fuego (cardinal y mutable respectivamente), es una de las más dinámicas y aventureras del zodíaco. Comparten un amor por la libertad, la exploración y el optimismo. Profesionalmente, forman un equipo entusiasta e innovador. Aries inicia con audacia y Sagitario expande con visión de futuro. Ambos son honestos y directos, lo que facilita la comunicación. El riesgo es que ambos pueden ser impacientes o pasar por alto detalles importantes. Necesitan un ancla de realidad para sus grandes ideas.\n\nEn el amor, Aries y Sagitario disfrutan de una relación llena de diversión, risas y aventura. Se entienden instintivamente y se dan mutuamente el espacio que necesitan. La honestidad y la independencia son valores compartidos. La pasión es alta y la vida juntos nunca es aburrida. El desafío puede ser el compromiso a largo plazo si ambos temen perder su libertad. Sin embargo, si encuentran un propósito común y cultivan la confianza, su unión será una fuente constante de alegría e inspiración.",
    score: 5
  },
  "Aries-Capricorn": {
    report: "Aries, el impulsivo fuego cardinal, y Capricornio, la ambiciosa tierra cardinal, forman una pareja de gran potencia pero con desafíos significativos. Ambos son líderes y muy determinados, pero sus estilos son opuestos. Aries es rápido y arriesgado, Capricornio es metódico y cauto. Profesionalmente, pueden lograr mucho si respetan sus roles. Aries puede ser el motor de arranque y Capricornio el estratega que asegura la solidez. La impaciencia de Aries puede chocar con la lentitud deliberada de Capricornio.\n\nEn el amor, la atracción puede ser fuerte debido al respeto mutuo por la fuerza del otro. Sin embargo, sus necesidades emocionales difieren. Aries busca pasión y espontaneidad, mientras que Capricornio valora la estabilidad y la previsibilidad. Aries puede percibir a Capricornio como frío o restrictivo, y Capricornio puede ver a Aries como inmaduro o irresponsable. Para que funcione, Aries debe apreciar la dedicación de Capricornio, y Capricornio debe abrirse a la calidez y el entusiasmo de Aries. Es una relación que requiere mucho trabajo y madurez de ambas partes.",
    score: 2
  },
  "Aries-Aquarius": {
    report: "Aries, fuego, y Acuario, aire, forman una combinación estimulante, innovadora y poco convencional. Ambos son independientes, aman la libertad y tienen una mentalidad progresista. Profesionalmente, son un dúo dinámico que puede generar ideas revolucionarias. Aries aporta la energía para iniciar, y Acuario la visión original y el enfoque humanitario. Disfrutan rompiendo moldes y pueden trabajar bien en proyectos vanguardistas. El desafío es mantener el enfoque y llevar las ideas a la práctica.\n\nEn el amor, Aries y Acuario disfrutan de una relación basada en la amistad, la libertad y el estímulo intelectual. No hay lugar para los celos ni la posesividad. Ambos valoran su independencia y se la otorgan mutuamente. La vida social es activa y disfrutan explorando nuevas ideas juntos. La conexión emocional puede necesitar un poco más de atención, ya que ambos pueden ser algo desapegados. Si cultivan la calidez y el afecto, además de su conexión mental, su relación será única y duradera.",
    score: 4
  },
  "Aries-Pisces": {
    report: "Aries, el fogoso pionero, y Piscis, el soñador empático, crean una mezcla de fuego y agua que puede ser tanto fascinante como desafiante. Aries es directo y asertivo, Piscis es sensible e intuitivo. Profesionalmente, sus enfoques son muy diferentes. Aries lidera con acción, Piscis con imaginación y compasión. Si logran colaborar, Aries puede ayudar a Piscis a materializar sus sueños, y Piscis puede aportar una perspectiva creativa y humana a los proyectos de Aries. La comunicación clara es vital para evitar malentendidos.\n\nEn el amor, Aries se siente atraído por la naturaleza gentil y misteriosa de Piscis, mientras que Piscis admira la fuerza y la confianza de Aries. Sin embargo, la rudeza involuntaria de Aries puede herir fácilmente al sensible Piscis, y la evasividad o pasividad de Piscis puede frustrar al directo Aries. Aries necesita cultivar la paciencia y la ternura, y Piscis debe aprender a expresar sus necesidades más claramente y a no tomarse las cosas de forma tan personal. Con mucho amor y comprensión, pueden crear una relación mágica y profundamente sanadora.",
    score: 3
  },
  "Taurus-Gemini": {
    report: "Tauro, signo de tierra fijo, y Géminis, signo de aire mutable, ofrecen una mezcla de estabilidad y variabilidad. Tauro busca seguridad y rutina, mientras que Géminis anhela estímulo y cambio. Profesionalmente, pueden complementarse si Tauro aporta la constancia y Géminis la adaptabilidad y las nuevas ideas. Tauro puede ayudar a Géminis a enfocarse, y Géminis puede evitar que Tauro se estanque. La comunicación es clave para armonizar sus diferentes ritmos de trabajo.\n\nEn el amor, la relación entre Tauro y Géminis requiere comprensión. Tauro, regido por Venus, valora la sensualidad y la conexión física, mientras que Géminis, regido por Mercurio, prioriza el estímulo intelectual y la conversación. Tauro puede encontrar a Géminis demasiado inconstante o superficial, y Géminis puede percibir a Tauro como posesivo o aburrido. Si Tauro aprende a apreciar la chispa y la ligereza de Géminis, y Géminis valora la lealtad y el afecto profundo de Tauro, pueden encontrar un punto medio enriquecedor.",
    score: 3
  },
  "Taurus-Cancer": {
    report: "Tauro, tierra, y Cáncer, agua, forman una combinación naturalmente armoniosa. Ambos signos valoran la seguridad, el hogar, la familia y disfrutan de los placeres sencillos de la vida. Profesionalmente, trabajan bien juntos, creando un ambiente stable y nutritivo. Tauro aporta practicidad y perseverancia, mientras que Cáncer ofrece intuición y cuidado por el equipo. Son capaces de construir proyectos sólidos y duraderos, basados en la confianza mutua.\n\nEn el amor, Tauro y Cáncer tienen una alta compatibilidad. Ambos son sensuales, afectuosos y buscan una relación comprometida y segura. Tauro ofrece a Cáncer la estabilidad emocional que anhela, y Cáncer colma a Tauro de cariño y cuidados. Disfrutan creando un hogar acogedor y compartiendo momentos íntimos. Los posibles desacuerdos suelen ser menores y se resuelven con comprensión. Esta es una unión que promete ser tierna, leal y profundamente satisfactoria.",
    score: 5
  },
  "Taurus-Leo": {
    report: "Tauro, tierra fija, y Leo, fuego fijo, son dos signos de gran voluntad y personalidades fuertes, lo que puede generar tanto una atracción poderosa como conflictos por terquedad. Ambos aprecian el lujo, la belleza y la lealtad. Profesionalmente, pueden ser un equipo poderoso si logran alinear sus objetivos. Tauro aporta la tenacidad y el enfoque práctico, mientras que Leo ofrece carisma, creatividad y liderazgo. El desafío es evitar las luchas de poder y el choque de egos. Si se respetan, pueden alcanzar grandes logros.\n\nEn el amor, Tauro y Leo comparten un gusto por los placeres de la vida y una naturaleza apasionada. Leo admira la solidez y la sensualidad de Tauro, y Tauro se siente atraído por la generosidad y el brillo de Leo. Sin embargo, la necesidad de Leo de ser el centro de atención puede chocar con la naturaleza más reservada de Tauro, y la terquedad de ambos puede llevar a discusiones intensas. Si aprenden a ceder y a apreciar las contribuciones del otro, pueden construir una relación suntuosa, leal y muy estable.",
    score: 3
  },
  "Taurus-Virgo": {
    report: "Dos signos de tierra, Tauro (fijo) y Virgo (mutable), comparten una afinidad natural y una comprensión mutua. Ambos son prácticos, trabajadores, valoran la estabilidad y aprecian la calidad. Profesionalmente, forman un equipo altamente eficiente y productivo. Tauro aporta la perseverancia y la visión a largo plazo, mientras que Virgo ofrece análisis detallado, organización y una ética de trabajo impecable. Juntos, pueden llevar cualquier proyecto al éxito con meticulosidad y dedicación.\n\nEn el amor, la relación entre Tauro y Virgo es sólida, tranquila y basada en el respeto mutuo. Ambos buscan una conexión stable y significativa. Tauro aprecia la inteligencia y la devoción de Virgo, y Virgo admira la fiabilidad y la sensualidad de Tauro. Disfrutan de una vida hogareña confortable y de placeres sencillos. Aunque no sea la pareja más explosivamente pasional, su amor es profundo, leal y duradero. La comunicación honesta y el cuidado mutuo son las claves de su felicidad compartida.",
    score: 5
  },
  "Taurus-Libra": {
    report: "Tauro y Libra, ambos regidos por Venus, comparten un amor por la belleza, el arte, el placer y la armonía. Tauro es tierra fija, Libra es aire cardinal. Profesionalmente, su colaboración puede ser muy estética y orientada a la calidad. Tauro aporta la capacidad de materializar ideas y Libra la diplomacia y el sentido de la estética. Pueden tener dificultades si Tauro se vuelve demasiado obstinado o Libra demasiado indeciso. La paciencia y la búsqueda de un terreno común son esenciales.\n\nEn el amor, Tauro y Libra se sienten atraídos por el refinamiento y el encanto del otro. Disfrutan de ambientes hermosos, buena comida y compañía agradable. Tauro ofrece seguridad y sensualidad, mientras que Libra aporta romance y sociabilidad. El desafío radica en sus diferentes enfoques: Tauro es más práctico y posesivo, Libra más idealista y necesita interacción social. Si Tauro puede dar a Libra espacio y Libra puede ofrecer a Tauro la seguridad que necesita, su relación puede ser muy placentera y armoniosa.",
    score: 4
  },
  "Taurus-Scorpio": {
    report: "Tauro y Escorpio son signos opuestos en el zodíaco, lo que genera una atracción intensa y una dinámica poderosa. Tauro es tierra fija, Escorpio es agua fija. Ambos son determinados, leales y posesivos. Profesionalmente, si unen fuerzas, son imparables. Tauro aporta la constancia y la habilidad para construir, mientras que Escorpio ofrece la profundidad estratégica y la capacidad de transformación. Pueden surgir luchas de poder, pero su respeto mutuo por la fuerza del otro es grande.\n\nEn el amor, la relación entre Tauro y Escorpio es profundamente apasionada, sensual y a menudo transformadora. La conexión es magnética y la lealtad es primordial. Tauro ofrece a Escorpio la estabilidad y el afecto físico que anhela, mientras que Escorpio aporta una intensidad emocional y una profundidad que fascina a Tauro. Los celos y la terquedad pueden ser los mayores desafíos. Si aprenden a confiar plenamente y a canalizar su poderosa energía conjunta, pueden forjar un vínculo inquebrantable.",
    score: 4
  },
  "Taurus-Sagittarius": {
    report: "Tauro, el práctico signo de tierra, y Sagitario, el aventurero signo de fuego, tienen enfoques de vida muy diferentes. Tauro busca seguridad y estabilidad, mientras que Sagitario anhela libertad y exploración. Profesionalmente, esta diferencia puede ser un desafío. Tauro es metódico y persistente, Sagitario es visionario pero a veces inconsistente. Tauro puede ayudar a Sagitario a concretar sus ideas, y Sagitario puede inspirar a Tauro a salir de su zona de confort. Se requiere mucha paciencia y respeto por los métodos del otro.\n\nEn el amor, Tauro y Sagitario pueden encontrar difícil conciliar sus necesidades. Tauro desea un hogar tranquilo y una rutina predecible, mientras que Sagitario busca constantemente nuevas experiencias. Sagitario puede percibir a Tauro como demasiado posesivo o materialista, y Tauro puede ver a Sagitario como irresponsable o poco comprometido. Sin embargo, si Tauro se abre a la aventura y Sagitario aprende a valorar la seguridad y el afecto que Tauro ofrece, pueden aprender mucho el uno del otro y ampliar sus horizontes.",
    score: 2
  },
  "Taurus-Capricorn": {
    report: "Tauro y Capricornio, ambos signos de tierra (fijo y cardinal respectivamente), forman una de las combinaciones más sólidas y compatibles del zodíaco. Comparten valores como la ambición, la practicidad, la lealtad y el deseo de seguridad material y emocional. Profesionalmente, son un equipo formidable. Tauro aporta la perseverancia y la habilidad para construir, mientras que Capricornio ofrece la estrategia, la disciplina y el liderazgo. Juntos, pueden alcanzar grandes metas y construir un imperio duradero.\n\nEn el amor, la relación entre Tauro y Capricornio es estable, segura y basada en un profundo respeto mutuo. Ambos son realistas sobre el amor y buscan un compañero confiable para construir un futuro juntos. Tauro admira la fortaleza y la determinación de Capricornio, y Capricornio valora la sensualidad y la lealtad de Tauro. Su hogar será un refugio de confort y tradición. Aunque pueden necesitar trabajar en la expresión emocional, su vínculo es profundo y muy duradero.",
    score: 5
  },
  "Taurus-Aquarius": {
    report: "Tauro, tierra fija, y Acuario, aire fijo, son dos signos con naturalezas muy diferentes y a menudo opuestas. Tauro es tradicional, práctico y busca seguridad, mientras que Acuario es progresista, intelectual y valora la libertad. Profesionalmente, sus enfoques pueden chocar. Tauro prefiere métodos probados, Acuario busca la innovación. Tauro puede ver a Acuario como poco práctico, y Acuario puede encontrar a Tauro demasiado rígido. Sin embargo, si se respetan, Tauro puede dar forma a las ideas de Acuario, y Acuario puede modernizar los enfoques de Tauro.\n\nEn el amor, Tauro y Acuario pueden tener dificultades para entenderse. Tauro busca una conexión física y emocional profunda, mientras que Acuario tiende a ser más desapegado y mental. La necesidad de Acuario de independencia puede chocar con la naturaleza posesiva de Tauro. Acuario puede encontrar a Tauro demasiado convencional, y Tauro puede ver a Acuario como errático o frío. Esta relación requiere un gran esfuerzo de ambas partes para aceptar y valorar sus diferencias fundamentales.",
    score: 1
  },
  "Taurus-Pisces": {
    report: "Tauro, tierra, y Piscis, agua, forman una combinación naturalmente afín y muy romántica. Tauro ofrece la estabilidad y el sentido práctico que Piscis necesita, mientras que Piscis aporta sensibilidad, imaginación y compasión a la vida de Tauro. Profesionalmente, pueden trabajar bien juntos si Tauro se encarga de la estructura y Piscis de la visión creativa y el ambiente humano. Tauro ayuda a Piscis a materializar sus sueños, y Piscis inspira a Tauro.\n\nEn el amor, la relación entre Tauro y Piscis es tierna, afectuosa y llena de comprensión. Tauro se siente atraído por la naturaleza dulce y soñadora de Piscis, y Piscis encuentra en Tauro un refugio seguro y un amor constante. Ambos son sensuales y disfrutan de la intimidad y la conexión emocional. Tauro puede ayudar a Piscis a mantenerse con los pies en la tierra, y Piscis puede enseñar a Tauro a conectar con sus emociones más profundas. Es una unión que promete ser armoniosa y espiritualmente enriquecedora.",
    score: 5
  },
  "Gemini-Cancer": {
    report: "Géminis, el versátil signo de aire, y Cáncer, el sensible signo de agua, presentan una dinámica interesante pero que requiere adaptación. Géminis es mental y comunicativo, mientras que Cáncer es emocional y protector. Profesionalmente, pueden complementarse si Géminis aporta las ideas y la comunicación, y Cáncer la intuición y el cuidado del equipo. Géminis necesita variedad, Cáncer estabilidad. Si Géminis es considerado con los sentimientos de Cáncer, y Cáncer no ahoga la necesidad de libertad de Géminis, pueden lograr buenos resultados.\n\nEn el amor, Géminis y Cáncer pueden tener enfoques diferentes. Géminis busca un compañero intelectual y divertido, Cáncer un nido seguro y emocional. Géminis puede encontrar a Cáncer demasiado necesitado o temperamental, y Cáncer puede percibir a Géminis como superficial o poco comprometido. Sin embargo, el ingenio de Géminis puede alegrar a Cáncer, y la ternura de Cáncer puede tocar el corazón de Géminis. Necesitan mucha comunicación y paciencia para construir un entendimiento mutuo.",
    score: 3
  },
  "Gemini-Leo": {
    report: "Géminis, aire mutable, y Leo, fuego fijo, forman una pareja sociable, divertida y llena de chispa. Ambos disfrutan de la interacción, el entretenimiento y la novedad. Profesionalmente, son un dúo creativo y carismático. Géminis aporta ideas brillantes y habilidades comunicativas, mientras que Leo ofrece liderazgo, entusiasmo y un toque de dramatismo. Juntos pueden ser muy persuasivos y exitosos en proyectos que requieran ingenio y presentación. Deben cuidar no competir por el protagonismo.\n\nEn el amor, la relación entre Géminis y Leo es estimulante y juguetona. Géminis admira la confianza y la generosidad de Leo, y Leo se siente fascinado por la inteligencia y el encanto de Géminis. Disfrutan de una vida social activa y de conversaciones animadas. Leo necesita admiración, que Géminis puede ofrecer con su elocuencia, y Géminis necesita variedad, que Leo puede proporcionar con su creatividad. Si Leo no se vuelve demasiado demandante y Géminis ofrece la lealtad que Leo valora, su relación será brillante y alegre.",
    score: 4
  },
  "Gemini-Virgo": {
    report: "Géminis y Virgo, ambos regidos por Mercurio, comparten una agudeza mental y un amor por la comunicación, pero sus naturalezas (aire mutable y tierra mutable) los hacen abordar las cosas de manera diferente. Géminis es versátil y disperso, Virgo es analítico y detallista. Profesionalmente, pueden ser un equipo intelectualmente poderoso si logran sincronizar sus estilos. Géminis puede generar ideas y Virgo puede perfeccionarlas y llevarlas a la práctica. La crítica de Virgo puede herir la sensibilidad de Géminis si no se expresa con cuidado.\n\nEn el amor, la conexión es primordialmente mental. Disfrutan de largas conversaciones y debates. Sin embargo, Géminis puede encontrar a Virgo demasiado crítico o preocupado por los detalles, mientras que Virgo puede ver a Géminis como inconstante o poco práctico. Virgo busca orden y Géminis variedad. Si ambos aprecian la inteligencia del otro y están dispuestos a hacer concesiones – Géminis ofreciendo más constancia y Virgo siendo más flexible – pueden construir una relación basada en una estimulante compañía intelectual.",
    score: 3
  },
  "Gemini-Libra": {
    report: "Géminis, un signo de aire mutable, y Libra, un signo de aire cardinal, suelen encontrar una conexión intelectual y social estimulante. Ambos valoran la comunicación, la variedad y las nuevas ideas. En el ámbito profesional, su colaboración puede ser muy creativa y diplomática. Géminis aporta la versatilidad y la capacidad de generar múltiples opciones, mientras que Libra ofrece una perspectiva equilibrada y la habilidad para negociar. El desafío puede surgir si Géminis se dispersa demasiado o si Libra tarda en tomar decisiones. La clave es que Géminis se comprometa con un enfoque y que Libra confíe en la agilidad mental de Géminis.\n\nEn el amor, Géminis y Libra disfrutan de una relación ligera, divertida y llena de conversaciones interesantes. Ambos son sociables y les gusta explorar el mundo juntos. Géminis se siente atraído por el encanto y la elegancia de Libra, y Libra admira la inteligencia y el ingenio de Géminis. Sin embargo, pueden necesitar trabajar en la profundidad emocional y el compromiso a largo plazo. Géminis debe asegurar a Libra su constancia, y Libra debe dar a Géminis el espacio y la libertad que necesita. Si cultivan la conexión emocional además de la intelectual, su unión puede ser muy feliz y duradera.",
    score: 5
  },
  "Gemini-Scorpio": {
    report: "Géminis, aire mutable, y Escorpio, agua fija, representan una combinación intrigante y a menudo intensa. Géminis es ligero, curioso y comunicativo, mientras que Escorpio es profundo, reservado y apasionado. Profesionalmente, sus estilos son muy diferentes. Géminis usa la lógica y la adaptabilidad, Escorpio la estrategia y la determinación. Escorpio puede encontrar a Géminis superficial, y Géminis puede ver a Escorpio como demasiado controlador. Sin embargo, si se respetan, Géminis puede aportar nuevas perspectivas y Escorpio la capacidad de investigación.\n\nEn el amor, la atracción puede ser magnética debido al misterio. Géminis se siente intrigado por la intensidad de Escorpio, y Escorpio puede ser atraído por la vivacidad de Géminis. Sin embargo, la necesidad de Escorpio de profundidad emocional y posesividad puede chocar con la ligereza y la necesidad de libertad de Géminis. Escorpio busca fusionarse, Géminis explorar. Para que funcione, Géminis debe estar dispuesto a profundizar y Escorpio a ofrecer más espacio y confianza. Es una relación que puede ser transformadora si ambos están dispuestos al desafío.",
    score: 2
  },
  "Gemini-Sagittarius": {
    report: "Géminis y Sagitario son signos opuestos, ambos mutables (aire y fuego respectivamente), lo que crea una atracción dinámica y una relación llena de estímulo y aventura. Ambos son curiosos, aman aprender, viajar y socializar. Profesionalmente, son un equipo muy creativo y visionario. Géminis aporta la comunicación y la generación de ideas, Sagitario la visión amplia y el entusiasmo. Pueden tener muchas ideas, pero necesitan enfocarse para concretarlas. Su honestidad directa puede ser tanto una ventaja como un punto de fricción.\n\nEn el amor, Géminis y Sagitario disfrutan de una relación vivaz, optimista y libre. Se entienden mutuamente en su necesidad de independencia y exploración. Las conversaciones son interminables y llenas de humor. El desafío puede ser el compromiso y la atención a los detalles de la vida cotidiana. Si ambos valoran la libertad del otro y encuentran un terreno común en sus intereses intelectuales y aventureros, su relación será una fuente constante de crecimiento y diversión.",
    score: 4
  },
  "Gemini-Capricorn": {
    report: "Géminis, el adaptable signo de aire, y Capricornio, el estructurado signo de tierra, tienen enfoques de vida muy diferentes. Géminis es juguetón, versátil y busca estímulo mental, mientras que Capricornio es serio, disciplinado y orientado a metas. Profesionalmente, pueden encontrar difícil trabajar juntos al principio. Géminis puede ver a Capricornio como demasiado rígido o lento, y Capricornio puede percibir a Géminis como poco fiable o superficial. Sin embargo, si se esfuerzan, Géminis puede aportar ideas frescas y Capricornio la estructura para implementarlas.\n\nEn el amor, esta es una combinación que requiere mucho trabajo. Géminis busca diversión y variedad, Capricornio seguridad y tradición. La necesidad de libertad de Géminis puede chocar con el deseo de control de Capricornio. Capricornio puede ofrecer a Géminis una estabilidad que le falta, y Géminis puede enseñar a Capricornio a relajarse y disfrutar más de la vida. La paciencia, la comunicación y una genuina voluntad de comprender las necesidades del otro son cruciales para el éxito de esta unión.",
    score: 2
  },
  "Gemini-Aquarius": {
    report: "Dos signos de aire, Géminis (mutable) y Acuario (fijo), forman una pareja altamente compatible, basada en la amistad, el intelecto y una visión progresista de la vida. Ambos son curiosos, comunicativos, originales y valoran la libertad. Profesionalmente, son un equipo innovador y brillante. Géminis aporta la versatilidad y las ideas, Acuario la visión humanitaria y la originalidad. Disfrutan trabajando en proyectos vanguardistas y pueden inspirarse mutuamente. La comunicación fluye sin esfuerzo.\n\nEn el amor, Géminis y Acuario disfrutan de una relación estimulante, poco convencional y basada en una profunda conexión mental. No son excesivamente emocionales o posesivos, lo que les permite mantener su independencia. Su vida social es activa y comparten muchos intereses intelectuales. La clave de su felicidad es su mutuo respeto por la individualidad del otro y su capacidad para mantener viva la chispa de la novedad y la amistad. Es una unión que promete ser duradera y llena de descubrimientos.",
    score: 5
  },
  "Gemini-Pisces": {
    report: "Géminis, aire mutable, y Piscis, agua mutable, son dos signos de gran adaptabilidad pero con naturalezas muy diferentes, lo que puede llevar a una relación confusa o mágica. Géminis es lógico y comunicativo, Piscis es intuitivo y emocional. Profesionalmente, pueden tener dificultades para entenderse. Géminis busca hechos, Piscis percepciones. Sin embargo, la creatividad de Piscis puede inspirar a Géminis, y la elocuencia de Géminis puede ayudar a Piscis a expresar sus ideas. Necesitan claridad y límites.\n\nEn el amor, Géminis y Piscis pueden sentirse atraídos por el misterio y la sensibilidad del otro. Géminis puede encontrar fascinante la imaginación de Piscis, y Piscis puede sentirse cautivado por el ingenio de Géminis. Sin embargo, la necesidad de Piscis de una conexión emocional profunda puede chocar con la naturaleza más desapegada y mental de Géminis. Géminis puede herir sin querer la sensibilidad de Piscis. Si Géminis aprende a ser más empático y Piscis más directo en su comunicación, pueden encontrar un terreno común en su mutua creatividad y compasión.",
    score: 3
  },
  "Cancer-Leo": {
    report: "Cáncer, agua cardinal, y Leo, fuego fijo, son vecinos en el zodíaco y pueden formar una pareja cálida y protectora, aunque con algunas diferencias clave. Cáncer busca seguridad emocional y un hogar confortable, mientras que Leo anhela admiración y expresión creativa. Profesionalmente, si Leo lidera con generosidad y Cáncer apoya con lealtad e intuición, pueden ser muy efectivos. Leo aporta el brillo y Cáncer el cuidado. Deben evitar que el dramatismo de Leo abrume la sensibilidad de Cáncer.\n\nEn el amor, Cáncer se siente atraído por la calidez y la confianza de Leo, y Leo aprecia la devoción y el cariño de Cáncer. Leo ama ser el centro de atención, y Cáncer disfruta cuidando a sus seres queridos. Los desafíos surgen si Leo se vuelve demasiado egocéntrico o Cáncer demasiado posesivo o susceptible. Si Leo ofrece seguridad y reconocimiento a Cáncer, y Cáncer admira y apoya a Leo, pueden construir un hogar lleno de amor, lealtad y creatividad.",
    score: 4
  },
  "Cancer-Virgo": {
    report: "Cáncer, agua, y Virgo, tierra, forman una combinación armoniosa y de apoyo mutuo. Ambos son signos que valoran el cuidado, la seguridad y tienden a ser serviciales. Profesionalmente, trabajan bien juntos, creando un ambiente productivo y bien organizado. Cáncer aporta intuición y empatía, mientras que Virgo ofrece análisis práctico y atención al detalle. Se complementan de manera eficiente, Virgo ayudando a Cáncer a ser más objetivo y Cáncer aportando calidez al enfoque de Virgo.\n\nEn el amor, Cáncer y Virgo pueden construir una relación sólida y afectuosa. Cáncer aprecia la dedicación y la inteligencia de Virgo, y Virgo valora la ternura y la lealtad de Cáncer. Ambos son hogareños y disfrutan cuidando el uno del otro. Virgo puede ayudar a Cáncer a manejar sus emociones, y Cáncer puede enseñar a Virgo a ser más expresivo emocionalmente. Suelen ser muy leales y comprometidos, buscando construir un futuro estable juntos. La comunicación honesta sobre sus necesidades es clave.",
    score: 4
  },
  "Cancer-Libra": {
    report: "Cáncer, agua cardinal, y Libra, aire cardinal, son dos signos que buscan armonía pero desde perspectivas diferentes. Cáncer anhela seguridad emocional y un hogar, Libra busca equilibrio en las relaciones y belleza estética. Profesionalmente, pueden chocar debido a sus enfoques. Cáncer es más intuitivo y emocional, Libra más lógico y diplomático. Si logran encontrar un punto medio, Cáncer puede aportar sensibilidad y Libra habilidades sociales y estratégicas. La toma de decisiones puede ser lenta si Cáncer se retrae o Libra duda.\n\nEn el amor, Cáncer y Libra se sienten atraídos por la amabilidad y el deseo de compañía del otro. Ambos son románticos y disfrutan creando un ambiente agradable. Sin embargo, la necesidad de Cáncer de profunda conexión emocional puede ser abrumadora para el más sociable y mental Libra. Libra puede encontrar a Cáncer demasiado posesivo o malhumorado, y Cáncer puede percibir a Libra como superficial o indeciso. Necesitan trabajar en la comunicación de sus necesidades emocionales y encontrar un equilibrio entre el hogar y la vida social.",
    score: 3
  },
  "Cancer-Scorpio": {
    report: "Dos signos de agua, Cáncer (cardinal) y Escorpio (fijo), comparten una profunda conexión emocional e intuitiva. Ambos son leales, protectores y buscan intensidad en sus relaciones. Profesionalmente, son un equipo poderoso y perceptivo. Cáncer aporta sensibilidad y cuidado, mientras que Escorpio ofrece determinación y una visión estratégica profunda. Se entienden casi sin palabras y pueden trabajar con gran dedicación en objetivos comunes, especialmente si tienen un componente emocional o de ayuda a otros.\n\nEn el amor, la compatibilidad entre Cáncer y Escorpio es una de las más fuertes y profundas del zodíaco. Se entienden a un nivel anímico. Ambos anhelan una fusión emocional total y son ferozmente leales y protectores con su pareja. La pasión es intensa y la conexión muy íntima. Los desafíos pueden surgir de la posesividad de ambos o de la tendencia de Escorpio a ser reservado y de Cáncer a ser susceptible. Sin embargo, su capacidad de amarse profundamente suele superar cualquier obstáculo.",
    score: 5
  },
  "Cancer-Sagittarius": {
    report: "Cáncer, el hogareño signo de agua, y Sagitario, el aventurero signo de fuego, tienen necesidades y estilos de vida muy diferentes. Cáncer busca seguridad y confort emocional, Sagitario anhela libertad y exploración. Profesionalmente, esta combinación puede ser difícil. Cáncer prefiere un ambiente estable, Sagitario necesita variedad y desafíos. Sagitario puede encontrar a Cáncer demasiado cauteloso, y Cáncer puede ver a Sagitario como poco fiable o insensible. Sin embargo, el optimismo de Sagitario puede animar a Cáncer, y la intuición de Cáncer puede guiar a Sagitario.\n\nEn el amor, Cáncer y Sagitario deben esforzarse mucho para entenderse. La necesidad de Sagitario de independencia y aventura puede hacer que Cáncer se sienta inseguro y abandonado. La franqueza de Sagitario puede herir la sensibilidad de Cáncer. Cáncer necesita mimos y seguridad, Sagitario espacio y estímulo. Si Sagitario aprende a ser más considerado con los sentimientos de Cáncer, y Cáncer le da a Sagitario la libertad que necesita, pueden aprender valiosas lecciones el uno del otro, pero requiere mucha madurez y compromiso.",
    score: 2
  },
  "Cancer-Capricorn": {
    report: "Cáncer, un signo de agua cardinal, y Capricornio, un signo de tierra cardinal, son opuestos en el zodíaco, lo que puede generar una atracción poderosa o una tensión considerable. Cáncer es emocional, nutritivo y busca seguridad, mientras que Capricornio es práctico, ambicioso y orientado a los logros. En el trabajo, pueden formar un equipo muy efectivo si aprenden a valorar sus diferencias. Cáncer puede aportar la intuición y el cuidado por el equipo, mientras que Capricornio ofrece estructura, disciplina y una visión a largo plazo. El desafío está en que Cáncer no se sienta desatendido por la dedicación de Capricornio al trabajo, y que Capricornio aprecie la sensibilidad de Cáncer.\n\nEn las relaciones amorosas, Cáncer y Capricornio pueden ofrecerse mutuamente lo que al otro le falta. Cáncer anhela la estabilidad y el compromiso que Capricornio puede proporcionar, y Capricornio se siente nutrido por el afecto y la calidez de Cáncer. Sin embargo, la reserva emocional de Capricornio puede chocar con la necesidad de expresión afectiva de Cáncer. Para que la relación prospere, Capricornio necesita abrirse emocionalmente, y Cáncer debe comprender la naturaleza reservada y las ambiciones de Capricornio. Si logran este equilibrio, pueden construir un hogar sólido y una vida familiar estable.",
    score: 4
  },
  "Cancer-Aquarius": {
    report: "Cáncer, agua, y Acuario, aire, forman una combinación inusual que requiere mucha comprensión. Cáncer es emocional, tradicional y busca intimidad, mientras que Acuario es intelectual, progresista y valora la libertad y la amistad. Profesionalmente, sus enfoques son distintos. Cáncer se guía por la intuición y las relaciones, Acuario por la lógica y las ideas innovadoras. Acuario puede parecer demasiado desapegado para Cáncer, y Cáncer puede resultar demasiado emocional para Acuario. Si se respetan, Cáncer puede aportar humanidad y Acuario originalidad.\n\nEn el amor, Cáncer y Acuario pueden tener dificultades para conectar a un nivel profundo. Cáncer necesita demostraciones constantes de afecto y seguridad, mientras que Acuario expresa el amor de una manera más distante y universal. La necesidad de Cáncer de un hogar acogedor puede chocar con el deseo de Acuario de socializar y explorar. Acuario puede encontrar a Cáncer demasiado dependiente, y Cáncer puede sentirse incomprendido por la naturaleza independiente de Acuario. Esta relación necesita mucha tolerancia y un esfuerzo genuino por aceptar las diferencias.",
    score: 2
  },
  "Cancer-Pisces": {
    report: "Dos signos de agua, Cáncer (cardinal) y Piscis (mutable), comparten una profunda conexión emocional, intuitiva y compasiva. Ambos son sensibles, románticos y anhelan una unión espiritual. Profesionalmente, pueden crear un ambiente de trabajo muy inspirador y solidario, especialmente en campos creativos o de ayuda. Cáncer aporta la tenacidad para iniciar y proteger, mientras que Piscis ofrece imaginación y empatía. Se entienden bien y se apoyan mutuamente en sus esfuerzos.\n\nEn el amor, la relación entre Cáncer y Piscis es mágica, tierna y profundamente satisfactoria. Se entienden a un nivel anímico y comparten una gran capacidad de amar y cuidar. Ambos son muy románticos y disfrutan creando un mundo de ensueño juntos. Cáncer ofrece a Piscis la seguridad que necesita, y Piscis colma a Cáncer de afecto y comprensión. El único riesgo es que ambos pueden ser demasiado sensibles o evasivos ante los problemas. Si cultivan la comunicación abierta, su amor será un refugio de paz y felicidad.",
    score: 5
  },
  "Leo-Virgo": {
    report: "Leo, el exuberante signo de fuego, y Virgo, el práctico signo de tierra, forman una pareja que combina brillo y eficiencia, aunque con ajustes. Leo es expansivo y busca admiración, Virgo es reservado y busca la perfección. Profesionalmente, pueden ser un equipo efectivo si Leo lidera con carisma y Virgo organiza con meticulosidad. Leo puede inspirar a Virgo, y Virgo puede ayudar a Leo a concretar sus ideas y a prestar atención a los detalles. Leo debe evitar ser demasiado autoritario, y Virgo no ser excesivamente crítico.\n\nEn el amor, Leo se siente atraído por la inteligencia y la dedicación de Virgo, mientras que Virgo admira la confianza y la calidez de Leo. Sin embargo, la necesidad de Leo de ser el centro de atención puede chocar con la modestia de Virgo. Virgo puede encontrar a Leo algo egocéntrico, y Leo puede ver a Virgo como demasiado crítico o frío. Si Leo aprende a apreciar el servicio y el afecto discreto de Virgo, y Virgo se permite disfrutar del brillo y la generosidad de Leo, pueden construir una relación estable y afectuosa.",
    score: 3
  },
  "Leo-Libra": {
    report: "Leo, fuego fijo, y Libra, aire cardinal, forman una pareja encantadora, sociable y amante de la belleza y el placer. Ambos disfrutan de la vida social, el arte y las relaciones armoniosas. Profesionalmente, son un dúo carismático y diplomático. Leo aporta liderazgo y creatividad, mientras que Libra ofrece estrategia, habilidades sociales y un sentido estético refinado. Juntos pueden ser muy exitosos en relaciones públicas, eventos o cualquier campo que requiera estilo y persuasión.\n\nEn el amor, la relación entre Leo y Libra es romántica, elegante y llena de admiración mutua. Leo se siente atraído por el encanto y la gracia de Libra, y Libra admira la confianza y la generosidad de Leo. Disfrutan de una vida social activa y de agasajarse mutuamente. Leo necesita ser el centro de atención, y Libra sabe cómo hacerlo sentir especial. Libra busca armonía, y Leo ofrece calidez y pasión. Si ambos mantienen viva la llama del romance y el respeto, su unión será brillante y feliz.",
    score: 5
  },
  "Leo-Scorpio": {
    report: "Leo, fuego fijo, y Escorpio, agua fija, son dos signos de gran poder, voluntad y magnetismo, lo que crea una atracción intensa pero también una potencial lucha de titanes. Ambos son orgullosos, determinados y apasionados. Profesionalmente, si logran unir sus fuerzas sin competir, son invencibles. Leo aporta el liderazgo carismático y la visión, Escorpio la estrategia profunda y la tenacidad. Deben definir claramente sus roles para evitar conflictos de autoridad. Su ambición conjunta puede llevarlos muy lejos.\n\nEn el amor, la atracción entre Leo y Escorpio es eléctrica y profundamente pasional. Ambos son leales y esperan una devoción total. Sin embargo, la necesidad de Leo de admiración constante puede chocar con la naturaleza más reservada y a veces posesiva de Escorpio. Escorpio busca una fusión total, mientras que Leo necesita brillar individualmente. Los celos y las luchas de poder pueden ser un problema. Si aprenden a confiar, a respetar sus diferencias y a canalizar su inmensa energía de manera constructiva, su relación puede ser transformadora y muy poderosa.",
    score: 3
  },
  "Leo-Sagittarius": {
    report: "Leo y Sagitario, ambos signos de fuego (fijo y mutable), forman una pareja vibrante, optimista y llena de entusiasmo por la vida. Comparten un amor por la aventura, la diversión y la generosidad. Profesionalmente, son un equipo inspirador y dinámico. Leo aporta el liderazgo carismático y la creatividad, mientras que Sagitario ofrece la visión expansiva y el espíritu emprendedor. Juntos pueden motivar a otros y lanzar proyectos audaces con gran energía. La comunicación es abierta y honesta.\n\nEn el amor, la relación entre Leo y Sagitario es apasionada, alegre y llena de risas. Se admiran mutuamente y disfrutan explorando el mundo juntos. Leo ama la franqueza y el espíritu libre de Sagitario, y Sagitario se siente atraído por la calidez y la confianza de Leo. Ambos son generosos y les encanta disfrutar de la vida. El principal desafío es mantener la chispa sin caer en la rutina y respetar la necesidad de independencia de Sagitario. Si cultivan su amistad y su pasión, su unión será una aventura emocionante y duradera.",
    score: 5
  },
  "Leo-Capricorn": {
    report: "Leo, el radiante signo de fuego, y Capricornio, el serio signo de tierra, representan una combinación de ambición y poder, pero con estilos muy diferentes. Leo busca reconocimiento y disfruta del presente, Capricornio es reservado y planifica a largo plazo. Profesionalmente, pueden ser un equipo formidable si Leo acepta la guía estratégica de Capricornio y Capricornio valora el carisma y la capacidad de Leo para inspirar. Leo puede ser el rostro público y Capricornio el cerebro detrás de las operaciones. Deben respetar sus diferentes ritmos.\n\nEn el amor, Leo y Capricornio sienten un respeto mutuo por la fortaleza y la ambición del otro. Sin embargo, la necesidad de Leo de afecto y admiración constantes puede no ser satisfecha por el más reservado Capricornio. Leo puede encontrar a Capricornio demasiado frío o controlador, y Capricornio puede ver a Leo como extravagante o superficial. Si Leo aprende a valorar la lealtad y el compromiso profundo de Capricornio, y Capricornio se permite disfrutar de la calidez y la alegría de Leo, pueden construir una relación sólida y poderosa, basada en el respeto y metas compartidas.",
    score: 3
  },
  "Leo-Aquarius": {
    report: "Leo, fuego fijo, y Acuario, aire fijo, son signos opuestos en el zodíaco, lo que genera una fuerte atracción y una dinámica de complementariedad. Leo es personal y busca el reconocimiento individual, Acuario es impersonal y busca el bien colectivo. Profesionalmente, pueden ser un dúo innovador y carismático. Leo aporta el liderazgo y la creatividad, Acuario la originalidad y la visión de futuro. Juntos pueden liderar proyectos vanguardistas. El desafío es que Leo no se sienta ignorado por el enfoque más grupal de Acuario.\n\nEn el amor, la relación entre Leo y Acuario es estimulante y poco convencional. Leo se siente atraído por la inteligencia y la originalidad de Acuario, y Acuario admira la confianza y la calidez de Leo. Ambos son sociables y disfrutan de una vida activa. Sin embargo, la necesidad de Leo de atención personal puede chocar con la naturaleza más desapegada e independiente de Acuario. Si Leo puede apreciar la amistad y la libertad que Acuario ofrece, y Acuario puede ofrecer a Leo la admiración y el afecto que necesita, su relación será vibrante y llena de sorpresas.",
    score: 4
  },
  "Leo-Pisces": {
    report: "Leo, el extrovertido signo de fuego, y Piscis, el sensible signo de agua, forman una pareja que combina el drama y el ensueño. Leo es seguro y busca brillar, Piscis es compasivo y busca la conexión espiritual. Profesionalmente, sus estilos son diferentes. Leo lidera con carisma, Piscis inspira con empatía. Leo puede ayudar a Piscis a ganar confianza, y Piscis puede suavizar el ego de Leo y aportar una visión creativa. Necesitan apreciar sus fortalezas mutuas para colaborar eficazmente.\n\nEn el amor, Leo se siente atraído por la naturaleza gentil y misteriosa de Piscis, y Piscis admira la fuerza y la generosidad de Leo. Leo puede ofrecer a Piscis protección y un mundo de fantasía, mientras que Piscis puede ofrecer a Leo una devoción y una comprensión emocional profundas. Los desafíos surgen si Leo se vuelve demasiado dominante o insensible, o si Piscis se retrae en su mundo interior. Si Leo aprende a ser más tierno y Piscis más expresivo, pueden crear una relación mágica, llena de romance y apoyo mutuo.",
    score: 3
  },
  "Virgo-Libra": {
    report: "Virgo, tierra mutable, y Libra, aire cardinal, pueden formar una pareja agradable y refinada si logran equilibrar sus diferencias. Virgo es práctico y analítico, Libra es sociable y busca la armonía. Profesionalmente, pueden colaborar bien en proyectos que requieran atención al detalle y habilidades sociales. Virgo aporta la organización y la eficiencia, Libra la diplomacia y el sentido estético. Virgo debe cuidar no ser demasiado crítico, y Libra evitar la indecisión.\n\nEn el amor, Virgo y Libra comparten un gusto por la belleza y el orden. Virgo se siente atraído por el encanto y la amabilidad de Libra, y Libra admira la inteligencia y la dedicación de Virgo. Sin embargo, Virgo puede encontrar a Libra demasiado superficial o perezoso, y Libra puede ver a Virgo como excesivamente crítico o preocupado. Si Virgo aprende a relajarse y disfrutar más, y Libra se esfueraza por ser más práctico y decidido, pueden construir una relación armoniosa, basada en el respeto y la compañía agradable.",
    score: 4
  },
  "Virgo-Scorpio": {
    report: "Virgo, tierra mutable, y Escorpio, agua fija, forman una combinación potente y perceptiva. Ambos son analíticos, inteligentes y buscan la profundidad, aunque de maneras diferentes. Profesionalmente, son un equipo formidable. Virgo aporta la meticulosidad y la organización, Escorpio la estrategia, la determinación y la capacidad de investigación. Juntos pueden desentrañar problemas complejos y lograr resultados de alta calidad. Se respetan mutuamente por su inteligencia y dedicación.\n\nEn el amor, Virgo y Escorpio pueden desarrollar una conexión profunda y significativa. Virgo se siente atraído por la intensidad y la pasión de Escorpio, y Escorpio valora la lealtad y la inteligencia de Virgo. Ambos son reservados al principio, pero una vez que se comprometen, son muy leales. Virgo puede ayudar a Escorpio a analizar sus emociones, y Escorpio puede ayudar a Virgo a conectar con su lado más pasional. La comunicación honesta y la confianza son claves para superar la tendencia de Virgo a la crítica y la de Escorpio a los celos.",
    score: 4
  },
  "Virgo-Sagittarius": {
    report: "Virgo, el detallista signo de tierra, y Sagitario, el expansivo signo de fuego, son signos mutables que abordan la vida de maneras muy diferentes. Virgo es práctico y metódico, Sagitario es aventurero y filosófico. Profesionalmente, pueden chocar. Virgo se enfoca en los detalles, Sagitario en la visión general. Sagitario puede encontrar a Virgo demasiado quisquilloso, y Virgo puede ver a Sagitario como descuidado o irresponsable. Sin embargo, si aprenden a valorar sus diferencias, Virgo puede ayudar a Sagitario a ser más organizado, y Sagitario puede inspirar a Virgo a ampliar sus horizontes.\n\nEn el amor, Virgo y Sagitario necesitan mucha adaptación. Virgo busca orden y previsibilidad, Sagitario libertad y espontaneidad. La franqueza de Sagitario puede herir la sensibilidad de Virgo, y las preocupaciones de Virgo pueden aburrir a Sagitario. Para que funcione, Virgo debe aprender a ser más flexible y aventurero, y Sagitario a ser más considerado y atento a las necesidades de Virgo. Su relación puede ser un constante aprendizaje si ambos están dispuestos.",
    score: 2
  },
  "Virgo-Capricorn": {
    report: "Dos signos de tierra, Virgo (mutable) y Capricornio (cardinal), forman una pareja excepcionalmente compatible y estable. Ambos son prácticos, trabajadores, ambiciosos y valoran la seguridad y el orden. Profesionalmente, son un equipo invencible. Virgo aporta la organización, el análisis y la atención al detalle, mientras que Capricornio ofrece la estructura, la disciplina y la visión a largo plazo. Juntos, pueden construir y lograr cualquier cosa que se propongan con eficiencia y dedicación.\n\nEn el amor, la relación entre Virgo y Capricornio es sólida, leal y basada en un profundo entendimiento mutuo. Ambos son realistas y buscan un compañero confiable y comprometido. Virgo admira la fortaleza y la ambición de Capricornio, y Capricornio valora la inteligencia y la devoción de Virgo. Disfrutan de una vida tranquila y bien organizada. Aunque pueden necesitar esforzarse para expresar abiertamente sus emociones, su conexión es profunda y duradera, construida sobre la confianza y el respeto.",
    score: 5
  },
  "Virgo-Aquarius": {
    report: "Virgo, tierra mutable, y Acuario, aire fijo, son dos signos intelectuales pero con enfoques muy diferentes. Virgo es práctico, analítico y busca la perfección en los detalles, mientras que Acuario es original, humanitario y se enfoca en el panorama general. Profesionalmente, pueden complementarse si logran superar sus diferencias de estilo. Virgo puede ayudar a Acuario a estructurar sus ideas innovadoras, y Acuario puede inspirar a Virgo a pensar de manera más amplia. La comunicación debe ser clara para evitar malentendidos.\n\nEn el amor, Virgo y Acuario pueden encontrar difícil la conexión emocional. Virgo busca una demostración práctica de afecto y puede encontrar a Acuario demasiado desapegado o impredecible. Acuario valora la libertad y puede sentirse limitado por la necesidad de Virgo de orden y rutina. Sin embargo, ambos son inteligentes y pueden disfrutar de estimulantes conversaciones. Si Virgo aprecia la originalidad de Acuario y Acuario valora la dedicación de Virgo, pueden construir una relación basada en el respeto intelectual y la amistad.",
    score: 2
  },
  "Virgo-Pisces": {
    report: "Virgo y Piscis son signos opuestos en el zodíaco (tierra mutable y agua mutable), lo que crea una fuerte atracción y una dinámica de complementariedad. Virgo es práctico y analítico, Piscis es soñador y empático. Profesionalmente, pueden ser un excelente equipo si combinan sus fortalezas. Virgo aporta la organización y la atención al detalle, Piscis la creatividad y la intuición. Virgo puede ayudar a Piscis a materializar sus ideas, y Piscis puede inspirar a Virgo y suavizar su crítica.\n\nEn el amor, la relación entre Virgo y Piscis puede ser profundamente sanadora y romántica. Virgo se siente atraído por la sensibilidad y la compasión de Piscis, y Piscis encuentra en Virgo la estabilidad y el cuidado que necesita. Virgo puede ofrecer a Piscis un ancla en la realidad, y Piscis puede ayudar a Virgo a conectar con sus emociones y a ser menos autocrítico. El desafío es que Virgo no sea demasiado crítico con la naturaleza soñadora de Piscis, y que Piscis no se retraiga ante la practicidad de Virgo. Con amor y comprensión, su unión puede ser mágica.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "Libra, aire cardinal, y Escorpio, agua fija, forman una pareja intrigante y a menudo intensa. Libra busca armonía y conexión social, Escorpio anhela profundidad emocional y transformación. Profesionalmente, pueden ser un equipo poderoso si Libra aporta la diplomacia y las habilidades sociales, y Escorpio la estrategia y la determinación. Libra puede suavizar la intensidad de Escorpio, y Escorpio puede ayudar a Libra a tomar decisiones y a profundizar. Deben cuidar las luchas de poder sutiles.\n\nEn el amor, la atracción entre Libra y Escorpio es fuerte y magnética. Libra se siente atraído por el misterio y la pasión de Escorpio, y Escorpio valora el encanto y la inteligencia de Libra. Sin embargo, la necesidad de Escorpio de control y fusión emocional puede chocar con la naturaleza más ligera y sociable de Libra. Libra puede encontrar a Escorpio demasiado posesivo o celoso, y Escorpio puede ver a Libra como superficial o indeciso. Si Libra está dispuesto a explorar las profundidades emocionales y Escorpio a confiar y dar más espacio, su relación puede ser transformadora y muy apasionada.",
    score: 3
  },
  "Libra-Sagittarius": {
    report: "Libra, aire cardinal, y Sagitario, fuego mutable, forman una pareja sociable, optimista y amante de la diversión. Ambos disfrutan de la aventura, el aprendizaje y la interacción social. Profesionalmente, son un dúo creativo y entusiasta. Libra aporta diplomacia y un sentido de la justicia, Sagitario la visión y el espíritu emprendedor. Juntos pueden ser muy persuasivos y exitosos en proyectos que requieran ideas nuevas y buena comunicación. La honestidad de Sagitario puede a veces chocar con el deseo de Libra de evitar conflictos.\n\nEn el amor, la relación entre Libra y Sagitario es alegre, estimulante y llena de risas. Ambos valoran la libertad y la independencia en la pareja. Disfrutan de viajar, aprender cosas nuevas y de una vida social activa. Libra admira el optimismo y la honestidad de Sagitario, y Sagitario se siente atraído por el encanto y la inteligencia de Libra. El desafío puede ser mantener el enfoque en la relación y profundizar el compromiso emocional. Si ambos cultivan la confianza y el respeto mutuo, su unión será una fuente constante de felicidad y crecimiento.",
    score: 4
  },
  "Libra-Capricorn": {
    report: "Libra, el diplomático signo de aire, y Capricornio, el ambicioso signo de tierra, presentan una combinación que requiere esfuerzo y comprensión. Libra busca armonía y placer, Capricornio busca estructura y logros. Profesionalmente, pueden complementarse si Libra aporta las habilidades sociales y la visión estética, y Capricornio la disciplina y la estrategia. Libra puede ayudar a Capricornio a ser más sociable, y Capricornio puede ayudar a Libra a ser más decidido y enfocado. Sus estilos de trabajo son diferentes, Libra es más colaborativo, Capricornio más autoritario.\n\nEn el amor, Libra y Capricornio pueden tener dificultades para satisfacer las necesidades del otro. Libra necesita romance y atención, mientras que Capricornio puede ser reservado y enfocado en sus responsabilidades. Libra puede encontrar a Capricornio demasiado serio o frío, y Capricornio puede ver a Libra como frívolo o indeciso. Sin embargo, si Libra aprecia la lealtad y la estabilidad que Capricornio ofrece, y Capricornio se esfuerza por ser más expresivo y romántico, pueden construir una relación sólida basada en el respeto mutuo y metas compartidas.",
    score: 3
  },
  "Libra-Aquarius": {
    report: "Dos signos de aire, Libra (cardinal) y Acuario (fijo), forman una pareja excepcionalmente compatible, unida por el intelecto, la amistad y un idealismo compartido. Ambos son sociables, comunicativos y valoran la justicia y la originalidad. Profesionalmente, son un equipo brillante e innovador. Libra aporta la diplomacia y la capacidad de negociación, Acuario la visión de futuro y las ideas vanguardistas. Disfrutan colaborando en proyectos que tengan un impacto social o creativo.\n\nEn el amor, la relación entre Libra y Acuario es armoniosa, estimulante y basada en una profunda conexión mental. Se entienden casi sin palabras y respetan la individualidad y la libertad del otro. No son excesivamente posesivos y disfrutan de una vida social activa y de intereses intelectuales compartidos. Su amor es más cerebral que pasional, pero la admiración mutua y la camaradería son muy fuertes. Es una unión que promete ser duradera, equitativa y llena de descubrimientos intelectuales.",
    score: 5
  },
  "Libra-Pisces": {
    report: "Libra, aire cardinal, y Piscis, agua mutable, son dos signos románticos y artísticos que pueden crear una relación hermosa pero a veces idealizada. Libra busca armonía y belleza en las relaciones, Piscis anhela una conexión anímica y compasiva. Profesionalmente, pueden colaborar bien en campos creativos o humanitarios. Libra aporta el sentido estético y la diplomacia, Piscis la imaginación y la empatía. El desafío es que ambos pueden ser indecisos o evitar la confrontación, lo que puede dificultar la toma de decisiones prácticas.\n\nEn el amor, Libra y Piscis se sienten atraídos por la sensibilidad y el idealismo del otro. Ambos son gentiles, afectuosos y disfrutan creando un ambiente romántico. Sin embargo, la necesidad de Piscis de una fusión emocional profunda puede ser abrumadora para el más sociable y mental Libra. Libra puede encontrar a Piscis demasiado evasivo o sensible, y Piscis puede percibir a Libra como superficial o distante. Si Libra aprende a conectar con la profundidad emocional de Piscis, y Piscis a comunicar sus necesidades más claramente, pueden disfrutar de una relación tierna y llena de inspiración.",
    score: 3
  },
  "Scorpio-Sagittarius": {
    report: "Escorpio, el intenso signo de agua, y Sagitario, el aventurero signo de fuego, forman una pareja intrigante pero con diferencias fundamentales. Escorpio busca profundidad y transformación, Sagitario anhela libertad y expansión. Profesionalmente, pueden ser un dúo poderoso si canalizan sus energías. Escorpio aporta la estrategia y la determinación, Sagitario la visión y el optimismo. La franqueza de Sagitario puede chocar con la naturaleza reservada de Escorpio. Necesitan confianza y comunicación clara.\n\nEn el amor, la atracción puede ser fuerte debido a la pasión de Escorpio y el entusiasmo de Sagitario. Sin embargo, la necesidad de Escorpio de intimidad profunda y control puede entrar en conflicto con el deseo de Sagitario de independencia y exploración. Sagitario puede encontrar a Escorpio demasiado posesivo o celoso, y Escorpio puede ver a Sagitario como superficial o poco comprometido. Si Escorpio aprende a confiar y a dar espacio, y Sagitario está dispuesto a profundizar en la conexión emocional, pueden tener una relación apasionante y llena de crecimiento.",
    score: 3
  },
  "Scorpio-Capricorn": {
    report: "Escorpio, agua fija, y Capricornio, tierra cardinal, forman una pareja poderosa, ambiciosa y de gran determinación. Ambos son serios, estratégicos y valoran la lealtad y el poder. Profesionalmente, son un equipo formidable, capaz de alcanzar cualquier meta. Escorpio aporta la profundidad de análisis y la tenacidad, Capricornio la estructura, la disciplina y la visión a largo plazo. Se respetan mutuamente y pueden construir un imperio juntos, basados en la confianza y la ambición compartida.\n\nEn el amor, Escorpio y Capricornio pueden desarrollar una conexión profunda y duradera. Aunque ninguno de los dos es excesivamente demostrativo al principio, su compromiso es total una vez que se entregan. Escorpio admira la fortaleza y la fiabilidad de Capricornio, y Capricornio valora la lealtad y la pasión intensa de Escorpio. Ambos son reservados pero muy leales. El desafío es abrirse emocionalmente el uno al otro. Si lo logran, su unión será inquebrantable, basada en el poder, el respeto y un entendimiento profundo.",
    score: 4
  },
  "Scorpio-Aquarius": {
    report: "Escorpio, agua fija, y Acuario, aire fijo, son dos signos de gran voluntad pero con naturalezas muy diferentes, lo que puede generar una relación desafiante y a la vez fascinante. Escorpio es emocional, intenso y busca control, Acuario es intelectual, independiente y busca la libertad. Profesionalmente, sus enfoques son opuestos. Escorpio profundiza, Acuario innova. Acuario puede encontrar a Escorpio demasiado posesivo, y Escorpio puede ver a Acuario como demasiado desapegado o errático. Si logran respetar sus diferencias, pueden lograr resultados únicos.\n\nEn el amor, la atracción puede ser magnética debido a sus naturalezas enigmáticas. Sin embargo, la necesidad de Escorpio de fusión emocional total choca con el deseo de Acuario de independencia y espacio personal. Escorpio busca intimidad profunda, Acuario amistad y libertad. Los celos y las luchas de poder pueden ser un problema constante. Esta relación requiere una enorme cantidad de comprensión, tolerancia y un deseo genuino de aprender del otro. Si lo logran, la transformación puede ser profunda para ambos.",
    score: 2
  },
  "Scorpio-Pisces": {
    report: "Dos signos de agua, Escorpio (fijo) y Piscis (mutable), comparten una conexión emocional e intuitiva excepcionalmente profunda. Ambos son sensibles, compasivos y buscan una unión espiritual y trascendente. Profesionalmente, pueden ser un equipo muy creativo e inspirador, especialmente en campos artísticos o de sanación. Escorpio aporta la determinación y la capacidad de profundizar, mientras que Piscis ofrece la imaginación y la empatía. Se entienden a un nivel casi telepático.\n\nEn el amor, la compatibilidad entre Escorpio y Piscis es una de las más elevadas y mágicas del zodíaco. Se aman con una intensidad y una devoción que pocos pueden igualar. Escorpio ofrece a Piscis la fuerza y la protección que necesita, y Piscis colma a Escorpio de amor incondicional y comprensión. Su conexión es anímica y a menudo kármica. El único riesgo es que pueden perderse en un mundo de emociones intensas. Si mantienen un cable a tierra, su amor será una fuente inagotable de inspiración y felicidad.",
    score: 5
  },
  "Sagittarius-Capricorn": {
    report: "Sagitario, el optimista signo de fuego, y Capricornio, el pragmático signo de tierra, tienen enfoques de vida muy distintos. Sagitario es aventurero y busca la expansión, Capricornio es cauto y busca la seguridad y el logro. Profesionalmente, pueden complementarse si Sagitario aporta la visión y el entusiasmo, y Capricornio la estructura y la disciplina para llevar las ideas a cabo. La impaciencia de Sagitario puede chocar con la naturaleza metódica de Capricornio. Necesitan respetar los métodos del otro.\n\nEn el amor, Sagitario y Capricornio deben trabajar para encontrar un terreno común. Sagitario busca libertad y diversión, Capricornio estabilidad y compromiso. Sagitario puede encontrar a Capricornio demasiado serio o restrictivo, y Capricornio puede ver a Sagitario como irresponsable o poco fiable. Sin embargo, Sagitario puede enseñar a Capricornio a relajarse y disfrutar más de la vida, y Capricornio puede ofrecer a Sagitario una base sólida y un enfoque práctico. Si ambos están dispuestos a aprender y a ceder, pueden construir una relación equilibrada.",
    score: 3
  },
  "Sagittarius-Aquarius": {
    report: "Sagitario, fuego mutable, y Acuario, aire fijo, forman una pareja altamente compatible, unida por su amor a la libertad, la aventura intelectual y el idealismo. Ambos son progresistas, honestos y disfrutan explorando nuevas ideas y culturas. Profesionalmente, son un dúo innovador y visionario. Sagitario aporta el entusiasmo y la visión expansiva, Acuario la originalidad y el enfoque humanitario. Disfrutan trabajando en proyectos que desafíen el status quo y pueden inspirarse mutuamente.\n\nEn el amor, Sagitario y Acuario disfrutan de una relación estimulante, basada en la amistad y el respeto mutuo por la independencia del otro. No son posesivos y se dan mucho espacio. Su vida social es activa y comparten un gran sentido del humor y una curiosidad insaciable por el mundo. La conexión es más mental y de camaradería que intensamente emocional, pero esto les funciona bien. Es una unión que promete ser divertida, libre y llena de descubrimientos constantes.",
    score: 5
  },
  "Sagittarius-Pisces": {
    report: "Sagitario, fuego mutable, y Piscis, agua mutable, son dos signos regidos tradicionalmente por Júpiter, lo que les da una base de idealismo y búsqueda de significado, pero sus elementos pueden chocar. Sagitario es extrovertido y directo, Piscis es introspectivo y sensible. Profesionalmente, pueden tener dificultades si no se comunican bien. La franqueza de Sagitario puede herir a Piscis, y la evasividad de Piscis puede frustrar a Sagitario. Sin embargo, la visión de Sagitario puede inspirar la creatividad de Piscis, y la compasión de Piscis puede suavizar a Sagitario.\n\nEn el amor, Sagitario y Piscis necesitan mucha comprensión y adaptación. Sagitario busca aventura y libertad, Piscis anhela una conexión emocional profunda y romántica. Sagitario puede encontrar a Piscis demasiado necesitado o sensible, y Piscis puede ver a Sagitario como descuidado o insensible. Sin embargo, ambos son compasivos en el fondo. Si Sagitario aprende a ser más tierno y considerado, y Piscis a dar más espacio y a comunicar sus necesidades más directamente, pueden encontrar un punto de encuentro en su mutuo idealismo y generosidad.",
    score: 3
  },
  "Capricorn-Aquarius": {
    report: "Capricornio, tierra cardinal, y Acuario, aire fijo, son vecinos en el zodíaco pero con enfoques muy diferentes. Capricornio es tradicional, estructurado y práctico, mientras que Acuario es progresista, innovador y valora la libertad individual. Profesionalmente, pueden ser un equipo interesante si Capricornio aporta la disciplina para implementar las ideas vanguardistas de Acuario. Capricornio busca resultados tangibles, Acuario la originalidad. Deben respetar sus diferentes formas de trabajar para evitar frustraciones.\n\nEn el amor, Capricornio y Acuario pueden encontrar difícil conectar a un nivel profundo. Capricornio busca estabilidad y compromiso convencional, mientras que Acuario necesita independencia y una relación menos tradicional. Capricornio puede ver a Acuario como errático o poco fiable, y Acuario puede encontrar a Capricornio demasiado rígido o controlador. Sin embargo, ambos son inteligentes y pueden respetarse mutuamente. Si Capricornio se abre a nuevas formas de pensar y Acuario valora la lealtad de Capricornio, pueden construir una relación basada en el respeto intelectual y metas compartidas, aunque poco convencional.",
    score: 3
  },
  "Capricorn-Pisces": {
    report: "Capricornio, el pragmático signo de tierra, y Piscis, el soñador signo de agua, forman una combinación sorprendentemente armoniosa y de apoyo mutuo. Capricornio ofrece la estructura y la seguridad que Piscis necesita, mientras que Piscis aporta sensibilidad, compasión e imaginación a la vida de Capricornio. Profesionalmente, trabajan muy bien juntos. Capricornio se encarga de la planificación y la ejecución, y Piscis aporta la visión creativa y la empatía. Capricornio ayuda a Piscis a materializar sus sueños, y Piscis suaviza la rigidez de Capricornio.\n\nEn el amor, la relación entre Capricornio y Piscis es tierna, leal y profundamente satisfactoria. Capricornio se siente atraído por la naturaleza gentil y compasiva de Piscis, y Piscis encuentra en Capricornio la estabilidad y la protección que anhela. Capricornio puede ayudar a Piscis a sentirse seguro y a enfrentar la realidad, mientras que Piscis puede enseñar a Capricornio a conectar con sus emociones y a disfrutar de los placeres simples de la vida. Es una unión que promete ser duradera, basada en el cuidado mutuo y un profundo entendimiento.",
    score: 4
  },
  "Aquarius-Pisces": {
    report: "Acuario, aire fijo, y Piscis, agua mutable, son los dos últimos signos del zodíaco y comparten una cualidad humanitaria y una visión que trasciende lo mundano, aunque de maneras diferentes. Acuario es intelectual y enfocado en el colectivo, Piscis es emocional y enfocado en la compasión universal. Profesionalmente, pueden ser un equipo muy creativo e inspirador, especialmente en causas sociales o proyectos artísticos. Acuario aporta las ideas innovadoras y Piscis la sensibilidad y la intuición. Deben cuidar que la lógica de Acuario no choque con la emocionalidad de Piscis.\n\nEn el amor, Acuario y Piscis pueden formar una unión espiritual y poco convencional. Acuario se siente atraído por la naturaleza mística y compasiva de Piscis, y Piscis admira la originalidad y el idealismo de Acuario. Sin embargo, la necesidad de Piscis de profunda conexión emocional puede ser un desafío para el más desapegado Acuario. Acuario puede encontrar a Piscis demasiado sensible o dependiente, y Piscis puede sentirse incomprendido por la necesidad de Acuario de libertad. Si Acuario aprende a ofrecer más calidez y Piscis a respetar la independencia de Acuario, pueden construir una relación basada en ideales compartidos y una profunda comprensión mutua.",
    score: 3
  }
};


function getGenericCompatibilityReport(sign1: ZodiacSignName, sign2: ZodiacSignName, locale: Locale): CompatibilityReport {
  // Check if it's a self-comparison
  if (sign1 === sign2) {
    const selfPairingKey = `${sign1}-${sign1}`;
    if (compatibilityPairings[selfPairingKey]) {
      return compatibilityPairings[selfPairingKey];
    }
    // Fallback generic self-comparison if specific one not found (should not happen if all are added)
    return {
        report: `Cuando ${sign1} se relaciona con otro ${sign1}, se duplican tanto las fortalezas como los desafíos inherentes al signo. La comprensión mutua es alta, pero también la posibilidad de reforzar patrones menos constructivos. Es una oportunidad para el autoconocimiento a través del reflejo en el otro. (Informe genérico de auto-compatibilidad).`,
        score: 3 
    };
  }

  const reportText = `La conexión entre ${sign1} y ${sign2} es única, tejida con los hilos de sus elementos y modalidades distintivas. ${sign1}, con su energía inherente, interactúa con ${sign2}, quien aporta su característica distintiva, creando una dinámica que puede ser tanto complementaria como desafiante. Es un encuentro de dos mundos que, con entendimiento, pueden enriquecerse mutuamente.\n\nEn el ámbito profesional, la colaboración puede ser productiva si logran alinear sus talentos. Para que su sinergia florezca, es crucial apreciar las virtudes del otro y comunicarse abiertamente. En el amor, la relación se presenta como un viaje de descubrimiento. El respeto por las diferencias y la voluntad de adaptarse serán fundamentales para una unión duradera. (Este es un informe de compatibilidad general. Los detalles específicos pueden variar.)`;
  return {
    report: reportText,
    score: Math.floor(Math.random() * 3) + 2 
  };
}

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName, locale: Locale): CompatibilityData {
  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  let reportData: CompatibilityReport;

  if (compatibilityPairings[key1]) {
    reportData = compatibilityPairings[key1];
  } else if (compatibilityPairings[key2]) {
    reportData = compatibilityPairings[key2];
  } else {
    console.warn(`No specific compatibility report found for ${sign1}-${sign2}. Using generic report.`);
    // The generic report function now handles self-comparison internally if needed
    reportData = getGenericCompatibilityReport(sign1, sign2, locale);
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

// --- Lunar Phase Logic ---
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

// --- Phase mapping from Open-Meteo (0-1 value) to our app's keys ---
const mapOpenMeteoPhaseToApp = (
  phaseValue: number,
  dictionary: Dictionary
): { phaseName: string; illumination: number; phaseKey: MoonPhaseKey } => {
  let phaseKey: MoonPhaseKey;
  let phaseName: string;
  let illumination: number;

  // Illumination mapping (approximate based on phase value)
  if (phaseValue <= 0.5) { // Waxing (New to Full)
    illumination = Math.round(phaseValue * 2 * 100);
  } else { // Waning (Full to New)
    illumination = Math.round((1 - phaseValue) * 2 * 100);
  }
  illumination = Math.max(0, Math.min(100, illumination)); // Clamp between 0 and 100

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
  } else { // phaseValue <= 0.97
    phaseKey = "waningCrescent";
  }

  phaseName = dictionary[`MoonPhase.${phaseKey}`] || dictionary['MoonPhase.unknown'] || "Unknown Phase";

  return { phaseName, illumination, phaseKey };
};


export const getCurrentLunarData = async (dictionary: Dictionary, locale: Locale = 'es'): Promise<LunarData> => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Using Buenos Aires, AR as default for lat/lon, and GMT for timezone
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
        currentMoonImage: getMoonImageUrl(phaseKey), // Generate image based on our key
        upcomingPhases: getMockUpcomingPhases(dictionary), // Keep mock upcoming for now
        // moonInSign and moonSignIcon are not provided by this basic Open-Meteo endpoint
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


// --- Full data for Chinese Astrology ---
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

const DefaultMayanIcon = HelpCircle; // Using HelpCircle as a default icon

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

export { Briefcase as WorkIcon }; // Exporting with a clearer name if used specifically for work category







