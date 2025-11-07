import { TrendingUp, TrendingDown } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  income: number;
  expenses: number;
  balance: number;
  accumulated: number;
}

interface ChartFooterProps {
  displayData: ChartDataItem[];
  type: "trend" | "balance" | "accumulated";
  trend?: { percentage: string | number; isUp: boolean };
}

export function ChartFooter({ displayData, type, trend }: ChartFooterProps) {
  if (displayData.length === 0) return null;

  const firstData = displayData[0];
  const lastData = displayData[displayData.length - 1];
  const dateRange = `${firstData?.name} - ${lastData?.name}`;

  const renderContent = () => {
    switch (type) {
      case "trend":
        return (
          <div className="flex items-center gap-2 font-medium">
            {trend?.isUp ? (
              <>Tendencia positiva {trend.percentage}% <TrendingUp className="h-4 w-4" /></>
            ) : (
              <>Tendencia negativa {trend?.percentage}% <TrendingDown className="h-4 w-4" /></>
            )}
          </div>
        );
      
      case "balance":
        const isPositive = lastData?.income > lastData?.expenses;
        const difference = Math.abs((lastData?.income || 0) - (lastData?.expenses || 0));
        return (
          <div className="flex items-center gap-2 font-medium">
            {isPositive ? (
              <>Superávit ${formatCurrency(difference)} <TrendingUp className="h-4 w-4" /></>
            ) : (
              <>Déficit ${formatCurrency(difference)} <TrendingDown className="h-4 w-4" /></>
            )}
          </div>
        );
      
      case "accumulated":
        const accumulated = lastData?.accumulated || 0;
        const isAccumulatedPositive = accumulated > 0;
        return (
          <div className="flex items-center gap-2 font-medium">
            {isAccumulatedPositive ? (
              <>Balance positivo ${formatCurrency(accumulated)} <TrendingUp className="h-4 w-4" /></>
            ) : (
              <>Balance negativo ${formatCurrency(Math.abs(accumulated))} <TrendingDown className="h-4 w-4" /></>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <CardFooter className="mt-4 text-sm">
      {renderContent()}
      <div className="text-muted-foreground">{dateRange}</div>
    </CardFooter>
  );
}