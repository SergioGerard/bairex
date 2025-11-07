"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface PeriodSelectorProps {
  period: "12" | "24" | "36"
  onPeriodChange: (value: "12" | "24" | "36") => void
  className?: string
}

export default function PeriodSelector({ period, onPeriodChange, className }: PeriodSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="text-sm text-muted-foreground hidden lg:block">Período:</span>
      <ToggleGroup 
        type="single" 
        value={period} 
        onValueChange={(value: string) => {
          if (value && (value === "12" || value === "24" || value === "36")) {
            onPeriodChange(value)
          }
        }}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="12" variant="outline">1 Año</ToggleGroupItem>
        <ToggleGroupItem value="24" variant="outline">2 Años</ToggleGroupItem>
        <ToggleGroupItem value="36" variant="outline">3 Años</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}