"use client"

import { differenceInMonths } from "date-fns"
import type { FinancialGoal } from "@/lib/types"

export function useGoalCalculations(goals: FinancialGoal[]) {
  // Calcular totales para el seguimiento de objetivos
  const calculateGoalTotals = () => {
    const activeGoals = goals.filter((goal) => goal.status === "in-progress" || goal.status === "long-term")
    const totalTarget = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const totalCurrent = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const totalPercentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0

    return {
      count: activeGoals.length,
      totalTarget,
      totalCurrent,
      totalPercentage,
    }
  }

  // Calcular el ahorro mensual promedio
  const calculateMonthlySavings = () => {
    const activeGoals = goals.filter((goal) => goal.status === "in-progress" || goal.status === "long-term")

    if (activeGoals.length === 0) return 0

    let totalMonthlyRate = 0

    activeGoals.forEach((goal) => {
      const monthsPassed = differenceInMonths(new Date(), goal.startDate) || 1
      const monthlyRate = goal.currentAmount / monthsPassed
      totalMonthlyRate += monthlyRate
    })

    return Math.round(totalMonthlyRate)
  }

  return {
    calculateGoalTotals,
    calculateMonthlySavings,
  }
}