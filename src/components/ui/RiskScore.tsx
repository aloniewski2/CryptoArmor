import { cn } from "@/lib/utils";

interface RiskScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Trusted";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Caution";
  return "Elevated Risk";
}

export function RiskScore({ score, size = "md", showLabel = true, className }: RiskScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-700 ease-out", getScoreColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-display font-semibold", textSizes[size], getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}
