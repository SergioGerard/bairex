"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import { formatCurrency } from "@/lib/utils"
import type { ProjectionData } from "@/lib/types"

interface AhorroTotalCardProps {
  filteredProjections: ProjectionData[];
}

export default function AhorroTotalCard({ filteredProjections }: AhorroTotalCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular ahorro total
  const totalSavings = filteredProjections.reduce((sum, p) => sum + (p.income - p.expenses), 0)
  const totalIncome = filteredProjections.reduce((sum, p) => sum + p.income, 0)
  const savingsPercentage = totalIncome > 0 ? ((totalSavings / totalIncome) * 100) : 0

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Ahorro Total"
        description="Dinero acumulado"
        value={formatCurrency(totalSavings)}
        numericValue={totalSavings}
        infoDialogId="ahorro-total"
        onInfoClick={openInfoDialog}
        useNumberTicker={true}
        customTrendingLogic={() => {
          const percentage = savingsPercentage
          if (percentage >= 20) {
            return {
              icon: <span className="text-green-500">💰</span>,
              text: `Excelente ahorro (${percentage.toFixed(1)}% de ingresos)`
            }
          } else if (percentage >= 10) {
            return {
              icon: <span className="text-yellow-500">💵</span>,
              text: `Buen ahorro (${percentage.toFixed(1)}% de ingresos)`
            }
          } else if (percentage > 0) {
            return {
              icon: <span className="text-orange-500">🪙</span>,
              text: `Ahorro básico (${percentage.toFixed(1)}% de ingresos)`
            }
          } else {
            return {
              icon: <span className="text-red-500">⚠️</span>,
              text: "Sin capacidad de ahorro"
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "ahorro-total"}
        onClose={() => setOpenDialog(null)}
        title="Ahorro Total"
        content={[
          "Representa la cantidad total que lograrás ahorrar durante el período seleccionado.",
          "Se calcula como la diferencia positiva entre ingresos y gastos acumulados.",
          "Un ahorro del 20% o más de tus ingresos se considera excelente para la estabilidad financiera."
        ]}
      />
    </>
  )
}