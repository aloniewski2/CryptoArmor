import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AttackScenarioSelector } from "@/components/testing/AttackScenarioSelector";
import { SimulatedTransactionBuilder } from "@/components/testing/SimulatedTransactionBuilder";
import { AttackWalkthrough } from "@/components/testing/AttackWalkthrough";
import { DetectionOutput } from "@/components/testing/DetectionOutput";
import { attackScenarios, AttackType, getScenarioById } from "@/lib/attackScenarios";
import { Shield, FlaskConical, AlertTriangle, GraduationCap, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TestingMode() {
  const [selectedScenario, setSelectedScenario] = useState<AttackType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = selectedScenario ? getScenarioById(selectedScenario) : null;

  const handleSelectScenario = (id: AttackType) => {
    setSelectedScenario(id);
    setCurrentStep(-1);
    setIsComplete(false);
    setIsRunning(false);
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
          }, 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  useEffect(() => {
    setCurrentStep(-1);
    setIsComplete(false);
  }, [selectedScenario]);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="warning">
            <FlaskConical className="h-3 w-3 mr-1" />
            Simulation
          </Badge>
          <Badge variant="default">
            <GraduationCap className="h-3 w-3 mr-1" />
            Educational
          </Badge>
        </div>
        
        <h1 className="text-2xl font-display tracking-tight-display mb-2">
          Testing & Simulation Mode
        </h1>
        
        <p className="text-sm text-muted-foreground max-w-xl">
          Explore how crypto exploits work in a controlled sandbox. 
          Simulate attack scenarios to understand detection mechanisms.
        </p>
      </div>
      
      {/* Warning Banner */}
      <Card className="border-warning/30 bg-warning/5 mb-6 max-w-4xl">
        <CardContent className="py-3 px-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">
                Controlled Simulation Environment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All transactions are simulated. No real wallet connections, no funds at risk, 
                no blockchain transactions. Designed for security training purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Testnet Wallets Callout */}
      <Card className="border-primary/30 bg-primary/5 mb-6 max-w-4xl">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Use Real Testnet Data</p>
                <p className="text-xs text-muted-foreground">
                  Analyze predefined testnet wallets with real blockchain data
                </p>
              </div>
            </div>
            <Link to="/testnet">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" />
                Testnet Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Attack Scenario Selector */}
      <div className="mb-6 max-w-4xl">
        <AttackScenarioSelector
          scenarios={attackScenarios}
          selectedId={selectedScenario}
          onSelect={handleSelectScenario}
        />
      </div>
      
      {/* Simulation Panel */}
      {scenario && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl">
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
      )}
      
      {/* Empty State */}
      {!scenario && (
        <Card className="border-dashed bg-card/30 max-w-xl">
          <CardContent className="py-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Select an Attack Scenario</h3>
            <p className="text-sm text-muted-foreground">
              Choose from the attack vectors above to begin the simulation
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border max-w-4xl">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4" />
          <p className="text-xs font-mono">
            CryptoArmor Testing Mode • Security Training Only • v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
