"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import type { ProjectionData } from "@/lib/types"

interface TendenciaBalanceCardProps {
  filteredProjections: ProjectionData[];
}

export default function TendenciaBalanceCard({ filteredProjections }: TendenciaBalanceCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular tendencia del balance
  const balanceTrend = filteredProjections.length >= 2 
    ? ((filteredProjections[filteredProjections.length - 1].balance - filteredProjections[0].balance) / filteredProjections.length)
    : 0

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  const getTrendDescription = () => {
    if (balanceTrend > 10000) return "Tendencia muy positiva"
    if (balanceTrend > 5000) return "Tendencia positiva"
    if (balanceTrend > 1000) return "Tendencia moderada"
    if (balanceTrend > 0) return "Tendencia leve positiva"
    if (balanceTrend === 0) return "Tendencia estable"
    if (balanceTrend > -1000) return "Tendencia leve negativa"
    if (balanceTrend > -5000) return "Tendencia negativa"
    return "Tendencia muy negativa"
  }

  const formatTrendValue = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000) {
      return `${value >= 0 ? '+' : '-'}$${(absValue / 1000).toFixed(1)}k/mes`
    }
    return `${value >= 0 ? '+' : '-'}$${absValue.toFixed(0)}/mes`
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Tendencia Balance"
        description={getTrendDescription()}
        value={formatTrendValue(balanceTrend)}
        numericValue={balanceTrend}
        infoDialogId="tendencia-balance"
        onInfoClick={openInfoDialog}
        useNumberTicker={true}
        customTrendingLogic={(value) => {
          if (value > 10000) {
            return {
              icon: <span className="text-green-500">🚀</span>,
              text: "Crecimiento acelerado"
            }
          } else if (value > 5000) {
            return {
              icon: <span className="text-green-400">📈</span>,
              text: "Crecimiento sólido"
            }
          } else if (value > 1000) {
            return {
              icon: <span className="text-green-300">📊</span>,
              text: "Crecimiento moderado"
            }
          } else if (value > 0) {
            return {
              icon: <span className="text-yellow-500">📉</span>,
              text: "Crecimiento lento"
            }
          } else if (value === 0) {
            return {
              icon: <span className="text-gray-500">➖</span>,
              text: "Balance estable"
            }
          } else if (value > -1000) {
            return {
              icon: <span className="text-orange-500">⚠️</span>,
              text: "Declive leve"
            }
          } else if (value > -5000) {
            return {
              icon: <span className="text-red-400">📉</span>,
              text: "Declive preocupante"
            }
          } else {
            return {
              icon: <span className="text-red-500">🚨</span>,
              text: "Declive crítico"
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "tendencia-balance"}
        onClose={() => setOpenDialog(null)}
        title="Tendencia del Balance"
        content={[
          "Muestra cómo evoluciona tu balance financiero mes a mes durante el período seleccionado.",
          "Una tendencia positiva indica que tu situación financiera mejora consistentemente.",
          "Una tendencia negativa sugiere que necesitas revisar tus hábitos de gasto e ingreso."
        ]}
      />
    </>
  )
}