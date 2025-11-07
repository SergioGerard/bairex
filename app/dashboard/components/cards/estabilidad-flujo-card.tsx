"use client"

import { useState } from "react"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import type { ProjectionData } from "@/lib/types"

interface EstabilidadFlujoCardProps {
  filteredProjections: ProjectionData[];
}

export default function EstabilidadFlujoCard({ filteredProjections }: EstabilidadFlujoCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular estabilidad del flujo de caja (coeficiente de variación)
  const monthlyBalances = filteredProjections.map(p => p.balance - (filteredProjections[0]?.balance || 0))
  const mean = monthlyBalances.reduce((sum, balance) => sum + balance, 0) / monthlyBalances.length
  const variance = monthlyBalances.reduce((sum, balance) => sum + Math.pow(balance - mean, 2), 0) / monthlyBalances.length
  const standardDeviation = Math.sqrt(variance)
  const coefficientOfVariation = mean !== 0 ? (standardDeviation / Math.abs(mean)) * 100 : 0
  
  // Invertir el valor para que menor variación sea mejor (valores negativos son buenos)
  // const stabilityScore = -coefficientOfVariation // Removed unused variable

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  const getStabilityDescription = () => {
    if (coefficientOfVariation <= 10) return "Flujo muy estable"
    if (coefficientOfVariation <= 25) return "Flujo estable"
    if (coefficientOfVariation <= 50) return "Flujo moderadamente estable"
    if (coefficientOfVariation <= 100) return "Flujo variable"
    return "Flujo muy variable"
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Estabilidad del Flujo"
        description={getStabilityDescription()}
        value={`${coefficientOfVariation.toFixed(1)}%`}
        numericValue={coefficientOfVariation}
        infoDialogId="estabilidad-flujo"
        onInfoClick={openInfoDialog}
        reverseColorLogic={true}
        useNumberTicker={true}
        customTrendingLogic={(value) => {
          const cv = Math.abs(value)
          if (cv <= 10) {
            return {
              icon: <span className="text-green-500">🎯</span>,
              text: "Flujo muy predecible"
            }
          } else if (cv <= 25) {
            return {
              icon: <span className="text-green-400">✅</span>,
              text: "Flujo estable y confiable"
            }
          } else if (cv <= 50) {
            return {
              icon: <span className="text-yellow-500">📊</span>,
              text: "Flujo moderadamente estable"
            }
          } else if (cv <= 100) {
            return {
              icon: <span className="text-orange-500">⚠️</span>,
              text: "Flujo con variaciones"
            }
          } else {
            return {
              icon: <span className="text-red-500">🌊</span>,
              text: "Flujo muy impredecible"
            }
          }
        }}
      />
      
      <InfoDialog
        isOpen={openDialog === "estabilidad-flujo"}
        onClose={() => setOpenDialog(null)}
        title="Estabilidad del Flujo de Caja"
        content={[
          "Mide qué tan predecible es tu flujo de dinero mes a mes usando el coeficiente de variación (CV).",
          "Un CV bajo (menor a 25%) indica un flujo estable y predecible, ideal para la planificación financiera.",
          "Un CV alto sugiere ingresos o gastos muy variables, lo que puede dificultar la planificación a largo plazo."
        ]}
      />
    </>
  )
}