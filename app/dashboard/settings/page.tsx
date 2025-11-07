"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

// Skeleton Component
function SettingsSkeleton() {
  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>
      
      {/* Main Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleReset = () => {
    // Clear all data from localStorage
    localStorage.removeItem("financialEntries")
    localStorage.removeItem("budgets")
    localStorage.removeItem("goals")
    localStorage.removeItem("productos")
    localStorage.removeItem("carrito")
    localStorage.removeItem("movementCategories")
    localStorage.removeItem("metrics")
    localStorage.removeItem("proyecciones")
    localStorage.removeItem("dashboard_period")
    localStorage.removeItem("simulador_period")
    localStorage.removeItem("simulador_tna")
    localStorage.removeItem("simulador_montos")
    localStorage.removeItem("simulador_meses")
    localStorage.removeItem("simulador_monthly_amounts")
    localStorage.removeItem("simulador_mode")

    // Dispatch storage event to update all components
    window.dispatchEvent(new CustomEvent("storage"))

    setIsResetModalOpen(false)
  }

  // Mostrar skeleton mientras se hidrata
  if (!isHydrated) {
    return <SettingsSkeleton />
  }

  return (
    <div className="mx-auto p-4">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-card border border-border rounded-md p-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Configuración</h1>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
          <CardDescription>Administra los datos de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Reiniciar Plataforma</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Elimina todos los datos importados y creados para comenzar desde cero.
                Esta acción no se puede deshacer.
              </p>
              <Button variant="destructive" onClick={() => setIsResetModalOpen(true)}>
                Reiniciar Datos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente todos tus datos, incluyendo:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Entradas financieras</li>
                <li>Presupuestos</li>
                <li>Objetivos financieros</li>
                <li>Productos y carrito de compras</li>
                <li>Categorías de movimientos</li>
                <li>Métricas y proyecciones</li>
                <li>Configuraciones del simulador</li>
                <li>Preferencias del dashboard</li>
              </ul>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Sí, reiniciar datos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </BlurFade>
    </div>
  )
}