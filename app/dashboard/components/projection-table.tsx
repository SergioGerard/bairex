"use client"

import { useState } from "react"
import { format, addMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { ProjectionData } from "@/lib/types"

interface ProjectionTableProps {
  projections: ProjectionData[]
}

export default function ProjectionTable({ projections }: ProjectionTableProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 12
  const totalPages = Math.ceil(projections.length / itemsPerPage)

  const startIndex = currentPage * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, projections.length)
  const currentItems = projections.slice(startIndex, endIndex)

  const startDate = new Date()

  return (
    <Card className="w-full max-w-full bg-gradient-to-b
                from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                transition-all duration-300 
                hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
      <CardHeader>
        <CardTitle>Proyección Financiera</CardTitle>
        <CardDescription>Desglose mensual según el período seleccionado</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        {projections.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No hay datos para mostrar. Agrega ingresos y gastos para ver proyecciones.
          </p>
        ) : (
          <>
            <div className="rounded-md border border-border overflow-x-auto w-full max-w-full">
              <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap w-12">Mes</TableHead>
                    <TableHead className="whitespace-nowrap hidden xl:table-cell">Fecha</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ingresos</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Gastos</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Balance</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Acumulado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item, index) => {
                    const actualIndex = startIndex + index
                    const date = addMonths(startDate, actualIndex)

                    return (
                      <TableRow className="border-border" key={actualIndex}>
                        <TableCell className="font-regular text-xs sm:text-sm whitespace-nowrap w-12">{actualIndex + 1}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap hidden xl:table-cell">{format(date, "MMM yyyy", { locale: es })}</TableCell>
                         <TableCell className="text-right text-xs sm:text-sm whitespace-nowrap text-income">${formatCurrency(item.income)}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm whitespace-nowrap text-expense">${formatCurrency(item.expenses)}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm whitespace-nowrap text-income">
                            ${formatCurrency(item.balance)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs sm:text-sm whitespace-nowrap text-income">
                          ${formatCurrency(item.accumulatedBalance)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between sm:justify-end space-x-2 py-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-2 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Página {currentPage + 1} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-2 sm:px-4"
                >
                  <span className="hidden sm:inline mr-1">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}