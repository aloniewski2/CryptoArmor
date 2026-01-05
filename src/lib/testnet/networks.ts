// Supported testnet networks configuration
export type TestnetNetwork = 
  | "ethereum-sepolia" 
  | "ethereum-holesky" 
  | "bitcoin-testnet" 
  | "bitcoin-signet";

export interface NetworkConfig {
  id: TestnetNetwork;
  name: string;
  shortName: string;
  symbol: string;
  explorerUrl: string;
  rpcUrl: string;
  chainId?: number;
  isEVM: boolean;
  color: string;
}

export const TESTNET_NETWORKS: Record<TestnetNetwork, NetworkConfig> = {
  "ethereum-sepolia": {
    id: "ethereum-sepolia",
    name: "Ethereum Sepolia",
    shortName: "Sepolia",
    symbol: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
    chainId: 11155111,
    isEVM: true,
    color: "hsl(210, 70%, 55%)",
  },
  "ethereum-holesky": {
    id: "ethereum-holesky",
    name: "Ethereum Holesky",
    shortName: "Holesky",
    symbol: "ETH",
    explorerUrl: "https://holesky.etherscan.io",
    rpcUrl: "https://ethereum-holesky.publicnode.com",
    chainId: 17000,
    isEVM: true,
    color: "hsl(280, 60%, 55%)",
  },
  "bitcoin-testnet": {
    id: "bitcoin-testnet",
    name: "Bitcoin Testnet",
    shortName: "BTC Testnet",
    symbol: "tBTC",
    explorerUrl: "https://blockstream.info/testnet",
    rpcUrl: "https://blockstream.info/testnet/api",
    isEVM: false,
    color: "hsl(35, 100%, 50%)",
  },
  "bitcoin-signet": {
    id: "bitcoin-signet",
    name: "Bitcoin Signet",
    shortName: "Signet",
    symbol: "sBTC",
    explorerUrl: "https://mempool.space/signet",
    rpcUrl: "https://mempool.space/signet/api",
    isEVM: false,
    color: "hsl(20, 90%, 50%)",
  },
};

export const getNetworkConfig = (networkId: TestnetNetwork): NetworkConfig => {
  return TESTNET_NETWORKS[networkId];
};

export const getAllNetworks = (): NetworkConfig[] => {
  return Object.values(TESTNET_NETWORKS);
};

export const getEVMNetworks = (): NetworkConfig[] => {
  return Object.values(TESTNET_NETWORKS).filter(n => n.isEVM);
};

export const getBitcoinNetworks = (): NetworkConfig[] => {
  return Object.values(TESTNET_NETWORKS).filter(n => !n.isEVM);
};
