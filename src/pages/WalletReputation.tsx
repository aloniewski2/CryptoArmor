import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskScore } from "@/components/ui/RiskScore";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { AddressDisplay } from "@/components/ui/AddressDisplay";
import { getAccountInfo, getTransactionHistory, AccountInfo, Transaction } from "@/lib/blockchainApi";
import { 
  TestnetIndicator, 
  NetworkBadge 
} from "@/components/testnet";
import { 
  analyzeTestnetWallet, 
  TestnetRiskAnalysis 
} from "@/lib/testnet/api";
import { TestnetNetwork } from "@/lib/testnet/networks";
import { validateTestnetAddress } from "@/lib/testnet/validation";
import { Search, Loader2, AlertTriangle, Clock, Activity, TrendingUp, TrendingDown, Wifi, FlaskConical, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface WalletReputation {
  address: string;
  score: number;
  accountInfo: AccountInfo;
  transactions: Transaction[];
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  flags: string[];
  age: string;
}

function calculateReputation(accountInfo: AccountInfo, transactions: Transaction[]): WalletReputation {
  let score = 100;
  const factors: WalletReputation["factors"] = [];
  const flags: string[] = [];

  // Calculate age from first transaction
  let age = "Unknown";
  if (transactions.length > 0) {
    const oldestTx = transactions[transactions.length - 1];
    const firstTxDate = new Date(parseInt(oldestTx.timeStamp) * 1000);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) {
      age = `${daysDiff} days`;
      factors.push({ name: "Wallet Age", impact: -20, description: "Very new wallet (< 1 week)" });
      flags.push("New wallet");
      score -= 20;
    } else if (daysDiff < 30) {
      age = `${daysDiff} days`;
      factors.push({ name: "Wallet Age", impact: -10, description: "New wallet (< 1 month)" });
      score -= 10;
    } else if (daysDiff < 365) {
      age = `${Math.floor(daysDiff / 30)} months`;
      factors.push({ name: "Wallet Age", impact: 5, description: "Established wallet" });
    } else {
      age = `${(daysDiff / 365).toFixed(1)} years`;
      factors.push({ name: "Wallet Age", impact: 15, description: "Long-standing wallet" });
    }
  }

  // Transaction count factor
  if (accountInfo.txCount < 10) {
    factors.push({ name: "Transaction Volume", impact: -15, description: "Very low activity" });
    flags.push("Low transaction count");
    score -= 15;
  } else if (accountInfo.txCount < 50) {
    factors.push({ name: "Transaction Volume", impact: -5, description: "Moderate activity" });
    score -= 5;
  } else if (accountInfo.txCount > 500) {
    factors.push({ name: "Transaction Volume", impact: 10, description: "High activity wallet" });
  } else {
    factors.push({ name: "Transaction Volume", impact: 5, description: "Normal activity level" });
  }

  // Contract interaction check
  if (accountInfo.isContract) {
    if (accountInfo.isVerified) {
      factors.push({ name: "Contract Status", impact: 10, description: "Verified contract code" });
    } else {
      factors.push({ name: "Contract Status", impact: -25, description: "Unverified contract" });
      flags.push("Unverified contract code");
      score -= 25;
    }
  }

  // Check for failed transactions
  if (transactions.length > 0) {
    const failedCount = transactions.filter(tx => tx.isError === "1").length;
    const failRate = failedCount / transactions.length;
    if (failRate > 0.3) {
      factors.push({ name: "Transaction Failures", impact: -15, description: `${Math.round(failRate * 100)}% failure rate` });
      flags.push("High transaction failure rate");
      score -= 15;
    } else if (failRate > 0.1) {
      factors.push({ name: "Transaction Failures", impact: -5, description: `${Math.round(failRate * 100)}% failure rate` });
      score -= 5;
    }
  }

  // Balance check
  const balance = parseFloat(accountInfo.balance);
  if (balance > 10) {
    factors.push({ name: "Balance", impact: 5, description: "Significant ETH holdings" });
  } else if (balance === 0 && !accountInfo.isContract) {
    factors.push({ name: "Balance", impact: -5, description: "Zero balance wallet" });
    score -= 5;
  }

  return {
    address: accountInfo.address,
    score: Math.max(0, Math.min(100, score)),
    accountInfo,
    transactions,
    factors,
    flags,
    age,
  };
}

