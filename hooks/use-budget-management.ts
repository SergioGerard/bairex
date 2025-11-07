"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Budget } from "@/lib/types"

export function useBudgetManagement(budgets: Budget[], setBudgets: (budgets: Budget[]) => void) {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isDeleteBudgetModalOpen, setIsDeleteBudgetModalOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Función para agregar un nuevo presupuesto
  const handleAddBudget = (budget: Budget) => {
    try {
      if (isEditing && selectedBudget) {
        // Actualizar presupuesto existente
        const updatedBudget = {
          ...budget,
          id: selectedBudget.id,
        }
        setBudgets(budgets.map((b) => (b.id === selectedBudget.id ? updatedBudget : b)))
      } else {
        // Agregar nuevo presupuesto
        const newBudget = {
          ...budget,
          id: uuidv4(),
        }
        setBudgets([...budgets, newBudget])
      }

      setIsBudgetModalOpen(false)
      setSelectedBudget(null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error al agregar/editar presupuesto:", error)
      alert("Ocurrió un error al guardar el presupuesto. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para editar un presupuesto
  const handleEditBudget = (budget: Budget) => {
    try {
      // Crear una copia profunda del presupuesto para evitar problemas de referencia
      const budgetCopy = JSON.parse(JSON.stringify(budget))
      budgetCopy.date = new Date(budgetCopy.date)

      setSelectedBudget(budgetCopy)
      setIsEditing(true)
      setIsBudgetModalOpen(true)
    } catch (error) {
      console.error("Error al preparar edición de presupuesto:", error)
      alert("Ocurrió un error al editar el presupuesto. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para confirmar eliminación de presupuesto
  const confirmDeleteBudget = () => {
    try {
      if (selectedBudget) {
        setBudgets(budgets.filter((b) => b.id !== selectedBudget.id))
        setIsDeleteBudgetModalOpen(false)
        setSelectedBudget(null)
      }
    } catch (error) {
      console.error("Error al eliminar presupuesto:", error)
      alert("Ocurrió un error al eliminar el presupuesto. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para abrir el modal de creación de presupuesto
  const openCreateBudgetModal = () => {
    setSelectedBudget(null)
    setIsEditing(false)
    setIsBudgetModalOpen(true)
  }

  // Función para abrir el modal de eliminación de presupuesto
  const openDeleteBudgetModal = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsDeleteBudgetModalOpen(true)
  }

  // Función para cerrar el modal de presupuesto
  const closeBudgetModal = () => {
    setIsBudgetModalOpen(false)
    setSelectedBudget(null)
    setIsEditing(false)
  }

  return {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isDeleteBudgetModalOpen,
    setIsDeleteBudgetModalOpen,
    selectedBudget,
    setSelectedBudget,
    isEditing,
    setIsEditing,
    handleAddBudget,
    handleEditBudget,
    confirmDeleteBudget,
    openCreateBudgetModal,
    openDeleteBudgetModal,
    closeBudgetModal,
  }
}