"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  DollarSign,
  PieChart,
  Target,
  ArrowRight,
  BarChart3,
  Settings,
  HelpCircle,
  MessageCircle
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FAQList from "@/components/faq-list"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ReactNode } from "react"

export default function DocumentacionPage() {
  // Define all FAQ items in a structured array
  const faqItems = [
    {
      id: "item-1",
      question: "¿Qué es FinanzAR?",
      answer: (
        <>FinanzAR es una aplicación web que te permite proyectar tus finanzas personales a futuro, considerando
        ingresos, gastos y el impacto de la inflación. Está especialmente diseñada para el contexto económico
        argentino, donde la inflación es un factor importante a considerar en la planificación financiera.</>
      ) as ReactNode,
    },
    {
      id: "item-2",
      question: "¿Cómo agrego ingresos o gastos?",
      answer: (
        <>Para agregar un ingreso o gasto, ve a la sección &quot;Registro de Movimientos&quot; en el dashboard. Allí
        encontrarás un botón &quot;Agregar Movimiento&quot; que abrirá un formulario donde podrás completar el nombre,
        monto, tipo (ingreso o gasto), recurrencia (mensual, anual, etc.) y ajuste por inflación si corresponde.
        Una vez completado, haz clic en &quot;Agregar Movimiento&quot; y se incluirá en tus proyecciones.</>
      ) as ReactNode,
    },
    {
      id: "item-3",
      question: "¿Cómo funciona el ajuste por inflación?",
      answer: (
        <>
          El ajuste por inflación te permite simular cómo tus ingresos y gastos se verán afectados por la
          inflación a lo largo del tiempo. Puedes elegir entre tres tipos de ajuste:
          <ul className="list-disc pl-6 mt-2">
            <li>Porcentaje: un porcentaje fijo que se aplica según la frecuencia seleccionada</li>
            <li>Monto fijo: un monto fijo que se suma según la frecuencia seleccionada</li>
            <li>Variable: te permite definir diferentes tasas de inflación para diferentes meses</li>
          </ul>
          La inflación se aplica a partir del segundo mes de la proyección.
        </>
      ) as ReactNode,
    },
    {
      id: "item-4",
      question: "¿Qué son los pagos únicos?",
      answer: (
        <>Los pagos únicos son movimientos (ingresos o gastos) que ocurren una sola vez en una fecha específica, a
        diferencia de las entradas recurrentes que se repiten con cierta frecuencia. Los pagos únicos son útiles
        para registrar eventos financieros puntuales como la compra de un bien, un bono especial, o cualquier
        movimiento que no se repita periódicamente. Estos pagos no se ven afectados por la inflación.</>
      ) as ReactNode,
    },
    {
      id: "item-5",
      question: "¿Cómo puedo exportar mis datos?",
      answer: (
        <>
          Puedes exportar tus datos de varias formas:
          <ul className="list-disc pl-6 mt-2">
            <li>Como JSON: para guardar todas tus entradas y poder importarlas después</li>
            <li>Como PNG: para guardar una imagen del dashboard</li>
            <li>Como CSV (Google Sheets): para analizar tus proyecciones en una hoja de cálculo</li>
          </ul>
          Simplemente haz clic en el botón &quot;Exportar&quot; en la parte superior derecha del dashboard y selecciona el
          formato que prefieras.
        </>
      ) as ReactNode,
    },
    {
      id: "item-6",
      question: "¿Qué es la sección de Presupuestos?",
      answer: (
        <>La sección de Presupuestos te permite crear y gestionar presupuestos mensuales, trimestrales o anuales.
        Puedes establecer límites de gastos por categoría, hacer seguimiento de tus objetivos financieros y
        recibir alertas cuando te acercas o superas los límites establecidos. Esta herramienta complementa la
        proyección financiera, ayudándote a mantener el control de tus finanzas en el día a día.</>
      ) as ReactNode,
    },
    {
      id: "item-7",
      question: "¿Mis datos están seguros?",
      answer: (
        <>Todos tus datos financieros se almacenan localmente en tu navegador. No enviamos ninguna información a
        servidores externos, lo que garantiza la privacidad de tu información financiera. Sin embargo, esto
        significa que si limpias los datos de tu navegador, perderás tus entradas. Te recomendamos exportar
        periódicamente tus datos como JSON para tener un respaldo.</>
      ) as ReactNode,
    },
    {
      id: "item-8",
      question: "¿Cómo puedo establecer objetivos financieros?",
      answer: (
        <>La sección de Objetivos Financieros te permite establecer metas específicas como ahorrar para un viaje, 
        comprar un auto o crear un fondo de emergencia. Para crear un objetivo, ve a la sección correspondiente 
        en el dashboard y haz clic en &quot;Agregar Objetivo&quot;. Deberás definir un nombre, monto objetivo, fecha límite 
        y opcionalmente una categoría. La aplicación te mostrará tu progreso y te dará recomendaciones para 
        alcanzar tus metas en el tiempo establecido.</>
      ) as ReactNode,
    },
    {
      id: "item-9",
      question: "¿Qué son las métricas financieras?",
      answer: (
        <>
          Las métricas financieras son indicadores que te ayudan a entender mejor tu situación financiera:
          <ul className="list-disc pl-6 mt-2">
            <li>Ratio de ahorro: porcentaje de tus ingresos que estás ahorrando</li>
            <li>Ratio de gastos fijos: porcentaje de tus ingresos destinado a gastos recurrentes</li>
            <li>Proyección de patrimonio: estimación de cómo evolucionará tu patrimonio neto</li>
            <li>Índice de salud financiera: evaluación general de tu situación financiera</li>
          </ul>
          Estas métricas se calculan automáticamente basándose en los datos que ingresas y te dan una visión 
          clara de tu salud financiera.
        </>
      ) as ReactNode,
    },
    {
      id: "item-10",
      question: "¿Cómo funciona la comparación mensual?",
      answer: (
        <>La comparación mensual te permite ver cómo evolucionan tus ingresos y gastos mes a mes, considerando 
        el impacto de la inflación. Esta herramienta es útil para identificar tendencias, detectar meses 
        críticos donde tus gastos podrían superar tus ingresos, y planificar con anticipación. Puedes 
        acceder a esta vista desde el dashboard principal seleccionando la opción &quot;Comparación Mensual&quot;.</>
      ) as ReactNode,
    },
    {
      id: "item-11",
      question: "¿Qué son las categorías y cómo puedo usarlas?",
      answer: (
        <>Las categorías te permiten clasificar tus ingresos y gastos para tener un mejor control y análisis 
        de tus finanzas. Puedes crear categorías personalizadas como &quot;Alimentación&quot;, &quot;Transporte&quot;, &quot;Ocio&quot;, etc. 
        Al asignar categorías a tus movimientos, podrás ver informes detallados de en qué estás gastando tu 
        dinero y establecer presupuestos específicos por categoría. Para gestionar tus categorías, ve a la 
        sección de &quot;Configuración&quot; en el dashboard.</>
      ) as ReactNode,
    },
    {
      id: "item-12",
      question: "¿Cómo puedo recibir recomendaciones personalizadas?",
      answer: (
        <>La aplicación analiza tus patrones de ingresos, gastos, ahorros y objetivos para ofrecerte 
        recomendaciones personalizadas que te ayuden a mejorar tu situación financiera. Estas recomendaciones 
        aparecen en el dashboard principal y se actualizan automáticamente a medida que ingresas nuevos datos. 
        Pueden incluir sugerencias para reducir gastos en ciertas categorías, oportunidades para aumentar tu 
        ahorro, o alertas sobre posibles problemas financieros futuros.</>
      ) as ReactNode,
    },
    {
      id: "item-13",
      question: "¿Cómo puedo importar datos de otras aplicaciones?",
      answer: (
        <>Puedes importar datos financieros desde otras aplicaciones utilizando el formato CSV o JSON. Para 
        hacerlo, ve a la sección &quot;Importar/Exportar&quot; en el dashboard y selecciona &quot;Importar datos&quot;. La 
        aplicación te guiará en el proceso de mapeo de campos para asegurar que tus datos se importen 
        correctamente. Esta función es útil si estás migrando desde otra herramienta de gestión financiera 
        o si quieres restaurar datos que exportaste previamente.</>
      ) as ReactNode,
    },
    {
      id: "item-14",
      question: "¿Cómo funcionan las alertas y notificaciones?",
      answer: (
        <>El sistema de alertas te notifica sobre eventos importantes relacionados con tus finanzas, como:
        <ul className="list-disc pl-6 mt-2">
          <li>Cuando estás cerca de superar un presupuesto establecido</li>
          <li>Cuando se aproxima la fecha límite de un objetivo financiero</li>
          <li>Cuando se detectan patrones de gasto inusuales</li>
          <li>Recordatorios para actualizar tus datos financieros</li>
        </ul>
        Puedes personalizar qué alertas quieres recibir y cómo quieres recibirlas en la sección de 
        &quot;Configuración&quot; del dashboard.</>
      ) as ReactNode,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <BlurFade delay={0.1}>
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentación Completa
              </Badge>
            </BlurFade>
            <BlurFade delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Guía Completa de
                <span className="block text-primary">Finanzar</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.3}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
                Aprende a usar todas las funcionalidades de la plataforma para maximizar tu planificación financiera.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Guías Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.4}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Guías de Usuario</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Documentación paso a paso para dominar cada funcionalidad
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Gestión de Movimientos</CardTitle>
                  <CardDescription>
                    Aprende a registrar ingresos y gastos, configurar frecuencias y categorías.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/movimientos">
                    <Button variant="outline" className="w-full gap-2">
                      Ver en acción <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Panel General</CardTitle>
                  <CardDescription>
                    Comprende las métricas, gráficos y proyecciones del dashboard principal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/panel-general">
                    <Button variant="outline" className="w-full gap-2">
                      Ver panel <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Presupuestos</CardTitle>
                  <CardDescription>
                    Crea y gestiona presupuestos para controlar tus gastos por categoría.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/presupuestos">
                    <Button variant="outline" className="w-full gap-2">
                      Gestionar <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Simulador FCI</CardTitle>
                  <CardDescription>
                    Simula inversiones en Fondos Comunes con diferentes estrategias.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/simulador-fci">
                    <Button variant="outline" className="w-full gap-2">
                      Simular <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Simulación de Compra</CardTitle>
                  <CardDescription>
                    Evalúa el impacto financiero de compras importantes antes de realizarlas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/simulacion-compra">
                    <Button variant="outline" className="w-full gap-2">
                      Simular compra <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 border border-border">
                  <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Configuración</CardTitle>
                  <CardDescription>
                    Gestiona tus datos, exporta información y configura la plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full gap-2">
                      Configurar <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Conceptos Clave */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.6}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Conceptos Clave</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Entiende los fundamentos para aprovechar al máximo la plataforma
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.7}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                    Proyecciones Financieras
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">¿Qué son?</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Estimaciones de tu situación financiera futura basadas en tus ingresos, gastos y patrones de ahorro actuales.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">¿Cómo se calculan?</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Utilizamos tus movimientos registrados, aplicamos frecuencias y ajustamos por inflación para proyectar tu balance futuro.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                    Métricas Avanzadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Eficiencia de Gastos</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Porcentaje de tus ingresos que destinas a gastos. Ideal mantenerlo por debajo del 80%.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Índice de Liquidez</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Meses que podrías mantener tu estilo de vida actual con tus ahorros disponibles.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                    Frecuencias de Movimientos
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Tipos disponibles</h4>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span><strong className="text-foreground">Único:</strong> Movimiento que ocurre una sola vez</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span><strong className="text-foreground">Mensual:</strong> Se repite cada mes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span><strong className="text-foreground">Anual:</strong> Se repite cada año</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span><strong className="text-foreground">Semanal:</strong> Se repite cada semana</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary flex-shrink-0" />
                    Ajuste por Inflación
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">¿Por qué es importante?</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">La inflación reduce el poder adquisitivo del dinero con el tiempo. Nuestras proyecciones consideran este factor.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">¿Cómo se aplica?</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Los gastos futuros se incrementan según la tasa de inflación estimada, mientras que los ingresos pueden ajustarse según tu configuración.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.8}>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <HelpCircle className="w-4 h-4 mr-2" />
                Centro de Ayuda
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra respuestas a las preguntas más comunes sobre FinanzAR y aprende a aprovechar al máximo todas sus funcionalidades.
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.9}>
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 shadow-lg">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Preguntas y Respuestas</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Respuestas detalladas a las consultas más frecuentes de nuestros usuarios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FAQList faqs={faqItems} />
                </CardContent>
              </Card>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <BlurFade delay={1.0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para comenzar?
            </h2>
          </BlurFade>
          <BlurFade delay={1.1}>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Aplica todo lo que has aprendido y comienza a proyectar tu futuro financiero.
            </p>
          </BlurFade>
          <BlurFade delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/panel-general">
                <Button size="lg" variant="secondary" className="gap-2 px-8 py-6 text-lg font-semibold">
                  Ir al Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      <Footer />
    </div>
  )
}