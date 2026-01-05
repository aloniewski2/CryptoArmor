import { Play, AlertTriangle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttackScenario } from "@/lib/attackScenarios";
import { useState } from "react";

interface SimulatedTransactionBuilderProps {
  scenario: AttackScenario;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function SimulatedTransactionBuilder({ 
  scenario, 
  onRunSimulation,
  isRunning 
}: SimulatedTransactionBuilderProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const truncateData = (data: string) => {
    if (data.length <= 20) return data;
    return `${data.slice(0, 20)}...${data.slice(-8)}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <span className="text-primary">$</span> Transaction Builder
          </CardTitle>
          <Badge variant="warning" className="text-[10px]">
            <AlertTriangle className="h-2.5 w-2.5 mr-1" />
            Simulated
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-background rounded p-3 font-mono text-xs space-y-2 border border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">to:</span>
            <div className="flex items-center gap-2">
              <code className="text-primary">{truncateAddress(scenario.simulatedTx.to)}</code>
              <button
                onClick={() => copyToClipboard(scenario.simulatedTx.to, "to")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === "to" ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">value:</span>
            <div className="flex items-center gap-2">
              <code className="text-warning">{scenario.simulatedTx.value} ETH</code>
              <button
                onClick={() => copyToClipboard(scenario.simulatedTx.value, "value")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === "value" ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">data:</span>
            <div className="flex items-center gap-2">
              <code className="text-destructive">{truncateData(scenario.simulatedTx.data)}</code>
              <button
                onClick={() => copyToClipboard(scenario.simulatedTx.data, "data")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === "data" ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attack Vector</p>
          <ul className="space-y-1">
            {scenario.attackVector.map((step, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary font-mono">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          onClick={onRunSimulation}
          disabled={isRunning}
          variant="danger"
          className="w-full"
        >
          {isRunning ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Run Through Detection Engine
            </>
          )}
        </Button>
        
        <p className="text-[10px] text-center text-muted-foreground">
          No real transactions will be executed
        </p>
      </CardContent>
    </Card>
  );
}
