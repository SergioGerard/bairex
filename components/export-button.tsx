"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import type { FinancialEntry, Budget, FinancialGoal, MovementCategory, ProjectionData } from "@/lib/types"
import type { Producto, ProductoCarrito } from "@/hooks/use-shopping-simulation"

interface ExportButtonProps {
  entries?: FinancialEntry[]
  budgets?: Budget[]
  goals?: FinancialGoal[]
  productos?: Producto[]
  carrito?: ProductoCarrito[]
  categories?: MovementCategory[]
  onExportComplete?: () => void
  customLabel?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export default function ExportButton({
  entries = [],
  budgets = [],
  goals = [],
  productos = [],
  carrito = [],
  categories = [],
  onExportComplete,
  customLabel = "Exportar",
  variant = "outline",
  className = "",
}: ExportButtonProps) {

  const [localEntries, setLocalEntries] = useState<FinancialEntry[]>([])
  const [localBudgets, setLocalBudgets] = useState<Budget[]>([])
  const [localGoals, setLocalGoals] = useState<FinancialGoal[]>([])
  const [localProductos, setLocalProductos] = useState<Producto[]>([])
  const [localCarrito, setLocalCarrito] = useState<ProductoCarrito[]>([])
  const [localCategories, setLocalCategories] = useState<MovementCategory[]>([])
  const [localProyecciones, setLocalProyecciones] = useState<ProjectionData[]>([])

  // Cargar todos los datos de localStorage al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Cargar entradas financieras
        const storedEntries = localStorage.getItem("financialEntries")
        if (storedEntries) {
          setLocalEntries(JSON.parse(storedEntries))
        }

        // Cargar presupuestos
        const storedBudgets = localStorage.getItem("budgets")
        if (storedBudgets) {
          setLocalBudgets(JSON.parse(storedBudgets))
        }

        // Cargar objetivos
        const storedGoals = localStorage.getItem("goals")
        if (storedGoals) {
          setLocalGoals(JSON.parse(storedGoals))
        }
        
        // Cargar productos
        const storedProductos = localStorage.getItem("productos")
        if (storedProductos) {
          setLocalProductos(JSON.parse(storedProductos))
        }
        
        // Cargar carrito
        const storedCarrito = localStorage.getItem("carrito")
        if (storedCarrito) {
          setLocalCarrito(JSON.parse(storedCarrito))
        }
        
        // Cargar categorías
        const storedCategories = localStorage.getItem("movementCategories")
        if (storedCategories) {
          setLocalCategories(JSON.parse(storedCategories))
        }
        
        // Cargar proyecciones
        const storedProyecciones = localStorage.getItem("proyecciones")
        if (storedProyecciones) {
          setLocalProyecciones(JSON.parse(storedProyecciones))
        }
      } catch (error) {
        console.error("Error al cargar datos desde localStorage:", error)
      }
    }
  }, [])

  // Actualizar datos locales cuando cambian los props
  useEffect(() => {
    if (entries.length > 0) setLocalEntries(entries)
    if (budgets.length > 0) setLocalBudgets(budgets)
    if (goals.length > 0) setLocalGoals(goals)
    if (productos.length > 0) setLocalProductos(productos)
    if (carrito.length > 0) setLocalCarrito(carrito)
    if (categories.length > 0) setLocalCategories(categories)
  }, [entries, budgets, goals, productos, carrito, categories])

  // Escuchar eventos de storage para mantener sincronizados los datos
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        // Actualizar entradas financieras
        const storedEntries = localStorage.getItem("financialEntries")
        if (storedEntries) {
          setLocalEntries(JSON.parse(storedEntries))
        }

        // Actualizar presupuestos
        const storedBudgets = localStorage.getItem("budgets")
        if (storedBudgets) {
          setLocalBudgets(JSON.parse(storedBudgets))
        }

        // Actualizar objetivos
        const storedGoals = localStorage.getItem("goals")
        if (storedGoals) {
          setLocalGoals(JSON.parse(storedGoals))
        }
        
        // Actualizar productos
        const storedProductos = localStorage.getItem("productos")
        if (storedProductos) {
          setLocalProductos(JSON.parse(storedProductos))
        }
        
        // Actualizar carrito
        const storedCarrito = localStorage.getItem("carrito")
        if (storedCarrito) {
          setLocalCarrito(JSON.parse(storedCarrito))
        }
        
        // Actualizar categorías
        const storedCategories = localStorage.getItem("movementCategories")
        if (storedCategories) {
          setLocalCategories(JSON.parse(storedCategories))
        }
        
        // Actualizar proyecciones
        const storedProyecciones = localStorage.getItem("proyecciones")
        if (storedProyecciones) {
          setLocalProyecciones(JSON.parse(storedProyecciones))
        }
      } catch (error) {
        console.error("Error al actualizar datos desde evento storage:", error)
      }
    }

    // Agregar event listener para el evento storage
    window.addEventListener("storage", handleStorageChange)

    // Limpiar event listener al desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Exportar datos como JSON
  const exportAsJson = () => {
    try {
      // Crear objeto con todos los datos desde localStorage
      const exportData = {
        financialEntries: localEntries,
        categories: localCategories,
        budgets: localBudgets,
        goals: localGoals,
        productos: localProductos,
        carrito: localCarrito,
        proyecciones: localProyecciones,
        exportDate: new Date().toISOString(),
        version: '2.1' // Incrementar versión para incluir todos los datos
      }

      const dataStr = JSON.stringify(
        exportData,
        (key, value) => {
          // Convertir fechas a formato ISO para que se puedan reconstruir
          if (value instanceof Date) {
            return value.toISOString()
          }
          return value
        },
        2
      )

      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = "finanzar-datos.json"
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      
      linkElement.click()
      
      // Llamar al callback si existe
      if (onExportComplete) {
        onExportComplete()
      }
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast.error("Ocurrió un error al exportar los datos. Por favor, inténtalo de nuevo")
    }
  }

  return (
    <Button 
      onClick={exportAsJson} 
      variant={variant}
      className={`text-foreground flex items-center gap-2 ${className}`}
    >
      <Download className="h-4 w-4" />
      {customLabel}
    </Button>
  )
}