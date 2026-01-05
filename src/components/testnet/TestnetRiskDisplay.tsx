import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NetworkBadge } from "./NetworkBadge";
import { TestnetRiskAnalysis } from "@/lib/testnet/api";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  AlertTriangle, 
  Skull, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  FlaskConical,
  Clock,
  Activity
} from "lucide-react";
import { getNetworkConfig } from "@/lib/testnet/networks";

interface TestnetRiskDisplayProps {
  analysis: TestnetRiskAnalysis;
  className?: string;
}

export function TestnetRiskDisplay({ analysis, className }: TestnetRiskDisplayProps) {
  const networkConfig = getNetworkConfig(analysis.network);
  
  const riskConfig = {
    low: { color: "text-success", bg: "bg-success", icon: Shield },
    medium: { color: "text-warning", bg: "bg-warning", icon: AlertTriangle },
    high: { color: "text-destructive", bg: "bg-destructive", icon: AlertTriangle },
    critical: { color: "text-destructive", bg: "bg-destructive", icon: Skull },
  };
  
  const config = riskConfig[analysis.overallRisk];
  const RiskIcon = config.icon;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-lg",
                analysis.overallRisk === "low" && "bg-success/10",
                analysis.overallRisk === "medium" && "bg-warning/10",
                ["high", "critical"].includes(analysis.overallRisk) && "bg-destructive/10"
              )}>
                <RiskIcon className={cn("h-6 w-6", config.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium">Risk Analysis</h3>
                  {analysis.isSimulated && (
                    <Badge variant="warning" className="text-[10px]">
                      <FlaskConical className="h-2.5 w-2.5 mr-1" />
                      Simulated
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <NetworkBadge network={analysis.network} />
                  <span className="text-xs text-muted-foreground font-mono">
                    {analysis.address.slice(0, 10)}...{analysis.address.slice(-6)}
                  </span>
                  <a 
                    href={`${networkConfig.explorerUrl}/address/${analysis.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn("text-3xl font-mono font-bold", config.color)}>
                {analysis.riskScore}
              </div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
          </div>
          
          {/* Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-destructive">Critical</span>
              <span className="text-warning">Medium</span>
              <span className="text-success">Low Risk</span>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn("absolute left-0 top-0 h-full rounded-full transition-all", config.bg)}
                style={{ width: `${analysis.riskScore}%` }}
              />
            </div>
          </div>
          
          {/* Account Info */}
          {analysis.accountInfo && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Transactions:</span>
                <span className="font-mono">{analysis.accountInfo.txCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-mono">{analysis.accountInfo.balance} {networkConfig.symbol}</span>
              </div>
              {analysis.accountInfo.isContract && (
                <Badge variant={analysis.accountInfo.isVerified ? "success" : "destructive"}>
                  {analysis.accountInfo.isVerified ? "Verified Contract" : "Unverified Contract"}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Risk Flags */}
      {analysis.flags.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive text-sm">Risk indicators detected</h4>
                <ul className="mt-2 space-y-1">
                  {analysis.flags.map((flag, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-destructive" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Risk Factors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Risk Factor Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.factors.map((factor, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded bg-secondary/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{factor.name}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px]",
                      factor.severity === "low" && "border-success/50 text-success",
                      factor.severity === "medium" && "border-warning/50 text-warning",
                      ["high", "critical"].includes(factor.severity) && "border-destructive/50 text-destructive"
                    )}
                  >
                    {factor.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {factor.description}
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 font-medium font-mono text-sm",
                  factor.impact >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {factor.impact >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {factor.impact >= 0 ? "+" : ""}
                {factor.impact}
              </div>
            </div>
          ))}
          
          {analysis.factors.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No specific risk factors identified
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Fixture Info (if simulated) */}
      {analysis.fixture && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning text-sm">Simulated Fixture Data</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  This is a predefined test wallet for educational purposes. 
                  Risk scores and flags are simulated based on the fixture configuration.
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {analysis.fixture.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
