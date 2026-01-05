import { Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, History, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AttackScenario, RiskLevel } from "@/lib/attackScenarios";

interface DetectionOutputProps {
  scenario: AttackScenario;
  isComplete: boolean;
}

const riskConfig: Record<RiskLevel, { label: string; variant: "success" | "warning" | "destructive" }> = {
  low: { label: "LOW RISK", variant: "success" },
  medium: { label: "MEDIUM RISK", variant: "warning" },
  high: { label: "HIGH RISK", variant: "destructive" },
  critical: { label: "CRITICAL RISK", variant: "destructive" },
};

export function DetectionOutput({ scenario, isComplete }: DetectionOutputProps) {
  const config = riskConfig[scenario.severity];
  
  return (
    <div className="space-y-4">
      <Card className={cn(
        "transition-colors",
        isComplete && "border-destructive/30"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className={cn("h-4 w-4", isComplete ? "text-destructive" : "text-muted-foreground")} />
            Detection Summary
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Risk Score</p>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-3xl font-display",
                  isComplete ? "text-destructive" : "text-muted-foreground"
                )}>
                  {isComplete ? scenario.riskScore : "--"}
                </span>
                <span className="text-muted-foreground text-sm">/100</span>
              </div>
            </div>
            
            {isComplete && (
              <Badge variant={config.variant} className="text-xs uppercase">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            )}
          </div>
          
          <Progress 
            value={isComplete ? scenario.riskScore : 0} 
            className={cn(
              "h-1.5",
              isComplete && "[&>div]:bg-destructive"
            )}
          />
          
          {isComplete && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Historical Cases</p>
                  <p className="font-mono text-sm">{scenario.historicalCases.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-destructive" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Lost</p>
                  <p className="font-mono text-sm text-destructive">{scenario.totalLost}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-primary" />
            Detection Signals
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isComplete ? (
            <ul className="space-y-2">
              {scenario.detectionSignals.map((signal, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{signal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <XCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Run simulation to see detection signals</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isComplete && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Summary</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {scenario.fullDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
