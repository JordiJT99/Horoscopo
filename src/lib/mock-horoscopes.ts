
import type { HoroscopeDetail, ZodiacSignName } from '@/types';
import type { Locale } from '@/lib/dictionaries';

// Helper para generar un horóscopo de ejemplo simple
const createPlaceholderMock = (period: string, index: number): HoroscopeDetail => ({
  main: `Este es un horóscopo ${period} para la entrada número ${index + 1}. Las estrellas sugieren un día/semana/mes de reflexión y posibles descubrimientos. Mantén una mente abierta.`,
  love: `En el amor, la comunicación será clave durante este ${period} (${index + 1}). Escucha a tu corazón y a los demás.`,
  money: `Financieramente, este ${period} (${index + 1}) podría traer oportunidades inesperadas si estás atento. Evalúa con cuidado.`,
  health: `Tu bienestar ${period} (${index + 1}): dedica tiempo al descanso y a actividades que te recarguen.`,
});

const mockDailyHoroscopes: HoroscopeDetail[] = [
  {
    main: "Hoy, la energía cósmica favorece la introspección. Dedica tiempo a meditar sobre tus metas personales. Podrías tener una revelación importante si te permites un momento de calma y soledad. Escucha tu voz interior.",
    love: "En el amor, una conversación sincera podría aclarar malentendidos. Si estás en pareja, busca un momento de conexión genuina. Los solteros podrían sentir una atracción inesperada hacia alguien con intereses similares.",
    money: "Es un buen día para revisar tus finanzas y planificar gastos futuros. Evita decisiones impulsivas con el dinero hoy; la prudencia es tu mejor aliada. Podría surgir una pequeña oportunidad de ahorro.",
    health: "Presta atención a tu cuerpo. Un paseo ligero o una sesión de yoga podrían beneficiarte enormemente. No te exijas demasiado y asegúrate de hidratarte bien durante el día.",
  },
  {
    main: "La creatividad fluye abundantemente hoy. Es un excelente momento para dedicarte a tus hobbies o iniciar un nuevo proyecto artístico. No temas experimentar y salir de tu zona de confort. La inspiración está en el aire.",
    love: "Sorprende a tu pareja con un gesto romántico o planifica una cita divertida. Si estás soltero, tu carisma natural atraerá miradas. Sé tú mismo y disfruta el momento.",
    money: "Podrías recibir una buena noticia relacionada con el trabajo o un proyecto. Mantén una actitud positiva y proactiva. Es un buen momento para presentar ideas innovadoras.",
    health: "Tu energía vital está en alza. Aprovecha para realizar actividad física que disfrutes. Sin embargo, no olvides la importancia de un buen descanso para recargar pilas.",
  },
  {
    main: "Las relaciones sociales toman protagonismo. Conectar con amigos o colegas podría abrirte nuevas puertas o perspectivas. Sé abierto a escuchar diferentes puntos de vista. Una colaboración podría ser muy fructífera.",
    love: "La armonía reina en tus relaciones afectivas. Es un buen día para fortalecer lazos y compartir momentos especiales. La empatía será tu mejor herramienta.",
    money: "El trabajo en equipo es favorable. Considera buscar alianzas o colaboraciones que puedan impulsar tus proyectos financieros. Evita discusiones por temas económicos.",
    health: "Mantén un equilibrio entre tu vida social y tus momentos de descanso. Una buena alimentación te ayudará a mantener tu energía durante toda la jornada.",
  },
  ...Array.from({ length: 7 }, (_, i) => createPlaceholderMock("diario", i + 3))
];

const mockWeeklyHoroscopes: HoroscopeDetail[] = [
  {
    main: "Esta semana se presenta ideal para la planificación a largo plazo. Define tus objetivos y traza un plan claro para alcanzarlos. La perseverancia será recompensada. A mediados de semana, podrías enfrentar un pequeño desafío que pondrá a prueba tu determinación.",
    love: "La comunicación profunda con tu pareja fortalecerá la relación. Para los solteros, es una semana propicia para conocer gente nueva en entornos sociales o a través de amigos. Abre tu corazón a nuevas posibilidades.",
    money: "Es un buen momento para organizar tus finanzas y establecer un presupuesto. Podrían surgir oportunidades de inversión interesantes, pero analiza bien los riesgos antes de tomar decisiones importantes.",
    health: "Dedica tiempo a actividades que te relajen y te ayuden a liberar el estrés acumulado. El contacto con la naturaleza o una rutina de ejercicio suave serán muy beneficiosos.",
  },
  {
    main: "La energía de esta semana te impulsa a la acción y a tomar la iniciativa en proyectos que tenías pendientes. Tu confianza estará en alza. Sin embargo, hacia el fin de semana, es recomendable bajar el ritmo y dedicar tiempo al descanso y la familia.",
    love: "La pasión se reaviva en las relaciones existentes. Si estás soltero, tu magnetismo personal atraerá a personas interesantes. No temas mostrar tu lado más audaz.",
    money: "Se presentan oportunidades para demostrar tu liderazgo y habilidades en el ámbito profesional. Un proyecto importante podría recibir el impulso que necesita. Mantén el enfoque.",
    health: "Tu vitalidad te permitirá afrontar la semana con energía. No obstante, cuida tu alimentación y evita excesos. El equilibrio es fundamental para mantenerte bien.",
  },
  {
    main: "Esta semana, la introspección y el autoconocimiento serán tus mejores aliados. Es un buen momento para reflexionar sobre tus emociones y patrones de comportamiento. Un sueño revelador podría darte pistas importantes. Confía en tu intuición.",
    love: "Conecta con tu pareja a un nivel más emocional y espiritual. Para los solteros, es un buen momento para sanar heridas del pasado y prepararse para una nueva etapa afectiva.",
    money: "Podrías descubrir talentos ocultos que te permitan generar ingresos extra. La creatividad aplicada a tus finanzas dará buenos resultados. Sé paciente con inversiones a largo plazo.",
    health: "Las prácticas como la meditación o el mindfulness te ayudarán a mantener la calma y la claridad mental. Escucha las necesidades de tu cuerpo y mente.",
  },
  ...Array.from({ length: 7 }, (_, i) => createPlaceholderMock("semanal", i + 3))
];

