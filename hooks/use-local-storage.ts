"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  // Inicializar siempre con initialValue para evitar hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar datos de localStorage después de la hidratación
  useEffect(() => {
    try {
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key)

      // Analizar el JSON almacenado o mantener initialValue
      if (item) {
        setStoredValue(JSON.parse(item))
      }
      
      setIsInitialized(true)
    } catch (error) {
      console.error(`Error al cargar ${key} desde localStorage:`, error)
      setIsInitialized(true)
    }
  }, [key])

  // Escuchar cambios en localStorage (incluyendo eventos personalizados)
  useEffect(() => {
    // Solo ejecutar en el navegador y después de la inicialización
    if (typeof window === "undefined" || !isInitialized) {
      return
    }

    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error al actualizar desde evento storage para ${key}:`, error)
      }
    }

    // Agregar event listener para el evento storage
    window.addEventListener("storage", handleStorageChange)

    // Limpiar event listener al desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, isInitialized])

  // Función para actualizar el valor en localStorage
  const setValue = (value: T) => {
    try {
      // Permitir que value sea una función para seguir el mismo patrón que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Guardar estado
      setStoredValue(valueToStore)

      // Guardar en localStorage solo si estamos en el navegador
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}

