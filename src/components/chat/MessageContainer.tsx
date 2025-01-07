import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface MessageContainerProps {
  messages: any[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  header: React.ReactNode;
}

export const MessageContainer = ({
  messages,
  onSendMessage,
  isLoading,
  header
}: MessageContainerProps) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        {header}
      </div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};