import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.is_from_doctor ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.is_from_doctor
                ? 'bg-gray-100 text-gray-900'
                : 'bg-blue-500 text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-xs opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
              <MessageStatus message={message} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};