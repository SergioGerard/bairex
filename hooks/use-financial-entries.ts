"use client"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { calculateProjections } from "@/lib/calculations"
import type { FinancialEntry, ProjectionData } from "@/lib/types"

export function useFinancialEntries() {
  // Estado directo para las entradas financieras (sin categorías)
  const [entries, setEntries] = useLocalStorage<FinancialEntry[]>("financialEntries", [])
  
  // Estado para la edición de entradas
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projections, setProjections] = useState<ProjectionData[]>([])

  // Calcular proyecciones cuando cambian las entradas
  useEffect(() => {
    const projectionData = calculateProjections(entries, 36) // 36 meses (3 años)
    setProjections(projectionData)
    
    // Guardar proyecciones en localStorage para el simulador FCI
    if (typeof window !== "undefined") {
      localStorage.setItem('proyecciones', JSON.stringify(projectionData))
    }
  }, [entries])

  // Agregar o actualizar una entrada financiera
  const addEntry = (entryData: Omit<FinancialEntry, "id">) => {
    if (isEditing && selectedEntry) {
      // Actualizar entrada existente
      const updatedEntries = entries.map(entry => 
        entry.id === selectedEntry.id 
          ? { ...entryData, id: selectedEntry.id }
          : entry
      )
      setEntries(updatedEntries)
    } else {
      // Agregar nueva entrada
      const newEntry: FinancialEntry = {
        ...entryData,
        id: uuidv4(),
      }
      setEntries([...entries, newEntry])
    }
    
    // Resetear el estado de edición
    setIsEditing(false)
    setSelectedEntry(null)
    setIsModalOpen(false)
  }

  // Eliminar una entrada
  const deleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId))
  }

  // Alternar el estado activo de una entrada
  const toggleEntryActive = (entryId: string) => {
    const updatedEntries = entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, active: !entry.active }
        : entry
    )
    setEntries(updatedEntries)
  }

  // Preparar entrada para edición
  const prepareEntryForEdit = (entry: FinancialEntry) => {
    setSelectedEntry(entry)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  // Abrir modal para nueva entrada
  const openAddEntryModal = () => {
    setSelectedEntry(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEntry(null)
    setIsEditing(false)
  }

  // Obtener entradas activas
  const getActiveEntries = () => {
    return entries.filter(entry => entry.active !== false)
  }

  // Obtener entradas por tipo
  const getEntriesByType = (type: 'income' | 'expense') => {
    return entries.filter(entry => entry.type === type)
  }

  // Obtener total de ingresos
  const getTotalIncome = () => {
    return entries
      .filter(entry => entry.type === 'income' && entry.active !== false)
      .reduce((total, entry) => total + entry.amount, 0)
  }

  // Obtener total de gastos
  const getTotalExpenses = () => {
    return entries
      .filter(entry => entry.type === 'expense' && entry.active !== false)
      .reduce((total, entry) => total + entry.amount, 0)
  }

  // Obtener balance neto
  const getNetBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  // Reordenar entradas
  const reorderEntries = (newEntries: FinancialEntry[]) => {
    setEntries(newEntries)
  }

  // Mover entrada hacia arriba
  const moveEntryUp = (index: number) => {
    if (index > 0) {
      const newEntries = [...entries]
      ;[newEntries[index], newEntries[index - 1]] = [newEntries[index - 1], newEntries[index]]
      setEntries(newEntries)
    }
  }

  // Mover entrada hacia abajo
  const moveEntryDown = (index: number) => {
    if (index < entries.length - 1) {
      const newEntries = [...entries]
      ;[newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]]
      setEntries(newEntries)
    }
  }

  return {
    entries,
    selectedEntry,
    isEditing,
    isModalOpen,
    projections,
    addEntry,
    deleteEntry,
    toggleEntryActive,
    prepareEntryForEdit,
    openAddEntryModal,
    closeModal,
    getActiveEntries,
    getEntriesByType,
    getTotalIncome,
    getTotalExpenses,
    getNetBalance,
    reorderEntries,
    moveEntryUp,
    moveEntryDown,
  }
}