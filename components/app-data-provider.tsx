"use client"

import { createContext, useContext, ReactNode, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDateProcessing } from "@/hooks/use-date-processing"
import { useBudgetManagement } from "@/hooks/use-budget-management"
import { useGoalManagement } from "@/hooks/use-goal-management"
import { useGoalCalculations } from "@/hooks/use-goal-calculations"
import { useDataImport } from "@/hooks/use-data-import"

import type { Budget, FinancialGoal } from "@/lib/types"

interface AppDataContextType {
  // Datos principales
  budgets: Budget[]
  setBudgets: (budgets: Budget[]) => void
  goals: FinancialGoal[]
  setGoals: (goals: FinancialGoal[]) => void
  
  // Gestión de presupuestos
  isBudgetModalOpen: boolean
  setIsBudgetModalOpen: (isOpen: boolean) => void
  isDeleteBudgetModalOpen: boolean
  setIsDeleteBudgetModalOpen: (isOpen: boolean) => void
  selectedBudget: Budget | null
  setSelectedBudget: (budget: Budget | null) => void
  isBudgetEditing: boolean
  setBudgetEditing: (isEditing: boolean) => void
  handleAddBudget: (budget: Budget) => void
  handleEditBudget: (budget: Budget) => void
  confirmDeleteBudget: () => void
  openCreateBudgetModal: () => void
  openDeleteBudgetModal: (budget: Budget) => void
  closeBudgetModal: () => void
  
  // Gestión de objetivos
  isGoalModalOpen: boolean
  setIsGoalModalOpen: (isOpen: boolean) => void
  isDeleteGoalModalOpen: boolean
  setIsDeleteGoalModalOpen: (isOpen: boolean) => void
  selectedGoal: FinancialGoal | null
  isGoalEditing: boolean
  handleAddGoal: (goal: FinancialGoal) => void
  handleEditGoal: (goal: FinancialGoal) => void
  confirmDeleteGoal: () => void
  openCreateGoalModal: () => void
  openDeleteGoalModal: (goal: FinancialGoal) => void
  closeGoalModal: () => void
  
  // Cálculos de objetivos
  goalTotals: {
    count: number
    totalTarget: number
    totalCurrent: number
    totalPercentage: number
  }
  monthlySavingsRate: number
  
  // Utilidades de fechas
  formatDate: (date: Date) => string
  formatMonthYear: (date: Date) => string
  getPeriodText: (budget: Budget) => string
  processDates: {
    budgets: (budgets: Budget[]) => Budget[]
    goals: (goals: FinancialGoal[]) => FinancialGoal[]
  }
  
  // Importación de datos
  handleImport: (data: { budgets?: Budget[]; goals?: FinancialGoal[] }) => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export function AppDataProvider({ children }: { children: ReactNode }) {
  // Almacenamiento local
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("budgets", [])
  const [goals, setGoals] = useLocalStorage<FinancialGoal[]>("goals", [])

  // Utilidades de fechas
  const { getPeriodText, processDates, formatDate, formatMonthYear } = useDateProcessing()

  // No hay lógica de negocio adicional
  
  // Gestión de presupuestos
  const {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isDeleteBudgetModalOpen,
    setIsDeleteBudgetModalOpen,
    selectedBudget,
    setSelectedBudget,
    isEditing: isBudgetEditing,
    setIsEditing: setBudgetEditing,
    handleAddBudget,
    handleEditBudget,
    confirmDeleteBudget,
    openCreateBudgetModal,
    openDeleteBudgetModal,
    closeBudgetModal
  } = useBudgetManagement(budgets, setBudgets)
  
  // Gestión de objetivos
  const {
    isGoalModalOpen,
    setIsGoalModalOpen,
    isDeleteGoalModalOpen,
    setIsDeleteGoalModalOpen,
    selectedGoal,
    isEditing: isGoalEditing,
    handleAddGoal,
    handleEditGoal,
    confirmDeleteGoal,
    openCreateGoalModal,
    openDeleteGoalModal,
    closeGoalModal
  } = useGoalManagement(goals, setGoals)
  
  // Cálculos de objetivos
  const { calculateGoalTotals, calculateMonthlySavings } = useGoalCalculations(goals)
  const goalTotals = calculateGoalTotals()
  const monthlySavingsRate = calculateMonthlySavings()
  
  // Importación de datos
  const { handleImport } = useDataImport(setBudgets, setGoals)

  // Procesar fechas al cargar desde localStorage
  useEffect(() => {
    if (budgets.length > 0 && typeof budgets[0].date === 'string') {
      setBudgets(processDates.budgets(budgets))
    }
  }, [budgets, processDates, setBudgets])

  useEffect(() => {
    if (goals.length > 0 && typeof goals[0].startDate === 'string') {
      setGoals(processDates.goals(goals))
    }
  }, [goals, processDates, setGoals])

  const value = {
    // Datos principales
    budgets,
    setBudgets,
    goals,
    setGoals,
    

    
    // Gestión de presupuestos
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isDeleteBudgetModalOpen,
    setIsDeleteBudgetModalOpen,
    selectedBudget,
    setSelectedBudget,
    isBudgetEditing,
    setBudgetEditing,
    handleAddBudget,
    handleEditBudget,
    confirmDeleteBudget,
    openCreateBudgetModal,
    openDeleteBudgetModal,
    closeBudgetModal,
    
    // Gestión de objetivos
    isGoalModalOpen,
    setIsGoalModalOpen,
    isDeleteGoalModalOpen,
    setIsDeleteGoalModalOpen,
    selectedGoal,
    isGoalEditing,
    handleAddGoal,
    handleEditGoal,
    confirmDeleteGoal,
    openCreateGoalModal,
    openDeleteGoalModal,
    closeGoalModal,
    
    // Cálculos de objetivos
    goalTotals,
    monthlySavingsRate,
    
    // Utilidades de fechas
    formatDate,
    formatMonthYear,
    getPeriodText,
    processDates,
    
    // Importación de datos
    handleImport
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}