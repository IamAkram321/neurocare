import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VitalsCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  footer?: string;
  className?: string;
}

export function VitalsCard({ 
  title, 
  value, 
  unit, 
  status, 
  trend, 
  icon,
  footer,
  className 
}: VitalsCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden border-l-4 shadow-sm transition-all hover:shadow-md",
      status === "normal" && "border-l-primary/50",
      status === "warning" && "border-l-yellow-500",
      status === "critical" && "border-l-destructive animate-pulse-slow bg-destructive/5",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground/50">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn(
            "text-3xl font-bold font-mono tracking-tight",
            status === "critical" && "text-destructive",
            status === "warning" && "text-yellow-600 dark:text-yellow-500",
            status === "normal" && "text-foreground"
          )}>
            {value}
          </div>
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            {trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-red-500" />}
            {trend === "down" && <TrendingDown className="mr-1 h-3 w-3 text-green-500" />}
            {trend === "stable" && <Minus className="mr-1 h-3 w-3 text-muted-foreground" />}
            
            <span className={cn(
              "font-medium",
              trend === "up" && "text-red-500",
              trend === "down" && "text-green-500",
              trend === "stable" && "text-muted-foreground"
            )}>
              {footer || "Stable"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
