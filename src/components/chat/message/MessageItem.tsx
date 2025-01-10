import { Message } from "@/types/profile";
import { AudioPlayer } from "../audio/AudioPlayer";
import { MediaGallery } from "../media/MediaGallery";
import { MessageStatus } from "../MessageStatus";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface MessageItemProps {
  message: Message;
  isFromCurrentUser: boolean;
  shouldReverse: boolean;
}

export const MessageItem = ({ message, isFromCurrentUser, shouldReverse }: MessageItemProps) => {
  const justifyClass = shouldReverse
    ? isFromCurrentUser ? "justify-end" : "justify-start"
    : isFromCurrentUser ? "justify-end" : "justify-start";

  const marginClass = shouldReverse
    ? isFromCurrentUser ? "ml-2" : "mr-2"
    : isFromCurrentUser ? "ml-2" : "mr-2";

  const roundedClass = shouldReverse
    ? isFromCurrentUser
      ? "rounded-l-lg rounded-br-lg"
      : "rounded-r-lg rounded-bl-lg"
    : isFromCurrentUser
      ? "rounded-r-lg rounded-bl-lg"
      : "rounded-l-lg rounded-br-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${justifyClass}`}
    >
      <div
        className={`max-w-[70%] ${
          isFromCurrentUser
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-800"
        } ${roundedClass} ${marginClass} p-3 shadow-sm`}
        style={{ minWidth: '60px' }}
      >
        {message.file_type?.startsWith("audio/") ? (
          <AudioPlayer
            audioUrl={message.file_url || ""}
            messageId={message.id}
            duration={message.duration}
          />
        ) : message.file_type?.startsWith("image/") ||
          message.file_type?.startsWith("video/") ? (
          <MediaGallery
            url={message.file_url || ""}
            type={message.file_type}
            name={message.file_name || ""}
          />
        ) : (
          <p className="break-words text-[14px] leading-[1.4]">{message.content}</p>
        )}
        <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
          <span className="text-xs opacity-60">
            {format(new Date(message.created_at || ''), 'hh:mm a')}
          </span>
          {isFromCurrentUser && <MessageStatus message={message} />}
        </div>
      </div>
    </motion.div>
  );
};