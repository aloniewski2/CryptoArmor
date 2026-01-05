// Direct RPC client for testnet blockchain interactions
// This module provides a clean API for making RPC calls via the edge function

import { supabase } from "@/integrations/supabase/client";
import { TestnetNetwork } from "./networks";
import { CHAIN_IDS, formatWeiToEth, formatBlockNumber, calculateLatency } from "./providers";

export interface RPCResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  latency?: number;
}

export interface NetworkInfo {
  network: TestnetNetwork;
  chainId: number;
  blockNumber: number;
  latency: number;
}

export interface WalletBalance {
  address: string;
  network: TestnetNetwork;
  chainId: number;
  balance: string;
  balanceWei: string;
}

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: number;
  timestamp: string;
  gasUsed: string;
  status: "success" | "failed";
  functionName?: string;
}

/**
 * Fetch current block number from testnet
 */
export async function getBlockNumber(network: TestnetNetwork): Promise<RPCResponse<NetworkInfo>> {
  const startTime = Date.now();
  
  try {
    const { data, error } = await supabase.functions.invoke("testnet-blockchain-data", {
      body: { action: "blocknumber", network },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || "Failed to fetch block number" };
    }

    const latency = calculateLatency(startTime);
    const blockNumber = formatBlockNumber(data.data.blockNumber);
    const chainId = CHAIN_IDS[network] || 0;

    return {
      success: true,
      data: {
        network,
        chainId,
        blockNumber,
        latency,
      },
      latency,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Fetch wallet balance from testnet
 */
export async function getWalletBalance(
  address: string,
  network: TestnetNetwork
): Promise<RPCResponse<WalletBalance>> {
  const startTime = Date.now();

  try {
    const { data, error } = await supabase.functions.invoke("testnet-blockchain-data", {
      body: { action: "balance", address, network },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || "Failed to fetch balance" };
    }

    const latency = calculateLatency(startTime);
    const balanceWei = data.data || "0";
    const balance = formatWeiToEth(balanceWei);
    const chainId = CHAIN_IDS[network] || 0;

    return {
      success: true,
      data: {
        address,
        network,
        chainId,
        balance,
        balanceWei,
      },
      latency,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Fetch recent transactions for an address
 */
export async function getRecentTransactions(
  address: string,
  network: TestnetNetwork,
  limit = 10
): Promise<RPCResponse<TransactionInfo[]>> {
  const startTime = Date.now();

  try {
    const { data, error } = await supabase.functions.invoke("testnet-blockchain-data", {
      body: { action: "txlist", address, network, limit },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || "Failed to fetch transactions" };
    }

    const latency = calculateLatency(startTime);
    const transactions: TransactionInfo[] = (data.data || []).slice(0, limit).map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to || null,
      value: formatWeiToEth(tx.value || "0"),
      blockNumber: parseInt(tx.blockNumber || "0", 10),
      timestamp: tx.timeStamp ? new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString() : "",
      gasUsed: tx.gasUsed || "0",
      status: tx.isError === "0" ? "success" : "failed",
      functionName: tx.functionName || undefined,
    }));

    return {
      success: true,
      data: transactions,
      latency,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Check network health/status
 */
export async function checkNetworkHealth(network: TestnetNetwork): Promise<RPCResponse<NetworkInfo>> {
  return getBlockNumber(network);
}

/**
 * Get health status for all supported networks
 */
export async function getAllNetworksHealth(): Promise<RPCResponse<NetworkInfo[]>> {
  const networks: TestnetNetwork[] = ["ethereum-sepolia", "ethereum-holesky"];
  const results = await Promise.allSettled(
    networks.map(network => getBlockNumber(network))
  );

  const healthData: NetworkInfo[] = [];
  let hasAnySuccess = false;

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.success && result.value.data) {
      healthData.push(result.value.data);
      hasAnySuccess = true;
    } else {
      const network = networks[index];
      healthData.push({
        network,
        chainId: CHAIN_IDS[network] || 0,
        blockNumber: 0,
        latency: -1,
      });
    }
  });

  return {
    success: hasAnySuccess,
    data: healthData,
    error: hasAnySuccess ? undefined : "All networks unreachable",
  };
}
