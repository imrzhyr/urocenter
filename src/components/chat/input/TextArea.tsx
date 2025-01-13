import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isLoading?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, isLoading, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [props.value]);

    return (
      <textarea
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          textareaRef.current = node;
        }}
        className={cn(
          "flex-1 min-h-[40px] max-h-[120px] resize-none bg-gray-50 dark:bg-gray-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2.5 px-4 overflow-y-auto",
          className
        )}
        style={{
          transition: 'height 0.1s ease-out'
        }}
        disabled={isLoading}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';