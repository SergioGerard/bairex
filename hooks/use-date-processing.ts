import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Budget, FinancialGoal } from "@/lib/types"

export function useDateProcessing() {
  // Función para obtener el texto del período
  const getPeriodText = (budget: Budget) => {
    switch (budget.period) {
      case "monthly":
        return format(budget.date, "MMMM yyyy", { locale: es })
      case "quarterly":
        const quarterMonth = Math.floor(budget.date.getMonth() / 3) * 3
        const startMonth = new Date(budget.date.getFullYear(), quarterMonth, 1)
        const endMonth = new Date(budget.date.getFullYear(), quarterMonth + 2, 1)
        return `${format(startMonth, "MMM", { locale: es })} - ${format(endMonth, "MMM yyyy", { locale: es })}`
      case "annual":
        return budget.date.getFullYear().toString()
    }
  }

  // Función para procesar fechas al cargar desde localStorage
  const processDates = {
    budgets: (budgets: any[]): Budget[] => {
      return budgets.map((budget) => ({
        ...budget,
        date: new Date(budget.date),
      }))
    },
    goals: (goals: any[]): FinancialGoal[] => {
      return goals.map((goal) => ({
        ...goal,
        startDate: new Date(goal.startDate),
        targetDate: new Date(goal.targetDate),
        completedDate: goal.completedDate ? new Date(goal.completedDate) : undefined,
      }))
    },
  }

  return {
    getPeriodText,
    processDates,
    formatDate: (date: Date) => format(date, "dd/MM/yyyy"),
    formatMonthYear: (date: Date) => format(date, "MMMM yyyy", { locale: es }),
  }
}

