"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import BaseFinancialMetricCard from "../base-financial-metric-card"
import InfoDialog from "@/components/info-dialog"
import type { ProjectionData } from "@/lib/types"

interface PotencialInversionCardProps {
  filteredProjections: ProjectionData[];
}

export default function PotencialInversionCard({ filteredProjections }: PotencialInversionCardProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Calcular potencial de inversión basado en balances mensuales positivos
  const positiveBalances = filteredProjections.reduce((sum, p) => {
    return p.balance > 0 ? sum + p.balance : sum
  }, 0)
  
  // Calcular fondo de emergencia (6 meses de gastos promedio)
  const avgMonthlyExpenses = filteredProjections.length > 0 
    ? filteredProjections.reduce((sum, p) => sum + p.expenses, 0) / filteredProjections.length
    : 0
  const emergencyFund = avgMonthlyExpenses * 6
  
  // Dinero disponible para inversión después del fondo de emergencia
  const availableForInvestment = Math.max(0, positiveBalances - emergencyFund)
  
  // Potencial de inversión (respetando fondo de emergencia)
  const investmentPotential = availableForInvestment
  // 100% de balances positivos (ignorando fondo de emergencia)
  // const investmentPotential100 = positiveBalances // Removed unused variable
  
  // Porcentaje del acumulado disponible para inversión
  const investmentPercentage = positiveBalances > 0 ? ((availableForInvestment / positiveBalances) * 100) : 0

  const openInfoDialog = (dialogId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenDialog(dialogId)
  }

  const getInvestmentDescription = () => {
    if (investmentPercentage >= 70) {
      return "Excelente potencial"
    } else if (investmentPercentage >= 50) {
      return "Buen potencial"
    } else if (investmentPercentage >= 30) {
      return "Potencial moderado"
    } else if (investmentPercentage > 0) {
      return "Potencial limitado"
    } else {
      return "Sin potencial"
    }
  }

  return (
    <>
      <BaseFinancialMetricCard
        title="Potencial de Inversión"
        description={getInvestmentDescription()}
        value={`${investmentPercentage.toFixed(1)}%`}
        numericValue={investmentPercentage}
        infoDialogId="potencial-inversion"
        onInfoClick={openInfoDialog}
        showActionButton={true}
        showTrending={false}
        useNumberTicker={true}
        actionButton={
          <div className="flex gap-2 xxl:flex-row flex-col xxl:h-fit h-16">
            {investmentPotential > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  // Calcular montos mensuales individuales con porcentaje de inversión
                  const monthlyData = filteredProjections.map(p => {
                    const balance = p.balance > 0 ? p.balance : 0
                    return (balance * (investmentPercentage / 100)).toFixed(2)
                  })
                  
                  // Calcular período correcto basado en la longitud de proyecciones
                  const correctPeriod = filteredProjections.length <= 12 ? '12' : 
                                       filteredProjections.length <= 24 ? '24' : '36'
                  
                  // Guardar datos para el simulador
                  localStorage.setItem('simulador_monthly_amounts', JSON.stringify(monthlyData))
                  localStorage.setItem('simulador_mode', 'percentage')
                  localStorage.setItem('simulador_period', correctPeriod)
                  
                  // Disparar evento personalizado para notificar cambios en localStorage
                  window.dispatchEvent(new Event('localStorageUpdate'))
                  window.location.href = '/dashboard/simulador-fci?mode=monthly'
                }}
              >
                Simular {investmentPercentage.toFixed(1)}%
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                  // Calcular montos mensuales individuales con 100% del balance mensual
                  const monthlyData = filteredProjections.map(p => {
                    const balance = p.balance > 0 ? p.balance : 0
                    return balance.toFixed(2)
                  })
                  
                  // Calcular período correcto basado en la longitud de proyecciones
                  const correctPeriod = filteredProjections.length <= 12 ? '12' : 
                                       filteredProjections.length <= 24 ? '24' : '36'
                  
                  // Guardar datos para el simulador
                  localStorage.setItem('simulador_monthly_amounts', JSON.stringify(monthlyData))
                  localStorage.setItem('simulador_mode', 'full')
                  localStorage.setItem('simulador_period', correctPeriod)
                  
                  // Disparar evento personalizado para notificar cambios en localStorage
                  window.dispatchEvent(new Event('localStorageUpdate'))
                  window.location.href = '/dashboard/simulador-fci?mode=monthly'
                }}
            >
              Simular 100%
            </Button>
          </div>
        }
        // customTrendingLogic desactivado para reducir espacio vertical
        // customTrendingLogic={(value) => {
        //   const percentage = investmentPercentage
        //   if (percentage >= 80) {
        //     return {
        //       icon: <span className="text-green-500">🚀</span>,
        //       text: `Máximo potencial tras reservas (${percentage.toFixed(1)}%)`
        //     }
        //   } else if (percentage >= 60) {
        //     return {
        //       icon: <span className="text-green-400">📈</span>,
        //       text: `Alto potencial para FCI (${percentage.toFixed(1)}%)`
        //     }
        //   } else if (percentage >= 40) {
        //     return {
        //       icon: <span className="text-yellow-500">💡</span>,
        //       text: `Buen potencial disponible (${percentage.toFixed(1)}%)`
        //     }
        //   } else if (percentage >= 20) {
        //     return {
        //       icon: <span className="text-orange-500">🌱</span>,
        //       text: `Potencial moderado (${percentage.toFixed(1)}%)`
        //     }
        //   } else if (percentage > 0) {
        //     return {
        //       icon: <span className="text-blue-500">💰</span>,
        //       text: `Potencial limitado (${percentage.toFixed(1)}%)`
        //     }
        //   } else {
        //     return {
        //       icon: <span className="text-red-500">⏳</span>,
        //       text: "Sin disponibilidad tras fondo emergencia"
        //     }
        //   }
        // }
      />
      
      <InfoDialog
        isOpen={openDialog === "potencial-inversion"}
        onClose={() => setOpenDialog(null)}
        title="Potencial de Inversión"
        content={[
          "Esta tarjeta muestra el porcentaje de los balances mensuales positivos acumulados que está disponible para inversiones en FCI después de reservar un fondo de emergencia.",
          "Con fondo de emergencia: Utiliza el dinero disponible después de reservar 6 meses de gastos promedio como fondo de emergencia.",
          "Sin fondo de emergencia: Utiliza todos los balances positivos acumulados sin considerar reservas de emergencia.",
          "Se recomienda mantener siempre un fondo de emergencia equivalente a 6 meses de gastos antes de realizar inversiones."
        ]}
      />
    </>
  )
}