import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { FileText } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  const renderFilePreview = (message: Message) => {
    if (!message.file_url) return null;

    const isImage = message.file_type?.startsWith('image/');

    return (
      <div className="mt-2">
        {isImage ? (
          <div className="relative group">
            <img 
              src={message.file_url} 
              alt={message.file_name || 'Attached image'} 
              className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-colors"
              onClick={() => window.open(message.file_url, '_blank')}
              loading="lazy"
            />
          </div>
        ) : (
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>{message.file_name || 'Attached file'}</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const shouldAlignRight = isAdmin ? message.is_from_doctor : !message.is_from_doctor;

        return (
          <div
            key={message.id}
            className={`flex ${shouldAlignRight ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`relative max-w-[70%] p-3 rounded-lg ${
                shouldAlignRight
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              {renderFilePreview(message)}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[11px] opacity-70">
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
                <MessageStatus message={message} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};