"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2, Pencil, MoreHorizontal } from "lucide-react"
import type { FinancialGoal } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GoalListProps {
  goals: FinancialGoal[]
  onEdit: (goal: FinancialGoal) => void
  onDelete: (goal: FinancialGoal) => void
}

export default function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  // Estado para controlar si estamos en el cliente
  const [isClient, setIsClient] = useState(false)
  // Estado para almacenar las fechas formateadas
  const [formattedDates, setFormattedDates] = useState<Record<string, {
    startDate: string;
    targetDate: string;
    completedDate?: string;
  }>>({});
  
  // Efecto para detectar renderizado en cliente
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Efecto para formatear las fechas solo en el cliente
  useEffect(() => {
    if (!isClient) return;
    
    const dates: Record<string, {
      startDate: string;
      targetDate: string;
      completedDate?: string;
    }> = {};
    
    goals.forEach(goal => {
      dates[goal.id] = {
        startDate: format(goal.startDate, "d MMM yyyy", { locale: es }),
        targetDate: format(goal.targetDate, "d MMM yyyy", { locale: es }),
      };
    });
    
    setFormattedDates(dates);
  }, [goals, isClient]);
  
  // Si no hay objetivos o no estamos en el cliente, no renderizamos nada
  if (goals.length === 0 || !isClient) {
    return null;
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">En progreso</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completado</Badge>;
      case "at-risk":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">En riesgo</Badge>;
      case "long-term":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Largo plazo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {goals.map((goal) => (
        <Card key={goal.id} className="bg-gradient-to-b flex flex-col justify-between from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] transition-all duration-300 hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  {getStatusBadge(goal.status)}
                </CardDescription>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(goal)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(goal)} className="text-red-600">
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
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm">
                    {`$${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()}`}
                  </span>
                </div>
                <Progress value={goal.percentage} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{formattedDates[goal.id]?.startDate}</span>
                  <span className="text-xs text-muted-foreground">{formattedDates[goal.id]?.targetDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}