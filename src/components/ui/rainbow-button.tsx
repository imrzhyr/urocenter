import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-xl px-8 py-2 font-medium text-white transition-all",
        
        // iOS button styles
        "bg-[#007AFF] dark:bg-[#0A84FF]",
        "hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90",
        "active:bg-[#0051A2] dark:active:bg-[#0A84FF]/80",
        
        // hover and active states
        "hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200",
        
        // focus styles
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        
        // disabled styles
        "disabled:pointer-events-none disabled:opacity-50",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}