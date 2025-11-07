"use client";

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BudgetTab from "./components/budget-tab"
import GoalsTab from "./components/goals-tab"
import BudgetModals from "./components/budget-modals"
import GoalModals from "./components/goal-modals"
import { DollarSign, PlusCircle } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

// Usar el contexto de datos centralizado desde el AppDataProvider configurado en layout.tsx
import { useAppData } from "@/components/app-data-provider"

// Skeleton para las cards de métricas de objetivos
const GoalMetricsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);

// Skeleton para la lista de presupuestos
const BudgetListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton para la lista de objetivos
const GoalListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton completo de la página de presupuestos
const PresupuestosSkeleton = ({ activeTab = "presupuestos" }: { activeTab?: string }) => (
  <div className="mx-auto p-4">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 mb-6">
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-8 w-32" />
    </div>

    {/* Tabs y controles skeleton */}
    <div className="flex justify-between flex-col mlg:flex-row items-start gap-4 mb-6">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <Skeleton className="h-9 w-40 rounded-lg" />
    </div>

    {/* Métricas de objetivos skeleton (solo visible en tab objetivos) */}
    {activeTab === "objetivos" && <GoalMetricsSkeleton />}

    {/* Lista skeleton según la pestaña activa */}
    {activeTab === "presupuestos" ? <BudgetListSkeleton /> : <GoalListSkeleton />}
  </div>
);

export default function PresupuestosPage() {
  // Estado local para la pestaña activa
  const [activeTab, setActiveTab] = useState("presupuestos")
  
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false)

  // Efecto para marcar como hidratado después del primer render
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  // Usar el contexto de datos centralizado
  const {
    // Datos principales
    budgets,
    goals,
    
    // Gestión de presupuestos
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isDeleteBudgetModalOpen,
    setIsDeleteBudgetModalOpen,
    selectedBudget,
    setSelectedBudget,
    isBudgetEditing,
    handleAddBudget,
    handleEditBudget,
    confirmDeleteBudget,
    openCreateBudgetModal,
    openDeleteBudgetModal,
    closeBudgetModal,
    
    // Gestión de objetivos
    isGoalModalOpen,
    setIsGoalModalOpen,
    isDeleteGoalModalOpen,
    setIsDeleteGoalModalOpen,
    selectedGoal,
    isGoalEditing,
    handleAddGoal,
    handleEditGoal,
    confirmDeleteGoal,
    openCreateGoalModal,
    openDeleteGoalModal,
    closeGoalModal,
    
    // Cálculos de objetivos
    goalTotals,
    monthlySavingsRate,
  } = useAppData()

  // Mostrar skeleton mientras no esté hidratado
  if (!isHydrated) {
    return <PresupuestosSkeleton activeTab={activeTab} />;
  }

  return (
    <div className="mx-auto p-4">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-card border border-border rounded-md p-2">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Presupuestos</h1>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <Tabs defaultValue="presupuestos" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between flex-col mlg:flex-row items-start gap-4">
          <TabsList className="w-fit tabs-list">
            <TabsTrigger value="presupuestos">Presupuestos</TabsTrigger>
            <TabsTrigger value="objetivos">Objetivos Financieros</TabsTrigger>
          </TabsList>
          
          <div className="self-end">
            {activeTab === "presupuestos" && (
              <Button onClick={openCreateBudgetModal} className="text-background add-budget-button">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Presupuesto
              </Button>
            )}
            
            {activeTab === "objetivos" && (
              <Button onClick={openCreateGoalModal} className="text-background add-budget-button">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Objetivo
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="presupuestos">
          <BudgetTab 
            budgets={budgets}
            onCreateBudget={openCreateBudgetModal}
            onEditBudget={handleEditBudget}
            onDeleteBudget={openDeleteBudgetModal}
            onSelectBudget={(budget) => setSelectedBudget(budget)}
          />
        </TabsContent>

        <TabsContent value="objetivos">
          <GoalsTab 
            goals={goals}
            onEditGoal={handleEditGoal}
            onDeleteGoal={openDeleteGoalModal}
            goalTotals={goalTotals}
            monthlySavingsRate={monthlySavingsRate}
          />
        </TabsContent>


      </Tabs>

      {/* Modales de presupuestos */}
      <BudgetModals 
        isBudgetModalOpen={isBudgetModalOpen}
        setIsBudgetModalOpen={setIsBudgetModalOpen}
        isDeleteBudgetModalOpen={isDeleteBudgetModalOpen}
        setIsDeleteBudgetModalOpen={setIsDeleteBudgetModalOpen}
        selectedBudget={selectedBudget}
        isEditing={isBudgetEditing}
        handleAddBudget={handleAddBudget}
        closeBudgetModal={closeBudgetModal}
        confirmDeleteBudget={confirmDeleteBudget}
      />

      {/* Modales de objetivos */}
      <GoalModals 
        isGoalModalOpen={isGoalModalOpen}
        setIsGoalModalOpen={setIsGoalModalOpen}
        isDeleteGoalModalOpen={isDeleteGoalModalOpen}
        setIsDeleteGoalModalOpen={setIsDeleteGoalModalOpen}
        selectedGoal={selectedGoal}
        isEditing={isGoalEditing}
        handleAddGoal={handleAddGoal}
        closeGoalModal={closeGoalModal}
        confirmDeleteGoal={confirmDeleteGoal}
      />
      </BlurFade>
    </div>
  )
}

