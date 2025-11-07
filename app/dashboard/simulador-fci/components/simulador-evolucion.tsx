"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, DollarSign, PiggyBank } from "lucide-react"
import { ResultadosSimulacion } from "../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NumberTicker } from "@/components/magicui/number-ticker"

interface SimuladorEvolucionProps {
  resultado: ResultadosSimulacion
}

export default function SimuladorEvolucion({ resultado }: SimuladorEvolucionProps) {
  const { resultadosMensuales } = resultado
  const [mesActual, setMesActual] = useState(0) // Índice del mes actual (0-based)
  
  // Función para formatear montos como moneda
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto)
  }
  
  // Navegar al mes anterior
  const mesAnterior = () => {
    if (mesActual > 0) {
      setMesActual(mesActual - 1)
    }
  }
  
  // Navegar al mes siguiente
  const mesSiguiente = () => {
    if (mesActual < resultadosMensuales.length - 1) {
      setMesActual(mesActual + 1)
    }
  }
  
  // Datos del mes actual
  const datosMes = resultadosMensuales[mesActual]
  
  // Calcular saldo acumulado hasta el mes actual
  // No incluimos reinversiones porque es dinero ya contado en meses anteriores
  const saldoAcumuladoHastaMes = resultadosMensuales
    .slice(0, mesActual + 1)
    .reduce((acc, r) => acc + r.montoInversion + r.interesesMes + r.interesesReinversionMes, 0)

  // Calcular total invertido hasta el mes actual
  const totalInvertidoHastaMes = resultadosMensuales
    .slice(0, mesActual + 1)
    .reduce((acc, r) => acc + r.montoInversion, 0)

  // Calcular total ganancias hasta el mes actual
  const totalGananciasHastaMes = resultadosMensuales
    .slice(0, mesActual + 1)
    .reduce((acc, r) => acc + r.interesesMes + r.interesesReinversionMes, 0)

  return (
    <div className="space-y-6">
      {/* Navegación entre meses */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Evolución Mensual
          </CardTitle>
          <CardDescription>
            Navegue mes a mes para ver la evolución detallada de su inversión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={mesAnterior} 
              disabled={mesActual === 0}
              className="hover:bg-muted/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <Select 
                value={mesActual.toString()} 
                onValueChange={(value) => setMesActual(parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {resultadosMensuales.map((resultado, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Mes {resultado.mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={mesSiguiente} 
              disabled={mesActual === resultadosMensuales.length - 1}
              className="hover:bg-muted/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas del mes actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                       dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                       transition-all duration-300 
                       hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                       dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Inversión del Mes</p>
                <NumberTicker
                  value={datosMes.montoInversion}
                  className="text-lg font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix="$"
                  useValueColor={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                       dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                       transition-all duration-300 
                       hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                       dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Intereses del Mes</p>
                <NumberTicker
                  value={datosMes.interesesMes + datosMes.interesesReinversionMes}
                  className="text-lg font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix="$"
                  useValueColor={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                       dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                       transition-all duration-300 
                       hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                       dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Reinversión</p>
                <NumberTicker
                  value={datosMes.reinversionesMes}
                  className="text-lg font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix="$"
                  useValueColor={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                       dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                       transition-all duration-300 
                       hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                       dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Saldo Acumulado</p>
                <NumberTicker
                  value={saldoAcumuladoHastaMes}
                  className="text-lg font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix="$"
                  useValueColor={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del mes actual */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle>Detalle del Mes {datosMes.mes}</CardTitle>
          <CardDescription>
            Información completa de la inversión y rendimientos del mes seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">MOVIMIENTOS DEL MES</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Inversión:</span>
                  <span className="font-medium">{formatMonto(datosMes.montoInversion)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Intereses:</span>
                  <span className="font-medium text-income">
                    {formatMonto(datosMes.interesesMes)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Reinversión:</span>
                  <span className="font-medium">{formatMonto(datosMes.reinversionesMes)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Int. Reinversión:</span>
                  <span className="font-medium text-income">
                    {formatMonto(datosMes.interesesReinversionMes)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">ACUMULADO HASTA EL MES</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Total invertido:</span>
                  <span className="font-medium">{formatMonto(totalInvertidoHastaMes)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Total ganancias:</span>
                  <span className="font-medium text-income">
                    {formatMonto(totalGananciasHastaMes)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="text-sm font-medium">Saldo total:</span>
                  <span className="font-bold text-orange-600">
                    {formatMonto(saldoAcumuladoHastaMes)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">PROGRESO</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Mes actual:</span>
                  <span className="font-medium">{datosMes.mes} de {resultadosMensuales.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Progreso:</span>
                  <span className="font-medium">
                    {((mesActual + 1) / resultadosMensuales.length * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((mesActual + 1) / resultadosMensuales.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}