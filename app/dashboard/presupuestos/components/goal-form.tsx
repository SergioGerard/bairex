"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FinancialGoal } from "@/lib/types"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    status: z.enum(["in-progress", "completed", "at-risk", "long-term"], {
      required_error: "Por favor selecciona un estado.",
    }),
    targetAmount: z.coerce.number().positive({ message: "El monto objetivo debe ser un número positivo." }),
    currentAmount: z.coerce.number().min(0, { message: "El monto actual no puede ser negativo." }),
    startDate: z.date({ required_error: "Por favor selecciona una fecha de inicio." }),
    targetDate: z.date({ required_error: "Por favor selecciona una fecha objetivo." }),
  })
  .refine((data) => data.targetDate > data.startDate, {
    message: "La fecha objetivo debe ser posterior a la fecha de inicio.",
    path: ["targetDate"],
  })

interface GoalFormProps {
  onAddGoal: (goal: FinancialGoal) => void
  onCancel: () => void
  initialData?: FinancialGoal | null
  isEditing?: boolean
}

export default function GoalForm({ onAddGoal, onCancel, initialData, isEditing = false }: GoalFormProps) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isTargetDateOpen, setIsTargetDateOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      status: initialData?.status || "in-progress",
      targetAmount: initialData?.targetAmount || 0,
      currentAmount: initialData?.currentAmount || 0,
      startDate: initialData?.startDate || new Date(),
      targetDate: initialData?.targetDate || new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const goal: FinancialGoal = {
      id: initialData?.id || uuidv4(),
      name: values.name,
      status: values.status,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      startDate: values.startDate,
      targetDate: values.targetDate,
      percentage: Math.min(100, (values.currentAmount / values.targetAmount) * 100),
    }

    onAddGoal(goal)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Objetivo</FormLabel>
                <FormControl>
                  <Input placeholder="Fondo de emergencia, Viaje, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="at-risk">En riesgo</SelectItem>
                    <SelectItem value="long-term">Largo plazo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto Objetivo ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto Actual ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsStartDateOpen(false)
                      }}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha Objetivo</FormLabel>
                <Popover open={isTargetDateOpen} onOpenChange={setIsTargetDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsTargetDateOpen(false)
                      }}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="text-background" type="submit">{isEditing ? "Actualizar" : "Crear"} Objetivo</Button>
        </div>
      </form>
    </Form>
  )
}