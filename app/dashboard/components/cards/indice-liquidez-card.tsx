"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import type { ProjectionData } from "@/lib/types"

interface IndiceLiquidezCardProps {
  filteredProjections: ProjectionData[];
}

export default function IndiceLiquidezCard({ filteredProjections }: IndiceLiquidezCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular índice de liquidez
  const currentBalance = filteredProjections[0]?.balance || 0
  const averageMonthlyExpenses = filteredProjections.length > 0 
    ? filteredProjections.reduce((sum, p) => sum + p.expenses, 0) / filteredProjections.length
    : 0
  
  const liquidityIndex = averageMonthlyExpenses > 0 ? currentBalance / averageMonthlyExpenses : 0

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  const getLiquidityDescription = () => {
    if (liquidityIndex >= 6) return "Liquidez excelente"
    if (liquidityIndex >= 3) return "Liquidez buena"
    if (liquidityIndex >= 1) return "Liquidez básica"
    if (liquidityIndex >= 0.5) return "Liquidez limitada"
    return "Liquidez crítica"
  }

  const formatLiquidityValue = (value: number) => {
    if (value >= 1) {
      return `${value.toFixed(1)} meses`
    } else {
      const days = Math.round(value * 30)
      return `${days} días`
    }
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Índice de Liquidez"
        description={getLiquidityDescription()}
        value={formatLiquidityValue(liquidityIndex)}
        numericValue={liquidityIndex}
        infoDialogId="indice-liquidez"
        onInfoClick={openInfoDialog}
        useNumberTicker={true}
        customTrendingLogic={(value) => {
          if (value >= 6) {
            return {
              icon: <span className="text-green-500">🏦</span>,
              text: "Reservas muy sólidas"
            }
          } else if (value >= 3) {
            return {
              icon: <span className="text-green-400">💰</span>,
              text: "Buena reserva de emergencia"
            }
          } else if (value >= 1) {
            return {
              icon: <span className="text-yellow-500">💵</span>,
              text: "Reserva básica cubierta"
            }
          } else if (value >= 0.5) {
            return {
              icon: <span className="text-orange-500">⚠️</span>,
              text: "Reserva insuficiente"
            }
          } else {
            return {
              icon: <span className="text-red-500">🚨</span>,
              text: "Situación crítica"
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "indice-liquidez"}
        onClose={() => setOpenDialog(null)}
        title="Índice de Liquidez"
        content={[
          "Indica cuántos meses podrías mantener tu nivel de gastos actual con tu balance disponible.",
          "Un índice de 3-6 meses se considera ideal como fondo de emergencia.",
          "Si tu índice es menor a 1 mes, considera priorizar la construcción de un fondo de emergencia."
        ]}
      />
    </>
  )
}