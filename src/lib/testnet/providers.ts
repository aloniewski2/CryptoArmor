// Blockchain provider configuration and utilities
// Uses edge function for actual RPC calls, this module manages network config

import { TestnetNetwork } from "./networks";

// Chain IDs for verification
export const CHAIN_IDS: Record<string, number> = {
  "ethereum-sepolia": 11155111,
  "ethereum-holesky": 17000,
  "mainnet": 1, // blocked
};

// RPC endpoints (primary endpoints used by edge function)
export const DEFAULT_RPC_URLS: Record<string, string> = {
  "ethereum-sepolia": "https://ethereum-sepolia-rpc.publicnode.com",
  "ethereum-holesky": "https://ethereum-holesky-rpc.publicnode.com",
};

export interface NetworkStatus {
  network: TestnetNetwork;
  chainId: number;
  blockNumber: number;
  latency: number;
  status: "connected" | "error" | "timeout";
  error?: string;
}

export interface ProviderHealth {
  uptime: number;
  version: string;
  networks: NetworkStatus[];
  timestamp: string;
}

/**
 * Validates that a chain ID matches a known testnet
 * Rejects mainnet (chainId 1) explicitly
 */
export function validateChainId(chainId: number, expectedNetwork: TestnetNetwork): boolean {
  // Explicitly reject mainnet
  if (chainId === 1) {
    throw new Error("Mainnet (chainId 1) is not allowed. CryptoArmor only supports testnets.");
  }
  
  const expectedChainId = CHAIN_IDS[expectedNetwork];
  if (!expectedChainId) {
    throw new Error(`Unknown network: ${expectedNetwork}`);
  }
  
  if (chainId !== expectedChainId) {
    throw new Error(`Chain ID mismatch. Expected ${expectedChainId} for ${expectedNetwork}, got ${chainId}`);
  }
  
  return true;
}

/**
 * Get supported testnet networks
 */
export function getSupportedNetworks(): TestnetNetwork[] {
  return ["ethereum-sepolia", "ethereum-holesky"];
}

/**
 * Check if a network is supported for RPC calls
 */
export function isRPCSupportedNetwork(network: TestnetNetwork): boolean {
  return network === "ethereum-sepolia" || network === "ethereum-holesky";
}

/**
 * Format wei to ETH string with proper precision
 */
export function formatWeiToEth(weiValue: string): string {
  try {
    const wei = BigInt(weiValue);
    const eth = Number(wei) / 1e18;
    return eth.toFixed(6);
  } catch {
    return "0.000000";
  }
}

/**
 * Format block number from hex to decimal
 */
export function formatBlockNumber(hexValue: string): number {
  try {
    return parseInt(hexValue, 16);
  } catch {
    return 0;
  }
}

/**
 * Calculate latency for RPC calls
 */
export function calculateLatency(startTime: number): number {
  return Date.now() - startTime;
}
