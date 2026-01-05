import { supabase } from "@/integrations/supabase/client";
import { TestnetNetwork, getNetworkConfig } from "./networks";
import { getFixtureByAddress, TestnetWalletFixture } from "./fixtures";

export interface TestnetAccountInfo {
  address: string;
  balance: string;
  txCount: number;
  isContract: boolean;
  contractName: string | null;
  isVerified: boolean;
  network: TestnetNetwork;
}

export interface TestnetTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  gasUsed: string;
  isError: string;
  functionName: string;
  network: TestnetNetwork;
}

export interface TestnetRiskAnalysis {
  address: string;
  network: TestnetNetwork;
  overallRisk: "low" | "medium" | "high" | "critical";
  riskScore: number;
  flags: string[];
  factors: {
    name: string;
    impact: number;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
  }[];
  isSimulated: boolean;
  fixture?: TestnetWalletFixture;
  accountInfo?: TestnetAccountInfo;
  transactions?: TestnetTransaction[];
}

// Fetch testnet account info via edge function
export async function getTestnetAccountInfo(
  address: string,
  network: TestnetNetwork
): Promise<TestnetAccountInfo> {
  console.log(`[Testnet] Fetching account info for ${address} on ${network}`);
  
  const networkConfig = getNetworkConfig(network);
  
  // For Bitcoin networks, return mock data (would need separate API integration)
  if (!networkConfig.isEVM) {
    return {
      address,
      balance: "0.5",
      txCount: 15,
      isContract: false,
      contractName: null,
      isVerified: false,
      network,
    };
  }

  const { data, error } = await supabase.functions.invoke("testnet-blockchain-data", {
    body: { action: "accountinfo", address, network },
  });

  if (error) {
    console.error("[Testnet] Error fetching account info:", error);
    throw new Error(error.message);
  }

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch testnet account info");
  }

  return { ...data.data, network };
}

// Fetch testnet transaction history
export async function getTestnetTransactionHistory(
  address: string,
  network: TestnetNetwork
): Promise<TestnetTransaction[]> {
  console.log(`[Testnet] Fetching transactions for ${address} on ${network}`);
  
  const networkConfig = getNetworkConfig(network);
  
  if (!networkConfig.isEVM) {
    // Return mock transactions for Bitcoin networks
    return [];
  }

  const { data, error } = await supabase.functions.invoke("testnet-blockchain-data", {
    body: { action: "txlist", address, network },
  });

  if (error) {
    console.error("[Testnet] Error fetching transactions:", error);
    return [];
  }

  if (!data.success) {
    return [];
  }

  return (data.data || []).map((tx: TestnetTransaction) => ({ ...tx, network }));
}

// Analyze testnet wallet risk
export async function analyzeTestnetWallet(
  address: string,
  network: TestnetNetwork
): Promise<TestnetRiskAnalysis> {
  console.log(`[Testnet] Analyzing wallet ${address} on ${network}`);
  
  // Check if this is a fixture wallet first
  const fixture = getFixtureByAddress(address);
  
  if (fixture) {
    // Return simulated data based on fixture
    return {
      address: fixture.address,
      network: fixture.network,
      overallRisk: getRiskLevelFromScore(fixture.expectedRiskScore),
      riskScore: fixture.expectedRiskScore,
      flags: fixture.simulatedFlags,
      factors: generateFactorsFromFixture(fixture),
      isSimulated: true,
      fixture,
    };
  }

  // Fetch real testnet data
  try {
    const [accountInfo, transactions] = await Promise.all([
      getTestnetAccountInfo(address, network),
      getTestnetTransactionHistory(address, network),
    ]);

    const analysis = calculateRiskFromData(accountInfo, transactions, network);
    
    return {
      ...analysis,
      isSimulated: false,
      accountInfo,
      transactions,
    };
  } catch (error) {
    console.error("[Testnet] Analysis error:", error);
    // Return a default analysis on error
    return {
      address,
      network,
      overallRisk: "medium",
      riskScore: 50,
      flags: ["Unable to fetch blockchain data"],
      factors: [{
        name: "Data Unavailable",
        impact: 0,
        description: "Could not retrieve blockchain data for analysis",
        severity: "medium",
      }],
      isSimulated: false,
    };
  }
}

// Helper functions
function getRiskLevelFromScore(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 70) return "low";
  if (score >= 50) return "medium";
  if (score >= 25) return "high";
  return "critical";
}

