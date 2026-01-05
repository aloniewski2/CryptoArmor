import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, AlertTriangle, Activity, ArrowRight, Wallet, Server, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  {
    icon: Search,
    title: "Transaction Scanner",
    description: "Analyze transaction calldata for risks",
    href: "/scanner",
    color: "text-primary",
  },
  {
    icon: Wallet,
    title: "Wallet Reputation",
    description: "Check wallet trust scores",
    href: "/wallet",
    color: "text-success",
  },
  {
    icon: Server,
    title: "Testnet Dashboard",
    description: "Test with Sepolia & Holesky",
    href: "/testnet",
    color: "text-warning",
  },
  {
    icon: AlertTriangle,
    title: "Attack Simulation",
    description: "Run security simulations",
    href: "/testnet/simulation",
    color: "text-destructive",
  },
];

export default function Index() {
  const [quickAddress, setQuickAddress] = useState("");

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-display tracking-tight-display">CryptoArmor</h1>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Pre-transaction risk intelligence platform
        </p>
      </div>

      {/* Quick Scan */}
      <Card className="mb-6 max-w-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Quick Scan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (quickAddress) {
                window.location.href = `/wallet?address=${quickAddress}`;
              }
            }}
          >
            <Input
              placeholder="Enter wallet address (0x...)"
              value={quickAddress}
              onChange={(e) => setQuickAddress(e.target.value)}
              className="font-mono bg-secondary/50"
            />
            <Button type="submit" disabled={!quickAddress}>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl">
        {quickActions.map((action) => (
          <Link key={action.href} to={action.href}>
            <Card className="h-full hover:bg-card/80 transition-colors cursor-pointer border-border/50 hover:border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-secondary">
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-0.5">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-2xl font-display text-primary mb-0.5">99.7%</div>
            <div className="text-xs text-muted-foreground">Detection rate</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-2xl font-display text-success mb-0.5">&lt;100ms</div>
            <div className="text-xs text-muted-foreground">Scan latency</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-2xl font-display text-warning mb-0.5">2</div>
            <div className="text-xs text-muted-foreground">Testnets active</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-2xl font-display text-foreground mb-0.5">Read-only</div>
            <div className="text-xs text-muted-foreground">Access mode</div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Link */}
      <div className="mt-8 max-w-2xl">
        <Link to="/docs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <FileText className="h-4 w-4" />
          View documentation
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
