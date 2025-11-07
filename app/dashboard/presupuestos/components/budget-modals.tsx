"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/dialog"
import BudgetForm from "./budget-form"
import type { Budget } from "@/lib/types"

interface BudgetModalsProps {
  isBudgetModalOpen: boolean
  setIsBudgetModalOpen: (open: boolean) => void
  isDeleteBudgetModalOpen: boolean
  setIsDeleteBudgetModalOpen: (open: boolean) => void
  selectedBudget: Budget | null
  isEditing: boolean
  handleAddBudget: (budget: Budget) => void
  closeBudgetModal: () => void
  confirmDeleteBudget: () => void
}

export default function BudgetModals({
  isBudgetModalOpen,
  setIsBudgetModalOpen,
  isDeleteBudgetModalOpen,
  setIsDeleteBudgetModalOpen,
  selectedBudget,
  isEditing,
  handleAddBudget,
  closeBudgetModal,
  confirmDeleteBudget,
}: BudgetModalsProps) {
  return (
    <>
      <Dialog open={isBudgetModalOpen} onOpenChange={setIsBudgetModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles del presupuesto seleccionado."
                : "Crea un nuevo presupuesto para gestionar tus finanzas."}
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            onAddBudget={handleAddBudget}
            onCancel={closeBudgetModal}
            initialData={selectedBudget}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteBudgetModalOpen}
        onOpenChange={setIsDeleteBudgetModalOpen}
        title="Eliminar Presupuesto"
        description="¿Estás seguro de que deseas eliminar este presupuesto? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteBudget}
        onCancel={() => setIsDeleteBudgetModalOpen(false)}
      />
    </>
  )
}