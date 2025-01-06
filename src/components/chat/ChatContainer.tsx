import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

export const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchMessages = async () => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      toast.error('You must be logged in to view messages');
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Error fetching profile');
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Error fetching messages');
        return;
      }

      setMessages(data || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    const userPhone = localStorage.getItem('userPhone');
    
    if (!userPhone) {
      toast.error('You must be logged in to send messages');
      setIsLoading(false);
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Error fetching profile');
        return;
      }

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      let fileData = null;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const messageData = {
        content: message.trim(),
        is_from_doctor: false,
        user_id: profile.id,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type
      };

      const { error: insertError } = await supabase
        .from('messages')
        .insert(messageData);

      if (insertError) {
        console.error('Error inserting message:', insertError);
        toast.error('Failed to send message');
        return;
      }

      setMessage('');
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            content={msg.content}
            isFromDoctor={msg.is_from_doctor}
            fileUrl={msg.file_url}
            fileName={msg.file_name}
            fileType={msg.file_type}
          />
        ))}
      </div>

      <ChatInput
        message={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};