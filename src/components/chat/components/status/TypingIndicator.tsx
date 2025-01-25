import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator = React.memo(({ className }: TypingIndicatorProps) => {
  return (
    <div className={cn(
      "px-[10px] py-1",
      className
    )}>
      <div className={cn(
        "inline-flex items-center gap-2",
        "px-[12px] py-[6px]",
        "bg-[#E9E9EB] dark:bg-[#262628]",
        "rounded-[18px] rounded-tl-[5px]",
        "max-w-[280px]"
      )}>
        {/* Animated dots */}
        <div className="flex items-center gap-[4px]">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-[6px] h-[6px]",
                "rounded-full",
                "bg-[#8E8E93] dark:bg-[#98989D]"
              )}
              animate={{
                y: ["0%", "-50%", "0%"]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Text */}
        <span className="text-[11px] text-[#8E8E93] dark:text-[#98989D]">
          Typing...
        </span>
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator'; 