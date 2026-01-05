// Simulated data for demonstration purposes
// In production, this would be replaced with real blockchain analysis

export interface ScamPattern {
  id: string;
  name: string;
  category: string;
  severity: "medium" | "high" | "critical";
  description: string;
  indicators: string[];
  historicalCases: number;
  totalLost: string;
}

export const scamPatterns: ScamPattern[] = [
  {
    id: "honeypot",
    name: "Honeypot Token",
    category: "Token Scam",
    severity: "critical",
    description: "Smart contract designed to prevent selling after purchase. Users can buy but cannot sell tokens.",
    indicators: [
      "Modified transfer function with seller restrictions",
      "Hidden ownership functions",
      "Blacklist mechanisms targeting sellers",
      "Unusual tax structures (>50% sell tax)"
    ],
    historicalCases: 12847,
    totalLost: "$890M+"
  },
  {
    id: "rug-pull",
    name: "Rug Pull",
    category: "Liquidity Scam",
    severity: "critical",
    description: "Developer removes all liquidity from a trading pair, leaving token holders with worthless assets.",
    indicators: [
      "Unlocked liquidity pools",
      "Single wallet controls >50% of liquidity",
      "No liquidity lock timelock",
      "Anonymous team with new wallets"
    ],
    historicalCases: 8234,
    totalLost: "$2.8B+"
  },
  {
    id: "approval-drain",
    name: "Token Approval Exploit",
    category: "Approval Attack",
    severity: "high",
    description: "Malicious contract requests unlimited token approval, then drains user wallets at a later time.",
    indicators: [
      "Unlimited approval requests (type(uint256).max)",
      "Approval to unverified contracts",
      "Batch approval requests",
      "Approval through phishing sites"
    ],
    historicalCases: 45678,
    totalLost: "$1.2B+"
  },
  {
    id: "address-poisoning",
    name: "Address Poisoning",
    category: "Social Engineering",
    severity: "high",
    description: "Attacker sends small transactions from similar-looking addresses to trick users into copying the wrong address.",
    indicators: [
      "Addresses with matching first/last characters",
      "Zero-value or dust transactions",
      "Recent address with no history",
      "Multiple poisoning attempts to same target"
    ],
    historicalCases: 23456,
    totalLost: "$380M+"
  },
  {
    id: "flash-loan-attack",
    name: "Flash Loan Attack",
    category: "DeFi Exploit",
    severity: "critical",
    description: "Attacker uses flash loans to manipulate prices or exploit vulnerable protocols within a single transaction.",
    indicators: [
      "Large flash loan initiation",
      "Multiple protocol interactions",
      "Price oracle manipulation",
      "Unusual swap patterns"
    ],
    historicalCases: 342,
    totalLost: "$1.1B+"
  },
  {
    id: "phishing-signature",
    name: "Malicious Signature Request",
    category: "Phishing",
    severity: "high",
    description: "User is tricked into signing a message that authorizes token transfers or NFT sales.",
    indicators: [
      "eth_sign or personal_sign requests",
      "Seaport/OpenSea signature types",
      "Permit signature requests",
      "Off-chain signature requests"
    ],
    historicalCases: 67890,
    totalLost: "$540M+"
  }
];

export interface WalletReputation {
  address: string;
  score: number;
  label?: string;
  age: string;
  txCount: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  flags: string[];
  interactionHistory: {
    protocol: string;
    type: string;
    count: number;
  }[];
}

export function generateMockWalletReputation(address: string): WalletReputation {
  // Simulate different reputation based on address patterns
  const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseScore = 40 + (addressSum % 50);
  
  const factors = [
    {
      name: "Wallet Age",
      impact: baseScore > 70 ? 15 : -10,
      description: baseScore > 70 ? "Wallet active for 2+ years" : "Wallet less than 30 days old"
    },
    {
      name: "Transaction Volume",
      impact: 10,
      description: "Normal transaction frequency"
    },
    {
      name: "Contract Interactions",
      impact: baseScore > 60 ? 8 : -5,
      description: baseScore > 60 ? "Interacts with verified protocols" : "Limited protocol interaction"
    },
    {
      name: "Exploit Adjacency",
      impact: baseScore > 50 ? 0 : -15,
      description: baseScore > 50 ? "No connection to known exploits" : "1-hop from flagged address"
    }
  ];

  return {
    address,
    score: Math.min(100, Math.max(0, baseScore)),
    label: baseScore > 80 ? "Trusted Trader" : baseScore > 60 ? undefined : "Caution",
    age: baseScore > 70 ? "2.3 years" : "24 days",
    txCount: 100 + (addressSum % 5000),
    factors,
    flags: baseScore < 50 ? ["New wallet", "Large value transfer", "Interacted with flagged contract"] : [],
    interactionHistory: [
      { protocol: "Uniswap", type: "Swap", count: 45 },
      { protocol: "Aave", type: "Lending", count: 12 },
      { protocol: "OpenSea", type: "NFT Trade", count: 8 }
    ]
  };
}

export function generateMockAnalysis(to: string, value: string, data: string) {
  const hasApproval = data.toLowerCase().includes("095ea7b3") || data.toLowerCase().includes("a9059cbb");
  const isUnlimited = data.toLowerCase().includes("ffffffff");
  
  const addressSum = to.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseRisk = addressSum % 100;
  
  let overallRisk: "low" | "medium" | "high" | "critical";
  if (baseRisk < 25) overallRisk = "low";
  else if (baseRisk < 50) overallRisk = "medium";
  else if (baseRisk < 75) overallRisk = "high";
  else overallRisk = "critical";

  const riskFactors = [];
  
  if (hasApproval && isUnlimited) {
    riskFactors.push({
      id: "unlimited-approval",
      category: "Approval",
      title: "Unlimited Token Approval",
      description: "This transaction grants unlimited spending permission. Attacker can drain entire token balance.",
      severity: "critical" as const,
      score: 35
    });
  }

  if (baseRisk > 50) {
    riskFactors.push({
      id: "new-contract",
      category: "Contract",
      title: "Recently Deployed Contract",
      description: "Target contract was deployed less than 7 days ago. Limited transaction history available.",
      severity: "high" as const,
      score: 20
    });
  }

  if (parseFloat(value) > 1) {
    riskFactors.push({
      id: "high-value",
      category: "Value",
      title: "High Value Transaction",
      description: `Sending ${value} ETH. Consider splitting into smaller transactions.`,
      severity: "medium" as const,
      score: 10
    });
  }

  if (baseRisk > 30) {
    riskFactors.push({
      id: "unverified",
      category: "Verification",
      title: "Unverified Contract Code",
      description: "Contract source code is not verified on block explorer. Unable to audit behavior.",
      severity: "medium" as const,
      score: 15
    });
  }

  const reputationScore = Math.max(0, 100 - riskFactors.reduce((sum, f) => sum + f.score, 0));

  return {
    overallRisk,
    reputationScore,
    to,
    value: value || "0",
    riskFactors,
    contractInfo: {
      isContract: baseRisk > 40,
      verified: baseRisk < 30,
      name: baseRisk < 30 ? "Uniswap V3: Router" : undefined
    },
    approvalRisk: hasApproval && isUnlimited ? {
      hasUnlimitedApproval: true,
      tokenSymbol: "USDC",
      maxDrain: "125,000 USDC"
    } : undefined
  };
}
