"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"

interface BaseFinancialMetricCardProps {
  title: string
  description?: string // Ahora opcional
  value: string | ReactNode // Permite ReactNode para valores complejos
  numericValue: number
  infoDialogId: string
  onInfoClick: (dialogId: string) => (e: React.MouseEvent) => void
  statusText?: string
  trendingText?: string
  children?: ReactNode
  actionButton?: ReactNode
  showActionButton?: boolean
  reverseColorLogic?: boolean // Para casos donde valores negativos son buenos (como en estabilidad de flujo)
  showTrending?: boolean // Controla si mostrar el indicador de tendencia
  useNumberTicker?: boolean // Controla si usar NumberTicker para valores numéricos
  customTrendingLogic?: (value: number) => {
    icon: ReactNode
    text: string
  } // Permite lógica personalizada para el trending
}

export default function BaseFinancialMetricCard({
  title,
  description,
  value,
  numericValue,
  infoDialogId,
  onInfoClick,
  statusText,
  trendingText,
  children,
  actionButton,
  showActionButton = false,
  reverseColorLogic = false,
  showTrending = true,
  useNumberTicker = false,
  customTrendingLogic,
}: BaseFinancialMetricCardProps) {
  // Determinar el color basado en el valor numérico
  const getValueColor = () => {
    if (numericValue === 0) return "text-foreground dark:text-foreground" // Negro/blanco por defecto
    
    if (reverseColorLogic) {
      // Lógica invertida (valores negativos son buenos)
      return numericValue < 0 
        ? "text-income" // Verde
        : "text-expense" // Rojo
    } else {
      // Lógica normal (valores positivos son buenos)
      return numericValue > 0 
        ? "text-income" // Verde
        : "text-expense" // Rojo
    }
  }

  // Determinar el trending (icono y texto)
  const getTrending = () => {
    // Si hay lógica personalizada, usarla
    if (customTrendingLogic) {
      return customTrendingLogic(numericValue)
    }

    // Lógica por defecto
    if (numericValue === 0) {
      return {
        icon: <Minus className="h-3 w-3 text-muted-foreground" />,
        text: trendingText || "Sin datos disponibles"
      }
    }
    
    if (reverseColorLogic) {
      return numericValue < 0 
        ? {
            icon: <TrendingUp className="h-3 w-3 text-green-500" />,
            text: trendingText || "Tendencia positiva"
          }
        : {
            icon: <TrendingDown className="h-3 w-3 text-red-500" />,
            text: trendingText || "Necesita atención"
          }
    } else {
      return numericValue > 0 
        ? {
            icon: <TrendingUp className="h-3 w-3 text-green-500" />,
            text: trendingText || "Tendencia positiva"
          }
        : {
            icon: <TrendingDown className="h-3 w-3 text-red-500" />,
            text: trendingText || "Necesita atención"
          }
    }
  }

  const trending = getTrending()

  return (
    <Card className="bg-gradient-to-b flex flex-col justify-between
                from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                transition-all duration-300 
                hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button variant="ghost" size="icon" onClick={onInfoClick(infoDialogId)}>
            <Info className="h-4 w-4" />
            <span className="sr-only">Información sobre {title.toLowerCase()}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start xl:flex-row flex-col xl:gap-2 xl:items-baseline">
          {typeof value === 'string' ? (
            useNumberTicker ? (
              <NumberTicker 
                value={Math.abs(numericValue)} 
                className={`text-[clamp(14px,2vw,18px)] font-bold ${getValueColor()}`}
                delay={0.06}
                decimalPlaces={0}
                prefix={value.match(/^[^\d]*/)?.[0] || ''}
                suffix={value.match(/[^\d]*$/)?.[0] || ''}
              />
            ) : (
              <div className={`text-[clamp(14px,2vw,18px)] font-bold ${getValueColor()}`}>{value}</div>
            )
          ) : (
            <div className="text-[clamp(14px,2vw,18px)] font-bold">{value}</div>
          )}
          {statusText && <p className="text-xs text-muted-foreground mb-1">{statusText}</p>}  
        </div>
        
        {showActionButton && actionButton && (
          <div className="mt-2">
            {actionButton}
          </div>
        )}
        
        {showTrending && (
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-card border-border border">
              {trending.icon}
            </span>
            <span className="ml-2 text-xs">{trending.text}</span>
          </div>
        )}
        
        {children && <div className="mt-2">{children}</div>}
      </CardContent>
    </Card>
  )
}