const mockMonthlyHoroscopes: HoroscopeDetail[] = [
  {
    main: "Este mes marca un período de transformación y crecimiento personal. Estarás más conectado con tu propósito de vida. Las primeras semanas serán de preparación, mientras que la segunda quincena traerá la manifestación de tus esfuerzos. ¡Confía en el proceso!",
    love: "Se fortalecen los lazos afectivos. Si tienes pareja, es un mes para consolidar la relación y hacer planes a futuro. Los solteros podrían iniciar una relación significativa y duradera. El amor está en el aire.",
    money: "Tu carrera profesional recibe un impulso. Es un mes excelente para buscar ascensos, nuevos empleos o emprender proyectos ambiciosos. La estabilidad financiera está a tu alcance si trabajas con dedicación.",
    health: "Tu energía vital estará en un buen nivel durante todo el mes. Adopta hábitos saludables y realiza actividad física regularmente. Presta atención a tu bienestar emocional.",
  },
  {
    main: "Un mes para enfocarte en tus relaciones y conexiones sociales. La colaboración y el trabajo en equipo serán clave para el éxito. Podrías ampliar tu círculo de amistades y participar en actividades grupales enriquecedoras. La diplomacia te abrirá puertas.",
    love: "La vida social activa podría traer nuevas oportunidades amorosas para los solteros. Si tienes pareja, disfruten juntos de salidas y encuentros con amigos. La comunicación abierta será esencial.",
    money: "Las alianzas estratégicas y los contactos profesionales serán muy beneficiosos este mes. No dudes en pedir ayuda o consejo. Una inversión conjunta podría ser muy rentable.",
    health: "Mantén un equilibrio entre la actividad social y los momentos de recogimiento. Cuidar tus horas de sueño y llevar una dieta balanceada te ayudará a mantenerte saludable y enérgico.",
  },
  {
    main: "La creatividad y la expresión personal serán los temas centrales de este mes. Es un momento ideal para desarrollar tus talentos artísticos, iniciar hobbies o simplemente dedicar tiempo a actividades que te apasionen. Permite que tu niño interior juegue y se divierta.",
    love: "El romance y la diversión marcan la pauta en el amor. Sorprende a tu pareja con gestos creativos. Los solteros podrían vivir un idilio apasionado y lleno de alegría. Disfruta del presente.",
    money: "Tus ideas originales podrían convertirse en fuentes de ingreso. No temas presentar propuestas innovadoras. Es un buen mes para invertir en tu formación o en herramientas que potencien tu creatividad.",
    health: "Realiza actividades que te hagan sentir feliz y pleno. El ejercicio a través del baile o deportes recreativos será muy beneficioso. Controla el estrés con técnicas de relajación.",
  },
  ...Array.from({ length: 7 }, (_, i) => createPlaceholderMock("mensual", i + 3))
];

export function getRandomMockHoroscope(
  period: 'daily' | 'weekly' | 'monthly',
  // sign: ZodiacSignName, // Sign can be used if mocks become sign-specific
  // locale: Locale // Locale can be used if mocks are translated
): HoroscopeDetail {
  let selectedArray: HoroscopeDetail[];
  switch (period) {
    case 'daily':
      selectedArray = mockDailyHoroscopes;
      break;
    case 'weekly':
      selectedArray = mockWeeklyHoroscopes;
      break;
    case 'monthly':
      selectedArray = mockMonthlyHoroscopes;
      break;
    default:
      // Fallback to daily if period is somehow incorrect
      selectedArray = mockDailyHoroscopes;
  }
  const randomIndex = Math.floor(Math.random() * selectedArray.length);
  
  return selectedArray[randomIndex];
}

    
