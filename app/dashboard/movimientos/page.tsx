"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

// Hooks personalizados
import { useFinancialEntries } from "@/hooks/use-financial-entries";

// Componentes
import EntryForm from "../components/entry-form";
import { formatCurrency } from "@/lib/utils";

// Componentes Skeleton
function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)]">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MovementListSkeleton() {
  return (
    <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="ml-2">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-48 mt-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MovimientosSkeleton() {
  return (
    <div className="mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-md" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header con botones skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div></div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>

        {/* Resumen financiero skeleton */}
        <SummaryCardsSkeleton />

        {/* Lista de movimientos skeleton */}
        <MovementListSkeleton />
      </div>
    </div>
  );
}


export default function MovimientosPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Efecto para controlar la hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Hook personalizado para manejo de movimientos financieros
  const {
    entries,
    addEntry,
    deleteEntry,
    toggleEntryActive,
    prepareEntryForEdit,
    openAddEntryModal,
    closeModal,
    isEditing,
    selectedEntry,
    isModalOpen,
    getTotalIncome,
    getTotalExpenses,
    getNetBalance,
    moveEntryUp,
    moveEntryDown,
  } = useFinancialEntries();
  
  // Efecto para detectar el parámetro openModal en la URL
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openModal') === 'true') {
        // Abrir el modal automáticamente
        openAddEntryModal();
        // Limpiar el parámetro de la URL para evitar que se abra nuevamente al refrescar
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [openAddEntryModal]);

  // Función para formatear la descripción de recurrencia
  const formatRecurrenceDescription = (entry: { recurrence: string; installments?: number; inflationAdjustmentType?: string; inflationAdjustment?: number; inflationRecurrence?: string; startDate?: Date }): string => {
    let recurrenceText = "";

    // Texto de recurrencia
    if (entry.recurrence === "one-time") {
      recurrenceText = "Pago único";
    } else if (entry.recurrence === "installments") {
      recurrenceText = `${entry.installments} cuotas`;
    } else {
      recurrenceText =
        entry.recurrence === "daily"
          ? "Diario"
          : entry.recurrence === "weekly"
          ? "Semanal"
          : entry.recurrence === "monthly"
          ? "Mensual"
          : entry.recurrence === "bimonthly"
          ? "Cada 2 meses"
          : entry.recurrence === "quarterly"
          ? "Cada 3 meses (Trimestral)"
          : entry.recurrence === "every4months"
          ? "Cada 4 meses"
          : entry.recurrence === "every5months"
          ? "Cada 5 meses"
          : entry.recurrence === "every6months"
          ? "Cada 6 meses"
          : entry.recurrence === "annual"
          ? "Anual"
          : entry.recurrence;
    }

    // Texto de inflación (solo para entradas recurrentes que no sean cuotas)
    let inflationText = "";
    if (
      entry.recurrence !== "one-time" &&
      entry.recurrence !== "installments"
    ) {
      if (entry.inflationAdjustmentType === "variable") {
        inflationText = " • Inflación variable";
      } else if (entry.inflationAdjustment) {
        const inflationValue =
          entry.inflationAdjustmentType === "percentage"
            ? `${entry.inflationAdjustment}%`
            : `$${formatCurrency(entry.inflationAdjustment)}`;

        const inflationFrequency =
          entry.inflationRecurrence === "monthly"
            ? "Mensual"
            : entry.inflationRecurrence === "bimonthly"
            ? "Cada 2 meses"
            : entry.inflationRecurrence === "quarterly"
            ? "Trimestral"
            : entry.inflationRecurrence === "every4months"
            ? "Cada 4 meses"
            : entry.inflationRecurrence === "every5months"
            ? "Cada 5 meses"
            : entry.inflationRecurrence === "every6months"
            ? "Cada 6 meses"
            : entry.inflationRecurrence === "annual"
            ? "Anual"
            : entry.inflationRecurrence;

        inflationText = ` • Ajuste por inflación: ${inflationValue} (${inflationFrequency})`;
      } else {
        inflationText = " • Sin ajuste por inflación";
      }
    }

    // Fecha de inicio
    const startDateText = entry.startDate ? ` • Inicia: ${format(entry.startDate, "dd/MM/yyyy")}` : "";

    return `${recurrenceText}${inflationText}${startDateText}`;
  };

  // Mostrar skeleton mientras se hidrata
  if (!isHydrated) {
    return <MovimientosSkeleton />;
  }

  return (
    <div className="mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md p-2 dark:bg-card dark:border-border dark:sidebar-border">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Movimientos</h1>
        </div>
      </div>

      <div className="space-y-4" ref={dashboardRef}>
        {/* Header con botones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              onClick={() => window.location.href = '/dashboard/panel-general'}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Volver al panel</span>
            </Button>
          </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsReorganizing(!isReorganizing)}
            variant="outline"
            size="sm"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {isReorganizing ? "Finalizar" : "Reorganizar"}
          </Button>
          
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            if (open) {
              openAddEntryModal();
            } else {
              closeModal();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Modifica los datos del movimiento financiero"
                    : "Agrega un nuevo ingreso o gasto a tu presupuesto"}
                </DialogDescription>
              </DialogHeader>
              <EntryForm
                onAddEntry={addEntry}
                onComplete={closeModal}
                initialData={selectedEntry}
                isEditing={isEditing}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <BlurFade delay={0.1}>
        {/* Resumen financiero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="bg-gradient-to-b flex flex-col justify-between
                      from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                      dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                      transition-all duration-300 
                      hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                      dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  <NumberTicker 
                    value={getTotalIncome()} 
                    className="text-2xl font-bold text-green-600"
                    delay={0.06}
                    decimalPlaces={0}
                    prefix="$"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Total Ingresos</p>
              </CardContent>
            </Card>
          <Card className="bg-gradient-to-b flex flex-col justify-between
                      from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                      dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                      transition-all duration-300 
                      hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                      dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-red-600">
                  <NumberTicker 
                    value={getTotalExpenses()} 
                    className="text-2xl font-bold text-red-600"
                    delay={0.06}
                    decimalPlaces={0}
                    prefix="$"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Total Gastos</p>
              </CardContent>
            </Card>
          <Card className="bg-gradient-to-b flex flex-col justify-between
                      from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                      dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                      transition-all duration-300 
                      hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                      dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
              <CardContent className="p-6">
                <div className={`text-2xl font-bold ${
                  getNetBalance() >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <NumberTicker 
                    value={Math.abs(getNetBalance())} 
                    className={`text-2xl font-bold ${
                      getNetBalance() >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                    delay={0.06}
                    decimalPlaces={0}
                    prefix={getNetBalance() >= 0 ? '$' : '-$'}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Balance Neto</p>
              </CardContent>
            </Card>
        </div>

        {/* Lista de movimientos */}
        <Card className="bg-gradient-to-b flex flex-col justify-between
                    from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                    dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                    transition-all duration-300 
                    hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                    dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
            <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Movimientos</h3>
            </div>
             
             {entries.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12">
                 <div className="text-center space-y-4">
                   <div className="text-6xl">💰</div>
                   <h3 className="text-xl font-semibold">No hay movimientos</h3>
                   <p className="text-muted-foreground max-w-md">
                     Comienza agregando tu primer ingreso o gasto para gestionar tus finanzas.
                   </p>
                   <Button onClick={openAddEntryModal}>
                     <Plus className="h-4 w-4 mr-2" />
                     Agregar Primer Movimiento
                   </Button>
                 </div>
               </div>
             ) : (
               <div className="space-y-4">
                 {entries.map((entry, index) => (
                   <Card key={entry.id} className="relative bg-gradient-to-b
                             from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                             dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                             transition-all duration-300 
                             hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                             dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
                     <CardContent className="p-4">
                       <div className="flex items-center justify-between gap-4">
                         <div className="flex-1">
                          <div className="flex items-baseline">
                           <div className="flex items-center gap-3">
                             <div className={`w-3 h-3 rounded-full ${
                               entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                             }`} />
                             <h3 className="font-semibold text-sm">{entry.name}</h3>
                           </div>
                           <div className="ml-2">
                             <div className={`text-sm font-medium ${
                               entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                             }`}>
                               {entry.type === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}
                             </div>
                           </div>
                           </div>
                           <p className="text-sm text-muted-foreground">
                             {formatRecurrenceDescription(entry)}
                           </p>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           <Switch
                             checked={entry.active !== false}
                             onCheckedChange={() => toggleEntryActive(entry.id!)}
                           />
                           
                           {isReorganizing && (
                             <div className="flex gap-1">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => moveEntryUp(index)}
                                 disabled={index === 0}
                               >
                                 <ArrowUp className="h-4 w-4" />
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => moveEntryDown(index)}
                                 disabled={index === entries.length - 1}
                               >
                                 <ArrowDown className="h-4 w-4" />
                               </Button>
                             </div>
                           )}
                           
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => prepareEntryForEdit(entry)}
                           >
                             <Pencil className="h-4 w-4" />
                           </Button>
                           
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => deleteEntry(entry.id!)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
             </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  );
}