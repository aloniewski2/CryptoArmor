import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestnetIndicator, 
  ReadOnlyIndicator,
  NetworkBadge,
  MainnetWarning 
} from "@/components/testnet";
import { validateTestnetAddress, isEVMAddress } from "@/lib/testnet/validation";
import { TestnetNetwork, getNetworkConfig, getEVMNetworks } from "@/lib/testnet/networks";
import { 
  getBlockNumber, 
  getWalletBalance, 
  getAllNetworksHealth,
  NetworkInfo,
  WalletBalance
} from "@/lib/testnet/rpc";
import { CHAIN_IDS } from "@/lib/testnet/providers";
import { cn } from "@/lib/utils";
import { 
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  Server,
  Clock,
  Check,
  X,
  AlertTriangle,
  Zap,
  Database,
  Hash,
  Loader2,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface NetworkState {
  status: ConnectionStatus;
  data?: NetworkInfo;
  error?: string;
}

export default function TestnetConnection() {
  const [networkStates, setNetworkStates] = useState<Record<string, NetworkState>>({});
  const [selectedNetwork, setSelectedNetwork] = useState<TestnetNetwork>("ethereum-sepolia");
  const [address, setAddress] = useState("");
  const [addressValidation, setAddressValidation] = useState<ReturnType<typeof validateTestnetAddress> | null>(null);
  const [balanceResult, setBalanceResult] = useState<WalletBalance | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const evmNetworks = getEVMNetworks();

  // Initial connection check
  useEffect(() => {
    checkAllNetworks();
  }, []);

  const checkAllNetworks = async () => {
    setIsRefreshing(true);
    
    // Set all to connecting
    const connecting: Record<string, NetworkState> = {};
    evmNetworks.forEach(n => {
      connecting[n.id] = { status: "connecting" };
    });
    setNetworkStates(connecting);

    const result = await getAllNetworksHealth();
    
    const newStates: Record<string, NetworkState> = {};
    if (result.success && result.data) {
      result.data.forEach(info => {
        newStates[info.network] = {
          status: info.blockNumber > 0 ? "connected" : "error",
          data: info,
        };
      });
    } else {
      evmNetworks.forEach(n => {
        newStates[n.id] = { status: "error", error: result.error };
      });
    }
    
    setNetworkStates(newStates);
    setIsRefreshing(false);
  };

  const checkSingleNetwork = async (network: TestnetNetwork) => {
    setNetworkStates(prev => ({
      ...prev,
      [network]: { status: "connecting" }
    }));

    const result = await getBlockNumber(network);
    
    setNetworkStates(prev => ({
      ...prev,
      [network]: result.success && result.data
        ? { status: "connected", data: result.data }
        : { status: "error", error: result.error }
    }));
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setBalanceResult(null);
    
    if (value.length > 10) {
      const validation = validateTestnetAddress(value, selectedNetwork);
      setAddressValidation(validation);
    } else {
      setAddressValidation(null);
    }
  };

  const handleFetchBalance = async () => {
    if (!addressValidation?.isValid) return;
    
    setIsLoadingBalance(true);
    setBalanceResult(null);

    const result = await getWalletBalance(address, selectedNetwork);
    
    if (result.success && result.data) {
      setBalanceResult(result.data);
      toast({
        title: "Balance fetched",
        description: `${result.data.balance} ETH on ${selectedNetwork}`,
      });
    } else {
      toast({
        title: "Failed to fetch balance",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsLoadingBalance(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case "connected": return <Wifi className="h-4 w-4 text-success" />;
      case "connecting": return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "error": return <WifiOff className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Testnet Banner */}
      <TestnetIndicator variant="banner" />
      
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <TestnetIndicator variant="badge" />
            <ReadOnlyIndicator />
            <Badge variant="outline" className="font-mono text-[10px]">
              RPC DIRECT
            </Badge>
          </div>
          
          <h1 className="text-2xl font-display tracking-tight-display mb-2">
            Testnet Connection
          </h1>
          
          <p className="text-sm text-muted-foreground max-w-xl">
            Test real-time RPC connectivity to Ethereum testnets. Fetch balances and block numbers 
            directly from Sepolia and Holesky networks.
          </p>
        </div>

        {/* Network Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {evmNetworks.map(network => {
            const state = networkStates[network.id] || { status: "idle" };
            const config = getNetworkConfig(network.id);
            
            return (
              <Card 
                key={network.id}
                className={cn(
                  "transition-all",
                  selectedNetwork === network.id && "ring-1 ring-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <Server className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="font-medium">{config.name}</h3>
                        <div className="text-xs text-muted-foreground font-mono">
                          Chain ID: {config.chainId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(state.status)}
                      <Badge 
                        variant={state.status === "connected" ? "success" : state.status === "error" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {state.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {state.status === "connected" && state.data && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 rounded bg-secondary/30">
                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Block Number
                        </div>
                        <div className="font-mono text-sm">
                          {state.data.blockNumber.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-secondary/30">
                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Latency
                        </div>
                        <div className="font-mono text-sm">
                          {state.data.latency}ms
                        </div>
                      </div>
                    </div>
                  )}

                  {state.status === "error" && state.error && (
                    <div className="p-2 rounded bg-destructive/10 border border-destructive/30 mb-4">
                      <p className="text-xs text-destructive">{state.error}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedNetwork === network.id ? "default" : "outline"}
                      onClick={() => setSelectedNetwork(network.id)}
                      className="flex-1"
                    >
                      {selectedNetwork === network.id ? "Selected" : "Select"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => checkSingleNetwork(network.id)}
                      disabled={state.status === "connecting"}
                    >
                      <RefreshCw className={cn("h-4 w-4", state.status === "connecting" && "animate-spin")} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Refresh All Button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            onClick={checkAllNetworks}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh All Networks
          </Button>
        </div>

        {/* Balance Fetch Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Fetch Wallet Balance
              <NetworkBadge network={selectedNetwork} size="sm" className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Wallet Address</label>
              <div className="relative">
                <Input
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Enter testnet address (0x...)"
                  className={cn(
                    "font-mono text-sm pr-10",
                    addressValidation?.isValid && "border-success/50",
                    addressValidation?.error && "border-destructive/50"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {addressValidation?.isValid && <Check className="h-4 w-4 text-success" />}
                  {addressValidation?.error && <X className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {addressValidation?.warning && !addressValidation.isMainnet && (
              <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
                <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning">{addressValidation.warning}</p>
              </div>
            )}
            
            {addressValidation?.isMainnet && <MainnetWarning />}
            
            {addressValidation?.error && !addressValidation.isMainnet && (
              <p className="text-xs text-destructive">{addressValidation.error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleFetchBalance}
                disabled={!addressValidation?.isValid || isLoadingBalance}
                className="gap-2"
              >
                {isLoadingBalance ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                Fetch Balance
              </Button>
              
              <Button
                variant="outline"
                onClick={() => checkSingleNetwork(selectedNetwork)}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Fetch Latest Block
              </Button>
            </div>

            {/* Balance Result */}
            {balanceResult && (
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Balance Result</h4>
                  <Badge variant="success" className="text-[10px]">SUCCESS</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-background px-2 py-1 rounded truncate max-w-[200px]">
                        {balanceResult.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(balanceResult.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Network</div>
                    <NetworkBadge network={balanceResult.network} size="sm" />
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Balance</div>
                    <div className="font-mono text-lg font-medium">
                      {balanceResult.balance} <span className="text-sm text-muted-foreground">ETH</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Chain ID</div>
                    <div className="font-mono text-sm">{balanceResult.chainId}</div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border/50">
                  <div className="text-[10px] text-muted-foreground mb-1">Balance (Wei)</div>
                  <code className="text-[10px] font-mono text-muted-foreground break-all">
                    {balanceResult.balanceWei}
                  </code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-secondary/30">
                <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" />
                  Read-Only Mode
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  All RPC calls are read-only. No wallet connections, signing, or transactions are supported.
                </p>
              </div>
              
              <div className="p-3 rounded bg-secondary/30">
                <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" />
                  Testnet Only
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Mainnet (chainId 1) is explicitly blocked. Only Sepolia and Holesky testnets are supported.
                </p>
              </div>
              
              <div className="p-3 rounded bg-secondary/30">
                <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" />
                  Direct RPC
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Balance and block queries use direct JSON-RPC calls. Transaction history uses explorer APIs.
                </p>
              </div>
              
              <div className="p-3 rounded bg-secondary/30">
                <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" />
                  No Private Keys
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  TxnGuard never generates, stores, or handles private keys in any form.
                </p>
              </div>
            </div>

            {/* RPC Endpoints */}
            <div className="pt-4 border-t border-border/50">
              <h4 className="text-xs font-medium mb-3">RPC Endpoints</h4>
              <div className="space-y-2">
                {evmNetworks.map(network => (
                  <div key={network.id} className="flex items-center justify-between p-2 rounded bg-background">
                    <div className="flex items-center gap-2">
                      <NetworkBadge network={network.id} size="sm" />
                      <span className="text-xs text-muted-foreground">Chain {network.chainId}</span>
                    </div>
                    <code className="text-[10px] font-mono text-muted-foreground">
                      {network.rpcUrl}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
