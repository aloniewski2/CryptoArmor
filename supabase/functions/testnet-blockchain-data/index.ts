import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Chain IDs for verification
const CHAIN_IDS: Record<string, number> = {
  "ethereum-sepolia": 11155111,
  "ethereum-holesky": 17000,
};

// Network RPC and API configurations - using reliable public endpoints
const NETWORK_CONFIG: Record<string, { rpcUrls: string[]; explorerApi: string }> = {
  "ethereum-sepolia": {
    rpcUrls: [
      "https://ethereum-sepolia-rpc.publicnode.com",
      "https://rpc2.sepolia.org",
      "https://sepolia.gateway.tenderly.co",
    ],
    explorerApi: "https://api-sepolia.etherscan.io/api",
  },
  "ethereum-holesky": {
    rpcUrls: [
      "https://ethereum-holesky-rpc.publicnode.com",
      "https://holesky.drpc.org",
      "https://rpc.holesky.ethpandaops.io",
    ],
    explorerApi: "https://api-holesky.etherscan.io/api",
  },
};

interface RPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}

interface RPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: { code: number; message: string };
}

// Make JSON-RPC call directly to the network with fallback endpoints
async function rpcCall(network: string, method: string, params: any[] = []): Promise<any> {
  const config = NETWORK_CONFIG[network];
  if (!config) {
    throw new Error(`Unsupported network: ${network}`);
  }

  // Use custom RPC URLs from env if provided, otherwise use fallback list
  const envRpcUrl = network === "ethereum-sepolia" 
    ? Deno.env.get("SEPOLIA_RPC_URL")
    : Deno.env.get("HOLESKY_RPC_URL");
  
  const rpcUrls = envRpcUrl ? [envRpcUrl, ...config.rpcUrls] : config.rpcUrls;

  const request: RPCRequest = {
    jsonrpc: "2.0",
    method,
    params,
    id: Date.now(),
  };

  let lastError: Error | null = null;

  // Try each RPC endpoint until one works
  for (const rpcUrl of rpcUrls) {
    try {
      console.log(`[RPC] ${network} ${method} -> ${rpcUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`[RPC] ${rpcUrl} returned ${response.status}, trying next...`);
        lastError = new Error(`RPC request failed: ${response.status} ${response.statusText}`);
        continue;
      }

      const data: RPCResponse = await response.json();

      if (data.error) {
        console.log(`[RPC] ${rpcUrl} RPC error: ${data.error.message}, trying next...`);
        lastError = new Error(`RPC error: ${data.error.message}`);
        continue;
      }

      return data.result;
    } catch (err) {
      console.log(`[RPC] ${rpcUrl} failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      lastError = err instanceof Error ? err : new Error("Unknown error");
      continue;
    }
  }

  throw lastError || new Error("All RPC endpoints failed");
}

// Fetch with retry for explorer API calls
async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "0" && data.result?.includes?.("rate limit")) {
        console.log(`[Explorer] Rate limited, waiting before retry ${i + 1}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      return data;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  throw new Error("Max retries exceeded");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { action, address, txhash, network, limit } = await req.json();
    const ETHERSCAN_API_KEY = Deno.env.get("ETHERSCAN_API_KEY");
    
    console.log(`[Testnet] action=${action}, network=${network}, address=${address || txhash}`);

    // Validate network for EVM actions
    if (!network || !NETWORK_CONFIG[network]) {
      // Return available networks for health check
      if (action === "health") {
        const networks = Object.keys(NETWORK_CONFIG);
        const statuses = await Promise.allSettled(
          networks.map(async (net) => {
            const chainIdResult = await rpcCall(net, "eth_chainId", []);
            const blockResult = await rpcCall(net, "eth_blockNumber", []);
            return {
              network: net,
              chainId: parseInt(chainIdResult, 16),
              expectedChainId: CHAIN_IDS[net],
              blockNumber: blockResult,
              status: "connected",
            };
          })
        );

        const health = {
          uptime: Date.now(),
          version: "1.0.0",
          networks: statuses.map((s, i) => 
            s.status === "fulfilled" ? s.value : { 
              network: Object.keys(NETWORK_CONFIG)[i], 
              status: "error",
              error: (s as PromiseRejectedResult).reason?.message
            }
          ),
          timestamp: new Date().toISOString(),
        };

        return new Response(
          JSON.stringify({ success: true, data: health }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Unsupported network: ${network}. Supported: ethereum-sepolia, ethereum-holesky`);
    }

    const config = NETWORK_CONFIG[network];
    const apiKeySuffix = ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : "";

    switch (action) {
      // ===== Direct RPC Actions =====
      
      case "blocknumber": {
        const result = await rpcCall(network, "eth_blockNumber", []);
        const chainId = await rpcCall(network, "eth_chainId", []);
        const latency = Date.now() - startTime;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { 
              blockNumber: result,
              chainId: parseInt(chainId, 16),
              expectedChainId: CHAIN_IDS[network],
              latency,
              network,
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      case "chainid": {
        const result = await rpcCall(network, "eth_chainId", []);
        const expectedChainId = CHAIN_IDS[network];
        const actualChainId = parseInt(result, 16);
        
        // Validate chain ID matches expected testnet
        if (actualChainId !== expectedChainId) {
          throw new Error(`Chain ID mismatch: expected ${expectedChainId}, got ${actualChainId}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { chainId: actualChainId, network, verified: true }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      case "gasprice": {
        const result = await rpcCall(network, "eth_gasPrice", []);
        const gasPriceGwei = parseInt(result, 16) / 1e9;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { gasPrice: result, gasPriceGwei: gasPriceGwei.toFixed(2), network }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ===== Balance via RPC =====
      
      case "balance": {
        // Direct RPC call for balance (more reliable)
        const result = await rpcCall(network, "eth_getBalance", [address, "latest"]);
        const balanceWei = result;
        
        return new Response(
          JSON.stringify({ success: true, data: balanceWei, network }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ===== Explorer API Actions (for tx history) =====
      
      case "txlist": {
        const url = `${config.explorerApi}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit || 20}&sort=desc${apiKeySuffix}`;
        const data = await fetchWithRetry(url);
        
        if (data.status === "0") {
          console.log(`[Testnet] txlist: ${data.message}`);
          return new Response(
            JSON.stringify({ success: true, data: [], network }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: Array.isArray(data.result) ? data.result : [], network }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "tokentx": {
        const url = `${config.explorerApi}?module=account&action=tokentx&address=${address}&page=1&offset=${limit || 20}&sort=desc${apiKeySuffix}`;
        const data = await fetchWithRetry(url);
        
        if (data.status === "0") {
          return new Response(
            JSON.stringify({ success: true, data: [], network }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: Array.isArray(data.result) ? data.result : [], network }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "accountinfo": {
        // Combine RPC and explorer API calls
        const [balanceResult, txCountResult, contractResult] = await Promise.allSettled([
          rpcCall(network, "eth_getBalance", [address, "latest"]),
          rpcCall(network, "eth_getTransactionCount", [address, "latest"]),
          fetchWithRetry(`${config.explorerApi}?module=contract&action=getsourcecode&address=${address}${apiKeySuffix}`),
        ]);

        const balanceWei = balanceResult.status === "fulfilled" ? balanceResult.value : "0x0";
        const txCountHex = txCountResult.status === "fulfilled" ? txCountResult.value : "0x0";
        const contractData = contractResult.status === "fulfilled" ? contractResult.value : { result: [{}] };

        const contractInfo = contractData.result?.[0] || {};
        const isContract = contractInfo.SourceCode && contractInfo.SourceCode !== "";
        const contractName = isContract ? contractInfo.ContractName || null : null;
        const isVerified = isContract && contractInfo.ABI !== "Contract source code not verified";

        let balanceEth = "0";
        try {
          const balanceValue = BigInt(balanceWei);
          balanceEth = (Number(balanceValue) / 1e18).toFixed(6);
        } catch (e) {
          console.error("[Testnet] Error parsing balance:", e);
        }

        let txCount = 0;
        try {
          txCount = parseInt(txCountHex, 16);
        } catch (e) {
          console.error("[Testnet] Error parsing tx count:", e);
        }

        console.log(`[Testnet] Account ${address}: balance=${balanceEth} ETH, txCount=${txCount}, isContract=${isContract}`);

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              address,
              balance: balanceEth,
              balanceWei: balanceWei,
              txCount,
              isContract: Boolean(isContract),
              contractName,
              isVerified: Boolean(isVerified),
              network,
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "contractinfo": {
        const url = `${config.explorerApi}?module=contract&action=getsourcecode&address=${address}${apiKeySuffix}`;
        const data = await fetchWithRetry(url);
        
        return new Response(
          JSON.stringify({ success: true, data: data.result, network }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "networks": {
        // Return supported network info with status
        const networkChecks = await Promise.allSettled(
          Object.keys(NETWORK_CONFIG).map(async (net) => {
            try {
              const [blockResult, chainResult] = await Promise.all([
                rpcCall(net, "eth_blockNumber", []),
                rpcCall(net, "eth_chainId", []),
              ]);
              return {
                network: net,
                chainId: parseInt(chainResult, 16),
                blockNumber: parseInt(blockResult, 16),
                status: "connected" as const,
              };
            } catch (error) {
              return {
                network: net,
                chainId: CHAIN_IDS[net],
                blockNumber: 0,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          })
        );

        const networks = networkChecks.map((result) => 
          result.status === "fulfilled" ? result.value : null
        ).filter(Boolean);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: networks,
            latency: Date.now() - startTime,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("[Testnet] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        latency: Date.now() - startTime,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
