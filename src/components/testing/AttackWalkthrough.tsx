import { User, Zap, ArrowRightLeft, Skull, Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AttackStep } from "@/lib/attackScenarios";

interface AttackWalkthroughProps {
  steps: AttackStep[];
  currentStep: number;
  isAnimating: boolean;
}

const phaseConfig = {
  "user-action": {
    icon: User,
    color: "primary",
  },
  "attacker-trigger": {
    icon: Zap,
    color: "warning",
  },
  "asset-movement": {
    icon: ArrowRightLeft,
    color: "destructive",
  },
  "loss-outcome": {
    icon: Skull,
    color: "destructive",
  },
};

export function AttackWalkthrough({ steps, currentStep, isAnimating }: AttackWalkthroughProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <span className="text-primary">$</span> Attack Timeline
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-4">
            {steps.map((step, index) => {
              const config = phaseConfig[step.phase];
              const Icon = config.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "relative pl-10 transition-opacity duration-300",
                    !isActive && "opacity-30"
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-2 w-4 h-4 rounded-full flex items-center justify-center transition-all",
                      isActive ? `bg-${config.color}/20` : "bg-muted",
                      isCurrent && isAnimating && "ring-2 ring-primary/30"
                    )}
                  >
                    <Icon className={cn(
                      "h-2.5 w-2.5",
                      isActive ? `text-${config.color}` : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div className={cn(
                    "rounded border p-3 transition-colors",
                    isActive ? "border-border bg-card" : "border-transparent bg-muted/20"
                  )}>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-mono mb-2"
                    >
                      Phase {step.id}: {step.phase.replace("-", " ")}
                    </Badge>
                    
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      {step.isDetected && isActive && (
                        <Shield className="h-3.5 w-3.5 text-success flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {step.detectedFlags.length > 0 && isActive && (
                      <div className="space-y-1 mt-3 pt-2 border-t border-border/50">
                        <p className="text-[10px] font-mono uppercase text-success flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Detected:
                        </p>
                        {step.detectedFlags.map((flag, i) => (
                          <div
                            key={i}
                            className="text-[10px] text-success/80 bg-success/5 rounded px-2 py-1 font-mono"
                          >
                            • {flag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
