
import type { ZodiacSignName } from '@/types';

export interface CompatibilityReportDetail {
  report: string;
  score: number;
}

export const loveCompatibilityPairings: Record<string, CompatibilityReportDetail> = {
  "Aries-Leo": {
    report: "Una pareja poderosa y apasionada. Ambos son signos de Fuego, lo que crea una conexión instantánea y llena de energía. Su amor es vibrante, lleno de admiración mutua y un deseo compartido de aventura y liderazgo. Ambos son generosos y leales, pero deben tener cuidado con los choques de ego, ya que ambos querrán llevar la voz cantante. La clave es celebrar los éxitos del otro y compartir el centro de atención.",
    score: 5
  },
  "Taurus-Cancer": {
    report: "Una combinación tierna, segura y profundamente hogareña. Tauro ofrece la estabilidad y la sensualidad que Cáncer anhela, mientras que Cáncer aporta el cuidado y la calidez emocional que Tauro valora por encima de todo. Juntos construyen un refugio del mundo, un hogar lleno de amor, buena comida y confort. Su relación se basa en la lealtad y el deseo mutuo de seguridad.",
    score: 5
  },
  "Gemini-Libra": {
    report: "Intelectualmente estimulante y socialmente activa. Ambos signos de Aire disfrutan de la comunicación, el arte, la belleza y la vida social. Se entienden a un nivel mental profundo, creando una relación equilibrada y armoniosa. Libra admira la agilidad mental de Géminis, y Géminis se siente atraído por el encanto y la diplomacia de Libra. Pueden pasar horas conversando sobre cualquier tema.",
    score: 5
  },
  "Virgo-Capricorn": {
    report: "Práctica, leal y orientada al futuro. Dos signos de Tierra que comparten valores similares sobre el trabajo duro, la ambición y la estabilidad. Se apoyan mutuamente en sus objetivos y construyen una vida sólida y bien organizada. El respeto mutuo es inmenso, y aunque no sea la pareja más demostrativa, su amor se expresa en actos de servicio y lealtad inquebrantable.",
    score: 5
  },
  "Scorpio-Pisces": {
    report: "Una conexión de alma profunda, intuitiva y casi mágica. Ambos signos de Agua navegan por las profundidades emocionales con facilidad. Hay una comprensión casi psíquica entre ellos, creando un vínculo increíblemente fuerte y transformador. Escorpio se siente seguro para mostrar su vulnerabilidad con Piscis, y Piscis encuentra en Escorpio la fuerza y protección que necesita.",
    score: 5
  },
  "Aries-Taurus": {
    report: "La impulsividad de Aries choca con la necesidad de seguridad y ritmo pausado de Tauro. Es una relación de 'frenar y acelerar'. Si logran apreciar sus diferencias, Aries puede inspirar a Tauro a la acción y a probar cosas nuevas, y Tauro puede enseñar a Aries el valor de la paciencia, la sensualidad y el disfrute de los placeres simples de la vida. Requiere mucho ajuste.",
    score: 3
  },
  "Cancer-Libra": {
    report: "Cáncer busca seguridad emocional profunda, mientras que Libra busca equilibrio y armonía social. Cáncer puede ver a Libra como demasiado superficial o indeciso, y Libra puede sentirse abrumado por la intensidad emocional de Cáncer. La clave es la comunicación abierta sobre sus sentimientos y necesidades, y encontrar un punto medio entre la vida social y la intimidad del hogar.",
    score: 2
  },
  "Leo-Scorpio": {
    report: "Una pareja de voluntades fuertes, magnéticas y extremadamente apasionadas. La intensidad es altísima, pero también el potencial de conflicto por el control y los celos. Ambos son signos fijos y leales, pero muy posesivos. Si ambos aprenden a ceder, a confiar y a canalizar su energía de forma constructiva, la pasión puede ser legendaria y transformadora.",
    score: 3
  },
  "Aquarius-Pisces": {
    report: "El desapego mental de Acuario puede herir la sensible naturaleza de Piscis, que necesita conexión emocional. Sin embargo, ambos comparten un profundo idealismo y compasión por la humanidad. Si logran conectar desde su lado humanitario y creativo, y Acuario aprende a validar los sentimientos de Piscis, pueden formar una pareja única, soñadora y compasiva.",
    score: 3
  },
  "Aries-Libra": {
    report: "La clásica atracción de los opuestos. Aries, el guerrero impulsivo, se siente fascinado por la gracia, la diplomacia y el encanto de Libra. A su vez, Libra se siente atraído por la pasión y la seguridad de Aries. Juntos forman un equipo dinámico, pero deben trabajar en la comunicación. Aries es directo y confrontacional, mientras que Libra evita el conflicto, lo que puede llevar a resentimientos si no se abordan los problemas abiertamente.",
    score: 4
  },
  "Taurus-Leo": {
    report: "Una pareja de reyes y reinas que aman el lujo y el placer. Sin embargo, ambos son signos fijos y muy tercos, lo que puede llevar a luchas de poder épicas. Leo necesita admiración y atención, mientras que Tauro necesita seguridad y tranquilidad. Si logran admirarse mutuamente y respetar sus diferentes ritmos, pueden construir una relación muy leal y estable, aunque no sin esfuerzo.",
    score: 2
  },
  "Gemini-Virgo": {
    report: "Ambos regidos por Mercurio, su conexión es principalmente mental, pero enfocada de manera muy diferente. Géminis es disperso y curioso, mientras que Virgo es analítico y detallista. Esto puede ser una fuente de fascinación o de frustración mutua. Virgo puede encontrar a Géminis poco fiable, y Géminis puede ver a Virgo como demasiado crítico. El éxito depende de valorar la perspectiva del otro.",
    score: 3
  },
  "Cancer-Capricorn": {
    report: "Otra poderosa pareja de opuestos. Cáncer (hogar, emoción) y Capricornio (carrera, estructura) se complementan perfectamente. Cáncer nutre las ambiciones de Capricornio y le proporciona un refugio seguro, mientras que Capricornio le da a Cáncer la estabilidad y seguridad que tanto anhela. Juntos, pueden construir un verdadero imperio basado en el amor y el respeto mutuo.",
    score: 5
  },
  "Leo-Aquarius": {
    report: "El rey y el rebelde. Estos opuestos del zodíaco sienten una fuerte atracción magnética. Leo es personal y apasionado, mientras que Acuario es más desapegado y enfocado en el colectivo. Leo enseña a Acuario a conectar con su corazón, y Acuario enseña a Leo a ver más allá de sí mismo. Es una relación emocionante y poco convencional, pero necesitan respetar sus diferencias fundamentales para que funcione.",
    score: 4
  },
  "Virgo-Pisces": {
    report: "El sanador y el soñador. Estos opuestos se atraen de una manera profundamente espiritual y compasiva. Virgo se siente atraído por la naturaleza empática y mística de Piscis, y Piscis encuentra en Virgo un ancla a la realidad y un cuidado práctico. El peligro radica en que Virgo se vuelva demasiado crítico o que Piscis evada la realidad, pero su potencial para sanarse mutuamente es inmenso.",
    score: 4
  },
  "Libra-Scorpio": {
    report: "Una combinación intrigante y compleja. El sociable y armonioso Libra se siente atraído por la misteriosa intensidad de Escorpio. Escorpio, a su vez, se siente cautivado por el encanto y la belleza de Libra. Sin embargo, la necesidad de paz de Libra puede chocar con la tendencia de Escorpio a explorar las profundidades emocionales, incluyendo los celos y el conflicto. Requiere mucha confianza y comunicación.",
    score: 3
  },
  "Scorpio-Sagittarius": {
    report: "Agua y Fuego, una combinación de vapor y pasión. Escorpio es profundo, privado e intenso, mientras que Sagitario es abierto, expansivo y amante de la libertad. Esta diferencia puede ser la fuente de una atracción explosiva o de constantes malentendidos. Escorpio puede ver a Sagitario como superficial, y Sagitario puede sentirse atrapado por la posesividad de Escorpio. Es una aventura que requiere honestidad radical.",
    score: 2
  },
  "Sagittarius-Capricorn": {
    report: "El optimista aventurero se encuentra con el estratega pragmático. Sagitario puede ayudar a Capricornio a relajarse y ver el lado bueno de la vida, mientras que Capricornio puede dar a Sagitario el enfoque y la estructura necesarios para convertir sus grandes ideas en realidad. El respeto por sus diferentes enfoques de la vida es esencial para que esta unión funcione y sea mutuamente beneficiosa.",
    score: 3
  },
  "Aquarius-Taurus": {
    report: "El innovador y el tradicionalista. Ambos son signos fijos, por lo que son tercos y resistentes al cambio, pero de maneras muy diferentes. Acuario mira hacia el futuro y las ideas abstractas, mientras que Tauro se aferra a lo tangible y probado. Esta es una cuadratura desafiante que requiere un inmenso respeto por los valores del otro. Si lo logran, pueden aprender mucho el uno del otro, pero el camino no es fácil.",
    score: 2
  }
};
