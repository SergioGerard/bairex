"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NumberTicker } from "@/components/magicui/number-ticker"

interface GoalMetricCardProps {
  title: string
  icon: ReactNode
  iconColor: string
  value: string
  subValue?: string
  subValueLabel?: string
  useNumberTicker?: boolean
  numericValue?: number
  prefix?: string
  suffix?: string
  subNumericValue?: number
  subPrefix?: string
  subSuffix?: string
  useValueColor?: boolean
  useSubValueColor?: boolean
}

export default function GoalMetricCard({
  title,
  icon,
  iconColor,
  value,
  subValue,
  subValueLabel,
  useNumberTicker = false,
  numericValue,
  prefix = "",
  suffix = "",
  subNumericValue,
  subPrefix = "",
  subSuffix = "",
  useValueColor = false,
  useSubValueColor = false,
}: GoalMetricCardProps) {
  return (
    <Card className="bg-gradient-to-b flex flex-col justify-between from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] transition-all duration-300 hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-8 w-8 ${iconColor} mr-4`}>{icon}</div>
            <div>
              {useNumberTicker && numericValue !== undefined ? (
                <NumberTicker
                  value={numericValue}
                  className="text-2xl font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix={prefix}
                  suffix={suffix}
                  useValueColor={useValueColor}
                />
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              <p className="text-sm text-muted-foreground">{title.toLowerCase()}</p>
            </div>
          </div>
          {subValue && (
            <div>
              {useNumberTicker && subNumericValue !== undefined ? (
                <NumberTicker
                  value={subNumericValue}
                  className="text-xl font-bold"
                  delay={0.06}
                  decimalPlaces={0}
                  prefix={subPrefix}
                  suffix={subSuffix}
                  useValueColor={useSubValueColor}
                />
              ) : (
                <p className="text-xl font-bold">{subValue}</p>
              )}
              <p className="text-sm text-muted-foreground text-right">{subValueLabel}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}