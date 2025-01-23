import { Message } from "@/types/profile";
import { PanInfo, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextMessage } from "./TextMessage";
import { PhotoMessage } from "./PhotoMessage";
import { AudioMessage } from "./AudioMessage";
import { VideoMessage } from "./VideoMessage";
import { ReplyPreview } from "./ReplyPreview";

export interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  onDragEnd?: (message: Message, info: PanInfo) => Promise<void>;
}

export const MessageItem = ({ message, fromCurrentUser, onDragEnd }: MessageItemProps) => {
  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (onDragEnd) {
      await onDragEnd(message, info);
    }
  };

  const renderMessageContent = () => {
    if (message.file_type?.startsWith('image/')) {
      return <PhotoMessage message={message} />;
    }
    if (message.file_type?.startsWith('audio/')) {
      return <AudioMessage message={message} />;
    }
    if (message.file_type?.startsWith('video/')) {
      return <VideoMessage message={message} />;
    }
    return <TextMessage message={message} />;
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={cn(
        "flex w-full",
        fromCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%]",
          "flex flex-col",
          fromCurrentUser ? "items-end" : "items-start"
        )}
      >
        {message.replyTo && (
          <ReplyPreview replyTo={message.replyTo} />
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            fromCurrentUser
              ? "bg-[#007AFF] dark:bg-[#0A84FF] text-white"
              : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50"
          )}
        >
          {renderMessageContent()}
        </div>
      </div>
    </motion.div>
  );
};
