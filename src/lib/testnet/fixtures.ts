import { TestnetNetwork } from "./networks";

export type WalletRiskCategory = 
  | "low-risk" 
  | "medium-risk" 
  | "high-risk" 
  | "phishing" 
  | "drainer" 
  | "honeypot";

export interface TestnetWalletFixture {
  id: string;
  address: string;
  network: TestnetNetwork;
  label: string;
  category: WalletRiskCategory;
  description: string;
  expectedRiskScore: number;
  simulatedFlags: string[];
  tags: string[];
}

// Predefined testnet wallet fixtures for testing
export const TESTNET_WALLET_FIXTURES: TestnetWalletFixture[] = [
  // Ethereum Sepolia - Low Risk
  {
    id: "sepolia-low-risk-1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f5eB11",
    network: "ethereum-sepolia",
    label: "Low-risk test wallet",
    category: "low-risk",
    description: "Clean wallet with normal transaction patterns. Used for baseline testing.",
    expectedRiskScore: 85,
    simulatedFlags: [],
    tags: ["verified", "established", "normal-activity"],
  },
  {
    id: "sepolia-low-risk-2",
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    network: "ethereum-sepolia",
    label: "Established trading wallet",
    category: "low-risk",
    description: "Long-standing wallet with consistent trading activity.",
    expectedRiskScore: 90,
    simulatedFlags: [],
    tags: ["high-volume", "verified", "defi-user"],
  },

  // Ethereum Sepolia - Medium Risk
  {
    id: "sepolia-medium-risk-1",
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    network: "ethereum-sepolia",
    label: "Moderate activity wallet",
    category: "medium-risk",
    description: "Wallet with mixed signals - some unusual patterns detected.",
    expectedRiskScore: 55,
    simulatedFlags: ["moderate-activity", "recent-large-transfers"],
    tags: ["newer-wallet", "moderate-volume"],
  },

  // Ethereum Sepolia - High Risk
  {
    id: "sepolia-high-risk-1",
    address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    network: "ethereum-sepolia",
    label: "Suspicious wallet",
    category: "high-risk",
    description: "Wallet showing multiple risk indicators including rapid fund movements.",
    expectedRiskScore: 25,
    simulatedFlags: ["new-wallet", "rapid-fund-movement", "high-failure-rate"],
    tags: ["flagged", "under-review"],
  },

  // Ethereum Sepolia - Phishing Simulation
  {
    id: "sepolia-phishing-1",
    address: "0x1234567890AbcdEF1234567890aBcDeF12345678",
    network: "ethereum-sepolia",
    label: "Simulated phishing wallet",
    category: "phishing",
    description: "Educational simulation of a phishing wallet that receives drained funds.",
    expectedRiskScore: 10,
    simulatedFlags: ["known-phishing", "rapid-consolidation", "immediate-withdrawal"],
    tags: ["simulation", "educational", "phishing-pattern"],
  },

  // Ethereum Sepolia - Drainer Contract
  {
    id: "sepolia-drainer-1",
    address: "0xDeadBeef00000000000000000000000000000001",
    network: "ethereum-sepolia",
    label: "Simulated drainer contract",
    category: "drainer",
    description: "Educational simulation of a malicious approval drainer contract.",
    expectedRiskScore: 5,
    simulatedFlags: ["unverified-contract", "drainer-pattern", "unlimited-approvals"],
    tags: ["simulation", "educational", "drainer-contract"],
  },

  // Ethereum Sepolia - Honeypot
  {
    id: "sepolia-honeypot-1",
    address: "0xBadC0de000000000000000000000000000000001",
    network: "ethereum-sepolia",
    label: "Simulated honeypot token",
    category: "honeypot",
    description: "Educational simulation of a honeypot token contract that prevents selling.",
    expectedRiskScore: 8,
    simulatedFlags: ["honeypot-detected", "sell-blocked", "hidden-fees"],
    tags: ["simulation", "educational", "honeypot-pattern"],
  },

  // Ethereum Holesky
  {
    id: "holesky-low-risk-1",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    network: "ethereum-holesky",
    label: "Holesky test wallet",
    category: "low-risk",
    description: "Standard test wallet on Holesky testnet.",
    expectedRiskScore: 80,
    simulatedFlags: [],
    tags: ["holesky", "test-wallet"],
  },
  {
    id: "holesky-medium-risk-1",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    network: "ethereum-holesky",
    label: "Holesky active wallet",
    category: "medium-risk",
    description: "Active wallet with some unusual transaction patterns.",
    expectedRiskScore: 60,
    simulatedFlags: ["high-gas-usage", "frequent-contract-calls"],
    tags: ["holesky", "active"],
  },

  // Bitcoin Testnet
  {
    id: "btc-testnet-low-risk-1",
    address: "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
    network: "bitcoin-testnet",
    label: "BTC Testnet clean wallet",
    category: "low-risk",
    description: "Bitcoin testnet wallet with clean transaction history.",
    expectedRiskScore: 88,
    simulatedFlags: [],
    tags: ["bitcoin", "testnet", "clean"],
  },
  {
    id: "btc-testnet-medium-risk-1",
    address: "n3GNqMveyvaPvUbH469vDRadqpJMPc84JA",
    network: "bitcoin-testnet",
    label: "BTC Testnet mixer suspect",
    category: "medium-risk",
    description: "Wallet showing patterns consistent with mixing services.",
    expectedRiskScore: 45,
    simulatedFlags: ["mixing-detected", "privacy-tools"],
    tags: ["bitcoin", "testnet", "mixer-pattern"],
  },

  // Bitcoin Signet
  {
    id: "btc-signet-low-risk-1",
    address: "tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c",
    network: "bitcoin-signet",
    label: "Signet test wallet",
    category: "low-risk",
    description: "Clean wallet on Bitcoin Signet network.",
    expectedRiskScore: 85,
    simulatedFlags: [],
    tags: ["bitcoin", "signet", "clean"],
  },
];

export const getFixturesByNetwork = (network: TestnetNetwork): TestnetWalletFixture[] => {
  return TESTNET_WALLET_FIXTURES.filter(f => f.network === network);
};

export const getFixturesByCategory = (category: WalletRiskCategory): TestnetWalletFixture[] => {
  return TESTNET_WALLET_FIXTURES.filter(f => f.category === category);
};

export const getFixtureById = (id: string): TestnetWalletFixture | undefined => {
  return TESTNET_WALLET_FIXTURES.find(f => f.id === id);
};

export const getFixtureByAddress = (address: string): TestnetWalletFixture | undefined => {
  return TESTNET_WALLET_FIXTURES.find(
    f => f.address.toLowerCase() === address.toLowerCase()
  );
};

export const getLowRiskFixtures = (): TestnetWalletFixture[] => {
  return TESTNET_WALLET_FIXTURES.filter(f => f.category === "low-risk");
};

export const getMaliciousFixtures = (): TestnetWalletFixture[] => {
  return TESTNET_WALLET_FIXTURES.filter(
    f => ["phishing", "drainer", "honeypot", "high-risk"].includes(f.category)
  );
};
