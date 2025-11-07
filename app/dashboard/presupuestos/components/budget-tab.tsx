"use client"

import { useState, useEffect } from "react"
import BudgetList from "./budget-list"
import type { Budget } from "@/lib/types"

interface BudgetTabProps {
  budgets: Budget[]
  onCreateBudget: () => void
  onEditBudget: (budget: Budget) => void
  onDeleteBudget: (budget: Budget) => void
  onSelectBudget: (budget: Budget) => void
}

export default function BudgetTab({
  budgets,
  onEditBudget,
  onDeleteBudget,
  onSelectBudget,
}: BudgetTabProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="space-y-4 budget-section">
      {budgets.length > 0 ? (
        <BudgetList
          budgets={budgets}
          onEdit={onEditBudget}
          onDelete={onDeleteBudget}
          onSelect={onSelectBudget}
        />
      ) : isClient ? (
        <div className="bg-card border-border text-center py-12 border rounded-lg mt-6">
          <p className="text-muted-foreground mb-4">No hay presupuestos registrados aún.</p>
        </div>
      ) : null}
    </div>
  )
}