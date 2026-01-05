import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  XCircle, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Server,
  Key,
  Database,
  Globe,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const complianceItems = [
  {
    category: "Data Handling",
    icon: Database,
    items: [
      { status: "compliant", text: "No private keys stored or generated" },
      { status: "compliant", text: "No wallet connection required" },
      { status: "compliant", text: "Addresses are input manually, not extracted" },
      { status: "compliant", text: "No persistent storage of analyzed addresses" },
    ],
  },
  {
    category: "Network Security",
    icon: Globe,
    items: [
      { status: "compliant", text: "Mainnet addresses are rejected at input" },
      { status: "compliant", text: "Only read-only RPC calls are made" },
      { status: "compliant", text: "No transaction signing capabilities" },
      { status: "compliant", text: "No broadcast functionality exists" },
    ],
  },
  {
    category: "Access Control",
    icon: Key,
    items: [
      { status: "compliant", text: "No authentication required for read-only features" },
      { status: "compliant", text: "No user data collected or stored" },
      { status: "compliant", text: "All analysis is stateless" },
      { status: "compliant", text: "No session tracking on blockchain queries" },
    ],
  },
  {
    category: "Simulation Mode",
    icon: Server,
    items: [
      { status: "compliant", text: "Attack simulations use predefined fixtures only" },
      { status: "compliant", text: "No real transactions are created" },
      { status: "compliant", text: "All results clearly labeled as simulated" },
      { status: "compliant", text: "Educational content reviewed for accuracy" },
    ],
  },
];

const auditTrail = [
  {
    action: "Address Input",
    description: "User pastes address manually",
    dataStored: "None (transient)",
    risk: "low",
  },
  {
    action: "Mainnet Check",
    description: "Client-side address validation",
    dataStored: "None",
    risk: "low",
  },
  {
    action: "RPC Query",
    description: "Read-only blockchain data fetch",
    dataStored: "None",
    risk: "low",
  },
  {
    action: "Risk Analysis",
    description: "Client-side scoring computation",
    dataStored: "None",
    risk: "low",
  },
  {
    action: "Display Results",
    description: "Render analysis in browser",
    dataStored: "None (memory only)",
    risk: "low",
  },
];

const securityAssumptions = [
  {
    title: "User Responsibility",
    description: "Users are responsible for verifying they are using testnet addresses. While CryptoArmor validates address formats, users should double-check before any real-world actions.",
  },
  {
    title: "RPC Provider Trust",
    description: "CryptoArmor relies on public RPC endpoints for blockchain data. Data accuracy depends on the reliability of these providers (Etherscan, Infura, etc.).",
  },
  {
    title: "Simulation Limitations",
    description: "Attack simulations are educational representations. Real attacks may vary in execution and detection may differ from simulated scenarios.",
  },
  {
    title: "Risk Score Accuracy",
    description: "Risk scores are based on known patterns and heuristics. Novel attack vectors or sophisticated threats may not be detected.",
  },
  {
    title: "No Security Guarantee",
    description: "CryptoArmor is a security training tool, not a security guarantee. Low-risk scores do not guarantee safety.",
  },
];

export default function TestnetCompliance() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="default">
            <FileText className="h-3 w-3 mr-1" />
            Compliance
          </Badge>
        </div>
        
        <h1 className="text-2xl font-display tracking-tight-display mb-2">
          Testing & Compliance Documentation
        </h1>
        
        <p className="text-sm text-muted-foreground max-w-xl">
          Security policies, data handling practices, and compliance documentation 
          for CryptoArmor's testnet-only operation mode.
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Executive Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Overview
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Zero Private Key Exposure</h4>
                  <p className="text-xs text-muted-foreground">
                    CryptoArmor never handles, stores, or generates private keys in any form.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Read-Only Architecture</h4>
                  <p className="text-xs text-muted-foreground">
                    All blockchain interaction is strictly read-only via public RPCs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Mainnet Blocked</h4>
                  <p className="text-xs text-muted-foreground">
                    Mainnet addresses are detected and rejected at the input layer.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">No Wallet Connection</h4>
                  <p className="text-xs text-muted-foreground">
                    Addresses are pasted manually. No wallet connection is ever requested.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Checklist */}
        <div>
          <h2 className="text-lg font-display tracking-tight-display mb-4">Compliance Checklist</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {complianceItems.map((category) => (
              <Card key={category.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Flow Audit */}
        <div>
          <h2 className="text-lg font-display tracking-tight-display mb-4">Data Flow Audit</h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left p-3 font-medium">Action</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">Data Stored</th>
                    <th className="text-left p-3 font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-3 font-mono text-xs">{row.action}</td>
                      <td className="p-3 text-muted-foreground text-xs">{row.description}</td>
                      <td className="p-3 text-xs">{row.dataStored}</td>
                      <td className="p-3">
                        <Badge 
                          variant={row.risk === "low" ? "success" : "warning"}
                          className="text-[10px]"
                        >
                          {row.risk}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Security Assumptions */}
        <div>
          <h2 className="text-lg font-display tracking-tight-display mb-4">Security Assumptions</h2>
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  The following assumptions underpin CryptoArmor's security model. Users and auditors 
                  should review these carefully.
                </p>
              </div>
              <div className="space-y-4">
                {securityAssumptions.map((assumption, index) => (
                  <div key={index} className="pl-8">
                    <h4 className="font-medium text-sm">{assumption.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assumption.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testnet Networks */}
        <div>
          <h2 className="text-lg font-display tracking-tight-display mb-4">Supported Testnets</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Ethereum Sepolia", chainId: "11155111", type: "EVM", status: "Active" },
              { name: "Ethereum Holesky", chainId: "17000", type: "EVM", status: "Active" },
              { name: "Bitcoin Testnet", chainId: "N/A", type: "UTXO", status: "Active" },
              { name: "Bitcoin Signet", chainId: "N/A", type: "UTXO", status: "Active" },
            ].map((network) => (
              <Card key={network.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{network.name}</h4>
                    <Badge variant="success" className="text-[10px]">{network.status}</Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">Chain ID: {network.chainId}</span>
                    <span>•</span>
                    <span>{network.type}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certification Statement */}
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Testnet-Only Certification</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              CryptoArmor is certified to operate exclusively on blockchain testnets. 
              No mainnet access, no real funds at risk, no private key handling.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="font-mono text-xs">
                v1.0.0
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Last reviewed: 2025-01-05
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border max-w-4xl">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4" />
          <p className="text-xs font-mono">
            CryptoArmor Compliance Documentation • Testnet Only • Read-Only Mode
          </p>
        </div>
      </div>
    </div>
  );
}
