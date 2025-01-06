import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatMessageProps {
  id: string;
  content: string;
  isFromDoctor: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  status: string;
  userId: string;
}

export const ChatMessage = ({ 
  id,
  content, 
  isFromDoctor, 
  fileUrl, 
  fileName, 
  fileType,
  status,
  userId
}: ChatMessageProps) => {
  const isImage = fileType?.startsWith('image/');
  const isPending = status === 'pending';

  const handleMarkAsResolved = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'resolved' })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success("Chat marked as resolved");
    } catch (error) {
      console.error('Error marking chat as resolved:', error);
      toast.error("Failed to mark chat as resolved");
    }
  };

  return (
    <div className={`flex ${isFromDoctor ? 'justify-start' : 'justify-end'} mb-4`}>
      {isFromDoctor && (
        <Avatar className="mr-2 h-8 w-8">
          <AvatarImage 
            src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" 
            alt="Dr. Ali Kamal" 
          />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-2">
        <div
          className={`rounded-2xl px-4 py-2 max-w-[80%] ${
            isFromDoctor
              ? 'bg-blue-50 text-blue-900'
              : 'bg-blue-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm leading-relaxed">{content}</p>
            {isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </div>
          {fileUrl && (
            <div className="mt-2">
              {isImage ? (
                <img 
                  src={fileUrl} 
                  alt={fileName || 'Attached image'} 
                  className="max-w-full rounded-lg max-h-48 object-cover"
                />
              ) : (
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center gap-2 ${
                    isFromDoctor ? 'text-blue-600' : 'text-white'
                  } hover:underline`}
                >
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm">{fileName || 'Attachment'}</span>
                </a>
              )}
            </div>
          )}
        </div>
        {isFromDoctor && status !== 'resolved' && !isPending && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsResolved}
            className="text-xs"
          >
            Mark as Resolved
          </Button>
        )}
      </div>
    </div>
  );
};