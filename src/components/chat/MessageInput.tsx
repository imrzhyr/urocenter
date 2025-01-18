import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, FileImage } from "lucide-react";
import { Message } from "@/types/profile";
import { ReplyPreview } from "./reply/ReplyPreview";
import { TextArea } from "./input/TextArea";
import { toast } from "sonner";
import { FileInfo } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

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
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const medicalFileInputRef = useRef<HTMLInputElement>(null);

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Log initial file details
      console.log('Initial file details:', {
        type: file.type,
        size: file.size,
        name: file.name
      });

      // Test 1: Direct file upload
      console.log('Test 1: Attempting direct file upload');
      const fileExt = file.name.split('.').pop();
      const fileName = `test1_${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData1, error: uploadError1 } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError1) {
        console.error('Test 1 upload error:', uploadError1);
      } else {
        console.log('Test 1 successful:', uploadData1);
      }

      // Test 2: FormData approach
      console.log('Test 2: Attempting FormData upload');
      const formData = new FormData();
      formData.append('file', file);
      
      const fileName2 = `test2_${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData2, error: uploadError2 } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName2, formData.get('file') as File, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError2) {
        console.error('Test 2 upload error:', uploadError2);
      } else {
        console.log('Test 2 successful:', uploadData2);
      }

      // Test 3: Binary upload
      console.log('Test 3: Attempting binary upload');
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const fileName3 = `test3_${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData3, error: uploadError3 } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName3, uint8Array, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError3) {
        console.error('Test 3 upload error:', uploadError3);
      } else {
        console.log('Test 3 successful:', uploadData3);
      }

      toast.success('Test uploads completed - check console for results');
      
    } catch (error) {
      console.error('Test upload error:', error);
      toast.error('Test upload failed');
    }

    if (testFileInputRef.current) {
      testFileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Supabase Storage as binary data
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(fileName);

      // Send message with file reference
      const fileInfo = {
        url: publicUrl,
        name: file.name,
        type: file.type
      };

      onSendMessage("", fileInfo);
      
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMedicalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create FormData for medical file
      const formData = new FormData();
      formData.append('file', file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical_attachments')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('medical_attachments')
        .getPublicUrl(fileName);

      const fileInfo = {
        url: publicUrl,
        name: file.name,
        type: file.type
      };

      onSendMessage("", fileInfo);
      if (onCancelReply) {
        onCancelReply();
      }
      toast.success('Medical file uploaded successfully');
    } catch (error) {
      console.error('Medical file upload error:', error);
      toast.error('Failed to upload medical file');
    }

    if (medicalFileInputRef.current) {
      medicalFileInputRef.current.value = '';
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
      <input
        type="file"
        ref={testFileInputRef}
        onChange={handleTestUpload}
        className="hidden"
        accept="image/jpeg"
      />
      <input
        type="file"
        ref={medicalFileInputRef}
        onChange={handleMedicalFileUpload}
        className="hidden"
        accept="image/jpeg"
      />
      {replyingTo && (
        <ReplyPreview
          message={replyingTo}
          onCancel={onCancelReply || (() => {})}
        />
      )}
      <div className="relative flex items-center gap-2 p-4 max-w-7xl mx-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => testFileInputRef.current?.click()}
          disabled={isLoading}
        >
          <FileImage className="h-5 w-5 text-red-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => medicalFileInputRef.current?.click()}
          disabled={isLoading}
        >
          <FileImage className="h-5 w-5" />
        </Button>
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
          disabled={!message.trim() || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};