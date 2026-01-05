import { Badge } from "@/components/ui/badge";
import { TestnetNetwork, getNetworkConfig } from "@/lib/testnet/networks";
import { cn } from "@/lib/utils";

interface NetworkBadgeProps {
  network: TestnetNetwork;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function NetworkBadge({ 
  network, 
  size = "sm",
  showIcon = true,
  className 
}: NetworkBadgeProps) {
  const config = getNetworkConfig(network);
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-mono border-border/50",
        size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5",
        className
      )}
      style={{ 
        borderColor: config.color,
        color: config.color,
      }}
    >
      {showIcon && (
        <span 
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: config.color }}
        />
      )}
      {config.shortName}
    </Badge>
  );
}
