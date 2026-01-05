import { Shield, AlertTriangle, Skull, Bug } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AttackScenario, AttackType } from "@/lib/attackScenarios";

interface AttackScenarioSelectorProps {
  scenarios: AttackScenario[];
  selectedId: AttackType | null;
  onSelect: (id: AttackType) => void;
}

const iconMap = {
  "approval-drain": AlertTriangle,
  "phishing-contract": Bug,
  "impersonation": Shield,
  "honeypot": Skull,
};

export function AttackScenarioSelector({ scenarios, selectedId, onSelect }: AttackScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Select Attack Vector
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scenarios.map((scenario) => {
          const Icon = iconMap[scenario.id];
          const isSelected = selectedId === scenario.id;
          
          return (
            <Card
              key={scenario.id}
              className={cn(
                "cursor-pointer transition-all",
                isSelected && "ring-1 ring-primary"
              )}
              onClick={() => onSelect(scenario.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded",
                      scenario.severity === "critical" && "bg-destructive/10 text-destructive",
                      scenario.severity === "high" && "bg-warning/10 text-warning",
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">{scenario.name}</h3>
                      <p className="text-xs text-muted-foreground">{scenario.category}</p>
                    </div>
                  </div>
                  <Badge
                    variant={scenario.severity === "critical" ? "destructive" : "warning"}
                    className="text-[10px] uppercase"
                  >
                    {scenario.severity}
                  </Badge>
                </div>
                
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {scenario.shortDescription}
                </p>
                
                <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                  <span>{scenario.historicalCases.toLocaleString()} cases</span>
                  <span className="text-destructive">{scenario.totalLost} lost</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
