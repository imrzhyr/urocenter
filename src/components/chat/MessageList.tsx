import { Message } from "@/types/profile";
import { MessageStatus } from "./MessageStatus";
import { FileText } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PatientInfoCard } from "./PatientInfoCard";
import { AudioPlayer } from "./audio/AudioPlayer";
import { MediaGallery } from "./media/MediaGallery";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const patientId = messages[0]?.user_id;

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
          <div className="mt-2 relative group cursor-pointer" onClick={() => setSelectedMedia(message.file_url!)}>
            <video 
              className="max-w-[200px] rounded-lg"
              poster={`${message.file_url}#t=0.1`}
            >
              <source src={message.file_url} type={message.file_type} />
            </video>
          </div>
        );

      case 'audio':
        return (
          <AudioPlayer 
            audioUrl={message.file_url} 
            messageId={message.id} 
            duration={message.duration}
          />
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

  return (
    <>
      <div className="space-y-4 px-4 w-full">
        {messages.map((message) => {
          const isFromMe = isAdmin ? message.is_from_doctor : !message.is_from_doctor;
          const shouldShowStatus = isFromMe;

          return (
            <div
              key={message.id}
              className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} animate-fade-in w-full`}
            >
              <div
                className={`relative max-w-[70%] p-3 rounded-2xl ${
                  isFromMe
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                )}
                {renderFilePreview(message)}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-[11px] ${isFromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                  {shouldShowStatus && <MessageStatus message={message} />}
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

      <MediaGallery 
        open={showMediaGallery} 
        onOpenChange={setShowMediaGallery}
        messages={messages}
        onSelectMedia={(url) => {
          setSelectedMedia(url);
          setShowMediaGallery(false);
        }}
      />

      <Dialog open={showPatientInfo} onOpenChange={setShowPatientInfo}>
        <DialogContent>
          <PatientInfoCard 
            complaint={messages[0]?.content || ''}
            reportsCount={0}
            fullName=""
            age=""
            gender=""
            patientId={patientId || ''}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};