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
        <div key={message.id} className={`message ${message.is_from_doctor ? 'from-doctor' : 'from-user'}`}>
          <p>{message.content}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
