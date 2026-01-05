import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon } from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig = {
  low: {
    label: "Low Risk",
    icon: CheckCircle,
    classes: "border-success/40 text-success",
  },
  medium: {
    label: "Medium Risk",
    icon: AlertTriangle,
    classes: "border-warning/40 text-warning",
  },
  high: {
    label: "High Risk",
    icon: XCircle,
    classes: "border-destructive/40 text-destructive",
  },
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    classes: "border-destructive/50 text-destructive",
  },
};

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[10px] gap-1",
  md: "px-2 py-0.5 text-xs gap-1",
  lg: "px-2.5 py-1 text-sm gap-1.5",
};

export function RiskBadge({ level, showIcon = true, size = "md", className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded bg-transparent",
        config.classes,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3")} />}
      {config.label}
    </span>
  );
}
