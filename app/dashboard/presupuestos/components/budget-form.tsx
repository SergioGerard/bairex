"use client"

import { useState, useEffect } from "react"
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
import {
  CalendarIcon,
  Plus,
  Trash2,
  Home,
  Utensils,
  Car,
  ShoppingCart,
  Briefcase,
  Plane,
  Gift,
  Coffee,
  Smartphone,
  CreditCard,
  Tv,
  Zap,
  Droplet,
  Wifi,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Budget, BudgetCategory } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  period: z.enum(["monthly", "quarterly", "annual"], { required_error: "Por favor selecciona un período." }),
  date: z.date({ required_error: "Por favor selecciona una fecha." }),
})

interface BudgetFormProps {
  onAddBudget: (budget: Budget) => void
  onCancel: () => void
  initialData?: Budget | null
  isEditing?: boolean
}

const availableIcons = [
  { name: "Home", icon: Home },
  { name: "Utensils", icon: Utensils },
  { name: "Car", icon: Car },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Briefcase", icon: Briefcase },
  { name: "Plane", icon: Plane },
  { name: "Gift", icon: Gift },
  { name: "Coffee", icon: Coffee },
  { name: "Smartphone", icon: Smartphone },
  { name: "CreditCard", icon: CreditCard },
  { name: "Tv", icon: Tv },
  { name: "Zap", icon: Zap },
  { name: "Droplet", icon: Droplet },
  { name: "Wifi", icon: Wifi },
]

export default function BudgetForm({ onAddBudget, onCancel, initialData, isEditing = false }: BudgetFormProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "Home",
    currentAmount: 0,
    targetAmount: 0,
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      period: initialData?.period || "monthly",
      date: initialData?.date || new Date(),
    },
  })

  // Cargar categorías iniciales si estamos editando
  useEffect(() => {
    if (initialData && initialData.categories) {
      setCategories(initialData.categories)
    }
  }, [initialData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (categories.length === 0) {
      form.setError("root", {
        message: "Debes agregar al menos una categoría al presupuesto.",
      })
      return
    }

    const budget: Budget = {
      id: initialData?.id || uuidv4(),
      name: values.name,
      period: values.period,
      date: values.date,
      categories: categories.map((cat) => ({
        ...cat,
        percentage: Math.min(100, (cat.currentAmount / cat.targetAmount) * 100),
      })),
    }

    onAddBudget(budget)
  }

  const addCategory = () => {
    if (!newCategory.name || newCategory.targetAmount <= 0) {
      return
    }

    const percentage =
      newCategory.targetAmount > 0 ? Math.min(100, (newCategory.currentAmount / newCategory.targetAmount) * 100) : 0

    setCategories([
      ...categories,
      {
        id: uuidv4(),
        name: newCategory.name,
        icon: newCategory.icon,
        currentAmount: newCategory.currentAmount,
        targetAmount: newCategory.targetAmount,
        percentage,
      },
    ])

    setNewCategory({
      name: "",
      icon: "Home",
      currentAmount: 0,
      targetAmount: 0,
    })
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const getIconComponent = (iconName: string) => {
    const found = availableIcons.find((i) => i.name === iconName)
    if (!found) return Home
    return found.icon
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
                <FormLabel>Nombre del Presupuesto</FormLabel>
                <FormControl>
                  <Input placeholder="Presupuesto Mensual, Gastos Q1, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                        setIsCalendarOpen(false)
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Categorías del Presupuesto</h3>

          {categories.length > 0 && (
            <div className="space-y-4">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon)

                return (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              ${category.currentAmount.toLocaleString()} / ${category.targetAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCategory(category.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={category.percentage}
                          className={cn("h-2", category.percentage > 100 ? "[&>div]:bg-red-500" : "")}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Agregar Nueva Categoría</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ej: Alimentación, Transporte, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ícono</label>
                  <Select
                    value={newCategory.icon}
                    onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ícono" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon.name} value={icon.name}>
                          <div className="flex items-center">
                            <icon.icon className="h-4 w-4 mr-2" />
                            <span>{icon.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Monto Actual ($)</label>
                  <Input
                    type="number"
                    value={newCategory.currentAmount || ""}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, currentAmount: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Monto Objetivo ($)</label>
                  <Input
                    type="number"
                    value={newCategory.targetAmount || ""}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, targetAmount: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={addCategory}
                className="mt-4 w-full"
                disabled={!newCategory.name || newCategory.targetAmount <= 0}
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Categoría
              </Button>
            </CardContent>
          </Card>
        </div>

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? "Actualizar" : "Crear"} Presupuesto</Button>
        </div>
      </form>
    </Form>
  )
}