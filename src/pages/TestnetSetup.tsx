import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TestnetIndicator, 
  ReadOnlyIndicator,
  NetworkBadge 
} from "@/components/testnet";
import { getAllNetworks, getNetworkConfig } from "@/lib/testnet/networks";
import { 
  Shield, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Wallet,
  Droplets,
  Lock,
  Eye,
  XCircle,
  ArrowRight,
  Copy,
  Server,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const faucets = [
  {
    network: "ethereum-sepolia",
    name: "Sepolia Faucet (Alchemy)",
    url: "https://sepoliafaucet.com",
    description: "Get 0.5 Sepolia ETH daily. Requires Alchemy account.",
    amount: "0.5 ETH/day",
  },
  {
    network: "ethereum-sepolia",
    name: "Google Cloud Faucet",
    url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    description: "Get Sepolia ETH from Google Cloud. No account required.",
    amount: "0.05 ETH",
  },
  {
    network: "ethereum-holesky",
    name: "Holesky Faucet",
    url: "https://holesky-faucet.pk910.de",
    description: "PoW-based faucet for Holesky testnet.",
    amount: "0.5 ETH",
  },
  {
    network: "bitcoin-testnet",
    name: "Bitcoin Testnet Faucet",
    url: "https://testnet-faucet.com/btc-testnet",
    description: "Get testnet BTC for testing Bitcoin applications.",
    amount: "0.001 tBTC",
  },
  {
    network: "bitcoin-signet",
    name: "Signet Faucet",
    url: "https://signetfaucet.com",
    description: "Get Signet BTC for controlled testing environment.",
    amount: "0.01 sBTC",
  },
];

const setupSteps = [
  {
    step: 1,
    title: "Install a Wallet",
    description: "Install MetaMask or another Web3 wallet browser extension. This is needed only for creating addresses, not for connecting to CryptoArmor.",
    icon: Wallet,
    tips: ["MetaMask, Rainbow, or Rabby work well", "Hardware wallets also support testnets", "No real funds needed"],
  },
  {
    step: 2,
    title: "Switch to Testnet",
    description: "In your wallet settings, enable testnet networks and switch to Sepolia or Holesky.",
    icon: Server,
    tips: ["Enable 'Show test networks' in MetaMask settings", "Sepolia is most widely supported", "Holesky is newer with more capacity"],
  },
  {
    step: 3,
    title: "Get Testnet Tokens",
    description: "Use a faucet to receive free testnet ETH. These tokens have no real value and are only for testing.",
    icon: Droplets,
    tips: ["Faucets are free but may have daily limits", "Some require social verification", "Tokens are worthless—safe for testing"],
  },
  {
    step: 4,
    title: "Copy Your Address",
    description: "Copy your testnet wallet address and paste it into CryptoArmor's Testnet Dashboard for analysis.",
    icon: Copy,
    tips: ["Triple-check it's a testnet address", "CryptoArmor will reject mainnet addresses", "Analysis is completely read-only"],
  },
];

const securityGuarantees = [
  {
    title: "No Private Keys",
    description: "CryptoArmor never requests, stores, or generates private keys. Your wallet remains secure.",
    icon: Lock,
    color: "text-success",
  },
  {
    title: "Read-Only Analysis",
    description: "All blockchain queries are read-only. No transactions are signed or broadcast.",
    icon: Eye,
    color: "text-primary",
  },
  {
    title: "Mainnet Blocked",
    description: "Mainnet addresses are automatically detected and rejected to prevent accidental exposure.",
    icon: XCircle,
    color: "text-destructive",
  },
  {
    title: "No Wallet Connection",
    description: "CryptoArmor doesn't connect to your wallet. You paste addresses manually for analysis.",
    icon: Shield,
    color: "text-warning",
  },
];

export default function TestnetSetup() {
  const networks = getAllNetworks();

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
            Testnet Setup Guide
          </h1>
          
          <p className="text-sm text-muted-foreground max-w-xl">
            Learn how to set up testnet wallets for safe security testing. 
            CryptoArmor uses testnets exclusively to ensure no real funds are ever at risk.
          </p>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Why Testnets Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium mb-2">Why Testnets Only?</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    CryptoArmor is designed for security training and analysis. Using testnets ensures 
                    that you can safely explore attack patterns, test detection mechanisms, and 
                    understand blockchain security without risking real assets.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Testnet tokens have zero monetary value</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Free to obtain from public faucets</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Real blockchain data for authentic testing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Identical functionality to mainnet</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Guarantees */}
          <div>
            <h2 className="text-lg font-display tracking-tight-display mb-4">Security Guarantees</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {securityGuarantees.map((guarantee) => (
                <Card key={guarantee.title}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <guarantee.icon className={cn("h-5 w-5 mt-0.5", guarantee.color)} />
                      <div>
                        <h4 className="font-medium text-sm">{guarantee.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {guarantee.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Setup Steps */}
          <div>
            <h2 className="text-lg font-display tracking-tight-display mb-4">Setup Steps</h2>
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <Card key={step.step}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm font-bold shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <step.icon className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">{step.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.tips.map((tip, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {tip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {index < setupSteps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 hidden lg:block" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supported Networks */}
          <div>
            <h2 className="text-lg font-display tracking-tight-display mb-4">Supported Networks</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {networks.map((network) => (
                <Card key={network.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: network.color }}
                        />
                        <span className="font-medium">{network.name}</span>
                      </div>
                      <NetworkBadge network={network.id} size="sm" showIcon={false} />
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-mono">{network.isEVM ? "EVM" : "UTXO"}</span>
                      </div>
                      {network.chainId && (
                        <div className="flex justify-between">
                          <span>Chain ID:</span>
                          <span className="font-mono">{network.chainId}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Symbol:</span>
                        <span className="font-mono">{network.symbol}</span>
                      </div>
                    </div>
                    <a 
                      href={network.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
                    >
                      Block Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Faucets */}
          <div>
            <h2 className="text-lg font-display tracking-tight-display mb-4">Testnet Faucets</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {faucets.map((faucet, index) => {
                    const networkConfig = getNetworkConfig(faucet.network as any);
                    return (
                      <div key={index} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Droplets className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-medium text-sm truncate">{faucet.name}</span>
                              <NetworkBadge network={faucet.network as any} size="sm" showIcon={false} />
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {faucet.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {faucet.amount}
                          </Badge>
                          <a
                            href={faucet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="gap-1.5">
                              Visit <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warning */}
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning">Important Reminder</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Never send real cryptocurrency to testnet addresses. Testnet and mainnet 
                    are completely separate networks. Any real funds sent to a testnet address 
                    will be permanently lost.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/testnet" className="flex-1">
              <Button className="w-full gap-2">
                <Server className="h-4 w-4" />
                Go to Testnet Dashboard
              </Button>
            </Link>
            <Link to="/docs" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border max-w-4xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p className="text-xs font-mono">
              CryptoArmor Setup Guide • Read-Only Mode • No Real Funds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
