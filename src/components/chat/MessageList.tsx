import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { FileText, Play, Pause, Volume2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const handleAudioPlayPause = (audioUrl: string, messageId: string) => {
    if (audioRef.current) {
      if (currentAudioId === messageId) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentAudioId(messageId);
      }
    }
  };

  const renderFilePreview = (message: Message) => {
    if (!message.file_url) return null;

    const fileType = message.file_type?.split('/')[0];

    switch (fileType) {
      case 'image':
        return (
          <div className="mt-2">
            <div className="relative group">
              <img 
                src={message.file_url} 
                alt={message.file_name || 'Attached image'} 
                className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-colors"
                onClick={() => setSelectedMedia(message.file_url)}
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', message.file_url);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="mt-2 relative group">
            <video 
              className="max-w-[200px] rounded-lg cursor-pointer"
              poster={`${message.file_url}#t=0.1`}
              onClick={() => setSelectedMedia(message.file_url)}
            >
              <source src={message.file_url} type={message.file_type} />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-lg">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="mt-2 flex items-center gap-2 bg-gray-100 rounded-full p-2">
            <button
              onClick={() => handleAudioPlayPause(message.file_url!, message.id)}
              className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white"
            >
              {isPlaying && currentAudioId === message.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-1 bg-gray-200 rounded-full">
                <div className="h-full bg-primary rounded-full w-0" />
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {message.duration ? `${Math.floor(message.duration / 60)}:${(message.duration % 60).toString().padStart(2, '0')}` : '0:00'}
            </span>
            <Volume2 className="w-4 h-4 text-gray-500" />
            <audio ref={audioRef} className="hidden" />
          </div>
        );

      default:
        return (
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 text-sm hover:underline transition-colors duration-200 bg-gray-100 p-2 rounded-lg"
          >
            <FileText className="w-4 h-4" />
            <span>{message.file_name || 'Attached file'}</span>
          </a>
        );
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No messages yet
      </div>
    );
  }

  return (
    <>
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

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
          {selectedMedia?.includes('/video/') ? (
            <video controls autoPlay className="w-full h-full rounded-lg">
              <source src={selectedMedia} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={selectedMedia || ''} 
              alt="Full size media" 
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
