"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import { NumberTicker } from "@/components/magicui/number-ticker"
import type { ProjectionData } from "@/lib/types"

interface IngresosGastosCardProps {
  filteredProjections: ProjectionData[];
}

export default function IngresosGastosCard({ filteredProjections }: IngresosGastosCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular ingresos vs gastos
  const totalIncome = filteredProjections.reduce((sum, p) => sum + p.income, 0)
  const totalExpenses = filteredProjections.reduce((sum, p) => sum + p.expenses, 0)
  const netIncome = totalIncome - totalExpenses
  
  // Calcular porcentaje de ingresos vs gastos
  let incomeVsExpensePercentage = 0
  let isExpenseHigher = false
  
  if (totalExpenses > 0 && totalIncome > 0) {
    if (totalIncome >= totalExpenses) {
      // Los ingresos superan o igualan a los gastos
      incomeVsExpensePercentage = ((totalIncome / totalExpenses) * 100) - 100
      isExpenseHigher = false
    } else {
      // Los gastos superan a los ingresos
      incomeVsExpensePercentage = ((totalExpenses / totalIncome) * 100) - 100
      isExpenseHigher = true
    }
  }

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Ingresos vs Gastos"
        description="Porcentual"
        value={
          <div className="flex items-start gap-0 xl:gap-2 xl:items-baseline flex-col xl:flex-row">
            <div className="text-income text-sm flex items-center">
              <NumberTicker 
                value={totalIncome} 
                className="text-income"
                delay={0.06}
                decimalPlaces={0}
                prefix="$"
              />
            </div>
            <div className="text-expense text-sm flex items-center">
              <NumberTicker 
                value={totalExpenses} 
                className="text-expense"
                delay={0.06}
                decimalPlaces={0}
                prefix="$"
              />
            </div>
          </div>
        }
        numericValue={netIncome}
        infoDialogId="ingresos-gastos"
        onInfoClick={openInfoDialog}
        customTrendingLogic={() => {
          const percentage = incomeVsExpensePercentage
          
          if (!isExpenseHigher) {
            // Los ingresos superan a los gastos
            if (percentage >= 50) {
              return {
                icon: <span className="text-green-500">🚀</span>,
                text: `Ingresos superan gastos en ${percentage.toFixed(1)}%`
              }
            } else if (percentage >= 20) {
              return {
                icon: <span className="text-green-400">📈</span>,
                text: `Ingresos superan gastos en ${percentage.toFixed(1)}%`
              }
            } else if (percentage > 0) {
              return {
                icon: <span className="text-yellow-500">📊</span>,
                text: `Ingresos superan gastos en ${percentage.toFixed(1)}%`
              }
            } else {
              return {
                icon: <span className="text-blue-500">⚖️</span>,
                text: "Ingresos = Gastos (equilibrio)"
              }
            }
          } else {
            // Los gastos superan a los ingresos
            if (percentage >= 50) {
              return {
                icon: <span className="text-red-600">🚨</span>,
                text: `Gastos superan ingresos en ${percentage.toFixed(1)}%`
              }
            } else if (percentage >= 20) {
              return {
                icon: <span className="text-red-500">📉</span>,
                text: `Gastos superan ingresos en ${percentage.toFixed(1)}%`
              }
            } else {
              return {
                icon: <span className="text-orange-500">⚠️</span>,
                text: `Gastos superan ingresos en ${percentage.toFixed(1)}%`
              }
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "ingresos-gastos"}
        onClose={() => setOpenDialog(null)}
        title="Ingresos vs Gastos"
        content={[
          "Esta métrica compara tus ingresos totales con tus gastos totales durante el período seleccionado.",
          "El valor principal muestra la diferencia neta (ingresos - gastos).",
          "El porcentaje indica cuánto superan los ingresos a los gastos, o viceversa.",
          "Un porcentaje positivo de ingresos sobre gastos es ideal para el ahorro e inversión.",
          "Si los gastos superan a los ingresos, es importante revisar y ajustar el presupuesto."
        ]}
      />
    </>
  )
}