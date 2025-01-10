import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { AudioPlayer } from "./audio/AudioPlayer";
import { MediaGallery } from "./media/MediaGallery";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ar } from "date-fns/locale";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return language === 'ar' ? 'اليوم' : 'Today';
    }
    if (isYesterday(date)) {
      return language === 'ar' ? 'أمس' : 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy', { locale: language === 'ar' ? ar : undefined });
  };

  const renderDateSeparator = (date: Date) => (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-1">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {formatDateSeparator(date)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const currentDate = new Date(message.created_at || '');
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const previousDate = previousMessage ? new Date(previousMessage.created_at || '') : null;
        const showDateSeparator = !previousDate || !isSameDay(currentDate, previousDate);

        return (
          <div key={message.id}>
            {showDateSeparator && renderDateSeparator(currentDate)}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.is_from_doctor ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.is_from_doctor
                    ? "bg-gray-100 dark:bg-gray-800 rounded-r-lg rounded-bl-lg ml-2"
                    : "bg-primary text-white rounded-l-lg rounded-br-lg mr-2"
                } p-3 shadow-sm`}
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
                  <MessageStatus message={message} />
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};