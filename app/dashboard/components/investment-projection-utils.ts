import { formatCurrency } from "@/lib/utils";
import type { ProjectionData } from "@/lib/types";

/**
 * Calcula el porcentaje de potencial de inversión considerando un fondo de emergencia de 6 meses
 * @param filteredProjections - Proyecciones financieras filtradas
 * @returns Porcentaje de potencial de inversión
 */
export const calculatePotencialInversion = (filteredProjections: ProjectionData[]): number => {
  if (filteredProjections.length === 0) return 0;
  
  const lastProjection = filteredProjections[filteredProjections.length - 1];
  const finalBalance = lastProjection.accumulatedBalance || 0;
  const avgMonthlyExpenses = filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length;
  const emergencyFund = avgMonthlyExpenses * 6;
  
  const availableForInvestment = Math.max(0, finalBalance - emergencyFund);
  const investmentPercentage = finalBalance > 0 ? (availableForInvestment / finalBalance) * 100 : 0;
  
  return investmentPercentage;
};

/**
 * Calcula el texto de estado para el potencial de inversión
 * @param filteredProjections - Proyecciones financieras filtradas
 * @returns Texto de estado para el potencial de inversión
 */
export const calculatePotencialInversionStatus = (filteredProjections: ProjectionData[]): string => {
  if (filteredProjections.length === 0) return "";
  
  const lastProjection = filteredProjections[filteredProjections.length - 1];
  const finalBalance = lastProjection.accumulatedBalance || 0;
  const avgMonthlyExpenses = filteredProjections.reduce((sum, month) => sum + month.expenses, 0) / filteredProjections.length;
  const emergencyFund = avgMonthlyExpenses * 6;
  
  const availableForInvestment = Math.max(0, finalBalance - emergencyFund);
  
  return availableForInvestment > 0
    ? `$${formatCurrency(availableForInvestment)} disponibles`
    : "Primero completa tu fondo de emergencia";
};

/**
 * Calcula el porcentaje de potencial de inversión completo (sin considerar fondo de emergencia)
 * @param filteredProjections - Proyecciones financieras filtradas
 * @returns Porcentaje de potencial de inversión completo
 */
export const calculatePotencialInversionCompleto = (filteredProjections: ProjectionData[]): number => {
  if (filteredProjections.length === 0) return 0;
  
  const lastProjection = filteredProjections[filteredProjections.length - 1];
  const finalBalance = lastProjection.accumulatedBalance || 0;
  
  return finalBalance > 0 ? 100 : 0;
};

/**
 * Calcula el texto de estado para el potencial de inversión completo
 * @param filteredProjections - Proyecciones financieras filtradas
 * @returns Texto de estado para el potencial de inversión completo
 */
export const calculatePotencialInversionCompletoStatus = (filteredProjections: ProjectionData[]): string => {
  if (filteredProjections.length === 0) return "";
  
  const lastProjection = filteredProjections[filteredProjections.length - 1];
  const finalBalance = lastProjection.accumulatedBalance || 0;
  
  return finalBalance > 0
    ? `$${formatCurrency(finalBalance)} disponibles`
    : "No hay fondos disponibles";
};