"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, Target, PiggyBank } from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"

import { ResultadosSimulacion } from "../types"

interface SimuladorResultadosProps {
  resultados: ResultadosSimulacion
}

export default function SimuladorResultados({ resultados }: SimuladorResultadosProps) {
  const { resultadosMensuales, resumen } = resultados
  
  // Función para formatear montos como moneda
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto)
  }
  
  // Calcular métricas adicionales
  const rentabilidadTotal = ((resumen.saldoAcumulado - resumen.totalInvertido) / resumen.totalInvertido) * 100
  const rentabilidadMensual = rentabilidadTotal / resultadosMensuales.length
  const totalGanancias = resumen.totalIntereses + resumen.totalInteresesReinversion

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
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
                <p className="text-sm text-muted-foreground">Total Invertido</p>
                <NumberTicker
                  value={resumen.totalInvertido}
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
                <p className="text-sm text-muted-foreground">Total Ganancias</p>
                <NumberTicker
                  value={totalGanancias}
                  className="text-lg font-bold text-income"
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
              <Target className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Rentabilidad Total</p>
                <NumberTicker
                  value={rentabilidadTotal}
                  className="text-lg font-bold text-purple-600"
                  delay={0.06}
                  decimalPlaces={2}
                  suffix="%"
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
              <PiggyBank className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Saldo Final</p>
                <NumberTicker
                  value={resumen.saldoAcumulado}
                  className="text-lg font-bold text-orange-600"
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

      {/* Resumen detallado */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumen de la Simulación
          </CardTitle>
          <CardDescription>
            Análisis completo de su inversión en el Fondo Común de Inversión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">INVERSIÓN</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Capital inicial:</span>
                  <span className="font-medium">{formatMonto(resumen.totalInvertido)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Período:</span>
                  <span className="font-medium">{resultadosMensuales.length} meses</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">RENDIMIENTOS</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Intereses generados:</span>
                  <span className="font-medium text-income">
                    {formatMonto(resumen.totalIntereses)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Intereses reinversión:</span>
                  <span className="font-medium text-income">
                    {formatMonto(resumen.totalInteresesReinversion)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-sm font-medium">Total ganancias:</span>
                  <span className="font-bold text-income">
                    {formatMonto(totalGanancias)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">RESULTADOS</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Rentabilidad total:</span>
                  <span className="font-medium text-purple-600">{rentabilidadTotal.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rentabilidad mensual:</span>
                  <span className="font-medium text-purple-600">{rentabilidadMensual.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-sm font-medium">Saldo final:</span>
                  <span className="font-bold text-orange-600">
                    {formatMonto(resumen.saldoAcumulado)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabla de resultados mensuales */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Detalle Mensual
          </CardTitle>
          <CardDescription>
            Evolución mes a mes de su inversión y rendimientos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Mes</TableHead>
                  <TableHead className="font-semibold">Inversión</TableHead>
                  <TableHead className="font-semibold">Intereses</TableHead>
                  <TableHead className="font-semibold">Reinversión</TableHead>
                  <TableHead className="font-semibold">Int. Reinversión</TableHead>
                  <TableHead className="font-semibold">Saldo Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultadosMensuales.map((resultado, index) => {
                  // Calcular saldo acumulado correctamente: solo inversiones nuevas + intereses
                  // Las reinversiones no se suman porque es dinero ya contado en meses anteriores
                  const saldoAcumulado = resultadosMensuales
                    .slice(0, index + 1)
                    .reduce((acc, r) => acc + r.montoInversion + r.interesesMes + r.interesesReinversionMes, 0)
                  
                  return (
                    <TableRow key={resultado.mes} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{resultado.mes}</TableCell>
                      <TableCell>{formatMonto(resultado.montoInversion)}</TableCell>
                      <TableCell className="text-income">
                        {formatMonto(resultado.interesesMes)}
                      </TableCell>
                      <TableCell>{formatMonto(resultado.reinversionesMes)}</TableCell>
                      <TableCell className="text-income">
                        {formatMonto(resultado.interesesReinversionMes)}
                      </TableCell>
                      <TableCell className="font-bold text-orange-600">
                        {formatMonto(saldoAcumulado)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}