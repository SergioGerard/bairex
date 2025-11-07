"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InfoDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string[]
}

export default function InfoDialog({ isOpen, onClose, title, content }: InfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="font-normal text-sm text-muted-foreground space-y-4">
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}