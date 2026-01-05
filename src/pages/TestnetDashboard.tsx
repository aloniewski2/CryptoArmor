import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestnetIndicator, 
  ReadOnlyIndicator,
  WalletFixtureSelector,
  TestnetWalletInput,
  TestnetRiskDisplay,
  NetworkBadge
} from "@/components/testnet";
import { 
  TestnetWalletFixture, 
  TESTNET_WALLET_FIXTURES 
} from "@/lib/testnet/fixtures";
import { 
  analyzeTestnetWallet, 
  TestnetRiskAnalysis 
} from "@/lib/testnet/api";
import { TestnetNetwork, getAllNetworks } from "@/lib/testnet/networks";
import { 
  Wallet, 
  FlaskConical, 
  Shield, 
  FileText, 
  Loader2,
  Server,
  Lock,
  Skull,
  BookOpen,
  Settings,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TestnetDashboard() {
  const [selectedFixture, setSelectedFixture] = useState<TestnetWalletFixture | null>(null);
  const [analysis, setAnalysis] = useState<TestnetRiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const networks = getAllNetworks();

  const handleFixtureSelect = async (fixture: TestnetWalletFixture) => {
    setSelectedFixture(fixture);
    setIsLoading(true);
    
    try {
      const result = await analyzeTestnetWallet(fixture.address, fixture.network);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${fixture.label}`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomWalletSubmit = async (address: string, network: TestnetNetwork) => {
    setSelectedFixture(null);
    setIsLoading(true);
    
    try {
      const result = await analyzeTestnetWallet(address, network);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Custom wallet analyzed successfully",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Testnet Banner */}
      <TestnetIndicator variant="banner" />
      
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <TestnetIndicator variant="badge" />
            <ReadOnlyIndicator />
          </div>
          
          <h1 className="text-2xl font-display tracking-tight-display mb-2">
            Testnet Wallet Dashboard
          </h1>
          
          <p className="text-sm text-muted-foreground max-w-xl">
            Analyze testnet wallets across Ethereum Sepolia, Holesky, and Bitcoin testnet networks.
            All data is read-only — no signing, no real funds.
          </p>
        </div>
        
        {/* Network Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {networks.map(network => (
            <Card key={network.id} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${network.color}20` }}
                  >
                    <Server className="h-4 w-4" style={{ color: network.color }} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{network.shortName}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {network.symbol}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Link to="/testnet/connection">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Server className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">RPC Connection</h4>
                  <p className="text-xs text-muted-foreground">Test connectivity</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/testnet/simulation">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Skull className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Attack Simulation</h4>
                  <p className="text-xs text-muted-foreground">Test with real data</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/testnet/setup">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Setup Guide</h4>
                  <p className="text-xs text-muted-foreground">Faucets & wallets</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/testnet/compliance">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Settings className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Compliance Docs</h4>
                  <p className="text-xs text-muted-foreground">Security policies</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="fixtures" className="space-y-6">
          <TabsList>
            <TabsTrigger value="fixtures" className="gap-1.5">
              <FlaskConical className="h-3.5 w-3.5" />
              Test Fixtures
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              Custom Wallet
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fixtures" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletFixtureSelector 
                onSelect={handleFixtureSelect}
                selectedId={selectedFixture?.id}
              />
              
              <div className="space-y-4">
                {isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="relative w-12 h-12 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      </div>
                      <h3 className="font-medium mb-2">Analyzing Wallet</h3>
                      <p className="text-sm text-muted-foreground">
                        Fetching testnet blockchain data...
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {!isLoading && analysis && (
                  <TestnetRiskDisplay analysis={analysis} />
                )}
                
                {!isLoading && !analysis && (
                  <Card className="border-dashed bg-card/30">
                    <CardContent className="py-16 text-center">
                      <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Select a Test Wallet</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a fixture from the list to analyze its risk profile
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TestnetWalletInput 
                onSubmit={handleCustomWalletSubmit}
                isLoading={isLoading}
              />
              
              <div className="space-y-4">
                {isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Analyzing Wallet</h3>
                      <p className="text-sm text-muted-foreground">
                        Querying testnet blockchain data...
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {!isLoading && analysis && (
                  <TestnetRiskDisplay analysis={analysis} />
                )}
                
                {!isLoading && !analysis && (
                  <Card className="border-dashed bg-card/30">
                    <CardContent className="py-16 text-center">
                      <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Enter a Testnet Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Paste any testnet wallet address to analyze
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="space-y-6">
            <div className="max-w-3xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Testnet Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    CryptoArmor operates exclusively on testnet networks to ensure user safety during 
                    security training and analysis. This design decision provides several benefits:
                  </p>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground mt-4">
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>No Financial Risk:</strong> Testnet tokens have no monetary value. Users can freely experiment without risking real assets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>Read-Only Analysis:</strong> The platform never requests wallet signatures or initiates transactions. All analysis is passive.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>No Private Keys:</strong> CryptoArmor never generates, stores, or handles private keys in any form.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>Mainnet Blocking:</strong> The system actively rejects mainnet addresses to prevent accidental real-fund exposure.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Supported Networks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {networks.map(network => (
                    <div key={network.id} className="flex items-center justify-between p-3 rounded bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <NetworkBadge network={network.id} size="md" />
                        <div>
                          <div className="font-medium text-sm">{network.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {network.isEVM ? `Chain ID: ${network.chainId}` : "UTXO-based"}
                          </div>
                        </div>
                      </div>
                      <a 
                        href={network.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Explorer →
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Test Fixtures</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    CryptoArmor includes {TESTNET_WALLET_FIXTURES.length} predefined testnet wallet fixtures 
                    for testing and training purposes:
                  </p>
                  <ul className="space-y-1">
                    <li>• <strong>Low-risk wallets:</strong> Clean wallets with normal transaction patterns</li>
                    <li>• <strong>Medium-risk wallets:</strong> Wallets with some unusual indicators</li>
                    <li>• <strong>High-risk wallets:</strong> Wallets showing multiple red flags</li>
                    <li>• <strong>Phishing simulations:</strong> Educational examples of phishing behavior</li>
                    <li>• <strong>Drainer contracts:</strong> Simulated malicious approval drainers</li>
                    <li>• <strong>Honeypot tokens:</strong> Tokens that prevent selling</li>
                  </ul>
                  <p className="pt-2">
                    All fixture data is deterministic and reusable for consistent testing across sessions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border max-w-4xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p className="text-xs font-mono">
              CryptoArmor Testnet Dashboard • Read-Only Mode • No Private Keys
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
