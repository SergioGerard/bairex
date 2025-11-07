"use client";

import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Plus } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";

// Custom components
import PeriodSelector from "../components/period-selector";
import {
  IngresosGastosCard,
  AhorroTotalCard,
  EficienciaGastosCard,
  PotencialInversionCard,
  TendenciaBalanceCard,
  EstabilidadFlujoCard,
  IndiceLiquidezCard
} from "../components/cards";

// Hooks personalizados
import { useFinancialEntries } from "@/hooks/use-financial-entries";

// Componentes
import ProjectionTable from "../components/projection-table";

// Lazy loading para componentes pesados
const FinancialCharts = lazy(() => import("../components/financial-charts"));

// Componente de loading para gráficos
const ChartsLoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-96 w-full rounded-lg" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

// Skeleton para las cards principales
const MainCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

// Skeleton para métricas adicionales
const AdditionalMetricsSkeleton = () => (
  <div className="flex flex-col gap-4 h-full">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);

// Skeleton completo del panel
const PanelGeneralSkeleton = () => (
  <div className="mx-auto p-4">
    {/* Header skeleton */}
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>

    {/* Tabs y controles skeleton */}
    <div className="flex justify-between mlg:items-center mlg:flex-row flex-col items-start gap-4 mb-6">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
    </div>

    {/* Cards principales skeleton */}
    <MainCardsSkeleton />

    {/* Layout de gráficos y métricas skeleton */}
    <div className="mt-4">
      <div className="grid grid-cols-1 xxl:grid-cols-4 gap-4">
        {/* Gráficos skeleton */}
        <div className="xxl:col-span-3">
          <ChartsLoadingSkeleton />
        </div>
        {/* Métricas adicionales skeleton */}
        <div className="hidden xxl:block xxl:col-span-1">
          <AdditionalMetricsSkeleton />
        </div>
      </div>
    </div>
  </div>
);

export default function PanelGeneralPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false);

  // Estado para el período de visualización (compartido con los gráficos)
  const [period, setPeriod] = useState<"12" | "24" | "36">("12");

  // Efecto para marcar como hidratado después del primer render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar período guardado del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPeriod = localStorage.getItem('dashboard_period')
      if (savedPeriod && (savedPeriod === '12' || savedPeriod === '24' || savedPeriod === '36')) {
        setPeriod(savedPeriod)
      }
    }
  }, [])

  // Guardar período en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_period', period)
    }
  }, [period])

  // Hook personalizado para manejo de movimientos financieros
  const {
    projections,
  } = useFinancialEntries();



  // Filtrar proyecciones según el período seleccionado
  const filteredProjections = projections.slice(0, parseInt(period));

  // Mostrar skeleton mientras no esté hidratado
  if (!isHydrated) {
    return <PanelGeneralSkeleton />;
  }

  return (
    <div className="mx-auto p-4">
      <BlurFade delay={0.1}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-card border border-border rounded-md p-2 dark:bg-card dark:border-border dark:sidebar-border">
              <LineChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Panel General</h1>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div id="dashboard-content" ref={dashboardRef}>
          <div>
            {/* Tabs internos para Estadísticas y Proyección */}
            <Tabs defaultValue="estadisticas">
            <div className="flex justify-between mlg:items-center mlg:flex-row flex-col items-start gap-4">
              <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-accent p-1 text-muted-foreground w-fit">
                <TabsTrigger value="estadisticas" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">Estadísticas</TabsTrigger>
                <TabsTrigger value="proyeccion" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">Proyección</TabsTrigger>
              </TabsList>
              
              {/* Selector de período y botón nuevo movimiento */}
              <div className="self-end flex items-center gap-3">
                <PeriodSelector period={period} onPeriodChange={setPeriod} />
                <Button 
                  onClick={() => {
                    // Navegar a movimientos y abrir modal
                    window.location.href = '/dashboard/movimientos?openModal=true';
                  }}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Nuevo Movimiento</span>
                </Button>
              </div>
            </div>

            <TabsContent value="estadisticas">
              {/* Cards principales: 4 métricas en grid responsivo */}
              <BlurFade delay={0.3}>
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <IngresosGastosCard 
                      filteredProjections={filteredProjections}
                    />
                    <AhorroTotalCard 
                      filteredProjections={filteredProjections}
                    />
                    <EficienciaGastosCard 
                      filteredProjections={filteredProjections}
                    />
                    <PotencialInversionCard 
                      filteredProjections={filteredProjections}
                    />
                  </div>
                </div>
              </BlurFade>

              {/* Layout responsivo: gráficos y métricas adicionales */}
              <BlurFade delay={0.7}>
                <div className="mt-4">
                  {/* Layout original para pantallas xxl y mayores */}
                  <div className="grid grid-cols-1 xxl:grid-cols-4 gap-4">
                    {/* Gráficos financieros */}
                    <div className="xxl:col-span-3 financial-charts">
                      <Suspense fallback={<ChartsLoadingSkeleton />}>
                        <FinancialCharts
                          projections={projections}
                          period={period}
                          onPeriodChange={setPeriod}
                        />
                      </Suspense>
                    </div>

                    {/* Métricas adicionales solo visibles en xxl+ */}
                    <div className="hidden xxl:block xxl:col-span-1 additional-metrics">
                      <div className="flex flex-col gap-4 h-full">
                        <TendenciaBalanceCard 
                          filteredProjections={filteredProjections}
                        />
                        <EstabilidadFlujoCard 
                          filteredProjections={filteredProjections}
                        />
                        <IndiceLiquidezCard 
                          filteredProjections={filteredProjections}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </TabsContent>

            <TabsContent value="proyeccion">
              {/* Tabla de proyecciones */}
              <BlurFade delay={0.3}>
                <div className="mt-4 w-full">
                  <ProjectionTable projections={filteredProjections} />
                </div>
              </BlurFade>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </BlurFade>
    </div>
  );
}