import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/profile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { DoctorChatHeader } from "./DoctorChatHeader";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data as Message[]);
    };

    fetchMessages();

    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${patientId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const sendMessage = async (content: string) => {
    if (!patientId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        user_id: patientId,
        is_from_doctor: true,
        status: 'sent'
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <DoctorChatHeader patientId={patientId} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};