"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import type { ProjectionData } from "@/lib/types"

interface EficienciaGastosCardProps {
  filteredProjections: ProjectionData[];
}

export default function EficienciaGastosCard({ filteredProjections }: EficienciaGastosCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular eficiencia de gastos (gastos promedio por día vs ingresos promedio por día)
  const totalIncome = filteredProjections.reduce((sum, p) => sum + p.income, 0)
  const totalExpenses = filteredProjections.reduce((sum, p) => sum + p.expenses, 0)
  const daysInPeriod = filteredProjections.length
  
  const avgDailyIncome = daysInPeriod > 0 ? totalIncome / daysInPeriod : 0
  const avgDailyExpenses = daysInPeriod > 0 ? totalExpenses / daysInPeriod : 0
  
  // Eficiencia: cuántos días de gastos puedes cubrir con un día de ingresos
  const expenseEfficiency = avgDailyExpenses > 0 ? avgDailyIncome / avgDailyExpenses : 0
  
  // Ratio de eficiencia como porcentaje (100% = gastas exactamente lo que ganas por día)
  const efficiencyRatio = avgDailyIncome > 0 ? (avgDailyExpenses / avgDailyIncome) * 100 : 0

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  const getEfficiencyDescription = () => {
    if (efficiencyRatio <= 50) return "Gastos muy eficientes"
    if (efficiencyRatio <= 70) return "Gastos eficientes"
    if (efficiencyRatio <= 85) return "Gastos moderados"
    if (efficiencyRatio <= 100) return "Gastos ajustados"
    return "Gastos excesivos"
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Eficiencia de Gastos"
        description={getEfficiencyDescription()}
        value={`${efficiencyRatio.toFixed(1)}%`}
        numericValue={efficiencyRatio}
        infoDialogId="eficiencia-gastos"
        onInfoClick={openInfoDialog}
        reverseColorLogic={true} // Valores más bajos son mejores
        useNumberTicker={true}
        customTrendingLogic={(value) => {
          if (value <= 50) {
            return {
              icon: <span className="text-green-500">🎯</span>,
              text: `Excelente eficiencia (${expenseEfficiency.toFixed(1)}x cobertura)`
            }
          } else if (value <= 70) {
            return {
              icon: <span className="text-green-400">✅</span>,
              text: `Buena eficiencia (${expenseEfficiency.toFixed(1)}x cobertura)`
            }
          } else if (value <= 85) {
            return {
              icon: <span className="text-yellow-500">📊</span>,
              text: `Eficiencia moderada (${expenseEfficiency.toFixed(1)}x cobertura)`
            }
          } else if (value <= 100) {
            return {
              icon: <span className="text-orange-500">⚠️</span>,
              text: `Gastos ajustados (${expenseEfficiency.toFixed(1)}x cobertura)`
            }
          } else {
            return {
              icon: <span className="text-red-500">🚨</span>,
              text: `Gastos excesivos (${expenseEfficiency.toFixed(2)}x cobertura)`
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "eficiencia-gastos"}
        onClose={() => setOpenDialog(null)}
        title="Eficiencia de Gastos"
        content={[
          "Mide qué porcentaje de tus ingresos diarios estás gastando en promedio.",
          "Un valor bajo indica que gastas menos de lo que ganas, lo cual es ideal.",
          "La cobertura muestra cuántos días de gastos puedes cubrir con un día de ingresos.",
          "Valores por debajo del 70% se consideran eficientes para mantener estabilidad financiera.",
          "Si supera el 100%, significa que gastas más de lo que ganas diariamente."
        ]}
      />
    </>
  )
}