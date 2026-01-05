import { Badge } from "@/components/ui/badge";
import { FlaskConical, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestnetIndicatorProps {
  variant?: "banner" | "badge" | "compact";
  className?: string;
}

export function TestnetIndicator({ 
  variant = "badge",
  className 
}: TestnetIndicatorProps) {
  if (variant === "banner") {
    return (
      <div className={cn(
        "flex items-center justify-center gap-2 py-1.5 px-4",
        "bg-warning/10 border-b border-warning/20",
        "text-warning text-xs font-medium",
        className
      )}>
        <FlaskConical className="h-3.5 w-3.5" />
        <span>TESTNET MODE</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground font-normal">
          No real funds • Read-only analysis • Educational purposes
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Badge 
        variant="warning" 
        className={cn("text-[10px] font-mono", className)}
      >
        TESTNET
      </Badge>
    );
  }

  return (
    <Badge 
      variant="warning" 
      className={cn("gap-1", className)}
    >
      <FlaskConical className="h-3 w-3" />
      TESTNET MODE
    </Badge>
  );
}

interface ReadOnlyIndicatorProps {
  className?: string;
}

export function ReadOnlyIndicator({ className }: ReadOnlyIndicatorProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "border-muted-foreground/30 text-muted-foreground text-[10px] font-mono",
        className
      )}
    >
      READ-ONLY
    </Badge>
  );
}

interface MainnetWarningProps {
  className?: string;
}

export function MainnetWarning({ className }: MainnetWarningProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg",
      "bg-destructive/5 border border-destructive/30",
      className
    )}>
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-destructive text-sm">
          Mainnet Address Detected
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          TxnGuard only supports testnet addresses for safety. Mainnet addresses 
          are blocked to prevent accidental interaction with real funds.
        </p>
      </div>
    </div>
  );
}
