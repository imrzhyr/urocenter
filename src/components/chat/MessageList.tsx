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
import { messageSound } from "@/utils/audioUtils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  userId: string;
}

export const MessageList = ({ messages, isLoading, userId }: MessageListProps) => {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAdmin = profile?.role === 'admin';

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

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isFromCurrentUser = isAdmin ? lastMessage.is_from_doctor : !lastMessage.is_from_doctor;
      
      if (!isFromCurrentUser) {
        messageSound.play();
      }
    }
  }, [messages, isAdmin]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {messages.map((message, index) => {
        const currentDate = new Date(message.created_at || '');
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const previousDate = previousMessage ? new Date(previousMessage.created_at || '') : null;
        const showDateSeparator = !previousDate || !isSameDay(currentDate, previousDate);
        const isFromCurrentUser = isAdmin ? message.is_from_doctor : !message.is_from_doctor;
        const shouldReverse = language === 'ar';
        
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
          <div key={message.id}>
            {showDateSeparator && renderDateSeparator(currentDate)}
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
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};