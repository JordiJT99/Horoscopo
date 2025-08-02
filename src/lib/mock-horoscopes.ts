import type { HoroscopeDetail } from '@/types';

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
    money: "Sé cauteloso con las inversiones esta semana. Es mejor consolidar lo que ya tienes que aventurarte en nuevos terrenos. Una revisión de tus gastos mensuales podría revelar ahorros inesperados.",
    health: "Presta atención a las señales que te envía tu cuerpo. Es importante descansar adecuadamente y no sobreexigirte. Una consulta médica preventiva podría ser beneficiosa.",
  },
  ...Array.from({ length: 7 }, (_, i) => createPlaceholderMock("semanal", i + 3))
];

const mockMonthlyHoroscopes: HoroscopeDetail[] = [
  {
    main: "Este mes marca el inicio de un ciclo importante en tu vida. Las oportunidades de crecimiento personal y profesional estarán presentes, pero requerirán de tu dedicación y enfoque. La paciencia será tu virtud más valiosa. Hacia fin de mes, los resultados de tus esfuerzos comenzarán a manifestarse.",
    love: "El amor toma una dimensión más profunda y significativa este mes. Las relaciones superficiales darán paso a vínculos más auténticos. Es un período ideal para comprometerse o fortalecer compromisos existentes. Los solteros podrían encontrar a alguien especial en situaciones cotidianas.",
    money: "Financieramente, es un mes para sentar bases sólidas. Evita gastos impulsivos y enfócate en crear un plan de ahorro a largo plazo. Podrían presentarse oportunidades de inversión hacia la segunda mitad del mes. La prudencia será tu mejor consejera.",
    health: "Tu bienestar general requiere atención especial este mes. Establece rutinas saludables que puedas mantener a largo plazo. El ejercicio regular y una alimentación balanceada serán fundamentales. No descuides tu salud mental; considera técnicas de relajación o meditación.",
  },
  {
    main: "Un mes de transformaciones profundas te espera. Los cambios que has estado postergando finalmente tomarán forma. Será importante mantener una mente abierta y flexible ante las nuevas circunstancias. Tu capacidad de adaptación será puesta a prueba, pero saldrás fortalecido.",
    love: "La comunicación será el pilar fundamental en tus relaciones este mes. Habla con honestidad sobre tus sentimientos y expectativas. Los malentendidos del pasado podrán resolverse si hay voluntad de ambas partes. El romance florecerá en ambientes creativos o artísticos.",
    money: "Es momento de diversificar tus fuentes de ingresos. Explora nuevas oportunidades de negocio o desarrolla habilidades que puedan monetizarse. La segunda quincena será especialmente favorable para negociaciones importantes. Mantén un registro detallado de tus finanzas.",
    health: "Tu energía vital se renueva este mes. Es un período excelente para iniciar nuevos hábitos de ejercicio o mejorar tu alimentación. Presta atención especial a tu descanso nocturno. Actividades al aire libre te proporcionarán beneficios adicionales para tu bienestar integral.",
  },
  ...Array.from({ length: 8 }, (_, i) => createPlaceholderMock("mensual", i + 2))
];

export function getRandomMockHoroscope(
  period: 'daily' | 'weekly' | 'monthly' = 'daily'
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


