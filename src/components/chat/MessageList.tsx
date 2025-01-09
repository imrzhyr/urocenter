import { useEffect, useRef } from "react";
import { Message } from "@/types/profile";

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.is_from_doctor ? 'justify-start' : 'justify-end'}`}
        >
          <div 
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.is_from_doctor 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-primary text-white'
            }`}
          >
            <p className="break-words">{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};