import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md bg-background text-[15px] leading-[22px] placeholder:text-[13px] placeholder:leading-[18px] placeholder:font-light focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

export { ChatInput };