function generateFactorsFromFixture(fixture: TestnetWalletFixture) {
  const factors: TestnetRiskAnalysis["factors"] = [];
  
  if (fixture.simulatedFlags.includes("new-wallet")) {
    factors.push({
      name: "Wallet Age",
      impact: -20,
      description: "Newly created wallet with limited history",
      severity: "high",
    });
  }
  
  if (fixture.simulatedFlags.includes("unverified-contract")) {
    factors.push({
      name: "Contract Verification",
      impact: -30,
      description: "Smart contract code is not verified",
      severity: "critical",
    });
  }
  
  if (fixture.simulatedFlags.includes("drainer-pattern")) {
    factors.push({
      name: "Drainer Pattern Detected",
      impact: -40,
      description: "Contract exhibits known drainer behavior patterns",
      severity: "critical",
    });
  }
  
  if (fixture.simulatedFlags.includes("known-phishing")) {
    factors.push({
      name: "Known Phishing Address",
      impact: -50,
      description: "Address is associated with known phishing campaigns",
      severity: "critical",
    });
  }
  
  if (fixture.simulatedFlags.includes("honeypot-detected")) {
    factors.push({
      name: "Honeypot Token",
      impact: -45,
      description: "Token contract prevents selling or has hidden fees",
      severity: "critical",
    });
  }
  
  if (fixture.simulatedFlags.includes("rapid-fund-movement")) {
    factors.push({
      name: "Rapid Fund Movement",
      impact: -15,
      description: "Unusual speed of fund transfers detected",
      severity: "high",
    });
  }
  
  if (fixture.category === "low-risk") {
    factors.push({
      name: "Established History",
      impact: 10,
      description: "Wallet has consistent, long-term activity",
      severity: "low",
    });
  }
  
  return factors;
}

function calculateRiskFromData(
  accountInfo: TestnetAccountInfo,
  transactions: TestnetTransaction[],
  network: TestnetNetwork
): Omit<TestnetRiskAnalysis, "isSimulated" | "fixture" | "accountInfo" | "transactions"> {
  let score = 100;
  const flags: string[] = [];
  const factors: TestnetRiskAnalysis["factors"] = [];

  // Transaction count analysis
  if (accountInfo.txCount < 5) {
    score -= 20;
    flags.push("Low transaction count");
    factors.push({
      name: "Transaction Volume",
      impact: -20,
      description: "Very few transactions on record",
      severity: "high",
    });
  } else if (accountInfo.txCount < 20) {
    score -= 10;
    factors.push({
      name: "Transaction Volume",
      impact: -10,
      description: "Moderate transaction history",
      severity: "medium",
    });
  } else {
    factors.push({
      name: "Transaction Volume",
      impact: 5,
      description: "Good transaction history",
      severity: "low",
    });
  }

  // Contract verification
  if (accountInfo.isContract) {
    if (!accountInfo.isVerified) {
      score -= 25;
      flags.push("Unverified contract");
      factors.push({
        name: "Contract Verification",
        impact: -25,
        description: "Contract source code not verified",
        severity: "high",
      });
    } else {
      factors.push({
        name: "Contract Verification",
        impact: 10,
        description: "Contract is verified",
        severity: "low",
      });
    }
  }

  // Balance check
  const balance = parseFloat(accountInfo.balance);
  if (balance === 0 && accountInfo.isContract && !accountInfo.isVerified) {
    score -= 15;
    flags.push("Empty unverified contract");
    factors.push({
      name: "Balance Status",
      impact: -15,
      description: "Contract has zero balance",
      severity: "medium",
    });
  }

  // Failed transactions
  if (transactions.length > 0) {
    const failedCount = transactions.filter(tx => tx.isError === "1").length;
    const failRate = failedCount / transactions.length;
    
    if (failRate > 0.3) {
      score -= 15;
      flags.push("High failure rate");
      factors.push({
        name: "Transaction Failures",
        impact: -15,
        description: `${Math.round(failRate * 100)}% transaction failure rate`,
        severity: "high",
      });
    }
  }

  return {
    address: accountInfo.address,
    network,
    overallRisk: getRiskLevelFromScore(Math.max(0, score)),
    riskScore: Math.max(0, Math.min(100, score)),
    flags,
    factors,
  };
}
