"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/dialog"
import GoalForm from "./goal-form"
import type { FinancialGoal } from "@/lib/types"

interface GoalModalsProps {
  isGoalModalOpen: boolean
  setIsGoalModalOpen: (open: boolean) => void
  isDeleteGoalModalOpen: boolean
  setIsDeleteGoalModalOpen: (open: boolean) => void
  selectedGoal: FinancialGoal | null
  isEditing: boolean
  handleAddGoal: (goal: FinancialGoal) => void
  closeGoalModal: () => void
  confirmDeleteGoal: () => void
}

export default function GoalModals({
  isGoalModalOpen,
  setIsGoalModalOpen,
  isDeleteGoalModalOpen,
  setIsDeleteGoalModalOpen,
  selectedGoal,
  isEditing,
  handleAddGoal,
  closeGoalModal,
  confirmDeleteGoal,
}: GoalModalsProps) {
  return (
    <>
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Objetivo" : "Nuevo Objetivo"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles del objetivo financiero seleccionado."
                : "Crea un nuevo objetivo financiero para planificar tu futuro."}
            </DialogDescription>
          </DialogHeader>
          <GoalForm
            onAddGoal={handleAddGoal}
            onCancel={closeGoalModal}
            initialData={selectedGoal}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteGoalModalOpen}
        onOpenChange={setIsDeleteGoalModalOpen}
        title="Eliminar Objetivo"
        description="¿Estás seguro de que deseas eliminar este objetivo financiero? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteGoal}
        onCancel={() => setIsDeleteGoalModalOpen(false)}
      />
    </>
  )
}