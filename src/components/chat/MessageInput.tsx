import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Image, Mic } from "lucide-react";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";
import { TextArea } from "./input/TextArea";
import { toast } from "sonner";
import { FileInfo } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { VoiceMessageRecorder } from "./voice/VoiceMessageRecorder";

interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: FileInfo) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput = ({
  onSendMessage,
  isLoading,
  replyingTo,
  onCancelReply,
  onTyping
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      console.log('Uploading to Supabase:', {
        fileName,
        contentType: file.type
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, uint8Array, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(fileName);

      console.log('Got public URL:', publicUrl);

      // Get the general file type (image, audio, video, etc.)
      const generalType = file.type.split('/')[0];
      
      const fileInfo = {
        url: publicUrl,
        name: file.name,
        type: file.type,
        file_type: generalType,
        mime_type: file.type
      };

      console.log('Sending message with file:', fileInfo);
      onSendMessage("", fileInfo);
      
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error('Detailed file upload error:', error);
      if (error.error?.message) {
        toast.error(`Upload failed: ${error.error.message}`);
      } else {
        toast.error('Failed to upload file');
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (onCancelReply) {
        onCancelReply();
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,audio/*"
      />
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancel={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2 p-2 max-w-7xl mx-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Image className="h-4 w-4" />
        </Button>
        <VoiceMessageRecorder onRecordingComplete={(fileInfo) => onSendMessage("", fileInfo)} />
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (onTyping) {
              onTyping(e.target.value.length > 0);
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          className="h-8 w-8"
          disabled={!message.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};