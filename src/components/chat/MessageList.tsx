import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { FileText } from "lucide-react";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <WaveBackground />
      </div>
      <div className="relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_doctor ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                message.is_from_doctor
                  ? 'bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-100'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {renderFilePreview(message)}
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
    </div>
  );
};