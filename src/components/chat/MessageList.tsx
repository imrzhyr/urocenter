import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { AudioPlayer } from "./audio/AudioPlayer";
import { MediaGallery } from "./media/MediaGallery";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Call, CallStatus } from "@/types/call";
import { CallMessage } from "./CallMessage";
import { messageSound } from "@/utils/audioUtils";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callerNames, setCallerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCalls = async () => {
      if (!profile?.id) return;

      const { data: callsData } = await supabase
        .from('calls')
        .select('*')
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('started_at', { ascending: true });

      if (callsData) {
        const formattedCalls: Call[] = callsData.map(call => ({
          ...call,
          status: call.status as CallStatus,
          created_at: call.started_at || call.ended_at || ''
        }));
        setCalls(formattedCalls);
        
        const userIds = new Set(callsData.flatMap(call => [call.caller_id, call.receiver_id]));
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', Array.from(userIds));

        if (profiles) {
          const names: Record<string, string> = {};
          profiles.forEach(p => {
            names[p.id] = p.full_name || 'Unknown User';
          });
          setCallerNames(names);
        }
      }
    };

    fetchCalls();
  }, [profile?.id]);

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

  const getAllItems = () => {
    const items: (Message | Call)[] = [...messages];
    calls.forEach(call => {
      items.push({
        ...call,
        created_at: call.started_at || call.ended_at || ''
      });
    });

    return items.sort((a, b) => {
      const dateA = new Date(a.created_at || '');
      const dateB = new Date(b.created_at || '');
      return dateA.getTime() - dateB.getTime();
    });
  };

  const items = getAllItems();

  const isAdmin = profile?.role === 'admin';

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
      {items.map((item, index) => {
        const currentDate = new Date(item.created_at || '');
        const previousItem = index > 0 ? items[index - 1] : null;
        const previousDate = previousItem ? new Date(previousItem.created_at || '') : null;
        const showDateSeparator = !previousDate || !isSameDay(currentDate, previousDate);

        if ('status' in item && 'caller_id' in item) {
          return (
            <div key={`call-${item.id}`}>
              {showDateSeparator && renderDateSeparator(currentDate)}
              <CallMessage 
                call={item} 
                callerName={callerNames[item.caller_id] || 'Unknown User'}
                receiverName={callerNames[item.receiver_id] || 'Unknown User'}
              />
            </div>
          );
        }

        const message = item as Message;
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
