"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FinancialEntry, VariableInflation } from "@/lib/types"


// Actualizar el esquema del formulario para incluir las nuevas opciones de recurrencia y tipo de ajuste de inflación
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  amount: z.coerce.number().positive({ message: "El monto debe ser un número positivo." }),
  type: z.enum(["income", "expense"], { required_error: "Por favor selecciona un tipo." }),
  recurrence: z.enum(
    [
      "daily",
      "weekly",
      "monthly",
      "bimonthly",
      "quarterly",
      "every4months",
      "every5months",
      "every6months",
      "annual",
      "one-time",
      "installments",
    ],
    { required_error: "Por favor selecciona una recurrencia." },
  ),
  installments: z.coerce.number().min(2).max(24).optional(),
  inflationAdjustmentType: z.enum(["percentage", "fixed", "variable"]).default("percentage"),
  inflationAdjustment: z.coerce.number().min(0).optional().default(0),
  inflationRecurrence: z
    .enum(["monthly", "bimonthly", "quarterly", "every4months", "every5months", "every6months", "annual"])
    .default("monthly"),
  startDate: z.date({ required_error: "Por favor selecciona una fecha de inicio." }),

})

interface EntryFormProps {
  onAddEntry: (entry: Omit<FinancialEntry, "id">) => void
  onComplete: () => void
  initialData?: FinancialEntry | null
  isEditing?: boolean
}

