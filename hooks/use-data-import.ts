"use client"

import type { Budget, FinancialGoal, FinancialEntry, MovementCategory } from "@/lib/types"

export function useDataImport(
  setBudgets: (budgets: Budget[]) => void,
  setGoals: (goals: FinancialGoal[]) => void
) {
  // Manejar la importación de datos
  const handleImport = (data: any) => {
    try {
      // Verificar si es la nueva estructura (v2.0) o la antigua
      const isNewStructure = data.version === '2.0' || (data.categories && !data.entries)
      
      if (isNewStructure) {
        // Nueva estructura: categorías con entradas anidadas
        if (data.categories && Array.isArray(data.categories)) {
          localStorage.setItem('movementCategories', JSON.stringify(data.categories))
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'movementCategories',
            newValue: JSON.stringify(data.categories)
          }))
        }
      } else {
        // Estructura antigua: migrar datos
        if (data.entries && Array.isArray(data.entries) && data.categories && Array.isArray(data.categories)) {
          // Crear categorías con entradas anidadas
          const migratedCategories = data.categories.map((category: any) => ({
            ...category,
            entries: data.entries.filter((entry: any) => 
              entry.categoryId === category.id || 
              (!entry.categoryId && category.isDefault)
            ).map((entry: any) => {
              const { categoryId, ...entryWithoutCategoryId } = entry
              return entryWithoutCategoryId
            })
          }))
          
          localStorage.setItem('movementCategories', JSON.stringify(migratedCategories))
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'movementCategories',
            newValue: JSON.stringify(migratedCategories)
          }))
        }
      }

      if (data.budgets) {
        setBudgets(data.budgets)
      }

      if (data.goals) {
        setGoals(data.goals)
      }
    } catch (error) {
      console.error('Error importing data:', error)
    }
  }

  return {
    handleImport,
  }
}