"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { FinancialGoal } from "@/lib/types"

export function useGoalManagement(goals: FinancialGoal[], setGoals: (goals: FinancialGoal[]) => void) {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isDeleteGoalModalOpen, setIsDeleteGoalModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Función para agregar un nuevo objetivo
  const handleAddGoal = (goal: FinancialGoal) => {
    try {
      if (isEditing && selectedGoal) {
        // Actualizar objetivo existente
        const updatedGoal = {
          ...goal,
          id: selectedGoal.id,
        }
        setGoals(goals.map((g) => (g.id === selectedGoal.id ? updatedGoal : g)))
      } else {
        // Agregar nuevo objetivo
        const newGoal = {
          ...goal,
          id: uuidv4(),
        }
        setGoals([...goals, newGoal])
      }

      setIsGoalModalOpen(false)
      setSelectedGoal(null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error al agregar/editar objetivo:", error)
      alert("Ocurrió un error al guardar el objetivo. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para editar un objetivo
  const handleEditGoal = (goal: FinancialGoal) => {
    try {
      // Crear una copia profunda del objetivo para evitar problemas de referencia
      const goalCopy = JSON.parse(JSON.stringify(goal))
      goalCopy.startDate = new Date(goalCopy.startDate)
      goalCopy.targetDate = new Date(goalCopy.targetDate)
      if (goalCopy.completedDate) {
        goalCopy.completedDate = new Date(goalCopy.completedDate)
      }

      setSelectedGoal(goalCopy)
      setIsEditing(true)
      setIsGoalModalOpen(true)
    } catch (error) {
      console.error("Error al preparar edición de objetivo:", error)
      alert("Ocurrió un error al editar el objetivo. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para confirmar eliminación de objetivo
  const confirmDeleteGoal = () => {
    try {
      if (selectedGoal) {
        setGoals(goals.filter((g) => g.id !== selectedGoal.id))
        setIsDeleteGoalModalOpen(false)
        setSelectedGoal(null)
      }
    } catch (error) {
      console.error("Error al eliminar objetivo:", error)
      alert("Ocurrió un error al eliminar el objetivo. Por favor, inténtalo de nuevo.")
    }
  }

  // Función para abrir el modal de creación de objetivo
  const openCreateGoalModal = () => {
    setSelectedGoal(null)
    setIsEditing(false)
    setIsGoalModalOpen(true)
  }

  // Función para abrir el modal de eliminación de objetivo
  const openDeleteGoalModal = (goal: FinancialGoal) => {
    setSelectedGoal(goal)
    setIsDeleteGoalModalOpen(true)
  }

  // Función para cerrar el modal de objetivo
  const closeGoalModal = () => {
    setIsGoalModalOpen(false)
    setSelectedGoal(null)
    setIsEditing(false)
  }

  return {
    isGoalModalOpen,
    setIsGoalModalOpen,
    isDeleteGoalModalOpen,
    setIsDeleteGoalModalOpen,
    selectedGoal,
    setSelectedGoal,
    isEditing,
    setIsEditing,
    handleAddGoal,
    handleEditGoal,
    confirmDeleteGoal,
    openCreateGoalModal,
    openDeleteGoalModal,
    closeGoalModal,
  }
}