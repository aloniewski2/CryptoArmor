import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestnetIndicator, 
  NetworkBadge,
  TestnetRiskDisplay 
} from "@/components/testnet";
import { 
  TestnetWalletFixture, 
  getMaliciousFixtures,
  getFixtureById 
} from "@/lib/testnet/fixtures";
import { 
  analyzeTestnetWallet, 
  TestnetRiskAnalysis 
} from "@/lib/testnet/api";
import { AttackScenarioSelector } from "@/components/testing/AttackScenarioSelector";
import { SimulatedTransactionBuilder } from "@/components/testing/SimulatedTransactionBuilder";
import { AttackWalkthrough } from "@/components/testing/AttackWalkthrough";
import { DetectionOutput } from "@/components/testing/DetectionOutput";
import { attackScenarios, AttackType, getScenarioById } from "@/lib/attackScenarios";
import { 
  Shield, 
  FlaskConical, 
  AlertTriangle, 
  Loader2,
  Skull,
  Bug,
  Wallet,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Map attack scenarios to relevant fixtures
const scenarioToFixture: Record<AttackType, string> = {
  "approval-drain": "sepolia-drainer-1",
  "phishing-contract": "sepolia-phishing-1",
  "impersonation": "sepolia-high-risk-1",
  "honeypot": "sepolia-honeypot-1",
};

export default function AttackSimulationTestnet() {
  const [selectedScenario, setSelectedScenario] = useState<AttackType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [testnetAnalysis, setTestnetAnalysis] = useState<TestnetRiskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const scenario = selectedScenario ? getScenarioById(selectedScenario) : null;
  const maliciousFixtures = getMaliciousFixtures();

  const handleSelectScenario = async (id: AttackType) => {
    setSelectedScenario(id);
    setCurrentStep(-1);
    setIsComplete(false);
    setIsRunning(false);
    setTestnetAnalysis(null);

    // Auto-load the corresponding testnet fixture
    const fixtureId = scenarioToFixture[id];
    if (fixtureId) {
      const fixture = getFixtureById(fixtureId);
      if (fixture) {
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeTestnetWallet(fixture.address, fixture.network);
          setTestnetAnalysis(analysis);
        } catch (error) {
          console.error("Failed to analyze fixture:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const handleRunSimulation = () => {
    if (!scenario) return;
    
    setIsRunning(true);
    setCurrentStep(-1);
    setIsComplete(false);
    
    scenario.steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        
        if (index === scenario.steps.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setIsComplete(true);
            toast({
              title: "Simulation Complete",
              description: "All attack phases simulated. Review detection results.",
            });
          }, 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  const handleSelectFixture = async (fixture: TestnetWalletFixture) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTestnetWallet(fixture.address, fixture.network);
      setTestnetAnalysis(analysis);
      toast({
        title: "Fixture Loaded",
        description: `Analyzing ${fixture.label}`,
      });
    } catch (error) {
      console.error("Failed to analyze fixture:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Testnet Banner */}
      <TestnetIndicator variant="banner" />
      
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="warning">
              <FlaskConical className="h-3 w-3 mr-1" />
              Simulation
            </Badge>
            <TestnetIndicator variant="compact" />
            <Badge variant="outline" className="text-[10px] font-mono">
              READ-ONLY
            </Badge>
          </div>
          
          <h1 className="text-2xl font-display tracking-tight-display mb-2">
            Attack Simulation with Testnet Data
          </h1>
          
          <p className="text-sm text-muted-foreground max-w-xl">
            Simulate attack scenarios using real testnet blockchain data. 
            Understand how TxnGuard detects threats in authentic conditions.
          </p>
        </div>
        
        {/* Warning Banner */}
        <Card className="border-warning/30 bg-warning/5 mb-6 max-w-5xl">
          <CardContent className="py-3 px-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Educational Simulation Environment
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All data is from testnets only. Attack simulations are visualizations 
                  of how exploits work—no real transactions are created. For security training purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scenarios" className="space-y-6 max-w-6xl">
          <TabsList>
            <TabsTrigger value="scenarios" className="gap-1.5">
              <Skull className="h-3.5 w-3.5" />
              Attack Scenarios
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="gap-1.5">
              <Bug className="h-3.5 w-3.5" />
              Malicious Fixtures
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="space-y-6">
            {/* Attack Scenario Selector */}
            <AttackScenarioSelector
              scenarios={attackScenarios}
              selectedId={selectedScenario}
              onSelect={handleSelectScenario}
            />
            
            {/* Simulation Panel */}
            {scenario && (
              <div className="space-y-6">
                {/* Linked Testnet Wallet */}
                {testnetAnalysis && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wallet className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Linked Testnet Wallet</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {testnetAnalysis.address.slice(0, 14)}...{testnetAnalysis.address.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <NetworkBadge network={testnetAnalysis.network} />
                          <Badge 
                            variant={testnetAnalysis.riskScore >= 50 ? "warning" : "destructive"}
                            className="font-mono"
                          >
                            Score: {testnetAnalysis.riskScore}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {isAnalyzing && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Loading testnet wallet data...
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <SimulatedTransactionBuilder
                      scenario={scenario}
                      onRunSimulation={handleRunSimulation}
                      isRunning={isRunning}
                    />
                  </div>
                  
                  <div className="lg:col-span-1">
                    <AttackWalkthrough
                      steps={scenario.steps}
                      currentStep={currentStep}
                      isAnimating={isRunning}
                    />
                  </div>
                  
                  <div className="lg:col-span-1">
                    <DetectionOutput
                      scenario={scenario}
                      isComplete={isComplete}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!scenario && (
              <Card className="border-dashed bg-card/30">
                <CardContent className="py-12 text-center">
                  <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Select an Attack Scenario</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from the attack vectors above to begin the simulation with testnet data
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="fixtures" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fixture List */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Malicious Test Fixtures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {maliciousFixtures.map((fixture) => (
                    <button
                      key={fixture.id}
                      onClick={() => handleSelectFixture(fixture)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-all",
                        "hover:border-destructive/50 hover:bg-destructive/5",
                        testnetAnalysis?.address === fixture.address
                          ? "border-destructive bg-destructive/5"
                          : "border-border/50 bg-card/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded bg-destructive/10">
                            <Skull className="h-4 w-4 text-destructive" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{fixture.label}</span>
                              <NetworkBadge network={fixture.network} size="sm" />
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {fixture.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {fixture.simulatedFlags.slice(0, 2).map((flag) => (
                                <Badge 
                                  key={flag} 
                                  variant="outline" 
                                  className="text-[9px] border-destructive/30 text-destructive"
                                >
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant="destructive" 
                          className="text-[10px] font-mono shrink-0"
                        >
                          {fixture.expectedRiskScore}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
              
              {/* Analysis Results */}
              <div className="space-y-4">
                {isAnalyzing && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Analyzing Fixture</h3>
                      <p className="text-sm text-muted-foreground">
                        Fetching testnet data and computing risk score...
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {!isAnalyzing && testnetAnalysis && (
                  <TestnetRiskDisplay analysis={testnetAnalysis} />
                )}
                
                {!isAnalyzing && !testnetAnalysis && (
                  <Card className="border-dashed bg-card/30">
                    <CardContent className="py-16 text-center">
                      <Bug className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Select a Malicious Fixture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on a fixture to analyze its risk profile
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border max-w-5xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p className="text-xs font-mono">
              TxnGuard Attack Simulation • Testnet Only • Educational Mode • v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
