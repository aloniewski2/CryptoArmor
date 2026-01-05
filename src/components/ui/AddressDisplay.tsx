import { cn } from "@/lib/utils";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  showCopy?: boolean;
  showExternalLink?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  truncate = true,
  showCopy = true,
  showExternalLink = false,
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-sm", className)}>
      <span className="bg-secondary px-2 py-1 rounded text-muted-foreground">
        {displayAddress}
      </span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          title={copied ? "Copied!" : "Copy address"}
        >
          <Copy className={cn("h-3.5 w-3.5", copied && "text-success")} />
        </button>
      )}
      {showExternalLink && (
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          title="View on Etherscan"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </span>
  );
}
