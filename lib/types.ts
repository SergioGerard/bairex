export type RecurrenceType =
  | "daily"
  | "weekly"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "every4months"
  | "every5months"
  | "every6months"
  | "annual"
  | "one-time" // Nueva opción para pagos únicos
  | "installments" // Nueva opción para pagos en cuotas

export type EntryType = "income" | "expense"
export type InflationAdjustmentType = "percentage" | "fixed" | "variable"
export type InflationRecurrenceType =
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "every4months"
  | "every5months"
  | "every6months"
  | "annual"

export interface VariableInflation {
  month: number // 0-based month index
  value: number // Percentage or fixed amount
}

export interface FinancialEntry {
  id?: string
  name: string
  amount: number
  type: EntryType
  recurrence: RecurrenceType
  installments?: number // Número de cuotas cuando recurrence es "installments"
  inflationAdjustmentType?: InflationAdjustmentType
  inflationAdjustment?: number // Optional adjustment value
  inflationRecurrence?: InflationRecurrenceType // How often inflation is applied
  variableInflation?: VariableInflation[] // For variable inflation rates/amounts
  variableInflationType?: "percentage" | "fixed" // Type of variable inflation
  startDate: Date
  active?: boolean // Indica si el movimiento está activo o desactivado
  categoryId?: string // ID de la categoría a la que pertenece el movimiento
}

// Nuevos tipos para categorías de movimientos
export interface MovementCategory {
  id: string
  name: string
  isDefault: boolean
  createdAt: Date
  color?: string // Color opcional para la categoría
  entries: FinancialEntry[] // Movimientos anidados dentro de la categoría
}

export interface ProjectionData {
  income: number
  expenses: number
  balance: number
  accumulatedBalance: number
}

// Nuevos tipos para presupuestos
export type BudgetPeriod = "monthly" | "quarterly" | "annual"
export type BudgetCategory = {
  id: string
  name: string
  icon: string
  currentAmount: number
  targetAmount: number
  percentage: number
}

export interface Budget {
  id: string
  name: string
  period: BudgetPeriod
  date: Date
  categories: BudgetCategory[]
}

// Nuevos tipos para objetivos financieros
export type GoalStatus = "in-progress" | "completed" | "at-risk" | "long-term"
export interface FinancialGoal {
  id: string
  name: string
  status: GoalStatus
  targetAmount: number
  currentAmount: number
  percentage: number
  startDate: Date
  targetDate: Date
  completedDate?: Date
}

// Tipos para presupuestos y objetivos financieros

// Tipo para actualizaciones de la aplicación
export interface Actualizacion {
  version: string
  fecha: string
  titulo: string
  descripcion: string[]
}

