"use client"

import { useMemo, useState } from "react"
import BaseFinancialMetricCard from "./base-financial-metric-card"
import type { ProjectionData } from "@/lib/types"
import InfoDialog from "@/components/info-dialog"

// Importar funciones de utilidad para el cálculo de proyección de inversión
import {
  calculatePotencialInversion,
  calculatePotencialInversionStatus,
  calculatePotencialInversionCompleto,
  calculatePotencialInversionCompletoStatus
} from "./investment-projection-utils"
import { TrendingDown, TrendingUp } from "lucide-react"


interface FinancialMetricsProps {
  filteredProjections: ProjectionData[]
  periodText: string
  variant?: 'main' | 'additional' // Nueva prop para controlar qué cards mostrar
}

export default function FinancialMetrics({ filteredProjections, periodText, variant = 'additional' }: FinancialMetricsProps) {
  // Estado para manejar los diálogos de información
  const [infoDialogOpen, setInfoDialogOpen] = useState<string | null>(null);

  // Función para abrir diálogos de información
  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setInfoDialogOpen(dialogId);
  };

  // Memoize calculations to prevent unnecessary recalculations
  const metrics = useMemo(() => {
    // Resultado que se calculará y devolverá
    if (filteredProjections.length === 0) {
      const calculatedMetrics = {
        gastosVsIngresos: "0.00%",
        gastosVsIngresosStatus: undefined,
        ahorroMensual: "0.00%",
        ahorroMensualStatus: undefined,
        tendenciaBalance: "0.00%",
        tendenciaBalanceStatus: undefined,
        estabilidadFlujoCaja: "0.00%",
        estabilidadFlujoCajaStatus: undefined,
        capacidadAhorro: "$0",
        capacidadAhorroStatus: undefined,
        potencialInversion: "0.00%",
        potencialInversionStatus: undefined,
        potencialInversionCompleto: "0.00%",
        potencialInversionCompletoStatus: undefined,
        indiceLiquidez: "0.0x",
        indiceLiquidezStatus: undefined
      }
      
      // Guardar métricas en localStorage para el simulador FCI
      if (typeof window !== 'undefined') {
        localStorage.setItem('metrics', JSON.stringify(calculatedMetrics))
      }
      
      return calculatedMetrics
    }

    // Gastos vs Ingresos
    const totalIncome = filteredProjections.reduce((sum, month) => sum + month.income, 0)
    const totalExpenses = filteredProjections.reduce((sum, month) => sum + month.expenses, 0)
    const percentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
    const gastosVsIngresos = `${percentage.toFixed(2)}%`
    const gastosVsIngresosStatus = totalExpenses <= totalIncome ? "Gastos controlados" : "Gastos exceden ingresos"

    // Ahorro Mensual
    const avgIncome = filteredProjections.reduce((sum, month) => sum + month.income, 0) / filteredProjections.length
    const avgExpenses = filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length
    const savingsPercentage = avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0
    const ahorroMensual = `${Math.max(0, savingsPercentage).toFixed(2)}%`
    const ahorroMensualStatus = savingsPercentage >= 20
      ? "Excelente tasa de ahorro"
      : savingsPercentage >= 10
        ? "Buena tasa de ahorro"
        : "Oportunidad de mejorar"

    // Tendencia Balance
    const firstQuarterAvg = filteredProjections
      .slice(0, Math.min(3, filteredProjections.length))
      .reduce((sum, month) => sum + month.balance, 0) / Math.min(3, filteredProjections.length)
    const lastQuarterAvg = filteredProjections
      .slice(-Math.min(3, filteredProjections.length))
      .reduce((sum, month) => sum + month.balance, 0) / Math.min(3, filteredProjections.length)
    const growthPercentage = firstQuarterAvg !== 0
      ? ((lastQuarterAvg - firstQuarterAvg) / Math.abs(firstQuarterAvg)) * 100
      : lastQuarterAvg > 0 ? 100 : 0
    const tendenciaBalance = `${growthPercentage.toFixed(2)}%`
    const tendenciaBalanceStatus = lastQuarterAvg > firstQuarterAvg
      ? "Tendencia positiva"
      : lastQuarterAvg === firstQuarterAvg
        ? "Estabilidad financiera"
        : "Tendencia negativa"

    // Estabilidad de Flujo de Caja
    const balances = filteredProjections.map(month => month.balance)
    const avgBalance = balances.reduce((sum, bal) => sum + bal, 0) / balances.length
    const squaredDiffs = balances.map(bal => Math.pow(bal - avgBalance, 2))
    const variance = squaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / balances.length
    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = Math.abs(avgBalance) > 0 ? (stdDev / Math.abs(avgBalance)) * 100 : 0
    const estabilidadFlujoCaja = `${coefficientOfVariation.toFixed(2)}%`
    const estabilidadFlujoCajaStatus = coefficientOfVariation < 20
      ? "Flujo de caja estable"
      : coefficientOfVariation < 50
        ? "Variabilidad moderada"
        : "Alta variabilidad"

    // Potencial de Inversión - Usando las funciones de utilidad importadas
    const lastProjection = filteredProjections.length > 0 ? filteredProjections[filteredProjections.length - 1] : null
    const finalBalance = lastProjection && lastProjection.accumulatedBalance ? lastProjection.accumulatedBalance : 0
    
    // Cálculo del promedio de gastos mensuales
    const avgMonthlyExpenses = filteredProjections.length > 0 
      ? filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length 
      : 0
    
    // Cálculo con fondo de emergencia (original)
    const investmentPercentage = calculatePotencialInversion(filteredProjections)
    const potencialInversion = `${investmentPercentage.toFixed(2)}%`
    const potencialInversionStatus = calculatePotencialInversionStatus(filteredProjections)
      
    // Cálculo sin fondo de emergencia (nuevo)
    const fullInvestmentPercentage = calculatePotencialInversionCompleto(filteredProjections)
    const potencialInversionCompleto = `${fullInvestmentPercentage.toFixed(2)}%`
    const potencialInversionCompletoStatus = calculatePotencialInversionCompletoStatus(filteredProjections)

    // Índice de Liquidez
    const liquidityRatio = avgMonthlyExpenses > 0 ? finalBalance / avgMonthlyExpenses : 0
    const indiceLiquidez = liquidityRatio.toFixed(1) + "x"
    const indiceLiquidezStatus = liquidityRatio >= 6
      ? "Excelente reserva de emergencia"
      : liquidityRatio >= 3
        ? "Buena reserva de emergencia"
        : "Reserva insuficiente"

    // Capacidad de Ahorro (nueva métrica KPI)
    const avgMonthlySavings = filteredProjections.length > 0 
      ? filteredProjections.reduce((sum, month) => sum + Math.max(0, month.balance), 0) / filteredProjections.length
      : 0
    const capacidadAhorro = avgMonthlySavings.toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    const capacidadAhorroStatus = avgMonthlySavings >= 50000
      ? "Excelente capacidad"
      : avgMonthlySavings >= 20000
        ? "Buena capacidad"
        : avgMonthlySavings >= 5000
          ? "Capacidad moderada"
          : "Necesita mejorar"

    const calculatedMetrics = {
      gastosVsIngresos,
      gastosVsIngresosStatus,
      ahorroMensual,
      ahorroMensualStatus,
      tendenciaBalance,
      tendenciaBalanceStatus,
      estabilidadFlujoCaja,
      estabilidadFlujoCajaStatus,
      capacidadAhorro,
      capacidadAhorroStatus,
      potencialInversion,
      potencialInversionStatus,
      potencialInversionCompleto,
      potencialInversionCompletoStatus,
      indiceLiquidez,
      indiceLiquidezStatus
    }
    
    // Guardar métricas en localStorage para el simulador FCI
    if (typeof window !== 'undefined') {
      localStorage.setItem('metrics', JSON.stringify(calculatedMetrics))
    }
    
    return calculatedMetrics
  }, [filteredProjections])

  // Renderizar las 4 cards principales si variant es 'main'
  if (variant === 'main') {
    return (
      <>
        {/* Card 1: Ingresos vs Gastos */}
        <BaseFinancialMetricCard
        title="Ingresos vs Gastos"
        description={`Porcentual (${periodText})`}
        value={
          filteredProjections.length === 0
            ? "0.00%"
            : `${(
                filteredProjections.reduce((sum, month) => sum + month.expenses, 0) /
                filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100
              ).toFixed(2)}%`
        }
        numericValue={
          filteredProjections.length === 0
            ? 0
            : filteredProjections.reduce((sum, month) => sum + month.expenses, 0) /
              filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100
        }
        infoDialogId="ingresos-gastos"
        onInfoClick={openInfoDialog}
        customTrendingLogic={(percentage) => {
          if (percentage === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin datos de ingresos o gastos"
            }
          }
          
          let gastoStatus = "";
          if (percentage > 100) {
            gastoStatus = "es crítico.";
          } else if (percentage >= 90) {
            gastoStatus = "es alto.";
          } else if (percentage >= 70) {
            gastoStatus = "es moderado.";
          } else {
            gastoStatus = "es saludable.";
          }

          return {
            icon: percentage > 100 
              ? <TrendingDown className="h-3 w-3 text-red-500" />
              : <TrendingUp className="h-3 w-3 text-green-500" />,
            text: percentage > 100
              ? `Estás gastando un ${(percentage - 100).toFixed(2)}% más que tus ingresos, ${gastoStatus}`
              : `Usas ${percentage.toFixed(2)}% de tus ingresos en gastos, ${gastoStatus}`
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-baseline xl:flex-row xl:gap-2">
            <span className="text-[clamp(14px,2vw,18px)] font-bold text-income">
              {filteredProjections.length === 0
                ? "$0,00"
                : `$${(filteredProjections.reduce((sum, month) => sum + month.income, 0) / filteredProjections.length).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            </span>
            <span className="text-[clamp(12px,2vw,16px)] font-medium text-expense">
              {filteredProjections.length === 0
                ? "$0,00"
                : `$${(filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            </span>
          </div>
        </div>
      </BaseFinancialMetricCard>

      {/* Card 2: Ahorro Total */}
      <BaseFinancialMetricCard
        title="Ahorro Total"
        description="Porcentaje de ingresos"
        value={
          filteredProjections.length === 0
            ? "$0,00"
            : `$${(filteredProjections.reduce((sum, month) => sum + month.income, 0) - filteredProjections.reduce((sum, month) => sum + month.expenses, 0)).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        }
        numericValue={
          filteredProjections.length === 0
            ? 0
            : filteredProjections.reduce((sum, month) => sum + month.income, 0) -
              filteredProjections.reduce((sum, month) => sum + month.expenses, 0)
        }
        infoDialogId="ahorro-mensual"
        onInfoClick={openInfoDialog}
        customTrendingLogic={(savingsAmount) => {
          if (savingsAmount === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin ahorros registrados"
            }
          }
          
          const totalIncome = filteredProjections.reduce((sum, month) => sum + month.income, 0);
          const savingsPercentage = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
          
          let ahorroStatus = "";
          if (savingsPercentage > 20) {
            ahorroStatus = "es Excelente";
          } else if (savingsPercentage > 10) {
            ahorroStatus = "es Bueno";
          } else if (savingsPercentage > 0) {
            ahorroStatus = "es Bajo";
          } else {
            ahorroStatus = "es Negativo";
          }

          return {
            icon: savingsPercentage > 0 
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />,
            text: savingsPercentage > 0
              ? `Ahorras el ${savingsPercentage.toFixed(2)}% de tus ingresos, ${ahorroStatus}`
              : `No estás ahorrando, gastas más de lo que ingresas, ${ahorroStatus}`
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-baseline xl:flex-row xl:gap-2">
            <span className="text-[clamp(12px,2vw,16px)] font-medium text-muted-foreground">
              {filteredProjections.length === 0
                ? "0%"
                : `(${((filteredProjections.reduce((sum, month) => sum + month.income, 0) - filteredProjections.reduce((sum, month) => sum + month.expenses, 0)) / filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(2)}%)`}
            </span>
          </div>
        </div>
      </BaseFinancialMetricCard>

      {/* Card 3: Capacidad de Ahorro */}
      <BaseFinancialMetricCard
        title="Capacidad de Ahorro"
        description="Promedio mensual"
        value={metrics.capacidadAhorro}
        numericValue={parseFloat(metrics.capacidadAhorro.replace(/[^0-9.-]/g, ''))}
        infoDialogId="capacidad-ahorro"
        onInfoClick={openInfoDialog}
        trendingText={metrics.capacidadAhorroStatus}
        customTrendingLogic={(value) => {
          const status = metrics.capacidadAhorroStatus
          if (value === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin capacidad de ahorro registrada"
            }
          }
          return {
            icon: status === "Excelente capacidad" || status === "Buena capacidad" 
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />,
            text: status || "Estado desconocido"
          }
        }}
      />

      {/* Card 4: Potencial de Inversión */}
      {filteredProjections.length > 0 && (
         <BaseFinancialMetricCard
           title="Potencial de Inversión"
           description="Porcentaje disponible"
           value={`${calculatePotencialInversion(filteredProjections).toFixed(2)}%`}
           numericValue={calculatePotencialInversion(filteredProjections)}
           statusText={calculatePotencialInversionStatus(filteredProjections)}
           infoDialogId="potencial-inversion"
           onInfoClick={openInfoDialog}
         >
           <div className="mt-2">
             <a 
               href="/dashboard/simulador-fci?modo=porcentaje" 
               className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 w-full"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 20V10" />
                 <path d="M18 20V4" />
                 <path d="M6 20v-4" />
               </svg>
               Proyectar al {calculatePotencialInversion(filteredProjections).toFixed(2)}%
             </a>
           </div>
         </BaseFinancialMetricCard>
       )}

       {/* InfoDialogs para las 4 cards principales */}
        <InfoDialog
          isOpen={infoDialogOpen === "ingresos-gastos"}
          onClose={() => setInfoDialogOpen(null)}
          title="Ingresos vs Gastos"
          content={[
            "Esta métrica muestra el porcentaje de tus ingresos que destinas a gastos.",
            "Un valor menor al 100% indica que gastas menos de lo que ingresas, lo cual es saludable financieramente.",
            "Si supera el 100%, significa que estás gastando más de lo que generas."
          ]}
        />
        <InfoDialog
          isOpen={infoDialogOpen === "ahorro-mensual"}
          onClose={() => setInfoDialogOpen(null)}
          title="Ahorro Total"
          content={[
            "Representa el monto total que logras ahorrar en el período seleccionado.",
            "Se calcula como la diferencia entre tus ingresos totales y gastos totales.",
            "Un ahorro positivo indica una gestión financiera saludable."
          ]}
        />
        <InfoDialog
          isOpen={infoDialogOpen === "capacidad-ahorro"}
          onClose={() => setInfoDialogOpen(null)}
          title="Capacidad de Ahorro"
          content={[
            "Muestra tu capacidad promedio mensual de ahorro.",
            "Esta métrica te ayuda a entender cuánto puedes destinar mensualmente para objetivos financieros como inversiones, fondo de emergencia o metas específicas."
          ]}
        />
        <InfoDialog
          isOpen={infoDialogOpen === "potencial-inversion"}
          onClose={() => setInfoDialogOpen(null)}
          title="Potencial de Inversión"
          content={[
            "Indica el porcentaje de tu balance final que podrías destinar a inversiones, manteniendo un fondo de emergencia equivalente a 6 meses de gastos.",
            "Esta métrica te ayuda a identificar oportunidades de crecimiento financiero."
          ]}
        />
      </>
    )
  }

  // Renderizar todas las métricas si variant es 'additional'
  return (
    <>
      {/* Métricas en formato columna para xxl+, horizontal para menores */}
      <BaseFinancialMetricCard
        title="Ingresos vs Gastos"
        description={`Porcentual (${periodText})`}
        value={
          filteredProjections.length === 0
            ? "0.00%"
            : `${(
                filteredProjections.reduce((sum, month) => sum + month.expenses, 0) /
                filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100
              ).toFixed(2)}%`
        }
        numericValue={
          filteredProjections.length === 0
            ? 0
            : filteredProjections.reduce((sum, month) => sum + month.expenses, 0) /
              filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100
        }
        infoDialogId="ingresos-gastos"
        onInfoClick={openInfoDialog}
        customTrendingLogic={(percentage) => {
          if (percentage === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin datos de ingresos o gastos"
            }
          }
          
          let gastoStatus = "";
          if (percentage > 100) {
            gastoStatus = "es crítico.";
          } else if (percentage >= 90) {
            gastoStatus = "es alto.";
          } else if (percentage >= 70) {
            gastoStatus = "es moderado.";
          } else {
            gastoStatus = "es saludable.";
          }

          return {
            icon: percentage > 100 
              ? <TrendingDown className="h-3 w-3 text-red-500" />
              : <TrendingUp className="h-3 w-3 text-green-500" />,
            text: percentage > 100
              ? `Estás gastando un ${(percentage - 100).toFixed(2)}% más que tus ingresos, ${gastoStatus}`
              : `Usas ${percentage.toFixed(2)}% de tus ingresos en gastos, ${gastoStatus}`
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-baseline xl:flex-row xl:gap-2">
            <span className="text-[clamp(14px,2vw,18px)] font-bold text-income">
              {filteredProjections.length === 0
                ? "$0,00"
                : `$${(filteredProjections.reduce((sum, month) => sum + month.income, 0) / filteredProjections.length).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            </span>
            <span className="text-[clamp(12px,2vw,16px)] font-medium text-expense">
              {filteredProjections.length === 0
                ? "$0,00"
                : `$${(filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            </span>
          </div>
        </div>
      </BaseFinancialMetricCard>

      <BaseFinancialMetricCard
        title="Ahorro Total"
        description="Porcentaje de ingresos"
        value={
          filteredProjections.length === 0
            ? "$0,00"
            : `$${(filteredProjections.reduce((sum, month) => sum + month.income, 0) - filteredProjections.reduce((sum, month) => sum + month.expenses, 0)).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        }
        numericValue={
          filteredProjections.length === 0
            ? 0
            : filteredProjections.reduce((sum, month) => sum + month.income, 0) -
              filteredProjections.reduce((sum, month) => sum + month.expenses, 0)
        }
        infoDialogId="ahorro-mensual"
        onInfoClick={openInfoDialog}
        customTrendingLogic={(savingsAmount) => {
          if (savingsAmount === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin ahorros registrados"
            }
          }
          
          const totalIncome = filteredProjections.reduce((sum, month) => sum + month.income, 0);
          const savingsPercentage = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
          
          let ahorroStatus = "";
          if (savingsPercentage > 20) {
            ahorroStatus = "es Excelente";
          } else if (savingsPercentage > 10) {
            ahorroStatus = "es Bueno";
          } else if (savingsPercentage > 0) {
            ahorroStatus = "es Bajo";
          } else {
            ahorroStatus = "es Negativo";
          }

          return {
            icon: savingsPercentage > 0 
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />,
            text: savingsPercentage > 0
              ? `Ahorras el ${savingsPercentage.toFixed(2)}% de tus ingresos, ${ahorroStatus}`
              : `No estás ahorrando, gastas más de lo que ingresas, ${ahorroStatus}`
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-baseline xl:flex-row xl:gap-2">
            <span className="text-[clamp(12px,2vw,16px)] font-medium text-muted-foreground">
              {filteredProjections.length === 0
                ? "0%"
                : `(${((filteredProjections.reduce((sum, month) => sum + month.income, 0) - filteredProjections.reduce((sum, month) => sum + month.expenses, 0)) / filteredProjections.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(2)}%)`}
            </span>
          </div>
        </div>
      </BaseFinancialMetricCard>

      {filteredProjections.length > 0 && (
         <BaseFinancialMetricCard
           title="Potencial de Inversión"
           description="Porcentaje disponible"
           value={`${calculatePotencialInversion(filteredProjections).toFixed(2)}%`}
           numericValue={calculatePotencialInversion(filteredProjections)}
           statusText={calculatePotencialInversionStatus(filteredProjections)}
           infoDialogId="potencial-inversion"
           onInfoClick={openInfoDialog}
         >
           <div className="mt-2">
             <a 
               href="/dashboard/simulador-fci?modo=porcentaje" 
               className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 w-full"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 20V10" />
                 <path d="M18 20V4" />
                 <path d="M6 20v-4" />
               </svg>
               Proyectar al {calculatePotencialInversion(filteredProjections).toFixed(2)}%
             </a>
           </div>
         </BaseFinancialMetricCard>
       )}

      <BaseFinancialMetricCard
        title="Tendencia Balance"
        description="Crecimiento proyectado"
        value={metrics.tendenciaBalance}
        numericValue={parseFloat(metrics.tendenciaBalance)}
        infoDialogId="tendencia-balance"
        onInfoClick={openInfoDialog}
        trendingText={metrics.tendenciaBalanceStatus}
      />

      <BaseFinancialMetricCard
        title="Estabilidad de Flujo de Caja"
        description="Variabilidad mensual"
        value={metrics.estabilidadFlujoCaja}
        numericValue={parseFloat(metrics.estabilidadFlujoCaja)}
        infoDialogId="estabilidad-flujo-caja"
        onInfoClick={openInfoDialog}
        reverseColorLogic={true}
        trendingText={metrics.estabilidadFlujoCajaStatus}
      />

      <BaseFinancialMetricCard
        title="Capacidad de Ahorro"
        description="Promedio mensual"
        value={metrics.capacidadAhorro}
        numericValue={parseFloat(metrics.capacidadAhorro.replace(/[^0-9.-]/g, ''))}
        infoDialogId="capacidad-ahorro"
        onInfoClick={openInfoDialog}
        trendingText={metrics.capacidadAhorroStatus}
        customTrendingLogic={(value) => {
          const status = metrics.capacidadAhorroStatus
          if (value === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin capacidad de ahorro registrada"
            }
          }
          return {
            icon: status === "Excelente capacidad" || status === "Buena capacidad" 
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />,
            text: status || "Estado desconocido"
          }
        }}
      />

      <BaseFinancialMetricCard
        title="Índice de Liquidez"
        description="Cobertura de gastos"
        value={metrics.indiceLiquidez}
        numericValue={parseFloat(metrics.indiceLiquidez)}
        infoDialogId="indice-liquidez"
        onInfoClick={openInfoDialog}
        trendingText={metrics.indiceLiquidezStatus}
        customTrendingLogic={(value) => {
          if (value === 0) {
            return {
              icon: <TrendingDown className="h-3 w-3 text-muted-foreground" />,
              text: "Sin reservas de emergencia"
            }
          }
          return {
            icon: value >= 3 
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />,
            text: metrics.indiceLiquidezStatus || "Estado desconocido"
          }
        }}
      />

      {/* Diálogos de información para las métricas financieras */}
      <InfoDialog
        isOpen={infoDialogOpen === "ingresos-gastos"}
        onClose={() => setInfoDialogOpen(null)}
        title="Ingresos vs Gastos"
        content={[
          "Esta tarjeta muestra la relación entre tus ingresos y gastos totales en el período seleccionado.",
          "Se calcula dividiendo los gastos totales entre los ingresos totales y multiplicando por 100.",
          "Un porcentaje menor al 100% indica que gastas menos de lo que ingresas, lo cual es positivo para tu salud financiera."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "ahorro-mensual"}
        onClose={() => setInfoDialogOpen(null)}
        title="Ahorro Total"
        content={[
          "Esta tarjeta muestra el total de dinero que has ahorrado en el período seleccionado.",
          "Se calcula como la diferencia entre tus ingresos totales y gastos totales.",
          "Un valor positivo indica que has ahorrado dinero, mientras que un valor negativo indica un déficit."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "potencial-inversion"}
        onClose={() => setInfoDialogOpen(null)}
        title="Potencial de Inversión"
        content={[
          "Esta tarjeta muestra qué porcentaje de tus ingresos podrías destinar a inversiones.",
          "Se calcula considerando tus ahorros disponibles después de cubrir gastos esenciales y mantener un fondo de emergencia.",
          "Un porcentaje más alto indica mayor capacidad para invertir y hacer crecer tu patrimonio."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "tendencia-balance"}
        onClose={() => setInfoDialogOpen(null)}
        title="Tendencia del Balance"
        content={[
          "Esta tarjeta muestra cómo ha evolucionado tu balance financiero a lo largo del tiempo.",
          "Se calcula comparando el balance actual con períodos anteriores.",
          "Una tendencia positiva indica que tu situación financiera está mejorando."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "estabilidad-flujo-caja"}
        onClose={() => setInfoDialogOpen(null)}
        title="Estabilidad del Flujo de Caja"
        content={[
          "Esta tarjeta mide qué tan estables son tus ingresos y gastos mes a mes.",
          "Se calcula analizando la variabilidad de tu flujo de caja a lo largo del tiempo.",
          "Un porcentaje bajo indica mayor estabilidad financiera."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "capacidad-ahorro"}
        onClose={() => setInfoDialogOpen(null)}
        title="Capacidad de Ahorro"
        content={[
          "Esta tarjeta muestra qué porcentaje de tus ingresos logras ahorrar.",
          "Se calcula dividiendo tus ahorros totales entre tus ingresos totales.",
          "Los expertos recomiendan ahorrar al menos el 20% de los ingresos."
        ]}
      />
      
      <InfoDialog
        isOpen={infoDialogOpen === "indice-liquidez"}
        onClose={() => setInfoDialogOpen(null)}
        title="Índice de Liquidez"
        content={[
          "Esta tarjeta muestra cuántos meses de gastos podrías cubrir con tu balance acumulado al final del período proyectado.",
          "Se calcula dividiendo el balance final acumulado entre tus gastos mensuales promedio.",
          "Los expertos financieros recomiendan mantener un índice de liquidez de al menos 3-6 meses como fondo de emergencia para afrontar imprevistos."
        ]}
      />
    </>
  )
}