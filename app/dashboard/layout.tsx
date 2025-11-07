"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { 
  SidebarProvider,
  SidebarInset, 
  SidebarTrigger
} from "@/components/ui/sidebar"
import { AppDataProvider } from "@/components/app-data-provider"
import { ModeToggle } from "@/components/ui/toggle-mode"
import ImportButton from "@/components/import-button"
import ExportButton from "@/components/export-button"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface DashboardLayoutProps {
  children: ReactNode 
}



export default function DashboardRootLayout({ children }: DashboardLayoutProps) {
  // Usar localStorage para los datos
  const [entries] = useLocalStorage("financialEntries", [])
  const [budgets] = useLocalStorage("budgets", [])
  const [goals] = useLocalStorage("goals", [])
  const [productos] = useLocalStorage("productos", [])
  const [carrito] = useLocalStorage("carrito", [])
  const [categories] = useLocalStorage("movementCategories", [])
  const [defaultOpen, setDefaultOpen] = useState(true)

  useEffect(() => {
    // Get sidebar state from cookie after hydration
    const sidebarState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1]
    
    // If cookie exists, use its value, otherwise default to true (expanded)
    if (sidebarState !== undefined) {
      setDefaultOpen(sidebarState === 'true')
    }
  }, [])

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppDataProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10 bg-sidebar-background border-b border-border min-w-0">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 px-4">
              <ImportButton 
                onImport={(data) => {
                  // Manejar la importación de datos
                  if (data.entries && data.entries.length > 0) {
                    localStorage.setItem("financialEntries", JSON.stringify(data.entries))
                  }
                  if (data.budgets && data.budgets.length > 0) {
                    localStorage.setItem("budgets", JSON.stringify(data.budgets))
                  }
                  if (data.goals && data.goals.length > 0) {
                    localStorage.setItem("goals", JSON.stringify(data.goals))
                  }
                  if (data.productos && data.productos.length > 0) {
                    localStorage.setItem("productos", JSON.stringify(data.productos))
                  }
                  if (data.carrito && data.carrito.length > 0) {
                    localStorage.setItem("carrito", JSON.stringify(data.carrito))
                  }
                  if (data.categories && data.categories.length > 0) {
                    localStorage.setItem("movementCategories", JSON.stringify(data.categories))
                  }
                  // Disparar evento de storage para actualizar componentes
                  window.dispatchEvent(new Event("storage"))
                }}
                customLabel=""
                variant="ghost"
                className="h-8 w-8 p-0"
              />
              <ExportButton 
                entries={entries}
                budgets={budgets}
                goals={goals}
                productos={productos}
                carrito={carrito}
                categories={categories}
                customLabel=""
                variant="ghost"
                className="h-8 w-8 p-0"
              />
              <ModeToggle />
            </div>
          </header>
          <div className="overflow-auto">
            <main className="msm:p-4 p-0 min-w-0">{children}</main>
          </div>
        </SidebarInset>
      </AppDataProvider>
    </SidebarProvider>
  )
}