import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NetworkBadge } from "./NetworkBadge";
import { MainnetWarning } from "./TestnetIndicator";
import { TestnetNetwork, getAllNetworks, getEVMNetworks, getBitcoinNetworks } from "@/lib/testnet/networks";
import { validateTestnetAddress, AddressValidationResult } from "@/lib/testnet/validation";
import { cn } from "@/lib/utils";
import { Plus, Check, AlertTriangle, X } from "lucide-react";

interface TestnetWalletInputProps {
  onSubmit: (address: string, network: TestnetNetwork) => void;
  isLoading?: boolean;
  className?: string;
}

export function TestnetWalletInput({ 
  onSubmit, 
  isLoading,
  className 
}: TestnetWalletInputProps) {
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<TestnetNetwork>("ethereum-sepolia");
  const [validation, setValidation] = useState<AddressValidationResult | null>(null);
  
  const evmNetworks = getEVMNetworks();
  const btcNetworks = getBitcoinNetworks();
  
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 10) {
      const result = validateTestnetAddress(value, selectedNetwork);
      setValidation(result);
      
      // Auto-detect network for Bitcoin (only if it's a valid testnet network)
      if (result.isValid && result.network && result.network !== "mainnet" && result.network !== selectedNetwork) {
        setSelectedNetwork(result.network);
      }
    } else {
      setValidation(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validation?.isValid && address) {
      onSubmit(address, selectedNetwork);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Testnet Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Network Selection */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Network</label>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-muted-foreground self-center mr-1">EVM:</span>
            {evmNetworks.map(network => (
              <Button
                key={network.id}
                type="button"
                variant={selectedNetwork === network.id ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedNetwork(network.id)}
              >
                {network.shortName}
              </Button>
            ))}
            <span className="text-[10px] text-muted-foreground self-center mx-1">BTC:</span>
            {btcNetworks.map(network => (
              <Button
                key={network.id}
                type="button"
                variant={selectedNetwork === network.id ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedNetwork(network.id)}
              >
                {network.shortName}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Address Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Wallet Address</label>
            <div className="relative">
              <Input
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder={selectedNetwork.startsWith("bitcoin") 
                  ? "Enter Bitcoin testnet address (tb1... or m/n...)" 
                  : "Enter Ethereum testnet address (0x...)"
                }
                className={cn(
                  "font-mono text-sm pr-10",
                  validation?.isValid && "border-success/50",
                  validation?.error && "border-destructive/50"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validation?.isValid && (
                  <Check className="h-4 w-4 text-success" />
                )}
                {validation?.error && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
          </div>
          
          {/* Validation Status */}
          {validation?.warning && !validation.isMainnet && (
            <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
              <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-warning">{validation.warning}</p>
            </div>
          )}
          
          {validation?.isMainnet && <MainnetWarning />}
          
          {validation?.error && !validation.isMainnet && (
            <p className="text-xs text-destructive">{validation.error}</p>
          )}
          
          {validation?.isValid && validation.network && validation.network !== "mainnet" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Detected network:</span>
              <NetworkBadge network={validation.network as TestnetNetwork} />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!validation?.isValid || isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Wallet"}
          </Button>
        </form>
        
        {/* Info */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground">
            Only testnet addresses are accepted. Mainnet addresses are blocked for safety.
            All analysis is read-only — no signing or transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
