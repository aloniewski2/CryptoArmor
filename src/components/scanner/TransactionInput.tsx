import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionInputProps {
  onAnalyze: (data: { to: string; value: string; data: string }) => void;
  isLoading?: boolean;
}

export function TransactionInput({ onAnalyze, isLoading }: TransactionInputProps) {
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ to: toAddress, value, data });
  };

  const handleQuickFill = () => {
    setToAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f8dB1E");
    setValue("10.5");
    setData("0xa9059cbb000000000000000000000000dead");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Transaction Parameters</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Enter transaction details for risk analysis
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuickFill}
            className="text-xs text-muted-foreground"
          >
            Load sample
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Recipient Address (to)
            </label>
            <Input
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="font-mono bg-background h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Value (ETH)
              </label>
              <Input
                type="text"
                placeholder="0.0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="font-mono bg-background h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Data (calldata)
              </label>
              <Input
                placeholder="0x..."
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="font-mono bg-background h-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!toAddress || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze Risk
              </>
            )}
          </Button>
        </form>

        <p className="mt-3 text-[10px] text-muted-foreground text-center">
          For demonstration purposes only
        </p>
      </CardContent>
    </Card>
  );
}