export default function WalletReputationPage() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reputation, setReputation] = useState<WalletReputation | null>(null);
  const [activeTab, setActiveTab] = useState<"mainnet" | "testnet">("mainnet");
  const [testnetNetwork, setTestnetNetwork] = useState<TestnetNetwork>("ethereum-sepolia");
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);
    setReputation(null);

    try {
      const [accountInfo, transactions] = await Promise.all([
        getAccountInfo(address),
        getTransactionHistory(address).catch(() => []),
      ]);

      const result = calculateReputation(accountInfo, transactions);
      setReputation(result);
      toast({
        title: "Analysis Complete",
        description: "Blockchain data retrieved successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to retrieve wallet data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setAddress("0xE592427A0AEce92De3Edee1F18E0157C05861564");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-display tracking-tight-display">Wallet Reputation</h1>
          <Badge variant="success">
            <Wifi className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Evaluate wallet trustworthiness using Ethereum blockchain data
        </p>
      </div>

      {/* Testnet Callout */}
      <Card className="border-warning/30 bg-warning/5 mb-6 max-w-xl">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium text-warning">Looking for testnet wallets?</p>
                <p className="text-xs text-muted-foreground">
                  Analyze Sepolia, Holesky, and Bitcoin testnet addresses
                </p>
              </div>
            </div>
            <Link to="/testnet">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Server className="h-3.5 w-3.5" />
                Testnet Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Search Form */}
      <div className="max-w-xl mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Enter Ethereum wallet address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono bg-card h-10 pr-24"
            />
            <button
              type="button"
              onClick={loadSample}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Load sample
            </button>
          </div>
          <Button type="submit" className="h-10" disabled={!address || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Analyze
          </Button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="max-w-xl">
          <CardContent className="p-12 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <h3 className="font-medium mb-2">Retrieving Blockchain Data</h3>
            <p className="text-sm text-muted-foreground">
              Querying account info and transaction history...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {reputation && (
        <div className="max-w-4xl space-y-4 animate-fade-in">
          {/* Live Data Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-primary/5 border border-primary/20 w-fit">
            <Wifi className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-primary">
              Live data from Ethereum Mainnet
            </span>
          </div>

          {/* Overview Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <RiskScore score={reputation.score} size="lg" />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-lg font-medium">Wallet Overview</h2>
                    <RiskBadge
                      level={reputation.score >= 70 ? "low" : reputation.score >= 50 ? "medium" : "high"}
                    />
                  </div>
                  <AddressDisplay
                    address={reputation.address}
                    truncate={false}
                    showCopy
                    showExternalLink
                    className="mb-4"
                  />

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{reputation.age}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Transactions:</span>
                      <span className="font-medium">{(reputation.accountInfo.txCount ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant={reputation.accountInfo.isContract ? "warning" : "success"}>
                      {reputation.accountInfo.isContract ? "Smart Contract" : "Wallet (EOA)"}
                    </Badge>
                    {reputation.accountInfo.isVerified && (
                      <Badge variant="success">Verified on Etherscan</Badge>
                    )}
                    {reputation.accountInfo.contractName && (
                      <Badge variant="outline" className="font-mono">
                        {reputation.accountInfo.contractName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Flags */}
          {reputation.flags.length > 0 && (
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning text-sm">Risk indicators detected</h4>
                    <ul className="mt-2 space-y-1">
                      {reputation.flags.map((flag, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-warning" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reputation.factors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded bg-secondary/30"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{factor.name}</div>
                    <div className="text-xs text-muted-foreground">{factor.description}</div>
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
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          {reputation.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reputation.transactions.slice(0, 5).map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded bg-secondary/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {tx.hash.slice(0, 10)}...
                        </span>
                        <Badge variant={tx.isError === "1" ? "destructive" : "success"} className="text-[10px]">
                          {tx.isError === "1" ? "Failed" : "Success"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tx.functionName ? tx.functionName.split("(")[0] : "Transfer"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {(parseFloat(tx.value) / 1e18).toFixed(4)} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
