import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { AudioPlayer } from "./audio/AudioPlayer";
import { MediaGallery } from "./media/MediaGallery";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${
            message.is_from_doctor ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[70%] ${
              message.is_from_doctor
                ? "bg-gray-100 rounded-r-lg rounded-bl-lg"
                : "bg-primary text-white rounded-l-lg rounded-br-lg"
            } p-3`}
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
              <p className="break-words">{message.content}</p>
            )}
            <div className="mt-1 text-xs opacity-70 flex justify-end">
              <MessageStatus message={message} />
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};