export default function EntryForm({ onAddEntry, onComplete, initialData, isEditing = false }: EntryFormProps) {
  const [variableInflation, setVariableInflation] = useState<VariableInflation[]>([])  
  const [newMonth, setNewMonth] = useState<number>(1)
  const [newValue, setNewValue] = useState<number>(0)
  const [showInflationFields, setShowInflationFields] = useState(true)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Actualizar los valores predeterminados en el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      amount: initialData?.amount || undefined,
      type: initialData?.type || "income",
      recurrence: initialData?.recurrence || "monthly",
      installments: initialData?.installments || 3,
      inflationAdjustmentType: initialData?.inflationAdjustmentType || "percentage",
      inflationAdjustment: initialData?.inflationAdjustment || undefined,
      inflationRecurrence: initialData?.inflationRecurrence || "monthly",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),

    },
  })

  // Observar cambios en la recurrencia para mostrar/ocultar campos de inflación
  const recurrenceValue = form.watch("recurrence")

  useEffect(() => {
    // Si es un pago único o en cuotas, ocultar campos de inflación
    if (recurrenceValue === "one-time" || recurrenceValue === "installments") {
      setShowInflationFields(false)
    } else {
      setShowInflationFields(true)
    }
  }, [recurrenceValue])



  // Cargar datos de inflación variable si estamos editando
  useEffect(() => {
    if (initialData?.variableInflation && initialData.variableInflation.length > 0) {
      setVariableInflation(initialData.variableInflation)
    }
  }, [initialData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Crear la entrada con todos los valores del formulario (sin ID)
    const entryData: Omit<FinancialEntry, "id"> = {
      name: values.name,
      amount: values.amount,
      type: values.type,
      recurrence: values.recurrence,
      startDate: values.startDate,
      active: initialData?.active !== false, // Mantener el estado activo si estamos editando, o true por defecto
      ...(values.installments && { installments: values.installments })
    }

    // Para pagos únicos o en cuotas, no incluir información de inflación
    if (values.recurrence === "one-time" || values.recurrence === "installments") {
      // No agregar campos de inflación
    }
    // Agregar datos de inflación variable si se selecciona ese tipo
    else if (values.inflationAdjustmentType === "variable" && variableInflation.length > 0) {
      entryData.inflationAdjustmentType = values.inflationAdjustmentType
      entryData.variableInflation = [...variableInflation].sort((a, b) => a.month - b.month)
    }
    // Agregar otros tipos de inflación
    else if (values.inflationAdjustmentType && values.inflationAdjustmentType !== "variable") {
      entryData.inflationAdjustmentType = values.inflationAdjustmentType
      entryData.inflationAdjustment = values.inflationAdjustment
      entryData.inflationRecurrence = values.inflationRecurrence
    }

    onAddEntry(entryData)
    form.reset()
    setVariableInflation([])
    onComplete()
  }

  // Agregar una nueva entrada de inflación variable
  const addVariableInflation = () => {
    if (newMonth > 0 && newValue >= 0) {
      setVariableInflation((prev) => [
        ...prev.filter((item) => item.month !== newMonth), // Eliminar si el mes ya existe
        { month: newMonth, value: newValue },
      ])
      setNewMonth((prev) => prev + 1) // Incrementar por conveniencia
      setNewValue(0)
    }
  }

  // Eliminar una entrada de inflación variable
  const removeVariableInflation = (month: number) => {
    setVariableInflation((prev) => prev.filter((item) => item.month !== month))
  }

  // Obtener la etiqueta para el ajuste de inflación según el tipo
  const getInflationLabel = () => {
    const type = form.watch("inflationAdjustmentType")
    if (type === "percentage") return "Ajuste de Inflación Mensual (%)"
    if (type === "fixed") return "Aumento Fijo Mensual ($)"
    return "" // Para tipo variable, usamos una UI diferente
  }

  // Obtener la descripción para el ajuste de inflación según el tipo
  const getInflationDescription = () => {
    const type = form.watch("inflationAdjustmentType")
    if (type === "percentage") return "Aumento porcentual"
    if (type === "fixed") return "Monto fijo agregado"
    return "" // Para tipo variable, usamos una UI diferente
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
                <FormLabel>Nombre del Movimiento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Salario, Alquiler, Servicios" {...field} />
                </FormControl>
                <FormDescription>Identifica claramente este ingreso o gasto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    value={field.value === 0 || field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormDescription>Cantidad en pesos sin símbolos ni separadores</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Movimiento</FormLabel>
              <FormControl>
                <Tabs
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income">Ingreso</TabsTrigger>
                    <TabsTrigger value="expense">Gasto</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Frecuencia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="one-time">Pago Único</SelectItem>
                    <SelectItem value="installments">Cuotas</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="bimonthly">Cada 2 Meses</SelectItem>
                    <SelectItem value="quarterly">Cada 3 Meses (Trimestral)</SelectItem>
                    <SelectItem value="every4months">Cada 4 Meses</SelectItem>
                    <SelectItem value="every5months">Cada 5 Meses</SelectItem>
                    <SelectItem value="every6months">Cada 6 Meses</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                {field.value === "one-time" && (
                  <FormDescription>
                    Los pagos únicos ocurren solo una vez en la fecha especificada y no se ven afectados por la
                    inflación.
                  </FormDescription>
                )}
                {field.value === "installments" && (
                  <FormDescription>
                    Los pagos en cuotas se dividen en partes iguales y se aplican mensualmente desde la fecha de inicio.
                  </FormDescription>
                )}
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
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elegir una fecha</span>}
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
                        setIsCalendarOpen(false)
                      }}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para seleccionar el número de cuotas cuando se selecciona la frecuencia "installments" */}
          {form.watch("recurrence") === "installments" && (
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Cuotas</FormLabel>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || "3"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar número de cuotas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2">2 cuotas</SelectItem>
                          <SelectItem value="3">3 cuotas</SelectItem>
                          <SelectItem value="4">4 cuotas</SelectItem>
                          <SelectItem value="6">6 cuotas</SelectItem>
                          <SelectItem value="9">9 cuotas</SelectItem>
                          <SelectItem value="12">12 cuotas</SelectItem>
                          <SelectItem value="18">18 cuotas</SelectItem>
                          <SelectItem value="24">24 cuotas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm bg-muted/50 px-3 py-2 rounded-md">
                      Valor por cuota: {formatCurrency(form.watch("amount") && field.value ? form.watch("amount") / field.value : 0)}
                    </div>
                  </div>
                  <FormDescription>El monto total se dividirá en este número de pagos mensuales iguales.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {showInflationFields && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="inflationRecurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia de Ajuste</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia de ajuste" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="bimonthly">Cada 2 Meses</SelectItem>
                        <SelectItem value="quarterly">Cada 3 Meses (Trimestral)</SelectItem>
                        <SelectItem value="every4months">Cada 4 Meses</SelectItem>
                        <SelectItem value="every5months">Cada 5 Meses</SelectItem>
                        <SelectItem value="every6months">Cada 6 Meses</SelectItem>
                        <SelectItem value="annual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>¿Cada cuánto tiempo se aplica el ajuste?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inflationAdjustmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ajuste</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de ajuste" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                        <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                        <SelectItem value="variable">Variable (Por período)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>¿Cómo se calcula el ajuste?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("inflationAdjustmentType") !== "variable" && (
              <FormField
                control={form.control}
                name="inflationAdjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getInflationLabel()}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        {...field}
                        value={field.value === 0 || field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>{getInflationDescription()}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("inflationAdjustmentType") === "variable" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium">Ajustes Variables por Período</h3>
                  <p className="text-sm text-muted-foreground">Define ajustes específicos para diferentes meses</p>
                </div>

                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-medium">Mes</div>
                    <Input
                      type="number"
                      min="1"
                      max="36"
                      placeholder="Número de mes"
                      value={newMonth || ""}
                      onChange={(e) => setNewMonth(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-medium">
                      {form.watch("inflationAdjustmentType") === "percentage" ? "Valor (%)" : "Valor ($)"}
                    </div>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Valor de ajuste"
                      value={newValue || ""}
                      onChange={(e) => setNewValue(Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button type="button" onClick={addVariableInflation} className="mb-0.5">
                    <Plus className="h-4 w-4 mr-1" /> Agregar
                  </Button>
                </div>

                {variableInflation.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mes</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variableInflation
                        .sort((a, b) => a.month - b.month)
                        .map((item) => (
                          <TableRow key={item.month}>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>
                              {formatCurrency(item.value)}
                              {form.watch("inflationAdjustmentType") === "percentage" ? "%" : "$"}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeVariableInflation(item.month)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay ajustes variables agregados. Agrega valores específicos para cada mes según necesites.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Guardar Cambios" : "Agregar Movimiento"}
          </Button>
        </div>
      </form>
    </Form>
  )
}