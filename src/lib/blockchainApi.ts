import { supabase } from "@/integrations/supabase/client";

export interface AccountInfo {
  address: string;
  balance: string;
  txCount: number;
  isContract: boolean;
  contractName: string | null;
  isVerified: boolean;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  gasUsed: string;
  isError: string;
  functionName: string;
}

export interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  timeStamp: string;
}

export async function getAccountInfo(address: string): Promise<AccountInfo> {
  console.log(`Fetching account info for ${address}`);
  
  const { data, error } = await supabase.functions.invoke("blockchain-data", {
    body: { action: "accountinfo", address },
  });

  if (error) {
    console.error("Error fetching account info:", error);
    throw new Error(error.message);
  }

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch account info");
  }

  return data.data;
}

export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  console.log(`Fetching transaction history for ${address}`);
  
  const { data, error } = await supabase.functions.invoke("blockchain-data", {
    body: { action: "txlist", address },
  });

  if (error) {
    console.error("Error fetching transactions:", error);
    return []; // Return empty array instead of throwing
  }

  if (!data.success) {
    console.error("Transaction fetch failed:", data.error);
    return []; // Return empty array instead of throwing
  }

  return Array.isArray(data.data) ? data.data : [];
}

export async function getTokenTransfers(address: string): Promise<TokenTransfer[]> {
  console.log(`Fetching token transfers for ${address}`);
  
  const { data, error } = await supabase.functions.invoke("blockchain-data", {
    body: { action: "tokentx", address },
  });

  if (error) {
    console.error("Error fetching token transfers:", error);
    return [];
  }

  if (!data.success) {
    return [];
  }

  return Array.isArray(data.data) ? data.data : [];
}

export async function getBalance(address: string): Promise<string> {
  console.log(`Fetching balance for ${address}`);
  
  const { data, error } = await supabase.functions.invoke("blockchain-data", {
    body: { action: "balance", address },
  });

  if (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }

  if (!data.success) {
    return "0";
  }

  // Convert wei to ETH
  try {
    const balanceWei = BigInt(data.data || "0");
    return (Number(balanceWei) / 1e18).toFixed(6);
  } catch {
    return "0";
  }
}

// Risk analysis based on real blockchain data
export interface RiskAnalysisResult {
  overallRisk: "low" | "medium" | "high" | "critical";
  reputationScore: number;
  to: string;
  value: string;
  riskFactors: RiskFactor[];
  contractInfo: {
    isContract: boolean;
    verified: boolean;
    name?: string;
  };
  accountAge: string;
  txCount: number;
}

interface RiskFactor {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
}

