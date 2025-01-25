import * as React from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { MessageInputProps } from '../../types';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const MessageInput = React.memo(({ 
  onSendMessage, 
  isLoading,
  replyingTo,
  onCancelReply,
  onTyping
}: MessageInputProps) => {
  const [message, setMessage] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [showAttachMenu, setShowAttachMenu] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const lastTypingTime = React.useRef<number>(0);
  const TYPING_TIMER_LENGTH = 2000; // Show typing for 2 seconds

  // Handle input height
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Debounced typing indicator
  const debouncedMessage = useDebounce(message, 500);

  React.useEffect(() => {
    const now = Date.now();
    if (debouncedMessage.length > 0) {
      lastTypingTime.current = now;
      onTyping?.(true);
    }

    const timer = setTimeout(() => {
      const timeDiff = now - lastTypingTime.current;
      if (timeDiff >= TYPING_TIMER_LENGTH && onTyping) {
        onTyping(false);
      }
    }, TYPING_TIMER_LENGTH);

    return () => {
      clearTimeout(timer);
      if (debouncedMessage.length === 0) {
        onTyping?.(false);
      }
    };
  }, [debouncedMessage, onTyping]);

  const handleSend = React.useCallback(() => {
    if (message.trim() || isRecording) {
      onSendMessage(message.trim());
      setMessage('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      onCancelReply?.();
      onTyping?.(false);
    }
  }, [message, isRecording, onSendMessage, onCancelReply, onTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Upload file to Supabase storage
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('chat_attachments')
          .upload(fileName, uint8Array, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('chat_attachments')
          .getPublicUrl(fileName);

        // Send message with file
        onSendMessage("", {
          url: publicUrl,
          name: file.name,
          type: file.type
        });
      } catch (error) {
        console.error('File upload error:', error);
        toast.error('Failed to upload file');
      }
    }
  };

  return (
    <motion.div 
      layout
      className={cn(
        "px-2 py-1",
        "bg-white dark:bg-[#1C1C1E]",
        "border-t border-[#3C3C43]/10 dark:border-[#3C3C43]/20"
      )}
    >
      {/* Reply preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-1"
          >
            <div className={cn(
              "flex items-center justify-between",
              "px-3 py-1.5",
              "rounded-2xl",
              "bg-[#F2F2F7] dark:bg-[#2C2C2E]"
            )}>
              <div className="flex-1 truncate">
                <span className="text-xs text-[#8E8E93] dark:text-[#98989D]">
                  Replying to
                </span>
                <p className="text-sm truncate text-black/90 dark:text-white/90">
                  {replyingTo.content}
                </p>
              </div>
              <button
                onClick={() => onCancelReply?.()}
                className="ml-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <svg className="w-4 h-4 text-[#8E8E93]" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className={cn(
        "flex items-end gap-1",
        "min-h-[44px]",
        "bg-[#F2F2F7] dark:bg-[#2C2C2E]",
        "rounded-[22px]",
        "px-2 py-1",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      )}>
        <button
          onClick={handleAttach}
          className={cn(
            "p-2 -ml-1",
            "text-[#007AFF]",
            "rounded-full",
            "hover:bg-black/5 dark:hover:bg-white/5",
            "transition-transform active:scale-90",
            "disabled:opacity-50"
          )}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className={cn(
            "flex-1",
            "max-h-[120px]",
            "bg-transparent",
            "text-[16px]",
            "leading-[1.3125]",
            "py-2 px-1",
            "placeholder:text-[#8E8E93] dark:placeholder:text-[#98989D]",
            "resize-none",
            "focus:outline-none"
          )}
        />

        <AnimatePresence mode="wait">
          {message.trim() ? (
            <motion.button
              key="send"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleSend}
              disabled={isLoading}
              className={cn(
                "p-2 -mr-1",
                "text-[#007AFF]",
                "rounded-full",
                "hover:bg-black/5 dark:hover:bg-white/5",
                "transition-transform active:scale-90",
                "disabled:opacity-50"
              )}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "p-2 -mr-1",
                "text-[#007AFF]",
                "rounded-full",
                "hover:bg-black/5 dark:hover:bg-white/5",
                "transition-transform active:scale-90",
                isRecording && "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*"
      />
    </motion.div>
  );
});

MessageInput.displayName = 'MessageInput'; 