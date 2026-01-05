import { RiskBadge } from "@/components/ui/RiskBadge";
import { scamPatterns } from "@/lib/mockData";
import { Shield, AlertTriangle, FileText, Code, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "testnet-policy", label: "Testnet Policy" },
  { id: "threat-model", label: "Threat Model" },
  { id: "scam-patterns", label: "Scam Patterns" },
  { id: "limitations", label: "Limitations" },
  { id: "api", label: "API Reference" },
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="flex gap-8 max-w-5xl">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-8 space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Contents
            </h3>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block px-3 py-1.5 text-sm rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {section.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-2xl">
          {/* Overview Section */}
          <section id="overview" className="mb-12">
            <h1 className="text-2xl font-display tracking-tight-display mb-3">Documentation</h1>
            <p className="text-sm text-muted-foreground mb-6">
              TxnGuard provides pre-transaction risk analysis to help users, exchanges, and compliance 
              teams evaluate the safety of cryptocurrency transactions before execution.
            </p>

            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Demonstration Notice</h3>
                    <p className="text-xs text-muted-foreground">
                      This is a demonstration application. All data shown is simulated and should not 
                      be used for actual security decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: Shield, title: "Transaction Scanner", desc: "Analyze transactions before signing" },
                { icon: FileText, title: "Wallet Reputation", desc: "Score wallets based on behavior" },
                { icon: AlertTriangle, title: "Approval Analysis", desc: "Detect dangerous token approvals" },
                { icon: BookOpen, title: "Scam Library", desc: "Database of known attack patterns" },
              ].map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-4">
                    <item.icon className="h-4 w-4 text-primary mb-2" />
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Testnet Policy Section */}
          <section id="testnet-policy" className="mb-12">
            <h2 className="text-xl font-display tracking-tight-display mb-3">Testnet Policy</h2>
            <p className="text-sm text-muted-foreground mb-4">
              TxnGuard operates exclusively on testnet networks to ensure user safety during security training.
            </p>

            <Card className="border-primary/20 bg-primary/5 mb-4">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">Why Testnets Only?</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span><strong>No Financial Risk:</strong> Testnet tokens have no monetary value.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Read-Only Mode:</strong> No wallet signing or transaction broadcasting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span><strong>No Private Keys:</strong> TxnGuard never handles private keys.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Mainnet Blocking:</strong> System rejects mainnet addresses.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: "Ethereum Sepolia", type: "EVM", chainId: "11155111" },
                { name: "Ethereum Holesky", type: "EVM", chainId: "17000" },
                { name: "Bitcoin Testnet", type: "UTXO", chainId: "N/A" },
                { name: "Bitcoin Signet", type: "UTXO", chainId: "N/A" },
              ].map((network) => (
                <Card key={network.name}>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{network.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {network.type} • Chain ID: {network.chainId}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Threat Model Section */}
          <section id="threat-model" className="mb-12">
            <h2 className="text-xl font-display tracking-tight-display mb-3">Threat Model</h2>
            <p className="text-sm text-muted-foreground mb-4">
              TxnGuard is designed to protect against the following threat categories:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Malicious Smart Contracts",
                  description: "Contracts designed to steal funds, trap users, or exploit approvals.",
                  examples: ["Honeypot tokens", "Reentrancy exploits", "Backdoor functions"]
                },
                {
                  title: "Social Engineering Attacks",
                  description: "Attacks that manipulate users into performing harmful actions.",
                  examples: ["Address poisoning", "Phishing signatures", "Impersonation"]
                },
                {
                  title: "Token Approval Exploits",
                  description: "Malicious use of token approval mechanisms to drain wallets.",
                  examples: ["Unlimited approvals", "Approval to malicious spenders"]
                },
                {
                  title: "Protocol Exploits",
                  description: "Attacks targeting vulnerabilities in DeFi protocols.",
                  examples: ["Flash loan attacks", "Oracle manipulation"]
                }
              ].map((threat) => (
                <Card key={threat.title}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-1">{threat.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{threat.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {threat.examples.map((example) => (
                        <Badge key={example} variant="outline" className="text-[10px]">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Scam Patterns Section */}
          <section id="scam-patterns" className="mb-12">
            <h2 className="text-xl font-display tracking-tight-display mb-3">Scam Pattern Library</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Database of known exploit signatures and attack vectors.
            </p>

            <div className="space-y-3">
              {scamPatterns.map((pattern) => (
                <Card
                  key={pattern.id}
                  className={cn(
                    pattern.severity === "critical" && "border-destructive/30",
                    pattern.severity === "high" && "border-destructive/20",
                    pattern.severity === "medium" && "border-warning/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-medium text-sm">{pattern.name}</h3>
                          <RiskBadge level={pattern.severity} size="sm" showIcon={false} />
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {pattern.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-destructive">{pattern.totalLost}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {pattern.historicalCases.toLocaleString()} cases
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">{pattern.description}</p>

                    <div>
                      <h4 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Indicators
                      </h4>
                      <ul className="space-y-0.5">
                        {pattern.indicators.slice(0, 3).map((indicator, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Limitations Section */}
          <section id="limitations" className="mb-12">
            <h2 className="text-xl font-display tracking-tight-display mb-3">Limitations</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Understanding the boundaries of automated security analysis.
            </p>

            <Card className="border-warning/20 bg-warning/5 mb-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning text-sm mb-1">Important</h4>
                    <p className="text-xs text-muted-foreground">
                      TxnGuard provides risk indicators, not guarantees. A "low risk" score does not 
                      guarantee safety. Always exercise caution and conduct additional research.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {[
                { title: "Zero-Day Exploits", description: "New attack vectors not yet cataloged cannot be detected." },
                { title: "Social Context", description: "Off-chain factors like communication cannot be evaluated." },
                { title: "Complex Interactions", description: "Multi-step transactions may have emergent risks." },
                { title: "Data Freshness", description: "Scores are based on historical data." },
                { title: "False Positives", description: "Legitimate protocols may trigger warnings." }
              ].map((limitation) => (
                <Card key={limitation.title}>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{limitation.title}</h4>
                    <p className="text-xs text-muted-foreground">{limitation.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* API Reference Section */}
          <section id="api" className="mb-12">
            <h2 className="text-xl font-display tracking-tight-display mb-3">API Reference</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Integrate TxnGuard risk analysis into your applications.
            </p>

            <Card className="overflow-hidden">
              <div className="p-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">POST</Badge>
                  <code className="text-xs font-mono">/api/v1/analyze</code>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="text-xs font-medium mb-2">Request Body</h4>
                <pre className="p-3 rounded bg-background overflow-x-auto text-xs font-mono border border-border">
{`{
  "to": "0x742d35Cc6634...",
  "value": "1000000000000000000",
  "data": "0xa9059cbb...",
  "chain_id": 1
}`}
                </pre>

                <h4 className="text-xs font-medium mt-4 mb-2">Response</h4>
                <pre className="p-3 rounded bg-background overflow-x-auto text-xs font-mono border border-border">
{`{
  "risk_level": "medium",
  "reputation_score": 65,
  "risk_factors": [...]
}`}
                </pre>
              </CardContent>
            </Card>

            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Code className="h-3.5 w-3.5" />
                View Full API Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