export async function analyzeTransaction(
  toAddress: string,
  value: string,
  calldata: string
): Promise<RiskAnalysisResult> {
  console.log(`Analyzing transaction to ${toAddress}`);

  try {
    // Fetch real blockchain data with graceful fallbacks
    const [accountInfo, transactions] = await Promise.all([
      getAccountInfo(toAddress),
      getTransactionHistory(toAddress),
    ]);

    const riskFactors: RiskFactor[] = [];
    let baseScore = 100;

    // Check if it's a contract
    if (accountInfo.isContract) {
      if (!accountInfo.isVerified) {
        riskFactors.push({
          id: "unverified-contract",
          category: "Verification",
          title: "Unverified Contract Code",
          description: "Contract source code is not verified on Etherscan. Unable to audit behavior.",
          severity: "high",
          score: 25,
        });
        baseScore -= 25;
      } else {
        riskFactors.push({
          id: "verified-contract",
          category: "Verification",
          title: "Verified Contract",
          description: `Contract "${accountInfo.contractName || 'Unknown'}" is verified on Etherscan.`,
          severity: "low",
          score: 0,
        });
      }
    }

    // Check transaction count (low count = potentially new/suspicious)
    const txCount = accountInfo.txCount || 0;
    if (txCount < 10) {
      riskFactors.push({
        id: "low-tx-count",
        category: "Activity",
        title: "Low Transaction Activity",
        description: `Only ${txCount} transactions found. New or inactive address.`,
        severity: "medium",
        score: 15,
      });
      baseScore -= 15;
    } else if (txCount < 50) {
      riskFactors.push({
        id: "moderate-tx-count",
        category: "Activity",
        title: "Moderate Transaction Activity",
        description: `${txCount} transactions found. Address shows some activity.`,
        severity: "low",
        score: 5,
      });
      baseScore -= 5;
    }

    // Check balance
    const balanceEth = parseFloat(accountInfo.balance || "0");
    if (accountInfo.isContract && balanceEth === 0 && !accountInfo.isVerified) {
      riskFactors.push({
        id: "empty-unverified",
        category: "Balance",
        title: "Empty Unverified Contract",
        description: "Contract has zero balance and unverified code. High risk of scam.",
        severity: "critical",
        score: 30,
      });
      baseScore -= 30;
    }

    // Check for failed transactions in history
    if (transactions.length > 0) {
      const failedTxCount = transactions.filter((tx: Transaction) => tx.isError === "1").length;
      const failRate = failedTxCount / transactions.length;
      
      if (failRate > 0.3) {
        riskFactors.push({
          id: "high-fail-rate",
          category: "History",
          title: "High Transaction Failure Rate",
          description: `${Math.round(failRate * 100)}% of recent transactions failed. May indicate issues.`,
          severity: "high",
          score: 20,
        });
        baseScore -= 20;
      }
    }

    // Check calldata for common patterns
    if (calldata) {
      // Check for approve function with unlimited amount
      if (calldata.toLowerCase().startsWith("0x095ea7b3") && 
          calldata.toLowerCase().includes("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")) {
        riskFactors.push({
          id: "unlimited-approval",
          category: "Approval",
          title: "Unlimited Token Approval",
          description: "This transaction grants unlimited spending permission. Attacker can drain entire token balance.",
          severity: "critical",
          score: 35,
        });
        baseScore -= 35;
      }
    }

    // Check value
    const valueEth = parseFloat(value || "0");
    if (valueEth > 10) {
      riskFactors.push({
        id: "high-value",
        category: "Value",
        title: "High Value Transaction",
        description: `Sending ${value} ETH. Consider splitting into smaller transactions.`,
        severity: "medium",
        score: 10,
      });
      baseScore -= 10;
    }

    // Calculate wallet age from first transaction
    let accountAge = "Unknown";
    if (transactions.length > 0) {
      const oldestTx = transactions[transactions.length - 1];
      if (oldestTx?.timeStamp) {
        const firstTxDate = new Date(parseInt(oldestTx.timeStamp) * 1000);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
          accountAge = `${daysDiff} days`;
          riskFactors.push({
            id: "new-account",
            category: "Age",
            title: "Newly Active Address",
            description: "First transaction was less than a week ago. Exercise caution.",
            severity: "high",
            score: 20,
          });
          baseScore -= 20;
        } else if (daysDiff < 30) {
          accountAge = `${daysDiff} days`;
        } else if (daysDiff < 365) {
          accountAge = `${Math.floor(daysDiff / 30)} months`;
        } else {
          accountAge = `${(daysDiff / 365).toFixed(1)} years`;
        }
      }
    }

    // Determine overall risk level
    const finalScore = Math.max(0, Math.min(100, baseScore));
    let overallRisk: "low" | "medium" | "high" | "critical";
    
    if (finalScore >= 80) overallRisk = "low";
    else if (finalScore >= 60) overallRisk = "medium";
    else if (finalScore >= 40) overallRisk = "high";
    else overallRisk = "critical";

    return {
      overallRisk,
      reputationScore: finalScore,
      to: toAddress,
      value: value || "0",
      riskFactors: riskFactors.filter(f => f.score > 0 || f.severity === "low"),
      contractInfo: {
        isContract: accountInfo.isContract,
        verified: accountInfo.isVerified,
        name: accountInfo.contractName || undefined,
      },
      accountAge,
      txCount,
    };
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    throw error;
  }
}
