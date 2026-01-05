import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NetworkBadge } from "./NetworkBadge";
import { 
  TESTNET_WALLET_FIXTURES, 
  TestnetWalletFixture,
  WalletRiskCategory 
} from "@/lib/testnet/fixtures";
import { TestnetNetwork, getAllNetworks } from "@/lib/testnet/networks";
import { cn } from "@/lib/utils";
import { 
  Wallet, 
  AlertTriangle, 
  Shield, 
  Skull, 
  Bug, 
  ChevronRight,
  Filter
} from "lucide-react";

interface WalletFixtureCardProps {
  fixture: TestnetWalletFixture;
  onSelect: (fixture: TestnetWalletFixture) => void;
  isSelected?: boolean;
}

const categoryConfig: Record<WalletRiskCategory, { 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
}> = {
  "low-risk": { 
    icon: Shield, 
    color: "text-success",
    bgColor: "bg-success/10",
  },
  "medium-risk": { 
    icon: AlertTriangle, 
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  "high-risk": { 
    icon: AlertTriangle, 
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "phishing": { 
    icon: Skull, 
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "drainer": { 
    icon: Bug, 
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "honeypot": { 
    icon: Skull, 
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

function WalletFixtureCard({ fixture, onSelect, isSelected }: WalletFixtureCardProps) {
  const config = categoryConfig[fixture.category];
  const Icon = config.icon;
  
  return (
    <button
      onClick={() => onSelect(fixture)}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        "hover:border-primary/50 hover:bg-primary/5",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border/50 bg-card/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("p-2 rounded", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm truncate">{fixture.label}</span>
            <NetworkBadge network={fixture.network} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {fixture.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              {fixture.address.slice(0, 10)}...{fixture.address.slice(-6)}
            </span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] capitalize",
                fixture.expectedRiskScore >= 70 ? "border-success/50 text-success" :
                fixture.expectedRiskScore >= 50 ? "border-warning/50 text-warning" :
                "border-destructive/50 text-destructive"
              )}
            >
              Score: {fixture.expectedRiskScore}
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </button>
  );
}

interface WalletFixtureSelectorProps {
  onSelect: (fixture: TestnetWalletFixture) => void;
  selectedId?: string;
}

export function WalletFixtureSelector({ onSelect, selectedId }: WalletFixtureSelectorProps) {
  const [networkFilter, setNetworkFilter] = useState<TestnetNetwork | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<WalletRiskCategory | "all">("all");
  
  const networks = getAllNetworks();
  const categories: WalletRiskCategory[] = [
    "low-risk", "medium-risk", "high-risk", "phishing", "drainer", "honeypot"
  ];
  
  const filteredFixtures = TESTNET_WALLET_FIXTURES.filter(fixture => {
    if (networkFilter !== "all" && fixture.network !== networkFilter) return false;
    if (categoryFilter !== "all" && fixture.category !== categoryFilter) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Testnet Wallet Fixtures
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {filteredFixtures.length} wallets
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" />
            Network:
          </div>
          <Button
            variant={networkFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs"
            onClick={() => setNetworkFilter("all")}
          >
            All
          </Button>
          {networks.map(network => (
            <Button
              key={network.id}
              variant={networkFilter === network.id ? "default" : "outline"}
              size="sm"
              className="h-6 text-xs"
              onClick={() => setNetworkFilter(network.id)}
            >
              {network.shortName}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" />
            Risk:
          </div>
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs"
            onClick={() => setCategoryFilter("all")}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              size="sm"
              className="h-6 text-xs capitalize"
              onClick={() => setCategoryFilter(category)}
            >
              {category.replace("-", " ")}
            </Button>
          ))}
        </div>

        {/* Fixture List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredFixtures.map(fixture => (
            <WalletFixtureCard
              key={fixture.id}
              fixture={fixture}
              onSelect={onSelect}
              isSelected={selectedId === fixture.id}
            />
          ))}
          
          {filteredFixtures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No fixtures match the selected filters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
