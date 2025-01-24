import { cn } from "@/lib/utils";

interface ButtonGlowProps {
  className?: string;
}

export function ButtonGlow({ className }: ButtonGlowProps) {
  return (
    <div
      className={cn(
        "absolute bottom-[-40%] left-1/2 z-[-1] h-[40%] w-[80%] -translate-x-1/2",
        "animate-rainbow bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
        "bg-[length:200%] [filter:blur(calc(1.2*1rem))] opacity-75",
        className
      )}
    />
  );
} 