import { useRef } from "react";
import { Message } from "@/types/profile";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { isSameDay } from "date-fns";
import { CallMessage } from "./CallMessage";
import { DateSeparator } from "./message/DateSeparator";
import { MessageItem } from "./message/MessageItem";
import { useCallsData } from "@/hooks/useCallsData";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { calls, callerNames } = useCallsData(profile);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Only scroll to bottom when messages are present
  if (messages.length > 0) {
    scrollToBottom();
  }

  const getAllItems = () => {
    const items: (Message | any)[] = [...messages];
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
              {showDateSeparator && <DateSeparator date={currentDate} />}
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

        return (
          <div key={message.id}>
            {showDateSeparator && <DateSeparator date={currentDate} />}
            <MessageItem
              message={message}
              isFromCurrentUser={isFromCurrentUser}
              shouldReverse={shouldReverse}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};