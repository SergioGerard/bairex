import type { FinancialEntry, ProjectionData, RecurrenceType, InflationRecurrenceType } from "./types"
import { addMonths, differenceInMonths, isAfter, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

// Verificar si la inflación debe aplicarse en este mes según la recurrencia
function shouldApplyInflation(monthsSinceStart: number, inflationRecurrence: InflationRecurrenceType): boolean {
  // No aplicar inflación en el primer mes (retraso de 1 mes)
  if (monthsSinceStart === 0) return false

  switch (inflationRecurrence) {
    case "monthly":
      return true // Aplicar cada mes (después del primer mes)
    case "bimonthly":
      return monthsSinceStart % 2 === 0 && monthsSinceStart > 0
    case "quarterly":
      return monthsSinceStart % 3 === 0 && monthsSinceStart > 0
    case "every4months":
      return monthsSinceStart % 4 === 0 && monthsSinceStart > 0
    case "every5months":
      return monthsSinceStart % 5 === 0 && monthsSinceStart > 0
    case "every6months":
      return monthsSinceStart % 6 === 0 && monthsSinceStart > 0
    case "annual":
      return monthsSinceStart % 12 === 0 && monthsSinceStart > 0
    default:
      return monthsSinceStart > 0 // Aplicar después del primer mes
  }
}

// Verificar si la entrada debe incluirse en este mes según la recurrencia
function shouldIncludeEntry(
  monthIndex: number,
  recurrence: RecurrenceType,
  entryStartDate: Date,
  projectionStartDate: Date,
  installments?: number, // Número de cuotas para recurrence === "installments"
): boolean {
  // Para pagos únicos, verificar si la fecha de la entrada cae dentro del mes actual de la proyección
  if (recurrence === "one-time") {
    const currentMonthDate = addMonths(projectionStartDate, monthIndex)
    const monthStart = startOfMonth(currentMonthDate)
    const monthEnd = endOfMonth(currentMonthDate)

    // Verificar si la fecha de la entrada está dentro del intervalo del mes actual
    return isWithinInterval(entryStartDate, { start: monthStart, end: monthEnd })
  }

  // Para entradas recurrentes, calcular basado en la frecuencia
  const monthsSinceEntryStart = monthIndex - differenceInMonths(entryStartDate, projectionStartDate)

  // Si es negativo, la entrada aún no ha comenzado (excepto para pagos en cuotas)
  if (monthsSinceEntryStart < 0 && recurrence !== "installments") return false

  // Para pagos en cuotas, verificar si estamos dentro del rango de cuotas
  if (recurrence === "installments" && installments) {
    // Calcular el mes exacto en que comienza la entrada (puede ser negativo si es en el pasado)
    const entryStartMonth = differenceInMonths(entryStartDate, projectionStartDate);
    
    // Si el mes actual es anterior al mes de inicio, no incluir
    if (monthIndex < entryStartMonth) {
      return false;
    }
    
    // Calcular cuántas cuotas han pasado desde el mes de inicio
    const quotasPassed = monthIndex - entryStartMonth;
    
    // Incluir este mes si estamos dentro del número de cuotas (0 a installments-1)
    return quotasPassed >= 0 && quotasPassed < installments;
  }

  switch (recurrence) {
    case "daily":
    case "weekly":
    case "monthly":
      return true // Incluir cada mes
    case "bimonthly":
      return monthsSinceEntryStart % 2 === 0
    case "quarterly":
      return monthsSinceEntryStart % 3 === 0
    case "every4months":
      return monthsSinceEntryStart % 4 === 0
    case "every5months":
      return monthsSinceEntryStart % 5 === 0
    case "every6months":
      return monthsSinceEntryStart % 6 === 0
    case "annual":
      return monthsSinceEntryStart % 12 === 0
    default:
      return true
  }
}

// Calcular el monto para una entrada específica en un mes dado
function calculateEntryAmountForMonth(entry: FinancialEntry, monthIndex: number, projectionStartDate: Date): number {
  const currentMonthDate = addMonths(projectionStartDate, monthIndex)
  
  // Manejo especial para pagos en cuotas
  if (entry.recurrence === "installments" && entry.installments && entry.installments > 0) {
    // Calcular el mes exacto en que comienza la entrada
    // Usamos startOfMonth para asegurar que la comparación sea a nivel de mes
    const entryStartDate = startOfMonth(entry.startDate);
    const projectionStartDateMonth = startOfMonth(projectionStartDate);
    const entryStartMonth = differenceInMonths(entryStartDate, projectionStartDateMonth);
    
    // Si el mes actual es anterior al mes de inicio, no incluir
    if (monthIndex < entryStartMonth) {
      return 0;
    }
    
    // Calcular cuántas cuotas han pasado desde el mes de inicio
    const quotasPassed = monthIndex - entryStartMonth;
    
    // Incluir este mes si estamos dentro del número de cuotas
    if (quotasPassed >= 0 && quotasPassed < entry.installments) {
      return entry.amount / entry.installments;
    } else {
      return 0;
    }
  }
  
  // Para otros tipos de recurrencia, continuar con la lógica existente
  // Si la entrada comienza después del último día de este mes, devolver 0
  if (isAfter(entry.startDate, endOfMonth(currentMonthDate))) {
    return 0
  }

  // Verificar si la entrada debe incluirse en este mes según su recurrencia
  if (!shouldIncludeEntry(monthIndex, entry.recurrence, entry.startDate, projectionStartDate, entry.installments)) {
    return 0
  }

  // Calcular monto base según el tipo de entrada
  let baseAmount = 0
  const monthsSinceStart = differenceInMonths(currentMonthDate, entry.startDate)

  switch (entry.recurrence) {
    case "daily":
      // Aproximar días en un mes como 30
      baseAmount = entry.amount * 30
      break
    case "weekly":
      // Aproximar semanas en un mes como 4.33
      baseAmount = entry.amount * 4.33
      break
    case "one-time":
      // Para pagos únicos, simplemente usar el monto tal cual
      baseAmount = entry.amount
      break
    case "installments":
      // Este caso ahora se maneja directamente en la parte superior de la función
      // para asegurar que siempre se incluyan exactamente el número de cuotas especificado
      return 0 // No debería llegar aquí, pero por si acaso
    default:
      baseAmount = entry.amount
      break
  }

  // No aplicar inflación a pagos únicos
  if (entry.recurrence === "one-time") {
    return baseAmount
  }
  
  // Los pagos en cuotas ya se manejan en la parte superior de la función
  // y no deberían llegar a este punto

  // Aplicar ajuste de inflación si se especifica
  if (entry.inflationAdjustmentType) {
    // Para ajustes variables por período
    if (entry.inflationAdjustmentType === "variable" && entry.variableInflation && entry.variableInflation.length > 0) {
      // Calcular el mes relativo desde el inicio del movimiento
      const entryStartMonth = differenceInMonths(startOfMonth(entry.startDate), startOfMonth(projectionStartDate));
      const relativeMonthIndex = monthIndex - entryStartMonth;
      
      // Solo procesar si estamos en o después del mes de inicio
      if (relativeMonthIndex >= 0) {
        // Encontrar el ajuste aplicable para este mes relativo
        // Primero ordenamos los ajustes por mes de forma ascendente
        const sortedAdjustments = [...entry.variableInflation].sort((a, b) => a.month - b.month);
        
        // Buscamos el ajuste que corresponde al mes relativo actual o al último mes anterior con ajuste
        let applicableAmount = entry.amount; // Valor inicial
        
        // Encontrar el ajuste aplicable para este mes relativo
        for (const adjustment of sortedAdjustments) {
          // Si el mes del ajuste es menor o igual al mes relativo actual
          // (sumamos 1 porque los meses en la UI son 1-indexados)
          if (adjustment.month <= relativeMonthIndex + 1) {
            // Reemplazar directamente con el valor del ajuste
            // Este es el monto completo, no un incremento
            applicableAmount = adjustment.value;
          } else {
            // Si encontramos un mes mayor al actual, nos detenemos
            break;
          }
        }
        
        // Usar el monto aplicable como el monto base para este mes
        baseAmount = applicableAmount;
      }
    } else if (entry.inflationAdjustment && entry.inflationAdjustment > 0) {
      // Para inflación regular, verificar si debe aplicarse este mes según la recurrencia
      const inflationRecurrence = entry.inflationRecurrence || "monthly"

      // Contar cuántas veces debería haberse aplicado la inflación
      let inflationApplications = 0
      for (let i = 0; i <= monthsSinceStart; i++) {
        if (shouldApplyInflation(i, inflationRecurrence)) {
          inflationApplications++
        }
      }

      if (inflationApplications > 0) {
        if (entry.inflationAdjustmentType === "percentage") {
          // Aplicar inflación compuesta
          const inflationFactor = Math.pow(1 + entry.inflationAdjustment / 100, inflationApplications)
          baseAmount *= inflationFactor
        } else if (entry.inflationAdjustmentType === "fixed") {
          // Agregar monto fijo por cada aplicación
          baseAmount += entry.inflationAdjustment * inflationApplications
        }
      }
    }
  }

  return baseAmount
}

// Calcular proyecciones para un número específico de meses
export function calculateProjections(entries: FinancialEntry[], numberOfMonths: number): ProjectionData[] {
  const startDate = new Date()
  const projections: ProjectionData[] = []
  let accumulatedBalance = 0

  for (let i = 0; i < numberOfMonths; i++) {
    let monthlyIncome = 0
    let monthlyExpenses = 0

    // Calcular ingresos y gastos para este mes
    entries.forEach((entry) => {
      // Solo considerar entradas activas (si el campo active no existe o es true)
      if (entry.active !== false) {
        const amount = calculateEntryAmountForMonth(entry, i, startDate)

        if (entry.type === "income") {
          monthlyIncome += amount
        } else {
          monthlyExpenses += amount
        }
      }
    })

    // Calcular balance mensual
    const monthlyBalance = monthlyIncome - monthlyExpenses
    accumulatedBalance += monthlyBalance

    // Agregar a proyecciones
    projections.push({
      income: monthlyIncome,
      expenses: monthlyExpenses,
      balance: monthlyBalance,
      accumulatedBalance,
    })
  }

  return projections
}

