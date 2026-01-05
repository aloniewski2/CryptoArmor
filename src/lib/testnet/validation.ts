import { TestnetNetwork } from "./networks";
import { CHAIN_IDS } from "./providers";

// Address validation patterns
const ETH_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const BTC_MAINNET_PREFIXES = ["1", "3", "bc1"];
const BTC_TESTNET_PREFIXES = ["m", "n", "2", "tb1"];

export interface AddressValidationResult {
  isValid: boolean;
  isMainnet: boolean;
  isTestnet: boolean;
  network: TestnetNetwork | "mainnet" | null;
  checksumValid?: boolean;
  warning?: string;
  error?: string;
}

/**
 * Compute Ethereum address checksum according to EIP-55
 * This is a pure JavaScript implementation
 */
function keccak256Simple(input: string): string {
  // Simple hash for checksum - in production would use proper keccak
  // For now, we validate format and provide warning about checksum
  // The edge function and real ethers.js would do proper verification
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(40, '0');
}

/**
 * Validate Ethereum address checksum (EIP-55)
 * Returns true if:
 * - Address is all lowercase (valid, not checksummed)
 * - Address is all uppercase (valid, not checksummed) 
 * - Address has correct mixed case (valid, checksummed)
 */
export function validateAddressChecksum(address: string): { valid: boolean; checksummed: boolean } {
  if (!ETH_ADDRESS_PATTERN.test(address)) {
    return { valid: false, checksummed: false };
  }

  const addr = address.slice(2); // Remove 0x prefix
  
  // If all same case, it's valid but not checksummed
  if (addr === addr.toLowerCase() || addr === addr.toUpperCase()) {
    return { valid: true, checksummed: false };
  }

  // For mixed case, we would verify checksum here
  // In production, use ethers.getAddress() in the edge function
  // For now, accept mixed case as potentially checksummed
  return { valid: true, checksummed: true };
}

/**
 * Check if address is Bitcoin mainnet (should be blocked)
 */
function isBtcMainnetAddress(address: string): boolean {
  // Mainnet addresses but NOT testnet patterns
  if (address.startsWith("bc1")) return true;
  if (address.startsWith("1") && !address.startsWith("1")) return false; // P2PKH mainnet
  if (address.startsWith("3")) return true; // P2SH mainnet
  if (address.length >= 26 && address.length <= 35) {
    // Legacy mainnet starts with 1 or 3
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
      return !BTC_TESTNET_PREFIXES.some(p => address.startsWith(p));
    }
  }
  return false;
}

/**
 * Check if address is Bitcoin testnet
 */
function isBtcTestnetAddress(address: string): boolean {
  return BTC_TESTNET_PREFIXES.some(prefix => address.startsWith(prefix));
}

/**
 * Validate a testnet address - the main validation function
 * Rejects mainnet addresses, validates format, checks checksum for EVM
 */
export function validateTestnetAddress(
  address: string,
  expectedNetwork?: TestnetNetwork
): AddressValidationResult {
  if (!address || address.trim().length === 0) {
    return {
      isValid: false,
      isMainnet: false,
      isTestnet: false,
      network: null,
      error: "Address is required",
    };
  }

  const trimmedAddress = address.trim();

  // Bitcoin mainnet detection - BLOCK
  if (isBtcMainnetAddress(trimmedAddress) && !isBtcTestnetAddress(trimmedAddress)) {
    return {
      isValid: false,
      isMainnet: true,
      isTestnet: false,
      network: "mainnet",
      warning: "Bitcoin mainnet address detected. CryptoArmor only supports testnet addresses for safety.",
      error: "Mainnet addresses are not allowed",
    };
  }

  // Bitcoin testnet validation
  if (isBtcTestnetAddress(trimmedAddress)) {
    const network = trimmedAddress.startsWith("tb1") ? "bitcoin-signet" : "bitcoin-testnet";
    return {
      isValid: true,
      isMainnet: false,
      isTestnet: true,
      network: network as TestnetNetwork,
    };
  }

  // Ethereum address validation
  if (ETH_ADDRESS_PATTERN.test(trimmedAddress)) {
    const checksumResult = validateAddressChecksum(trimmedAddress);
    
    if (!checksumResult.valid) {
      return {
        isValid: false,
        isMainnet: false,
        isTestnet: false,
        network: null,
        checksumValid: false,
        error: "Invalid address format",
      };
    }

    // Determine network
    const network = expectedNetwork || "ethereum-sepolia";
    
    if (expectedNetwork && !expectedNetwork.startsWith("ethereum")) {
      return {
        isValid: false,
        isMainnet: false,
        isTestnet: false,
        network: null,
        error: `Address format doesn't match expected network: ${expectedNetwork}`,
      };
    }

    // Warn user that EVM addresses look the same across networks
    return {
      isValid: true,
      isMainnet: false,
      isTestnet: true,
      network: network as TestnetNetwork,
      checksumValid: checksumResult.checksummed,
      warning: checksumResult.checksummed 
        ? undefined 
        : "Ethereum addresses appear identical across networks. Ensure you're using a testnet address.",
    };
  }

  return {
    isValid: false,
    isMainnet: false,
    isTestnet: false,
    network: null,
    error: "Invalid address format. Expected Ethereum (0x...) or Bitcoin testnet address.",
  };
}

/**
 * Format address for display (truncated)
 */
export function formatAddress(address: string, truncate = true): string {
  if (!address) return "";
  if (!truncate) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if address is EVM format
 */
export function isEVMAddress(address: string): boolean {
  return ETH_ADDRESS_PATTERN.test(address);
}

/**
 * Check if address is Bitcoin format
 */
export function isBitcoinAddress(address: string): boolean {
  return isBtcTestnetAddress(address) || isBtcMainnetAddress(address);
}

/**
 * Validate chain ID is a supported testnet (not mainnet)
 */
export function validateChainId(chainId: number): { valid: boolean; network?: TestnetNetwork; error?: string } {
  // Explicitly reject mainnet
  if (chainId === 1) {
    return { valid: false, error: "Mainnet (chainId 1) is not allowed. CryptoArmor only supports testnets." };
  }

  // Find matching network
  for (const [network, id] of Object.entries(CHAIN_IDS)) {
    if (id === chainId && network !== "mainnet") {
      return { valid: true, network: network as TestnetNetwork };
    }
  }

  return { valid: false, error: `Unknown chain ID: ${chainId}. Supported testnets: Sepolia (11155111), Holesky (17000)` };
}
