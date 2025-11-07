"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trash2, Pencil, MoreHorizontal } from "lucide-react"
import type { Budget } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BudgetListProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
  onSelect?: (budget: Budget) => void
}

export default function BudgetList({ budgets, onEdit, onDelete, onSelect }: BudgetListProps) {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Evita la hidratación incorrecta asegurando que se renderiza solo en el cliente
  }, [])

  // Si no hay presupuestos, no renderizamos nada hasta que estemos en el cliente
  // para evitar errores de hidratación
  if (budgets.length === 0) {
    return null
  }
  
  // Solo mostramos el contenido cuando estamos en el cliente
  if (!isClient) {
    return null // No renderizamos nada en el servidor para evitar errores de hidratación
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {budgets.map((budget) => {
        // Formatear la fecha en el cliente
        let periodText = "Cargando..."
        switch (budget.period) {
          case "monthly":
            periodText = format(budget.date, "MMMM yyyy", { locale: es })
            break
          case "quarterly":
            const quarterMonth = Math.floor(budget.date.getMonth() / 3) * 3
            const startMonth = new Date(budget.date.getFullYear(), quarterMonth, 1)
            const endMonth = new Date(budget.date.getFullYear(), quarterMonth + 2, 1)
            periodText = `${format(startMonth, "MMM", { locale: es })} - ${format(endMonth, "MMM yyyy", { locale: es })}`
            break
          case "annual":
            periodText = budget.date.getFullYear().toString()
            break
          default:
            periodText = format(budget.date, "MMMM yyyy", { locale: es })
        }

        return (
          <Card 
            key={budget.id} 
            className={cn(
              "bg-gradient-to-b flex flex-col justify-between",
              "from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)]", 
              "dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)]", 
              "transition-all duration-300", 
              "hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)]", 
              "dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]",
              "cursor-pointer",
              selectedBudgetId === budget.id ? "ring-2 ring-primary ring-offset-2 shadow-lg" : ""
            )}
            onClick={() => {
              setSelectedBudgetId(budget.id === selectedBudgetId ? null : budget.id)
              if (onSelect && budget.id !== selectedBudgetId) {
                onSelect(budget)
              }
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{budget.name}</CardTitle>
                  <CardDescription>{periodText}</CardDescription>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(budget);
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(budget);
                        }} 
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budget.categories.map((category) => {
                  // Removed unused budgetPercentage variable

                  return (
                    <div key={category.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm">
                          {`$${category.currentAmount.toLocaleString()} / $${category.targetAmount.toLocaleString()}`}
                        </span>
                      </div>
                      <Progress
                        value={category.percentage}
                        className={cn("h-2", category.percentage > 100 ? "[&>div]:bg-red-500" : "")}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}