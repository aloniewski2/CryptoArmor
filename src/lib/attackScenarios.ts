// Attack scenario data for Testing & Simulation Mode

export type AttackType = "approval-drain" | "phishing-contract" | "impersonation" | "honeypot";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface AttackStep {
  id: number;
  phase: "user-action" | "attacker-trigger" | "asset-movement" | "loss-outcome";
  title: string;
  description: string;
  detectedFlags: string[];
  isDetected: boolean;
}

export interface AttackScenario {
  id: AttackType;
  name: string;
  category: string;
  severity: RiskLevel;
  shortDescription: string;
  fullDescription: string;
  attackVector: string[];
  simulatedTx: {
    to: string;
    value: string;
    data: string;
  };
  steps: AttackStep[];
  historicalCases: number;
  totalLost: string;
  detectionSignals: string[];
  riskScore: number;
}

export const attackScenarios: AttackScenario[] = [
  {
    id: "approval-drain",
    name: "Unlimited Token Approval Drain",
    category: "Token Approval Exploit",
    severity: "critical",
    shortDescription: "Malicious contract requests unlimited spending permission, enabling complete wallet drain at any time.",
    fullDescription: "This attack exploits the ERC-20 token approval mechanism. When you interact with a DeFi protocol, you often need to approve it to spend your tokens. Attackers create malicious contracts that request 'unlimited' approval (type(uint256).max). Once approved, they can drain your entire token balance at any time in the future—even months later.",
    attackVector: [
      "User visits a fake DEX or airdrop claim site",
      "Site requests token approval for interaction",
      "Approval amount is set to maximum (unlimited)",
      "Attacker monitors for approvals and drains wallets"
    ],
    simulatedTx: {
      to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
      value: "0",
      data: "0x095ea7b3000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    },
    steps: [
      {
        id: 1,
        phase: "user-action",
        title: "User Initiates Token Approval",
        description: "User clicks 'Approve USDC' on what appears to be a legitimate DeFi interface. The transaction requests unlimited spending permission.",
        detectedFlags: ["Unlimited approval detected (MAX_UINT256)", "First interaction with this contract"],
        isDetected: true
      },
      {
        id: 2,
        phase: "attacker-trigger",
        title: "Approval Transaction Confirmed",
        description: "The approval transaction is confirmed on-chain. The malicious contract now has permission to transfer any amount of the user's USDC.",
        detectedFlags: ["Unverified contract source code", "Contract age < 7 days"],
        isDetected: true
      },
      {
        id: 3,
        phase: "asset-movement",
        title: "Attacker Executes transferFrom",
        description: "Hours or days later, the attacker calls transferFrom() to move the user's entire USDC balance to their wallet.",
        detectedFlags: ["Large value transfer initiated", "Transfer to new wallet address"],
        isDetected: true
      },
      {
        id: 4,
        phase: "loss-outcome",
        title: "Complete Token Balance Drained",
        description: "User's entire USDC balance is transferred to the attacker. Funds are quickly bridged to another chain or mixed.",
        detectedFlags: ["Immediate bridge/mixer interaction", "Funds sent to flagged address"],
        isDetected: true
      }
    ],
    historicalCases: 45678,
    totalLost: "$1.2B+",
    detectionSignals: [
      "Unlimited approval amount (MAX_UINT256)",
      "Unverified contract requesting approval",
      "Contract deployed within last 30 days",
      "No prior transaction history with this contract",
      "Known approval exploit signature pattern"
    ],
    riskScore: 92
  },
  {
    id: "phishing-contract",
    name: "Phishing Smart Contract",
    category: "Social Engineering",
    severity: "critical",
    shortDescription: "Fake DApp contract mimics legitimate protocols to steal funds through deceptive function calls.",
    fullDescription: "Attackers deploy smart contracts that visually and functionally mimic popular DeFi protocols. These contracts contain hidden malicious functions that transfer funds to the attacker when users interact with seemingly normal operations like 'claim', 'stake', or 'swap'.",
    attackVector: [
      "Attacker creates convincing clone of popular DApp",
      "Users directed via phishing emails or fake ads",
      "Contract functions appear normal but contain hidden transfers",
      "Funds routed to attacker's wallet upon execution"
    ],
    simulatedTx: {
      to: "0x1234567890abcdef1234567890abcdef12345678",
      value: "0.5",
      data: "0x3ccfd60b000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000"
    },
    steps: [
      {
        id: 1,
        phase: "user-action",
        title: "User Connects to Fake DApp",
        description: "User finds a 'limited time airdrop claim' link and connects their wallet to what appears to be the official protocol website.",
        detectedFlags: ["Domain differs from official protocol", "Contract address not in verified registry"],
        isDetected: true
      },
      {
        id: 2,
        phase: "attacker-trigger",
        title: "Malicious Claim Function Called",
        description: "User clicks 'Claim Airdrop'. The function name suggests receiving tokens, but the contract code actually transfers ETH to the attacker.",
        detectedFlags: ["Function transfers value out despite name suggesting inbound", "ETH being sent in 'claim' operation"],
        isDetected: true
      },
      {
        id: 3,
        phase: "asset-movement",
        title: "ETH Transferred to Attacker",
        description: "The transaction executes, sending the user's ETH to a wallet controlled by the attacker. Multiple other victims' funds accumulate in the same address.",
        detectedFlags: ["Destination wallet received funds from multiple victims", "Pattern matches known phishing address"],
        isDetected: true
      },
      {
        id: 4,
        phase: "loss-outcome",
        title: "Funds Laundered Through Mixer",
        description: "Attacker quickly moves stolen funds through Tornado Cash or similar mixer to obscure the trail. Recovery becomes extremely difficult.",
        detectedFlags: ["Immediate mixer deposit detected", "Transaction finality prevents reversal"],
        isDetected: true
      }
    ],
    historicalCases: 67890,
    totalLost: "$540M+",
    detectionSignals: [
      "Contract not verified on Etherscan",
      "Domain URL differs from official protocol",
      "ETH value sent in 'claim' type function",
      "Destination address linked to other scam reports",
      "Contract created within 48 hours"
    ],
    riskScore: 88
  },
  {
    id: "impersonation",
    name: "Impersonation Wallet Transfer",
    category: "Address Poisoning",
    severity: "high",
    shortDescription: "Attacker creates lookalike addresses to intercept transfers through transaction history poisoning.",
    fullDescription: "Address poisoning exploits user behavior of copying addresses from transaction history. Attackers send zero-value transactions from addresses that match the first and last characters of addresses you frequently interact with. When you copy from history, you may accidentally copy the attacker's lookalike address.",
    attackVector: [
      "Attacker generates vanity addresses matching victim's contacts",
      "Zero-value transactions sent to poison tx history",
      "User copies address from history without full verification",
      "Real funds sent to attacker's lookalike address"
    ],
    simulatedTx: {
      to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      value: "25.0",
      data: "0x"
    },
    steps: [
      {
        id: 1,
        phase: "user-action",
        title: "User Checks Transaction History",
        description: "User wants to send ETH to their hardware wallet. They open their transaction history to copy the familiar address starting with 0x71C7...976F.",
        detectedFlags: ["Similar addresses detected in recent history", "Multiple addresses with matching prefix/suffix"],
        isDetected: true
      },
      {
        id: 2,
        phase: "attacker-trigger",
        title: "Poisoned Address Copied",
        description: "Unknown to the user, a zero-value transaction from 0x71C7...976F (attacker's lookalike) appeared in history yesterday. User copies the wrong address.",
        detectedFlags: ["Destination never received value from this wallet", "Address received zero-value tx recently"],
        isDetected: true
      },
      {
        id: 3,
        phase: "asset-movement",
        title: "Large Transfer to Attacker",
        description: "User confirms the 25 ETH transfer. The funds go to the attacker's address instead of the intended hardware wallet.",
        detectedFlags: ["First high-value transfer to this address", "Address flagged in poisoning database"],
        isDetected: true
      },
      {
        id: 4,
        phase: "loss-outcome",
        title: "Irreversible Loss",
        description: "Transaction is confirmed on-chain. The attacker moves funds immediately. The similarity in addresses makes the mistake nearly invisible until it's too late.",
        detectedFlags: ["Funds moved within 2 blocks", "Destination is confirmed poisoning address"],
        isDetected: true
      }
    ],
    historicalCases: 23456,
    totalLost: "$380M+",
    detectionSignals: [
      "Address matches pattern of recent zero-value sender",
      "First significant transaction to this address",
      "Address created recently with vanity prefix/suffix",
      "Multiple poisoning attempts from similar addresses",
      "Known address poisoning campaign detected"
    ],
    riskScore: 76
  },
  {
    id: "honeypot",
    name: "Honeypot Token Trap",
    category: "Token Scam",
    severity: "critical",
    shortDescription: "Token contract allows buying but prevents selling, trapping investors' funds permanently.",
    fullDescription: "Honeypot tokens are designed with modified transfer functions that allow anyone to buy but prevent selling. The contract may include hidden owner functions, excessive sell taxes (90%+), or blacklist mechanisms. Charts show constant buying with no sells, creating artificial price increases that attract more victims.",
    attackVector: [
      "Attacker deploys token with hidden sell restrictions",
      "Initial liquidity added and marketing begins",
      "Buyers purchase tokens seeing 'bullish' chart",
      "Sell attempts fail or result in near-total loss"
    ],
    simulatedTx: {
      to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
      value: "2.0",
      data: "0x7ff36ab5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000065a1234"
    },
    steps: [
      {
        id: 1,
        phase: "user-action",
        title: "User Discovers 'Pumping' Token",
        description: "User sees a token on DEX screeners with 500% gains and no sell transactions. They decide to buy 2 ETH worth through Uniswap.",
        detectedFlags: ["Token contract not verified", "No sell transactions in contract history"],
        isDetected: true
      },
      {
        id: 2,
        phase: "attacker-trigger",
        title: "Buy Transaction Succeeds",
        description: "The swap executes successfully. User receives tokens. The contract's buy function works normally to attract victims.",
        detectedFlags: ["Asymmetric buy/sell in contract code", "Hidden fee modification functions"],
        isDetected: true
      },
      {
        id: 3,
        phase: "asset-movement",
        title: "Sell Transaction Fails",
        description: "User tries to take profit. Every sell attempt fails with 'transfer failed' error. The contract's blacklist or tax mechanism blocks all sales.",
        detectedFlags: ["Sell tax > 50% detected", "Transfer function has conditional blocks"],
        isDetected: true
      },
      {
        id: 4,
        phase: "loss-outcome",
        title: "Liquidity Rug & Token Worthless",
        description: "Developer removes liquidity pool. Even if selling was possible, the token is now worth nothing. Initial 2 ETH investment is completely lost.",
        detectedFlags: ["Liquidity removal detected", "LP tokens not locked"],
        isDetected: true
      }
    ],
    historicalCases: 12847,
    totalLost: "$890M+",
    detectionSignals: [
      "No verified source code on block explorer",
      "0 successful sell transactions",
      "Hidden owner/admin functions in bytecode",
      "Liquidity pool tokens not locked",
      "Contract includes blacklist mechanism",
      "Sell tax exceeds 25%"
    ],
    riskScore: 95
  }
];

export function getScenarioById(id: AttackType): AttackScenario | undefined {
  return attackScenarios.find(scenario => scenario.id === id);
}

export function getPhaseColor(phase: AttackStep["phase"]): string {
  switch (phase) {
    case "user-action": return "primary";
    case "attacker-trigger": return "warning";
    case "asset-movement": return "destructive";
    case "loss-outcome": return "destructive";
    default: return "muted";
  }
}

export function getPhaseIcon(phase: AttackStep["phase"]): string {
  switch (phase) {
    case "user-action": return "User";
    case "attacker-trigger": return "Zap";
    case "asset-movement": return "ArrowRightLeft";
    case "loss-outcome": return "Skull";
    default: return "Circle";
  }
}
