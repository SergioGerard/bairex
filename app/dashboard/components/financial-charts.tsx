"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectionData } from "@/lib/types";
import { format, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChartFooter } from "./chart-footer";

// Función para formatear números con K y M
const formatAxisNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface FinancialChartsProps {
  projections: ProjectionData[];
  period?: "12" | "24" | "36";
  onPeriodChange?: (period: "12" | "24" | "36") => void;
}

export default function FinancialCharts({
  projections,
  period = "12",
}: FinancialChartsProps) {
  // Estado local para el período de visualización (solo se usa si no se proporciona desde el padre)
  const [localPeriod] = useState<"12" | "24" | "36">("12");
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl" | "xxl">("xl");

  // Detectar tamaño de pantalla usando los breakpoints de Tailwind
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("sm");
      } else if (width < 768) {
        setScreenSize("md");
      } else if (width < 1024) {
        setScreenSize("lg");
      } else if (width < 1280) {
        setScreenSize("xl");
      } else {
        setScreenSize("xxl");
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Determinar si necesitamos ajustes para pantallas más pequeñas
  const needsAdjustment = screenSize === "sm" || screenSize === "md" || screenSize === "lg";

  // Usar el período proporcionado por props o el estado local
  const activePeriod = period || localPeriod;

  // Nota: handlePeriodChange se eliminó porque no se usa actualmente
  // Si se necesita en el futuro, se puede restaurar para manejar cambios de período

  // Formatear datos para gráficos (optimizado con useMemo)
  const chartData = useMemo(() => {
    return projections.map((item, index) => {
      const date = addMonths(new Date(), index);
      return {
        name: format(date, needsAdjustment ? "MMM yy" : "MMM yyyy", { locale: es }),
        income: item.income,
        expenses: item.expenses,
        balance: item.balance,
        accumulated: item.accumulatedBalance,
      };
    });
  }, [projections, needsAdjustment]);

  // Filtrar datos según el período seleccionado (optimizado con useMemo)
  const displayData = useMemo(() => {
    return chartData.slice(0, Number.parseInt(activePeriod));
  }, [chartData, activePeriod]);

  // Configuración para el gráfico de ingresos vs gastos
  const incomeExpenseConfig = {
    income: {
      label: "Ingresos",
      color: "hsl(var(--chart-3))",
    },
    expenses: {
      label: "Gastos",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  // Configuración para el gráfico de balance
  const balanceConfig = {
    balance: {
      label: "Balance Mensual",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  // Configuración para el gráfico de balance acumulado
  const accumulatedConfig = {
    accumulated: {
      label: "Balance Acumulado",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  // Calcular la tendencia de ingresos vs gastos (optimizado con useMemo)
  const trend = useMemo(() => {
    if (displayData.length < 2) return { percentage: 0, isUp: true };

    const firstMonth = displayData[0];
    const lastMonth = displayData[displayData.length - 1];

    // Prevenir división por cero
    const firstRatio = firstMonth.income > 0 ? firstMonth.expenses / firstMonth.income : firstMonth.expenses > 0 ? 1 : 0;
    const lastRatio = lastMonth.income > 0 ? lastMonth.expenses / lastMonth.income : lastMonth.expenses > 0 ? 1 : 0;

    // Calcular el cambio en la relación gastos/ingresos
    // Un valor positivo significa que la relación mejoró (menos gastos en proporción a ingresos)
    const change = (firstRatio - lastRatio) * 100;

    return {
      percentage: Math.abs(change).toFixed(1),
      isUp: change > 0,
    };
  }, [displayData]);

  // Calcular el intervalo adecuado para las etiquetas del eje X basado en el tamaño de pantalla (optimizado con useMemo)
  const xAxisInterval = useMemo(() => {
    if (needsAdjustment) {
      if (screenSize === "sm") {
        if (displayData.length > 12) return Math.floor(displayData.length / 3);
        return Math.floor(displayData.length / 2);
      } else if (screenSize === "md") {
        if (displayData.length > 24) return Math.floor(displayData.length / 5);
        if (displayData.length > 12) return Math.floor(displayData.length / 4);
        return Math.floor(displayData.length / 3);
      } else { // lg
        if (displayData.length > 24) return Math.floor(displayData.length / 6);
        if (displayData.length > 12) return Math.floor(displayData.length / 4);
        return Math.floor(displayData.length / 3);
      }
    } else {
      return Math.max(0, Math.floor(displayData.length / 12) - 1);
    }
  }, [needsAdjustment, screenSize, displayData.length]);

  // Configuración común para los ejes X
  const getXAxisProps = () => ({
    dataKey: "name",
    tickLine: false,
    tickMargin: needsAdjustment ? 15 : 10,
    axisLine: false,
    tick: { 
      fontSize: needsAdjustment ? 10 : 12,
      angle: needsAdjustment ? -45 : 0,
      textAnchor: needsAdjustment ? "end" : "middle",
      dy: needsAdjustment ? 10 : 0
    },
    interval: xAxisInterval,
    height: needsAdjustment ? 60 : 30
  });



  return (
    <Card className="bg-gradient-to-b flex flex-col justify-between
                from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                transition-all duration-300 
                hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
      <CardHeader>
        <div>
          <CardTitle>Gráficos Financieros</CardTitle>
          <CardDescription>
            Visualiza tus proyecciones financieras
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {projections.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No hay datos para mostrar. Agrega ingresos y gastos para ver
            gráficos.
          </p>
        ) : (
          <Tabs defaultValue="balance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="balance">Mensual</TabsTrigger>
              <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="income-expense">
                Flujo
              </TabsTrigger>
              <TabsTrigger className="text-[clamp(12px,2vw,14px)]" value="accumulated">Acumulado</TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="pt-6">
              <ChartContainer config={balanceConfig} className="h-[261px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={displayData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis {...getXAxisProps()} />
                  <YAxis
                    tickFormatter={formatAxisNumber}
                    width={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <defs>
                    <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Balance Mensual"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    fill="url(#fillBalance)"
                    dot={false}
                    activeDot={{ r: 6, style: { fill: "hsl(var(--chart-4))" } }}
                  />
                </AreaChart>
              </ChartContainer>
              <ChartFooter displayData={displayData} type="trend" trend={trend} />
            </TabsContent>

            <TabsContent value="income-expense" className="pt-6">
              <ChartContainer config={incomeExpenseConfig} className="h-[261px] w-full">
                <BarChart
                  accessibilityLayer
                  data={displayData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis {...getXAxisProps()} />
                  <YAxis
                    tickFormatter={formatAxisNumber}
                    width={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="income" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <ChartFooter displayData={displayData} type="balance" />
            </TabsContent>

            <TabsContent value="accumulated" className="pt-6">
              <ChartContainer config={accumulatedConfig} className="h-[261px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={displayData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis {...getXAxisProps()} />
                  <YAxis
                    tickFormatter={formatAxisNumber}
                    width={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <defs>
                    <linearGradient id="fillAccumulated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="accumulated"
                    name="Balance Acumulado"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    fill="url(#fillAccumulated)"
                    dot={false}
                    activeDot={{ r: 6, style: { fill: "hsl(var(--chart-4))" } }}
                  />
                </AreaChart>
              </ChartContainer>
              <ChartFooter displayData={displayData} type="accumulated" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
