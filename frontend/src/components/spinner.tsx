import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <Loader2 className={`animate-spin ${className || 'h-6 w-6'}`} />
  );
}
