"use client";

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SimuladorFCIForm from "./components/simulador-form"
import SimuladorResultados from "./components/simulador-resultados"
import SimuladorEvolucion from "./components/simulador-evolucion"
import { DatosSimulador, ResultadosSimulacion } from "./types"
import { TrendingUp } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

// Skeleton Components
function FormularioSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-card to-card/80 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo de inversión */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
          
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          
          {/* Opciones de reinversión */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          {/* Botón calcular */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResultadosSkeleton() {
  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-8 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabla de resultados */}
      <Card className="bg-gradient-to-r from-card to-card/80 border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header de tabla */}
            <div className="grid grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {/* Filas de tabla */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 p-3 border-t border-border/50">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EvolucionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Gráfico */}
      <Card className="bg-gradient-to-r from-card to-card/80 border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
      
      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-gradient-to-r from-card to-card/80 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SimuladorFCISkeleton({ activeTab }: { activeTab: string }) {
  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-80" />
      </div>
      
      {/* Tabs */}
      <div className="w-full">
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        
        {/* Content based on active tab */}
        {activeTab === "formulario" && <FormularioSkeleton />}
        {activeTab === "resultados" && <ResultadosSkeleton />}
        {activeTab === "evolucion" && <EvolucionSkeleton />}
      </div>
    </div>
  )
}

export default function SimuladorFCIPage() {
  const [resultados, setResultados] = useState<ResultadosSimulacion | null>(null)
  const [activeTab, setActiveTab] = useState("formulario")
  
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  // Detectar si viene con parámetro amount
  const [shouldUsePersonalizado, setShouldUsePersonalizado] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const amount = urlParams.get('amount')
      const mode = urlParams.get('mode')
      
      if (amount || mode === 'monthly') {
        // Si viene con amount o mode=monthly, indicar que debe usar modo personalizado
        setShouldUsePersonalizado(true)
      }
    }
  }, [])
  
  const handleCalcular = (datos: DatosSimulador) => {
    // Realizar cálculos de simulación
    const resultadosCalculados = calcularSimulacion(datos)
    setResultados(resultadosCalculados)
    setActiveTab("resultados")
  }
  
  // Mostrar skeleton mientras se hidrata
  if (!isHydrated) {
    return <SimuladorFCISkeleton activeTab={activeTab} />
  }
  
  return (
    <div className="mx-auto p-4">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-card border border-border rounded-md p-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Simulador de Fondo Común de Inversión</h1>
        </div>
      </BlurFade>
        
        <BlurFade delay={0.2}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-fit">
            <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="formulario">Formulario</TabsTrigger>
            <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="resultados" disabled={!resultados}>Resultados</TabsTrigger>
            <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="evolucion" disabled={!resultados}>Evolución</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formulario" className="mt-6">
            <SimuladorFCIForm onCalcular={handleCalcular} shouldUsePersonalizado={shouldUsePersonalizado} />
          </TabsContent>
          
          <TabsContent value="resultados" className="mt-6">
            {resultados && (
              <BlurFade delay={0.3}>
                <SimuladorResultados resultados={resultados} />
              </BlurFade>
            )}
          </TabsContent>
          
          <TabsContent value="evolucion" className="mt-6">
            {resultados && (
              <BlurFade delay={0.3}>
                <SimuladorEvolucion resultado={resultados} />
              </BlurFade>
            )}
          </TabsContent>
        </Tabs>
        </BlurFade>
    </div>
  )
}

// Función para calcular la simulación
function calcularSimulacion(datos: DatosSimulador): ResultadosSimulacion {
  const { montosFijos, montosPersonalizados, modoInversion, tna, meses, reinversion, reinversionCompuesta } = datos
  
  // Convertir TNA a tasa mensual (TEM)
  const tasaMensual = tna / 12 / 100
  
  // Array para almacenar resultados mensuales
  const resultadosMensuales = []
  
  // Montos a utilizar según el modo de inversión
  const montos = modoInversion === 'fijo' ? Array(meses).fill(montosFijos) : montosPersonalizados
  
  // Variables para acumular resultados
  let totalInvertido = 0
  let totalIntereses = 0
  let totalReinversiones = 0
  let totalInteresesReinversion = 0
  let saldoAcumulado = 0
  
  // Calcular mes a mes
  for (let mes = 0; mes < meses; mes++) {
    const montoInversion = parseFloat(montos[mes]) || 0
    let interesesMes = 0
    let reinversionesMes = 0
    let interesesReinversionMes = 0
    
    // Calcular intereses de la inversión principal
    interesesMes = montoInversion * tasaMensual
    
    // Calcular reinversiones si está activado
    if (reinversion && mes > 0) {
      // Sumar todas las inversiones anteriores para reinvertir
      for (let i = 0; i < mes; i++) {
        const montoReinvertir = parseFloat(montos[i]) || 0
        reinversionesMes += montoReinvertir
        
        // Si está activada la reinversión compuesta, incluir intereses anteriores
        if (reinversionCompuesta) {
          const interesesAcumulados = resultadosMensuales[i].interesesMes + 
                                    (resultadosMensuales[i].interesesReinversionMes || 0)
          reinversionesMes += interesesAcumulados
        }
      }
      
      // Calcular intereses de la reinversión
      interesesReinversionMes = reinversionesMes * tasaMensual
    }
    
    // Acumular totales
    totalInvertido += montoInversion
    totalIntereses += interesesMes
    totalReinversiones += reinversionesMes
    totalInteresesReinversion += interesesReinversionMes
    
    // Calcular saldo del mes actual
    const saldoMes = montoInversion + interesesMes + reinversionesMes + interesesReinversionMes
    
    // Actualizar saldo acumulado (solo inversión nueva + todos los intereses generados)
    // No incluimos totalReinversiones porque es dinero ya contado en meses anteriores
    saldoAcumulado = totalInvertido + totalIntereses + totalInteresesReinversion
    
    // Guardar resultados del mes
    resultadosMensuales.push({
      mes: mes + 1,
      montoInversion,
      interesesMes,
      reinversionesMes,
      interesesReinversionMes,
      saldoMes,
      saldoAcumulado
    })
  }
  
  return {
    resultadosMensuales,
    resumen: {
      totalInvertido,
      totalIntereses,
      totalReinversiones,
      totalInteresesReinversion,
      saldoAcumulado: totalInvertido + totalIntereses + totalInteresesReinversion
    }
  }
}