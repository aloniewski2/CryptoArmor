import { RiskBadge } from "@/components/ui/RiskBadge";
import { RiskScore } from "@/components/ui/RiskScore";
import { AddressDisplay } from "@/components/ui/AddressDisplay";
import { AlertTriangle, Shield, FileWarning, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskAnalysisResult as AnalysisResultType } from "@/lib/blockchainApi";

interface RiskAnalysisResultProps {
  result: AnalysisResultType;
}

export function RiskAnalysisResult({ result }: RiskAnalysisResultProps) {
  const txCount = result.txCount ?? 0;
  const accountAge = result.accountAge ?? "Unknown";
  const riskFactors = result.riskFactors ?? [];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Risk Overview */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <RiskScore score={result.reputationScore} size="lg" />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">Transaction Risk Assessment</h3>
                <RiskBadge level={result.overallRisk} size="sm" />
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                {result.value && parseFloat(result.value) > 0 && (
                  <>Sending <span className="font-mono text-foreground">{result.value} ETH</span> to {" "}</>
                )}
                <AddressDisplay address={result.to} showCopy showExternalLink />
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant={result.contractInfo.isContract ? "warning" : "success"}>
                  {result.contractInfo.isContract ? "Contract" : "EOA (Wallet)"}
                </Badge>
                {result.contractInfo.verified && (
                  <Badge variant="success">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {result.contractInfo.name && (
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {result.contractInfo.name}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Age:</span>
                  <span className="text-foreground">{accountAge}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Transactions:</span>
                  <span className="text-foreground">{txCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-muted-foreground" />
              Risk Factors Identified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {riskFactors.map((factor) => (
              <div
                key={factor.id}
                className={cn(
                  "rounded border p-3 transition-colors",
                  factor.severity === "critical" && "border-destructive/30 bg-destructive/5",
                  factor.severity === "high" && "border-destructive/20 bg-destructive/5",
                  factor.severity === "medium" && "border-warning/20 bg-warning/5",
                  factor.severity === "low" && "border-success/20 bg-success/5"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {factor.category}
                      </span>
                      <RiskBadge level={factor.severity} size="sm" showIcon={false} />
                    </div>
                    <h4 className="font-medium text-sm">{factor.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{factor.description}</p>
                  </div>
                  {factor.score > 0 && (
                    <div className="text-right">
                      <div className="text-lg font-display text-destructive">-{factor.score}</div>
                      <div className="text-[10px] text-muted-foreground">pts</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Risk Factors */}
      {riskFactors.filter(f => f.score > 0).length === 0 && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-success text-sm">No significant risk factors detected</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  On-chain analysis indicates normal activity patterns. Standard security practices apply.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary text-sm">Recommendation</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {result.overallRisk === "low" && "This address appears safe based on on-chain analysis. Standard verification recommended."}
                {result.overallRisk === "medium" && "Proceed with caution. Verify the recipient address and contract interactions carefully."}
                {result.overallRisk === "high" && "High-risk indicators detected. Review all factors before proceeding."}
                {result.overallRisk === "critical" && "Critical risk factors present. Proceeding with this transaction is not recommended."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
