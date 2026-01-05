import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EtherscanResponse {
  status: string;
  message: string;
  result: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, address, txhash } = await req.json();
    const ETHERSCAN_API_KEY = Deno.env.get("ETHERSCAN_API_KEY");

    if (!ETHERSCAN_API_KEY) {
      console.error("ETHERSCAN_API_KEY not configured");
      throw new Error("Etherscan API key not configured");
    }

    console.log(`Processing blockchain data request: action=${action}, address=${address || txhash}`);

    const baseUrl = "https://api.etherscan.io/api";

    // Helper function to fetch with retry
    const fetchWithRetry = async (url: string, retries = 2): Promise<EtherscanResponse> => {
      for (let i = 0; i <= retries; i++) {
        try {
          const response = await fetch(url);
          const data: EtherscanResponse = await response.json();
          
          // Check for rate limit error
          if (data.status === "0" && data.result?.includes?.("rate limit")) {
            console.log(`Rate limited, waiting before retry ${i + 1}/${retries}`);
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
    };

    switch (action) {
      case "balance": {
        const url = `${baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
        const data = await fetchWithRetry(url);
        
        return new Response(
          JSON.stringify({ success: true, data: data.result || "0" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "txlist": {
        const url = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const data = await fetchWithRetry(url);
        
        // "No transactions found" is not an error
        if (data.status === "0" && data.message === "No transactions found") {
          return new Response(
            JSON.stringify({ success: true, data: [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Handle rate limit or other errors gracefully
        if (data.status === "0") {
          console.log(`Etherscan txlist returned: ${data.message}`);
          return new Response(
            JSON.stringify({ success: true, data: [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: Array.isArray(data.result) ? data.result : [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "tokentx": {
        const url = `${baseUrl}?module=account&action=tokentx&address=${address}&page=1&offset=20&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const data = await fetchWithRetry(url);
        
        if (data.status === "0") {
          return new Response(
            JSON.stringify({ success: true, data: [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: Array.isArray(data.result) ? data.result : [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "txinfo": {
        const url = `${baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}&apikey=${ETHERSCAN_API_KEY}`;
        const data = await fetchWithRetry(url);
        
        return new Response(
          JSON.stringify({ success: true, data: data.result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "contractinfo": {
        const url = `${baseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
        const data = await fetchWithRetry(url);
        
        return new Response(
          JSON.stringify({ success: true, data: data.result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "accountinfo": {
        // Get multiple pieces of info about an account
        const [balanceRes, txCountRes, contractRes] = await Promise.allSettled([
          fetchWithRetry(`${baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`),
          fetchWithRetry(`${baseUrl}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`),
          fetchWithRetry(`${baseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`),
        ]);

        // Extract results with fallbacks
        const balanceData = balanceRes.status === "fulfilled" ? balanceRes.value : { result: "0" };
        const txCountData = txCountRes.status === "fulfilled" ? txCountRes.value : { result: "0x0" };
        const contractData = contractRes.status === "fulfilled" ? contractRes.value : { result: [{}] };

        const contractResult = contractData.result?.[0] || {};
        const isContract = contractResult.SourceCode && contractResult.SourceCode !== "";
        const contractName = isContract ? contractResult.ContractName || null : null;
        const isVerified = isContract && contractResult.ABI !== "Contract source code not verified";

        // Parse balance
        let balanceEth = "0";
        try {
          const balanceWei = balanceData.result || "0";
          balanceEth = (parseInt(balanceWei) / 1e18).toFixed(6);
        } catch (e) {
          console.error("Error parsing balance:", e);
        }

        // Parse tx count
        let txCount = 0;
        try {
          txCount = parseInt(txCountData.result || "0x0", 16);
        } catch (e) {
          console.error("Error parsing tx count:", e);
        }

        console.log(`Account info for ${address}: isContract=${isContract}, verified=${isVerified}, txCount=${txCount}`);

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              address,
              balance: balanceEth,
              txCount,
              isContract: Boolean(isContract),
              contractName,
              isVerified: Boolean(isVerified),
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Error in blockchain-data function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
