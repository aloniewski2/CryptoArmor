import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const iconVariantClasses = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatCard({ label, value, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-display">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-[10px] font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {Icon && (
            <Icon className={cn("h-4 w-4", iconVariantClasses[variant])} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
