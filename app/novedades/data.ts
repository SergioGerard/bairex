// Definición del tipo Actualizacion
export interface Actualizacion {
  version: string
  fecha: string
  titulo: string
  descripcion: string[]
}

// Export the actualizaciones array so it can be used in other files
export const actualizaciones: Actualizacion[] = [
  {
    version: "1.7.2",
    fecha: "8 de junio de 2025",
    titulo: "Mejoras en la interfaz y gráficos financieros",
    descripcion: [
      "Se realizaron mejoras generales en la interfaz de usuario para una experiencia más fluida y moderna.",
      "Se modernizaron los gráficos financieros para facilitar la visualización y análisis de datos.",
      "Se agregó un footer informativo en los gráficos financieros para una interpretación más sencilla.",
      "Se incorporaron microinteracciones que mejoran la interacción con distintos elementos visuales.",
      "Se optimizó la disposición de la información, permitiendo mostrar más contenido relevante en menos espacio.",
      "Se añadió soporte completo para pantallas de todos los tamaños en todas las secciones (responsividad).",
      "Se solucionaron errores menores relacionados con hidratación, plugins y rendimiento general.",
      "Se añadió una sección de documentación, que se completará progresivamente con el tiempo.",
    ],
  },
  {
    version: "1.7.1",
    fecha: "2 de mayo de 2025",
    titulo: "Correcciones en el Simulador FCI y mejoras de compatibilidad",
    descripcion: [
      "Se corrigieron errores de tipado en el Simulador FCI para mejorar la compatibilidad con TypeScript.",
      "Se optimizó el código para cumplir con las reglas de ESLint y mejorar la calidad del código.",
      "Se solucionaron problemas que impedían la compilación correcta del proyecto en entornos de producción.",
    ],
  },
  {
    version: "1.7.0",
    fecha: "1 de mayo de 2025",
    titulo: "Nueva sección de inversión FCI y mejoras en proyecciones",
    descripcion: [
      "Se añadió una sección llamada 'Simulador FCI' que permite simular un fondo común de inversión independientemente de la aplicación o billetera virtual utilizada.",
      "El simulador toma la proyección financiera y permite simular una inversión de capital fija o personalizada hasta 36 meses (3 años).",
      "Se añadió la opción de elegir 1, 2 o 3 años de inversión.",
      "Se añadió la opción de reinvertir los meses anteriores (reinversión simple).",
      "Se añadió la opción de reinvertir los intereses de los meses anteriores (reinversión compuesta).",
      "Se añadió la opción de registro de movimientos en cuotas.",
      "Se añadió la información del valor de las cuotas a la derecha del input de elección de cuotas.",
      "Se corrigió el cálculo de inflación personalizada para pagos periódicos.",
      "Se añadió un botón en la tarjeta de potencial de inversión dentro de la proyección para invertir el balance sobrante, ya sea contando con el fondo de emergencia o su totalidad.",
    ],
  },
  {
    version: "1.6.3",
    fecha: "17 de marzo de 2025",
    titulo: "Optimización del sidebar y mejoras en gráficos",
    descripcion: [
      "Se mejoró la estructura y rendimiento del sidebar para que sea escalable.",
      "Se corrigió un error que impedía la interacción con los botones después de salir y exportar.",
      "Se mejoró el estilo de los gráficos estadísticos para una mejor experiencia de usuario.",
      "Se eliminó la pestaña de Alertas y Comparativas.",
    ],
  },
  {
    version: "1.6.2",
    fecha: "14 de marzo de 2025",
    titulo: "Optimización en Presupuestos",
    descripcion: [
      "Se eliminaron tarjetas redundantes en la sección de Presupuestos.",
      "Ahora la información del porcentaje de presupuesto se muestra en la misma tarjeta al hacer clic sobre ella.",
    ],
  },
  {
    version: "1.6.1",
    fecha: "13 de marzo de 2025",
    titulo: "Mejoras en la usabilidad y seguridad",
    descripcion: [
      "Se añadió un botón para salir del dashboard en el sidebar con una capa de seguridad.",
      "Se incorporó un botón de edición de registros de movimientos en la sección de Proyecciones Financieras.",
      "Se reemplazaron los radio buttons en la selección de ingresos y gastos dentro del modal de registro de movimientos por tabs buttons para mejorar la experiencia.",
    ],
  },
  {
    version: "1.6.0",
    fecha: "12 de marzo de 2025",
    titulo: "Mejoras estructurales, analíticas y de diseño",
    descripcion: [
      "Se añadieron tres tarjetas de información en la sección de visión general de proyección financiera.",
      "Se incorporó un menú de selección de años para la proyección en las tarjetas de visión general.",
      "Se agregaron botones de información para explicar la función de cada tarjeta.",
      "Se mejoró el componente Footer.",
      "Se reestructuró la sección de Proyección Financiera para optimizar el rendimiento.",
      "Se reestructuró la sección de Presupuestos y Objetivos para optimizar el rendimiento.",
      "Se reestructuró la sección de Ayuda para optimizar el rendimiento.",
      "Se reestructuró la sección de Novedades para optimizar el rendimiento.",
      "Se actualizó la paleta de colores de la aplicación.",
    ],
  },
  {
    version: "1.5.0",
    fecha: "11 de marzo de 2025",
    titulo: "Mejoras en las secciones de proyección y presupuestos",
    descripcion: [
      "Se añadieron tres tarjetas con datos en la sección de proyección.",
      "Se implementó un nuevo menú de acciones en las tarjetas de Presupuestos y Objetivos.",
      "Ahora las tarjetas de Objetivos se mostrarán incluso si no tienen gastos asociados.",
      "Las tarjetas de Presupuestos pueden ser seleccionadas para mostrar información relevante.",
    ],
  },
  {
    version: "1.4.0",
    fecha: "10 de marzo de 2025",
    titulo: "Mejoras en la interfaz y nueva sección de Presupuestos",
    descripcion: [
      "Se corrigieron errores y advertencias en SEO y metadata.",
      "Se implementaron botones de edición y eliminación.",
      "Se ampliaron las alertas para el control de gastos.",
      "Se mejoró la navegación en el Sidebar.",
      "Se optimizó el sistema de importación y exportación.",
      "Se corrigió el tooltip del calendario; ahora todas las fechas son funcionales.",
    ],
  },
  {
    version: "1.3.0",
    fecha: "9 de marzo de 2025",
    titulo: "Nueva sección de Presupuestos y mejoras en la interfaz",
    descripcion: [
      "Se añadió la sección de Presupuestos para gestionar gastos por categoría.",
      "Se implementó un sistema de seguimiento de objetivos financieros con indicadores de progreso.",
      "Se incorporó un sistema de alertas para el control de gastos.",
      "Se reorganizó el dashboard de Proyección Financiera.",
      "Se mejoró la visualización de movimientos financieros.",
      "Se implementó un modal para agregar nuevos movimientos.",
      "Se corrigieron errores y se optimizó el rendimiento.",
    ],
  },
  {
    version: "1.2.0",
    fecha: "8 de marzo de 2025",
    titulo: "Mejoras en exportación y diseño",
    descripcion: [
      "Se añadieron un nuevo favicon y un título personalizado.",
      "Se reorganizaron los botones de importación y exportación.",
      "Se habilitó la exportación a Google Sheets.",
      "Se corrigieron errores en la exportación de imágenes.",
      "Se agregó una nueva barra de navegación con los menús Inicio, Ayuda y Novedades.",
      "Se implementó un sidebar en el dashboard.",
    ],
  },
  {
    version: "1.1.0",
    fecha: "7 de marzo de 2025",
    titulo: "Pagos únicos y mejoras en gráficos",
    descripcion: [
      "Se implementó la funcionalidad de pagos únicos que no se repiten mensualmente.",
      "Los pagos únicos no se ven afectados por la inflación.",
      "Se mejoraron los tooltips en los gráficos financieros.",
      "Se corrigieron problemas con el eje Y en los gráficos.",
      "Se optimizó el rendimiento general de la aplicación.",
    ],
  },
  {
    version: "1.0.0",
    fecha: "6 de marzo de 2025",
    titulo: "Lanzamiento inicial",
    descripcion: [
      "Primera versión de FinanzAR.",
      "Proyecciones financieras a tres años.",
      "Soporte para ingresos y gastos recurrentes.",
      "Ajuste por inflación configurable.",
      "Gráficos interactivos de evolución financiera.",
      "Exportación de datos en formato JSON y PNG.",
    ],
  },
];