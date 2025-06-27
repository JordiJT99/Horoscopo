
import type { ChineseAnimalSignName, Locale } from '@/types';

export interface ChineseCompatibilityReportDetail {
  report: Record<Locale, string>;
  score: number; // 1 to 5
}

export const chineseCompatibilityPairings: Record<string, ChineseCompatibilityReportDetail> = {
  // Tríada de Afinidad 1: Rata, Dragón, Mono
  "Rat-Dragon": {
    report: {
      es: "Una de las combinaciones más exitosas y dinámicas del zodiaco chino. La Rata, con su astucia e ingenio, se siente irresistiblemente atraída por el poder, el carisma y la visión del Dragón. El Dragón, a su vez, admira profundamente la inteligencia y la capacidad de la Rata para encontrar oportunidades. Juntos, forman un equipo de poder imparable destinado al éxito y al respeto mutuo.",
      en: "One of the most successful and dynamic combinations in the Chinese zodiac. The Rat, with its cunning and ingenuity, is irresistibly drawn to the Dragon's power, charisma, and vision. The Dragon, in turn, deeply admires the Rat's intelligence and ability to find opportunities. Together, they form an unstoppable power team destined for success and mutual respect.",
      de: "Eine der erfolgreichsten und dynamischsten Kombinationen im chinesischen Tierkreis. Die Ratte, mit ihrer List und ihrem Einfallsreichtum, fühlt sich unwiderstehlich von der Macht, dem Charisma und der Vision des Drachen angezogen. Der Drache wiederum bewundert zutiefst die Intelligenz der Ratte und ihre Fähigkeit, Gelegenheiten zu finden. Zusammen bilden sie ein unaufhaltsames Power-Team, das für Erfolg und gegenseitigen Respekt bestimmt ist.",
      fr: "L'une des combinaisons les plus réussies et dynamiques du zodiaque chinois. Le Rat, avec sa ruse et son ingéniosité, est irrésistiblement attiré par le pouvoir, le charisme et la vision du Dragon. Le Dragon, à son tour, admire profondément l'intelligence du Rat et sa capacité à trouver des opportunités. Ensemble, ils forment une équipe de pouvoir imparable destinée au succès et au respect mutuel."
    },
    score: 5
  },
  "Rat-Monkey": {
    report: {
        es: "Pura energía y complicidad. La Rata y el Mono comparten un sentido del humor travieso y una inteligencia aguda que los convierte en compañeros de fechorías perfectos. Su relación está llena de risas, debates estimulantes y la capacidad de resolver cualquier problema con una solución ingeniosa. Se motivan mutuamente y su vínculo es una fuente constante de diversión y estímulo mental.",
        en: "Pure energy and complicity. The Rat and the Monkey share a mischievous sense of humor and sharp intelligence that make them perfect partners in crime. Their relationship is full of laughter, stimulating debates, and the ability to solve any problem with an ingenious solution. They motivate each other, and their bond is a constant source of fun and mental stimulation.",
        de: "Reine Energie und Komplizenschaft. Ratte und Affe teilen einen schelmischen Sinn für Humor und eine scharfe Intelligenz, die sie zu perfekten Komplizen macht. Ihre Beziehung ist voller Lachen, anregender Debatten und der Fähigkeit, jedes Problem mit einer genialen Lösung zu bewältigen. Sie motivieren sich gegenseitig, und ihre Verbindung ist eine ständige Quelle von Spaß und geistiger Anregung.",
        fr: "Pure énergie et complicité. Le Rat et le Singe partagent un sens de l'humour espiègle et une intelligence vive qui en font de parfaits complices. Leur relation est pleine de rires, de débats stimulants et de la capacité à résoudre n'importe quel problème avec une solution ingénieuse. Ils se motivent mutuellement et leur lien est une source constante de plaisir et de stimulation mentale."
    },
    score: 5
  },
  "Dragon-Monkey": {
    report: {
        es: "Una alianza de poder y brillantez. El Dragón aporta la visión y el liderazgo, mientras que el Mono aporta la estrategia y la inteligencia. Se admiran profundamente: el Dragón ama tener a su lado a un consejero tan astuto, y el Mono se siente atraído por la fuerza del Dragón. Su colaboración es exitosa porque el Mono sabe cómo hacer brillar al Dragón, y el Dragón confía en el ingenio del Mono.",
        en: "An alliance of power and brilliance. The Dragon brings vision and leadership, while the Monkey provides strategy and intelligence. They deeply admire each other: the Dragon loves having such a cunning advisor by its side, and the Monkey is attracted to the Dragon's strength. Their collaboration is successful because the Monkey knows how to make the Dragon shine, and the Dragon trusts the Monkey's ingenuity.",
        de: "Ein Bündnis aus Macht und Brillanz. Der Drache bringt Vision und Führung, während der Affe Strategie und Intelligenz liefert. Sie bewundern sich zutiefst: Der Drache liebt es, einen so listigen Berater an seiner Seite zu haben, und der Affe fühlt sich von der Stärke des Drachen angezogen. Ihre Zusammenarbeit ist erfolgreich, weil der Affe weiß, wie man den Drachen zum Glänzen bringt, und der Drache auf den Einfallsreichtum des Affen vertraut.",
        fr: "Une alliance de pouvoir et de brillance. Le Dragon apporte la vision et le leadership, tandis que le Singe fournit la stratégie et l'intelligence. Ils s'admirent profondément : le Dragon aime avoir un conseiller aussi rusé à ses côtés, et le Singe est attiré par la force du Dragon. Leur collaboration est réussie car le Singe sait comment faire briller le Dragon, et le Dragon a confiance en l'ingéniosité du Singe."
    },
    score: 5
  },

  // Tríada de Afinidad 2: Buey, Serpiente, Gallo
  "Ox-Snake": {
    report: {
        es: "Una conexión de almas tranquilas y sabias. El Buey ofrece a la Serpiente la estabilidad y seguridad que valora. La Serpiente, a su vez, aporta una profundidad de pensamiento e intuición que fascina al práctico Buey. Ambos son hogareños y leales, creando un vínculo basado en una comprensión profunda y un respeto mutuo. Es una de las parejas más estables y armoniosas.",
        en: "A connection of calm and wise souls. The Ox offers the Snake the stability and security it values. The Snake, in turn, brings a depth of thought and intuition that fascinates the practical Ox. Both are homebodies and loyal, creating a bond based on deep understanding and mutual respect. It is one of the most stable and harmonious pairings.",
        de: "Eine Verbindung ruhiger und weiser Seelen. Der Ochse bietet der Schlange die Stabilität und Sicherheit, die sie schätzt. Die Schlange wiederum bringt eine Tiefe des Denkens und eine Intuition mit, die den praktischen Ochsen fasziniert. Beide sind häuslich und loyal und schaffen eine Bindung, die auf tiefem Verständnis und gegenseitigem Respekt beruht. Es ist eine der stabilsten und harmonischsten Paarungen.",
        fr: "Une connexion d'âmes calmes et sages. Le Bœuf offre au Serpent la stabilité et la sécurité qu'il apprécie. Le Serpent, à son tour, apporte une profondeur de pensée et une intuition qui fascinent le Bœuf pratique. Tous deux sont casaniers et loyaux, créant un lien basé sur une compréhension profonde et un respect mutuel. C'est l'un des couples les plus stables et harmonieux."
    },
    score: 5
  },
  "Ox-Rooster": {
    report: {
        es: "El equipo de la eficiencia y la tradición. El Gallo, con su ojo para el detalle y perfeccionismo, encuentra en el Buey al socio perfecto: diligente, fiable y capaz de ejecutar cualquier plan. Ambos son trabajadores y conservadores. Su relación es sólida, práctica y se basa en valores compartidos, creando una base fuerte para el éxito conjunto.",
        en: "The team of efficiency and tradition. The Rooster, with its eye for detail and perfectionism, finds the perfect partner in the Ox: diligent, reliable, and capable of executing any plan. Both are hardworking and conservative. Their relationship is solid, practical, and based on shared values, creating a strong foundation for joint success.",
        de: "Das Team aus Effizienz und Tradition. Der Hahn, mit seinem Auge für Details und Perfektionismus, findet im Ochsen den perfekten Partner: fleißig, zuverlässig und fähig, jeden Plan umzusetzen. Beide sind fleißig und konservativ. Ihre Beziehung ist solide, praktisch und basiert auf gemeinsamen Werten, was eine starke Grundlage für gemeinsamen Erfolg schafft.",
        fr: "L'équipe de l'efficacité et de la tradition. Le Coq, avec son souci du détail et son perfectionnisme, trouve dans le Bœuf le partenaire idéal : diligent, fiable et capable d'exécuter n'importe quel plan. Tous deux sont travailleurs et conservateurs. Leur relation est solide, pratique et basée sur des valeurs partagées, créant une base solide pour un succès commun."
    },
    score: 4
  },
  "Snake-Rooster": {
    report: {
        es: "Una alianza de mentes brillantes y estrategas natos. La Serpiente, sabia e intuitiva, y el Gallo, analítico y perfeccionista, se conectan a un nivel intelectual profundo. Se admiran mutuamente por su inteligencia y su capacidad para ver patrones que otros pasan por alto. Juntos, pueden tener éxito en cualquier empresa que requiera inteligencia y planificación meticulosa.",
        en: "An alliance of brilliant minds and natural strategists. The wise and intuitive Snake and the analytical and perfectionist Rooster connect on a deep intellectual level. They admire each other for their intelligence and ability to see patterns others miss. Together, they can succeed in any venture that requires intelligence and meticulous planning.",
        de: "Ein Bündnis brillanter Köpfe und geborener Strategen. Die weise und intuitive Schlange und der analytische und perfektionistische Hahn verbinden sich auf einer tiefen intellektuellen Ebene. Sie bewundern sich gegenseitig für ihre Intelligenz und ihre Fähigkeit, Muster zu erkennen, die andere übersehen. Gemeinsam können sie in jedem Unternehmen erfolgreich sein, das Intelligenz und sorgfältige Planung erfordert.",
        fr: "Une alliance d'esprits brillants et de stratèges nés. Le Serpent, sage et intuitif, et le Coq, analytique et perfectionniste, se connectent à un niveau intellectuel profond. Ils s'admirent pour leur intelligence et leur capacité à voir des schémas que les autres ne remarquent pas. Ensemble, ils peuvent réussir dans toute entreprise qui exige de l'intelligence et une planification méticuleuse."
    },
    score: 5
  },

  // Tríada de Afinidad 3: Tigre, Caballo, Perro
  "Tiger-Horse": {
    report: {
        es: "Un torbellino de pasión, libertad y aventura. El Tigre y el Caballo son espíritus libres que se sienten instantáneamente atraídos por la energía y el entusiasmo del otro. Su relación es dinámica, optimista y nunca aburrida. Se dan mutuamente el espacio que necesitan para explorar y crecer, sin celos ni posesividad, lo cual es fundamental para ambos.",
        en: "A whirlwind of passion, freedom, and adventure. The Tiger and the Horse are free spirits who are instantly drawn to each other's energy and enthusiasm. Their relationship is dynamic, optimistic, and never boring. They give each other the space they need to explore and grow, without jealousy or possessiveness, which is fundamental for both.",
        de: "Ein Wirbelwind aus Leidenschaft, Freiheit und Abenteuer. Tiger und Pferd sind Freigeister, die sich sofort von der Energie und dem Enthusiasmus des anderen angezogen fühlen. Ihre Beziehung ist dynamisch, optimistisch und niemals langweilig. Sie geben einander den Raum, den sie zum Erkunden und Wachsen brauchen, ohne Eifersucht oder Besitzgier, was für beide von grundlegender Bedeutung ist.",
        fr: "Un tourbillon de passion, de liberté et d'aventure. Le Tigre et le Cheval sont des esprits libres qui sont instantanément attirés par l'énergie et l'enthousiasme de l'autre. Leur relation est dynamique, optimiste et jamais ennuyeuse. Ils se donnent l'espace dont ils ont besoin pour explorer et grandir, sans jalousie ni possessivité, ce qui est fondamental pour tous les deux."
    },
    score: 5
  },
  "Tiger-Dog": {
    report: {
        es: "Una unión de lealtad y respeto inquebrantables. El Perro, leal, encuentra en el valiente Tigre un protector y un líder en quien confiar. El Tigre valora la honestidad y el apoyo incondicional del Perro. El Perro calma los impulsos del Tigre, y el Tigre defiende al Perro contra cualquier injusticia. Juntos, forman un equipo basado en la confianza mutua y un profundo sentido de la justicia.",
        en: "A union of unwavering loyalty and respect. The loyal Dog finds a protector and a leader to trust in the brave Tiger. The Tiger values the Dog's honesty and unconditional support. The Dog calms the Tiger's impulses, and the Tiger defends the Dog against any injustice. Together, they form a team based on mutual trust and a deep sense of justice.",
        de: "Eine Vereinigung unerschütterlicher Loyalität und Respekt. Der loyale Hund findet im tapferen Tiger einen Beschützer und einen Führer, dem er vertrauen kann. Der Tiger schätzt die Ehrlichkeit und bedingungslose Unterstützung des Hundes. Der Hund beruhigt die Impulse des Tigers, und der Tiger verteidigt den Hund gegen jede Ungerechtigkeit. Zusammen bilden sie ein Team, das auf gegenseitigem Vertrauen und einem tiefen Gerechtigkeitssinn basiert.",
        fr: "Une union de loyauté et de respect inébranlables. Le Chien loyal trouve dans le Tigre courageux un protecteur et un chef en qui avoir confiance. Le Tigre apprécie l'honnêteté et le soutien inconditionnel du Chien. Le Chien calme les impulsions du Tigre, et le Tigre défend le Chien contre toute injustice. Ensemble, ils forment une équipe basée sur la confiance mutuelle et un profond sens de la justice."
    },
    score: 4
  },
  "Tiger-Dragon": {
    report: {
      es: "Una combinación de dos de los signos más poderosos. La relación es una alianza de titanes, llena de energía y ambición. El Dragón admira el coraje del Tigre, mientras que el Tigre se siente atraído por el liderazgo del Dragón. El principal desafío es el choque de egos; ambos quieren liderar. Si aprenden a colaborar como un equipo, su potencial es ilimitado.",
      en: "A combination of two of the most powerful signs. The relationship is an alliance of titans, full of energy and ambition. The Dragon admires the Tiger's courage, while the Tiger is drawn to the Dragon's leadership. The main challenge is the clash of egos; both want to lead. If they learn to collaborate as a team, their potential is limitless.",
      de: "Eine Kombination aus zwei der mächtigsten Zeichen. Die Beziehung ist ein Bündnis von Titanen, voller Energie und Ehrgeiz. Der Drache bewundert den Mut des Tigers, während der Tiger von der Führung des Drachen angezogen wird. Die größte Herausforderung ist der Kampf der Egos; beide wollen führen. Wenn sie lernen, als Team zusammenzuarbeiten, ist ihr Potenzial grenzenlos.",
      fr: "Une combinaison de deux des signes les plus puissants. La relation est une alliance de titans, pleine d'énergie et d'ambition. Le Dragon admire le courage du Tigre, tandis que le Tigre est attiré par le leadership du Dragon. Le principal défi est le choc des ego; tous deux veulent diriger. S'ils apprennent à collaborer en équipe, leur potentiel est illimité."
    },
    score: 4
  },
  "Horse-Dog": {
    report: {
        es: "Una pareja feliz, honesta y llena de calidez. El Caballo encuentra en el Perro un compañero leal que entiende su necesidad de libertad. El Perro, por su parte, se siente inspirado por el optimismo y la energía del Caballo. Comparten una visión de la vida honesta y directa, y su comunicación es excelente. Es una relación basada en la amistad y el apoyo mutuo.",
        en: "A happy, honest, and warm couple. The Horse finds in the Dog a loyal companion who understands its need for freedom. The Dog, in turn, is inspired by the Horse's optimism and energy. They share an honest and direct outlook on life, and their communication is excellent. It is a relationship based on friendship and mutual support.",
        de: "Ein glückliches, ehrliches und herzliches Paar. Das Pferd findet im Hund einen treuen Begleiter, der sein Bedürfnis nach Freiheit versteht. Der Hund wiederum wird von dem Optimismus und der Energie des Pferdes inspiriert. Sie teilen eine ehrliche und direkte Lebenseinstellung, und ihre Kommunikation ist ausgezeichnet. Es ist eine Beziehung, die auf Freundschaft und gegenseitiger Unterstützung basiert.",
        fr: "Un couple heureux, honnête et chaleureux. Le Cheval trouve dans le Chien un compagnon loyal qui comprend son besoin de liberté. Le Chien, à son tour, est inspiré par l'optimisme et l'énergie du Cheval. Ils partagent une vision honnête et directe de la vie, et leur communication est excellente. C'est une relation basée sur l'amitié et le soutien mutuel."
    },
    score: 5
  },

  // Tríada de Afinidad 4: Conejo, Cabra, Cerdo
  "Rabbit-Goat": {
    report: {
        es: "Una unión de ensueño, llena de arte, sensibilidad y armonía. El Conejo y la Cabra son almas gemelas en su amor por la paz y la belleza. El Conejo sabe cómo manejar la naturaleza emocional de la Cabra, y la Cabra encuentra en el Conejo un compañero comprensivo. Ambos son hogareños y prefieren reuniones íntimas. Es una de las combinaciones más pacíficas y artísticas del zodiaco.",
        en: "A dream union, full of art, sensitivity, and harmony. The Rabbit and the Goat are soulmates in their love for peace and beauty. The Rabbit knows how to handle the Goat's emotional nature, and the Goat finds a sympathetic partner in the Rabbit. Both are homebodies and prefer intimate gatherings. It is one of the most peaceful and artistic combinations of the zodiac.",
        de: "Eine Traumunion, voller Kunst, Sensibilität und Harmonie. Kaninchen und Ziege sind Seelenverwandte in ihrer Liebe zu Frieden und Schönheit. Das Kaninchen weiß, wie man mit der emotionalen Natur der Ziege umgeht, und die Ziege findet im Kaninchen einen verständnisvollen Partner. Beide sind häuslich und bevorzugen intime Zusammenkünfte. Es ist eine der friedlichsten und künstlerischsten Kombinationen des Tierkreises.",
        fr: "Une union de rêve, pleine d'art, de sensibilité et d'harmonie. Le Lapin et la Chèvre sont des âmes sœurs dans leur amour pour la paix et la beauté. Le Lapin sait comment gérer la nature émotionnelle de la Chèvre, et la Chèvre trouve dans le Lapin un partenaire compréhensif. Tous deux sont casaniers et préfèrent les rassemblements intimes. C'est l'une des combinaisons les plus paisibles et artistiques du zodiaque."
    },
    score: 5
  },
  "Rabbit-Pig": {
    report: {
        es: "Una conexión de pura bondad, disfrute y confort mutuo. Comparten un amor por la comodidad y una vida pacífica. La generosidad del Cerdo hace que el prudente Conejo se sienta completamente seguro. El Conejo, a su vez, aporta tacto y diplomacia. Su relación es tranquila, estable y muy satisfactoria para ambos.",
        en: "A connection of pure kindness, enjoyment, and mutual comfort. They share a love for comfort and a peaceful life. The Pig's generosity makes the prudent Rabbit feel completely secure. The Rabbit, in turn, brings tact and diplomacy. Their relationship is calm, stable, and very satisfying for both.",
        de: "Eine Verbindung reiner Güte, Freude und gegenseitigen Komforts. Sie teilen die Liebe zu Komfort und einem friedlichen Leben. Die Großzügigkeit des Schweins gibt dem vorsichtigen Kaninchen ein Gefühl völliger Sicherheit. Das Kaninchen wiederum bringt Takt und Diplomatie mit. Ihre Beziehung ist ruhig, stabil und für beide sehr befriedigend.",
        fr: "Une connexion de pure bonté, de plaisir et de confort mutuel. Ils partagent un amour pour le confort et une vie paisible. La générosité du Cochon rend le Lapin prudent complètement en sécurité. Le Lapin, à son tour, apporte tact et diplomatie. Leur relation est calme, stable et très satisfaisante pour tous les deux."
    },
    score: 5
  },
  "Goat-Pig": {
    report: {
        es: "Una pareja de corazones tiernos y empáticos. La Cabra, creativa y sensible, encuentra en el Cerdo un compañero generoso y optimista que apoya incondicionalmente sus sueños. El Cerdo se siente atraído por la naturaleza artística de la Cabra. Juntos crean un hogar lleno de calidez y apoyo emocional. La capacidad del Cerdo para perdonar y la apreciación de la Cabra por su bondad hace que su relación sea duradera y feliz.",
        en: "A couple of tender and empathetic hearts. The creative and sensitive Goat finds in the Pig a generous and optimistic partner who unconditionally supports its dreams. The Pig is attracted to the Goat's artistic nature. Together they create a home full of warmth and emotional support. The Pig's ability to forgive and the Goat's appreciation for its kindness make their relationship long-lasting and happy.",
        de: "Ein Paar zarter und einfühlsamer Herzen. Die kreative und sensible Ziege findet im Schwein einen großzügigen und optimistischen Partner, der ihre Träume bedingungslos unterstützt. Das Schwein fühlt sich von der künstlerischen Natur der Ziege angezogen. Zusammen schaffen sie ein Zuhause voller Wärme und emotionaler Unterstützung. Die Fähigkeit des Schweins zu vergeben und die Wertschätzung der Ziege für seine Güte machen ihre Beziehung langlebig und glücklich.",
        fr: "Un couple de cœurs tendres et empathiques. La Chèvre, créative et sensible, trouve dans le Cochon un partenaire généreux et optimiste qui soutient inconditionnellement ses rêves. Le Cochon est attiré par la nature artistique de la Chèvre. Ensemble, ils créent un foyer plein de chaleur et de soutien émotionnel. La capacité du Cochon à pardonner et l'appréciation de la Chèvre pour sa gentillesse rendent leur relation durable et heureuse."
    },
    score: 5
  },

  // Amigos Secretos (Máxima compatibilidad, diferentes a las tríadas)
  "Rat-Ox": {
    report: {
        es: "Una unión de poder y estabilidad. Son 'amigos secretos', lo que indica una conexión profunda y complementaria. El Buey proporciona la base sólida que la Rata necesita, y la Rata aporta ingenio y estrategia. Se respetan profundamente: la Rata admira la integridad del Buey, y el Buey valora la inteligencia de la Rata. Juntos, forman una pareja formidable.",
        en: "A union of power and stability. They are 'secret friends,' indicating a deep and complementary connection. The Ox provides the solid foundation the Rat needs, and the Rat brings ingenuity and strategy. They deeply respect each other: the Rat admires the Ox's integrity, and the Ox values the Rat's intelligence. Together, they form a formidable pair.",
        de: "Eine Vereinigung von Macht und Stabilität. Sie sind 'geheime Freunde', was auf eine tiefe und ergänzende Verbindung hinweist. Der Ochse bietet das solide Fundament, das die Ratte braucht, und die Ratte bringt Einfallsreichtum und Strategie mit. Sie respektieren sich zutiefst: Die Ratte bewundert die Integrität des Ochsen, und der Ochse schätzt die Intelligenz der Ratte. Zusammen bilden sie ein beeindruckendes Paar.",
        fr: "Une union de pouvoir et de stabilité. Ils sont des 'amis secrets', ce qui indique une connexion profonde et complémentaire. Le Bœuf fournit la base solide dont le Rat a besoin, et le Rat apporte ingéniosité et stratégie. Ils se respectent profondément : le Rat admire l'intégrité du Bœuf, et le Bœuf apprécie l'intelligence du Rat. Ensemble, ils forment une paire redoutable."
    },
    score: 5
  },
  "Tiger-Pig": {
    report: {
        es: "Una combinación sorprendentemente armoniosa. El Cerdo, amable y generoso, calma la naturaleza impulsiva del Tigre. El Tigre, a su vez, se siente atraído por la bondad del Cerdo y asume un papel protector. El Cerdo ofrece al Tigre un refugio de paz y aceptación, y el Tigre inspira al Cerdo a ser más valiente. Es una relación de equilibrio y apoyo mutuo.",
        en: "A surprisingly harmonious combination. The kind and generous Pig calms the impulsive nature of the Tiger. The Tiger, in turn, is drawn to the Pig's kindness and assumes a protective role. The Pig offers the Tiger a haven of peace and acceptance, and the Tiger inspires the Pig to be braver. It is a relationship of balance and mutual support.",
        de: "Eine überraschend harmonische Kombination. Das freundliche und großzügige Schwein beruhigt die impulsive Natur des Tigers. Der Tiger wiederum fühlt sich von der Freundlichkeit des Schweins angezogen und übernimmt eine schützende Rolle. Das Schwein bietet dem Tiger einen Hafen des Friedens und der Akzeptanz, und der Tiger inspiriert das Schwein, mutiger zu sein. Es ist eine Beziehung des Gleichgewichts und der gegenseitigen Unterstützung.",
        fr: "Une combinaison étonnamment harmonieuse. Le Cochon, gentil et généreux, calme la nature impulsive du Tigre. Le Tigre, à son tour, est attiré par la gentillesse du Cochon et assume un rôle protecteur. Le Cochon offre au Tigre un havre de paix et d'acceptation, et le Tigre inspire le Cochon à être plus courageux. C'est une relation d'équilibre et de soutien mutuel."
    },
    score: 5
  },
  "Rabbit-Dog": {
    report: {
        es: "Una de las combinaciones más leales y confiables. El Perro, protector, ofrece al sensible Conejo la seguridad que anhela. El Conejo, con su tacto y diplomacia, calma las ansiedades del Perro. Ambos valoran la tranquilidad del hogar y la lealtad. Es una relación basada en una confianza profunda y un entendimiento mutuo.",
        en: "One of the most loyal and reliable combinations. The protective Dog offers the sensitive Rabbit the security it craves. The Rabbit, with its tact and diplomacy, soothes the Dog's anxieties. Both value home tranquility and loyalty. It is a relationship based on deep trust and mutual understanding.",
        de: "Eine der treuesten und zuverlässigsten Kombinationen. Der beschützende Hund bietet dem sensiblen Kaninchen die Sicherheit, nach der es sich sehnt. Das Kaninchen, mit seinem Takt und seiner Diplomatie, beruhigt die Ängste des Hundes. Beide schätzen die Ruhe des Zuhauses und die Loyalität. Es ist eine Beziehung, die auf tiefem Vertrauen und gegenseitigem Verständnis basiert.",
        fr: "L'une des combinaisons les plus loyales et fiables. Le Chien protecteur offre au Lapin sensible la sécurité dont il a besoin. Le Lapin, avec son tact et sa diplomatie, apaise les angoisses du Chien. Tous deux apprécient la tranquillité du foyer et la loyauté. C'est une relation basée sur une confiance profonde et une compréhension mutuelle."
    },
    score: 5
  },
  "Dragon-Rooster": {
    report: {
        es: "El visionario y el perfeccionista. El Dragón encuentra en el Gallo al socio ideal para llevar sus visiones a la realidad. El Gallo, con su ojo para el detalle y su organización, se asegura de que los planes del Dragón sean impecables. El Dragón admira la eficiencia del Gallo, y el Gallo se siente inspirado por el poder del Dragón. Juntos, forman una pareja de éxito.",
        en: "The visionary and the perfectionist. The Dragon finds in the Rooster the ideal partner to bring its visions to reality. The Rooster, with its eye for detail and organization, ensures the Dragon's plans are flawless. The Dragon admires the Rooster's efficiency, and the Rooster is inspired by the Dragon's power. Together, they form a successful pair.",
        de: "Der Visionär und der Perfektionist. Der Drache findet im Hahn den idealen Partner, um seine Visionen Wirklichkeit werden zu lassen. Der Hahn, mit seinem Auge für Details und seiner Organisation, stellt sicher, dass die Pläne des Drachen makellos sind. Der Drache bewundert die Effizienz des Hahns, und der Hahn wird von der Macht des Drachen inspiriert. Zusammen bilden sie ein erfolgreiches Paar.",
        fr: "Le visionnaire et le perfectionniste. Le Dragon trouve dans le Coq le partenaire idéal pour concrétiser ses visions. Le Coq, avec son souci du détail et son organisation, veille à ce que les plans du Dragon soient impeccables. Le Dragon admire l'efficacité du Coq, et le Coq est inspiré par la puissance du Dragon. Ensemble, ils forment une paire réussie."
    },
    score: 5
  },
  "Snake-Monkey": {
    report: {
        es: "Una batalla de ingenio en la que ambos ganan. La Serpiente, sabia y estratégica, y el Mono, innovador y astuto, se sienten mutuamente fascinados por su inteligencia. Su relación es un juego constante de ajedrez mental. La Serpiente ayuda a enfocar la energía del Mono, y el Mono aporta diversión a la vida de la Serpiente. Su dinámica es electrizante.",
        en: "A battle of wits where both win. The wise and strategic Snake and the innovative and cunning Monkey are mutually fascinated by their intelligence. Their relationship is a constant game of mental chess. The Snake helps focus the Monkey's energy, and the Monkey brings fun to the Snake's life. Their dynamic is electrifying.",
        de: "Ein geistiger Wettstreit, bei dem beide gewinnen. Die weise und strategische Schlange und der innovative und listige Affe sind gegenseitig von ihrer Intelligenz fasziniert. Ihre Beziehung ist ein ständiges mentales Schachspiel. Die Schlange hilft, die Energie des Affen zu bündeln, und der Affe bringt Spaß in das Leben der Schlange. Ihre Dynamik ist elektrisierend.",
        fr: "Une bataille d'esprits où tous deux gagnent. Le Serpent, sage et stratégique, et le Singe, innovant et rusé, sont mutuellement fascinés par leur intelligence. Leur relation est un jeu d'échecs mental constant. Le Serpent aide à concentrer l'énergie du Singe, et le Singe apporte du plaisir à la vie du Serpent. Leur dynamique est électrisante."
    },
    score: 4
  },
  "Horse-Goat": {
    report: {
        es: "Una combinación dulce y equilibrada. El Caballo, enérgico y social, encuentra en la Cabra un remanso de paz y creatividad. La Cabra calma el espíritu impaciente del Caballo. A cambio, el Caballo saca a la Cabra de su timidez y la introduce en un mundo de aventuras, dándole confianza. Juntos pueden crear un hogar lleno de arte y alegría.",
        en: "A sweet and balanced combination. The energetic and social Horse finds in the Goat a haven of peace and creativity. The Goat calms the Horse's impatient spirit. In return, the Horse brings the Goat out of its shyness and into a world of adventure, giving it confidence. Together they can create a home full of art and joy.",
        de: "Eine süße und ausgewogene Kombination. Das energiegeladene und soziale Pferd findet in der Ziege eine Oase des Friedens und der Kreativität. Die Ziege beruhigt den ungeduldigen Geist des Pferdes. Im Gegenzug holt das Pferd die Ziege aus ihrer Schüchternheit und führt sie in eine Welt des Abenteuers, was ihr Selbstvertrauen gibt. Zusammen können sie ein Zuhause voller Kunst und Freude schaffen.",
        fr: "Une combinaison douce et équilibrée. Le Cheval énergique et social trouve dans la Chèvre un havre de paix et de créativité. La Chèvre calme l'esprit impatient du Cheval. En retour, le Cheval sort la Chèvre de sa timidité et l'entraîne dans un monde d'aventure, lui donnant confiance. Ensemble, ils peuvent créer un foyer plein d'art et de joie."
    },
    score: 5
  },
    
  // Choques (Peor compatibilidad)
  "Rat-Horse": {
    report: {
        es: "Esta es la pareja de choque por excelencia. La Rata y el Caballo están en oposición directa. La Rata es estratégica y valora la seguridad. El Caballo es impulsivo y ama la libertad. La Rata ve al Caballo como irresponsable, mientras que el Caballo ve a la Rata como conspiradora. Su relación requiere un esfuerzo enorme.",
        en: "This is the ultimate clash pair. The Rat and the Horse are in direct opposition. The Rat is strategic and values security. The Horse is impulsive and loves freedom. The Rat sees the Horse as irresponsible, while the Horse sees the Rat as scheming. Their relationship requires enormous effort.",
        de: "Dies ist das ultimative Konfliktpaar. Ratte und Pferd stehen in direktem Gegensatz. Die Ratte ist strategisch und schätzt Sicherheit. Das Pferd ist impulsiv und liebt die Freiheit. Die Ratte sieht das Pferd als unverantwortlich, während das Pferd die Ratte als intrigant ansieht. Ihre Beziehung erfordert enormen Aufwand.",
        fr: "C'est le couple de choc par excellence. Le Rat et le Cheval sont en opposition directe. Le Rat est stratégique et apprécie la sécurité. Le Cheval est impulsif et aime la liberté. Le Rat voit le Cheval comme irresponsable, tandis que le Cheval voit le Rat comme comploteur. Leur relation demande un effort énorme."
    },
    score: 1
  },
  "Ox-Goat": {
    report: {
        es: "Otra pareja en oposición directa. El Buey es práctico y trabajador. La Cabra es artística y emocional. El Buey no entiende la necesidad de la Cabra de soñar y puede verla como perezosa. La Cabra se siente incomprendida y sofocada por la rigidez del Buey. La frustración es casi inevitable.",
        en: "Another pair in direct opposition. The Ox is practical and hardworking. The Goat is artistic and emotional. The Ox doesn't understand the Goat's need to dream and may see it as lazy. The Goat feels misunderstood and suffocated by the Ox's rigidity. Frustration is almost inevitable.",
        de: "Ein weiteres Paar in direktem Gegensatz. Der Ochse ist praktisch und fleißig. Die Ziege ist künstlerisch und emotional. Der Ochse versteht das Bedürfnis der Ziege zu träumen nicht und mag sie als faul ansehen. Die Ziege fühlt sich missverstanden und von der Starrheit des Ochsen erstickt. Frustration ist fast unvermeidlich.",
        fr: "Un autre couple en opposition directe. Le Bœuf est pratique et travailleur. La Chèvre est artistique et émotionnelle. Le Bœuf ne comprend pas le besoin de la Chèvre de rêver et peut la voir comme paresseuse. La Chèvre se sent incomprise et étouffée par la rigidité du Bœuf. La frustration est presque inévitable."
    },
    score: 1
  },
  "Tiger-Monkey": {
    report: {
        es: "Oponentes naturales en una lucha de poder constante. El Mono disfruta desafiando la autoridad del Tigre con bromas que el Tigre no encuentra divertidas. El Tigre no tolera que se burlen de él. Ambos son inteligentes, pero su energía choca. El Tigre ve al Mono como poco fiable y el Mono ve al Tigre como demasiado dominante.",
        en: "Natural opponents in a constant power struggle. The Monkey enjoys challenging the Tiger's authority with jokes the Tiger doesn't find funny. The Tiger does not tolerate being mocked. Both are intelligent, but their energy clashes. The Tiger sees the Monkey as unreliable, and the Monkey sees the Tiger as too dominant.",
        de: "Natürliche Gegner in einem ständigen Machtkampf. Der Affe genießt es, die Autorität des Tigers mit Witzen herauszufordern, die der Tiger nicht lustig findet. Der Tiger duldet keinen Spott. Beide sind intelligent, aber ihre Energie kollidiert. Der Tiger sieht den Affen als unzuverlässig an, und der Affe sieht den Tiger als zu dominant.",
        fr: "Des adversaires naturels dans une lutte de pouvoir constante. Le Singe aime défier l'autorité du Tigre avec des blagues que le Tigre ne trouve pas drôles. Le Tigre ne tolère pas d'être moqué. Tous deux sont intelligents, mais leur énergie s'affronte. Le Tigre voit le Singe comme peu fiable, et le Singe voit le Tigre comme trop dominant."
    },
    score: 1
  },
  "Rabbit-Rooster": {
    report: {
        es: "Personalidades opuestas que difícilmente encuentran la armonía. El Conejo es diplomático y odia el conflicto. El Gallo es directo y crítico. La tendencia del Gallo a señalar defectos hiere la sensibilidad del Conejo. El Gallo quiere orden, mientras que el Conejo busca paz, dos objetivos que rara vez se alinean.",
        en: "Opposing personalities that hardly find harmony. The Rabbit is diplomatic and hates conflict. The Rooster is direct and critical. The Rooster's tendency to point out flaws deeply hurts the Rabbit's sensitivity. The Rooster wants order, while the Rabbit seeks peace, two goals that rarely align.",
        de: "Gegensätzliche Persönlichkeiten, die kaum Harmonie finden. Das Kaninchen ist diplomatisch und hasst Konflikte. Der Hahn ist direkt und kritisch. Die Tendenz des Hahns, Fehler aufzuzeigen, verletzt die Sensibilität des Kaninchens zutiefst. Der Hahn will Ordnung, während das Kaninchen Frieden sucht, zwei Ziele, die selten übereinstimmen.",
        fr: "Des personnalités opposées qui trouvent difficilement l'harmonie. Le Lapin est diplomate et déteste les conflits. Le Coq est direct et critique. La tendance du Coq à souligner les défauts blesse profondément la sensibilité du Lapin. Le Coq veut de l'ordre, tandis que le Lapin cherche la paix, deux objectifs qui s'alignent rarement."
    },
    score: 1
  },
  "Dragon-Dog": {
    report: {
        es: "El optimista visionario se encuentra con el realista cínico. El Dragón espera que los demás le sigan. El Perro es cauteloso y ve los problemas antes que las oportunidades. El Dragón se siente frenado por la naturaleza pesimista del Perro. El Perro desconfía de la arrogancia del Dragón. Sus visiones del mundo son demasiado diferentes.",
        en: "The optimistic visionary meets the cynical realist. The Dragon expects others to follow. The Dog is cautious and sees problems before opportunities. The Dragon feels held back by the Dog's pessimistic nature. The Dog distrusts the Dragon's arrogance. Their worldviews are too different.",
        de: "Der optimistische Visionär trifft auf den zynischen Realisten. Der Drache erwartet, dass andere ihm folgen. Der Hund ist vorsichtig und sieht Probleme vor den Möglichkeiten. Der Drache fühlt sich von der pessimistischen Natur des Hundes gebremst. Der Hund misstraut der Arroganz des Drachen. Ihre Weltanschauungen sind zu unterschiedlich.",
        fr: "Le visionnaire optimiste rencontre le réaliste cynique. Le Dragon s'attend à ce que les autres le suivent. Le Chien est prudent et voit les problèmes avant les opportunités. Le Dragon se sent freiné par la nature pessimiste du Chien. Le Chien se méfie de l'arrogance du Dragon. Leurs visions du monde sont trop différentes."
    },
    score: 1
  },
  "Snake-Pig": {
    report: {
        es: "Una combinación de desconfianza y malentendidos. La Serpiente es reservada y calculadora. El Cerdo es honesto y directo. La Serpiente sospecha de la naturaleza abierta del Cerdo, viéndolo como simplista. El Cerdo se siente confundido y herido por el secretismo de la Serpiente. La conexión y la confianza son muy difíciles de establecer.",
        en: "A combination of mistrust and misunderstanding. The Snake is reserved and calculating. The Pig is honest and direct. The Snake is suspicious of the Pig's open nature, seeing it as simplistic. The Pig feels confused and hurt by the Snake's secrecy. Connection and trust are very difficult to establish.",
        de: "Eine Kombination aus Misstrauen und Missverständnissen. Die Schlange ist zurückhaltend und berechnend. Das Schwein ist ehrlich und direkt. Die Schlange misstraut der offenen Natur des Schweins und sieht es als simpel an. Das Schwein fühlt sich durch die Geheimhaltung der Schlange verwirrt und verletzt. Verbindung und Vertrauen sind sehr schwer aufzubauen.",
        fr: "Une combinaison de méfiance et de malentendus. Le Serpent est réservé et calculateur. Le Cochon est honnête et direct. Le Serpent se méfie de la nature ouverte du Cochon, la considérant comme simpliste. Le Cochon se sent confus et blessé par le secret du Serpent. La connexion et la confiance sont très difficiles à établir."
    },
    score: 1
  },

  // --- Combinaciones de la Rata ---
  "Rat-Rat": {
    report: {
        es: "Cuando dos Ratas se unen, la conexión es instantánea. Se reconocen en su inteligencia y ambición. Juntos, son un equipo formidable para los negocios y la vida social. La competencia puede surgir, pero si celebran los éxitos del otro, su vínculo es fuerte y próspero.",
        en: "When two Rats get together, the connection is instant. They recognize each other's intelligence and ambition. Together, they are a formidable team for business and social life. Competition can arise, but if they celebrate each other's successes, their bond is strong and prosperous.",
        de: "Wenn zwei Ratten zusammenkommen, ist die Verbindung sofort da. Sie erkennen die Intelligenz und den Ehrgeiz des anderen. Zusammen sind sie ein beeindruckendes Team für Geschäft und Gesellschaft. Wettbewerb kann entstehen, aber wenn sie die Erfolge des anderen feiern, ist ihre Bindung stark und gedeiht.",
        fr: "Lorsque deux Rats se réunissent, la connexion est instantanée. Ils reconnaissent mutuellement leur intelligence et leur ambition. Ensemble, ils forment une équipe redoutable pour les affaires et la vie sociale. La compétition peut survenir, mais s'ils célèbrent les succès de l'autre, leur lien est fort et prospère."
    },
    score: 4
  },
  "Rat-Snake": {
    report: {
        es: "Una combinación intrigante y magnética de astucia y sabiduría. La Rata se siente fascinada por la mente profunda de la Serpiente. La Serpiente respeta la inteligencia rápida de la Rata. Son una excelente pareja para la estrategia, aunque la naturaleza social de la Rata puede chocar con la posesividad de la Serpiente.",
        en: "An intriguing and magnetic combination of cunning and wisdom. The Rat is fascinated by the Snake's deep mind. The Snake respects the Rat's quick intelligence. They are an excellent pair for strategy, although the Rat's social nature can clash with the Snake's possessiveness.",
        de: "Eine faszinierende und magnetische Kombination aus List und Weisheit. Die Ratte ist fasziniert vom tiefen Geist der Schlange. Die Schlange respektiert die schnelle Intelligenz der Ratte. Sie sind ein ausgezeichnetes Paar für Strategie, obwohl die soziale Natur der Ratte mit der Besitzgier der Schlange kollidieren kann.",
        fr: "Une combinaison intrigante et magnétique de ruse et de sagesse. Le Rat est fasciné par l'esprit profond du Serpent. Le Serpent respecte l'intelligence vive du Rat. Ils forment une excellente paire pour la stratégie, bien que la nature sociale du Rat puisse entrer en conflit avec la possessivité du Serpent."
    },
    score: 4
  },
  "Rat-Goat": {
    report: {
        es: "Esta es una de las combinaciones más desafiantes. La Rata práctica y ambiciosa tiene dificultades para entender la naturaleza emocional y soñadora de la Cabra. La Cabra, a su vez, se siente herida por la crítica directa de la Rata. Para que funcione, la Rata debe valorar la creatividad, y la Cabra ser más práctica.",
        en: "This is one of the most challenging combinations. The practical and ambitious Rat has difficulty understanding the emotional and dreamy nature of the Goat. The Goat, in turn, feels hurt by the Rat's direct criticism. For it to work, the Rat must learn to value creativity, and the Goat to be more practical.",
        de: "Dies ist eine der schwierigsten Kombinationen. Die praktische und ehrgeizige Ratte hat Schwierigkeiten, die emotionale und träumerische Natur der Ziege zu verstehen. Die Ziege wiederum fühlt sich durch die direkte Kritik der Ratte verletzt. Damit es funktioniert, muss die Ratte lernen, Kreativität zu schätzen, und die Ziege, praktischer zu sein.",
        fr: "C'est l'une des combinaisons les plus difficiles. Le Rat pratique et ambitieux a du mal à comprendre la nature émotionnelle et rêveuse de la Chèvre. La Chèvre, à son tour, se sent blessée par la critique directe du Rat. Pour que cela fonctionne, le Rat doit apprendre à valoriser la créativité, et la Chèvre à être plus pratique."
    },
    score: 2
  },
  "Rat-Rooster": {
    report: {
        es: "Una relación llena de debates y críticas. Tanto la Rata como el Gallo son inteligentes, pero sus estilos chocan. El Gallo es directo y crítico, lo que irrita a la Rata, que prefiere usar su ingenio de forma más sutil. La clave del éxito es respetar sus diferentes estilos de comunicación.",
        en: "A relationship full of debates and criticism. Both the Rat and the Rooster are intelligent, but their styles clash. The Rooster is direct and critical, which irritates the Rat, who prefers to use its wit more subtly. The key to success is to respect their different communication styles.",
        de: "Eine Beziehung voller Debatten und Kritik. Sowohl die Ratte als auch der Hahn sind intelligent, aber ihre Stile kollidieren. Der Hahn ist direkt und kritisch, was die Ratte irritiert, die ihren Witz lieber subtiler einsetzt. Der Schlüssel zum Erfolg liegt darin, ihre unterschiedlichen Kommunikationsstile zu respektieren.",
        fr: "Une relation pleine de débats et de critiques. Le Rat et le Coq sont tous deux intelligents, mais leurs styles s'affrontent. Le Coq est direct et critique, ce qui irrite le Rat, qui préfère utiliser son esprit de manière plus subtile. La clé du succès est de respecter leurs différents styles de communication."
    },
    score: 2
  },
  "Rat-Dog": {
    report: {
        es: "Una combinación sólida basada en el respeto mutuo. La Rata admira la lealtad y el idealismo del Perro. El Perro respeta la inteligencia y la capacidad de la Rata para cuidar de su familia. El oportunismo de la Rata puede chocar con la moralidad del Perro, pero su lealtad mutua generalmente supera cualquier diferencia.",
        en: "A solid combination based on mutual respect. The Rat admires the Dog's loyalty and idealism. The Dog respects the Rat's intelligence and ability to care for its family. The Rat's occasional opportunism can clash with the Dog's morality, but their mutual loyalty usually overcomes any differences.",
        de: "Eine solide Kombination, die auf gegenseitigem Respekt basiert. Die Ratte bewundert die Loyalität und den Idealismus des Hundes. Der Hund respektiert die Intelligenz der Ratte und ihre Fähigkeit, sich um ihre Familie zu kümmern. Der gelegentliche Opportunismus der Ratte kann mit der Moral des Hundes kollidieren, aber ihre gegenseitige Loyalität überwindet normalerweise alle Unterschiede.",
        fr: "Une combinaison solide basée sur le respect mutuel. Le Rat admire la loyauté et l'idéalisme du Chien. Le Chien respecte l'intelligence du Rat et sa capacité à prendre soin de sa famille. L'opportunisme occasionnel du Rat peut entrer en conflit avec la moralité du Chien, mais leur loyauté mutuelle surmonte généralement toutes les différences."
    },
    score: 3
  },
  "Rat-Pig": {
    report: {
        es: "Una pareja muy feliz y armoniosa. La naturaleza generosa del Cerdo hace que la Rata se sienta completamente segura y amada. El Cerdo no juzga la naturaleza ambiciosa de la Rata, sino que disfruta de la comodidad que esta le proporciona. Es una relación llena de afecto y disfrute mutuo.",
        en: "A very happy and harmonious couple. The Pig's generous nature makes the Rat feel completely secure and loved. The Pig does not judge the Rat's ambitious nature but enjoys the comfort it provides. It is a relationship full of affection and mutual enjoyment.",
        de: "Ein sehr glückliches und harmonisches Paar. Die großzügige Natur des Schweins gibt der Ratte das Gefühl, vollkommen sicher und geliebt zu sein. Das Schwein verurteilt die ehrgeizige Natur der Ratte nicht, sondern genießt den Komfort, den sie bietet. Es ist eine Beziehung voller Zuneigung und gegenseitigem Vergnügen.",
        fr: "Un couple très heureux et harmonieux. La nature généreuse du Cochon fait que le Rat se sent complètement en sécurité et aimé. Le Cochon ne juge pas la nature ambitieuse du Rat mais apprécie le confort qu'il lui procure. C'est une relation pleine d'affection et de plaisir mutuel."
    },
    score: 4
  },

  // --- Combinaciones del Tigre ---
  "Tiger-Rat": {
    report: {
      es: "El poderoso Tigre y la astuta Rata forman una pareja intrigante. La Rata admira el coraje del Tigre, mientras que el Tigre se siente atraído por el ingenio de la Rata. Pueden ser excelentes socios si el Tigre escucha los consejos estratégicos de la Rata y la Rata confía en el liderazgo del Tigre.",
      en: "The powerful Tiger and the cunning Rat make an intriguing pair. The Rat admires the Tiger's courage, while the Tiger is attracted to the Rat's quick wit. They can be excellent partners if the Tiger listens to the Rat's strategic advice and the Rat trusts the Tiger's leadership.",
      de: "Der mächtige Tiger und die schlaue Ratte bilden ein faszinierendes Paar. Die Ratte bewundert den Mut des Tigers, während der Tiger vom schnellen Witz der Ratte angezogen wird. Sie können ausgezeichnete Partner sein, wenn der Tiger auf den strategischen Rat der Ratte hört und die Ratte der Führung des Tigers vertraut.",
      fr: "Le puissant Tigre et le rusé Rat forment une paire intrigante. Le Rat admire le courage du Tigre, tandis que le Tigre est attiré par la vivacité d'esprit du Rat. Ils peuvent être d'excellents partenaires si le Tigre écoute les conseils stratégiques du Rat et si le Rat fait confiance au leadership du Tigre."
    },
    score: 3
  },
  "Tiger-Tiger": {
    report: {
      es: "Dos Tigres juntos son una fuerza de la naturaleza, pero también una receta para el conflicto. La atracción es instantánea, pero la lucha por el liderazgo es inevitable. Si aprenden a funcionar como un equipo, son imparables, pero si compiten, la relación puede ser destructiva.",
      en: "Two Tigers together are a force of nature, but also a recipe for conflict. The attraction is instant, but the struggle for leadership is inevitable. If they learn to function as a team, they are unstoppable, but if they compete, the relationship can be destructive.",
      de: "Zwei Tiger zusammen sind eine Naturgewalt, aber auch ein Rezept für Konflikte. Die Anziehung ist sofort da, aber der Kampf um die Führung ist unvermeidlich. Wenn sie lernen, als Team zu funktionieren, sind sie unaufhaltsam, aber wenn sie konkurrieren, kann die Beziehung zerstörerisch sein.",
      fr: "Deux Tigres ensemble sont une force de la nature, mais aussi une recette pour le conflit. L'attraction est instantanée, mais la lutte pour le leadership est inévitable. S'ils apprennent à fonctionner en équipe, ils sont imparables, mais s'ils rivalisent, la relation peut être destructrice."
    },
    score: 3
  },
  "Tiger-Goat": {
    report: {
      es: "Una pareja que combina la fuerza con la creatividad. El Tigre se siente atraído por la naturaleza amable de la Cabra, y la Cabra admira la confianza del Tigre. Sin embargo, el Tigre puede impacientarse con la sensibilidad de la Cabra, y la Cabra puede sentirse descuidada por la independencia del Tigre.",
      en: "A pair that combines strength with creativity. The Tiger is attracted to the Goat's kind nature, and the Goat admires the Tiger's confidence. However, the Tiger can become impatient with the Goat's sensitivity, and the Goat can feel neglected by the Tiger's independence.",
      de: "Ein Paar, das Stärke mit Kreativität verbindet. Der Tiger fühlt sich von der freundlichen Natur der Ziege angezogen, und die Ziege bewundert das Selbstvertrauen des Tigers. Der Tiger kann jedoch ungeduldig mit der Sensibilität der Ziege werden, und die Ziege kann sich von der Unabhängigkeit des Tigers vernachlässigt fühlen.",
      fr: "Un couple qui allie force et créativité. Le Tigre est attiré par la nature douce de la Chèvre, et la Chèvre admire la confiance du Tigre. Cependant, le Tigre peut s'impatienter de la sensibilité de la Chèvre, et la Chèvre peut se sentir négligée par l'indépendance du Tigre."
    },
    score: 3
  },
  "Tiger-Rooster": {
    report: {
      es: "El líder audaz se encuentra con el perfeccionista meticuloso. El Gallo no puede evitar señalar los defectos, lo que el orgulloso Tigre percibe como una crítica constante. El Tigre, a su vez, puede ver al Gallo como quisquilloso y limitante. Su relación requiere roles muy definidos para funcionar.",
      en: "The bold leader meets the meticulous perfectionist. The Rooster can't help but point out flaws, which the proud Tiger perceives as constant criticism. The Tiger, in turn, can see the Rooster as picky and limiting. Their relationship requires very defined roles to work.",
      de: "Der kühne Anführer trifft auf den akribischen Perfektionisten. Der Hahn kann nicht umhin, Fehler aufzuzeigen, was der stolze Tiger als ständige Kritik empfindet. Der Tiger wiederum kann den Hahn als wählerisch und einschränkend ansehen. Ihre Beziehung erfordert sehr klar definierte Rollen, um zu funktionieren.",
      fr: "Le chef audacieux rencontre le perfectionniste méticuleux. Le Coq ne peut s'empêcher de souligner les défauts, ce que le fier Tigre perçoit comme une critique constante. Le Tigre, à son tour, peut voir le Coq comme pointilleux et limitant. Leur relation nécessite des rôles très définis pour fonctionner."
    },
    score: 2
  },

  // --- Combinaciones del Conejo ---
  "Rabbit-Rat": {
    report: {
      es: "Esta combinación, conocida como la 'penalidad de la falta de cortesía', presenta desafíos. La naturaleza directa de la Rata puede herir al sensible Conejo. Para que funcione, la Rata debe aprender el arte del tacto, y el Conejo debe desarrollar una piel un poco más gruesa.",
      en: "This combination, known as the 'penalty of incivility,' presents challenges. The Rat's direct nature can hurt the sensitive Rabbit. For it to work, the Rat must learn the art of tact, and the Rabbit must develop a thicker skin.",
      de: "Diese Kombination, bekannt als die 'Strafe der Unhöflichkeit', birgt Herausforderungen. Die direkte Art der Ratte kann das empfindliche Kaninchen verletzen. Damit es funktioniert, muss die Ratte die Kunst des Taktes lernen und das Kaninchen eine dickere Haut entwickeln.",
      fr: "Cette combinaison, connue sous le nom de 'pénalité de l'incivilité', présente des défis. La nature directe du Rat peut blesser le Lapin sensible. Pour que cela fonctionne, le Rat doit apprendre l'art du tact, et le Lapin doit développer une peau un peu plus épaisse."
    },
    score: 2
  },
  "Rabbit-Tiger": {
    report: {
      es: "Una combinación de poder y gentileza que requiere un cuidado delicado. El sensible Conejo puede sentirse abrumado por la naturaleza poderosa del Tigre. Si el Tigre actúa como un protector gentil en lugar de un depredador, y el Conejo expresa sus límites, pueden encontrar un equilibrio.",
      en: "A combination of power and gentleness that requires delicate care. The sensitive Rabbit can feel overwhelmed by the Tiger's powerful nature. If the Tiger acts as a gentle protector instead of a predator, and the Rabbit expresses its boundaries, they can find a balance.",
      de: "Eine Kombination aus Macht und Sanftheit, die eine sensible Pflege erfordert. Das empfindliche Kaninchen kann sich von der mächtigen Natur des Tigers überfordert fühlen. Wenn der Tiger als sanfter Beschützer anstelle eines Raubtiers auftritt und das Kaninchen seine Grenzen zum Ausdruck bringt, können sie ein Gleichgewicht finden.",
      fr: "Une combinaison de puissance et de douceur qui nécessite un soin délicat. Le Lapin sensible peut se sentir dépassé par la nature puissante du Tigre. Si le Tigre agit comme un protecteur doux plutôt que comme un prédateur, et si le Lapin exprime ses limites, ils peuvent trouver un équilibre."
    },
    score: 2
  },
  "Rabbit-Ox": {
    report: {
      es: "El Buey firme ofrece un ancla de seguridad que el ansioso Conejo encuentra reconfortante. El Conejo aporta una gracia social que suaviza la vida del pragmático Buey. Su comunicación puede ser un desafío, pero el respeto por sus diferentes ritmos es crucial para una pareja sólida.",
      en: "The firm Ox offers an anchor of security that the anxious Rabbit finds comforting. The Rabbit brings a social grace that softens the pragmatic Ox's life. Their communication can be a challenge, but respect for their different rhythms is crucial for a solid partnership.",
      de: "Der feste Ochse bietet einen Anker der Sicherheit, den das ängstliche Kaninchen beruhigend findet. Das Kaninchen bringt eine soziale Anmut mit, die das Leben des pragmatischen Ochsen weicher macht. Ihre Kommunikation kann eine Herausforderung sein, aber Respekt für ihre unterschiedlichen Rhythmen ist entscheidend für eine solide Partnerschaft.",
      fr: "Le Bœuf ferme offre une ancre de sécurité que le Lapin anxieux trouve réconfortante. Le Lapin apporte une grâce sociale qui adoucit la vie du Bœuf pragmatique. Leur communication peut être un défi, mais le respect de leurs rythmes différents est crucial pour un partenariat solide."
    },
    score: 3
  },
  "Rabbit-Rabbit": {
    report: {
      es: "Dos Conejos juntos es la encarnación de la paz y el confort. Se entienden a un nivel profundo, pero su aversión compartida al conflicto es su mayor debilidad. Pueden barrer los problemas debajo de la alfombra hasta que se vuelven insuperables. Deben abordar los problemas de frente.",
      en: "Two Rabbits together is the embodiment of peace and comfort. They understand each other on a deep level, but their shared aversion to conflict is their greatest weakness. They might sweep problems under the rug until they become insurmountable. They must address issues head-on.",
      de: "Zwei Kaninchen zusammen sind die Verkörperung von Frieden und Komfort. Sie verstehen sich auf einer tiefen Ebene, aber ihre gemeinsame Abneigung gegen Konflikte ist ihre größte Schwäche. Sie könnten Probleme unter den Teppich kehren, bis sie unüberwindbar werden. Sie müssen Probleme direkt angehen.",
      fr: "Deux Lapins ensemble, c'est l'incarnation de la paix et du confort. Ils se comprennent à un niveau profond, mais leur aversion commune pour les conflits est leur plus grande faiblesse. Ils pourraient balayer les problèmes sous le tapis jusqu'à ce qu'ils deviennent insurmontables. Ils doivent aborder les problèmes de front."
    },
    score: 4
  },
  "Rabbit-Dragon": {
    report: {
      es: "Una combinación fascinante. El Conejo astuto puede manejar el ego del poderoso Dragón. El Dragón se siente atraído por la inteligencia y el buen gusto del Conejo. El Conejo es el estratega perfecto detrás del trono. El Dragón debe aprender a escuchar y valorar los consejos de su sabio compañero.",
      en: "A fascinating combination. The cunning Rabbit can handle the powerful Dragon's ego. The Dragon is attracted to the Rabbit's intelligence and good taste. The Rabbit is the perfect strategist behind the throne. The Dragon must learn to listen and value its wise partner's advice.",
      de: "Eine faszinierende Kombination. Das schlaue Kaninchen kann mit dem Ego des mächtigen Drachen umgehen. Der Drache fühlt sich von der Intelligenz und dem guten Geschmack des Kaninchens angezogen. Das Kaninchen ist der perfekte Stratege hinter dem Thron. Der Drache muss lernen, zuzuhören und den Rat seines weisen Partners zu schätzen.",
      fr: "Une combinaison fascinante. Le Lapin rusé peut gérer l'ego du puissant Dragon. Le Dragon est attiré par l'intelligence et le bon goût du Lapin. Le Lapin est le stratège parfait derrière le trône. Le Dragon doit apprendre à écouter et à apprécier les conseils de son sage partenaire."
    },
    score: 3
  },
  "Rabbit-Snake": {
    report: {
      es: "Una pareja elegante, inteligente y muy compatible. Ambos son refinados y sabios. Comparten un amor por el arte y un ambiente tranquilo. Se comunican a menudo en un nivel no verbal. La confianza es fundamental. Una vez establecida, su vínculo es profundo y duradero.",
      en: "An elegant, intelligent, and very compatible pair. Both are refined and wise. They share a love for art and a quiet environment. They often communicate on a non-verbal level. Trust is fundamental. Once established, their bond is deep and lasting.",
      de: "Ein elegantes, intelligentes und sehr kompatibles Paar. Beide sind raffiniert und weise. Sie teilen die Liebe zur Kunst und einer ruhigen Umgebung. Sie kommunizieren oft auf einer nonverbalen Ebene. Vertrauen ist fundamental. Einmal hergestellt, ist ihre Bindung tief und dauerhaft.",
      fr: "Un couple élégant, intelligent et très compatible. Tous deux sont raffinés et sages. Ils partagent un amour pour l'art et un environnement calme. Ils communiquent souvent à un niveau non verbal. La confiance est fondamentale. Une fois établie, leur lien est profond et durable."
    },
    score: 4
  },
  "Rabbit-Horse": {
    report: {
      es: "Una combinación desafiante. El Conejo anhela un hogar seguro, mientras que el Caballo necesita aventura. Sus necesidades fundamentales están en conflicto. El estilo de vida impulsivo del Caballo genera ansiedad en el cauteloso Conejo. Requiere un compromiso enorme para funcionar.",
      en: "A challenging combination. The Rabbit craves a secure home, while the Horse needs adventure. Their fundamental needs are in direct conflict. The Horse's impulsive lifestyle creates anxiety in the cautious Rabbit. It requires enormous commitment to work.",
      de: "Eine herausfordernde Kombination. Das Kaninchen sehnt sich nach einem sicheren Zuhause, während das Pferd Abenteuer braucht. Ihre grundlegenden Bedürfnisse stehen in direktem Konflikt. Der impulsive Lebensstil des Pferdes erzeugt Angst beim vorsichtigen Kaninchen. Es erfordert enormes Engagement, um zu funktionieren.",
      fr: "Une combinaison difficile. Le Lapin aspire à un foyer sûr, tandis que le Cheval a besoin d'aventure. Leurs besoins fondamentaux sont en conflit direct. Le style de vie impulsif du Cheval crée de l'anxiété chez le Lapin prudent. Cela demande un engagement énorme pour fonctionner."
    },
    score: 2
  },
  "Rabbit-Monkey": {
    report: {
      es: "El diplomático astuto se encuentra con el genio travieso. Pueden compartir un humor agudo, pero la naturaleza disruptiva del Mono perturba la paz que el Conejo necesita. El Mono puede ver al Conejo como aburrido, y el Conejo puede encontrar al Mono agotador.",
      en: "The cunning diplomat meets the mischievous genius. They can share a sharp humor, but the Monkey's disruptive nature disturbs the peace the Rabbit needs. The Monkey may see the Rabbit as boring, and the Rabbit may find the Monkey exhausting.",
      de: "Der schlaue Diplomat trifft auf das schelmische Genie. Sie können einen scharfen Humor teilen, aber die störende Natur des Affen stört den Frieden, den das Kaninchen braucht. Der Affe mag das Kaninchen als langweilig ansehen, und das Kaninchen mag den Affen als anstrengend empfinden.",
      fr: "Le diplomate rusé rencontre le génie espiègle. Ils peuvent partager un humour vif, mais la nature perturbatrice du Singe dérange la paix dont le Lapin a besoin. Le Singe peut voir le Lapin comme ennuyeux, et le Lapin peut trouver le Singe épuisant."
    },
    score: 2
  },

  // --- Combinaciones del Dragón ---
  "Dragon-Ox": {
    report: {
      es: "El carismático Dragón se encuentra con el pragmático Buey. Es una unión de poder y estabilidad, pero también de voluntades fuertes. El Dragón, audaz, puede encontrar al Buey demasiado conservador. El Buey puede ver al Dragón como imprudente. Si alinean sus metas, son un equipo formidable.",
      en: "The charismatic Dragon meets the pragmatic Ox. It's a union of power and stability, but also of strong wills. The bold Dragon may find the Ox too conservative. The Ox may see the Dragon as reckless. If they align their goals, they are a formidable team.",
      de: "Der charismatische Drache trifft auf den pragmatischen Ochsen. Es ist eine Vereinigung von Macht und Stabilität, aber auch von starken Willen. Der kühne Drache mag den Ochsen als zu konservativ empfinden. Der Ochse mag den Drachen als rücksichtslos ansehen. Wenn sie ihre Ziele aufeinander abstimmen, sind sie ein beeindruckendes Team.",
      fr: "Le Dragon charismatique rencontre le Bœuf pragmatique. C'est une union de pouvoir et de stabilité, mais aussi de volontés fortes. Le Dragon audacieux peut trouver le Bœuf trop conservateur. Le Bœuf peut voir le Dragon comme imprudent. S'ils alignent leurs objectifs, ils forment une équipe redoutable."
    },
    score: 3
  },
  "Dragon-Dragon": {
    report: {
      es: "Cuando dos Dragones se unen, el resultado es una explosión de carisma y ambición. Es una relación entre dos majestuosas realezas, llena de pasión. El choque de egos es inevitable. Si aprenden a gobernar juntos en un reino compartido, su unión es invencible.",
      en: "When two Dragons unite, the result is an explosion of charisma and ambition. It's a relationship between two majestic royalties, full of passion. The clash of egos is inevitable. If they learn to rule a shared kingdom together, their union is invincible.",
      de: "Wenn zwei Drachen sich vereinen, ist das Ergebnis eine Explosion von Charisma und Ehrgeiz. Es ist eine Beziehung zwischen zwei majestätischen Königshäusern, voller Leidenschaft. Der Kampf der Egos ist unvermeidlich. Wenn sie lernen, gemeinsam ein gemeinsames Königreich zu regieren, ist ihre Vereinigung unbesiegbar.",
      fr: "Lorsque deux Dragons s'unissent, le résultat est une explosion de charisme et d'ambition. C'est une relation entre deux majestueuses royautés, pleine de passion. Le choc des ego est inévitable. S'ils apprennent à régner ensemble sur un royaume partagé, leur union est invincible."
    },
    score: 4
  },
  "Dragon-Snake": {
    report: {
      es: "El magnánimo Dragón se encuentra con la sabia Serpiente. Es una combinación de poder y sabiduría. El Dragón aporta la energía, mientras que la Serpiente proporciona la estrategia. Son una pareja muy inteligente, pero la posesividad de la Serpiente puede chocar con la necesidad del Dragón de ser admirado por todos.",
      en: "The magnanimous Dragon meets the wise Snake. It's a combination of power and wisdom. The Dragon brings the energy, while the Snake provides the strategy. They are a very intelligent couple, but the Snake's possessiveness can clash with the Dragon's need for admiration from all.",
      de: "Der großmütige Drache trifft auf die weise Schlange. Es ist eine Kombination aus Macht und Weisheit. Der Drache bringt die Energie, während die Schlange die Strategie liefert. Sie sind ein sehr intelligentes Paar, aber die besitzergreifende Art der Schlange kann mit dem Bedürfnis des Drachen nach Bewunderung von allen kollidieren.",
      fr: "Le Dragon magnanime rencontre le Serpent sage. C'est une combinaison de pouvoir et de sagesse. Le Dragon apporte l'énergie, tandis que le Serpent fournit la stratégie. Ils forment un couple très intelligent, mais la possessivité du Serpent peut entrer en conflit avec le besoin d'admiration du Dragon de la part de tous."
    },
    score: 4
  },
  "Dragon-Horse": {
    report: {
      es: "Una pareja vibrante y enérgica. Tanto el Dragón como el Caballo son extrovertidos y aman la aventura. Se dan mutuamente la libertad que necesitan. Pueden surgir conflictos si el Dragón se vuelve demasiado controlador o si el Caballo parece demasiado independiente.",
      en: "A vibrant and energetic couple. Both the Dragon and the Horse are extroverted and love adventure. They give each other the freedom they need. Conflicts can arise if the Dragon becomes too controlling or if the Horse seems too independent.",
      de: "Ein lebhaftes und energiegeladenes Paar. Sowohl der Drache als auch das Pferd sind extrovertiert und lieben Abenteuer. Sie geben einander die Freiheit, die sie brauchen. Konflikte können entstehen, wenn der Drache zu kontrollierend wird oder wenn das Pferd zu unabhängig erscheint.",
      fr: "Un couple vibrant et énergique. Le Dragon et le Cheval sont tous deux extravertis et aiment l'aventure. Ils se donnent mutuellement la liberté dont ils ont besoin. Des conflits могут survenir si le Dragon devient trop contrôlant ou si le Cheval semble trop indépendant."
    },
    score: 4
  },
  "Dragon-Goat": {
    report: {
      es: "Una combinación que requiere mucho esfuerzo. El Dragón busca la grandeza, mientras que la Cabra anhela la paz. El Dragón puede ofrecer a la Cabra la confianza que necesita, y la Cabra puede enseñar al Dragón sobre la sensibilidad. Sin embargo, el Dragón puede ver a la Cabra como demasiado pasiva, y la Cabra puede sentirse abrumada por la energía del Dragón.",
      en: "A combination that requires a lot of effort. The Dragon seeks greatness, while the Goat craves peace. The Dragon can offer the Goat the confidence it needs, and the Goat can teach the Dragon about sensitivity. However, the Dragon may see the Goat as too passive, and the Goat may feel overwhelmed by the Dragon's energy.",
      de: "Eine Kombination, die viel Aufwand erfordert. Der Drache sucht Größe, während die Ziege sich nach Frieden sehnt. Der Drache kann der Ziege das nötige Selbstvertrauen geben, und die Ziege kann dem Drachen etwas über Sensibilität beibringen. Der Drache mag die Ziege jedoch als zu passiv ansehen, und die Ziege kann sich von der Energie des Drachen überfordert fühlen.",
      fr: "Une combinaison qui demande beaucoup d'efforts. Le Dragon recherche la grandeur, tandis que la Chèvre aspire à la paix. Le Dragon peut offrir à la Chèvre la confiance dont elle a besoin, et la Chèvre peut enseigner au Dragon la sensibilité. Cependant, le Dragon peut voir la Chèvre comme trop passive, et la Chèvre peut se sentir dépassée par l'énergie du Dragon."
    },
    score: 2
  },
  "Dragon-Pig": {
    report: {
      es: "El poderoso Dragón encuentra un admirador leal en el generoso Cerdo. El Cerdo no compite por el protagonismo y se siente feliz celebrando los éxitos del Dragón. El Dragón ofrece al Cerdo emoción y protección. Es una relación muy positiva y de apoyo mutuo.",
      en: "The powerful Dragon finds a loyal admirer in the generous Pig. The Pig does not compete for the spotlight and is happy to celebrate the Dragon's successes. The Dragon offers the Pig excitement and protection. It is a very positive and mutually supportive relationship.",
      de: "Der mächtige Drache findet im großzügigen Schwein einen treuen Bewunderer. Das Schwein konkurriert nicht um das Rampenlicht und freut sich, die Erfolge des Drachen zu feiern. Der Drache bietet dem Schwein Aufregung und Schutz. Es ist eine sehr positive und gegenseitig unterstützende Beziehung.",
      fr: "Le puissant Dragon trouve un admirateur loyal dans le généreux Cochon. Le Cochon ne rivalise pas pour être sous les feux de la rampe et est heureux de célébrer les succès du Dragon. Le Dragon offre au Cochon de l'excitation et de la protection. C'est une relation très positive et de soutien mutuel."
    },
    score: 4
  },

  // Combinaciones restantes
  "Ox-Tiger": {
    report: {
        es: "Una relación de voluntades fuertes. El Buey es metódico, el Tigre es impulsivo. El Tigre se siente frustrado por la lentitud del Buey, y el Buey se exaspera con la imprudencia del Tigre. El respeto es posible si logran objetivos juntos, pero la armonía en la vida cotidiana es un desafío.",
        en: "A relationship of strong wills. The Ox is methodical, the Tiger is impulsive. The Tiger feels frustrated by the Ox's slowness, and the Ox is exasperated by the Tiger's recklessness. Respect is possible if they achieve goals together, but harmony in daily life is a challenge.",
        de: "Eine Beziehung starker Willen. Der Ochse ist methodisch, der Tiger ist impulsiv. Der Tiger ist frustriert von der Langsamkeit des Ochsen, und der Ochse ist über die Tollkühnheit des Tigers verärgert. Respekt ist möglich, wenn sie gemeinsam Ziele erreichen, aber Harmonie im täglichen Leben ist eine Herausforderung.",
        fr: "Une relation de volontés fortes. Le Bœuf est méthodique, le Tigre est impulsif. Le Tigre se sent frustré par la lenteur du Bœuf, et le Bœuf est exaspéré par l'imprudence du Tigre. Le respect est possible s'ils atteignent des objectifs ensemble, mais l'harmonie dans la vie quotidienne est un défi."
    },
    score: 2
  },
  "Tiger-Snake": {
    report: {
        es: "Una combinación de tensión y desconfianza. El Tigre es abierto y directo, la Serpiente es reservada y calculadora. El Tigre no confía en la naturaleza sigilosa de la Serpiente, y la Serpiente ve al Tigre como ruidoso y poco sofisticado. Una relación cercana es muy difícil.",
        en: "A combination of tension and mistrust. The Tiger is open and direct, the Snake is reserved and calculating. The Tiger distrusts the Snake's stealthy nature, and the Snake sees the Tiger as loud and unsophisticated. A close relationship is very difficult.",
        de: "Eine Kombination aus Spannung und Misstrauen. Der Tiger ist offen und direkt, die Schlange ist zurückhaltend und berechnend. Der Tiger misstraut der heimlichen Natur der Schlange, und die Schlange sieht den Tiger als laut und unkultiviert an. Eine enge Beziehung ist sehr schwierig.",
        fr: "Une combinaison de tension et de méfiance. Le Tigre est ouvert et direct, le Serpent est réservé et calculateur. Le Tigre se méfie de la nature furtive du Serpent, et le Serpent voit le Tigre comme bruyant et peu sophistiqué. Une relation proche est très difficile."
    },
    score: 2
  },
  "Horse-Rooster": {
    report: {
        es: "Una pareja con potencial para la irritación mutua. El Caballo odia ser criticado, y el Gallo no puede evitar señalar los defectos. El Gallo ve al Caballo como desorganizado, y el Caballo ve al Gallo como un fastidioso. La crítica constante del Gallo agotará la paciencia del Caballo.",
        en: "A couple with potential for mutual irritation. The Horse hates being criticized, and the Rooster can't help but point out flaws. The Rooster sees the Horse as disorganized, and the Horse sees the Rooster as a nuisance. The Rooster's constant criticism will exhaust the Horse's patience.",
        de: "Ein Paar mit Potenzial für gegenseitige Irritationen. Das Pferd hasst es, kritisiert zu werden, und der Hahn kann nicht umhin, Fehler aufzuzeigen. Der Hahn sieht das Pferd als unorganisiert an, und das Pferd sieht den Hahn als lästig an. Die ständige Kritik des Hahns wird die Geduld des Pferdes erschöpfen.",
        fr: "Un couple avec un potentiel d'irritation mutuelle. Le Cheval déteste être critiqué, et le Coq ne peut s'empêcher de souligner les défauts. Le Coq voit le Cheval comme désorganisé, et le Cheval voit le Coq comme une nuisance. La critique constante du Coq épuisera la patience du Cheval."
    },
    score: 2
  }
};
