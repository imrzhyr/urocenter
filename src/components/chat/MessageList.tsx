import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { FileText, Image } from "lucide-react";
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
              onError={(e) => {
                console.error('Image failed to load:', message.file_url);
                e.currentTarget.src = '/placeholder.svg';
              }}
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
    <div className="space-y-4 px-4">
      {messages.map((message) => {
        const shouldAlignRight = isAdmin ? message.is_from_doctor : !message.is_from_doctor;

        return (
          <div
            key={message.id}
            className={`flex ${shouldAlignRight ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`relative max-w-[70%] p-3 rounded-2xl ${
                shouldAlignRight
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              {message.content && (
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              )}
              {renderFilePreview(message)}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className={`text-[11px] ${shouldAlignRight ? 'text-blue-100' : 'text-gray-500'}`}>
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