import { useState } from "react";
import { TransactionInput } from "@/components/scanner/TransactionInput";
import { RiskAnalysisResult } from "@/components/scanner/RiskAnalysisResult";
import { analyzeTransaction, RiskAnalysisResult as AnalysisResultType } from "@/lib/blockchainApi";
import { Shield, Wifi, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Scanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (data: { to: string; value: string; data: string }) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeTransaction(data.to, data.value, data.data);
      setAnalysisResult(result);
      setIsLiveData(true);
      toast({
        title: "Analysis Complete",
        description: "Blockchain data retrieved successfully",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setIsLiveData(false);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to retrieve blockchain data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-display tracking-tight-display">Transaction Risk Scanner</h1>
          <Badge variant="success">
            <Wifi className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyze transaction parameters using Ethereum blockchain data
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        {/* Input Section */}
        <div className="space-y-4">
          <TransactionInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Info Card */}
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-2">Analysis Scope</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Contract verification status</li>
                    <li>• Transaction count and account activity</li>
                    <li>• Account balance and age analysis</li>
                    <li>• Transaction failure rate detection</li>
                    <li>• Token approval pattern analysis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {!analysisResult && !isLoading && (
            <Card className="border-dashed bg-card/30">
              <CardContent className="p-12 text-center">
                <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Enter an Ethereum address to begin analysis
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <h3 className="font-medium mb-2">Retrieving Blockchain Data</h3>
                <p className="text-sm text-muted-foreground">
                  Querying account info, transactions, and contract data...
                </p>
              </CardContent>
            </Card>
          )}

          {analysisResult && (
            <div className="space-y-4">
              {isLiveData && (
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-primary/5 border border-primary/20">
                  <Wifi className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-primary">
                    Live data from Ethereum Mainnet
                  </span>
                </div>
              )}
              <RiskAnalysisResult result={analysisResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
