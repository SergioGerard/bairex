"use client"

import { useEffect, useState } from "react"
import { Target, DollarSign, TrendingUp } from "lucide-react"
import GoalList from "./goal-list"
import GoalMetricCard from "@/components/goal-metric-card"
import type { FinancialGoal } from "@/lib/types"

interface GoalsTabProps {
  goals: FinancialGoal[]
  onEditGoal: (goal: FinancialGoal) => void
  onDeleteGoal: (goal: FinancialGoal) => void
  goalTotals: {
    count: number
    totalTarget: number
    totalCurrent: number
    totalPercentage: number
  }
  monthlySavingsRate: number
}

export default function GoalsTab({
  goals,
  onEditGoal,
  onDeleteGoal,
  goalTotals,
  monthlySavingsRate,
}: GoalsTabProps) {
  // Estado para almacenar los valores formateados
  const [formattedValues, setFormattedValues] = useState({
    count: "0",
    totalTarget: "0",
    totalCurrent: "0",
    totalPercentage: 0,
    monthlySavingsRate: "0",
    annualSavings: 0
  });
  
  // Efecto para formatear los valores numéricos solo en el cliente
  useEffect(() => {
    if (goals.length > 0) {
      setFormattedValues({
        count: goalTotals.count.toString(),
        totalTarget: goalTotals.totalTarget.toLocaleString(),
        totalCurrent: goalTotals.totalCurrent.toLocaleString(),
        totalPercentage: goalTotals.totalPercentage,
        monthlySavingsRate: monthlySavingsRate.toLocaleString(),
        annualSavings: Math.round((monthlySavingsRate * 12) / 1000) / 10
      });
    }
  }, [goals, goalTotals, monthlySavingsRate]);
  return (
    <div className="space-y-6 goals-section">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GoalMetricCard 
          title="Objetivos Activos"
          icon={<Target />}
          iconColor="text-primary"
          value={goals.length > 0 ? formattedValues.count : "0"}
          subValue={`$${goals.length > 0 ? formattedValues.totalTarget : "0"}`}
          subValueLabel="Meta total"
          useNumberTicker={true}
          numericValue={goals.length > 0 ? goalTotals.count : 0}
          subNumericValue={goals.length > 0 ? goalTotals.totalTarget : 0}
          subPrefix="$"
          useSubValueColor={true}
        />
        
        <GoalMetricCard 
          title="Progreso Actual"
          icon={<DollarSign />}
          iconColor="text-green-500"
          value={`$${goals.length > 0 ? formattedValues.totalCurrent : "0"}`}
          subValue={`${goals.length > 0 ? formattedValues.totalPercentage : 0}%`}
          subValueLabel="completado"
          useNumberTicker={true}
          numericValue={goals.length > 0 ? goalTotals.totalCurrent : 0}
          prefix="$"
          subNumericValue={goals.length > 0 ? goalTotals.totalPercentage : 0}
          subSuffix="%"
          useValueColor={true}
          useSubValueColor={true}
        />
        
        <GoalMetricCard 
          title="Ritmo de Ahorro"
          icon={<TrendingUp />}
          iconColor="text-blue-500"
          value={`$${goals.length > 0 ? formattedValues.monthlySavingsRate : "0"}`}
          subValue={`${goals.length > 0 ? formattedValues.annualSavings : 0}K`}
          subValueLabel="anual estimado"
          useNumberTicker={true}
          numericValue={goals.length > 0 ? monthlySavingsRate : 0}
          prefix="$"
          subNumericValue={goals.length > 0 ? Math.round(monthlySavingsRate * 12 / 1000) : 0}
          subSuffix="K"
          useValueColor={true}
          useSubValueColor={true}
        />
      </div>

      {goals.length > 0 ? (
        <GoalList
          goals={goals}
          onEdit={onEditGoal}
          onDelete={onDeleteGoal}
        />
      ) : (
        <div className="border-border text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No hay objetivos financieros registrados aún.</p>
        </div>
      )}
    </div>
  )
}