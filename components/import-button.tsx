"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import type { FinancialEntry, Budget, FinancialGoal, MovementCategory } from "@/lib/types"
import type { Producto, ProductoCarrito } from "@/hooks/use-shopping-simulation"

interface ImportButtonProps {
  onImport: (data: { 
    entries?: FinancialEntry[]; 
    budgets?: Budget[]; 
    goals?: FinancialGoal[]; 
    productos?: Producto[]; 
    carrito?: ProductoCarrito[];
    categories?: MovementCategory[]
  }) => void
  customLabel?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export default function ImportButton({
  onImport,
  customLabel = "Importar",
  variant = "outline",
  className = "",
}: ImportButtonProps) {
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null)

  // Importar datos desde JSON
  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files?.[0] as Blob, "UTF-8")
      fileReader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsedData = JSON.parse(content)
          const importData: { 
            entries?: FinancialEntry[]; 
            budgets?: Budget[]; 
            goals?: FinancialGoal[]; 
            productos?: Producto[]; 
            carrito?: ProductoCarrito[];
            categories?: MovementCategory[]
          } = {}

          // Procesar entradas financieras (soportar tanto 'entries' como 'financialEntries')
          const entriesArray = parsedData.entries || parsedData.financialEntries
          if (entriesArray && Array.isArray(entriesArray)) {
            importData.entries = entriesArray.map((entry: Record<string, unknown>) => ({
              ...entry,
              startDate: new Date(entry.startDate as string),
              id: entry.id || uuidv4(),
            })) as FinancialEntry[]
          }

          // Procesar presupuestos
          if (parsedData.budgets && Array.isArray(parsedData.budgets)) {
            importData.budgets = parsedData.budgets.map((budget: Record<string, unknown>) => ({
              ...budget,
              date: new Date(budget.date as string),
              id: budget.id || uuidv4(),
            }))
          }

          // Procesar objetivos
          if (parsedData.goals && Array.isArray(parsedData.goals)) {
            importData.goals = parsedData.goals.map((goal: Record<string, unknown>) => ({
              ...goal,
              startDate: new Date(goal.startDate as string),
              targetDate: new Date(goal.targetDate as string),
              completedDate: goal.completedDate ? new Date(goal.completedDate as string) : undefined,
              id: goal.id || uuidv4(),
            }))
          }

          // Procesar productos
          if (parsedData.productos && Array.isArray(parsedData.productos)) {
            importData.productos = parsedData.productos.map((producto: Record<string, unknown>) => ({
              ...producto,
              id: producto.id || uuidv4(),
            }))
          }

          // Procesar carrito
          if (parsedData.carrito && Array.isArray(parsedData.carrito)) {
            importData.carrito = parsedData.carrito.map((item: Record<string, unknown>) => ({
              ...item,
              id: item.id || uuidv4(),
            }))
          }

          // Procesar categorías
          if (parsedData.categories && Array.isArray(parsedData.categories)) {
            importData.categories = parsedData.categories.map((category: Record<string, unknown>) => ({
              ...category,
              createdAt: new Date(category.createdAt as string),
              id: category.id || uuidv4(),
            }))
          }

          onImport(importData)
          toast.success("Datos importados correctamente")
        } catch (error) {
          console.error("Error al analizar JSON:", error)
          toast.error("Error al importar archivo. Asegúrate de que sea un archivo JSON válido")
        }

        // Restablecer la entrada de archivo
        if (event.target) {
          event.target.value = ""
        }
      }
    } catch (error) {
      console.error("Error al importar datos:", error)
      toast.error("Ocurrió un error al importar los datos. Por favor, inténtalo de nuevo")
    }
  }

  // Activar clic en entrada de archivo
  const triggerFileInput = () => {
    fileInputRef?.click()
  }

  return (
    <>
      <Button 
        onClick={triggerFileInput} 
        variant={variant} 
        className={`text-foreground flex items-center gap-2 ${className}`}
      >
        <Upload className="h-4 w-4" />
        {customLabel}
      </Button>
      <Input
        type="file"
        accept=".json"
        className="hidden"
        onChange={importFromJson}
        ref={(input) => setFileInputRef(input)}
      />
    </>
  )
}