import { Message } from "@/types/profile";
import { motion, PanInfo } from "framer-motion";
import { MessageContent } from "./MessageContent";
import { ReplyPreview } from "./ReplyPreview";

interface MessageItemProps {
  message: Message;
  fromCurrentUser: boolean;
  dragX: number;
  onDragEnd: (message: Message, info: PanInfo) => void;
}

export const MessageItem = ({ message, fromCurrentUser, dragX, onDragEnd }: MessageItemProps) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => onDragEnd(message, info)}
      className={`flex flex-col ${fromCurrentUser ? "items-end" : "items-start"} w-full`}
    >
      {message.sender_name && (
        <span className={`text-sm mb-1 px-2 ${
          fromCurrentUser ? "text-right text-[#0066CC]" : "text-left text-gray-600 dark:text-gray-300"
        }`}>
          {message.sender_name}
        </span>
      )}
      
      <div className="relative">
        {message.replyTo && <ReplyPreview replyTo={message.replyTo} />}
        <MessageContent message={message} fromCurrentUser={fromCurrentUser} />
      </div>
    </motion.div>
  );
};